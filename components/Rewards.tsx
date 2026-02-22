"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Handshake,
  Store,
  Fingerprint,
  Bot,
  Building2,
  Globe,
  GraduationCap,
  Rocket,
  HeartHandshake,
  Network,
  Users,
  Server,
  MessageCircle,
  HardDrive,
  Sparkles,
  Flame,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
} as const;

interface Protocol {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  color: string;
  gradient: string;
}

export default function Rewards() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const coreEngine: Protocol[] = [
    {
      icon: Handshake,
      title: "AI-Verified Escrow",
      tagline: "Trade with Trust, Not Faith",
      description:
        "Both parties sign crypto contracts. AI verifies completion. No subjective disputes. 1-3% fee powers the entire ecosystem.",
      features: [
        "Crypto-signed contracts with measurable deliverables",
        "AI agent validates: files delivered? format correct? deadline met?",
        "Milestone-based escrow — pay as work progresses",
        "Fee funds burn + holders + commons treasury",
      ],
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500/10 to-cyan-500/5",
    },
    {
      icon: Store,
      title: "Production Bonds",
      tagline: "Kickstarter on Solana",
      description:
        "Sell future production at a discount. Get capital today without debt. Deliver tomorrow. Zero interest, zero middlemen.",
      features: [
        "Mint bonds for future work — bakers, devs, artisans",
        "Staged escrow releases per batch delivery",
        "Tradeable SPL tokens — secondary market for future labor",
        "Default protection: undelivered = auto-refund + reputation loss",
      ],
      color: "from-purple-500 to-violet-500",
      gradient: "bg-gradient-to-br from-purple-500/10 to-violet-500/5",
    },
    {
      icon: Fingerprint,
      title: "Reputation Protocol (RaaS)",
      tagline: "Web3's Trust Infrastructure",
      description:
        "Your soulbound NFT isn't just for SOUR — any Web3 project queries your score via API. SOUR becomes the trust layer of the internet.",
      features: [
        "Soulbound NFT — can't sell, can't fake, evolves visually",
        "Open API/SDK for external protocols to read SOUR reputation",
        "SOUR tokens required per query = permanent token demand",
        "Score formula: trade_value × completion × time × bond_factor",
      ],
      color: "from-gold to-amber-500",
      gradient: "bg-gradient-to-br from-gold/10 to-amber-500/5",
    },
  ];

  const intelligenceLayer: Protocol[] = [
    {
      icon: Bot,
      title: "AI Agent Marketplace",
      tagline: "Your AI Works While You Sleep",
      description:
        "Build AI agents that trade on the marketplace 24/7. Same escrow system, same reputation rules. Passive income — verified.",
      features: [
        "Create agents for design, translation, code review",
        "Agents earn their own reputation score",
        "You earn passively across all time zones",
        "Bad output = reputation loss, same as humans",
      ],
      color: "from-cyan-500 to-teal-500",
      gradient: "bg-gradient-to-br from-cyan-500/10 to-teal-500/5",
    },
    {
      icon: GraduationCap,
      title: "Proof-of-Skill",
      tagline: "Your Work IS Your Diploma",
      description:
        "Every completed trade becomes verified credentials. 10 logos = Verified Designer. On-chain, permanent, impossible to fake.",
      features: [
        "Auto-generated from completed escrow trades",
        "Replaces LinkedIn, CVs, university degrees",
        "Tiers: Beginner (5) → Skilled (25) → Expert (100) → Master",
        "Employers filter by verified proof, not promises",
      ],
      color: "from-rose-500 to-pink-500",
      gradient: "bg-gradient-to-br from-rose-500/10 to-pink-500/5",
    },
    {
      icon: Users,
      title: "Reputation Lending",
      tagline: "Mentorship On-Chain",
      description:
        "A Master Baker vouches for a newcomer. The newcomer gets temporary tier access. If they fail, both lose reputation. True skin in the game.",
      features: [
        "Elder members vouch for talented newcomers",
        "Temporary tier boost for 30 days or 3 trades",
        "If mentee fails, mentor's reputation drops too",
        "Real-world referral system, coded on-chain",
      ],
      color: "from-amber-500 to-orange-500",
      gradient: "bg-gradient-to-br from-amber-500/10 to-orange-500/5",
    },
  ];

  const communityLayer: Protocol[] = [
    {
      icon: Building2,
      title: "Guild Enterprise",
      tagline: "Ten Bakers Build an Empire",
      description:
        "Solo freelancers can't land $50K contracts. Guilds can. Form teams, bid on enterprise work, auto-split revenue via smart contracts.",
      features: [
        "Complementary skill members form guilds",
        "Smart contract defines roles + payment splits",
        "Guild reputation = weighted member average",
        "Enterprise clients get fair-rate decentralized teams",
      ],
      color: "from-emerald-500 to-green-500",
      gradient: "bg-gradient-to-br from-emerald-500/10 to-green-500/5",
    },
    {
      icon: HeartHandshake,
      title: "Solidarity Insurance",
      tagline: "Solidarity — Coded On-Chain",
      description:
        "Freelance world's biggest fear: no work, no safety net. The Mutual Aid Pool helps members through illness, disaster, or hardship — voted by the community.",
      features: [
        "Funded from Commons Treasury (% of revenue)",
        "Tier 3+ members eligible (90 days, 20+ trades)",
        "Community votes on disbursement — no central authority",
        "Faizsiz support: $500-$2,000 for emergencies",
      ],
      color: "from-pink-500 to-rose-500",
      gradient: "bg-gradient-to-br from-pink-500/10 to-rose-500/5",
    },
    {
      icon: Globe,
      title: "Cross-Border Solidarity",
      tagline: "The Silk Road of Value",
      description:
        "Turkish designer serves US client. USDC on Solana. 1-2% total vs 7-10% via banks. Reputation crosses every border.",
      features: [
        "Borderless marketplace — talent meets capital globally",
        "USDC escrow: stable, instant, no bank delays",
        "70% cheaper than traditional cross-border payments",
        "Universal reputation — skills speak every language",
      ],
      color: "from-indigo-500 to-blue-500",
      gradient: "bg-gradient-to-br from-indigo-500/10 to-blue-500/5",
    },
  ];

  const infrastructureLayer: Protocol[] = [
    {
      icon: MessageCircle,
      title: "Sour Agora",
      tagline: "Our Own Social Network",
      description:
        "Not Discord. Not Telegram. A wallet-based social network where your identity IS your reputation. No bans. No centralized control. Your data is yours.",
      features: [
        "Wallet-based login — no emails, no passwords",
        "Profile = Reputation NFT + skill badges",
        "Guild channels auto-created",
        "No ads, no tracking, no centralized moderation",
      ],
      color: "from-violet-500 to-purple-500",
      gradient: "bg-gradient-to-br from-violet-500/10 to-purple-500/5",
    },
    {
      icon: HardDrive,
      title: "Sour Vault Network",
      tagline: "Every Computer is a Server",
      description:
        "Members donate 10-100GB from their computers. Combined, it becomes a decentralized storage network. Provide space = earn rewards. No AWS needed.",
      features: [
        "Encrypted + sharded data across nodes",
        "No single node sees full data — privacy by design",
        "3x redundancy — one node dies, data survives",
        "Storage providers earn USDC rewards",
      ],
      color: "from-teal-500 to-cyan-600",
      gradient: "bg-gradient-to-br from-teal-500/10 to-cyan-600/5",
    },
    {
      icon: Server,
      title: "Sour Daemon",
      tagline: "Your Local AI Agent",
      description:
        "A lightweight AI running on your own computer. Learns your style. Does simple tasks while you sleep. Federated learning — collective intelligence, individual privacy.",
      features: [
        "Runs local models (Llama, Mistral, Phi) on your machine",
        "Learns from your past work — your digital clone",
        "Federated learning: models improve together, data stays local",
        "Earns through escrow — same verification as human work",
      ],
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-500/10 to-red-500/5",
    },
  ];

  const renderProtocolGrid = (protocols: Protocol[], columns: string) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`grid grid-cols-1 ${columns} gap-5 mb-12`}
    >
      {protocols.map((protocol, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ y: -6 }}
          className={`relative p-7 rounded-2xl ${protocol.gradient} border border-gold/10 hover:border-gold/25 transition-all duration-500`}
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${protocol.color} flex items-center justify-center mb-4`}>
            <protocol.icon className="w-6 h-6 text-white" />
          </div>
          <p className={`text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r ${protocol.color} bg-clip-text text-transparent mb-1`}>
            {protocol.tagline}
          </p>
          <h3 className="font-cinzel text-lg font-bold text-cream mb-2">
            {protocol.title}
          </h3>
          <p className="text-cream/55 text-sm mb-4 leading-relaxed">
            {protocol.description}
          </p>
          <ul className="space-y-2">
            {protocol.features.map((feature, fi) => (
              <li key={fi} className="flex items-start gap-2 text-sm text-cream/45">
                <Sparkles className="w-3 h-3 text-gold/40 mt-1 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderSectionHeader = (
    icon: React.ComponentType<{ className?: string }>,
    title: string,
    subtitle: string,
    color: string,
    delay: number
  ) => {
    const Icon = icon;
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay }}
        className="flex items-center gap-3 mb-6"
      >
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-cinzel text-xl font-bold text-cream">{title}</h3>
          <p className="text-cream/40 text-sm">{subtitle}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="ecosystem">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/4 rounded-full blur-[120px]" />
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
            🧬 THE ECOSYSTEM
          </motion.span>

          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              NOT A TOKEN. A CIVILIZATION.
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-3xl mx-auto text-lg">
            Fifteen protocols across four layers. Marketplace, intelligence,
            community, and infrastructure — each feeding the next. Web3&apos;s first
            complete civilization stack.
          </p>
        </motion.div>

        {/* Evolution Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16 p-6 md:p-8 rounded-2xl glass-gold border border-gold/20 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {[
              { emoji: "🌾", year: "10,000 BC", title: "Grain", desc: "Bread & beer" },
              { emoji: "🏺", year: "3,000 BC", title: "Trade", desc: "Grain = money" },
              { emoji: "🏦", year: "1400 AD", title: "Banks", desc: "Trust centralized" },
              { emoji: "₿", year: "2009", title: "Bitcoin", desc: "Trust decentralized" },
              { emoji: "🍞", year: "2026", title: "SOUR", desc: "Civilization protocol" },
            ].map((era, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">{era.emoji}</span>
                  <p className="text-cream/30 text-[10px] uppercase tracking-wider">{era.year}</p>
                  <p className={`${i === 4 ? "text-gold font-bold" : "text-cream/60"} text-xs font-medium`}>{era.title}</p>
                  <p className="text-cream/30 text-[10px]">{era.desc}</p>
                </div>
                {i < 4 && <Flame className="w-3 h-3 text-gold/20 rotate-90 md:rotate-0 hidden md:block" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* LAYER 1: Core Engine */}
        {renderSectionHeader(Handshake, "Core Economic Engine", "The foundation — escrow, bonds, and reputation", "from-blue-500 to-purple-500", 0.3)}
        {renderProtocolGrid(coreEngine, "md:grid-cols-3")}

        {/* LAYER 2: Intelligence */}
        {renderSectionHeader(Network, "Intelligence Layer", "AI agents, skill credentials, and reputation lending", "from-cyan-500 to-teal-500", 0.4)}
        {renderProtocolGrid(intelligenceLayer, "md:grid-cols-3")}

        {/* LAYER 3: Community */}
        {renderSectionHeader(Users, "Community Layer", "Guilds, insurance, and cross-border solidarity", "from-emerald-500 to-green-500", 0.5)}
        {renderProtocolGrid(communityLayer, "md:grid-cols-3")}

        {/* LAYER 4: Infrastructure */}
        {renderSectionHeader(Server, "Infrastructure Layer", "Social network, distributed storage, and local AI", "from-violet-500 to-rose-500", 0.6)}
        {renderProtocolGrid(infrastructureLayer, "md:grid-cols-3")}

        {/* Launchpad */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/15 hover:border-gold/25 transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1">
                No VCs. No Gatekeepers.
              </p>
              <h3 className="font-cinzel text-xl font-bold text-cream mb-2">Community Launchpad</h3>
              <p className="text-cream/55 text-sm mb-4 leading-relaxed max-w-2xl">
                Got a project? The community funds it via quadratic voting. Guilds staff it.
                15% of revenue returns to Commons Treasury. A self-sustaining launch ecosystem — by bakers, for bakers.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Propose → Review → Vote → Fund", "Guild staffing", "15% revenue return", "No VC dilution"].map((f, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-300/70 text-xs font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flywheel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="p-8 md:p-10 rounded-2xl glass-gold border border-gold/20 text-center"
        >
          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-cream mb-6">
            The Civilizational Flywheel
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-sm text-cream/50 mb-6 flex-wrap">
            {[
              { label: "Trades", cls: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
              { label: "Revenue", cls: "bg-green-500/10 border-green-500/20 text-green-400" },
              { label: "Burns + Rewards", cls: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
              { label: "Reputation", cls: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
              { label: "Guilds", cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
              { label: "Infrastructure", cls: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
              { label: "More Users", cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-4">
                <span className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${step.cls}`}>
                  {step.label}
                </span>
                {i < 6 && <span className="text-gold/30">→</span>}
              </div>
            ))}
          </div>
          <p className="text-cream/35 text-sm max-w-2xl mx-auto">
            Each protocol feeds the next. Escrow generates fees. Fees burn tokens and reward holders.
            Reputation attracts users. Users form guilds. Guilds build infrastructure.
            The civilization grows itself — forever.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
