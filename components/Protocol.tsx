"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Handshake,
  Bot,
  Users,
  Server,
  Sparkles,
  Store,
  Fingerprint,
  GraduationCap,
  Building2,
  HeartHandshake,
  Globe,
  MessageCircle,
  HardDrive,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Protocol() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const layers = [
    {
      icon: Handshake,
      title: t("protocol.layer1.title"),
      subtitle: t("protocol.layer1.subtitle"),
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/8",
      border: "border-blue-500/20",
      protocols: [
        { icon: Handshake, name: t("protocol.layer1.p1.name"), desc: t("protocol.layer1.p1.desc") },
        { icon: Store, name: t("protocol.layer1.p2.name"), desc: t("protocol.layer1.p2.desc") },
        { icon: Fingerprint, name: t("protocol.layer1.p3.name"), desc: t("protocol.layer1.p3.desc") },
      ],
    },
    {
      icon: Bot,
      title: t("protocol.layer2.title"),
      subtitle: t("protocol.layer2.subtitle"),
      color: "from-cyan-500 to-teal-500",
      bg: "bg-cyan-500/8",
      border: "border-cyan-500/20",
      protocols: [
        { icon: Bot, name: t("protocol.layer2.p1.name"), desc: t("protocol.layer2.p1.desc") },
        { icon: GraduationCap, name: t("protocol.layer2.p2.name"), desc: t("protocol.layer2.p2.desc") },
        { icon: Users, name: t("protocol.layer2.p3.name"), desc: t("protocol.layer2.p3.desc") },
      ],
    },
    {
      icon: Users,
      title: t("protocol.layer3.title"),
      subtitle: t("protocol.layer3.subtitle"),
      color: "from-emerald-500 to-green-500",
      bg: "bg-emerald-500/8",
      border: "border-emerald-500/20",
      protocols: [
        { icon: Building2, name: t("protocol.layer3.p1.name"), desc: t("protocol.layer3.p1.desc") },
        { icon: HeartHandshake, name: t("protocol.layer3.p2.name"), desc: t("protocol.layer3.p2.desc") },
        { icon: Globe, name: t("protocol.layer3.p3.name"), desc: t("protocol.layer3.p3.desc") },
      ],
    },
    {
      icon: Server,
      title: t("protocol.layer4.title"),
      subtitle: t("protocol.layer4.subtitle"),
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-500/8",
      border: "border-rose-500/20",
      protocols: [
        { icon: MessageCircle, name: t("protocol.layer4.p1.name"), desc: t("protocol.layer4.p1.desc") },
        { icon: HardDrive, name: t("protocol.layer4.p2.name"), desc: t("protocol.layer4.p2.desc") },
        { icon: Server, name: t("protocol.layer4.p3.name"), desc: t("protocol.layer4.p3.desc") },
      ],
    },
  ];

  return (
    <section className="relative py-24 px-4 overflow-hidden" id="protocol">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/3 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-neon-purple/3 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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

        {/* Layer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {layers.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              className={`p-6 rounded-2xl ${layer.bg} border ${layer.border} hover:border-gold/30 transition-all duration-500`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${layer.color} flex items-center justify-center`}>
                  <layer.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-cream">{layer.title}</h3>
                  <p className="text-cream/40 text-xs">{layer.subtitle}</p>
                </div>
              </div>

              <div className="space-y-3">
                {layer.protocols.map((p, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <p.icon className="w-4 h-4 text-gold/40 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-cream/80 text-sm font-semibold">{p.name}</span>
                      <span className="text-cream/40 text-sm"> — {p.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flywheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="p-6 md:p-8 rounded-2xl glass-gold border border-gold/20 text-center"
        >
          <h3 className="font-cinzel text-xl font-bold text-cream mb-4">{t("protocol.flywheel.title")}</h3>

          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm mb-4">
            {[
              { label: t("protocol.flywheel.step1"), cls: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
              { label: t("protocol.flywheel.step2"), cls: "bg-green-500/10 border-green-500/20 text-green-400" },
              { label: t("protocol.flywheel.step3"), cls: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
              { label: t("protocol.flywheel.step4"), cls: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
              { label: t("protocol.flywheel.step5"), cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
              { label: t("protocol.flywheel.step6"), cls: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
              { label: t("protocol.flywheel.step7"), cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${step.cls}`}>
                  {step.label}
                </span>
                {i < 6 && <ArrowRight className="w-3 h-3 text-gold/30" />}
              </div>
            ))}
          </div>

          <p className="text-cream/35 text-sm max-w-xl mx-auto">
            {t("protocol.flywheel.desc")}
          </p>

          {/* Revenue Split */}
          <div className="flex items-center justify-center gap-2.5 mt-5 text-cream/30 text-xs flex-wrap">
            <span>{t("protocol.revenue.fee")}</span>
            <Sparkles className="w-3 h-3 text-gold/30" />
            <span className="text-green-400">{t("protocol.revenue.ops")}</span>
            <span>·</span>
            <span className="text-amber-400">{t("protocol.revenue.holders")}</span>
            <span>·</span>
            <span className="text-purple-400">{t("protocol.revenue.commons")}</span>
            <span>·</span>
            <span className="text-orange-400">{t("protocol.revenue.burn")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
