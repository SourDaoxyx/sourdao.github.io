"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Background Glow */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Mascot with breathing animation */}
        <motion.div
          animate={{ 
            scale: [1, 1.08, 1],
            y: [0, -5, 0],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative"
        >
          <Image
            src="/mascot.svg"
            alt="Sour"
            width={140}
            height={154}
            className="drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            priority
          />
        </motion.div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 font-cinzel text-gold text-xl"
        >
          Fermenting...
        </motion.p>

        {/* Progress Dots */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-gold"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
