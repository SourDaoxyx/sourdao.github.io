"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Landmark, Globe } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Problem() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  const cards = [
    {
      icon: Building2,
      title: t("problem.platforms.title"),
      lines: [
        t("problem.platforms.l1"),
        t("problem.platforms.l2"),
        t("problem.platforms.l3"),
        t("problem.platforms.l4"),
      ],
      stat: t("problem.platforms.stat"),
      color: "from-red-500 to-orange-500",
      bg: "bg-red-500/5",
      border: "border-red-500/20",
    },
    {
      icon: Landmark,
      title: t("problem.banks.title"),
      lines: [
        t("problem.banks.l1"),
        t("problem.banks.l2"),
        t("problem.banks.l3"),
        t("problem.banks.l4"),
      ],
      stat: t("problem.banks.stat"),
      color: "from-orange-500 to-yellow-500",
      bg: "bg-orange-500/5",
      border: "border-orange-500/20",
    },
    {
      icon: Globe,
      title: t("problem.borders.title"),
      lines: [
        t("problem.borders.l1"),
        t("problem.borders.l2"),
        t("problem.borders.l3"),
        t("problem.borders.l4"),
      ],
      stat: t("problem.borders.stat"),
      color: "from-yellow-500 to-red-500",
      bg: "bg-yellow-500/5",
      border: "border-yellow-500/20",
    },
  ];

  return (
    <section ref={ref} id="problem" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-500/4 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <motion.span className="inline-block px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium tracking-wider mb-6">
            {t("problem.badge")}
          </motion.span>

          <h2 className="font-cinzel text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400">
              {t("problem.title")}
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-2xl mx-auto text-base">
            {t("problem.subtitle")}
          </p>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.7 }}
              className={`relative p-6 rounded-2xl ${card.bg} border ${card.border} hover:border-red-400/30 transition-all duration-500`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-5`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="font-cinzel text-xl font-bold text-cream mb-4">{card.title}</h3>

              {/* Lines */}
              <div className="space-y-2 mb-5">
                {card.lines.map((line, j) => (
                  <p key={j} className="text-cream/55 text-sm font-inter">
                    {line}
                  </p>
                ))}
              </div>

              {/* Stat */}
              <div className="mt-auto pt-4 border-t border-cream/5">
                <p className="text-cream/30 text-xs font-mono">{card.stat}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Transition Line */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center"
        >
          <div className="w-px h-12 bg-gradient-to-b from-red-500/30 to-gold/50 mx-auto mb-6" />
          <p className="font-playfair text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream italic max-w-2xl mx-auto">
            {t("problem.transition")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
