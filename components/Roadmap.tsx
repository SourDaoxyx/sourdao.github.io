"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Zap,
  Layers,
  Globe,
  Rocket,
  Users,
  ShieldCheck,
  Handshake,
  Store,
  Flame,
  Sparkles,
  CheckCircle2,
  Circle,
  Timer,
  Bot,
  Fingerprint,
  Building2,
  HeartHandshake,
  Server,
  MessageCircle,
  Crown,
  Factory,
  BadgeDollarSign,
  Cog,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Roadmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const phases = [
    {
      phase: t("roadmap.label.now"),
      title: t("roadmap.phase1.title"),
      subtitle: t("roadmap.phase1.period"),
      icon: Zap,
      status: "active" as const,
      color: "from-green-500 to-emerald-600",
      glowColor: "shadow-green-500/50",
      description: t("roadmap.phase1.desc"),
      milestones: [
        { icon: Rocket, text: t("roadmap.m1.1"), status: "completed" },
        { icon: Users, text: t("roadmap.m1.2"), status: "in-progress" },
        { icon: Sparkles, text: t("roadmap.m1.3"), status: "in-progress" },
        { icon: ShieldCheck, text: t("roadmap.m1.4"), status: "pending" },
        { icon: Handshake, text: t("roadmap.m1.5"), status: "pending" },
      ],
      highlight: t("roadmap.highlight1"),
    },
    {
      phase: t("roadmap.label.next"),
      title: t("roadmap.phase2.title"),
      subtitle: t("roadmap.phase2.period"),
      icon: Layers,
      status: "upcoming" as const,
      color: "from-blue-500 to-purple-600",
      glowColor: "shadow-blue-500/50",
      description: t("roadmap.phaseNext.desc"),
      milestones: [
        { icon: Store, text: t("roadmap.m2.1"), status: "pending" },
        { icon: Fingerprint, text: t("roadmap.m2.2"), status: "pending" },
        { icon: Bot, text: t("roadmap.m2.3"), status: "pending" },
        { icon: Building2, text: t("roadmap.m2.4"), status: "pending" },
        { icon: HeartHandshake, text: t("roadmap.m2.5"), status: "pending" },
        { icon: Flame, text: t("roadmap.m2.6"), status: "pending" },
      ],
      highlight: t("roadmap.highlight2"),
    },
    {
      phase: t("roadmap.label.mill"),
      title: t("roadmap.phaseMill.title"),
      subtitle: t("roadmap.phaseMill.period"),
      icon: Factory,
      status: "upcoming" as const,
      color: "from-violet-500 to-purple-600",
      glowColor: "shadow-violet-500/50",
      description: t("roadmap.phaseMill.desc"),
      milestones: [
        { icon: Store, text: t("roadmap.mMill.1"), status: "pending" },
        { icon: Bot, text: t("roadmap.mMill.2"), status: "pending" },
        { icon: BadgeDollarSign, text: t("roadmap.mMill.3"), status: "pending" },
        { icon: Flame, text: t("roadmap.mMill.4"), status: "pending" },
        { icon: Cog, text: t("roadmap.mMill.5"), status: "pending" },
      ],
      highlight: t("roadmap.highlightMill"),
    },
    {
      phase: t("roadmap.label.future"),
      title: t("roadmap.phase3.title"),
      subtitle: t("roadmap.phase3.period"),
      icon: Globe,
      status: "future" as const,
      color: "from-rose-500 to-indigo-600",
      glowColor: "shadow-rose-500/50",
      description: t("roadmap.phaseFuture.desc"),
      milestones: [
        { icon: MessageCircle, text: t("roadmap.m3.1"), status: "pending" },
        { icon: Server, text: t("roadmap.m3.2"), status: "pending" },
        { icon: Bot, text: t("roadmap.m3.3"), status: "pending" },
        { icon: Globe, text: t("roadmap.m3.4"), status: "pending" },
        { icon: Crown, text: t("roadmap.m3.5"), status: "pending" },
      ],
      highlight: t("roadmap.highlight3"),
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "in-progress":
        return <Timer className="w-4 h-4 text-yellow-400 animate-pulse" />;
      default:
        return <Circle className="w-4 h-4 text-cream/25" />;
    }
  };

  const getPhaseStatus = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center gap-2 text-green-400 text-xs font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {t("roadmap.status.active")}
          </span>
        );
      case "upcoming":
        return (
          <span className="flex items-center gap-2 text-blue-400 text-xs font-medium">
            <span className="w-2 h-2 bg-blue-400 rounded-full" />
            {t("roadmap.status.upcoming")}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2 text-gold/50 text-xs font-medium">
            <span className="w-2 h-2 bg-gold/50 rounded-full" />
            {t("roadmap.status.future")}
          </span>
        );
    }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden" id="roadmap">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-purple-500/4 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <motion.span className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6">
            ✨ {t("roadmap.subtitle")}
          </motion.span>

          <h2 className="font-cinzel text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              {t("roadmap.title")}
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-xl mx-auto text-base">
            {t("roadmap.description")}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent transform md:-translate-x-1/2" />

          {phases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.2, duration: 0.8 }}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline Node */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                <motion.div
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center ${phase.glowColor} shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  animate={
                    phase.status === "active"
                      ? {
                          boxShadow: [
                            "0 0 20px rgba(74, 222, 128, 0.3)",
                            "0 0 40px rgba(74, 222, 128, 0.5)",
                            "0 0 20px rgba(74, 222, 128, 0.3)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <phase.icon className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Content Card */}
              <div className={`ml-24 md:ml-0 md:w-[calc(50%-3rem)] ${index % 2 === 0 ? "md:pr-14" : "md:pl-14"}`}>
                <div className="p-6 rounded-2xl glass-gold border border-gold/15 hover:border-gold/30 transition-all duration-500">
                  {/* Phase Header */}
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`text-sm font-bold tracking-wider bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                      {phase.phase}
                    </span>
                    {getPhaseStatus(phase.status)}
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-cream mb-1">{phase.title}</h3>
                  <p className="text-cream/35 text-xs mb-3">{phase.subtitle}</p>

                  {/* Description */}
                  <p className="text-cream/55 text-sm leading-relaxed mb-4">{phase.description}</p>

                  {/* Milestones */}
                  <div className="space-y-2 mb-4">
                    {phase.milestones.map((m, mi) => (
                      <div key={mi} className="flex items-start gap-2.5">
                        <div className="mt-0.5">{getStatusIcon(m.status)}</div>
                        <div className="flex items-center gap-2">
                          <m.icon className="w-3.5 h-3.5 text-gold/40" />
                          <span className={`text-xs ${
                            m.status === "completed"
                              ? "text-cream/80"
                              : m.status === "in-progress"
                              ? "text-cream/65"
                              : "text-cream/40"
                          }`}>
                            {m.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Highlight */}
                  <div className={`inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r ${phase.color} bg-opacity-10 border border-white/10`}>
                    <span className="text-xs font-medium text-cream">{phase.highlight}</span>
                  </div>
                </div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="hidden md:block md:w-[calc(50%-3rem)]" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
