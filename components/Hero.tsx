"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame, ArrowDown, Shield, Coins, Zap } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Animated Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full border ${i % 2 === 0 ? 'border-neon-cyan/10' : 'border-neon-purple/10'}`}
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
            }}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 30 + i * 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>

      {/* Central Glow - Cyan + Gold dual glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(212, 175, 55, 0.08) 50%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The Genesis Jar */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative z-10 mb-6"
      >
        <motion.div
          className="relative"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 blur-3xl rounded-full scale-90" style={{ background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, rgba(139, 92, 246, 0.2) 40%, rgba(212, 175, 55, 0.15) 70%, transparent 100%)' }} />
          <div className="relative w-[240px] h-[240px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full overflow-hidden ring-2 ring-gold/20 shadow-[0_0_60px_rgba(0,212,255,0.3),0_0_120px_rgba(139,92,246,0.15)]">
            <Image
              src="/logo.png"
              alt="MAYA Coin"
              fill
              className="object-cover scale-110"
              priority
            />
          </div>

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-neon-cyan/60' : i % 3 === 1 ? 'bg-neon-purple/50' : 'bg-gold/60'}`}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
        className="relative text-center"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber to-gold mb-2">
          MAYA
        </h1>
        <motion.div
          className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-gold/20 blur-2xl pointer-events-none"
          aria-hidden="true"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          MAYA
        </motion.div>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-sm md:text-base tracking-[0.3em] uppercase text-gold/60 font-inter mb-6"
      >
        {t("hero.tagline")}
      </motion.p>

      {/* Trust Signal Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55 }}
        className="flex flex-wrap items-center justify-center gap-2.5 mb-6"
      >
        {[
          { icon: Coins, label: t("hero.pill.community") },
          { icon: Shield, label: t("hero.pill.tax") },
          { icon: Flame, label: t("hero.pill.lp") },
          { icon: Zap, label: t("hero.pill.fairLaunch") },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
            <item.icon className="w-3 h-3 text-gold" />
            <span className="text-gold/80 text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="text-xl md:text-2xl lg:text-3xl font-playfair text-cream/90 text-center mb-4 max-w-3xl"
      >
        {t("hero.subtitle1")} <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber font-semibold">
          {t("hero.subtitle2")}
        </span>
      </motion.p>

      {/* Vision Statement */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="text-cream/40 text-sm md:text-base text-center max-w-xl mb-10 font-inter leading-relaxed"
      >
        {t("hero.vision")}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        className="flex flex-col sm:flex-row gap-5"
      >
        <motion.a
          href="https://t.me/mayastarter"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 overflow-hidden rounded-xl text-lg font-bold"
          aria-label="Enter the Bakery - Join MAYA Community"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gold via-amber to-gold transition-all duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-amber via-gold to-amber" />
          <span className="relative text-background flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {t("hero.cta.bakery")}
          </span>
          <motion.div
            className="absolute inset-0 shimmer"
            style={{ mixBlendMode: "overlay" }}
          />
        </motion.a>

        <motion.a
          href="#protocol"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 overflow-hidden rounded-xl text-lg font-bold"
          aria-label="Explore the Civilization Protocol"
        >
          <div className="absolute inset-0 gradient-border rounded-xl" />
          <div className="absolute inset-[1px] bg-black/80 rounded-xl backdrop-blur-sm" />
          <span className="relative text-gold flex items-center gap-2 group-hover:text-amber transition-colors">
            <Flame className="w-5 h-5" />
            {t("hero.cta.protocol")}
          </span>
        </motion.a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-cream/30 text-xs tracking-wider uppercase">{t("hero.scrollHint")}</span>
          <ArrowDown className="w-4 h-4 text-gold/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
