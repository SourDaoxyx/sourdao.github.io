'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Timer, 
  Coins,
  Crown,
  Star,
  Sparkles,
  TrendingUp,
  Vote,
  Flame,
  Users,
  Shield
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

interface BakerTier {
  tier: string;
  icon: React.ComponentType<{ className?: string }>;
  holdTime: string;
  minHolding: string;
  color: string;
  benefits: string[];
  gradient: string;
}

interface UtilityFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
  status: string;
  color: string;
}

export default function Rewards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const bakerTiers: BakerTier[] = [
    {
      tier: "Fresh Dough",
      icon: Coins,
      holdTime: "Any holder",
      minHolding: "1+ MAYA",
      color: "from-gray-400 to-gray-500",
      benefits: ["Public Telegram access", "Basic announcements"],
      gradient: "bg-gradient-to-br from-gray-500/20 to-gray-600/10",
    },
    {
      tier: "Rising",
      icon: TrendingUp,
      holdTime: "7+ days",
      minHolding: "10K+ MAYA",
      color: "from-green-400 to-emerald-500",
      benefits: ["Holder-gated Discord", "Early alpha access", "Meme contests"],
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
    },
    {
      tier: "Proofing",
      icon: Timer,
      holdTime: "30+ days",
      minHolding: "100K+ MAYA",
      color: "from-blue-400 to-cyan-500",
      benefits: ["Governance voting power", "Exclusive AMAs", "NFT mint access"],
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
    },
    {
      tier: "Fermented",
      icon: Star,
      holdTime: "90+ days",
      minHolding: "500K+ MAYA",
      color: "from-purple-400 to-violet-500",
      benefits: ["VIP Discord channel", "Ambassador eligibility", "DAO proposal rights"],
      gradient: "bg-gradient-to-br from-purple-500/20 to-violet-600/10",
    },
    {
      tier: "Aged Starter",
      icon: Crown,
      holdTime: "365+ days",
      minHolding: "1M+ MAYA",
      color: "from-gold to-amber-500",
      benefits: ["Founding Baker status", "DAO council seat", "IRL events", "Partner discounts"],
      gradient: "bg-gradient-to-br from-gold/20 to-amber-600/10",
    },
  ];

  const utilityFeatures: UtilityFeature[] = [
    {
      icon: Users,
      title: "Holder-Gated Access",
      description: "Verify your tokens to unlock exclusive community spaces. No cost, just hold.",
      details: [
        "Token-gated Telegram groups",
        "Exclusive Discord channels",
        "Private alpha announcements",
        "Direct team communication",
      ],
      status: "Phase II",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Vote,
      title: "Governance via Snapshot",
      description: "Your tokens = your voice. Vote on proposals without gas fees using Snapshot.org.",
      details: [
        "Gasless off-chain voting",
        "Voting power based on holdings",
        "Community-driven decisions",
        "Transparent proposal system",
      ],
      status: "Phase II",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Flame,
      title: "NFT Burn-to-Mint",
      description: "Burn your MAYA tokens to mint exclusive NFTs. Deflationary by design.",
      details: [
        "Burn MAYA → Mint exclusive NFT",
        "Limited edition collections",
        "Reduces circulating supply",
        "Community burns own tokens",
      ],
      status: "Phase III",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Coins,
      title: "LP Fee Redistribution",
      description: "After Raydium migration, LP trading fees flow back to the community.",
      details: [
        "Real yield from trading activity",
        "No promises, just mechanics",
        "LP fee collection post-migration",
        "Transparent on-chain distribution",
      ],
      status: "Phase III",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="rewards">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px]" />
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
            🔐 TOKEN UTILITY
          </motion.span>
          
          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              HOLD FOR ACCESS
            </span>
          </h2>
          
          <p className="font-inter text-cream/60 max-w-3xl mx-auto text-lg">
            No fake reward promises. Real utility based on holding. Access exclusive communities, 
            vote on decisions, and unlock features — all powered by your tokens.
          </p>
        </motion.div>

        {/* Baker Tiers */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-24"
        >
          <motion.h3 
            variants={itemVariants}
            className="font-cinzel text-2xl md:text-3xl text-center text-cream mb-4"
          >
            🎂 Baker Tiers — Your Status Level
          </motion.h3>
          <motion.p 
            variants={itemVariants}
            className="text-cream/50 text-center mb-12 max-w-2xl mx-auto"
          >
            Your holding amount and duration determine your tier. Higher tiers unlock more access.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {bakerTiers.map((tier, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-6 rounded-2xl ${tier.gradient} border border-gold/20 hover:border-gold/40 transition-all duration-500`}
              >
                {/* Tier Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 mx-auto`}>
                  <tier.icon className="w-7 h-7 text-white" />
                </div>

                {/* Tier Info */}
                <div className="text-center mb-4">
                  <h4 className="font-cinzel text-lg font-bold text-cream mb-1">{tier.tier}</h4>
                  <p className="text-cream/50 text-sm">{tier.holdTime}</p>
                  <p className={`text-lg font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mt-2`}>
                    {tier.minHolding}
                  </p>
                  <p className="text-cream/40 text-xs">minimum balance</p>
                </div>

                {/* Benefits */}
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className="flex items-center gap-2 text-sm text-cream/60">
                      <Sparkles className="w-3 h-3 text-gold/60 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Utility Features */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3 
            variants={itemVariants}
            className="font-cinzel text-2xl md:text-3xl text-center text-cream mb-4"
          >
            ⚡ Real Utility — No Empty Promises
          </motion.h3>
          <motion.p 
            variants={itemVariants}
            className="text-cream/50 text-center mb-12 max-w-2xl mx-auto"
          >
            Every feature here works without us distributing tokens. You hold, you gain access.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {utilityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative p-8 rounded-2xl glass-gold border border-gold/20 hover:border-gold/40 transition-all duration-500"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${feature.color} bg-opacity-20 text-cream/80 border border-white/10`}>
                    {feature.status}
                  </span>
                </div>

                {/* Feature Header */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                <h4 className="font-cinzel text-xl font-bold text-cream mb-3">
                  {feature.title}
                </h4>
                <p className="text-cream/60 text-sm mb-6">
                  {feature.description}
                </p>

                {/* Details */}
                <ul className="space-y-3">
                  {feature.details.map((detail, dIndex) => (
                    <li key={dIndex} className="flex items-center gap-3 text-sm text-cream/70">
                      <Shield className="w-4 h-4 text-gold/60 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-cream/60 mb-6">Join the community, hold the token, unlock access.</p>
          <motion.a
            href="https://t.me/mayastarter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel font-bold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users className="w-5 h-5" />
            JOIN THE BAKERY
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
