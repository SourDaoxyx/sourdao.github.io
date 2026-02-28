"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Coins, Fingerprint, Handshake, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    icon: Coins,
    title: "Buy $SOUR",
    desc: "Get $SOUR on Pump.fun. Fair launch — no presale, no insiders.",
    color: "from-green-400 to-emerald-500",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    cta: { label: "Buy Now", href: "https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump", external: true },
  },
  {
    step: "02",
    icon: Fingerprint,
    title: "Build Your Crust",
    desc: "Connect wallet → see your Baker Card. Hold longer, score higher.",
    color: "from-cyan-400 to-blue-500",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
    cta: { label: "My Crust", href: "/crust", external: false },
  },
  {
    step: "03",
    icon: Handshake,
    title: "Make Handshakes",
    desc: "P2P escrow agreements. Complete deals, earn reputation.",
    color: "from-purple-400 to-violet-500",
    border: "border-purple-500/20",
    bg: "bg-purple-500/5",
    cta: { label: "Coming Soon", href: "/handshake", external: false },
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Earn & Govern",
    desc: "Higher Crust = higher harvest share. Your reputation is your yield.",
    color: "from-gold to-amber-500",
    border: "border-gold/20",
    bg: "bg-gold/5",
    cta: null,
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
            Four steps to build your on-chain reputation and join the organic finance revolution.
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
                <p className="text-cream/50 text-sm font-inter leading-relaxed mb-4">{item.desc}</p>

                {/* CTA */}
                {item.cta && (
                  item.cta.external ? (
                    <a
                      href={item.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-gold text-xs font-medium hover:text-amber-400 transition-colors"
                    >
                      {item.cta.label}
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  ) : (
                    <Link
                      href={item.cta.href}
                      className="inline-flex items-center gap-1.5 text-gold text-xs font-medium hover:text-amber-400 transition-colors"
                    >
                      {item.cta.label}
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )
                )}

                {/* Connector line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-cream/10 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
