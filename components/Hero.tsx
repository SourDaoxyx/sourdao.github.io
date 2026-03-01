"use client";

import { motion } from "framer-motion";
import { Sparkles, Flame, ArrowDown, Shield, Coins, Zap, Send, Twitter, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { useState } from "react";

export default function Hero() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const CA = "2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump";

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(CA); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Animated Background Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(212, 175, 55, 0.08) 50%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The Genesis Coin */}
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
          <div className="relative w-[240px] h-[240px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px]">
            <Image
              src="/sour-logo.png"
              alt="SOUR"
              fill
              className="object-contain drop-shadow-[0_0_50px_rgba(0,212,255,0.35)] drop-shadow-[0_0_100px_rgba(139,92,246,0.2)]"
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
          SOUR
        </h1>
        <motion.div
          className="absolute inset-0 text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-gold/20 blur-2xl pointer-events-none"
          aria-hidden="true"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          SOUR
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
          href="https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 overflow-hidden rounded-xl text-lg font-bold"
          aria-label="Buy $SOUR on Pump.fun"
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
          href="https://t.me/sourdao"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 overflow-hidden rounded-xl text-lg font-bold"
          aria-label="Join the Bakery on Telegram"
        >
          <div className="absolute inset-0 gradient-border rounded-xl" />
          <div className="absolute inset-[1px] bg-black/80 rounded-xl backdrop-blur-sm" />
          <span className="relative text-gold flex items-center gap-2 group-hover:text-amber transition-colors">
            <Send className="w-5 h-5" />
            {t("hero.cta.protocol")}
          </span>
        </motion.a>
      </motion.div>

      {/* Contract Address — Quick Copy */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-6 w-full max-w-md"
      >
        <p className="text-cream/30 text-xs text-center mb-1.5 tracking-wider uppercase">Contract Address</p>
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-gold/5 border border-gold/15 hover:border-gold/40 hover:bg-gold/10 transition-all group cursor-pointer"
        >
          <code className="text-gold/80 font-mono text-xs">
            <span className="hidden sm:inline">{CA}</span>
            <span className="sm:hidden">{CA.slice(0, 6)}...{CA.slice(-6)}</span>
          </code>
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <Copy className="w-4 h-4 text-gold/50 group-hover:text-gold flex-shrink-0 transition-colors" />
          )}
        </button>
        {copied && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-400 text-xs text-center mt-1"
          >
            Copied!
          </motion.p>
        )}
      </motion.div>

      {/* Social Links Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="flex items-center gap-4 mt-8"
      >
        <a href="https://x.com/sourdaoxyz" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-cream/5 border border-cream/10 hover:border-gold/30 hover:bg-gold/5 transition-all">
          <Twitter className="w-4 h-4 text-cream/40 hover:text-gold" />
        </a>
        <a href="https://t.me/sourdao" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-cream/5 border border-cream/10 hover:border-gold/30 hover:bg-gold/5 transition-all">
          <Send className="w-4 h-4 text-cream/40 hover:text-gold" />
        </a>
        <a href="https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-cream/5 border border-cream/10 hover:border-green-500/30 hover:bg-green-500/5 transition-all" title="Buy on Pump.fun">
          <span className="text-cream/40 hover:text-green-400 text-sm font-bold leading-none">P</span>
        </a>
        <a href="https://github.com/SourDaoxyx" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-cream/5 border border-cream/10 hover:border-gold/30 hover:bg-gold/5 transition-all">
          <svg className="w-4 h-4 text-cream/40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        </a>
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
