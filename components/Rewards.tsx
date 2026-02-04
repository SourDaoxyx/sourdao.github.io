'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Gift, 
  Timer, 
  Lock,
  Coins,
  Crown,
  Star,
  Sparkles,
  TrendingUp,
  Share2,
  Award,
  Zap
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
  multiplier: string;
  color: string;
  benefits: string[];
  gradient: string;
}

interface RewardTier {
  label: string;
  value: string;
  note?: string;
}

interface RewardProgram {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tiers: RewardTier[];
  bonus: string;
  color: string;
}

export default function Rewards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const bakerTiers: BakerTier[] = [
    {
      tier: "Fresh Dough",
      icon: Coins,
      holdTime: "0-7 days",
      multiplier: "1x",
      color: "from-gray-400 to-gray-500",
      benefits: ["Basic community access", "Public announcements"],
      gradient: "bg-gradient-to-br from-gray-500/20 to-gray-600/10",
    },
    {
      tier: "Rising",
      icon: TrendingUp,
      holdTime: "7-30 days",
      multiplier: "1.5x",
      color: "from-green-400 to-emerald-500",
      benefits: ["Baker Discord role", "Early alpha access", "Meme contests entry"],
      gradient: "bg-gradient-to-br from-green-500/20 to-emerald-600/10",
    },
    {
      tier: "Proofing",
      icon: Timer,
      holdTime: "30-90 days",
      multiplier: "2x",
      color: "from-blue-400 to-cyan-500",
      benefits: ["Priority support", "Exclusive AMAs", "Airdrop eligibility", "Governance voting"],
      gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-600/10",
    },
    {
      tier: "Fermented",
      icon: Star,
      holdTime: "90-365 days",
      multiplier: "3x",
      color: "from-purple-400 to-violet-500",
      benefits: ["VIP Discord channel", "NFT whitelist", "Revenue share", "Ambassador eligibility"],
      gradient: "bg-gradient-to-br from-purple-500/20 to-violet-600/10",
    },
    {
      tier: "Aged Starter",
      icon: Crown,
      holdTime: "365+ days",
      multiplier: "5x",
      color: "from-gold to-amber-500",
      benefits: ["Founding Baker status", "Lifetime benefits", "DAO council seat", "IRL events access", "Merch drops"],
      gradient: "bg-gradient-to-br from-gold/20 to-amber-600/10",
    },
  ];

  const rewardPrograms: RewardProgram[] = [
    {
      icon: Lock,
      title: "LP Staking — The Oven",
      description: "Lock your LP tokens and earn MAYA rewards. Longer locks = higher APY.",
      tiers: [
        { label: "$100-500 LP", value: "10% APY", note: "Bronze Baker" },
        { label: "$500-2000 LP", value: "15% APY", note: "Silver Baker" },
        { label: "$2000+ LP", value: "20% APY", note: "Gold Baker" },
      ],
      bonus: "6-month lock = Master Baker title + 5% bonus",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Share2,
      title: "Referral System — Spread the Starter",
      description: "Share your unique link and earn when friends join the bakery.",
      tiers: [
        { label: "Friend buys", value: "5% bonus", note: "Instant reward" },
        { label: "Friend holds 30 days", value: "+10% bonus", note: "Loyalty bonus" },
        { label: "Top 10 monthly", value: "Breadwinner NFT", note: "Exclusive badge" },
      ],
      bonus: "Unlimited referrals, compounding rewards",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Award,
      title: "Proof of Bread — Community Rewards",
      description: "Make real bread, share it, earn rewards. The most organic marketing ever.",
      tiers: [
        { label: "Post #MAYABread photo", value: "100 MAYA", note: "Weekly" },
        { label: "Tutorial video", value: "500 MAYA", note: "Monthly" },
        { label: "Viral content (10K+ views)", value: "2000 MAYA", note: "Bonus" },
      ],
      bonus: "Best monthly content = Featured Baker spotlight",
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
            🎁 BAKER REWARDS
          </motion.span>
          
          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              THE LOYALTY PROGRAM
            </span>
          </h2>
          
          <p className="font-inter text-cream/60 max-w-3xl mx-auto text-lg">
            Diamond hands deserve diamond rewards. The longer you hold, the more you earn.
            No selling? No problem — we reward patience.
          </p>
        </motion.div>

        {/* Fermentation Time Tiers */}
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
            ⏱️ Fermentation Time — Hold &amp; Earn
          </motion.h3>
          <motion.p 
            variants={itemVariants}
            className="text-cream/50 text-center mb-12 max-w-2xl mx-auto"
          >
            Your holding period determines your Baker level. Sell and your timer resets to zero.
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
                  <p className={`text-2xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mt-2`}>
                    {tier.multiplier}
                  </p>
                  <p className="text-cream/40 text-xs">reward multiplier</p>
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

        {/* Reward Programs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.h3 
            variants={itemVariants}
            className="font-cinzel text-2xl md:text-3xl text-center text-cream mb-12"
          >
            💰 Earn More MAYA
          </motion.h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {rewardPrograms.map((program, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative p-8 rounded-2xl glass-gold border border-gold/20 hover:border-gold/40 transition-all duration-500"
              >
                {/* Program Header */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-6`}>
                  <program.icon className="w-8 h-8 text-white" />
                </div>

                <h4 className="font-cinzel text-xl font-bold text-cream mb-3">
                  {program.title}
                </h4>
                <p className="text-cream/60 text-sm mb-6">
                  {program.description}
                </p>

                {/* Tiers/Actions */}
                <div className="space-y-3 mb-6">
                  {program.tiers.map((tier, tIndex) => (
                    <div key={tIndex} className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                      <div>
                        <p className="text-cream/80 text-sm font-medium">
                          {tier.label}
                        </p>
                        {tier.note && (
                          <p className="text-cream/40 text-xs">{tier.note}</p>
                        )}
                      </div>
                      <p className={`font-bold bg-gradient-to-r ${program.color} bg-clip-text text-transparent`}>
                        {tier.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bonus */}
                <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gold" />
                    <span className="text-gold text-sm font-medium">Bonus</span>
                  </div>
                  <p className="text-cream/70 text-sm mt-1">{program.bonus}</p>
                </div>
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
          <p className="text-cream/60 mb-6">Ready to start earning?</p>
          <motion.a
            href="https://t.me/mayastarter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel font-bold rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Gift className="w-5 h-5" />
            JOIN THE BAKERY
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
