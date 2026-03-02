"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  Wallet, Loader2, LogOut, Fingerprint, Trophy, User, FlaskConical, ExternalLink,
  ChevronDown, Target, ArrowRight, Info, Lock,
} from "lucide-react";
import Link from "next/link";
import { getSourHolderInfo, type SourHolderInfo } from "@/lib/solana";
import {
  calculateCrustScore,
  CRUST_TIERS,
  BASE_SCORE,
  MAX_SCORE,
  type CrustScoreBreakdown,
  type CrustScoreInput,
  type CategoryScore,
} from "@/lib/crust-score";
import { IS_TOKEN_LAUNCHED } from "@/lib/constants";
import CivilizationCard from "./CivilizationCard";
import StampWall from "./StampWall";
import EditProfile from "./EditProfile";
import ShareCard from "./ShareCard";

// ---------------------------------------------------------------------------
// Citizen Profile (localStorage persistence)
// ---------------------------------------------------------------------------

interface CitizenProfile {
  name: string;
  bio: string;
  avatar: string;
}

function loadProfile(wallet: string): CitizenProfile {
  if (typeof window === "undefined") return { name: "", bio: "", avatar: "/sour-logo.png" };
  try {
    const stored = localStorage.getItem(`sour-citizen-${wallet}`);
    // Migration: also check old key
    const legacy = !stored ? localStorage.getItem(`sour-baker-${wallet}`) : null;
    if (stored) return JSON.parse(stored);
    if (legacy) return JSON.parse(legacy);
  } catch { /* ignore */ }
  return { name: "", bio: "", avatar: "/sour-logo.png" };
}

