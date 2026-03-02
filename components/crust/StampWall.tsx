"use client";

import { motion } from "framer-motion";
import {
  type Stamp,
  getAllStamps,
  STAMP_CATEGORY_META,
} from "@/lib/crust-score";
import { Target } from "lucide-react";

interface StampWallProps {
  earnedStamps: Stamp[];
  loyaltyStreak?: number;
  daysInProtocol?: number;
  handshakesCompleted?: number;
}

/** Compute progress toward a stamp (0–1 scale, or null if not applicable) */
function getStampProgress(
  stamp: Stamp,
  earned: boolean,
  loyaltyStreak: number,
  daysInProtocol: number,
  handshakesCompleted: number,
): { progress: number; label: string } | null {
  if (earned) return { progress: 1, label: "Earned ✓" };

  switch (stamp.id) {
    // Holding stamps (loyalty streak)
    case "diamond_7":
      return { progress: Math.min(loyaltyStreak / 7, 1), label: `${loyaltyStreak}/7 days` };
    case "diamond_30":
      return { progress: Math.min(loyaltyStreak / 30, 1), label: `${loyaltyStreak}/30 days` };
    case "diamond_90":
      return { progress: Math.min(loyaltyStreak / 90, 1), label: `${loyaltyStreak}/90 days` };
    case "diamond_365":
      return { progress: Math.min(loyaltyStreak / 365, 1), label: `${loyaltyStreak}/365 days` };
    case "whale":
      return null; // whale is top-20 — can't track progress here

    // Trade stamps
    case "first_shake":
      return { progress: Math.min(handshakesCompleted / 1, 1), label: `${handshakesCompleted}/1 deal` };
    case "five_star":
      return { progress: Math.min(handshakesCompleted / 5, 1), label: `${handshakesCompleted}/5 deals` };
    case "power_trader":
      return { progress: Math.min(handshakesCompleted / 20, 1), label: `${handshakesCompleted}/20 deals` };
    case "perfect_record":
      return { progress: Math.min(handshakesCompleted / 20, 1), label: `${handshakesCompleted}/20 deals (0 disputes)` };

    // Protocol stamps
    case "citizen":
      return { progress: Math.min(daysInProtocol / 30, 1), label: `${daysInProtocol}/30 days` };
    case "veteran":
      return { progress: Math.min(daysInProtocol / 180, 1), label: `${daysInProtocol}/180 days` };
    case "og":
      return { progress: Math.min(daysInProtocol / 365, 1), label: `${daysInProtocol}/365 days` };
    case "genesis":
      return null; // Genesis is first-1000 — can't track progress

    default:
      return null;
  }
}

export default function StampWall({
  earnedStamps,
  loyaltyStreak = 0,
  daysInProtocol = 0,
  handshakesCompleted = 0,
}: StampWallProps) {
  const allStamps = getAllStamps();
  const earnedIds = new Set(earnedStamps.map((s) => s.id));

  const categories = ["holding", "trade", "protocol"] as const;

  // Find next stamp to earn (closest to completion that isn't earned)
  let nextStamp: { stamp: Stamp; progress: number; label: string } | null = null;
  for (const stamp of allStamps) {
    if (earnedIds.has(stamp.id)) continue;
    const prog = getStampProgress(stamp, false, loyaltyStreak, daysInProtocol, handshakesCompleted);
    if (prog && prog.progress > 0 && prog.progress < 1) {
      if (!nextStamp || prog.progress > nextStamp.progress) {
        nextStamp = { stamp, progress: prog.progress, label: prog.label };
      }
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="rounded-2xl overflow-hidden border border-cream/10 bg-gradient-to-br from-black via-gray-950 to-black">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-cream/5">
          <h3 className="font-cinzel text-sm font-bold text-cream/80 tracking-wider">
            🏛️ Civilization Stamps
          </h3>
          <p className="text-cream/30 text-[10px] mt-1">
            {earnedStamps.length} / {allStamps.length} earned
          </p>
          {/* Overall progress bar */}
          <div className="h-1.5 rounded-full bg-cream/5 overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(earnedStamps.length / allStamps.length) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-gold via-amber-400 to-yellow-500"
            />
          </div>
        </div>

        {/* Next Stamp Highlight */}
        {nextStamp && (
          <div className="mx-5 mt-4 mb-1 rounded-xl border border-gold/20 bg-gold/5 p-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-gold" />
              <span className="text-gold text-[10px] font-bold uppercase tracking-wider">Next Stamp</span>
            </div>
            <span className="text-lg">{nextStamp.stamp.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-cream text-xs font-medium truncate">{nextStamp.stamp.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 rounded-full bg-cream/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500 transition-all"
                    style={{ width: `${nextStamp.progress * 100}%` }}
                  />
                </div>
                <span className="text-cream/40 text-[9px] shrink-0">{nextStamp.label}</span>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="p-5 space-y-5">
          {categories.map((cat) => {
            const meta = STAMP_CATEGORY_META[cat];
            const catStamps = allStamps.filter((s) => s.category === cat);

            return (
              <div key={cat}>
                <div className="mb-2">
                  <p className="text-cream/40 text-[10px] font-medium uppercase tracking-wider">
                    {meta.icon} {meta.label}
                  </p>
                  <p className="text-cream/20 text-[9px]">{meta.desc}</p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {catStamps.map((stamp, i) => {
                    const isEarned = earnedIds.has(stamp.id);
                    const prog = getStampProgress(stamp, isEarned, loyaltyStreak, daysInProtocol, handshakesCompleted);

                    return (
                      <motion.div
                        key={stamp.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        title={`${stamp.name}: ${stamp.description}`}
                        className={`relative group flex flex-col items-center p-2.5 rounded-xl border cursor-default transition-all duration-300 ${
                          isEarned
                            ? "bg-gold/8 border-gold/20 hover:bg-gold/12"
                            : "bg-cream/[0.02] border-cream/5 opacity-50"
                        }`}
                      >
                        <span className={`text-xl mb-1 ${isEarned ? "" : "grayscale"}`}>{stamp.emoji}</span>
                        <span className={`text-[9px] text-center leading-tight font-medium ${
                          isEarned ? "text-cream/70" : "text-cream/30"
                        }`}>
                          {stamp.name}
                        </span>

                        {/* Mini progress under stamp */}
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
                          <p className="text-cream/80 text-[10px] font-bold">{stamp.name}</p>
                          <p className="text-cream/40 text-[9px] mt-0.5">{stamp.description}</p>
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
