"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Fingerprint,
  Handshake,
  BarChart3,
  Flame,
  Shield,
  Users,
  Globe,
  Code2,
  Layers,
  ArrowRight,
  Github,
  ExternalLink,
  Factory,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const pillars = [
  {
    icon: Fingerprint,
    name: "The Crust",
    status: "✅ Live",
    statusColor: "text-green-400",
    description:
      "Wallet-based Baker Profile System. Connect your wallet, your tier is automatically determined by $SOUR balance and holding duration. Download your Baker Card as PNG or share on Twitter.",
    features: [
      "Phantom & Solflare wallet support",
      "On-chain balance + first TX date reading",
      "4-tier Keeper system (Fresh → Eternal)",
      "Profile editing + localStorage",
      "PNG card export + social sharing",
    ],
    link: "/crust",
    linkText: "Go to Crust →",
  },
  {
    icon: Handshake,
    name: "The Handshake",
    status: "🧪 Beta Live",
    statusColor: "text-cyan-400",
    description:
      "P2P agreement system between two wallets. Smart contract escrow, milestone-based payments, dispute resolution. 50% of platform fees are burned.",
    features: [
      "Direct wallet-to-wallet agreements",
      "Escrow-based secure payments",
      "Milestone tracking",
      "Dispute arbitration",
      "50% of fees burned",
    ],
    link: "/handshake",
    linkText: "Open Handshake →",
  },
  {
    icon: BarChart3,
    name: "The Harvest",
    status: "📋 Planned",
    statusColor: "text-gold/60",
    description:
      "Oven Dashboard — community metrics, burn tracker, keeper statistics. The central control panel that tracks the pulse of the SOUR ecosystem.",
    features: [
      "Real-time burn tracker",
      "Keeper distribution map",
      "Community growth metrics",
      "Agreement statistics",
      "Treasury management panel",
    ],
    link: null,
    linkText: null,
  },
  {
    icon: Factory,
    name: "The Mill",
    status: "📋 Planned",
    statusColor: "text-gold/60",
    description:
      "Decentralized AI Workflow Marketplace — buy, sell, and run automations powered by $SOUR. AI agents burn micro $SOUR on every execution. Creators earn perpetual royalties.",
    features: [
      "AI workflow & agent template marketplace",
      "Creator royalties (10-20% per use)",
      "Agent Fuel: micro $SOUR burn per execution",
      "Sandbox testing before purchase",
      "Crust-verified seller reputation",
    ],
    link: null,
    linkText: null,
  },
];

const techStack = [
  { category: "Frontend", items: "Next.js 15, React 19, TypeScript" },
  { category: "Styling", items: "Tailwind CSS, Framer Motion" },
  { category: "Blockchain", items: "@solana/web3.js v1, SPL Token" },
  { category: "Smart Contracts", items: "Anchor 0.30.1 (Rust)" },
  { category: "Wallets", items: "wallet-adapter (Phantom + Solflare)" },
  { category: "Export", items: "html-to-image (PNG card)" },
  { category: "Deploy", items: "Vercel (static export)" },
];

const timeline = [
  {
    phase: "PHASE 1",
    title: "Project Launch",
    items: [
      "Site design and development",
      "Whitepaper written",
      "4-Pillar vision established",
    ],
  },
  {
    phase: "PHASE 2",
    title: "MVP 1: The Crust",
    items: [
      "Baker Profile System developed",
      "Solana wallet integration",
      "4-tier Keeper system",
      "PNG export + social sharing",
    ],
  },
  {
    phase: "PHASE 3",
    title: "Token Launch",
    items: [
      "$SOUR pump.fun launch",
      "Community growth campaign",
      "First Keeper rewards",
    ],
  },
  {
    phase: "PHASE 4",
    title: "MVP 2: The Handshake",
    items: [
      "P2P agreement smart contract",
      "Escrow system",
      "Dispute resolution mechanism",
    ],
  },
  {
    phase: "PHASE 5",
    title: "The Mill (AI Marketplace)",
    items: [
      "Decentralized workflow marketplace",
      "AI agent templates",
      "Creator royalties + Agent Fuel burns",
      "Recipe Bounties & Mill Guilds",
    ],
  },
];

