import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
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
 * Pre-launch: return zero data immediately without hitting RPC.
 * This avoids errors when SOUR_TOKEN_MINT is a placeholder.
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
    const account = await getAccount(connection, tokenAccount);
    // SOUR has 6 decimals (standard SPL token)
    return Number(account.amount) / 1e6;
  } catch {
    // Token account doesn't exist = 0 balance
    return 0;
  }
}

/**
 * Get the first transaction date for this wallet with SOUR token
 * (approximation: uses the token account creation time)
 */
export async function getFirstSourTx(walletAddress: PublicKey): Promise<Date | null> {
  if (!IS_TOKEN_LAUNCHED) return null;
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      SOUR_TOKEN_MINT,
      walletAddress
    );

    // getSignaturesForAddress returns newest first by default.
    // For MVP we get up to 1000 and use the oldest.
    const allSigs = await connection.getSignaturesForAddress(tokenAccount, {
      limit: 1000,
    });

    if (allSigs.length === 0) return null;

    // Oldest transaction is the last in the array
    const oldest = allSigs[allSigs.length - 1];
    if (oldest.blockTime) {
      return new Date(oldest.blockTime * 1000);
    }

    return null;
  } catch {
    return null;
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

  return {
    balance,
    firstTxDate,
    daysFermenting,
  };
}
