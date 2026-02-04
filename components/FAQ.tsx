'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is MAYA: The Genesis Starter?",
      answer: "MAYA is not just a token — it's a movement. Inspired by the 6,000-year-old tradition of sourdough starter, MAYA represents organic, patient growth in contrast to the artificial, debt-fueled traditional finance system. Our live fermentation stream proves this is real, authentic, and growing every day."
    },
    {
      question: "Why sourdough? What's the connection to crypto?",
      answer: "Sourdough starter has survived empires, wars, and economic collapses for millennia. It's passed down through generations, requires no central authority, and grows organically. Sound familiar? That's exactly what decentralized finance should be. While banks inflate your money away, the starter keeps fermenting."
    },
    {
      question: "Is this a memecoin?",
      answer: "We prefer 'culture coin.' Yes, there are memes. Yes, there's community fun. But there's also real utility planned: LP staking, referral rewards, governance, and eventually our own chain. The memes get you in the door; the fundamentals keep you here."
    },
    {
      question: "What makes MAYA different from other tokens?",
      answer: "24/7 live proof of concept (literally watch the starter ferment), fair launch on Pump.fun with no presale or insider allocation, time-based holder rewards that incentivize patience, real-world utility through bakery partnerships, and a community that actually makes bread together."
    },
    {
      question: "How do I buy MAYA?",
      answer: "During Phase 1, MAYA is available on Pump.fun (Solana). Simply connect your Phantom or Solflare wallet, swap SOL for MAYA, and join the bakery. In Phase 2, we'll expand to Raydium and multiple chains including Ethereum, Base, and Arbitrum."
    },
    {
      question: "What are Baker Tiers?",
      answer: "The longer you hold MAYA without selling, the higher your Baker tier. Fresh Dough (0-7 days) → Rising (7-30) → Proofing (30-90) → Fermented (90-365) → Aged Starter (365+). Higher tiers get better reward multipliers, exclusive access, and governance power. Sell and your timer resets!"
    },
    {
      question: "Is the team anonymous?",
      answer: "The starter has no owner — just caretakers. This is intentional. We believe in decentralization not as a buzzword but as a principle. The code is open source, the liquidity is burned, and the community governs. You don't need to trust us; you can verify everything on-chain."
    },
    {
      question: "What's the tokenomics?",
      answer: "1 Billion total supply. 100% to community (no team allocation). 0% buy/sell tax. Liquidity burned forever. Contract renounced. This is as fair as it gets. No rugs, no games, just organic growth."
    },
    {
      question: "What's the roadmap?",
      answer: "Phase 1: Pump.fun launch + community building. Phase 2: Multichain expansion + LP staking + referral program. Phase 3: MAYA Chain + real-world payments + DAO governance. Phase 4: Global adoption + traditional finance integration. See the full roadmap on our site."
    },
    {
      question: "How can I contribute?",
      answer: "Make bread and post it with #MAYABread, create memes and content, invite friends through your referral link, participate in governance votes, become an ambassador, or just hold and believe. Every baker matters."
    },
  ];

  return (
    <section className="relative py-32 px-4 overflow-hidden" id="faq">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
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
            ❓ FAQ
          </motion.span>
          
          <h2 className="font-cinzel text-4xl md:text-5xl font-bold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream">
              FREQUENTLY ASKED
            </span>
          </h2>
          
          <p className="font-inter text-cream/60 max-w-2xl mx-auto">
            Everything you need to know about MAYA and the Organic Finance movement.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="rounded-xl glass-gold border border-gold/20 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gold/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <HelpCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <span className="font-cinzel text-lg text-cream pr-4">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="pl-9 border-l-2 border-gold/30">
                        <p className="text-cream/70 leading-relaxed pl-4">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-cream/60 mb-4">Still have questions?</p>
          <motion.a
            href="https://t.me/mayastarter"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 glass-gold text-gold hover:text-cream transition-colors rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ask in Telegram
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
