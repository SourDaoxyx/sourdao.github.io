"use client";

import { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Copy, Check, Users, ArrowRight, X } from "lucide-react";
import { toPng } from "html-to-image";
import Link from "next/link";
import { MAX_SCORE } from "@/lib/crust-score";
import { isMobile } from "@/lib/mobile-wallet";

interface ShareCardProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  tierName: string;
  daysInProtocol: number;
  crustScore?: number;
  overallGrade?: string;
}

export default function ShareCard({
  cardRef,
  tierName,
  daysInProtocol,
  crustScore,
  overallGrade,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [onMobile, setOnMobile] = useState(false);

  useEffect(() => {
    setOnMobile(isMobile());
  }, []);

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
    if (!dataUrl) {
      setDownloading(false);
      return;
    }

    if (onMobile) {
      // Mobile: try native share with file, fallback to preview modal
      try {
        const blob = await dataUrlToBlob(dataUrl);
        const file = new File([blob], "sour-civilization-id.png", { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file] });
          setDownloading(false);
          return;
        }
      } catch {
        // User cancelled or share not supported — show preview modal
      }
      // Fallback: show image in modal for long-press save
      setMobilePreview(dataUrl);
    } else {
      // Desktop: direct download
      const link = document.createElement("a");
      link.download = "sour-civilization-id.png";
      link.href = dataUrl;
      link.click();
    }
    setDownloading(false);
  };

  const handleTwitterShare = async () => {
    const gradeText = overallGrade ? ` (Grade: ${overallGrade})` : "";
    const scoreText = crustScore ? `\nCivilization Score: ${crustScore}/${MAX_SCORE}${gradeText}` : "";
    const text = `I'm ${tierName} in the SOUR Civilization 🫙${scoreText}\n\nYour dough. Your bread. Your economy.\nCA: 2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump\n\n#SOUR #CivilizationProtocol`;
    const url = "https://sourdao.xyz/crust";

    // Generate card image
    const dataUrl = await generateImage();

    if (dataUrl) {
      const blob = await dataUrlToBlob(dataUrl);
      const file = new File([blob], "sour-civilization-id.png", { type: "image/png" });

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
        link.download = "sour-civilization-id.png";
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
    <div className="space-y-4">
      {/* Mobile Preview Modal — long press to save */}
      <AnimatePresence>
        {mobilePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
            onClick={() => setMobilePreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMobilePreview(null)}
                className="absolute -top-10 right-0 text-cream/50 hover:text-cream transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mobilePreview}
                alt="Your Civilization ID Card"
                className="w-full rounded-xl border border-gold/30"
              />
              <p className="text-center text-cream/60 text-sm mt-4">
                📱 Long press the image to save
              </p>
              <p className="text-center text-cream/30 text-[10px] mt-1">
                Then upload it manually when posting on X
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        {/* Download / Save Card */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/15 transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Generating..." : onMobile ? "Save Card" : "Download Card"}
        </motion.button>

        {/* Twitter Share — desktop only */}
        {!onMobile && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTwitterShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/15 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {imageCopied ? "Card Copied! Paste in tweet →" : "Share on X"}
          </motion.button>
        )}

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

      {/* Tweet Preview — desktop only */}
      {!onMobile && (
        <div className="rounded-xl border border-cream/8 bg-cream/[0.02] p-3">
          <p className="text-cream/30 text-[10px] mb-1.5">Tweet preview:</p>
          <p className="text-cream/50 text-xs leading-relaxed italic">
            &ldquo;I&apos;m {tierName} in the SOUR Civilization 🫙 — Score: {crustScore ?? 0}/{MAX_SCORE}
            {overallGrade ? ` (${overallGrade})` : ""}
            {daysInProtocol > 0 ? ` · ${daysInProtocol} days in protocol` : ""}
            {"\n"}@sourdaoxyz #SOUR #CivilizationProtocol&rdquo;
          </p>
        </div>
      )}

      {/* Compare With a Friend */}
      <CompareCard />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compare Card — look up any wallet's Crust profile
// ---------------------------------------------------------------------------

function CompareCard() {
  const [addr, setAddr] = useState("");

  const isValid = addr.trim().length >= 32 && addr.trim().length <= 44;

  return (
    <div className="rounded-xl border border-cream/8 bg-cream/[0.02] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-3.5 h-3.5 text-cream/40" />
        <span className="text-cream/50 text-xs font-medium">Compare With a Friend</span>
      </div>
      <div className="flex gap-2">
        <input
          value={addr}
          onChange={(e) => setAddr(e.target.value.trim())}
          placeholder="Paste wallet address"
          className="flex-1 rounded-lg border border-cream/10 bg-black/30 px-3 py-2 text-cream text-xs placeholder:text-cream/20 focus:outline-none focus:border-gold/30"
        />
        {isValid ? (
          <Link
            href={`/crust/profile?address=${addr.trim()}`}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium hover:bg-gold/15 transition-colors"
          >
            View <ArrowRight className="w-3 h-3" />
          </Link>
        ) : (
          <button
            disabled
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cream/5 border border-cream/10 text-cream/20 text-xs cursor-not-allowed"
          >
            View <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
      <p className="text-cream/20 text-[10px] mt-2">
        Enter any Solana wallet to see their Civilization ID and Score
      </p>
    </div>
  );
}
