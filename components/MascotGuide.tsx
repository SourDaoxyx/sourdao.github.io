"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";

// Section IDs in order of appearance
const SECTIONS = ["hero", "problem", "manifesto", "protocol", "value", "roadmap", "whitepaper", "community", "faq"] as const;
type SectionId = typeof SECTIONS[number];

// Click reaction pool
const CLICK_KEYS = [
  "mascot.click.1",
  "mascot.click.2",
  "mascot.click.3",
  "mascot.click.4",
  "mascot.click.5",
] as const;

export default function MascotGuide() {
  const { t } = useLanguage();
  const [currentSection, setCurrentSection] = useState<SectionId>("hero");
  const [isClicked, setIsClicked] = useState(false);
  const [clickIndex, setClickIndex] = useState(0);
  const [showBubble, setShowBubble] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [expression, setExpression] = useState<"happy" | "excited" | "wink">("happy");
  const bubbleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Detect current section with IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    SECTIONS.forEach((sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              setCurrentSection((prev) => {
                if (prev !== sectionId) {
                  // Show new bubble when section changes
                  setShowBubble(true);
                  setIsClicked(false);
                  
                  // Auto-hide bubble after 6s
                  if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
                  bubbleTimeoutRef.current = setTimeout(() => setShowBubble(false), 6000);
                }
                return sectionId;
              });
            }
          });
        },
        { threshold: [0.25, 0.5] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Click handler with reaction
  const handleClick = useCallback(() => {
    setIsClicked(true);
    setClickIndex((prev) => (prev + 1) % CLICK_KEYS.length);
    setShowBubble(true);

    // Cycle expression
    setExpression((prev) => {
      if (prev === "happy") return "excited";
      if (prev === "excited") return "wink";
      return "happy";
    });

    // Reset after animation
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setIsClicked(false);
      setShowBubble(true);
      // Show section message again after click reaction
      setTimeout(() => {
        bubbleTimeoutRef.current = setTimeout(() => setShowBubble(false), 5000);
      }, 100);
    }, 2500);
  }, []);

  // Current message
  const message = isClicked
    ? t(CLICK_KEYS[clickIndex])
    : t(`mascot.section.${currentSection}`);

  return (
    <div
      ref={mascotRef}
      className="fixed bottom-6 right-3 md:bottom-8 md:right-6 lg:right-8 z-[45] flex flex-col items-end gap-1.5"
    >
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        {showBubble && (
          <motion.div
            key={`${currentSection}-${isClicked ? "click" : "section"}-${clickIndex}`}
            initial={{ opacity: 0, scale: 0.6, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative max-w-[160px] md:max-w-[200px] mr-1"
          >
            <div className={`px-3 py-2 rounded-2xl rounded-br-sm text-[11px] md:text-xs leading-relaxed font-medium shadow-lg border backdrop-blur-sm ${
              isClicked
                ? "bg-gold/95 text-background border-gold/50"
                : "bg-black/85 text-cream/90 border-gold/30"
            }`}>
              {message}
            </div>
            {/* Bubble tail */}
            <div className={`absolute -bottom-1 right-4 w-2.5 h-2.5 rotate-45 border-r border-b ${
              isClicked
                ? "bg-gold/95 border-gold/50"
                : "bg-black/85 border-gold/30"
            }`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Character */}
      <motion.div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setExpression("happy");
        }}
        className="relative cursor-pointer select-none"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {/* Glow effect behind mascot */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.2) 0%, transparent 70%)" }}
          animate={{
            scale: isClicked ? [1, 1.5, 1] : isHovered ? 1.2 : [1, 1.1, 1],
            opacity: isClicked ? [0.3, 0.8, 0.3] : isHovered ? 0.5 : [0.2, 0.35, 0.2],
          }}
          transition={{ duration: isClicked ? 0.5 : 2, repeat: isClicked ? 0 : Infinity, ease: "easeInOut" }}
        />

        {/* Main mascot container */}
        <motion.div
          className="relative w-14 h-14 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20"
          animate={
            isClicked
              ? {
                  scale: [1, 1.3, 0.85, 1.15, 1],
                  rotate: [0, -15, 15, -8, 0],
                  y: [0, -20, 5, -8, 0],
                }
              : {
                  y: [0, -4, 0],
                  rotate: isHovered ? [0, -3, 3, 0] : 0,
                }
          }
          transition={
            isClicked
              ? { duration: 0.7, ease: "easeOut" }
              : {
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotate: isHovered
                    ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 },
                }
          }
        >
          <Image
            src="/sour-logo.png"
            alt="Sour"
            fill
            className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            sizes="80px"
          />

          {/* Expression overlay eyes */}
          {expression === "excited" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full h-full">
                {/* Star eyes - positioned over the SVG eyes */}
                <span className="absolute text-[8px] md:text-[10px]" style={{ top: "36%", left: "30%" }}>⭐</span>
                <span className="absolute text-[8px] md:text-[10px]" style={{ top: "36%", left: "55%" }}>⭐</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Click sparkle particles */}
        <AnimatePresence>
          {isClicked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute w-1.5 h-1.5 rounded-full bg-gold"
                  style={{
                    top: "50%",
                    left: "50%",
                  }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 6) * 35,
                    y: Math.sin((i * Math.PI * 2) / 6) * 35,
                    opacity: [1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