function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <span className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-5">
        {badge}
      </span>
      <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-3">
        {title}
      </h2>
      <p className="font-inter text-cream/50 max-w-2xl mx-auto text-base">
        {subtitle}
      </p>
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <main className="min-h-screen bg-black text-cream overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-gold/5 to-transparent blur-[200px]" />
        </div>

        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              What is SOUR?
            </span>
          </h1>

          <p className="text-cream/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            SOUR is building an organic civilization against digital feudalism.
            Platforms make you the product — SOUR makes you the <strong className="text-gold">owner</strong>.
            Connect your wallet, build your reputation, bypass the middlemen.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/crust"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm hover:scale-105 transition-transform"
            >
              <Fingerprint className="w-4 h-4" />
              Try Crust
            </Link>
            <a
              href="https://github.com/SourDaoxyx/sourdao.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/30 text-gold font-medium text-sm hover:border-gold/60 hover:bg-gold/5 transition-all"
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
          </div>
        </motion.div>
      </section>

      {/* Vision */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="🌱 VISION"
            title="Organic Finance Civilization"
            subtitle="Modern finance is stale. We came to ferment."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Flame,
                title: "Burn & Build",
                text: "50% of platform revenue is burned. Supply decreases, value increases. Simple math.",
              },
              {
                icon: Shield,
                title: "0% Tax",
                text: "No buy/sell tax. Liquidity will be burned. Full transparency, full freedom.",
              },
              {
                icon: Users,
                title: "Community Owned",
                text: "No single owner, no single authority. Transitioning to DAO governance.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="p-6 rounded-2xl glass-gold border border-gold/10 hover:border-gold/25 transition-all"
              >
                <item.icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="font-cinzel text-lg font-bold text-cream mb-2">
                  {item.title}
                </h3>
                <p className="text-cream/50 text-sm leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge="🏛️ THREE PILLARS"
            title="Civilization Protocol"
            subtitle="SOUR is built on three core products. Each operates independently, together they form an ecosystem."
          />

          <div className="space-y-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-2xl glass-gold border border-gold/10 hover:border-gold/25 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                      <pillar.icon className="w-7 h-7 text-gold" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-cinzel text-xl font-bold text-cream">
                        {pillar.name}
                      </h3>
                      <span className={`text-xs font-medium ${pillar.statusColor}`}>
                        {pillar.status}
                      </span>
                    </div>

                    <p className="text-cream/55 text-sm leading-relaxed mb-4">
                      {pillar.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {pillar.features.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-2 text-xs text-cream/40">
                          <ArrowRight className="w-3 h-3 text-gold/50 flex-shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    {pillar.link && (
                      <Link
                        href={pillar.link}
                        className="inline-flex items-center gap-2 text-gold text-sm font-medium hover:text-amber transition-colors"
                      >
                        {pillar.linkText}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="⚙️ TECHNOLOGY"
            title="Tech Stack"
            subtitle="Modern, performant, and fully open source."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="p-4 rounded-xl glass-gold border border-gold/10"
              >
                <div className="text-gold text-xs font-medium tracking-wider mb-1">
                  {tech.category}
                </div>
                <div className="text-cream/60 text-sm">{tech.items}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 p-5 rounded-xl glass-gold border border-gold/10 flex items-start gap-4"
          >
            <Code2 className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-cream font-medium text-sm mb-1">Open Source</h4>
              <p className="text-cream/40 text-xs leading-relaxed">
                All source code is publicly available on GitHub. Deployed as a static
                export via Vercel. IPFS support is planned.
              </p>
              <a
                href="https://github.com/SourDaoxyx/sourdao.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold text-xs mt-2 hover:text-amber transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub Repository
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            badge="📅 DEVELOPMENT"
            title="Timeline"
            subtitle="Step by step, tangible output every sprint."
          />

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />

            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="relative pl-12 pb-10 last:pb-0"
              >
                <div className="absolute left-2.5 top-1 w-3 h-3 rounded-full bg-gold/60 border-2 border-black" />
                <div className="text-gold/60 text-xs font-medium tracking-wider mb-1">
                  {item.phase}
                </div>
                <h3 className="font-cinzel text-lg font-bold text-cream mb-2">
                  {item.title}
                </h3>
                <ul className="space-y-1.5">
                  {item.items.map((li, li_idx) => (
                    <li key={li_idx} className="flex items-center gap-2 text-cream/45 text-sm">
                      <Layers className="w-3 h-3 text-gold/30 flex-shrink-0" />
                      {li}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="💰 TOKENOMICS"
            title="$SOUR Token"
            subtitle="Simple, transparent, community-focused."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Supply", value: "1B", sub: "$SOUR" },
              { label: "Tax", value: "0%", sub: "Buy & sell" },
              { label: "Burn Rate", value: "50%", sub: "From revenue" },
              { label: "Keeper Share", value: "30%", sub: "From revenue" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-5 rounded-xl glass-gold border border-gold/10 text-center"
              >
                <div className="font-cinzel text-2xl font-bold text-gold mb-1">
                  {stat.value}
                </div>
                <div className="text-cream/60 text-sm">{stat.label}</div>
                <div className="text-cream/30 text-xs mt-1">{stat.sub}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-6 p-4 rounded-xl bg-gold/5 border border-gold/10 text-center"
          >
            <p className="text-cream/40 text-xs">
              <strong className="text-cream/60">Revenue Formula:</strong> Platform revenue → 50% Burn · 30% Keepers (tier-weighted) · 20% Commons — all in $SOUR
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <Globe className="w-12 h-12 text-gold/40 mx-auto mb-6" />
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-cream mb-4">
            Join the Civilization
          </h2>
          <p className="text-cream/45 text-sm mb-8 max-w-lg mx-auto">
            SOUR is not a person, it is an idea. An idea has no owner — only contributors.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/crust"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm hover:scale-105 transition-transform"
            >
              Get Baker Card
            </Link>
            <Link
              href="/whitepaper"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/30 text-gold font-medium text-sm hover:border-gold/60 transition-all"
            >
              Read Whitepaper
            </Link>
            <a
              href="https://t.me/sourdaoxyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-cream/10 text-cream/50 font-medium text-sm hover:border-cream/30 transition-all"
            >
              Telegram
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
