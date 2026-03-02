"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, TrendingUp, Clock, Handshake, RefreshCw, Copy, Check } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  calculateCrustScore,
  CRUST_TIERS,
  type LeaderboardEntry,
  type CrustScoreInput,
} from "@/lib/crust-score";
import { getTopHolders, getDaysInProtocol } from "@/lib/solana";

type SortKey = "score" | "holding" | "days" | "handshakes";

const TABS: { key: SortKey; label: string; icon: React.ReactNode }[] = [
  { key: "score", label: "Crust Score", icon: <Trophy className="w-3.5 h-3.5" /> },
  { key: "holding", label: "Holding", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { key: "days", label: "Time", icon: <Clock className="w-3.5 h-3.5" /> },
  { key: "handshakes", label: "Deals", icon: <Handshake className="w-3.5 h-3.5" /> },
];

function formatBalance(balance: number): string {
  if (balance >= 1_000_000) return (balance / 1_000_000).toFixed(2) + "M";
  if (balance >= 1_000) return (balance / 1_000).toFixed(1) + "K";
  return balance.toLocaleString();
}

function shortenAddress(addr: string): string {
  if (addr.length < 10) return addr;
  return addr.slice(0, 4) + "..." + addr.slice(-4);
}

function getRankBadge(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

function LeaderboardRow({ entry, rank, sortKey }: { entry: LeaderboardEntry; rank: number; sortKey: SortKey }) {
  const { tier } = entry;
  const [copied, setCopied] = useState(false);

  const sortValue = (() => {
    switch (sortKey) {
      case "holding": return formatBalance(entry.balance);
      case "days": return entry.daysInProtocol > 0 ? `${entry.daysInProtocol}d` : "—";
      case "handshakes": return String(entry.handshakesCompleted);
      default: return String(entry.crustScore);
    }
  })();

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(entry.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.03 }}
    >
      <Link
        href={`/crust/profile?address=${entry.address}`}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
          rank <= 3
            ? `${tier.bgColor} ${tier.borderColor} hover:bg-gold/10`
            : "bg-cream/[0.02] border-cream/5 hover:bg-cream/[0.04]"
        }`}
      >
        {/* Rank */}
        <div className="w-10 text-center shrink-0">
          {rank <= 3 ? (
            <span className="text-xl">{getRankBadge(rank)}</span>
          ) : (
            <span className="text-cream/30 text-sm font-mono">{rank}</span>
          )}
        </div>

        {/* Tier emoji */}
        <div className={`w-9 h-9 rounded-full overflow-hidden border ${tier.borderColor} shrink-0 flex items-center justify-center bg-cream/5`}>
          <span className="text-lg">{tier.emoji}</span>
        </div>

        {/* Address + Copy */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-cream text-sm font-medium font-mono">{shortenAddress(entry.address)}</p>
            <button onClick={handleCopy} className="text-cream/15 hover:text-cream/40 transition-colors">
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <p className="text-cream/25 text-[10px]">{formatBalance(entry.balance)} $SOUR</p>
        </div>

        {/* Tier badge */}
        <div className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full ${tier.bgColor} border ${tier.borderColor}`}>
          <span className="text-xs">{tier.emoji}</span>
          <span className={`text-[9px] font-bold tracking-wider ${tier.textColor}`}>{tier.name}</span>
        </div>

        {/* Grade */}
        <div className="hidden md:block">
          <span className={`text-sm font-bold ${rank <= 3 ? tier.textColor : "text-cream/50"}`}>
            {entry.overallGrade}
          </span>
        </div>

        {/* Stamps (top 3) */}
        <div className="hidden md:flex gap-0.5">
          {entry.stamps.slice(0, 3).map((s) => (
            <span key={s.id} className="text-xs" title={s.name}>{s.emoji}</span>
          ))}
        </div>

        {/* Sort value */}
        <div className="text-right shrink-0 w-16">
          <p className={`font-bold text-sm font-mono ${rank <= 3 ? tier.textColor : "text-cream/70"}`}>
            {sortValue}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// New cache key to invalidate old v1 data
const CACHE_KEY = "sour_leaderboard_v2";
const CACHE_TTL_MS = 5 * 60 * 1000;

interface LeaderboardCache {
  entries: LeaderboardEntry[];
  timestamp: number;
}

