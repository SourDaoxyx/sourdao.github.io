"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Wallet, Coins, Fingerprint, Handshake, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: Wallet,
    title: "Connect Wallet",
    desc: "Join the bakery in seconds. Phantom or Solflare — your keys, your identity.",
    example: "No email, no passwords. Just your wallet.",
    color: "from-cyan-400 to-blue-500",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    step: "02",
    icon: Coins,
    title: "Hold $SOUR",
    desc: "Your stake. Your voice. Your score. The longer you hold, the stronger your reputation.",
    example: "Fair launch on Pump.fun — 0% tax, no insiders.",
    color: "from-green-400 to-emerald-500",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  {
    step: "03",
    icon: Fingerprint,
    title: "Build Reputation",
    desc: "Every action is recorded on-chain. Your Baker Card evolves as you grow in the ecosystem.",
    example: "4 tiers: Fresh Dough → Eternal Starter",
    color: "from-purple-400 to-violet-500",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
  },
  {
    step: "04",
    icon: Handshake,
    title: "Trade P2P",
    desc: "Trustless escrow. Zero middlemen. Complete deals, earn reputation, feed the flywheel.",
    example: "2% Pinch → 50% burn, 30% keepers, 20% commons",
    color: "from-gold to-amber-500",
    border: "border-gold/20",
    bg: "bg-gold/5",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-4 relative" id="how-it-works">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6">
            🍞 HOW IT WORKS
          </span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-4">
            From Dough to Civilization
          </h2>
          <p className="text-cream/50 text-base max-w-2xl mx-auto font-inter">
            Four steps to build your on-chain reputation and join the civilization protocol.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
                className={`relative p-6 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-sm group hover:scale-[1.03] transition-transform duration-300`}
              >
                {/* Step Number */}
                <span className="absolute top-4 right-4 text-cream/10 font-cinzel text-3xl font-bold">{item.step}</span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="font-cinzel text-lg font-bold text-cream mb-2">{item.title}</h3>

                {/* Description */}
                <p className="text-cream/50 text-sm font-inter leading-relaxed mb-2">{item.desc}</p>

                {/* Real-world example */}
                <p className="text-gold/40 text-xs font-inter italic">{item.example}</p>

                {/* Connector line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-cream/10 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 text-center"
        >
          <Link
            href="/crust"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold to-amber text-black text-sm font-bold hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4" />
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
