"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Fingerprint,
  Handshake,
  Flame,
  Factory,
  Download,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Users,
  Landmark,
  TrendingDown,
  Crown,
  Timer,
  Bot,
} from "lucide-react";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] as const },
  },
} as const;

interface Section {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  howItWorks: string[];
  color: string;
  borderColor: string;
  phase: string;
}

function ExpandableCard({ section }: { section: Section }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div variants={cardVariants} className="group relative">
      <div className={`h-full rounded-2xl glass-gold border ${section.borderColor} hover:border-gold/30 transition-all duration-500 overflow-hidden`}>
        <div className={`h-1 w-full bg-gradient-to-r ${section.color}`} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
              {section.phase}
            </span>
            <section.icon className="w-4 h-4 text-cream/25" />
          </div>
          <h3 className="font-cinzel text-base font-bold text-cream mb-2">{section.title}</h3>
          <p className="text-cream/50 text-sm leading-relaxed mb-3">{section.description}</p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-gold/60 hover:text-gold text-sm font-medium transition-colors"
          >
            <span>{isExpanded ? "Hide details" : "How it works"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
          </button>
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-cream/10">
              <ul className="space-y-2.5">
                {section.howItWorks.map((step, sIndex) => (
                  <li key={sIndex} className="flex items-start gap-2.5 text-sm text-cream/45">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center text-[10px] font-bold text-white`}>
                      {sIndex + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Whitepaper() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sections: Section[] = [
    // THE THREE PILLARS
    {
      icon: Fingerprint,
      title: "The Crust — Own Your Reputation",
      description: "Your reputation is yours. Not on a platform — on the chain. Portable, undeletable, unsellable. Every successful Bake thickens your Crust.",
      howItWorks: [
        "Soulbound identity created on-chain — cannot be sold or transferred",
        "Every completed Bake (trade/agreement) strengthens your Crust score",
        "Portable across every Oven (chain) SOUR deploys to",
        "Other protocols can query your Crust via API — composable trust",
        "No platform can erase your economic history — it's yours forever",
      ],
      color: "from-gold to-amber-500",
      borderColor: "border-gold/10",
      phase: "PILLAR I",
    },
    {
      icon: Handshake,
      title: "The Handshake — Trade Without Walls",
      description: "Two people, one Recipe. No middleman, no borders, no waiting. Code guards the deal, the Starter carries the payment.",
      howItWorks: [
        "Smart contract (Recipe) defines terms — deliverables, deadlines, payment",
        "Both parties sign with wallets — immutable on-chain agreement",
        "Borderless instant settlement — seconds, not days",
        "1-3% Pinch vs 15-20% traditional platform fees",
        "Community-set fee rates — the Bakers decide, not a corporation",
      ],
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/10",
      phase: "PILLAR II",
    },
    {
      icon: Flame,
      title: "The Harvest — Grow Together",
      description: "Every Bake returns a Pinch to the Oven. 50% burns forever. 30% flows to Keepers. 20% to Commons. The network grows, everyone grows.",
      howItWorks: [
        "Every Bake generates a Pinch (1-3% fee)",
        "50% of the Pinch is burned — permanent supply reduction",
        "30% distributed to Keepers — tier-weighted, in $SOUR",
        "20% flows to Commons Bakery — community treasury for growth",
        "No inflation mechanics — real revenue from real protocol activity",
      ],
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/10",
      phase: "PILLAR III",
    },
    {
      icon: Factory,
      title: "The Mill — Automate Everything",
      description: "A decentralized marketplace for AI workflows, agents, and automations. Creators list, buyers purchase via Handshake, reputation builds on Crust.",
      howItWorks: [
        "Creators upload AI workflows — prompt chains, automations, agent configs",
        "Every purchase = a Handshake smart contract — trustless, escrowed",
        "Crust-verified creators get priority listing and trust badges",
        "Revenue: creator royalties + subscription tiers + agent fuel ($SOUR)",
        "Sandbox environment for testing workflows before buying",
      ],
      color: "from-violet-500 to-purple-500",
      borderColor: "border-violet-500/10",
      phase: "PILLAR IV",
    },
    // ECONOMICS
    {
      icon: TrendingDown,
      title: "Deflationary Burns",
      description: "50% of all protocol fees buy $SOUR from market and burn it. Fixed supply. No minting. Your share grows automatically over time.",
      howItWorks: [
        "Every Bake → 1-3% Pinch → 50% directed to burn",
        "$SOUR bought from open market → sent to burn address → gone forever",
        "Total supply: 1B. Burns only reduce — nothing mints",
        "Year 5 projection: ~600M supply → 0.10% holding becomes 0.167%",
        "67% ownership increase — zero effort, just hold",
      ],
      color: "from-red-500 to-orange-500",
      borderColor: "border-red-500/10",
      phase: "ECONOMICS",
    },
    {
      icon: Crown,
      title: "Keeper Tiers",
      description: "Hold longer, earn more. Four tiers based on hold duration. Higher tier = more Harvest weight + governance power. Sell = reset everything.",
      howItWorks: [
        "Fresh Dough (Day 1): Community access, Baker identity",
        "Rising Dough (30 days): Harvest eligibility, reduced Pinch, DAO voting",
        "Golden Crust (90 days): 1.5x Harvest weight, Recipe proposals",
        "Eternal Starter (365 days): 2x Harvest weight, governance veto, Elder status",
        "Sell even once → tier resets to Fresh Dough, hold timer restarts from zero",
      ],
      color: "from-amber-400 to-yellow-500",
      borderColor: "border-amber-400/10",
      phase: "ECONOMICS",
    },
    {
      icon: Timer,
      title: "Sell = Reset",
      description: "The core loyalty mechanic. Sell your Starter → tier resets, Harvest stops, Crust thins. Diamond hands aren't a meme — they're the economic model.",
      howItWorks: [
        "Any sell transaction triggers a full tier reset",
        "Hold timer restarts from zero — no shortcuts",
        "Harvest distribution stops immediately",
        "Crust score receives a penalty",
        "Reduces sell pressure → creates economic stability",
      ],
      color: "from-rose-500 to-pink-500",
      borderColor: "border-rose-500/10",
      phase: "ECONOMICS",
    },
    // GOVERNANCE
    {
      icon: Landmark,
      title: "Commons Bakery",
      description: "20% of all protocol revenue flows to the community treasury. Quadratic voting ensures democracy. Reputation-gated proposals.",
      howItWorks: [
        "20% of every Pinch auto-fills the Commons — no vote needed to fund",
        "Spending decisions via quadratic voting: Power = √(tokens committed)",
        "Whale with 10,000 tokens gets 100 votes, not 10,000 — democracy first",
        "Only Keepers with active tier can vote — no sybil attacks",
        "Golden Crust+ can submit Recipe proposals for ecosystem grants",
      ],
      color: "from-purple-500 to-violet-500",
      borderColor: "border-purple-500/10",
      phase: "GOVERNANCE",
    },
    {
      icon: Users,
      title: "The Bakery DAO",
      description: "Progressive decentralization toward full community governance. Recipe Bounties reward builders. Mill Guilds organize talent. The Bakers run everything.",
      howItWorks: [
        "Phase 1: Snapshot.org off-chain voting + multisig treasury",
        "Phase 2: On-chain Solana Realms governance + community proposals",
        "Phase 3: Full Bakery DAO — Bakers control all protocol parameters",
        "Recipe Bounties: Mini Bake (100 $SOUR) → Eternal Bake (50K+ $SOUR)",
        "5 Mill Guilds: Protocol, Frontend, Design, Community, Security",
      ],
      color: "from-indigo-500 to-blue-500",
      borderColor: "border-indigo-500/10",
      phase: "GOVERNANCE",
    },
    {
      icon: Bot,
      title: "Community Ownership",
      description: "Open source. Open recipes. Anyone can propose new protocols. The community votes, builds, audits, and deploys.",
      howItWorks: [
        "PROPOSE: Any Rising Dough+ Keeper can submit a protocol idea",
        "REVIEW: Community discussion + technical feasibility check",
        "BUILD: Recipe Bounty posted, builders compete or collaborate",
        "AUDIT: Security Guild reviews code, community tests on devnet",
        "DEPLOY: DAO vote to merge — approved protocols go live",
      ],
      color: "from-teal-500 to-emerald-500",
      borderColor: "border-teal-500/10",
      phase: "GOVERNANCE",
    },
    // INFRASTRUCTURE
    {
      icon: Shield,
      title: "Security Architecture",
      description: "Isolated contracts per Handshake. Multisig treasury. 48h timelock. Open source. Non-custodial. No backdoors.",
      howItWorks: [
        "Each Handshake = isolated smart contract — no shared pool risk",
        "Squads Protocol multisig with 48h timelock on large transactions",
        "Mint authority revoked — no one can create new tokens",
        "Freeze authority revoked — no one can freeze your tokens",
        "Open source codebase — publicly auditable by anyone",
      ],
      color: "from-emerald-500 to-green-500",
      borderColor: "border-emerald-500/10",
      phase: "SECURITY",
    },
    {
      icon: Globe,
      title: "Every Oven, Every Flame",
      description: "SOUR starts on Solana but is designed for every chain. Wherever the flame burns, the Starter rises. Multichain is the endgame.",
      howItWorks: [
        "Genesis on Solana — fast, cheap, battle-tested",
        "Architecture designed for multichain from day one",
        "Your Crust (reputation) travels across every Oven",
        "Same protocol, same Harvest — chain-agnostic value",
        "The Civilization doesn't depend on one chain's survival",
      ],
      color: "from-cyan-500 to-teal-500",
      borderColor: "border-cyan-500/10",
      phase: "VISION",
    },
  ];

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="whitepaper">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gold/4 rounded-full blur-[180px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/4 rounded-full blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6"
            whileHover={{ scale: 1.05 }}
          >
            📜 WHITEPAPER v5.0
          </motion.span>

          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              The Civilization Protocol
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-3xl mx-auto text-base mb-4">
            Four pillars. One civilization. The Crust protects your identity.
            The Handshake enables trustless trade. The Harvest rewards everyone who builds.
            The Mill automates everything.
          </p>
          <p className="font-inter text-gold/50 max-w-xl mx-auto text-sm italic">
            Click &ldquo;How it works&rdquo; on any card for step-by-step mechanics.
          </p>

          {/* Download */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.a
              href="/docs/whitepaper.md"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-base shadow-lg shadow-gold/20"
            >
              <Download className="w-5 h-5" />
              Read Full Whitepaper
            </motion.a>
            <motion.a
              href="https://github.com/SourDaoxyx"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-gold/30 text-gold font-bold text-base hover:bg-gold/5 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              GitHub
            </motion.a>
          </div>
        </motion.div>

        {/* Architecture Diagram — 3 Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-14 p-6 md:p-8 rounded-2xl glass-gold border border-gold/20"
        >
          <h3 className="font-cinzel text-lg font-bold text-cream text-center mb-6">Civilization Architecture</h3>

          <div className="space-y-2.5">
            {[
              { label: "PILLAR IV — THE MILL", bgOuter: "bg-violet-500/5 border-violet-500/15", textLabel: "text-violet-400", bgTag: "bg-violet-500/10 text-violet-300", items: ["AI Workflows 🤖", "Agent Marketplace", "Creator Royalties", "Sandbox"] },
              { label: "PILLAR III — THE HARVEST", bgOuter: "bg-orange-500/5 border-orange-500/15", textLabel: "text-orange-400", bgTag: "bg-orange-500/10 text-orange-300", items: ["50% Burn 🔥", "30% Keepers 🌾", "20% Commons 🏛️"] },
              { label: "PILLAR II — THE HANDSHAKE", bgOuter: "bg-blue-500/5 border-blue-500/15", textLabel: "text-blue-400", bgTag: "bg-blue-500/10 text-blue-300", items: ["Smart Contracts", "Borderless Settlement", "1-3% Pinch"] },
              { label: "PILLAR I — THE CRUST", bgOuter: "bg-amber-500/5 border-amber-500/15", textLabel: "text-amber-400", bgTag: "bg-amber-500/10 text-amber-300", items: ["Soulbound Identity", "Portable Reputation", "On-Chain Crust"] },
              { label: "FOUNDATION", bgOuter: "bg-emerald-500/5 border-emerald-500/15", textLabel: "text-emerald-400", bgTag: "bg-emerald-500/10 text-emerald-300", items: ["$SOUR Token", "Community Owned", "LP Burned", "Mint Revoked"] },
            ].map((layer, i) => (
              <div key={i} className={`p-3.5 rounded-xl border ${layer.bgOuter}`}>
                <span className={`text-[10px] font-bold tracking-wider ${layer.textLabel}`}>{layer.label}</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {layer.items.map((item, j) => (
                    <span key={j} className={`px-2.5 py-1 rounded-md text-[11px] font-medium ${layer.bgTag}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2.5 mt-5 text-cream/25 text-xs flex-wrap">
            <span>Bake</span>
            <ArrowRight className="w-3 h-3" />
            <span>Pinch (1-3%)</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-orange-400">50% Burn</span>
            <span>+</span>
            <span className="text-amber-400">30% Keepers</span>
            <span>+</span>
            <span className="text-purple-400">20% Commons</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-violet-400">Mill Scales</span>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {sections.map((section, index) => (
            <ExpandableCard key={index} section={section} />
          ))}
        </motion.div>

        {/* Revenue Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-14 p-8 rounded-2xl glass-gold border border-gold/20"
        >
          <h3 className="font-cinzel text-xl font-bold text-cream text-center mb-6">
            The Harvest — Every Bake Powers the Civilization
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="text-center px-6 py-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-blue-400 font-bold text-sm">HANDSHAKE</p>
              <p className="text-cream/40 text-xs mt-1">1-3% Pinch per Bake</p>
            </div>

            <ArrowRight className="w-5 h-5 text-gold/30 rotate-90 md:rotate-0" />

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Burn", pct: "50%", colorBg: "bg-orange-500/10", colorBorder: "border-orange-500/20", colorText: "text-orange-400" },
                { label: "Keepers", pct: "30%", colorBg: "bg-amber-500/10", colorBorder: "border-amber-500/20", colorText: "text-amber-400" },
                { label: "Commons", pct: "20%", colorBg: "bg-purple-500/10", colorBorder: "border-purple-500/20", colorText: "text-purple-400" },
              ].map((item, i) => (
                <div key={i} className={`text-center px-4 py-3 rounded-xl ${item.colorBg} border ${item.colorBorder}`}>
                  <p className={`${item.colorText} font-bold text-lg`}>{item.pct}</p>
                  <p className={`${item.colorText} font-bold text-xs`}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-cream/35 text-sm mt-6">
            No tokens minted. No staking inflation. All rewards in $SOUR. Real revenue from real Bakes.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
