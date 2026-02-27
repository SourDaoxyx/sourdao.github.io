"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check, Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";

interface ShareCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  tierName: string;
  daysFermenting: number;
  crustScore?: number;
}

export default function ShareCard({
  cardRef,
  tierName,
  daysFermenting,
  crustScore,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  const generateImage = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    try {
      // Run toPng twice — first call warms up fonts/images, second gives clean output
      await toPng(cardRef.current, { cacheBust: true, pixelRatio: 1 });
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000000",
        style: {
          transform: "none",
          opacity: "1",
        },
      });
      return dataUrl;
    } catch (err) {
      console.error("Failed to generate card image", err);
      return null;
    }
  }, [cardRef]);

  const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const res = await fetch(dataUrl);
    return res.blob();
  };

  const handleDownload = async () => {
    setDownloading(true);
    const dataUrl = await generateImage();
    if (dataUrl) {
      const link = document.createElement("a");
      link.download = "sour-baker-card.png";
      link.href = dataUrl;
      link.click();
    }
    setDownloading(false);
  };

  const handleTwitterShare = async () => {
    const scoreText = crustScore ? `\nCrust Score: ${crustScore}/1000` : "";
    const text = `I'm a ${tierName} Baker 🍞\nFermenting for ${daysFermenting} days.${scoreText}\n\nYour dough. Your bread. Your economy.\n\n#SOUR #TheBakers #CivilizationProtocol`;
    const url = "https://sourdao.xyz/crust";

    // Generate card image
    const dataUrl = await generateImage();

    if (dataUrl) {
      const blob = await dataUrlToBlob(dataUrl);
      const file = new File([blob], "sour-baker-card.png", { type: "image/png" });

      // Try Web Share API (mobile + modern desktop: shares image directly)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            text: `${text}\n${url}`,
            files: [file],
          });
          return;
        } catch {
          // User cancelled or share failed — fall through to Twitter intent
        }
      }

      // Fallback: copy image to clipboard, then open Twitter
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setImageCopied(true);
        setTimeout(() => setImageCopied(false), 4000);
      } catch {
        // Clipboard write not supported — just download the image instead
        const link = document.createElement("a");
        link.download = "sour-baker-card.png";
        link.href = dataUrl;
        link.click();
      }
    }

    // Open Twitter compose
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleCopyLink = async () => {
    const profileUrl = "https://sourdao.xyz/crust";
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
        {imageCopied ? "Card Copied! Paste in tweet →" : "Share on X"}
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
