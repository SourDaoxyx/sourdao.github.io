"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check } from "lucide-react";
import { toPng } from "html-to-image";
import { useState } from "react";

interface ShareCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  tierName: string;
  daysFermenting: number;
}

export default function ShareCard({
  cardRef,
  tierName,
  daysFermenting,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const generateImage = useCallback(async () => {
    if (!cardRef.current) return null;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000000",
      });
      return dataUrl;
    } catch {
      console.error("Failed to generate card image");
      return null;
    }
  }, [cardRef]);

  const handleDownload = async () => {
    setDownloading(true);
    const dataUrl = await generateImage();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = `maya-baker-card.png`;
      link.href = dataUrl;
      link.click();
    }
    setDownloading(false);
  };

  const handleTwitterShare = () => {
    const text = `I'm a ${tierName} Baker 🍞\nFermenting for ${daysFermenting} days.\n\nYour dough. Your bread. Your economy.\n\n#MAYA #TheBakers #CivilizationProtocol`;
    const url = `https://mayastarter.github.io/crust`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleCopyLink = async () => {
    const profileUrl = `https://mayastarter.github.io/crust`;
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {/* Download PNG */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/15 transition-colors disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {downloading ? "Generating..." : "Download Card"}
      </motion.button>

      {/* Twitter Share */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleTwitterShare}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/15 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share on X
      </motion.button>

      {/* Copy Link */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cream/5 border border-cream/10 text-cream/60 text-sm font-medium hover:bg-cream/10 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy Link"}
      </motion.button>
    </div>
  );
}
