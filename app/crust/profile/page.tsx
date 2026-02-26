"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Copy, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BadgeWall from "@/components/crust/BadgeWall";
import {
  calculateCrustScore,
  type CrustScoreInput,
  type CrustScoreBreakdown,
} from "@/lib/crust-score";

function shortenAddress(addr: string): string {
  if (addr.length < 10) return addr;
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// Until real indexer, generate demo data for any address
function getDemoInput(address: string): CrustScoreInput & { name: string } {
  let seed = 0;
  for (let i = 0; i < address.length; i++) seed += address.charCodeAt(i);

  const balance = Math.round((seed % 5000) * 1000 + 100_000);
  const days = (seed % 300) + 10;
  const hs = (seed % 40) + 1;

  return {
    balance,
    daysFermenting: days,
    handshakesCompleted: hs,
    disputesLost: seed % 20 === 0 ? 1 : 0,
    handshakesCancelled: seed % 10 === 0 ? 1 : 0,
    handshakesTotal: hs + (seed % 10 === 0 ? 1 : 0),
    name: `Baker_${address.slice(0, 6)}`,
  };
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000) return (balance / 1_000_000).toFixed(2) + "M";
  if (balance >= 1_000) return (balance / 1_000).toFixed(1) + "K";
  return balance.toLocaleString();
}

function ScoreRing({ score, tier }: { score: number; tier: CrustScoreBreakdown["tier"] }) {
  const pct = (score / 1000) * 100;
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
        <span className="text-cream/30 text-[10px] uppercase tracking-wider">Crust Score</span>
      </div>
    </div>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address") || "";
  const [scoreBreakdown, setScoreBreakdown] = useState<CrustScoreBreakdown | null>(null);
  const [demoData, setDemoData] = useState<ReturnType<typeof getDemoInput> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    const data = getDemoInput(address);
    setDemoData(data);
    const breakdown = calculateCrustScore(data);
    setScoreBreakdown(breakdown);
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

  if (!scoreBreakdown || !demoData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
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
          {/* Avatar & Score Ring */}
          <div className="relative">
            <ScoreRing score={scoreBreakdown.total} tier={tier} />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full overflow-hidden border-2 ${tier.borderColor}`}>
              <Image src="/sour-logo.png" alt="Baker" width={80} height={80} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div className="text-center sm:text-left">
            <h1 className="font-cinzel text-2xl font-bold text-cream">{demoData.name}</h1>
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
            <p className="text-cream/30 text-xs mt-2">
              Harvest Weight: <span className={`${tier.textColor} font-bold`}>{tier.harvestMultiplier}</span>
            </p>
          </div>
        </motion.div>

        {/* Score Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: "Reputation", value: scoreBreakdown.reputationScore, max: 400, desc: "Handshake history" },
            { label: "Holding Power", value: scoreBreakdown.holdingScore, max: 300, desc: `${formatBalance(demoData.balance)} $SOUR` },
            { label: "Diamond Hands", value: scoreBreakdown.diamondScore, max: 300, desc: `${demoData.daysFermenting} days` },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl border border-cream/10 bg-black/30">
              <p className="text-cream/40 text-[10px] font-medium uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-cream font-bold text-xl font-mono">{item.value}</p>
              <p className="text-cream/25 text-[10px]">/ {item.max}</p>
              <div className="h-1.5 rounded-full bg-cream/5 overflow-hidden mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / item.max) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500"
                />
              </div>
              <p className="text-cream/20 text-[9px] mt-1">{item.desc}</p>
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
            { label: "Holding", value: formatBalance(demoData.balance) },
            { label: "Days", value: String(demoData.daysFermenting) },
            { label: "Bakes", value: String(demoData.handshakesCompleted) },
            { label: "Disputes", value: String(demoData.disputesLost) },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl border border-cream/8 bg-cream/[0.02] text-center">
              <p className="text-cream/35 text-[9px] font-medium uppercase tracking-wider">{s.label}</p>
              <p className="text-cream font-bold text-lg font-mono">{s.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <BadgeWall earnedBadges={scoreBreakdown.badges} />
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
