'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Coins, Fingerprint } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import Link from 'next/link';

export default function CTABanner() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-gold/10 via-amber-500/5 to-gold/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="relative rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-black/50 to-amber-500/10 p-10 md:p-16 text-center overflow-hidden">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t border-l border-gold/30 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b border-r border-gold/30 rounded-br-3xl" />

          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full glass-gold text-gold text-xs font-medium tracking-widest uppercase mb-6"
          >
            {t("ctaBanner.badge")}
          </motion.span>

          {/* Headline */}
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              {t("ctaBanner.title")}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="font-inter text-cream/60 max-w-xl mx-auto text-base md:text-lg mb-10">
            {t("ctaBanner.subtitle")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-black font-cinzel font-bold text-base hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-shadow"
            >
              <Coins className="w-5 h-5" />
              {t("ctaBanner.cta.buy")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <Link href="/crust">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 px-8 py-4 rounded-xl border border-gold/40 text-gold font-cinzel font-bold text-base hover:bg-gold/10 transition-colors cursor-pointer"
              >
                <Fingerprint className="w-5 h-5" />
                {t("ctaBanner.cta.crust")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Link>
          </div>

          {/* Trust note */}
          <p className="text-cream/30 text-xs mt-8 font-inter">
            {t("ctaBanner.trust")}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
