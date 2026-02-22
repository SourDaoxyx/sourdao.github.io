"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, ExternalLink, FileText } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function WhitepaperCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="relative py-16 px-4" id="whitepaper">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-10 rounded-2xl glass-gold border border-gold/20 text-center"
        >
          <FileText className="w-10 h-10 text-gold mx-auto mb-4" />

          <h3 className="font-cinzel text-2xl md:text-3xl font-bold text-cream mb-3">
            {t("whitepaper.title")}
          </h3>

          <p className="text-cream/50 text-sm mb-6 max-w-lg mx-auto">
            {t("whitepaper.description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/whitepaper"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm shadow-lg shadow-gold/20"
            >
              <Download className="w-5 h-5" />
              {t("whitepaper.cta")}
            </motion.a>
            <motion.a
              href="https://github.com/SourDaoxyx"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-gold/30 text-gold font-bold text-sm hover:bg-gold/5 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              {t("whitepaper.github")}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