function saveProfile(wallet: string, profile: CitizenProfile) {
  try {
    localStorage.setItem(`sour-citizen-${wallet}`, JSON.stringify(profile));
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// Score Breakdown Detail — 6 categories with grades
// ---------------------------------------------------------------------------

function ScoreBreakdownDetail({ breakdown }: { breakdown: CrustScoreBreakdown }) {
  const [open, setOpen] = useState(false);

  const tips: Record<string, { tip: string; improve: string[] }> = {
    holding: {
      tip: "Proportional to your $SOUR balance relative to total supply. Logarithmic scale favors early holders.",
      improve: [
        "Hold more $SOUR to increase this score",
        "Top 1% of supply → maximum grade",
      ],
    },
    time: {
      tip: "How long you've been in the SOUR ecosystem since your first transaction.",
      improve: [
        "7 days → 15% of max",
        "30 days → 40% of max",
        "365 days → full score",
      ],
    },
    loyalty: {
      tip: "Consecutive days holding without selling. Selling resets your streak to zero.",
      improve: [
        "Hold 7 days → 💎 Diamond 7 stamp",
        "Hold 30 days → 💎 Diamond 30 stamp",
        "Hold 365 days → max loyalty score",
      ],
    },
    trade: {
      tip: "Based on Handshake deals completed, disputes, and deal quality.",
      improve: [
        "Complete your first Handshake deal",
        "Reach 5 deals for ⭐ 5-Star Baker stamp",
        "20+ deals with 0 disputes → 🏆 Perfect Record",
      ],
    },
    community: {
      tip: "DAO participation and governance activity. Coming soon.",
      improve: ["Will unlock when SOUR DAO launches"],
    },
    network: {
      tip: "Peer endorsements and trust network. Coming in v4.",
      improve: ["Will unlock in SOUR Protocol v4"],
    },
  };

  return (
    <div className="rounded-xl border border-cream/10 bg-black/30 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-gold/60" />
          <span className="text-cream/60 text-xs font-medium">Score Breakdown &amp; Tips</span>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-cream/30" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              {breakdown.categories.map((cat: CategoryScore) => {
                const catTips = tips[cat.key] || { tip: "", improve: [] };
                return (
                  <div key={cat.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-cream/70 text-xs font-medium">{cat.label}</span>
                        {cat.locked && (
                          <span className="flex items-center gap-0.5 text-cream/25 text-[10px]">
                            <Lock className="w-2.5 h-2.5" /> {cat.lockReason}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${cat.locked ? "text-cream/30" : cat.gradeColor}`}>
                          {cat.locked ? "—" : cat.grade}
                        </span>
                        <span className="text-cream text-xs font-mono font-bold">
                          {cat.score}<span className="text-cream/30">/{cat.max}</span>
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-cream/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.max > 0 ? (cat.score / cat.max) * 100 : 0}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          cat.locked
                            ? "bg-cream/10"
                            : "bg-gradient-to-r from-gold to-amber-500"
                        }`}
                      />
                    </div>
                    <p className="text-cream/30 text-[10px] italic">{catTips.tip}</p>
                    <div className="space-y-1 pl-2 border-l border-gold/10">
                      {catTips.improve.map((tip, j) => (
                        <p key={j} className="text-cream/40 text-[10px] flex items-start gap-1.5">
                          <Target className="w-2.5 h-2.5 text-gold/40 mt-0.5 shrink-0" />
                          {tip}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 border-t border-cream/5 text-center">
                <p className="text-cream/25 text-[10px]">
                  Total: {breakdown.total}/{MAX_SCORE} · Grade: {breakdown.overallGrade} · Tier: {breakdown.tier.emoji} {breakdown.tier.name}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main CrustApp
// ---------------------------------------------------------------------------

export default function CrustApp() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [holderInfo, setHolderInfo] = useState<SourHolderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CitizenProfile>({ name: "", bio: "", avatar: "/sour-logo.png" });
  const [showStamps, setShowStamps] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load on-chain data
  useEffect(() => {
    if (!publicKey) {
      setHolderInfo(null);
      return;
    }

    setProfile(loadProfile(publicKey.toBase58()));

    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const info = await Promise.race([
          getSourHolderInfo(publicKey),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 15_000)
          ),
        ]);
        if (!cancelled) setHolderInfo(info);
      } catch (err) {
        console.error("[SOUR] Failed to fetch holder info:", err);
        if (!cancelled) {
          const isTimeout = err instanceof Error && err.message === "timeout";
          setError(
            isTimeout
              ? "RPC request timed out. Public Solana RPC can be slow — please try again."
              : "Failed to read on-chain data. Please try again."
          );
          setHolderInfo({ balance: 0, firstTxDate: null, daysInProtocol: 0 });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [publicKey]);

  const handleSaveProfile = useCallback(
    (name: string, bio: string, avatar: string) => {
      const newProfile = { name, bio, avatar };
      setProfile(newProfile);
      if (publicKey) saveProfile(publicKey.toBase58(), newProfile);
    },
    [publicKey]
  );

  // Calculate Crust Score from on-chain data
  const scoreBreakdown: CrustScoreBreakdown | null = useMemo(() => {
    if (!holderInfo) return null;
    const input: CrustScoreInput = {
      balance: holderInfo.balance,
      daysInProtocol: holderInfo.daysInProtocol,
      loyaltyStreak: holderInfo.daysInProtocol, // Same as daysInProtocol for now (no sell detection)
      handshakesCompleted: 0,
      disputesLost: 0,
      handshakesCancelled: 0,
      handshakesTotal: 0,
    };
    return calculateCrustScore(input);
  }, [holderInfo]);

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-gold/5 to-transparent blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6">
            <Fingerprint className="w-4 h-4" />
            CIVILIZATION ID
          </motion.span>

          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-3">
            Your On-Chain Identity
          </h1>

          <p className="text-cream/50 text-sm font-inter max-w-md mx-auto mb-3">
            Your Civilization ID is calculated from real on-chain data — what you hold, how long you hold, and what you build.
          </p>

          <p className="text-cream/35 text-xs font-inter max-w-lg mx-auto leading-relaxed">
            A soulbound reputation that cannot be sold, transferred, or erased.
            Scored {BASE_SCORE}–{MAX_SCORE}, graded A+ through F across 6 categories.
            Your score travels across every protocol SOUR deploys to.
          </p>
        </motion.div>

        {/* Crust Tiers — 5 tiers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8"
        >
          {CRUST_TIERS.slice().reverse().map((t) => (
            <div key={t.name} className={`rounded-xl border ${t.borderColor} ${t.bgColor} p-3 text-center`}>
              <p className={`font-cinzel text-xs font-bold mb-1 ${t.textColor}`}>{t.emoji} {t.name}</p>
              <p className="text-cream/40 text-[10px]">{t.minScore}+</p>
            </div>
          ))}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex justify-center gap-3 mb-8"
        >
          <Link
            href="/crust/leaderboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/8 border border-gold/15 text-gold/70 text-xs font-medium hover:bg-gold/12 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            Leaderboard
          </Link>
          {connected && publicKey && (
            <Link
              href={`/crust/profile?address=${publicKey.toBase58()}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream/5 border border-cream/10 text-cream/50 text-xs font-medium hover:bg-cream/8 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              Public Profile
            </Link>
          )}
        </motion.div>

        {/* ============================================================= */}
        {/* NOT CONNECTED — Full Info Section                              */}
        {/* ============================================================= */}
        {!connected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* What is Civilization ID? */}
            <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 via-black/40 to-amber-500/5 p-6 md:p-8">
              <h2 className="font-cinzel text-lg font-bold text-cream mb-3">What is Civilization ID?</h2>
              <p className="text-cream/55 text-sm leading-relaxed mb-5">
                Your Civilization ID is a <span className="text-gold font-medium">soulbound on-chain reputation</span>.
                It cannot be bought, sold, or transferred. Scored {BASE_SCORE}–{MAX_SCORE} like a financial trust score,
                it&apos;s built from what you actually do on-chain.
              </p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "HLD", title: "Holding", weight: "15%", desc: "Token balance vs supply" },
                  { label: "TIM", title: "Time", weight: "15%", desc: "Days in the ecosystem" },
                  { label: "LOY", title: "Loyalty", weight: "15%", desc: "Consecutive hold streak" },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-gold/15 bg-black/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-cinzel text-sm font-bold text-cream">{item.title}</span>
                      <span className="ml-auto text-gold/60 text-xs font-mono">{item.weight}</span>
                    </div>
                    <p className="text-cream/40 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-3 gap-3 mt-3">
                {[
                  { title: "Trade", weight: "25%", desc: "Handshake deals", locked: true },
                  { title: "Community", weight: "15%", desc: "DAO participation", locked: true },
                  { title: "Network", weight: "15%", desc: "Peer endorsements", locked: true },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border border-cream/8 bg-black/20 p-4 opacity-60">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-3.5 h-3.5 text-cream/25" />
                      <span className="font-cinzel text-sm font-bold text-cream/50">{item.title}</span>
                      <span className="ml-auto text-cream/25 text-xs font-mono">{item.weight}</span>
                    </div>
                    <p className="text-cream/25 text-xs leading-relaxed">{item.desc} — coming soon</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tier Preview */}
            <div className="rounded-2xl border border-cream/10 bg-black/30 p-6">
              <h2 className="font-cinzel text-lg font-bold text-cream mb-4">5 Tiers to Climb</h2>
              <div className="space-y-3">
                {CRUST_TIERS.slice().reverse().map((t, i) => (
                  <div key={t.name} className={`flex items-center gap-4 rounded-xl border ${t.borderColor} ${t.bgColor} p-4`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${t.bgColor} border ${t.borderColor}`}>
                      {t.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-cinzel text-sm font-bold ${t.textColor}`}>{t.name}</span>
                        <span className="text-cream/30 text-xs">{t.minScore}+</span>
                      </div>
                      <p className="text-cream/40 text-xs">
                        {i === 0 ? "Just connected — buy $SOUR to begin" :
                         i === 1 ? "Active holder with growing reputation" :
                         i === 2 ? "Trusted participant with strong history" :
                         i === 3 ? "Established builder with proven record" :
                         "Sovereign citizen — maximum prestige"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Simulator */}
            <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6">
              <h2 className="font-cinzel text-lg font-bold text-cream mb-3">Score Simulator</h2>
              <p className="text-cream/50 text-xs mb-4">See what your Civilization Score would look like:</p>
              <div className="space-y-3">
                {[
                  { label: "Hold 10K $SOUR for 7 days", score: "~350", tier: "Unverified 🪪" },
                  { label: "Hold 100K $SOUR for 30 days", score: "~415", tier: "Verified 🥉" },
                  { label: "Hold 1M $SOUR for 90 days", score: "~490", tier: "Trusted 🥈" },
                  { label: "Hold 10M $SOUR for 365 days", score: "~549", tier: "Sovereign 💎" },
                ].map((sim, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border border-cream/8 bg-black/20 p-3">
                    <p className="text-cream/60 text-xs flex-1">{sim.label}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-gold font-mono text-sm font-bold">{sim.score}</span>
                      <span className="text-cream/40 text-[10px]">{sim.tier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect CTA */}
            <div className="text-center space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVisible(true)}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl overflow-hidden text-lg font-bold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gold via-amber to-gold" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />
                <span className="relative text-black flex items-center gap-3">
                  <Wallet className="w-5 h-5" />
                  Connect Wallet &amp; See Your Score
                </span>
              </motion.button>

              <p className="text-cream/30 text-xs">Supports Phantom &amp; Solflare</p>

              <div className="p-4 rounded-xl border border-cream/8 bg-cream/[0.02] max-w-sm mx-auto">
                <p className="text-cream/40 text-xs mb-3">
                  Don&apos;t have a wallet? Install one first:
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="https://phantom.app/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/20 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Phantom
                  </a>
                  <a
                    href="https://solflare.com/download"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium hover:bg-orange-500/20 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Solflare
                  </a>
                </div>
                <p className="text-cream/25 text-[10px] mt-3 leading-relaxed">
                  Install the browser extension → refresh this page → click &quot;Connect Wallet&quot; → approve in wallet popup
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ============================================================= */}
        {/* LOADING                                                        */}
        {/* ============================================================= */}
        {connected && loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-10"
          >
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-cream/50 text-sm">Reading the blockchain...</p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5"
          >
            <p className="text-orange-400/80 text-xs mb-2">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setHolderInfo(null);
                setLoading(true);
                if (publicKey) {
                  getSourHolderInfo(publicKey)
                    .then((info) => setHolderInfo(info))
                    .catch(() => setError("Still failing. Try again later."))
                    .finally(() => setLoading(false));
                }
              }}
              className="text-gold text-xs underline underline-offset-2 hover:text-amber-400 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* ============================================================= */}
        {/* CONNECTED — Civilization Card + Details                        */}
        {/* ============================================================= */}
        {connected && publicKey && holderInfo && scoreBreakdown && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Disconnect */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-cream/30 text-xs hover:text-cream/50 hover:bg-cream/5 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Disconnect
              </motion.button>
            </div>

            {/* Pre-Launch Banner */}
            {!IS_TOKEN_LAUNCHED && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-gold/20 bg-gold/5 p-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FlaskConical className="w-5 h-5 text-gold" />
                  <span className="font-cinzel text-sm font-bold text-gold">Pre-Launch Preview</span>
                </div>
                <p className="text-cream/50 text-xs leading-relaxed mb-3">
                  Your jar is connected! $SOUR token has not launched yet.
                  Once the token is live, your Civilization Score will be calculated from real on-chain data.
                </p>
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-cream/10">
                  <Wallet className="w-3.5 h-3.5 text-gold/60" />
                  <span className="text-cream/40 text-[11px] font-mono tracking-tight">
                    {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                  </span>
                  <span className="text-emerald-400/70 text-[10px] ml-1">● Connected</span>
                </div>
              </motion.div>
            )}

            {/* ====== Civilization Card ====== */}
            <CivilizationCard
              cardRef={cardRef}
              walletAddress={publicKey.toBase58()}
              scoreBreakdown={scoreBreakdown}
              sinceDate={holderInfo.firstTxDate}
            />

            {/* Tier Progression */}
            {scoreBreakdown.tier.name !== "Sovereign" && (() => {
              const currentScore = scoreBreakdown.total;
              const nextTier = CRUST_TIERS.slice().reverse().find(t => t.minScore > currentScore);
              if (!nextTier) return null;
              const prevMin = CRUST_TIERS.slice().reverse().find(t => t.minScore <= currentScore)?.minScore || 0;
              const progress = ((currentScore - prevMin) / (nextTier.minScore - prevMin)) * 100;
              return (
                <div className="p-4 rounded-xl border border-cream/10 bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cream/40 text-[10px] uppercase tracking-wider">Next Tier</span>
                    <span className={`text-xs font-bold ${nextTier.textColor}`}>{nextTier.emoji} {nextTier.name}</span>
                  </div>
                  <div className="h-2 rounded-full bg-cream/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500"
                    />
                  </div>
                  <p className="text-cream/30 text-[10px] mt-1.5">
                    {nextTier.minScore - currentScore} more points needed
                  </p>
                </div>
              );
            })()}

            {/* Score Breakdown Detail */}
            <ScoreBreakdownDetail breakdown={scoreBreakdown} />

            {/* Journey Start (balance 0) */}
            {holderInfo.balance === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-transparent p-6 space-y-5"
              >
                <div className="text-center">
                  <h3 className="font-cinzel text-lg font-bold text-cream mb-2">Your Journey Begins Here</h3>
                  <p className="text-cream/50 text-xs max-w-sm mx-auto">
                    You&apos;re connected but holding 0 $SOUR. Here&apos;s how to start building your identity:
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { step: "1", action: "Buy $SOUR", detail: "Get your first tokens on pump.fun" },
                    { step: "2", action: "Hold 7 days", detail: "Earn 💎 Diamond 7 stamp + time score" },
                    { step: "3", action: "Complete a Handshake", detail: "Earn 🤝 First Shake stamp + trade score" },
                    { step: "4", action: "Reach Verified", detail: "350+ score unlocks Verified tier" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-cream/8 bg-black/20 p-3">
                      <div className="w-7 h-7 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-xs font-bold shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-cream text-sm font-medium">{item.action}</span>
                        <p className="text-cream/40 text-xs mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.a
                  href="https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-shadow"
                >
                  Buy $SOUR to Start Building
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </motion.div>
            )}

            {/* Edit & Share */}
            <div className="flex flex-col items-center gap-4">
              <EditProfile
                name={profile.name}
                bio={profile.bio}
                avatar={profile.avatar}
                onSave={handleSaveProfile}
              />
              <ShareCard
                cardRef={cardRef}
                tierName={scoreBreakdown.tier.name}
                daysInProtocol={holderInfo.daysInProtocol}
                crustScore={scoreBreakdown.total}
                overallGrade={scoreBreakdown.overallGrade}
              />
            </div>

            {/* Stamp Wall Toggle */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStamps(!showStamps)}
                className="text-cream/40 text-xs hover:text-cream/60 transition-colors underline underline-offset-2"
              >
                {showStamps ? "Hide Stamps" : `View All Stamps (${scoreBreakdown.stamps.length} earned)`}
              </motion.button>
            </div>

            {showStamps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <StampWall
                  earnedStamps={scoreBreakdown.stamps}
                  loyaltyStreak={holderInfo.daysInProtocol}
                  daysInProtocol={holderInfo.daysInProtocol}
                  handshakesCompleted={0}
                />
              </motion.div>
            )}

            {/* Mini Leaderboard Preview */}
            <div className="rounded-xl border border-cream/10 bg-black/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5 text-gold/60" />
                  <span className="text-cream/60 text-xs font-medium">Leaderboard</span>
                </div>
                <Link
                  href="/crust/leaderboard"
                  className="text-gold/60 text-[10px] hover:text-gold transition-colors flex items-center gap-1"
                >
                  View Full Ranking →
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { rank: "🥇", name: "Top 1", desc: "Connect & check the leaderboard" },
                  { rank: "🥈", name: "Top 2", desc: "to see where you stand" },
                  { rank: "🥉", name: "Top 3", desc: "among all holders" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-cream/[0.02] border border-cream/5">
                    <span className="text-base">{item.rank}</span>
                    <div className="flex-1">
                      <p className="text-cream/40 text-xs">{item.name}</p>
                      <p className="text-cream/25 text-[10px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/crust/leaderboard"
                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gold/15 text-gold/60 text-xs font-medium hover:bg-gold/5 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" />
                See Full Leaderboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
