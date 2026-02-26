"use client";

import { motion } from "framer-motion";
import { type Badge, getAllBadges } from "@/lib/crust-score";

interface BadgeWallProps {
  earnedBadges: Badge[];
}

const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  holding: { label: "Holding", icon: "💰" },
  handshake: { label: "Handshake", icon: "🤝" },
  burn: { label: "Burn", icon: "🔥" },
  community: { label: "Community", icon: "🏛️" },
};

export default function BadgeWall({ earnedBadges }: BadgeWallProps) {
  const allBadges = getAllBadges();
  const earnedIds = new Set(earnedBadges.map((b) => b.id));

  const categories = ["holding", "handshake", "burn", "community"] as const;

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

        {/* Categories */}
        <div className="p-5 space-y-5">
          {categories.map((cat) => {
            const meta = CATEGORY_LABELS[cat];
            const catBadges = allBadges.filter((b) => b.category === cat);

            return (
              <div key={cat}>
                <p className="text-cream/40 text-[10px] font-medium uppercase tracking-wider mb-2">
                  {meta.icon} {meta.label}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {catBadges.map((badge, i) => {
                    const isEarned = earnedIds.has(badge.id);
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
                            : "bg-cream/[0.02] border-cream/5 opacity-40 grayscale"
                        }`}
                      >
                        <span className="text-xl mb-1">{badge.emoji}</span>
                        <span className={`text-[9px] text-center leading-tight font-medium ${
                          isEarned ? "text-cream/70" : "text-cream/30"
                        }`}>
                          {badge.name}
                        </span>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/95 border border-cream/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-40">
                          <p className="text-cream/80 text-[10px] font-bold">{badge.name}</p>
                          <p className="text-cream/40 text-[9px] mt-0.5">{badge.description}</p>
                          {!isEarned && (
                            <p className="text-gold/50 text-[9px] mt-1 italic">🔒 Not yet earned</p>
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
