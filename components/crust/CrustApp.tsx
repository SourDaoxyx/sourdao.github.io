"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, Loader2, LogOut, Fingerprint } from "lucide-react";
import { getSourHolderInfo, type SourHolderInfo } from "@/lib/solana";
import { getKeeperTier } from "@/lib/constants";
import BakerCard from "./BakerCard";
import EditProfile from "./EditProfile";
import ShareCard from "./ShareCard";

interface BakerProfile {
  name: string;
  bio: string;
  avatar: string;
}

function loadProfile(wallet: string): BakerProfile {
  if (typeof window === "undefined") return { name: "", bio: "", avatar: "/mascot.svg" };
  try {
    const stored = localStorage.getItem(`sour-baker-${wallet}`);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { name: "", bio: "", avatar: "/mascot.svg" };
}

function saveProfile(wallet: string, profile: BakerProfile) {
  try {
    localStorage.setItem(`sour-baker-${wallet}`, JSON.stringify(profile));
  } catch { /* ignore */ }
}

export default function CrustApp() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [holderInfo, setHolderInfo] = useState<SourHolderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<BakerProfile>({ name: "", bio: "", avatar: "/mascot.svg" });
  const cardRef = useRef<HTMLDivElement>(null);

  // Load on-chain data
  useEffect(() => {
    if (!publicKey) {
      setHolderInfo(null);
      return;
    }

    // Load profile from localStorage
    setProfile(loadProfile(publicKey.toBase58()));

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const info = await getSourHolderInfo(publicKey);
        setHolderInfo(info);
      } catch (err) {
        console.error("Failed to fetch holder info:", err);
        setError("Failed to read on-chain data. Please try again.");
        // Fallback: show card with 0 balance for demo purposes
        setHolderInfo({
          balance: 0,
          firstTxDate: null,
          daysFermenting: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicKey]);

  const handleSaveProfile = useCallback(
    (name: string, bio: string, avatar: string) => {
      const newProfile = { name, bio, avatar };
      setProfile(newProfile);
      if (publicKey) {
        saveProfile(publicKey.toBase58(), newProfile);
      }
    },
    [publicKey]
  );

  const tier = holderInfo ? getKeeperTier(holderInfo.daysFermenting) : null;

  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-gold/5 to-transparent blur-[200px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6">
            <Fingerprint className="w-4 h-4" />
            THE CRUST
          </motion.span>

          <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-3">
            Know Your Baker
          </h1>

          <p className="text-cream/50 text-sm font-inter max-w-md mx-auto">
            Connect your jar to see your Baker Card. Your reputation, on-chain, forever.
          </p>
        </motion.div>

        {/* Not Connected */}
        {!connected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisible(true)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl overflow-hidden text-lg font-bold"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gold via-amber to-gold" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />
              <span className="relative text-black flex items-center gap-3">
                <Wallet className="w-5 h-5" />
                Connect Jar
              </span>
            </motion.button>

            <p className="text-cream/30 text-xs mt-4">
              Supports Phantom &amp; Solflare
            </p>
          </motion.div>
        )}

        {/* Loading */}
        {connected && loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-10"
          >
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-cream/50 text-sm">Reading the blockchain...</p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4"
          >
            <p className="text-orange-400/80 text-xs">{error}</p>
          </motion.div>
        )}

        {/* Connected — Show Card */}
        {connected && publicKey && holderInfo && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Disconnect */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => disconnect()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-cream/30 text-xs hover:text-cream/50 hover:bg-cream/5 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                Disconnect
              </motion.button>
            </div>

            {/* Baker Card */}
            <BakerCard
              cardRef={cardRef}
              walletAddress={publicKey.toBase58()}
              balance={holderInfo.balance}
              daysFermenting={holderInfo.daysFermenting}
              bakerName={profile.name}
              bakerBio={profile.bio}
              avatar={profile.avatar}
            />

            {/* Edit & Share */}
            <div className="flex flex-col items-center gap-4">
              <EditProfile
                name={profile.name}
                bio={profile.bio}
                avatar={profile.avatar}
                onSave={handleSaveProfile}
              />

              {tier && (
                <ShareCard
                  cardRef={cardRef}
                  tierName={tier.name}
                  daysFermenting={holderInfo.daysFermenting}
                />
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
