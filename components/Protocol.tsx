"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Fingerprint,
  Handshake,
  Wheat,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Globe,
  Coins,
  Flame,
  Users,
  Factory,
  Bot,
  BadgeDollarSign,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Protocol() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const pillars = [
    {
      icon: Fingerprint,
      title: t("protocol.pillar1.title"),
      subtitle: t("protocol.pillar1.subtitle"),
      desc: t("protocol.pillar1.desc"),
      highlight: t("protocol.pillar1.highlight"),
      color: "from-cyan-500 to-blue-500",
      bg: "bg-cyan-500/5",
      border: "border-cyan-500/20",
      badge: "LIVE",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      href: "/crust",
      features: [
        { icon: ShieldCheck, text: t("protocol.pillar1.f1") },
        { icon: Sparkles, text: t("protocol.pillar1.f2") },
        { icon: Globe, text: t("protocol.pillar1.f3") },
      ],
    },
    {
      icon: Handshake,
      title: t("protocol.pillar2.title"),
      subtitle: t("protocol.pillar2.subtitle"),
      desc: t("protocol.pillar2.desc"),
      highlight: t("protocol.pillar2.highlight"),
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/5",
      border: "border-emerald-500/20",
      badge: "BETA",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      href: "/handshake",
      features: [
        { icon: ShieldCheck, text: t("protocol.pillar2.f1") },
        { icon: Globe, text: t("protocol.pillar2.f2") },
        { icon: Coins, text: t("protocol.pillar2.f3") },
      ],
    },
    {
      icon: Wheat,
      title: t("protocol.pillar3.title"),
      subtitle: t("protocol.pillar3.subtitle"),
      desc: t("protocol.pillar3.desc"),
      highlight: t("protocol.pillar3.highlight"),
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/5",
      border: "border-amber-500/20",
      badge: "SOON",
      badgeColor: "bg-amber-500/15 text-amber-400/70 border-amber-500/20",
      dimmed: true,
      features: [
        { icon: Coins, text: t("protocol.pillar3.f1") },
        { icon: Users, text: t("protocol.pillar3.f2") },
        { icon: Coins, text: t("protocol.pillar3.f3") },
      ],
    },
    {
      icon: Factory,
      title: t("protocol.pillar4.title"),
      subtitle: t("protocol.pillar4.subtitle"),
      desc: t("protocol.pillar4.desc"),
      highlight: t("protocol.pillar4.highlight"),
      color: "from-violet-500 to-purple-500",
      bg: "bg-violet-500/5",
      border: "border-violet-500/20",
      badge: "SOON",
      badgeColor: "bg-violet-500/15 text-violet-400/70 border-violet-500/20",
      dimmed: true,
      features: [
        { icon: Bot, text: t("protocol.pillar4.f1") },
        { icon: BadgeDollarSign, text: t("protocol.pillar4.f2") },
        { icon: Flame, text: t("protocol.pillar4.f3") },
      ],
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden" id="protocol">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/3 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
            {t("protocol.badge")}
          </motion.span>

          <h2 className="font-cinzel text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              {t("protocol.title")}
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-2xl mx-auto text-base">
            {t("protocol.subtitle")}
          </p>
        </motion.div>

        {/* 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {pillars.map((pillar, i) => {
            const CardWrapper = pillar.href ? motion.a : motion.div;
            const wrapperProps = pillar.href
              ? { href: pillar.href }
              : {};

            return (
              <CardWrapper
                key={i}
                {...(wrapperProps as Record<string, string>)}
                initial={{ opacity: 0, y: 25 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.7 }}
                whileHover={pillar.dimmed ? undefined : { y: -4, scale: 1.02 }}
                className={`relative p-6 rounded-2xl ${pillar.bg} border ${pillar.border} ${
                  pillar.dimmed
                    ? "opacity-60 hover:opacity-80"
                    : "hover:border-gold/30 cursor-pointer"
                } transition-all duration-500 flex flex-col`}
              >
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pillar.badgeColor}`}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pillar.color} flex items-center justify-center ${pillar.dimmed ? "grayscale-[30%]" : ""}`}>
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-lg font-bold text-cream">{pillar.title}</h3>
                    <p className="text-cream/40 text-xs">{pillar.subtitle}</p>
                  </div>
                </div>

                <p className="text-cream/55 text-sm leading-relaxed mb-5">{pillar.desc}</p>

                <div className="space-y-2.5 mb-5 flex-1">
                  {pillar.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <f.icon className="w-4 h-4 text-gold/50 mt-0.5 flex-shrink-0" />
                      <span className="text-cream/60 text-sm">{f.text}</span>
                    </div>
                  ))}
                </div>

                <div className={`mt-auto px-3 py-2 rounded-lg bg-gradient-to-r ${pillar.color} bg-opacity-5 border border-white/5`}>
                  <p className="text-xs font-medium text-cream/70 italic">&ldquo;{pillar.highlight}&rdquo;</p>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* Flywheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="p-6 md:p-8 rounded-2xl glass-gold border border-gold/20 text-center"
        >
          <h3 className="font-cinzel text-xl font-bold text-cream mb-4">{t("protocol.flywheel.title")}</h3>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm mb-4">
            {[
              { label: t("protocol.flywheel.step1"), cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
              { label: t("protocol.flywheel.step2"), cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
              { label: t("protocol.flywheel.step3"), cls: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
              { label: t("protocol.flywheel.step4"), cls: "bg-green-500/10 border-green-500/20 text-green-400" },
              { label: t("protocol.flywheel.step5"), cls: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" },
              { label: t("protocol.flywheel.step6"), cls: "bg-violet-500/10 border-violet-500/20 text-violet-400" },
              { label: t("protocol.flywheel.step7"), cls: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
              { label: t("protocol.flywheel.step8"), cls: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${step.cls}`}>
                  {step.label}
                </span>
                {i < 7 && <ArrowRight className="w-3 h-3 text-gold/30" />}
              </div>
            ))}
          </div>

          <p className="text-cream/35 text-sm max-w-xl mx-auto mb-5">
            {t("protocol.flywheel.desc")}
          </p>

          <div className="flex items-center justify-center gap-3 text-cream/30 text-xs flex-wrap">
            <span>{t("protocol.revenue.fee")}</span>
            <Sparkles className="w-3 h-3 text-gold/30" />
            <span className="text-orange-400">{t("protocol.revenue.ops")}</span>
            <span>·</span>
            <span className="text-green-400">{t("protocol.revenue.holders")}</span>
            <span>·</span>
            <span className="text-purple-400">{t("protocol.revenue.commons")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
