"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  Layers,
  Building,
  Crown,
  Rocket,
  Users,
  Radio,
  ShieldCheck,
  Handshake,
  Store,
  Landmark,
  Flame,
  BarChart3,
  Vote,
  Globe,
  Sparkles,
  CheckCircle2,
  Circle,
  Timer,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
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

export default function Roadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const phases = [
    {
      phase: "PHASE I",
      title: t("roadmap.phase1.title"),
      subtitle: "Q1 2026",
      icon: Zap,
      status: "active" as const,
      color: "from-green-500 to-emerald-600",
      glowColor: "shadow-green-500/50",
      description: t("roadmap.phase1.desc"),
      milestones: [
        { icon: Rocket, text: "Fair launch on Pump.fun — no presale, no insiders", status: "completed" },
        { icon: Radio, text: "24/7 livestream begins — watch the starter breathe", status: "completed" },
        { icon: Users, text: "Community gathering — first 1,000 Founding Bakers", status: "in-progress" },
        { icon: Sparkles, text: "Founding Baker NFT badges for early supporters", status: "in-progress" },
        { icon: ShieldCheck, text: "Multisig treasury via Squads Protocol", status: "pending" },
      ],
      highlight: "🚀 Launch Platform: Pump.fun (Solana)",
      stats: [
        { label: "Target Holders", value: "1,000+" },
        { label: "Community Goal", value: "5K" },
      ],
    },
    {
      phase: "PHASE II",
      title: t("roadmap.phase2.title"),
      subtitle: "Q2–Q3 2026",
      icon: Layers,
      status: "upcoming" as const,
      color: "from-blue-500 to-cyan-600",
      glowColor: "shadow-blue-500/50",
      description: t("roadmap.phase2.desc"),
      milestones: [
        { icon: Handshake, text: "Escrow marketplace MVP — P2P service trading", status: "pending" },
        { icon: ShieldCheck, text: "On-chain escrow contracts audited & deployed", status: "pending" },
        { icon: Store, text: "Proof-of-Value Bonds — prepaid work vouchers", status: "pending" },
        { icon: Vote, text: "Snapshot.org governance — community decides", status: "pending" },
        { icon: BarChart3, text: "1-3% escrow fee engine — real protocol revenue", status: "pending" },
        { icon: Flame, text: "First buyback & burn from marketplace revenue", status: "pending" },
      ],
      highlight: "🤝 Solidarity Marketplace: Escrow-secured P2P",
      stats: [
        { label: "Escrow Fee", value: "1-3%" },
        { label: "Burn Share", value: "20%" },
      ],
    },
    {
      phase: "PHASE III",
      title: t("roadmap.phase3.title"),
      subtitle: "Q4 2026 – Q1 2027",
      icon: Building,
      status: "upcoming" as const,
      color: "from-purple-500 to-violet-600",
      glowColor: "shadow-purple-500/50",
      description: t("roadmap.phase3.desc"),
      milestones: [
        { icon: Landmark, text: "Commons Treasury — opt-in community savings pool", status: "pending" },
        { icon: BarChart3, text: "Revenue-Based Financing — micro-loans from real revenue", status: "pending" },
        { icon: Vote, text: "Quadratic voting for treasury allocation", status: "pending" },
        { icon: ShieldCheck, text: "Full security audit by top-tier firm", status: "pending" },
        { icon: Users, text: "Ambassador program — global baker network", status: "pending" },
        { icon: Sparkles, text: "Reputation system — on-chain trust scores", status: "pending" },
      ],
      highlight: "🏛️ Commons Layer: Community-owned treasury",
      stats: [
        { label: "Revenue → Commons", value: "30%" },
        { label: "Revenue → Ops", value: "50%" },
      ],
    },
    {
      phase: "PHASE IV",
      title: t("roadmap.phase4.title"),
      subtitle: "2027 & Beyond",
      icon: Crown,
      status: "future" as const,
      color: "from-gold to-amber-600",
      glowColor: "shadow-gold/50",
      description: t("roadmap.phase4.desc"),
      milestones: [
        { icon: Globe, text: "Multi-language marketplace — global solidarity network", status: "pending" },
        { icon: Store, text: "Industry-specific bazaars — specialized trade verticals", status: "pending" },
        { icon: Landmark, text: "Cross-community lending — inter-DAO credit lines", status: "pending" },
        { icon: Crown, text: "The MAYA Foundation — charitable arm for artisan education", status: "pending" },
        { icon: ShieldCheck, text: "Fully decentralized — no single point of failure", status: "pending" },
      ],
      highlight: "👑 Vision: The Organic Finance Empire",
      stats: [
        { label: "Global Bakers", value: "1M+" },
        { label: "Marketplace Vol", value: "∞" },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "in-progress":
        return <Timer className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case "pending":
        return <Circle className="w-4 h-4 text-cream/30" />;
      default:
        return <Circle className="w-4 h-4 text-cream/30" />;
    }
  };

  const getPhaseStatus = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center gap-2 text-green-400 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            ACTIVE
          </span>
        );
      case "upcoming":
        return (
          <span className="flex items-center gap-2 text-blue-400 text-sm font-medium">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            UPCOMING
          </span>
        );
      case "future":
        return (
          <span className="flex items-center gap-2 text-gold/60 text-sm font-medium">
            <span className="w-2 h-2 bg-gold/60 rounded-full" />
            FUTURE
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="roadmap">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
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
            ✨ {t("roadmap.subtitle")}
          </motion.span>
          
          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              {t("roadmap.title")}
            </span>
          </h2>
          
          <p className="font-inter text-cream/60 max-w-3xl mx-auto text-lg">
            From a single jar to a solidarity marketplace. Every great empire starts with patience,
            trust, and the right culture. Here&apos;s our journey.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent transform md:-translate-x-1/2" />

          {phases.map((phase, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative flex flex-col md:flex-row gap-8 mb-16 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Node */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center ${phase.glowColor} shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  animate={phase.status === "active" ? {
                    boxShadow: [
                      "0 0 20px rgba(74, 222, 128, 0.3)",
                      "0 0 40px rgba(74, 222, 128, 0.5)",
                      "0 0 20px rgba(74, 222, 128, 0.3)",
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <phase.icon className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Content Card */}
              <div className={`ml-24 md:ml-0 md:w-[calc(50%-4rem)] ${index % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                <motion.div
                  className="relative p-8 rounded-2xl glass-gold border border-gold/20 hover:border-gold/40 transition-all duration-500"
                  whileHover={{ y: -5 }}
                >
                  {/* Phase Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-bold tracking-wider bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                          {phase.phase}
                        </span>
                        {getPhaseStatus(phase.status)}
                      </div>
                      <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-cream">
                        {phase.title}
                      </h3>
                      <p className="text-cream/50 text-sm mt-1">{phase.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-cream/70 mb-6 leading-relaxed">
                    {phase.description}
                  </p>

                  {/* Milestones */}
                  <div className="space-y-3 mb-6">
                    {phase.milestones.map((milestone, mIndex) => (
                      <motion.div
                        key={mIndex}
                        className="flex items-start gap-3 group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + mIndex * 0.1 }}
                      >
                        <div className="mt-0.5">
                          {getStatusIcon(milestone.status)}
                        </div>
                        <div className="flex items-center gap-2">
                          <milestone.icon className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" />
                          <span className={`text-sm ${
                            milestone.status === "completed" 
                              ? "text-cream/90" 
                              : milestone.status === "in-progress"
                              ? "text-cream/80"
                              : "text-cream/50"
                          }`}>
                            {milestone.text}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Highlight Badge */}
                  <div className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${phase.color} bg-opacity-10 border border-white/10`}>
                    <span className="text-sm font-medium text-cream">
                      {phase.highlight}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mt-6 pt-6 border-t border-gold/10">
                    {phase.stats.map((stat, sIndex) => (
                      <div key={sIndex} className="text-center">
                        <p className="font-cinzel text-xl font-bold text-gold">{stat.value}</p>
                        <p className="text-xs text-cream/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block md:w-[calc(50%-4rem)]" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