function loadCache(): LeaderboardCache | null {
  try {
    // Clear old v1 cache
    localStorage.removeItem("sour_leaderboard_v1");
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data: LeaderboardCache = JSON.parse(raw);
    if (Date.now() - data.timestamp > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveCache(entries: LeaderboardEntry[]) {
  try {
    const data: LeaderboardCache = { entries, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch { /* Storage full or unavailable */ }
}

function LeaderboardClient() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<SortKey>("score");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daysLoaded, setDaysLoaded] = useState(0);
  const [cacheAge, setCacheAge] = useState<number | null>(null);
  const totalEntries = entries.length;

  const buildEntry = useCallback(
    (address: string, balance: number, daysInProtocol: number): LeaderboardEntry => {
      const input: CrustScoreInput = {
        balance,
        daysInProtocol,
        loyaltyStreak: daysInProtocol,
        handshakesCompleted: 0,
        disputesLost: 0,
        handshakesCancelled: 0,
        handshakesTotal: 0,
      };
      const score = calculateCrustScore(input);
      return {
        address,
        displayName: address.slice(0, 4) + "..." + address.slice(-4),
        crustScore: score.total,
        tier: score.tier,
        overallGrade: score.overallGrade,
        daysInProtocol,
        loyaltyStreak: daysInProtocol,
        handshakesCompleted: 0,
        balance,
        stamps: score.stamps,
        categories: score.categories,
      };
    },
    []
  );

  const fetchLeaderboard = useCallback(async (force = false) => {
    setError(null);
    setDaysLoaded(0);

    if (!force) {
      const cached = loadCache();
      if (cached) {
        setEntries(cached.entries);
        setCacheAge(Math.round((Date.now() - cached.timestamp) / 60000));
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setCacheAge(null);

    try {
      const holders = await getTopHolders(20);

      if (holders.length === 0) {
        setEntries([]);
        setLoading(false);
        return;
      }

      const initial = holders.map((h) => buildEntry(h.address, h.balance, 0));
      setEntries(initial);
      setLoading(false);

      for (let i = 0; i < holders.length; i++) {
        try {
          const days = await getDaysInProtocol(holders[i].address);
          if (days > 0) {
            setEntries((prev) =>
              prev.map((e) =>
                e.address === holders[i].address ? buildEntry(e.address, e.balance, days) : e
              )
            );
          }
        } catch { /* Skip this holder */ }
        setDaysLoaded(i + 1);
      }
      setEntries((final) => {
        saveCache(final);
        return final;
      });
    } catch (err) {
      console.error("[SOUR] Leaderboard fetch error:", err);
      setError("Failed to load leaderboard data. Please try again.");
      setLoading(false);
    }
  }, [buildEntry]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const sortedEntries = useMemo(() => {
    const sorted = [...entries];
    switch (activeTab) {
      case "holding":
        sorted.sort((a, b) => b.balance - a.balance);
        break;
      case "days":
        sorted.sort((a, b) => b.daysInProtocol - a.daysInProtocol);
        break;
      case "handshakes":
        sorted.sort((a, b) => b.handshakesCompleted - a.handshakesCompleted);
        break;
      default:
        sorted.sort((a, b) => b.crustScore - a.crustScore);
    }
    return sorted;
  }, [entries, activeTab]);

  // Tier distribution stats (5 tiers)
  const tierStats = useMemo(() => {
    const stats: Record<string, number> = {};
    for (const t of CRUST_TIERS) stats[t.name] = 0;
    entries.forEach((e) => { stats[e.tier.name] = (stats[e.tier.name] || 0) + 1; });
    return stats;
  }, [entries]);

  return (
    <section className="min-h-[80vh] px-4 py-20 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-gold/5 to-transparent blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        <Link
          href="/crust"
          className="inline-flex items-center gap-2 text-cream/30 text-sm hover:text-cream/50 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crust
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-3">
            🏆 Leaderboard
          </h1>
          <p className="text-cream/40 text-sm max-w-md mx-auto">
            The most trusted citizens in the SOUR ecosystem, ranked by Civilization Score.
          </p>
          {cacheAge !== null && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-cream/25 text-xs">Cached {cacheAge === 0 ? "just now" : `${cacheAge}m ago`}</span>
              <button
                onClick={() => fetchLeaderboard(true)}
                className="flex items-center gap-1 text-gold/40 hover:text-gold/70 text-xs transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>
          )}
        </motion.div>

        {/* Tier Distribution — 5 tiers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-5 gap-2 mb-8"
        >
          {CRUST_TIERS.map((t) => (
            <div key={t.name} className={`p-2.5 rounded-xl border ${t.borderColor} ${t.bgColor} text-center`}>
              <p className={`font-bold text-lg font-mono ${t.textColor}`}>{tierStats[t.name] || 0}</p>
              <p className={`text-[9px] uppercase tracking-wider ${t.textColor} opacity-60`}>{t.emoji} {t.name}</p>
            </div>
          ))}
        </motion.div>

        {/* Sort Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? "bg-gold/15 border border-gold/25 text-gold"
                  : "bg-cream/[0.03] border border-cream/5 text-cream/40 hover:text-cream/60"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-cream/40 text-sm">Fetching on-chain data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <p className="text-red-400/70 text-sm">{error}</p>
            <button
              onClick={() => fetchLeaderboard(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm hover:bg-gold/15 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <p className="text-cream/30 text-sm">No holders found yet.</p>
          </div>
        ) : (
          <>
            {daysLoaded < totalEntries && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mb-4 px-3 py-2 rounded-lg bg-gold/5 border border-gold/10"
              >
                <div className="w-3 h-3 border border-gold/30 border-t-gold rounded-full animate-spin" />
                <p className="text-cream/30 text-xs">
                  Loading holder history... {daysLoaded}/{totalEntries}
                </p>
              </motion.div>
            )}
            <div className="space-y-2">
              {sortedEntries.map((entry, i) => (
                <LeaderboardRow key={entry.address} entry={entry} rank={i + 1} sortKey={activeTab} />
              ))}
            </div>
          </>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-cream/20 text-xs">
            Live on-chain data · Scores {300}–{850} · Trade & Community categories unlock soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-black text-cream">
      <Navbar />
      <LeaderboardClient />
      <Footer />
    </main>
  );
}
