"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Wheat, Sparkles, Infinity, Fingerprint, Sprout, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Manifesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const doctrines = [
    {
      number: "I",
      title: t("manifesto.doctrine1.title"),
      subtitle: t("manifesto.doctrine1.subtitle"),
      icon: Wheat,
      color: "from-amber-500 to-yellow-600",
      text: t("manifesto.doctrine1.text"),
    },
    {
      number: "II",
      title: t("manifesto.doctrine2.title"),
      subtitle: t("manifesto.doctrine2.subtitle"),
      icon: Sparkles,
      color: "from-purple-500 to-violet-600",
      text: t("manifesto.doctrine2.text"),
    },
    {
      number: "III",
      title: t("manifesto.doctrine3.title"),
      subtitle: t("manifesto.doctrine3.subtitle"),
      icon: Infinity,
      color: "from-cyan-500 to-teal-500",
      text: t("manifesto.doctrine3.text"),
    },
    {
      number: "IV",
      title: t("manifesto.doctrine4.title"),
      subtitle: t("manifesto.doctrine4.subtitle"),
      icon: Fingerprint,
      color: "from-gold to-amber-500",
      text: t("manifesto.doctrine4.text"),
    },
    {
      number: "V",
      title: t("manifesto.doctrine5.title"),
      subtitle: t("manifesto.doctrine5.subtitle"),
      icon: Sprout,
      color: "from-emerald-500 to-green-600",
      text: t("manifesto.doctrine5.text"),
    },
  ];

  return (
    <section ref={ref} id="manifesto" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full bg-gold/5 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <motion.span className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6">
            {t("manifesto.badge")}
          </motion.span>

          <h2 className="font-cinzel text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              {t("manifesto.doctrines.title")}
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-2xl mx-auto text-base">
            {t("manifesto.doctrines.subtitle")}
          </p>
        </motion.div>

        {/* Doctrines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctrines.slice(0, 3).map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              className="p-6 rounded-xl glass-gold border border-gold/15 hover:border-gold/30 transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center`}>
                  <d.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className={`font-cinzel text-xs font-bold bg-gradient-to-r ${d.color} bg-clip-text text-transparent`}>
                    {t("manifesto.doctrineLabel")} {d.number}
                  </span>
                  <h3 className="font-cinzel text-base font-bold text-cream leading-tight">{d.title}</h3>
                </div>
              </div>
              <p className="text-cream/50 text-sm leading-relaxed">{d.text}</p>
              <p className="text-gold/30 text-xs mt-2 italic">{d.subtitle}</p>
            </motion.div>
          ))}

          <AnimatePresence>
            {expanded && (
              <>
                {doctrines.slice(3).map((d, i) => (
                  <motion.div
                    key={`expanded-${i}`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="p-6 rounded-xl glass-gold border border-gold/15 hover:border-gold/30 transition-all duration-500"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${d.color} flex items-center justify-center`}>
                        <d.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className={`font-cinzel text-xs font-bold bg-gradient-to-r ${d.color} bg-clip-text text-transparent`}>
                          {t("manifesto.doctrineLabel")} {d.number}
                        </span>
                        <h3 className="font-cinzel text-base font-bold text-cream leading-tight">{d.title}</h3>
                      </div>
                    </div>
                    <p className="text-cream/50 text-sm leading-relaxed">{d.text}</p>
                    <p className="text-gold/30 text-xs mt-2 italic">{d.subtitle}</p>
                  </motion.div>
                ))}

                {/* The Oath — always last */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="p-6 rounded-xl border border-gold/20 bg-gradient-to-br from-gold/5 to-amber-500/5 flex flex-col justify-center text-center"
                >
                  <p className="font-cinzel text-lg text-gold/80 italic mb-2">
                    &ldquo;{t("manifesto.oath.quote")}&rdquo;
                  </p>
                  <p className="text-cream/30 text-xs">{t("manifesto.oath.label")}</p>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Expand / Collapse toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center mt-6"
        >
          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-gold/30 text-gold/80 hover:text-gold hover:bg-gold/5 transition-all text-sm font-cinzel font-medium"
          >
            {expanded ? t("manifesto.showLess") : t("manifesto.showMore")}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
