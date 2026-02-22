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
      "Cüzdan tabanlı Baker Profil Sistemi. Cüzdanını bağla, $SOUR bakiyeni ve holding sürenle otomatik tier belirlensin. Baker Card&apos;ını PNG olarak indir veya Twitter&apos;da paylaş.",
    features: [
      "Phantom & Solflare cüzdan desteği",
      "On-chain bakiye + ilk TX tarihi okuma",
      "4 kademeli Keeper sistemi (Fresh → Eternal)",
      "Profil düzenleme + localStorage",
      "PNG kart export + sosyal paylaşım",
    ],
    link: "/crust",
    linkText: "Crust'a Git →",
  },
  {
    icon: Handshake,
    name: "The Handshake",
    status: "🔜 Yakında",
    statusColor: "text-blue-400",
    description:
      "İki cüzdan arası P2P anlaşma sistemi. Akıllı kontrat üzerinde escrow, milestone bazlı ödeme, anlaşmazlık çözümü. Platform komisyonu %50 burn edilir.",
    features: [
      "Cüzdan-cüzdan doğrudan anlaşma",
      "Escrow bazlı güvenli ödeme",
      "Milestone takibi",
      "Anlaşmazlık hakemliği",
      "Komisyonun %50'si yakılır",
    ],
    link: null,
    linkText: null,
  },
  {
    icon: BarChart3,
    name: "The Harvest",
    status: "📋 Planlandı",
    statusColor: "text-gold/60",
    description:
      "Oven Dashboard — topluluk metrikleri, burn tracker, keeper istatistikleri. MAYA ekosisteminin nabzını tutan merkezi kontrol paneli.",
    features: [
      "Gerçek zamanlı burn tracker",
      "Keeper dağılım haritası",
      "Topluluk büyüme metrikleri",
      "Anlaşma istatistikleri",
      "Hazine yönetim paneli",
    ],
    link: null,
    linkText: null,
  },
];

const techStack = [
  { category: "Frontend", items: "Next.js 15, React 19, TypeScript" },
  { category: "Stil", items: "Tailwind CSS, Framer Motion" },
  { category: "Blockchain", items: "@solana/web3.js v1, SPL Token" },
  { category: "Cüzdan", items: "wallet-adapter (Phantom + Solflare)" },
  { category: "Export", items: "html-to-image (PNG kart)" },
  { category: "Deploy", items: "GitHub Pages (static export)" },
];

const timeline = [
  {
    date: "Şubat 2026",
    title: "Proje Başlangıcı",
    items: [
      "Site tasarımı ve geliştirme",
      "Whitepaper yazımı",
      "3 Sütun vizyonu belirlendi",
    ],
  },
  {
    date: "Şubat 2026",
    title: "MVP 1: The Crust",
    items: [
      "Baker Profil Sistemi geliştirildi",
      "Solana wallet entegrasyonu",
      "4 kademeli Keeper sistemi",
      "PNG export + sosyal paylaşım",
    ],
  },
  {
    date: "Mart 2026",
    title: "Token Launch",
    items: [
      "$MAYA pump.fun lansmanı",
      "Topluluk büyütme kampanyası",
      "İlk Keeper ödülleri",
    ],
  },
  {
    date: "Mart-Nisan 2026",
    title: "MVP 2: The Handshake",
    items: [
      "P2P anlaşma akıllı kontratı",
      "Escrow sistemi",
      "Anlaşmazlık çözüm mekanizması",
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
              MAYA Nedir?
            </span>
          </h1>

          <p className="text-cream/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            SOUR, dijital feodalizme karşı organik bir medeniyet inşa ediyor.
            Platformlar seni ürün yapıyor — SOUR seni <strong className="text-gold">sahip</strong> yapıyor.
            Cüzdanını bağla, itibarını inşa et, aracıları depasaj yap.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/crust"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm hover:scale-105 transition-transform"
            >
              <Fingerprint className="w-4 h-4" />
              Crust&apos;u Dene
            </Link>
            <a
              href="https://github.com/MayaStarter/mayastarter.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/30 text-gold font-medium text-sm hover:border-gold/60 hover:bg-gold/5 transition-all"
            >
              <Github className="w-4 h-4" />
              Kaynak Kod
            </a>
          </div>
        </motion.div>
      </section>

      {/* Vizyon */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="🌱 VİZYON"
            title="Organik Finans Medeniyeti"
            subtitle="Modern finans bayat. Biz mayalamaya geldik."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Flame,
                title: "Yak & İnşa Et",
                text: "Platform gelirinin %50'si yakılır. Arz azalır, değer artar. Basit matematik.",
              },
              {
                icon: Shield,
                title: "%0 Vergi",
                text: "Alım-satımda vergi yok. Likidite yakılacak. Tam şeffaflık, tam özgürlük.",
              },
              {
                icon: Users,
                title: "Topluluk Sahipli",
                text: "Tek sahibi yok, tek otoritesi yok. DAO yönetişimine geçiş planlanıyor.",
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

      {/* Üç Sütun */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge="🏛️ ÜÇ SÜTUN"
            title="Medeniyet Protokolü"
            subtitle="MAYA üç temel ürün üzerine inşa edilmektedir. Her biri bağımsız çalışır, birlikte bir ekosistem oluşturur."
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

      {/* Teknik Altyapı */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="⚙️ TEKNOLOJİ"
            title="Teknik Altyapı"
            subtitle="Modern, performanslı ve tamamen açık kaynak."
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
              <h4 className="text-cream font-medium text-sm mb-1">Açık Kaynak</h4>
              <p className="text-cream/40 text-xs leading-relaxed">
                Tüm kaynak kod GitHub üzerinde herkese açıktır. Static export ile
                GitHub Pages&apos;e deploy edilir. IPFS desteği planlanmaktadır.
              </p>
              <a
                href="https://github.com/MayaStarter/mayastarter.github.io"
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

      {/* Zaman Çizelgesi */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            badge="📅 GELİŞTİRME"
            title="Zaman Çizelgesi"
            subtitle="Adım adım, her sprint'te somut çıktı."
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
                  {item.date}
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

      {/* Tokenomics Özet */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="💰 TOKENOMİKS"
            title="$MAYA Token"
            subtitle="Basit, şeffaf, topluluk odaklı."
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Toplam Arz", value: "1B", sub: "$MAYA" },
              { label: "Vergi", value: "%0", sub: "Alım & satım" },
              { label: "Burn Oranı", value: "%50", sub: "Gelirden" },
              { label: "Keeper Payı", value: "%30", sub: "Gelirden" },
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
              <strong className="text-cream/60">Gelir Formülü:</strong> Platform geliri → %50 Burn · %30 Keepers (tier&apos;a göre) · %20 Commons — tamamı $SOUR cinsinden
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
            Medeniyete Katıl
          </h2>
          <p className="text-cream/45 text-sm mb-8 max-w-lg mx-auto">
            MAYA bir kişi değil, bir fikirdir. Bir fikrin sahibi olmaz — sadece ona katkıda bulunanlar vardır.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/crust"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm hover:scale-105 transition-transform"
            >
              Baker Card Al
            </Link>
            <Link
              href="/whitepaper"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gold/30 text-gold font-medium text-sm hover:border-gold/60 transition-all"
            >
              Whitepaper Oku
            </Link>
            <a
              href="https://t.me/mayastarter"
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
