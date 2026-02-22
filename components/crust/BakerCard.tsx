"use client";

import { motion } from "framer-motion";
import { getKeeperTier, type KeeperTier } from "@/lib/constants";
import Image from "next/image";

interface BakerCardProps {
  walletAddress: string;
  balance: number;
  daysFermenting: number;
  bakerName: string;
  bakerBio: string;
  avatar: string;
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

export default function BakerCard({
  walletAddress,
  balance,
  daysFermenting,
  bakerName,
  bakerBio,
  avatar,
  cardRef,
}: BakerCardProps) {
  const tier: KeeperTier = getKeeperTier(daysFermenting);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
      className="relative w-full max-w-sm mx-auto"
    >
      {/* Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-black via-gray-950 to-black border border-gold/20 shadow-2xl shadow-gold/10">
        {/* Top accent */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${tier.color}`} />

        {/* Background texture */}
        <div className="absolute inset-0 opacity-5">
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gold/60">🍞 SOUR BAKER CARD</span>
            </div>
            <div className={`px-2.5 py-1 rounded-full ${tier.bgColor} border ${tier.borderColor}`}>
              <span className={`text-[10px] font-bold tracking-wider ${tier.textColor}`}>
                {tier.emoji} {tier.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Avatar + Name */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/30 bg-gold/5 flex-shrink-0">
              <Image
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
              <p className="text-gold/40 text-xs font-mono mt-0.5">
                {shortenAddress(walletAddress)}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
              <p className="text-cream/40 text-[10px] font-medium uppercase tracking-wider mb-1">Holding</p>
              <p className="text-cream font-bold text-lg font-mono">
                {formatBalance(balance)}
              </p>
              <p className="text-gold/40 text-[10px]">$SOUR</p>
            </div>
            <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
              <p className="text-cream/40 text-[10px] font-medium uppercase tracking-wider mb-1">Fermenting</p>
              <p className="text-cream font-bold text-lg font-mono">
                {daysFermenting}
              </p>
              <p className="text-gold/40 text-[10px]">days</p>
            </div>
          </div>

          {/* Tier Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-bold ${tier.textColor}`}>
                {tier.emoji} {tier.name}
              </span>
              <span className="text-cream/30 text-[10px]">
                Harvest Weight: {tier.harvestWeight}
              </span>
            </div>
            <TierProgressBar daysFermenting={daysFermenting} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-cream/5">
            <span className="text-cream/20 text-[10px]">sour.community/crust</span>
            <span className="text-cream/20 text-[10px]">The Civilization Protocol</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TierProgressBar({ daysFermenting }: { daysFermenting: number }) {
  const milestones = [
    { day: 0, label: "Fresh" },
    { day: 30, label: "Rising" },
    { day: 90, label: "Golden" },
    { day: 365, label: "Eternal" },
  ];

  // Calculate progress percentage (cap at 365)
  const progress = Math.min(daysFermenting / 365, 1) * 100;

  return (
    <div className="relative">
      {/* Track */}
      <div className="h-2 rounded-full bg-cream/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-cream/30 via-gold to-amber-500"
        />
      </div>

      {/* Milestone markers */}
      <div className="flex justify-between mt-1">
        {milestones.map((m) => {
          const pos = (m.day / 365) * 100;
          const reached = daysFermenting >= m.day;
          return (
            <div
              key={m.day}
              className="flex flex-col items-center"
              style={{ width: pos === 0 ? "auto" : undefined }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  reached ? "bg-gold" : "bg-cream/15"
                }`}
              />
              <span
                className={`text-[8px] mt-0.5 ${
                  reached ? "text-gold/60" : "text-cream/20"
                }`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
