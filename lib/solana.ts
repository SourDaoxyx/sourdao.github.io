import { Connection, PublicKey, ParsedAccountData } from "@solana/web3.js";
import { getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import { SOLANA_RPC_ENDPOINT, SOUR_TOKEN_MINT, IS_TOKEN_LAUNCHED } from "./constants";

const connection = new Connection(SOLANA_RPC_ENDPOINT, {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 30_000,
});

export interface SourHolderInfo {
  balance: number;
  firstTxDate: Date | null;
  daysInProtocol: number;
}

/**
 * Fallback data when token is not yet launched.
 */
const PRE_LAUNCH_INFO: SourHolderInfo = {
  balance: 0,
  firstTxDate: null,
  daysInProtocol: 0,
};

/**
 * Find ALL token accounts for a wallet that hold $SOUR, including:
 *   1. Standard Associated Token Account (post-migration)
 *   2. pump.fun PDA token accounts (pre-migration / bonding curve)
 *
 * Returns an array of { pubkey, balance } for each account found.
 */
async function findAllSourAccounts(
  walletAddress: PublicKey
): Promise<{ pubkey: PublicKey; balance: number }[]> {
  const results: { pubkey: PublicKey; balance: number }[] = [];

  try {
    // getTokenAccountsByOwner scans ALL token accounts owned by this wallet
    // for the given mint — this catches BOTH standard ATAs and any program-
    // derived accounts (pump.fun, etc.)
    const response = await connection.getTokenAccountsByOwner(walletAddress, {
      mint: SOUR_TOKEN_MINT,
    });

    for (const { pubkey, account } of response.value) {
      // SPL Token account data layout: amount is a u64 at bytes 64-72
      const data = account.data;
      const rawAmount = data.readBigUInt64LE(64);
      const balance = Number(rawAmount) / 1e6; // 6 decimals
      if (balance > 0) {
        results.push({ pubkey, balance });
      }
    }

    console.log(
      `[SOUR] findAllSourAccounts: found ${results.length} account(s) for ${walletAddress.toBase58()}`,
      results.map((r) => ({ addr: r.pubkey.toBase58().slice(0, 8), bal: r.balance }))
    );
  } catch (err) {
    console.warn("[SOUR] findAllSourAccounts error:", err);
  }

  return results;
}

/**
 * Get SOUR token balance for a wallet.
 * Sums across ALL token accounts (standard ATA + pump.fun PDA).
 */
export async function getSourBalance(walletAddress: PublicKey): Promise<number> {
  if (!IS_TOKEN_LAUNCHED) return 0;

  const accounts = await findAllSourAccounts(walletAddress);
  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  console.log("[SOUR] getSourBalance:", total, "for", walletAddress.toBase58());
  return total;
}

/**
 * Get the first transaction date for this wallet with SOUR token.
 * Checks ALL token accounts (standard ATA + pump.fun PDA) and returns
 * the earliest transaction found across any of them.
 */
export async function getFirstSourTx(walletAddress: PublicKey): Promise<Date | null> {
  if (!IS_TOKEN_LAUNCHED) return null;

  try {
    // Collect all token accounts for this wallet
    const accounts = await findAllSourAccounts(walletAddress);

    // Also check standard ATA even if balance is 0
    // (user might have had tokens and transferred them)
    try {
      const standardAta = await getAssociatedTokenAddress(SOUR_TOKEN_MINT, walletAddress);
      const alreadyIncluded = accounts.some((a) => a.pubkey.equals(standardAta));
      if (!alreadyIncluded) {
        accounts.push({ pubkey: standardAta, balance: 0 });
      }
    } catch {
      // ATA derivation failed — skip
    }

    if (accounts.length === 0) return null;

    // Walk backwards through signatures for EACH account to find the oldest TX
    const MAX_PAGES = 50;
    let globalOldest: Date | null = null;

    for (const account of accounts) {
      let oldest: { blockTime?: number | null; signature: string } | null = null;
      let before: string | undefined = undefined;

      for (let page = 0; page < MAX_PAGES; page++) {
        const sigs = await connection.getSignaturesForAddress(account.pubkey, {
          limit: 1000,
          ...(before ? { before } : {}),
        });

        if (sigs.length === 0) break;

        oldest = sigs[sigs.length - 1];
        before = oldest.signature;

        if (sigs.length < 1000) break;
      }

      if (oldest?.blockTime) {
        const date = new Date(oldest.blockTime * 1000);
        if (!globalOldest || date < globalOldest) {
          globalOldest = date;
        }
      }
    }

    return globalOldest;
  } catch (err) {
    console.warn("[SOUR] getFirstSourTx error:", err);
    return null;
  }
}

/**
 * Get real circulating supply of $SOUR token.
 */
export async function getSourSupply(): Promise<number> {
  if (!IS_TOKEN_LAUNCHED) return 1_000_000_000;
  try {
    const mintInfo = await getMint(connection, SOUR_TOKEN_MINT);
    return Number(mintInfo.supply) / Math.pow(10, mintInfo.decimals);
  } catch (err) {
    console.warn("[SOUR] Failed to fetch token supply:", err);
    return 1_000_000_000; // fallback
  }
}

/**
 * Get complete holder info.
 * Pre-launch mode returns zeros instantly (no RPC calls).
 */
export async function getSourHolderInfo(walletAddress: PublicKey): Promise<SourHolderInfo> {
  if (!IS_TOKEN_LAUNCHED) return PRE_LAUNCH_INFO;

  const [balance, firstTxDate] = await Promise.all([
    getSourBalance(walletAddress),
    getFirstSourTx(walletAddress),
  ]);

  const daysInProtocol = firstTxDate
    ? Math.floor((Date.now() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  console.log("[SOUR] Holder info:", { balance, firstTxDate, daysInProtocol, wallet: walletAddress.toBase58() });

  return {
    balance,
    firstTxDate,
    daysInProtocol,
  };
}

// ---------------------------------------------------------------------------
// Top Holders (Leaderboard)
// ---------------------------------------------------------------------------

export interface TopHolder {
  /** Wallet address (owner) */
  address: string;
  /** SOUR balance (UI amount, already divided by decimals) */
  balance: number;
}

/**
 * Get the top SOUR holders by balance using getTokenLargestAccounts.
 * Returns up to `limit` holders (max 20 from RPC).
 */
export async function getTopHolders(limit: number = 20): Promise<TopHolder[]> {
  if (!IS_TOKEN_LAUNCHED) return [];

  try {
    console.log("[SOUR] Fetching top holders...");
    const largest = await connection.getTokenLargestAccounts(SOUR_TOKEN_MINT);

    // Resolve owner wallet addresses from token accounts
    const accountKeys = largest.value.slice(0, limit).map((a) => a.address);
    const accountInfos = await Promise.all(
      accountKeys.map((key) => connection.getParsedAccountInfo(key))
    );

    const holders: TopHolder[] = [];
    for (let i = 0; i < accountInfos.length; i++) {
      const info = accountInfos[i];
      const tokenAccount = largest.value[i];

      if (info.value && "parsed" in info.value.data) {
        const parsed = info.value.data as ParsedAccountData;
        const owner: string | undefined = parsed.parsed?.info?.owner;
        const uiAmount = tokenAccount.uiAmount ?? 0;

        if (owner && uiAmount > 0) {
          holders.push({ address: owner, balance: uiAmount });
        }
      }
    }

    console.log(`[SOUR] Found ${holders.length} holders`);
    return holders.sort((a, b) => b.balance - a.balance);
  } catch (err) {
    console.error("[SOUR] getTopHolders error:", err);
    return [];
  }
}

/**
 * Get daysInProtocol for a wallet address string.
 * Convenience wrapper around getFirstSourTx for leaderboard use.
 */
export async function getDaysInProtocol(walletAddress: string): Promise<number> {
  try {
    const pubkey = new PublicKey(walletAddress);
    const firstTx = await getFirstSourTx(pubkey);
    if (!firstTx) return 0;
    return Math.floor((Date.now() - firstTx.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}
