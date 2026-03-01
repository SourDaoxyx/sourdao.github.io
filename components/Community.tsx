'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  MessageCircle, 
  Users, 
  Sparkles,
  ArrowRight,
  Heart,
  Globe,
  Github,
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function Community() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const communityLinks = [
    {
      platform: t("community.telegram.name"),
      handle: "@sourdaoxyz",
      description: t("community.telegram.desc"),
      icon: MessageCircle,
      url: "https://t.me/sourdao",
      color: "from-blue-400 to-cyan-500",
      members: t("community.growing"),
      cta: t("community.telegram.cta"),
    },
    {
      platform: t("community.twitter.name"),
      handle: "@sourdaoxyz",
      description: t("community.twitter.desc"),
      icon: "twitter" as const,
      url: "https://x.com/sourdaoxyz",
      color: "from-gray-600 to-gray-800",
      members: t("community.growing"),
      cta: t("community.twitter.cta"),
    },
    {
      platform: "GitHub",
      handle: "SourDaoxyx",
      description: "Open source — all smart contracts, website, and SDK. Verify everything on-chain.",
      icon: Github,
      url: "https://github.com/SourDaoxyx",
      color: "from-gray-400 to-gray-700",
      members: "Open Source",
      cta: "View Code",
    },
  ];

  const stats = [
    { label: t("community.stat.members"), value: t("community.growing"), icon: Users },
    { label: "Open Source", value: "100%", icon: Globe },
    { label: "On-chain Products", value: "2", icon: Sparkles },
    { label: t("community.stat.passion"), value: "∞", icon: Heart },
  ];

  const TwitterIcon = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="community">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.span 
            className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6"
            whileHover={{ scale: 1.05 }}
          >
            {t("community.badge")}
          </motion.span>
          
          <h2 className="font-cinzel text-4xl md:text-6xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              {t("community.title")}
            </span>
          </h2>
          
          <p className="font-inter text-cream/60 max-w-2xl mx-auto text-lg">
            {t("community.description")}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="p-6 rounded-xl glass-gold text-center"
            >
              <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="font-cinzel text-2xl font-bold text-cream">{stat.value}</p>
              <p className="text-cream/50 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Links */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {communityLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target={link.url.startsWith('http') ? '_blank' : undefined}
              rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-8 rounded-2xl glass-gold border border-gold/20 hover:border-gold/40 transition-all duration-500 cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {link.icon === "twitter" ? (
                  <TwitterIcon />
                ) : typeof link.icon === "string" ? null : (
                  <link.icon className="w-8 h-8 text-white" />
                )}
              </div>

              {/* Content */}
              <h3 className="font-cinzel text-xl font-bold text-cream mb-2">
                {link.platform}
              </h3>
              <p className="text-gold text-sm mb-3">{link.handle}</p>
              <p className="text-cream/60 text-sm mb-6">
                {link.description}
              </p>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span className="text-cream/40 text-sm">{link.members}</span>
                <span className="flex items-center gap-2 text-gold group-hover:gap-3 transition-all">
                  {link.cta}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              {/* Hover Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
            </motion.a>
          ))}
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-gold/10 via-amber-500/5 to-gold/10 border border-gold/20">
            <p className="font-playfair text-xl md:text-2xl text-cream/90 italic mb-4">
              &ldquo;{t("community.quote")}&rdquo;
            </p>
            <p className="text-gold/60 text-sm">{t("community.quoteAttribution")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
