// ============================================================================
// SOUR Handshake — TypeScript Client
// Frontend SDK for interacting with the on-chain program
// ============================================================================

import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Program ID — update after deployment
export const SOUR_HANDSHAKE_PROGRAM_ID = new PublicKey(
  "HUAq4NFymfn4hNvs7RMNCC5uFEoRctkWDWCA9G7prxeF"
);

// ---------------------------------------------------------------------------
// PDA Derivation Helpers
// ---------------------------------------------------------------------------

export function getConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

export function getHandshakePda(id: number | bigint): [PublicKey, number] {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(BigInt(id));
  return PublicKey.findProgramAddressSync(
    [Buffer.from("handshake"), idBuf],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

export function getVaultPda(id: number | bigint): [PublicKey, number] {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(BigInt(id));
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), idBuf],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

export function getVaultAuthorityPda(id: number | bigint): [PublicKey, number] {
  const idBuf = Buffer.alloc(8);
  idBuf.writeBigUInt64LE(BigInt(id));
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_auth"), idBuf],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

// ---------------------------------------------------------------------------
// Types matching on-chain state
// ---------------------------------------------------------------------------

export enum HandshakeStatus {
  Created = "created",
  Accepted = "accepted",
  Delivered = "delivered",
  Approved = "approved",
  Disputed = "disputed",
  Cancelled = "cancelled",
  Resolved = "resolved",
  Expired = "expired",
}

export interface HandshakeAccount {
  id: bigint;
  creator: PublicKey;
  worker: PublicKey;
  amount: bigint;
  description: string;
  status: HandshakeStatus;
  createdAt: bigint;
  deadlineTs: bigint;
  acceptedAt: bigint;
  deliveredAt: bigint;
  resolvedAt: bigint;
  disputedBy: PublicKey;
  vaultBump: number;
  bump: number;
}

export interface ProtocolConfigAccount {
  authority: PublicKey;
  sourMint: PublicKey;
  keepersPool: PublicKey;
  commonsTreasury: PublicKey;
  pinchBps: number;
  burnShareBps: number;
  keepersShareBps: number;
  commonsShareBps: number;
  handshakeCount: bigint;
  totalBurned: bigint;
  totalToKeepers: bigint;
  totalToCommons: bigint;
  totalCompleted: bigint;
  totalDisputed: bigint;
  bump: number;
}

// ---------------------------------------------------------------------------
// Fee Calculation (mirrors on-chain logic)
// ---------------------------------------------------------------------------

export interface PinchBreakdown {
  pinchTotal: bigint;
  burnAmount: bigint;
  keepersAmount: bigint;
  commonsAmount: bigint;
  workerAmount: bigint;
}

export function calculatePinch(
  amount: bigint,
  pinchBps: number = 200,
  burnShareBps: number = 5000,
  keepersShareBps: number = 3000,
): PinchBreakdown {
  const bpsBase = BigInt(10_000);
  const pinchTotal = (amount * BigInt(pinchBps)) / bpsBase;
  const burnAmount = (pinchTotal * BigInt(burnShareBps)) / bpsBase;
  const keepersAmount = (pinchTotal * BigInt(keepersShareBps)) / bpsBase;
  const commonsAmount = pinchTotal - burnAmount - keepersAmount;
  const workerAmount = amount - pinchTotal;

  return {
    pinchTotal,
    burnAmount,
    keepersAmount,
    commonsAmount,
    workerAmount,
  };
}

// ---------------------------------------------------------------------------
// Status display helpers
// ---------------------------------------------------------------------------

export function getStatusLabel(status: HandshakeStatus): string {
  const labels: Record<HandshakeStatus, string> = {
    [HandshakeStatus.Created]: "⏳ Waiting for Baker",
    [HandshakeStatus.Accepted]: "🤝 In Progress",
    [HandshakeStatus.Delivered]: "📦 Delivered — Awaiting Approval",
    [HandshakeStatus.Approved]: "✅ Completed",
    [HandshakeStatus.Disputed]: "⚠️ Disputed",
    [HandshakeStatus.Cancelled]: "❌ Cancelled",
    [HandshakeStatus.Resolved]: "⚖️ Dispute Resolved",
    [HandshakeStatus.Expired]: "⏰ Expired",
  };
  return labels[status] || "Unknown";
}

export function getStatusColor(status: HandshakeStatus): string {
  const colors: Record<HandshakeStatus, string> = {
    [HandshakeStatus.Created]: "text-amber-400",
    [HandshakeStatus.Accepted]: "text-blue-400",
    [HandshakeStatus.Delivered]: "text-purple-400",
    [HandshakeStatus.Approved]: "text-emerald-400",
    [HandshakeStatus.Disputed]: "text-red-400",
    [HandshakeStatus.Cancelled]: "text-cream/40",
    [HandshakeStatus.Resolved]: "text-cyan-400",
    [HandshakeStatus.Expired]: "text-cream/30",
  };
  return colors[status] || "text-cream/50";
}

// ---------------------------------------------------------------------------
// Format helpers
// ---------------------------------------------------------------------------

export function formatSourAmount(amount: bigint, decimals: number = 9): string {
  const whole = amount / BigInt(10 ** decimals);
  const frac = amount % BigInt(10 ** decimals);
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

export function shortenAddress(addr: string, chars: number = 4): string {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}
