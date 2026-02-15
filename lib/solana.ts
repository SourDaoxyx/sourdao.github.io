import { Connection, PublicKey } from "@solana/web3.js";
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { SOLANA_RPC_ENDPOINT, MAYA_TOKEN_MINT } from "./constants";

const connection = new Connection(SOLANA_RPC_ENDPOINT, "confirmed");

export interface MayaHolderInfo {
  balance: number;
  firstTxDate: Date | null;
  daysFermenting: number;
}

/**
 * Get MAYA token balance for a wallet
 */
export async function getMayaBalance(walletAddress: PublicKey): Promise<number> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      MAYA_TOKEN_MINT,
      walletAddress
    );
    const account = await getAccount(connection, tokenAccount);
    // MAYA has 6 decimals (standard SPL token)
    return Number(account.amount) / 1e6;
  } catch {
    // Token account doesn't exist = 0 balance
    return 0;
  }
}

/**
 * Get the first transaction date for this wallet with MAYA token
 * (approximation: uses the token account creation time)
 */
export async function getFirstMayaTx(walletAddress: PublicKey): Promise<Date | null> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(
      MAYA_TOKEN_MINT,
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
 * Get complete holder info
 */
export async function getMayaHolderInfo(walletAddress: PublicKey): Promise<MayaHolderInfo> {
  const [balance, firstTxDate] = await Promise.all([
    getMayaBalance(walletAddress),
    getFirstMayaTx(walletAddress),
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
