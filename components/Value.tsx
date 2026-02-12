"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Users,
  Shield,
  Flame,
  Lock,
  Clock,
  ChevronRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import ContractAddress from "./ContractAddress";
import { useLanguage } from "@/lib/LanguageContext";

export default function Value() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { t } = useLanguage();

  const stats = [
    { icon: Users, label: t("tokenomics.community.title"), value: t("tokenomics.community.value"), suffix: t("tokenomics.community.suffix"), desc: t("tokenomics.community.desc"), color: "from-blue-400 to-cyan-500" },
    { icon: Shield, label: t("tokenomics.tax.title"), value: t("tokenomics.tax.value"), suffix: t("tokenomics.tax.suffix"), desc: t("tokenomics.tax.desc"), color: "from-green-400 to-emerald-500" },
    { icon: Flame, label: t("tokenomics.lp.title"), value: t("tokenomics.lp.value"), suffix: "", desc: t("tokenomics.lp.desc"), color: "from-orange-400 to-red-500" },
    { icon: Lock, label: t("tokenomics.renounced.title"), value: t("tokenomics.renounced.value"), suffix: t("tokenomics.renounced.suffix"), desc: t("tokenomics.renounced.desc"), color: "from-purple-400 to-pink-500" },
  ];

  const tiers = [
    { name: t("value.tier1.name"), emoji: "🫓", req: t("value.tier1.req"), time: t("value.tier1.time"), color: "text-stone-400", border: "border-stone-500/30", bg: "from-stone-500/10 to-stone-600/5", benefits: [t("value.tier1.b1"), t("value.tier1.b2"), t("value.tier1.b3")] },
    { name: t("value.tier2.name"), emoji: "🍞", req: t("value.tier2.req"), time: t("value.tier2.time"), color: "text-amber-600", border: "border-amber-600/30", bg: "from-amber-600/10 to-amber-700/5", benefits: [t("value.tier2.b1"), t("value.tier2.b2"), t("value.tier2.b3")] },
    { name: t("value.tier3.name"), emoji: "👨‍🍳", req: t("value.tier3.req"), time: t("value.tier3.time"), color: "text-amber-400", border: "border-amber-400/30", bg: "from-amber-400/10 to-amber-500/5", benefits: [t("value.tier3.b1"), t("value.tier3.b2"), t("value.tier3.b3"), t("value.tier3.b4")] },
    { name: t("value.tier4.name"), emoji: "👑", req: t("value.tier4.req"), time: t("value.tier4.time"), color: "text-gold", border: "border-gold/40", bg: "from-gold/15 to-amber-500/5", benefits: [t("value.tier4.b1"), t("value.tier4.b2"), t("value.tier4.b3"), t("value.tier4.b4")] },
  ];

  const revenue = [
    { label: t("value.revenue.operations"), value: "50%", color: "bg-green-500", width: "w-[50%]" },
    { label: t("value.revenue.holders"), value: "15%", color: "bg-gold", width: "w-[15%]" },
    { label: t("value.revenue.commons"), value: "15%", color: "bg-purple-500", width: "w-[15%]" },
    { label: t("value.revenue.burn"), value: "20%", color: "bg-orange-500", width: "w-[20%]" },
  ];

  return (
    <section ref={ref} id="value" className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-gold/4 rounded-full blur-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6"
            whileHover={{ scale: 1.05 }}
          >
            {t("value.badge")}
          </motion.span>

          <h2 className="font-cinzel text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              {t("tokenomics.title")}
            </span>
          </h2>

          <p className="font-inter text-cream/50 max-w-2xl mx-auto text-base">
            {t("tokenomics.subtitle")}
          </p>
        </motion.div>

        {/* Tokenomics Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl glass-gold overflow-hidden text-center p-5"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} bg-opacity-20 flex items-center justify-center mx-auto mb-3`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream to-gold">
                  {item.value}
                </span>
                {item.suffix && <span className="text-lg text-gold/70 ml-1">{item.suffix}</span>}
              </div>
              <h3 className="text-sm font-cinzel font-bold text-gold mb-1">{item.label}</h3>
              <p className="text-cream/50 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Contract Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <ContractAddress address="MAYA...Coming Soon" label={t("tokenomics.contract")} />
        </motion.div>

        {/* Revenue Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-12 p-6 md:p-8 rounded-2xl glass-gold border border-gold/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-gold" />
            <h3 className="font-cinzel text-xl font-bold text-cream">{t("value.revenue.title")}</h3>
          </div>
          <p className="text-cream/40 text-sm mb-6">
            {t("value.revenue.desc")} <span className="text-gold">{t("value.revenue.highlight")}</span>
          </p>

          <div className="flex w-full h-7 rounded-full overflow-hidden mb-4">
            {revenue.map((r, i) => (
              <div key={i} className={`${r.color} ${r.width} flex items-center justify-center text-xs font-bold text-black/80`}>
                {r.value}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {revenue.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                <span className="text-cream/45 text-sm">{r.label}</span>
              </div>
            ))}
          </div>

          {/* Revenue Example */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-gold/5 border border-gold/10">
            <div>
              <p className="text-cream/30 text-[11px] mb-0.5">{t("value.revenue.early.label")}</p>
              <p className="text-cream/60 text-sm font-medium">{t("value.revenue.early.value")}</p>
            </div>
            <div>
              <p className="text-cream/30 text-[11px] mb-0.5">{t("value.revenue.growth.label")}</p>
              <p className="text-cream/60 text-sm font-medium">{t("value.revenue.growth.value")}</p>
            </div>
            <div>
              <p className="text-cream/30 text-[11px] mb-0.5">{t("value.revenue.scale.label")}</p>
              <p className="text-cream/60 text-sm font-medium">{t("value.revenue.scale.value")}</p>
            </div>
          </div>
        </motion.div>

        {/* Holder Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className={`relative p-5 rounded-2xl bg-gradient-to-br ${tier.bg} border ${tier.border} hover:border-gold/40 transition-all duration-500`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{tier.emoji}</span>
                <div>
                  <h4 className={`font-cinzel text-base font-bold ${tier.color}`}>{tier.name}</h4>
                  <p className="text-cream/35 text-[11px]">{tier.req}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded bg-black/30 w-fit">
                <Clock className="w-3 h-3 text-cream/30" />
                <span className="text-cream/40 text-[11px]">{tier.time}</span>
              </div>
              <ul className="space-y-1.5">
                {tier.benefits.map((b, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-cream/50">
                    <ChevronRight className={`w-3 h-3 mt-0.5 ${tier.color} flex-shrink-0`} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {i === 3 && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Burn Math */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="p-6 md:p-8 rounded-2xl glass-gold border border-gold/20 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="font-cinzel text-xl font-bold text-cream">{t("value.burn.title")}</h3>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { year: t("value.burn.launch"), supply: "1B", your: "0.10%" },
              { year: t("value.burn.year1"), supply: "~998M", your: "0.10%" },
              { year: t("value.burn.year3"), supply: "~760M", your: "0.13%" },
              { year: t("value.burn.year5"), supply: "~600M", your: "0.17%" },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-black/30 border border-cream/5">
                <p className="text-cream/30 text-[11px] mb-1">{item.year}</p>
                <p className="text-cream/60 font-mono text-sm font-medium">{item.supply}</p>
                <p className="text-gold text-xs font-medium mt-1">{item.your}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
            <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-cream/50 text-sm">
              {t("value.burn.desc")}
            </p>
          </div>
        </motion.div>

        {/* Sell = Reset */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3"
        >
          <Lock className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-400 font-bold text-sm mb-0.5">{t("value.sellReset.title")}</h4>
            <p className="text-cream/40 text-sm">
              {t("value.sellReset.desc")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
