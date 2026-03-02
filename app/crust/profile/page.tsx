"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Copy, Check, Lock } from "lucide-react";
import Link from "next/link";
import { PublicKey } from "@solana/web3.js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StampWall from "@/components/crust/StampWall";
import { getSourHolderInfo, type SourHolderInfo } from "@/lib/solana";
import {
  calculateCrustScore,
  BASE_SCORE,
  MAX_SCORE,
  ACTIVE_MAX_EARNED,
  type CrustScoreInput,
  type CrustScoreBreakdown,
} from "@/lib/crust-score";

function shortenAddress(addr: string): string {
  if (addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function loadProfile(wallet: string): { name: string; bio: string } {
  if (typeof window === "undefined") return { name: "", bio: "" };
  try {
    const stored = localStorage.getItem(`sour-citizen-${wallet}`);
    const legacy = !stored ? localStorage.getItem(`sour-baker-${wallet}`) : null;
    if (stored) return JSON.parse(stored);
    if (legacy) return JSON.parse(legacy);
  } catch { /* ignore */ }
  return { name: "", bio: "" };
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000) return (balance / 1_000_000).toFixed(2) + "M";
  if (balance >= 1_000) return (balance / 1_000).toFixed(1) + "K";
  return balance.toLocaleString();
}

// Score Ring updated for 300–850
function ScoreRing({ score, tier, overallGrade, overallGradeColor }: {
  score: number;
  tier: CrustScoreBreakdown["tier"];
  overallGrade: string;
  overallGradeColor: string;
}) {
  // Scale ring to active-category max so achievable scores fill the ring
  const pct = Math.min(((score - BASE_SCORE) / ACTIVE_MAX_EARNED) * 100, 100);
  const circumference = 2 * Math.PI * 54;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-cream/5" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-cinzel text-3xl font-bold ${tier.textColor}`}>{score}</span>
        <span className={`text-xs font-bold ${overallGradeColor}`}>{overallGrade}</span>
        <span className="text-cream/30 text-[9px] uppercase tracking-wider">/ {MAX_SCORE}</span>
      </div>
    </div>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "";
  const [scoreBreakdown, setScoreBreakdown] = useState<CrustScoreBreakdown | null>(null);
  const [holderInfo, setHolderInfo] = useState<SourHolderInfo | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const savedProfile = loadProfile(address);
    setProfileName(savedProfile.name || `Holder_${address.slice(0, 6)}`);

    const fetchData = async () => {
      setLoading(true);
      try {
        const pubkey = new PublicKey(address);
        const info = await getSourHolderInfo(pubkey);
        setHolderInfo(info);

        const input: CrustScoreInput = {
          balance: info.balance,
          daysInProtocol: info.daysInProtocol,
          loyaltyStreak: info.daysInProtocol,
          handshakesCompleted: 0,
          disputesLost: 0,
          handshakesCancelled: 0,
          handshakesTotal: 0,
        };
        setScoreBreakdown(calculateCrustScore(input));
      } catch (err) {
        console.error("[SOUR] Failed to fetch profile data:", err);
        const fallbackInfo: SourHolderInfo = { balance: 0, firstTxDate: null, daysInProtocol: 0 };
        setHolderInfo(fallbackInfo);
        setScoreBreakdown(calculateCrustScore({
          balance: 0,
          daysInProtocol: 0,
          loyaltyStreak: 0,
          handshakesCompleted: 0,
          disputesLost: 0,
          handshakesCancelled: 0,
          handshakesTotal: 0,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (!address) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20">
        <p className="text-cream/50 text-sm mb-4">No wallet address specified.</p>
        <Link href="/crust" className="text-gold text-sm underline underline-offset-2">
          Go to Crust
        </Link>
      </section>
    );
  }

  if (!scoreBreakdown || !holderInfo || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-cream/30 text-xs">Reading on-chain data...</p>
      </div>
    );
  }

  const { tier } = scoreBreakdown;

  return (
    <section className="min-h-[80vh] px-4 py-20 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-gold/5 to-transparent blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/crust"
          className="inline-flex items-center gap-2 text-cream/30 text-sm hover:text-cream/50 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Crust
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center gap-6 mb-10"
        >
          {/* Score Ring */}
          <ScoreRing
            score={scoreBreakdown.total}
            tier={tier}
            overallGrade={scoreBreakdown.overallGrade}
            overallGradeColor={scoreBreakdown.overallGradeColor}
          />

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="font-cinzel text-2xl font-bold text-cream">{profileName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-cream/30 text-xs font-mono">{shortenAddress(address)}</span>
              <button onClick={handleCopy} className="text-cream/20 hover:text-cream/40 transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              </button>
              <a
                href={`https://solscan.io/account/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream/20 hover:text-cream/40 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full ${tier.bgColor} border ${tier.borderColor}`}>
              <span className="text-sm">{tier.emoji}</span>
              <span className={`text-xs font-bold tracking-wider ${tier.textColor}`}>{tier.name}</span>
            </div>
          </div>
        </motion.div>

        {/* 6-Category Breakdown with Grades */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
        >
          {scoreBreakdown.categories.map((cat) => (
            <div key={cat.key} className={`p-4 rounded-xl border ${cat.locked ? "border-cream/5 bg-cream/[0.01]" : "border-cream/10 bg-black/30"}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-cream/40 text-[10px] font-medium uppercase tracking-wider">{cat.label}</p>
                {cat.locked ? (
                  <Lock className="w-3 h-3 text-cream/20" />
                ) : (
                  <span className={`text-sm font-bold ${cat.gradeColor}`}>{cat.grade}</span>
                )}
              </div>
              {cat.locked ? (
                <div className="mt-2">
                  <p className="text-cream/20 text-xs">🔒 {cat.lockReason}</p>
                </div>
              ) : (
                <>
                  <p className="text-cream font-bold text-xl font-mono">{cat.score}</p>
                  <p className="text-cream/25 text-[10px]">/ {cat.max}</p>
                  <div className="h-1.5 rounded-full bg-cream/5 overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.max > 0 ? (cat.score / cat.max) * 100 : 0}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Holding", value: formatBalance(holderInfo.balance) },
            { label: "Days", value: String(holderInfo.daysInProtocol) },
            { label: "Deals", value: "0" },
            { label: "Grade", value: scoreBreakdown.overallGrade },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl border border-cream/8 bg-cream/[0.02] text-center">
              <p className="text-cream/35 text-[9px] font-medium uppercase tracking-wider">{s.label}</p>
              <p className="text-cream font-bold text-lg font-mono">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Stamps */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <StampWall
            earnedStamps={scoreBreakdown.stamps}
            loyaltyStreak={holderInfo.daysInProtocol}
            daysInProtocol={holderInfo.daysInProtocol}
            handshakesCompleted={0}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default function CrustProfilePage() {
  return (
    <main className="min-h-screen bg-black text-cream">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
      <Footer />
    </main>
  );
}
