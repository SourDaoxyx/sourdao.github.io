"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, TrendingUp, Clock, Handshake } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  generateDemoLeaderboard,
  type LeaderboardEntry,
} from "@/lib/crust-score";

type SortKey = "score" | "holding" | "days" | "handshakes";

const TABS: { key: SortKey; label: string; icon: React.ReactNode }[] = [
  { key: "score", label: "Crust Score", icon: <Trophy className="w-3.5 h-3.5" /> },
  { key: "holding", label: "Holding", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { key: "days", label: "Diamond Hands", icon: <Clock className="w-3.5 h-3.5" /> },
  { key: "handshakes", label: "Bakes", icon: <Handshake className="w-3.5 h-3.5" /> },
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

  const sortValue = (() => {
    switch (sortKey) {
      case "holding": return formatBalance(entry.balance);
      case "days": return `${entry.daysFermenting}d`;
      case "handshakes": return String(entry.handshakesCompleted);
      default: return String(entry.crustScore);
    }
  })();

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

        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full overflow-hidden border ${tier.borderColor} shrink-0`}>
          <Image src={entry.avatar} alt={entry.displayName} width={36} height={36} className="w-full h-full object-cover" />
        </div>

        {/* Name & Address */}
        <div className="min-w-0 flex-1">
          <p className="text-cream text-sm font-medium truncate">{entry.displayName}</p>
          <p className="text-cream/25 text-[10px] font-mono">{shortenAddress(entry.address)}</p>
        </div>

        {/* Tier badge */}
        <div className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full ${tier.bgColor} border ${tier.borderColor}`}>
          <span className="text-xs">{tier.emoji}</span>
          <span className={`text-[9px] font-bold tracking-wider ${tier.textColor}`}>{tier.name}</span>
        </div>

        {/* Badges (top 3) */}
        <div className="hidden md:flex gap-0.5">
          {entry.badges.slice(0, 3).map((b) => (
            <span key={b.id} className="text-xs" title={b.name}>{b.emoji}</span>
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

function LeaderboardClient() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<SortKey>("score");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEntries(generateDemoLeaderboard());
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const sortedEntries = useMemo(() => {
    const sorted = [...entries];
    switch (activeTab) {
      case "holding":
        sorted.sort((a, b) => b.balance - a.balance);
        break;
      case "days":
        sorted.sort((a, b) => b.daysFermenting - a.daysFermenting);
        break;
      case "handshakes":
        sorted.sort((a, b) => b.handshakesCompleted - a.handshakesCompleted);
        break;
      default:
        sorted.sort((a, b) => b.crustScore - a.crustScore);
    }
    return sorted;
  }, [entries, activeTab]);

  // Tier distribution stats
  const tierStats = useMemo(() => {
    const stats = { Eternal: 0, Golden: 0, Rising: 0, Fresh: 0 };
    entries.forEach((e) => {
      if (e.tier.name === "Eternal Starter") stats.Eternal++;
      else if (e.tier.name === "Golden Crust") stats.Golden++;
      else if (e.tier.name === "Rising Dough") stats.Rising++;
      else stats.Fresh++;
    });
    return stats;
  }, [entries]);

  return (
    <section className="min-h-[80vh] px-4 py-20 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-gold/5 to-transparent blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Back */}
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
            The most trusted Bakers in the SOUR ecosystem, ranked by Crust Score.
          </p>
        </motion.div>

        {/* Tier Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Eternal", count: tierStats.Eternal, color: "text-purple-400 border-purple-500/20 bg-purple-500/5" },
            { label: "Golden", count: tierStats.Golden, color: "text-gold border-gold/20 bg-gold/5" },
            { label: "Rising", count: tierStats.Rising, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
            { label: "Fresh", count: tierStats.Fresh, color: "text-cream/40 border-cream/10 bg-cream/[0.02]" },
          ].map((t) => (
            <div key={t.label} className={`p-3 rounded-xl border ${t.color} text-center`}>
              <p className="font-bold text-lg font-mono">{t.count}</p>
              <p className="text-[10px] uppercase tracking-wider opacity-60">{t.label}</p>
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
            <p className="text-cream/40 text-sm">Loading rankings...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedEntries.map((entry, i) => (
              <LeaderboardRow key={entry.address} entry={entry} rank={i + 1} sortKey={activeTab} />
            ))}
          </div>
        )}

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <p className="text-cream/20 text-xs">
            Rankings update in real-time once the Handshake protocol and on-chain indexer are live.
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
