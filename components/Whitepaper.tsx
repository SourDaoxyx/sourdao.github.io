"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  FileText,
  ShieldCheck,
  Handshake,
  Store,
  Landmark,
  Flame,
  BarChart3,
  Lock,
  Download,
  ExternalLink,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 0.61, 0.36, 1] as const,
    },
  },
} as const;

interface Section {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
  color: string;
}

export default function Whitepaper() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sections: Section[] = [
    {
      icon: FileText,
      title: "The Problem",
      description: "Traditional freelance platforms extract 20-30% fees, leaving workers at the mercy of centralized gatekeepers.",
      details: [
        "Platforms capture value, not creators",
        "No ownership stake for participants",
        "Opaque dispute resolution",
        "Zero portability of reputation",
      ],
      color: "from-red-500 to-orange-500",
    },
    {
      icon: Handshake,
      title: "Starter Culture Model",
      description: "MAYA is a solidarity marketplace — a two-layer protocol where every trade strengthens the community.",
      details: [
        "Layer 1: Escrow-secured P2P marketplace",
        "Layer 2: Opt-in Commons Treasury + DAO",
        "Token = access key + governance + reputation",
        "Revenue from real usage, not speculation",
      ],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: ShieldCheck,
      title: "Escrow Protocol",
      description: "Every trade is secured by on-chain escrow. Funds release only when both parties confirm completion.",
      details: [
        "Buyer deposits → escrow holds → seller delivers",
        "Milestone-based partial releases",
        "3-of-5 arbiter DAO for disputes",
        "1-3% fee funds the entire ecosystem",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Store,
      title: "Proof-of-Value Bonds",
      description: "Prepaid work vouchers that let skilled workers sell future capacity at a discount — forward contracts for labor.",
      details: [
        "Worker mints bond → buyer purchases at discount",
        "Redeemable for specific services",
        "Tradeable on secondary market",
        "Builds verifiable reputation on-chain",
      ],
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Landmark,
      title: "Commons Treasury",
      description: "An opt-in community savings pool governed by quadratic voting. Real solidarity, not forced taxation.",
      details: [
        "30% of protocol revenue → Commons",
        "Quadratic voting prevents whale dominance",
        "Revenue-Based Financing for micro-loans",
        "Repayment as % of future earnings",
      ],
      color: "from-amber-500 to-yellow-500",
    },
    {
      icon: Flame,
      title: "Revenue & Burn",
      description: "Sustainable deflationary model powered by real marketplace activity — not empty promises.",
      details: [
        "1-3% escrow fee on every trade",
        "50% → Operations & development",
        "30% → Commons Treasury",
        "20% → Buyback & permanent burn",
      ],
      color: "from-orange-500 to-red-500",
    },
    {
      icon: BarChart3,
      title: "Token Utility",
      description: "MAYA isn't just a token — it's the key to a solidarity economy. Real utility, real governance, real value.",
      details: [
        "Access key to marketplace features",
        "Governance voting weight",
        "Reputation anchor for trust scores",
        "Bond collateral & staking for arbiters",
      ],
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Lock,
      title: "Security Architecture",
      description: "Multi-layered security with no single point of failure. Your funds are always in your control.",
      details: [
        "Squads Protocol multisig treasury",
        "Time-locked smart contract upgrades",
        "Third-party audited escrow contracts",
        "Progressive decentralization roadmap",
      ],
      color: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="whitepaper">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6"
            whileHover={{ scale: 1.05 }}
          >
            📜 WHITEPAPER
          </motion.span>

          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              The Blueprint
            </span>
          </h2>

          <p className="font-inter text-cream/60 max-w-3xl mx-auto text-lg mb-10">
            MAYA is not a memecoin. It&apos;s a solidarity marketplace protocol — escrow-secured P2P trading,
            community treasury, and deflationary tokenomics powered by real revenue.
          </p>

          {/* Download Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/docs/whitepaper.md"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-lg shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-shadow"
            >
              <Download className="w-5 h-5" />
              Read Full Whitepaper
            </motion.a>
            <motion.a
              href="https://github.com/mayastarter"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-gold/30 text-gold font-bold text-lg hover:bg-gold/5 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              View on GitHub
            </motion.a>
          </div>
        </motion.div>

        {/* Sections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative"
            >
              <div className="h-full p-6 rounded-2xl glass-gold border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:-translate-y-1">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <section.icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-lg font-bold text-cream mb-2">{section.title}</h3>

                {/* Description */}
                <p className="text-cream/60 text-sm leading-relaxed mb-4">{section.description}</p>

                {/* Details */}
                <ul className="space-y-2">
                  {section.details.map((detail, dIndex) => (
                    <li key={dIndex} className="flex items-start gap-2 text-xs text-cream/50">
                      <span className="w-1 h-1 rounded-full bg-gold/50 mt-1.5 shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 p-8 rounded-2xl glass-gold border border-gold/20"
        >
          <h3 className="font-cinzel text-2xl font-bold text-cream text-center mb-8">Revenue Flow</h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Source */}
            <div className="text-center px-6 py-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-blue-400 font-bold text-sm">MARKETPLACE</p>
              <p className="text-cream/50 text-xs mt-1">1-3% escrow fee</p>
            </div>

            <div className="text-gold text-2xl hidden md:block">→</div>
            <div className="text-gold text-2xl md:hidden rotate-90">→</div>

            {/* Split */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="text-center px-5 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-green-400 font-bold text-sm">50% OPS</p>
                <p className="text-cream/50 text-xs mt-1">Development</p>
              </div>
              <div className="text-center px-5 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-purple-400 font-bold text-sm">30% COMMONS</p>
                <p className="text-cream/50 text-xs mt-1">Treasury</p>
              </div>
              <div className="text-center px-5 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <p className="text-orange-400 font-bold text-sm">20% BURN</p>
                <p className="text-cream/50 text-xs mt-1">Buyback & Burn</p>
              </div>
            </div>
          </div>

          <p className="text-center text-cream/40 text-sm mt-6">
            Every trade makes MAYA scarcer. Real revenue. Real deflation. No empty promises.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
