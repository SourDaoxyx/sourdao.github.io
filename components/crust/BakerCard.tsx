"use client";

import { motion } from "framer-motion";
import { type CrustTier, type Badge, type CrustScoreBreakdown } from "@/lib/crust-score";

interface BakerCardProps {
  walletAddress: string;
  balance: number;
  daysFermenting: number;
  bakerName: string;
  bakerBio: string;
  avatar: string;
  scoreBreakdown: CrustScoreBreakdown;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

function formatBalance(balance: number): string {
  if (balance >= 1_000_000) return (balance / 1_000_000).toFixed(2) + "M";
  if (balance >= 1_000) return (balance / 1_000).toFixed(1) + "K";
  return balance.toLocaleString();
}

function shortenAddress(addr: string): string {
  return addr.slice(0, 4) + "..." + addr.slice(-4);
}

// ---------------------------------------------------------------------------
// Card style per tier
// ---------------------------------------------------------------------------

function getCardClasses(tier: CrustTier) {
  switch (tier.cardStyle) {
    case "holographic":
      return {
        outer: "bg-gradient-to-br from-purple-950 via-black to-violet-950 border-purple-500/40 shadow-2xl shadow-purple-500/20",
        accent: "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-violet-500",
        statBg: "bg-purple-500/10 border-purple-500/15",
        footerText: "text-purple-400/40",
        scoreBar: "from-purple-500 via-fuchsia-400 to-violet-500",
        animate: true,
      };
    case "golden":
      return {
        outer: "bg-gradient-to-br from-amber-950/60 via-black to-yellow-950/40 border-gold/30 shadow-2xl shadow-gold/15",
        accent: "bg-gradient-to-r from-gold via-amber-400 to-yellow-500",
        statBg: "bg-gold/8 border-gold/15",
        footerText: "text-gold/30",
        scoreBar: "from-gold via-amber-400 to-yellow-500",
        animate: false,
      };
    case "warm":
      return {
        outer: "bg-gradient-to-br from-blue-950/30 via-black to-cyan-950/20 border-blue-500/20 shadow-xl shadow-blue-500/10",
        accent: "bg-gradient-to-r from-blue-400 to-cyan-500",
        statBg: "bg-blue-500/8 border-blue-500/12",
        footerText: "text-blue-400/30",
        scoreBar: "from-blue-400 to-cyan-500",
        animate: false,
      };
    default:
      return {
        outer: "bg-gradient-to-br from-black via-gray-950 to-black border-cream/10 shadow-lg",
        accent: "bg-gradient-to-r from-cream/30 to-cream/20",
        statBg: "bg-cream/5 border-cream/8",
        footerText: "text-cream/15",
        scoreBar: "from-cream/30 to-cream/50",
        animate: false,
      };
  }
}

// ---------------------------------------------------------------------------
// Score Bar
// ---------------------------------------------------------------------------

function CrustScoreBar({ score, maxScore = 1000, gradient }: { score: number; maxScore?: number; gradient: string }) {
  const pct = Math.min((score / maxScore) * 100, 100);
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
// Badge Row
// ---------------------------------------------------------------------------

function BadgeRow({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {badges.slice(0, 8).map((badge) => (
        <span key={badge.id} title={`${badge.name}: ${badge.description}`} className="text-sm cursor-default">
          {badge.emoji}
        </span>
      ))}
      {badges.length > 8 && <span className="text-cream/30 text-xs self-center">+{badges.length - 8}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini Breakdown
// ---------------------------------------------------------------------------

function MiniBreakdown({ breakdown, scoreBar }: { breakdown: CrustScoreBreakdown; scoreBar: string }) {
  const items = [
    { label: "Reputation", value: breakdown.reputationScore, max: 400 },
    { label: "Holding", value: breakdown.holdingScore, max: 300 },
    { label: "Diamond", value: breakdown.diamondScore, max: 300 },
  ];

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="text-cream/30 text-[10px] w-16 shrink-0">{item.label}</span>
          <div className="flex-1 h-1 rounded-full bg-cream/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / item.max) * 100}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`h-full rounded-full bg-gradient-to-r ${scoreBar}`}
            />
          </div>
          <span className="text-cream/40 text-[10px] w-8 text-right">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main BakerCard
// ---------------------------------------------------------------------------

export default function BakerCard({
  walletAddress,
  balance,
  daysFermenting,
  bakerName,
  bakerBio,
  avatar,
  scoreBreakdown,
  cardRef,
}: BakerCardProps) {
  const { total, tier, badges } = scoreBreakdown;
  const cardStyle = getCardClasses(tier);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Static wrapper for image capture — no transforms */}
      <div ref={cardRef}>
      {/* Holographic animated border for Eternal tier */}
      {cardStyle.animate && (
        <div
          className="absolute -inset-[2px] rounded-2xl opacity-60"
          style={{
            background: "conic-gradient(from 0deg, #a855f7, #ec4899, #8b5cf6, #6366f1, #a855f7)",
          }}
        />
      )}

      {/* Card body */}
      <div className={`relative rounded-2xl overflow-hidden border ${cardStyle.outer}`}>
        {/* Top accent bar */}
        <div className={`h-1.5 w-full ${cardStyle.accent}`} />

        {/* Texture */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-mono text-cream/30">🍞 SOUR BAKER CARD</span>
            <div className={`px-2.5 py-1 rounded-full ${tier.bgColor} border ${tier.borderColor}`}>
              <span className={`text-[10px] font-bold tracking-wider ${tier.textColor}`}>
                {tier.emoji} {tier.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-16 h-16 rounded-full overflow-hidden border-2 ${tier.borderColor} bg-black/30 flex-shrink-0`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatar}
                alt={bakerName || "Baker"}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-cinzel text-lg font-bold text-cream truncate">
                {bakerName || "Anonymous Baker"}
              </h3>
              {bakerBio && (
                <p className="text-cream/40 text-xs italic truncate">&ldquo;{bakerBio}&rdquo;</p>
              )}
              <p className="text-cream/30 text-xs font-mono mt-0.5">
                {shortenAddress(walletAddress)}
              </p>
            </div>
          </div>

          {/* Crust Score */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cream/50 text-xs font-medium uppercase tracking-wider">Crust Score</span>
              <span className={`font-cinzel text-xl font-bold ${tier.textColor}`}>{total}</span>
            </div>
            <CrustScoreBar score={total} gradient={cardStyle.scoreBar} />
            <div className="mt-3">
              <MiniBreakdown breakdown={scoreBreakdown} scoreBar={cardStyle.scoreBar} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: "Holding", value: formatBalance(balance), sub: "$SOUR" },
              { label: "Days", value: String(daysFermenting), sub: "fermenting" },
              { label: "Bakes", value: String(scoreBreakdown.reputationScore > 0 ? Math.round(scoreBreakdown.reputationScore / 6) : 0), sub: "completed" },
              { label: "Score", value: String(total), sub: "/ 1000" },
            ].map((stat) => (
              <div key={stat.label} className={`p-2 rounded-lg ${cardStyle.statBg} border text-center`}>
                <p className="text-cream/35 text-[9px] font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-cream font-bold text-sm font-mono leading-tight mt-0.5">{stat.value}</p>
                <p className="text-cream/25 text-[8px]">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="mb-4">
              <p className="text-cream/30 text-[10px] font-medium uppercase tracking-wider mb-1">Achievements</p>
              <BadgeRow badges={badges} />
            </div>
          )}

          {/* Harvest weight */}
          <div className="flex items-center justify-between mb-4 px-3 py-2 rounded-lg bg-cream/[0.02] border border-cream/5">
            <span className="text-cream/30 text-[10px]">Harvest Weight</span>
            <span className={`text-sm font-bold ${tier.textColor}`}>{tier.harvestMultiplier}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-cream/5">
            <span className={`${cardStyle.footerText} text-[10px]`}>sourdao.xyz/crust</span>
            <span className={`${cardStyle.footerText} text-[10px]`}>The Civilization Protocol</span>
          </div>
        </div>
      </div>
      </div>{/* end capture wrapper */}
    </motion.div>
  );
}
