"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Crown,
  Shield,
  TrendingUp,
  Flame,
  Clock,
  Star,
  BadgeCheck,
  Lock,
  DollarSign,
  Percent,
  ChevronRight,
  HeartHandshake,
  Leaf,
  Sun,
  Snowflake,
  Sprout,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
} as const;

interface HolderTier {
  name: string;
  emoji: string;
  requirement: string;
  holdTime: string;
  color: string;
  borderColor: string;
  bgGlow: string;
  benefits: string[];
  icon: React.ComponentType<{ className?: string }>;
}

export default function HolderBenefits() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const tiers: HolderTier[] = [
    {
      name: "Fresh Dough",
      emoji: "🫓",
      requirement: "Hold any amount",
      holdTime: "Day 1",
      color: "text-stone-400",
      borderColor: "border-stone-500/30",
      bgGlow: "from-stone-500/10 to-stone-600/5",
      icon: Star,
      benefits: [
        "Marketplace access (when live)",
        "Community channels",
        "Reputation NFT minting",
      ],
    },
    {
      name: "Rising Baker",
      emoji: "🍞",
      requirement: "30 days + $100 held",
      holdTime: "30 Days",
      color: "text-amber-600",
      borderColor: "border-amber-600/30",
      bgGlow: "from-amber-600/10 to-amber-700/5",
      icon: Shield,
      benefits: [
        "Early beta access to marketplace",
        "Reputation starting boost",
        "Escrow fee: 2.5% (instead of 3%)",
        "Bond creation rights",
      ],
    },
    {
      name: "Master Baker",
      emoji: "👨‍🍳",
      requirement: "90 days + $500 + 20 trades",
      holdTime: "90 Days",
      color: "text-amber-400",
      borderColor: "border-amber-400/30",
      bgGlow: "from-amber-400/10 to-amber-500/5",
      icon: BadgeCheck,
      benefits: [
        "Escrow fee: 2% (instead of 3%)",
        "Guild creation & leadership",
        "Revenue share eligibility",
        "DAO voting rights",
        "Solidarity Insurance eligible",
      ],
    },
    {
      name: "Genesis Baker",
      emoji: "👑",
      requirement: "Held since launch",
      holdTime: "Since Genesis",
      color: "text-gold",
      borderColor: "border-gold/40",
      bgGlow: "from-gold/15 to-amber-500/5",
      icon: Crown,
      benefits: [
        "All Master Baker benefits",
        "Exclusive Genesis Badge (never re-issued)",
        "Escrow fee: 1.5%",
        "Launchpad proposal rights",
        "Governance veto (critical decisions)",
        "Priority insurance access",
        "Reputation lending rights",
      ],
    },
  ];

  const revenueBreakdown = [
    { label: "Operations", value: "50%", color: "bg-green-500", width: "w-[50%]" },
    { label: "Holder Revenue", value: "15%", color: "bg-gold", width: "w-[15%]" },
    { label: "Commons Treasury", value: "15%", color: "bg-purple-500", width: "w-[15%]" },
    { label: "Buyback + LP", value: "20%", color: "bg-orange-500", width: "w-[20%]" },
  ];

  const seasons = [
    { icon: Sprout, name: "Spring", label: "Planting", desc: "New projects funded, guilds formed", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: Sun, name: "Summer", label: "Growing", desc: "Peak production & trading season", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { icon: Leaf, name: "Autumn", label: "Harvest", desc: "Revenue share distributed (USDC)", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { icon: Snowflake, name: "Winter", label: "Rest", desc: "Retrospective, strategy, planning", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="holder-benefits">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gold/4 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-amber-500/4 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6"
            whileHover={{ scale: 1.05 }}
          >
            💎 WHY HOLD $SOUR
          </motion.span>

          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              LOYALTY HAS REAL VALUE
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-3xl mx-auto text-lg">
            No airdrops. No fake staking rewards. Loyal holders earn{" "}
            <span className="text-gold font-semibold">real USDC revenue share</span>,{" "}
            <span className="text-gold font-semibold">lower fees</span>,{" "}
            <span className="text-gold font-semibold">solidarity insurance</span>, and{" "}
            <span className="text-gold font-semibold">seasonal rewards</span> — all growing with the protocol.
          </p>
        </motion.div>

        {/* Tier Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`relative p-6 rounded-2xl bg-gradient-to-br ${tier.bgGlow} border ${tier.borderColor} hover:border-gold/40 transition-all duration-500`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{tier.emoji}</span>
                <div>
                  <h3 className={`font-cinzel text-lg font-bold ${tier.color}`}>{tier.name}</h3>
                  <p className="text-cream/40 text-xs">{tier.requirement}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-black/30 w-fit">
                <Clock className="w-3 h-3 text-cream/40" />
                <span className="text-cream/50 text-xs">{tier.holdTime}</span>
              </div>
              <ul className="space-y-2">
                {tier.benefits.map((benefit, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-2 text-sm text-cream/55">
                    <ChevronRight className={`w-3 h-3 mt-1 flex-shrink-0 ${tier.color}`} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              {index === 3 && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Share */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12 p-8 md:p-10 rounded-2xl glass-gold border border-gold/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-gold" />
            <h3 className="font-cinzel text-2xl font-bold text-cream">Revenue Share Model</h3>
          </div>

          <p className="text-cream/45 text-sm mb-8 max-w-2xl">
            Every escrow trade generates 1-3% fee. Real income split between operations,
            holders, community, and protocol-owned LP. <span className="text-gold">No tokens are minted — ever.</span>
          </p>

          {/* Revenue Bar */}
          <div className="mb-6">
            <div className="flex w-full h-8 rounded-full overflow-hidden">
              {revenueBreakdown.map((item, i) => (
                <div
                  key={i}
                  className={`${item.color} ${item.width} flex items-center justify-center text-xs font-bold text-black/80`}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {revenueBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-cream/45 text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Revenue Example */}
          <div className="p-5 rounded-xl bg-gold/5 border border-gold/10">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-4 h-4 text-gold" />
              <p className="text-gold font-semibold text-sm">Holder Revenue — Paid in USDC</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-cream/35 text-xs mb-1">Early Stage ($10K/mo)</p>
                <p className="text-cream/65 font-medium">~$15/month pool</p>
              </div>
              <div>
                <p className="text-cream/35 text-xs mb-1">Growth ($1M/mo)</p>
                <p className="text-cream/65 font-medium">~$3,000/month pool</p>
              </div>
              <div>
                <p className="text-cream/35 text-xs mb-1">Scale ($100M/mo)</p>
                <p className="text-cream/65 font-medium">~$180,000/month pool</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seasonal Economy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12 p-8 md:p-10 rounded-2xl glass-gold border border-gold/20"
        >
          <h3 className="font-cinzel text-2xl font-bold text-cream mb-2">Seasonal Economy</h3>
          <p className="text-cream/40 text-sm mb-8">
            Like nature, the SOUR economy follows seasons. Each quarter brings a different rhythm.
            Revenue share is distributed every harvest season.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {seasons.map((season, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-xl ${season.bg} border ${season.border} text-center`}
              >
                <season.icon className={`w-7 h-7 ${season.color} mx-auto mb-2`} />
                <p className={`font-cinzel font-bold ${season.color} text-base mb-0.5`}>{season.name}</p>
                <p className="text-cream/50 text-xs font-semibold uppercase tracking-wider mb-2">{season.label}</p>
                <p className="text-cream/40 text-xs leading-relaxed">{season.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Solidarity Insurance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-12 p-8 md:p-10 rounded-2xl border border-pink-500/15 bg-gradient-to-br from-pink-500/5 via-transparent to-rose-500/5"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-cinzel text-2xl font-bold text-cream mb-1">Solidarity Insurance</h3>
              <p className="text-cream/40 text-sm italic">&ldquo;Solidarity — When one suffers, the village carries them.&rdquo;</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-black/20 border border-cream/5">
              <p className="text-pink-400 font-bold text-sm mb-2">Who Can Apply?</p>
              <p className="text-cream/50 text-sm">
                Master Baker tier or higher (90+ days, 20+ completed trades).
                Must demonstrate genuine hardship — illness, accident, disaster.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-black/20 border border-cream/5">
              <p className="text-pink-400 font-bold text-sm mb-2">How It Works</p>
              <p className="text-cream/50 text-sm">
                Funded from Commons Treasury. Community votes on each case.
                No interest. Range: $500-$2,000.
                Repayable or grant — community decides.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-black/20 border border-cream/5">
              <p className="text-pink-400 font-bold text-sm mb-2">Why It Matters</p>
              <p className="text-cream/50 text-sm">
                No memecoin does this. No freelance platform does this.
                This is real solidarity — not marketing. People hold SOUR for safety,
                not just profit.
              </p>
            </div>
          </div>
        </motion.div>

        {/* LP Growth Math */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="p-8 md:p-10 rounded-2xl glass-gold border border-gold/20 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-6 h-6 text-orange-400" />
            <h3 className="font-cinzel text-2xl font-bold text-cream">Protocol-Owned LP Growth</h3>
          </div>

          <p className="text-cream/45 text-sm mb-8 max-w-2xl">
            50% of all protocol fees buy $SOUR and add to protocol-owned liquidity.
            Deeper LP every month — <span className="text-gold">better for everyone</span>.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { year: "Launch", supply: "$0", pct: "1%", your: "Genesis" },
              { year: "Year 1", supply: "~$120K", pct: "25%", your: "LP depth" },
              { year: "Year 3", supply: "~$500K", pct: "60%", your: "LP depth" },
              { year: "Year 5", supply: "~$2M+", pct: "100%", your: "LP depth" },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-black/30 border border-cream/5">
                <p className="text-cream/35 text-xs mb-1">{item.year}</p>
                <p className="text-cream/65 font-mono text-sm font-medium">{item.supply}</p>
                <div className="my-2">
                  <div className="w-full bg-cream/10 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                      style={{ width: item.pct }}
                    />
                  </div>
                </div>
                <p className="text-xs">
                  <span className="text-cream/35">Your share: </span>
                  <span className="text-gold font-medium">{item.your}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
            <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-cream/55 text-sm">
              More volume = more buybacks = deeper LP = tighter spreads.
              <span className="text-green-400 font-semibold"> Protocol-owned LP</span> means no impermanent loss risk for individuals.
              The protocol absorbs it. Just hold.
            </p>
          </div>
        </motion.div>

        {/* Sell = Reset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-4"
        >
          <Lock className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-bold text-sm mb-1">Sell = Reset</h4>
            <p className="text-cream/45 text-sm">
              Sell your SOUR → tier resets to Fresh Dough. Hold time restarts. Revenue share stops.
              Insurance access revoked. Genesis Badge? Gone forever. Loyalty is rewarded. Paper hands pay the price.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
