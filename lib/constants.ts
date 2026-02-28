import { PublicKey } from "@solana/web3.js";

// SOUR Token Mint Address on Solana
const SOUR_TOKEN_MINT_STRING = "2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump";
export const SOUR_TOKEN_MINT = new PublicKey(SOUR_TOKEN_MINT_STRING);

// Token launch detection
export const IS_TOKEN_LAUNCHED = (SOUR_TOKEN_MINT_STRING as string) !== "11111111111111111111111111111111";

// Solana RPC endpoint (Helius mainnet)
export const SOLANA_RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC ||
  "https://mainnet.helius-rpc.com/?api-key=a30ba17f-17c2-4c98-aabc-57310c15b731";

// Devnet RPC endpoint (for Handshake program)
export const DEVNET_RPC_ENDPOINT = "https://api.devnet.solana.com";

// Keeper Tier definitions (in days)
export const KEEPER_TIERS = [
  {
    name: "Eternal Starter",
    emoji: "👑",
    minDays: 365,
    harvestWeight: "2x",
    color: "from-amber-400 to-yellow-500",
    textColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  {
    name: "Golden Crust",
    emoji: "🥐",
    minDays: 90,
    harvestWeight: "1.5x",
    color: "from-gold to-amber-500",
    textColor: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/20",
  },
  {
    name: "Rising Dough",
    emoji: "🍞",
    minDays: 30,
    harvestWeight: "1x",
    color: "from-blue-400 to-cyan-500",
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    name: "Fresh Dough",
    emoji: "🫓",
    minDays: 0,
    harvestWeight: "—",
    color: "from-cream/50 to-cream/30",
    textColor: "text-cream/60",
    bgColor: "bg-cream/5",
    borderColor: "border-cream/10",
  },
] as const;

export type KeeperTier = (typeof KEEPER_TIERS)[number];

// Get tier based on number of days holding
export function getKeeperTier(daysFermenting: number): KeeperTier {
  for (const tier of KEEPER_TIERS) {
    if (daysFermenting >= tier.minDays) {
      return tier;
    }
  }
  return KEEPER_TIERS[KEEPER_TIERS.length - 1];
}

// Default avatars for baker profiles
export const BAKER_AVATARS = [
  "/sour-logo.png",
  "/avatars/baker-1.svg",
  "/avatars/baker-2.svg",
  "/avatars/baker-3.svg",
  "/avatars/baker-4.svg",
  "/avatars/baker-5.svg",
] as const;
