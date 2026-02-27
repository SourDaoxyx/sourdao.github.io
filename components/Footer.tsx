"use client";

import { motion } from "framer-motion";
import {
  Twitter,
  Send,
  Github,
  Heart,
  FileText,
  ScrollText,
  Fingerprint,
  Handshake,
  Wheat,
  Factory,
  Map,
  Coins,
  Trophy,
  Info,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const { t } = useLanguage();

  const socialLinks = [
    {
      icon: Twitter,
      name: "X (Twitter)",
      url: "https://x.com/sourdaoxyz",
      handle: "@sourdaoxyz",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Send,
      name: "Telegram",
      url: "https://t.me/sourdaoxyz",
      handle: "t.me/sourdaoxyz",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: Github,
      name: "GitHub",
      url: "https://github.com/SourDaoxyx",
      handle: "github.com/SourDaoxyx",
      color: "from-gray-400 to-gray-600",
    },
    {
      icon: FileText,
      name: "Whitepaper",
      url: "/whitepaper",
      handle: t("footer.whitepaperHandle"),
      color: "from-gold to-amber",
    },
  ];

  const constitutionArticles = [
    t("footer.constitution.a1"),
    t("footer.constitution.a2"),
    t("footer.constitution.a3"),
    t("footer.constitution.a4"),
    t("footer.constitution.a5"),
  ];

  const footerColumns = [
    {
      title: "Protocol",
      links: [
        { label: t("nav.problem"), href: "/#problem", icon: ScrollText },
        { label: t("nav.manifesto"), href: "/#manifesto", icon: ScrollText },
        { label: "Tokenomics", href: "/#value", icon: Coins },
        { label: t("nav.roadmap"), href: "/#roadmap", icon: Map },
      ],
    },
    {
      title: "Build",
      links: [
        { label: "Crust", href: "/crust", icon: Fingerprint, badge: "Live" },
        { label: "Handshake", href: "/handshake", icon: Handshake, badge: "Beta" },
        { label: "Harvest", href: "/#value", icon: Wheat, badge: "Soon" },
        { label: "Mill", href: "/#protocol", icon: Factory, badge: "Soon" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: t("nav.about"), href: "/about", icon: Info },
        { label: "Leaderboard", href: "/crust/leaderboard", icon: Trophy },
        { label: "Whitepaper", href: "/whitepaper", icon: FileText },
      ],
    },
  ];

  return (
    <footer className="relative py-20 px-4 overflow-hidden">
      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-t from-gold/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Constitution Oath */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 p-6 md:p-8 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 via-transparent to-amber-500/5"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <ScrollText className="w-5 h-5 text-gold" />
            <h3 className="font-cinzel text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold via-amber to-gold">
              {t("footer.constitution.title")}
            </h3>
            <ScrollText className="w-5 h-5 text-gold" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {constitutionArticles.map((article, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/5 border border-gold/15"
              >
                <span className="font-cinzel text-xs font-bold text-gold">
                  {i + 1}
                </span>
                <span className="text-cream/60 text-xs">{article}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-cream/30 text-xs italic">
            {t("footer.constitution.note")}
          </p>
        </motion.div>

        {/* Main Grid — Quote + 3 Link Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Left — Logo, Quote, Socials (spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full overflow-hidden relative">
                <Image
                  src="/sour-logo.svg"
                  alt="SOUR"
                  fill
                  className="object-contain"
                  sizes="36px"
                />
              </div>
              <h3 className="text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold to-amber">
                {t("footer.title")}
              </h3>
            </div>

            <div className="relative p-5 rounded-2xl glass-gold mb-6">
              <p className="text-lg font-playfair text-cream italic leading-relaxed">
                &ldquo;{t("footer.quote")}&rdquo;
              </p>
            </div>

            <p className="text-cream/60 font-inter text-sm leading-relaxed mb-6">
              {t("footer.description")}
            </p>

            {/* Social Icons Row */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={i}
                    href={link.url}
                    target={link.url.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.url.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center hover:shadow-lg transition-shadow`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right — 3 Link Columns (spans 3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerColumns.map((col, ci) => (
              <motion.div
                key={ci}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * ci }}
              >
                <h4 className="font-cinzel text-sm font-bold text-gold mb-4 tracking-wider uppercase">
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((link, li) => {
                    const Icon = link.icon;
                    const isPage =
                      !link.href.startsWith("#") &&
                      !link.href.startsWith("/#") &&
                      !link.href.startsWith("http");

                    const inner = (
                      <span className="flex items-center gap-2 text-cream/50 hover:text-cream transition-colors text-sm group">
                        <Icon className="w-3.5 h-3.5 text-cream/30 group-hover:text-gold transition-colors" />
                        {link.label}
                        {"badge" in link && link.badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gold/10 text-gold/60">
                            {link.badge}
                          </span>
                        )}
                      </span>
                    );

                    return (
                      <li key={li}>
                        {isPage ? (
                          <Link href={link.href}>{inner}</Link>
                        ) : (
                          <a href={link.href}>{inner}</a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden relative">
                <Image
                  src="/sour-logo.svg"
                  alt="SOUR"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <span className="font-cinzel font-bold text-gold">SOUR</span>
            </div>

            <p className="text-cream/50 font-inter text-sm text-center">
              {t("footer.copyright")}
            </p>

            <div className="flex items-center gap-2 text-cream/40 text-sm">
              <span>{t("footer.madeWith")}</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>{t("footer.byBakers")}</span>
            </div>
          </div>

          <p className="text-center text-cream/30 font-inter text-xs mt-6">
            {t("footer.rights")}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
