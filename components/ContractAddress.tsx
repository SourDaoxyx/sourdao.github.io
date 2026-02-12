"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ContractAddressProps {
  address: string;
  label?: string;
}

export default function ContractAddress({ address, label }: ContractAddressProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <p className="text-cream/60 text-sm mb-2 text-center">{label || t("contract.label")}</p>
      <div className="flex items-center justify-center gap-2 p-3 rounded-xl glass-gold">
        {/* Address */}
        <code className="text-gold font-mono text-sm md:text-base">
          <span className="hidden md:inline">{address}</span>
          <span className="md:hidden">{shortenAddress(address)}</span>
        </code>

        {/* Copy Button */}
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gold/20 transition-colors"
          aria-label="Copy address"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-400" />
          ) : (
            <Copy className="w-5 h-5 text-gold" />
          )}
        </motion.button>

        {/* External Link */}
        <motion.a
          href={`https://solscan.io/token/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-lg hover:bg-gold/20 transition-colors"
          aria-label="View on Solscan"
        >
          <ExternalLink className="w-5 h-5 text-gold" />
        </motion.a>
      </div>

      {/* Copy Feedback */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : -10 }}
        className="text-green-400 text-sm text-center mt-2"
      >
        {t("contract.copied")}
      </motion.p>
    </motion.div>
  );
}
