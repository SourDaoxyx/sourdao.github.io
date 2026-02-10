'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Fingerprint,
  ShieldCheck,
  Handshake,
  Store,
  Users,
  Sparkles,
  Crown,
  Flame,
  Target,
  Layers,
  Award,
  Rocket,
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

interface EcosystemLayer {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  color: string;
  gradient: string;
}

export default function Rewards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const ecosystemLayers: EcosystemLayer[] = [
    {
      icon: Handshake,
      title: "Escrow Marketplace",
      subtitle: "Trade with Trust",
      description: "Every trade is secured by smart contracts and AI-verified agreements. No middlemen. No disputes. Just code and trust.",
      features: [
        "AI-verified smart contracts — both sides sign crypto agreements with measurable terms",
        "Milestone-based escrow releases — pay as work progresses",
        "AI agent validates completion — no subjective disputes",
        "1-3% fee funds the entire ecosystem",
      ],
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
    },
    {
      icon: Store,
      title: "Production Bonds",
      subtitle: "Fund the Future",
      description: "Sell your future production at a discount. Get capital today. Deliver tomorrow. Not debt — pre-orders secured by blockchain.",
      features: [
        "Mint bonds for future work or products — like Kickstarter on Solana",
        "Staged releases protect both sides — escrow unlocks as you deliver",
        "Tradeable on secondary market — your reputation has market value",
        "Zero interest, zero debt — just forward contracts for value",
      ],
      color: "from-purple-500 to-violet-500",
      gradient: "bg-gradient-to-br from-purple-500/10 to-violet-500/5",
    },
    {
      icon: Fingerprint,
      title: "Reputation NFT",
      subtitle: "Your On-Chain Identity",
      description: "A dynamic soulbound NFT that evolves with every trade, bond, and contribution. More valuable than any token reward.",
      features: [
        "Soulbound — cannot be sold, only earned through action",
        "Dynamically updates — visuals change as your tier grows",
        "Portable across Web3 — your reputation travels with you",
        "Unlocks higher bond limits, lower fees, arbiter eligibility",
      ],
      color: "from-gold to-amber-500",
      gradient: "bg-gradient-to-br from-gold/10 to-amber-500/5",
    },
    {
      icon: Users,
      title: "Skill Guilds",
      subtitle: "Self-Organized Tribes",
      description: "Community-created guilds for every skill. No central authority assigns you — you find your tribe, prove your craft, build your name.",
      features: [
        "Community creates and governs guilds organically",
        "Guild-level reputation — your guild's success is yours",
        "Collective bonds — guilds can take on larger projects together",
        "On-chain portfolio — verified work history for every member",
      ],
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500/10 to-emerald-500/5",
    },
    {
      icon: Target,
      title: "Community Challenges",
      subtitle: "The Culture Grows Itself",
      description: "No rewards from us. No tokens distributed. The community self-organizes challenges. Your reputation is the prize.",
      features: [
        "Weekly bake-offs — community votes on best work",
        "Collab sprints — random teams, real deadlines, shipped products",
        "Seasonal leaderboards — Hall of Fame on-chain forever",
        "Reputation gains unlock real benefits: better bond terms, lower fees",
      ],
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-500/10 to-red-500/5",
    },
    {
      icon: Rocket,
      title: "Community Launchpad",
      subtitle: "From Ideas to Empires",
      description: "Got a project? The community funds it, staffs it, and shares in the returns. Commons Treasury backs real builders.",
      features: [
        "Submit your idea — community reviews and votes",
        "Funded by Commons Treasury — no VCs, no gatekeepers",
        "Guild members staff the team — talent from within",
        "Revenue flows back — 15% to Commons, growing the fund",
      ],
      color: "from-cyan-500 to-blue-500",
      gradient: "bg-gradient-to-br from-cyan-500/10 to-blue-500/5",
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
            🧬 THE LIVING ECOSYSTEM
          </motion.span>

          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              THE CULTURE GROWS ITSELF
            </span>
          </h2>

          <p className="font-inter text-cream/60 max-w-3xl mx-auto text-lg">
            Like sourdough starter that transforms flour and water into living bread,
            MAYA transforms holders into a self-sustaining economy. No handouts. No fake rewards.
            Your reputation is the real currency. Your contribution is the real yield.
          </p>
        </motion.div>

        {/* Evolution Metaphor Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 p-8 rounded-2xl glass-gold border border-gold/20 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">🌾</span>
              <p className="text-cream/40 text-xs uppercase tracking-wider">10,000 BC</p>
              <p className="text-cream/70 text-sm font-medium">Grain Fermentation</p>
              <p className="text-cream/40 text-xs">Invented bread &amp; beer</p>
            </div>
            <Flame className="w-5 h-5 text-gold/40 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">🏺</span>
              <p className="text-cream/40 text-xs uppercase tracking-wider">3,000 BC</p>
              <p className="text-cream/70 text-sm font-medium">Trade &amp; Currency</p>
              <p className="text-cream/40 text-xs">Grain became money</p>
            </div>
            <Flame className="w-5 h-5 text-gold/40 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">🏦</span>
              <p className="text-cream/40 text-xs uppercase tracking-wider">1400 AD</p>
              <p className="text-cream/70 text-sm font-medium">Banking System</p>
              <p className="text-cream/40 text-xs">Trust centralized</p>
            </div>
            <Flame className="w-5 h-5 text-gold/40 rotate-90 md:rotate-0" />
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-2">🍞</span>
              <p className="text-cream/40 text-xs uppercase tracking-wider">2026</p>
              <p className="text-gold text-sm font-bold">MAYA</p>
              <p className="text-cream/40 text-xs">Trust decentralized</p>
            </div>
          </div>
          <p className="text-cream/50 text-sm mt-6 max-w-2xl mx-auto italic">
            &ldquo;Sourdough starter didn&apos;t just make bread — it made civilization.
            MAYA doesn&apos;t just make trades — it makes trust obsolete.&rdquo;
          </p>
        </motion.div>

        {/* Ecosystem Layers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {ecosystemLayers.map((layer, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className={`relative p-8 rounded-2xl ${layer.gradient} border border-gold/10 hover:border-gold/30 transition-all duration-500`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-5`}>
                <layer.icon className="w-7 h-7 text-white" />
              </div>

              {/* Header */}
              <p className={`text-xs font-bold tracking-wider uppercase bg-gradient-to-r ${layer.color} bg-clip-text text-transparent mb-1`}>
                {layer.subtitle}
              </p>
              <h3 className="font-cinzel text-xl font-bold text-cream mb-3">{layer.title}</h3>
              <p className="text-cream/60 text-sm mb-5 leading-relaxed">{layer.description}</p>

              {/* Features */}
              <ul className="space-y-3">
                {layer.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-sm text-cream/50">
                    <Sparkles className="w-3 h-3 text-gold/50 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Philosophy Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="relative p-10 rounded-2xl glass-gold border border-gold/20 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-gold" />
              <Layers className="w-8 h-8 text-gold/60" />
              <Crown className="w-8 h-8 text-gold/40" />
            </div>
          </div>
          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-cream mb-4">
            Why We Don&apos;t Give Away Tokens
          </h3>
          <p className="text-cream/60 max-w-3xl mx-auto text-lg leading-relaxed mb-6">
            Most projects bribe you with airdrops and &ldquo;staking rewards&rdquo; funded by diluting your holdings.
            We don&apos;t. You buy MAYA because you believe. You build reputation because you contribute.
            Your Reputation NFT — earned through real work — is worth more than any airdrop ever could be.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
            <div className="flex items-center gap-2 text-cream/50">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>No token inflation</span>
            </div>
            <div className="flex items-center gap-2 text-cream/50">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Only burns, never mints</span>
            </div>
            <div className="flex items-center gap-2 text-cream/50">
              <Fingerprint className="w-4 h-4 text-gold" />
              <span>Reputation &gt; Rewards</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
