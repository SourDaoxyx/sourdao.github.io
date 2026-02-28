"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, Loader2, LogOut, Fingerprint, Trophy, User, FlaskConical, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getSourHolderInfo, type SourHolderInfo } from "@/lib/solana";
import { calculateCrustScore, CRUST_TIERS, type CrustScoreBreakdown, type CrustScoreInput } from "@/lib/crust-score";
import { IS_TOKEN_LAUNCHED } from "@/lib/constants";
import BakerCard from "./BakerCard";
import BadgeWall from "./BadgeWall";
import EditProfile from "./EditProfile";
import ShareCard from "./ShareCard";

interface BakerProfile {
  name: string;
  bio: string;
  avatar: string;
}

function loadProfile(wallet: string): BakerProfile {
  if (typeof window === "undefined") return { name: "", bio: "", avatar: "/sour-logo.png" };
  try {
    const stored = localStorage.getItem(`sour-baker-${wallet}`);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { name: "", bio: "", avatar: "/sour-logo.png" };
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
  const [profile, setProfile] = useState<BakerProfile>({ name: "", bio: "", avatar: "/sour-logo.png" });
  const [showBadges, setShowBadges] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Load on-chain data
  useEffect(() => {
    if (!publicKey) {
      setHolderInfo(null);
      return;
    }

    // Load profile from localStorage
    setProfile(loadProfile(publicKey.toBase58()));

    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Race against a 15s timeout
        const info = await Promise.race([
          getSourHolderInfo(publicKey),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("timeout")), 15_000)
          ),
        ]);
        if (!cancelled) setHolderInfo(info);
      } catch (err) {
        console.error("[SOUR] Failed to fetch holder info:", err);
        if (!cancelled) {
          const isTimeout = err instanceof Error && err.message === "timeout";
          setError(
            isTimeout
              ? "RPC request timed out. Public Solana RPC can be slow — please try again."
              : "Failed to read on-chain data. Please try again."
          );
          // Fallback: show card with 0 balance
          setHolderInfo({
            balance: 0,
            firstTxDate: null,
            daysFermenting: 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
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

  // Calculate Crust Score from on-chain data
  const scoreBreakdown: CrustScoreBreakdown | null = useMemo(() => {
    if (!holderInfo) return null;
    const input: CrustScoreInput = {
      balance: holderInfo.balance,
      daysFermenting: holderInfo.daysFermenting,
      // Handshake data will come from on-chain indexer post-launch
      // For now, use 0 (only holding + diamond contribute)
      handshakesCompleted: 0,
      disputesLost: 0,
      handshakesCancelled: 0,
      handshakesTotal: 0,
    };
    return calculateCrustScore(input);
  }, [holderInfo]);

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

          <p className="text-cream/50 text-sm font-inter max-w-md mx-auto mb-3">
            Connect your jar to see your Baker Card. Your reputation, on-chain, forever.
          </p>

          <p className="text-cream/35 text-xs font-inter max-w-lg mx-auto leading-relaxed">
            The Crust is your soulbound on-chain identity. It cannot be sold, transferred, or erased.
            Every successful Bake thickens your Crust score. Reputation (40%), Holding (30%), Diamond Hands (30%).
            Sell once and your tier resets to zero. Your Crust travels across every Oven SOUR deploys to.
          </p>
        </motion.div>

        {/* Crust Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {CRUST_TIERS.slice().reverse().map((t) => (
            <div key={t.name} className={`rounded-xl border ${t.borderColor} ${t.bgColor} p-3 text-center`}>
              <p className={`font-cinzel text-xs font-bold mb-1 ${t.textColor}`}>{t.emoji} {t.name}</p>
              <p className="text-cream/40 text-[10px]">{t.minScore}+ score</p>
              <p className="text-cream/30 text-[10px] mt-1">Harvest: {t.harvestMultiplier}</p>
            </div>
          ))}
        </motion.div>

        {/* Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex justify-center gap-3 mb-8"
        >
          <Link
            href="/crust/leaderboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/8 border border-gold/15 text-gold/70 text-xs font-medium hover:bg-gold/12 transition-colors"
          >
            <Trophy className="w-3.5 h-3.5" />
            Leaderboard
          </Link>
          {connected && publicKey && (
            <Link
              href={`/crust/profile?address=${publicKey.toBase58()}`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream/5 border border-cream/10 text-cream/50 text-xs font-medium hover:bg-cream/8 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              Public Profile
            </Link>
          )}
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

            {/* Wallet install guide */}
            <div className="mt-6 p-4 rounded-xl border border-cream/8 bg-cream/[0.02] max-w-sm mx-auto">
              <p className="text-cream/40 text-xs mb-3">
                Don&apos;t have a wallet? Install one first:
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="https://phantom.app/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Phantom
                </a>
                <a
                  href="https://solflare.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium hover:bg-orange-500/20 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Solflare
                </a>
              </div>
              <p className="text-cream/25 text-[10px] mt-3 leading-relaxed">
                Install the browser extension → refresh this page → click &quot;Connect Jar&quot; → approve in wallet popup
              </p>
            </div>
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
            className="text-center mb-4 p-4 rounded-xl border border-orange-500/20 bg-orange-500/5"
          >
            <p className="text-orange-400/80 text-xs mb-2">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setHolderInfo(null);
                setLoading(true);
                if (publicKey) {
                  getSourHolderInfo(publicKey)
                    .then((info) => setHolderInfo(info))
                    .catch(() => setError("Still failing. Try again later."))
                    .finally(() => setLoading(false));
                }
              }}
              className="text-gold text-xs underline underline-offset-2 hover:text-amber-400 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Connected — Show Card */}
        {connected && publicKey && holderInfo && scoreBreakdown && !loading && (
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

            {/* Pre-Launch Banner */}
            {!IS_TOKEN_LAUNCHED && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-gold/20 bg-gold/5 p-5 text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FlaskConical className="w-5 h-5 text-gold" />
                  <span className="font-cinzel text-sm font-bold text-gold">Pre-Launch Preview</span>
                </div>
                <p className="text-cream/50 text-xs leading-relaxed mb-3">
                  Your jar is connected! $SOUR token has not launched yet.
                  Once the token is live, your Crust Score will be calculated from real on-chain data.
                </p>
                <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-black/30 border border-cream/10">
                  <Wallet className="w-3.5 h-3.5 text-gold/60" />
                  <span className="text-cream/40 text-[11px] font-mono tracking-tight">
                    {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                  </span>
                  <span className="text-emerald-400/70 text-[10px] ml-1">● Connected</span>
                </div>
              </motion.div>
            )}

            {/* Baker Card */}
            <BakerCard
              cardRef={cardRef}
              walletAddress={publicKey.toBase58()}
              balance={holderInfo.balance}
              daysFermenting={holderInfo.daysFermenting}
              bakerName={profile.name}
              bakerBio={profile.bio}
              avatar={profile.avatar}
              scoreBreakdown={scoreBreakdown}
            />

            {/* Tier Progression */}
            {scoreBreakdown.tier.name !== "Eternal Starter" && (() => {
              const currentScore = scoreBreakdown.total;
              const nextTier = CRUST_TIERS.slice().reverse().find(t => t.minScore > currentScore);
              if (!nextTier) return null;
              const prevMin = CRUST_TIERS.slice().reverse().find(t => t.minScore <= currentScore)?.minScore || 0;
              const progress = ((currentScore - prevMin) / (nextTier.minScore - prevMin)) * 100;
              return (
                <div className="p-4 rounded-xl border border-cream/10 bg-black/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cream/40 text-[10px] uppercase tracking-wider">Next Tier</span>
                    <span className={`text-xs font-bold ${nextTier.textColor}`}>{nextTier.emoji} {nextTier.name}</span>
                  </div>
                  <div className="h-2 rounded-full bg-cream/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-gold to-amber-500"
                    />
                  </div>
                  <p className="text-cream/30 text-[10px] mt-1.5">
                    {nextTier.minScore - currentScore} more points needed
                  </p>
                </div>
              );
            })()}

            {/* Buy More CTA (for low balance) */}
            {holderInfo.balance === 0 && (
              <motion.a
                href="https://pump.fun/coin/2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 p-4 rounded-xl border border-gold/20 bg-gold/5 text-gold text-sm font-medium hover:bg-gold/10 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                Buy $SOUR to start building your Crust Score
              </motion.a>
            )}

            {/* Edit & Share */}
            <div className="flex flex-col items-center gap-4">
              <EditProfile
                name={profile.name}
                bio={profile.bio}
                avatar={profile.avatar}
                onSave={handleSaveProfile}
              />

              <ShareCard
                cardRef={cardRef}
                tierName={scoreBreakdown.tier.name}
                daysFermenting={holderInfo.daysFermenting}
                crustScore={scoreBreakdown.total}
              />
            </div>

            {/* Badge Wall Toggle */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBadges(!showBadges)}
                className="text-cream/40 text-xs hover:text-cream/60 transition-colors underline underline-offset-2"
              >
                {showBadges ? "Hide Badges" : `View All Badges (${scoreBreakdown.badges.length} earned)`}
              </motion.button>
            </div>

            {showBadges && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <BadgeWall earnedBadges={scoreBreakdown.badges} />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
