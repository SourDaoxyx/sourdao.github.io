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

// Devnet SOUR test mint
export const DEVNET_SOUR_MINT = new PublicKey("FfYBzvoPfG2TVUPD13SwbWedAgwBZk6UAqVkKriHhx1v");

// Note: Tier definitions moved to lib/crust-score.ts (CrustTier system)
// Note: Avatar system now uses generative avatars from wallet address
