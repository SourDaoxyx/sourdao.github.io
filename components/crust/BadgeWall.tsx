"use client";

import { motion } from "framer-motion";
import { type Badge, getAllBadges } from "@/lib/crust-score";
import { Target } from "lucide-react";

interface BadgeWallProps {
  earnedBadges: Badge[];
  daysFermenting?: number;
  handshakesCompleted?: number;
  balance?: number;
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  holding: { label: "Holding", icon: "💰", desc: "Earned by holding $SOUR over time" },
  handshake: { label: "Handshake", icon: "🤝", desc: "Earned by completing P2P deals" },
  treasury: { label: "Treasury", icon: "🏦", desc: "Earned by contributing to buyback+LP" },
  community: { label: "Community", icon: "🏛️", desc: "Earned by community participation" },
};

/** Compute progress toward a badge (0–1 scale, or null if not applicable) */
function getBadgeProgress(
  badge: Badge,
  earned: boolean,
  daysFermenting: number,
  handshakesCompleted: number,
  balance: number,
): { progress: number; label: string } | null {
  if (earned) return { progress: 1, label: "Earned ✓" };

  switch (badge.id) {
    case "first_dough":
      return balance > 0 ? { progress: 1, label: "Earned ✓" } : { progress: 0, label: "Buy $SOUR" };
    case "diamond_7":
      return { progress: Math.min(daysFermenting / 7, 1), label: `${daysFermenting}/7 days` };
    case "diamond_30":
      return { progress: Math.min(daysFermenting / 30, 1), label: `${daysFermenting}/30 days` };
    case "diamond_90":
      return { progress: Math.min(daysFermenting / 90, 1), label: `${daysFermenting}/90 days` };
    case "diamond_365":
      return { progress: Math.min(daysFermenting / 365, 1), label: `${daysFermenting}/365 days` };
    case "first_shake":
      return { progress: Math.min(handshakesCompleted / 1, 1), label: `${handshakesCompleted}/1 deals` };
    case "baker_dozen":
      return { progress: Math.min(handshakesCompleted / 12, 1), label: `${handshakesCompleted}/12 deals` };
    case "master_baker":
      return { progress: Math.min(handshakesCompleted / 50, 1), label: `${handshakesCompleted}/50 deals` };
    case "perfect_record":
      return { progress: Math.min(handshakesCompleted / 20, 1), label: `${handshakesCompleted}/20 deals (0 disputes)` };
    case "first_burn":
      return { progress: Math.min(handshakesCompleted / 1, 1), label: handshakesCompleted >= 1 ? "Earned ✓" : "Complete 1 deal" };
    default:
      return null; // community/treasury badges without trackable progress
  }
}

export default function BadgeWall({ earnedBadges, daysFermenting = 0, handshakesCompleted = 0, balance = 0 }: BadgeWallProps) {
  const allBadges = getAllBadges();
  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  const categories = ["holding", "handshake", "treasury", "community"] as const;

  // Find next badge to earn (closest to completion that isn't earned)
  let nextBadge: { badge: Badge; progress: number; label: string } | null = null;
  for (const badge of allBadges) {
    if (earnedIds.has(badge.id)) continue;
    const prog = getBadgeProgress(badge, false, daysFermenting, handshakesCompleted, balance);
    if (prog && prog.progress > 0 && prog.progress < 1) {
      if (!nextBadge || prog.progress > nextBadge.progress) {
        nextBadge = { badge, progress: prog.progress, label: prog.label };
      }
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden border border-cream/10 bg-gradient-to-br from-black via-gray-950 to-black">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-cream/5">
          <h3 className="font-cinzel text-sm font-bold text-cream/80 tracking-wider">
            🏆 Achievement Badges
          </h3>
          <p className="text-cream/30 text-[10px] mt-1">
            {earnedBadges.length} / {allBadges.length} earned
          </p>
          {/* Overall progress bar */}
          <div className="h-1.5 rounded-full bg-cream/5 overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedBadges.length / allBadges.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-gold via-amber-400 to-yellow-500"
            />
          </div>
        </div>

        {/* Next Badge Highlight */}
        {nextBadge && (
          <div className="mx-5 mt-4 mb-1 rounded-xl border border-gold/20 bg-gold/5 p-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-gold" />
              <span className="text-gold text-[10px] font-bold uppercase tracking-wider">Next Badge</span>
            </div>
            <span className="text-lg">{nextBadge.badge.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-cream text-xs font-medium truncate">{nextBadge.badge.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 rounded-full bg-cream/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500 transition-all"
                    style={{ width: `${nextBadge.progress * 100}%` }}
                  />
                </div>
                <span className="text-cream/40 text-[9px] shrink-0">{nextBadge.label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="p-5 space-y-5">
          {categories.map((cat) => {
            const meta = CATEGORY_LABELS[cat];
            const catBadges = allBadges.filter((b) => b.category === cat);

            return (
              <div key={cat}>
                <div className="mb-2">
                  <p className="text-cream/40 text-[10px] font-medium uppercase tracking-wider">
                    {meta.icon} {meta.label}
                  </p>
                  <p className="text-cream/20 text-[9px]">{meta.desc}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {catBadges.map((badge, i) => {
                    const isEarned = earnedIds.has(badge.id);
                    const prog = getBadgeProgress(badge, isEarned, daysFermenting, handshakesCompleted, balance);

                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        title={`${badge.name}: ${badge.description}`}
                        className={`relative group flex flex-col items-center p-2.5 rounded-xl border cursor-default transition-all duration-300 ${
                          isEarned
                            ? "bg-gold/8 border-gold/20 hover:bg-gold/12"
                            : "bg-cream/[0.02] border-cream/5 opacity-50"
                        }`}
                      >
                        <span className={`text-xl mb-1 ${isEarned ? "" : "grayscale"}`}>{badge.emoji}</span>
                        <span className={`text-[9px] text-center leading-tight font-medium ${
                          isEarned ? "text-cream/70" : "text-cream/30"
                        }`}>
                          {badge.name}
                        </span>

                        {/* Mini progress under badge */}
                        {prog && !isEarned && prog.progress > 0 && (
                          <div className="w-full mt-1.5">
                            <div className="h-0.5 rounded-full bg-cream/5 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gold/50 transition-all"
                                style={{ width: `${prog.progress * 100}%` }}
                              />
                            </div>
                            <p className="text-cream/25 text-[7px] text-center mt-0.5">{prog.label}</p>
                          </div>
                        )}

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-cream/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-44">
                          <p className="text-cream/80 text-[10px] font-bold">{badge.name}</p>
                          <p className="text-cream/40 text-[9px] mt-0.5">{badge.description}</p>
                          {prog && (
                            <p className={`text-[9px] mt-1 ${isEarned ? "text-emerald-400" : "text-gold/50"}`}>
                              {isEarned ? "✅ Earned!" : `⏳ ${prog.label}`}
                            </p>
                          )}
                          {!isEarned && !prog && (
                            <p className="text-cream/25 text-[9px] mt-1 italic">🔒 Requirements not yet trackable</p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
