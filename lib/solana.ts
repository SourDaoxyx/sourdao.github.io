import { Connection, PublicKey, ParsedAccountData } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import { SOLANA_RPC_ENDPOINT, SOUR_TOKEN_MINT, IS_TOKEN_LAUNCHED } from "./constants";

const connection = new Connection(SOLANA_RPC_ENDPOINT, {
  commitment: "confirmed",
  confirmTransactionInitialTimeout: 30_000,
});

export interface SourHolderInfo {
  balance: number;
  firstTxDate: Date | null;
  daysFermenting: number;
}

/**
 * Fallback data when token is not yet launched.
 */
const PRE_LAUNCH_INFO: SourHolderInfo = {
  balance: 0,
  firstTxDate: null,
  daysFermenting: 0,
};

/**
 * Get SOUR token balance for a wallet
 */
export async function getSourBalance(walletAddress: PublicKey): Promise<number> {
  if (!IS_TOKEN_LAUNCHED) return 0;
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      SOUR_TOKEN_MINT,
      walletAddress
    );
    console.log("[SOUR] Checking ATA:", tokenAccount.toBase58(), "for wallet:", walletAddress.toBase58());
    const account = await getAccount(connection, tokenAccount);
    const balance = Number(account.amount) / 1e6;
    console.log("[SOUR] Raw amount:", account.amount.toString(), "=> balance:", balance);
    return balance;
  } catch (err) {
    // Token account doesn't exist = 0 balance
    console.warn("[SOUR] getSourBalance error (likely no ATA):", err);
    return 0;
  }
}

/**
 * Get the first transaction date for this wallet with SOUR token.
 * Walks backwards through all signatures to find the very first one.
 */
export async function getFirstSourTx(walletAddress: PublicKey): Promise<Date | null> {
  if (!IS_TOKEN_LAUNCHED) return null;
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      SOUR_TOKEN_MINT,
      walletAddress
    );

    // Walk backwards page by page to find the oldest TX
    let oldest: { blockTime?: number | null; signature: string } | null = null;
    let before: string | undefined = undefined;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const sigs = await connection.getSignaturesForAddress(tokenAccount, {
        limit: 1000,
        ...(before ? { before } : {}),
      });

      if (sigs.length === 0) break;

      // Last item in this page is the oldest so far
      oldest = sigs[sigs.length - 1];
      before = oldest.signature;

      // If fewer than 1000 returned, we've reached the end
      if (sigs.length < 1000) break;
    }

    if (oldest?.blockTime) {
      return new Date(oldest.blockTime * 1000);
    }

    return null;
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

  const daysFermenting = firstTxDate
    ? Math.floor((Date.now() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  console.log("[SOUR] Holder info:", { balance, firstTxDate, daysFermenting, wallet: walletAddress.toBase58() });

  return {
    balance,
    firstTxDate,
    daysFermenting,
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
 * Get daysFermenting for a wallet address string.
 * Convenience wrapper around getFirstSourTx for leaderboard use.
 */
export async function getDaysFermenting(walletAddress: string): Promise<number> {
  try {
    const pubkey = new PublicKey(walletAddress);
    const firstTx = await getFirstSourTx(pubkey);
    if (!firstTx) return 0;
    return Math.floor((Date.now() - firstTx.getTime()) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}
