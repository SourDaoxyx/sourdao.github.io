"use client";

import { motion } from "framer-motion";
import {
  type CrustTier,
  type Stamp,
  type CrustScoreBreakdown,
  type CategoryScore,
  BASE_SCORE,
  MAX_SCORE,
  ACTIVE_MAX_EARNED,
} from "@/lib/crust-score";
import { Lock } from "lucide-react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CivilizationCardProps {
  walletAddress: string;
  scoreBreakdown: CrustScoreBreakdown;
  sinceDate: Date | null;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

function shortenAddress(addr: string): string {
  return addr.slice(0, 4) + " •••• •••• " + addr.slice(-4);
}

function formatSinceDate(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Card style per tier
// ---------------------------------------------------------------------------

function getCardStyle(tier: CrustTier) {
  switch (tier.name) {
    case "Sovereign":
      return {
        outerClass: "bg-gradient-to-br from-purple-950 via-black to-violet-950 border-purple-500/40 shadow-2xl shadow-purple-500/20",
        accentBar: "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-500",
        scoreColor: "text-purple-400",
        gradeGridBg: "bg-purple-500/8 border-purple-500/15",
        footerColor: "text-purple-400/40",
        barGradient: "from-purple-500 via-fuchsia-400 to-violet-500",
        holographic: true,
      };
    case "Established":
      return {
        outerClass: "bg-gradient-to-br from-amber-950/60 via-black to-yellow-950/40 border-gold/30 shadow-2xl shadow-gold/15",
        accentBar: "bg-gradient-to-r from-gold via-amber-400 to-yellow-500",
        scoreColor: "text-gold",
        gradeGridBg: "bg-gold/8 border-gold/15",
        footerColor: "text-gold/30",
        barGradient: "from-gold via-amber-400 to-yellow-500",
        holographic: false,
      };
    case "Trusted":
      return {
        outerClass: "bg-gradient-to-br from-slate-950/40 via-black to-gray-950/30 border-slate-400/20 shadow-xl shadow-slate-400/10",
        accentBar: "bg-gradient-to-r from-slate-300 via-gray-300 to-slate-400",
        scoreColor: "text-slate-300",
        gradeGridBg: "bg-slate-400/8 border-slate-400/12",
        footerColor: "text-slate-400/30",
        barGradient: "from-slate-300 via-gray-300 to-slate-400",
        holographic: false,
      };
    case "Verified":
      return {
        outerClass: "bg-gradient-to-br from-amber-950/30 via-black to-orange-950/20 border-amber-600/20 shadow-lg shadow-amber-600/10",
        accentBar: "bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700",
        scoreColor: "text-amber-500",
        gradeGridBg: "bg-amber-600/8 border-amber-600/12",
        footerColor: "text-amber-500/25",
        barGradient: "from-amber-600 via-orange-500 to-amber-700",
        holographic: false,
      };
    default: // Unverified
      return {
        outerClass: "bg-gradient-to-br from-gray-950 via-black to-gray-950 border-cream/10 shadow-lg",
        accentBar: "bg-gradient-to-r from-cream/20 to-cream/10",
        scoreColor: "text-cream/50",
        gradeGridBg: "bg-cream/5 border-cream/8",
        footerColor: "text-cream/15",
        barGradient: "from-cream/30 to-cream/50",
        holographic: false,
      };
  }
}

// ---------------------------------------------------------------------------
// Grade Grid — 2×3 layout with harf notları
// ---------------------------------------------------------------------------

function GradeGrid({ categories, bgClass }: { categories: CategoryScore[]; bgClass: string }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {categories.map((cat) => (
        <div
          key={cat.key}
          className={`relative p-2 rounded-lg border ${bgClass} text-center`}
        >
          <p className="text-cream/35 text-[8px] font-medium uppercase tracking-widest leading-none">{cat.label}</p>
          {cat.locked ? (
            <div className="flex items-center justify-center mt-1">
              <Lock className="w-3 h-3 text-cream/20" />
            </div>
          ) : (
            <p className={`font-cinzel text-lg font-bold leading-tight mt-0.5 ${cat.gradeColor}`}>
              {cat.grade}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Score Bar
// ---------------------------------------------------------------------------

function ScoreBar({ score, gradient }: { score: number; gradient: string }) {
  // Scale bar to ACTIVE_MAX so a maxed-out holder sees a full bar
  const pct = Math.min(((score - BASE_SCORE) / ACTIVE_MAX_EARNED) * 100, 100);
  return (
    <div className="h-2.5 rounded-full bg-cream/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stamp Row
// ---------------------------------------------------------------------------

function StampRow({ stamps }: { stamps: Stamp[] }) {
  if (stamps.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {stamps.slice(0, 8).map((stamp) => (
        <span key={stamp.id} title={`${stamp.name}: ${stamp.description}`} className="text-sm cursor-default">
          {stamp.emoji}
        </span>
      ))}
      {stamps.length > 8 && (
        <span className="text-cream/30 text-xs self-center">+{stamps.length - 8}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Card Component
// ---------------------------------------------------------------------------

export default function CivilizationCard({
  walletAddress,
  scoreBreakdown,
  sinceDate,
  cardRef,
}: CivilizationCardProps) {
  const { total, categories, tier, stamps, overallGrade, overallGradeColor } = scoreBreakdown;
  const style = getCardStyle(tier);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative w-full max-w-md mx-auto group"
      style={{ perspective: "1000px" }}
    >
      {/* Capture wrapper — relative for holographic absolute children */}
      <div ref={cardRef} className="relative">
        {/* Holographic animated border for Sovereign */}
        {style.holographic && (
          <div
            className="absolute -inset-[2px] rounded-2xl opacity-60 animate-pulse"
            style={{
              background: "conic-gradient(from 0deg, #a855f7, #ec4899, #8b5cf6, #6366f1, #a855f7)",
            }}
          />
        )}

        {/* Card body */}
        <div
          className={`relative rounded-2xl overflow-hidden border ${style.outerClass} transition-transform duration-300 md:group-hover:[transform:rotateY(2deg)_rotateX(2deg)]`}
        >
          {/* Top accent bar */}
          <div className={`h-1.5 w-full ${style.accentBar}`} />

          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative p-6">
            {/* Header — Protocol name + Tier */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-mono text-cream/30 tracking-widest">
                🫙 SOUR CIVILIZATION ID
              </span>
              <div className={`px-2.5 py-1 rounded-full ${tier.bgColor} border ${tier.borderColor}`}>
                <span className={`text-[10px] font-bold tracking-wider ${tier.textColor}`}>
                  {tier.emoji} {tier.name.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Main content — Score + Grades side by side */}
            <div className="flex items-start gap-5 mb-5">
              {/* Left: Score + wallet + date */}
              <div className="flex-1 min-w-0">
                <p className="text-cream/40 text-[9px] font-medium uppercase tracking-widest mb-1">HOLDER</p>
                <p className="text-cream/60 text-xs font-mono tracking-wide mb-3">
                  {shortenAddress(walletAddress)}
                </p>

                {/* Big Score */}
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-cinzel text-4xl font-bold ${style.scoreColor}`}>
                      {total}
                    </span>
                    <span className="text-cream/20 text-xs font-mono">/ {MAX_SCORE}</span>
                  </div>
                  <p className="text-cream/30 text-[9px] uppercase tracking-widest mt-0.5">CRUST SCORE</p>
                </div>

                {/* Score bar */}
                <ScoreBar score={total} gradient={style.barGradient} />

                {/* Since date + Overall Grade */}
                <div className="flex items-center gap-4 mt-3">
                  <div>
                    <p className="text-cream/25 text-[8px] uppercase tracking-widest">SINCE</p>
                    <p className="text-cream/50 text-xs font-mono">{formatSinceDate(sinceDate)}</p>
                  </div>
                  <div>
                    <p className="text-cream/25 text-[8px] uppercase tracking-widest">GRADE</p>
                    <p className={`font-cinzel text-lg font-bold ${overallGradeColor}`}>{overallGrade}</p>
                  </div>
                </div>
              </div>

              {/* Right: 2×3 Grade Grid */}
              <div className="shrink-0 w-[140px]">
                <GradeGrid categories={categories} bgClass={style.gradeGridBg} />
              </div>
            </div>

            {/* Stamps */}
            {stamps.length > 0 && (
              <div className="mb-4">
                <p className="text-cream/25 text-[8px] font-medium uppercase tracking-widest mb-1.5">STAMPS</p>
                <StampRow stamps={stamps} />
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-cream/5">
              <span className={`${style.footerColor} text-[9px] tracking-wider`}>
                VERIFIED ON SOLANA
              </span>
              <span className={`${style.footerColor} text-[9px]`}>sourdao.xyz</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
