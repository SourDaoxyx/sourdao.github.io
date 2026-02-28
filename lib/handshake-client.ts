// ============================================================================
// SOUR Handshake — TypeScript Client
// Instruction builders, account deserialization, and helpers
// ============================================================================

import {
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  Connection,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// ---------------------------------------------------------------------------
// Program ID
// ---------------------------------------------------------------------------

export const SOUR_HANDSHAKE_PROGRAM_ID = new PublicKey(
  "HUAq4NFymfn4hNvs7RMNCC5uFEoRctkWDWCA9G7prxeF"
);

// ---------------------------------------------------------------------------
// PDA Derivation
// ---------------------------------------------------------------------------

export function getConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

export function getHandshakePda(id: number | bigint): [PublicKey, number] {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(id));
  return PublicKey.findProgramAddressSync(
    [Buffer.from("handshake"), buf],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

export function getVaultPda(id: number | bigint): [PublicKey, number] {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(id));
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), buf],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

export function getVaultAuthorityPda(id: number | bigint): [PublicKey, number] {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(id));
  return PublicKey.findProgramAddressSync(
    [Buffer.from("vault_auth"), buf],
    SOUR_HANDSHAKE_PROGRAM_ID
  );
}

// ---------------------------------------------------------------------------
// Types
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

const STATUS_MAP: HandshakeStatus[] = [
  HandshakeStatus.Created,
  HandshakeStatus.Accepted,
  HandshakeStatus.Delivered,
  HandshakeStatus.Approved,
  HandshakeStatus.Disputed,
  HandshakeStatus.Cancelled,
  HandshakeStatus.Resolved,
  HandshakeStatus.Expired,
];

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
  pinchBps = 200,
  burnShareBps = 5000,
  keepersShareBps = 3000,
): PinchBreakdown {
  const base = BigInt(10_000);
  const pinchTotal = (amount * BigInt(pinchBps)) / base;
  const burnAmount = (pinchTotal * BigInt(burnShareBps)) / base;
  const keepersAmount = (pinchTotal * BigInt(keepersShareBps)) / base;
  const commonsAmount = pinchTotal - burnAmount - keepersAmount;
  const workerAmount = amount - pinchTotal;
  return { pinchTotal, burnAmount, keepersAmount, commonsAmount, workerAmount };
}

// ---------------------------------------------------------------------------
// Display Helpers
// ---------------------------------------------------------------------------

export function getStatusLabel(status: HandshakeStatus): string {
  const map: Record<HandshakeStatus, string> = {
    [HandshakeStatus.Created]: "⏳ Waiting for Baker",
    [HandshakeStatus.Accepted]: "🤝 In Progress",
    [HandshakeStatus.Delivered]: "📦 Delivered",
    [HandshakeStatus.Approved]: "✅ Completed",
    [HandshakeStatus.Disputed]: "⚠️ Disputed",
    [HandshakeStatus.Cancelled]: "❌ Cancelled",
    [HandshakeStatus.Resolved]: "⚖️ Resolved",
    [HandshakeStatus.Expired]: "⏰ Expired",
  };
  return map[status] ?? "Unknown";
}

export function getStatusColor(status: HandshakeStatus): string {
  const map: Record<HandshakeStatus, string> = {
    [HandshakeStatus.Created]: "text-amber-400",
    [HandshakeStatus.Accepted]: "text-blue-400",
    [HandshakeStatus.Delivered]: "text-purple-400",
    [HandshakeStatus.Approved]: "text-emerald-400",
    [HandshakeStatus.Disputed]: "text-red-400",
    [HandshakeStatus.Cancelled]: "text-cream/40",
    [HandshakeStatus.Resolved]: "text-cyan-400",
    [HandshakeStatus.Expired]: "text-cream/30",
  };
  return map[status] ?? "text-cream/50";
}

export function formatSourAmount(amount: bigint, decimals = 6): string {
  const whole = amount / BigInt(10 ** decimals);
  const frac = amount % BigInt(10 ** decimals);
  const fracStr = frac.toString().padStart(decimals, "0").replace(/0+$/, "");
  return fracStr ? `${whole}.${fracStr}` : `${whole}`;
}

export function shortenAddress(addr: string, chars = 4): string {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

// ---------------------------------------------------------------------------
// Account Deserialization
// ---------------------------------------------------------------------------

export function deserializeConfig(raw: Uint8Array): ProtocolConfigAccount {
  const dv = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
  let o = 8; // skip 8-byte discriminator
  const authority = new PublicKey(raw.slice(o, o + 32)); o += 32;
  const sourMint = new PublicKey(raw.slice(o, o + 32)); o += 32;
  const keepersPool = new PublicKey(raw.slice(o, o + 32)); o += 32;
  const commonsTreasury = new PublicKey(raw.slice(o, o + 32)); o += 32;
  const pinchBps = dv.getUint16(o, true); o += 2;
  const burnShareBps = dv.getUint16(o, true); o += 2;
  const keepersShareBps = dv.getUint16(o, true); o += 2;
  const commonsShareBps = dv.getUint16(o, true); o += 2;
  const handshakeCount = dv.getBigUint64(o, true); o += 8;
  const totalBurned = dv.getBigUint64(o, true); o += 8;
  const totalToKeepers = dv.getBigUint64(o, true); o += 8;
  const totalToCommons = dv.getBigUint64(o, true); o += 8;
  const totalCompleted = dv.getBigUint64(o, true); o += 8;
  const totalDisputed = dv.getBigUint64(o, true); o += 8;
  const bump = raw[o];
  return {
    authority, sourMint, keepersPool, commonsTreasury,
    pinchBps, burnShareBps, keepersShareBps, commonsShareBps,
    handshakeCount, totalBurned, totalToKeepers, totalToCommons,
    totalCompleted, totalDisputed, bump,
  };
}

export function deserializeHandshake(raw: Uint8Array): HandshakeAccount {
  const dv = new DataView(raw.buffer, raw.byteOffset, raw.byteLength);
  let o = 8; // skip 8-byte discriminator
  const id = dv.getBigUint64(o, true); o += 8;
  const creator = new PublicKey(raw.slice(o, o + 32)); o += 32;
  const worker = new PublicKey(raw.slice(o, o + 32)); o += 32;
  const amount = dv.getBigUint64(o, true); o += 8;
  const descLen = dv.getUint32(o, true); o += 4;
  const description = new TextDecoder().decode(raw.slice(o, o + descLen)); o += descLen;
  const status = STATUS_MAP[raw[o]] ?? HandshakeStatus.Created; o += 1;
  const createdAt = dv.getBigInt64(o, true); o += 8;
  const deadlineTs = dv.getBigInt64(o, true); o += 8;
  const acceptedAt = dv.getBigInt64(o, true); o += 8;
  const deliveredAt = dv.getBigInt64(o, true); o += 8;
  const resolvedAt = dv.getBigInt64(o, true); o += 8;
  const disputedBy = new PublicKey(raw.slice(o, o + 32)); o += 32;
  const vaultBump = raw[o]; o += 1;
  const bump = raw[o];
  return {
    id, creator, worker, amount, description, status,
    createdAt, deadlineTs, acceptedAt, deliveredAt, resolvedAt,
    disputedBy, vaultBump, bump,
  };
}

// ---------------------------------------------------------------------------
// Fetch Helpers
// ---------------------------------------------------------------------------

export async function fetchConfig(
  conn: Connection,
): Promise<ProtocolConfigAccount | null> {
  const [pda] = getConfigPda();
  const info = await conn.getAccountInfo(pda);
  if (!info?.data) return null;
  return deserializeConfig(new Uint8Array(info.data));
}

export async function fetchHandshake(
  conn: Connection,
  id: number | bigint,
): Promise<HandshakeAccount | null> {
  const [pda] = getHandshakePda(id);
  const info = await conn.getAccountInfo(pda);
  if (!info?.data) return null;
  return deserializeHandshake(new Uint8Array(info.data));
}

// ---------------------------------------------------------------------------
// Instruction Builders
// ---------------------------------------------------------------------------

const IX_CREATE  = Buffer.from([195, 45, 213, 89, 226, 26, 9, 117]);
const IX_ACCEPT  = Buffer.from([32, 64, 238, 176, 81, 129, 224, 151]);
const IX_DELIVER = Buffer.from([250, 131, 222, 57, 211, 229, 209, 147]);
const IX_APPROVE = Buffer.from([69, 74, 217, 36, 115, 117, 97, 76]);
const IX_DISPUTE = Buffer.from([216, 92, 128, 146, 202, 85, 135, 73]);
const IX_CANCEL  = Buffer.from([232, 219, 223, 41, 219, 236, 220, 190]);

export function buildCreateHandshakeIx(p: {
  config: PublicKey;
  handshakePda: PublicKey;
  vault: PublicKey;
  vaultAuthority: PublicKey;
  creatorTokenAccount: PublicKey;
  worker: PublicKey;
  sourMint: PublicKey;
  creator: PublicKey;
  description: string;
  amount: bigint;
  deadlineTs: bigint;
}): TransactionInstruction {
  const desc = Buffer.from(p.description, "utf-8");
  const len = Buffer.alloc(4);
  len.writeUInt32LE(desc.length);
  const amt = Buffer.alloc(8);
  amt.writeBigUInt64LE(p.amount);
  const dl = Buffer.alloc(8);
  dl.writeBigInt64LE(p.deadlineTs);
  return new TransactionInstruction({
    programId: SOUR_HANDSHAKE_PROGRAM_ID,
    data: Buffer.concat([IX_CREATE, len, desc, amt, dl]),
    keys: [
      { pubkey: p.config, isSigner: false, isWritable: true },
      { pubkey: p.handshakePda, isSigner: false, isWritable: true },
      { pubkey: p.vault, isSigner: false, isWritable: true },
      { pubkey: p.vaultAuthority, isSigner: false, isWritable: false },
      { pubkey: p.creatorTokenAccount, isSigner: false, isWritable: true },
      { pubkey: p.worker, isSigner: false, isWritable: false },
      { pubkey: p.sourMint, isSigner: false, isWritable: false },
      { pubkey: p.creator, isSigner: true, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
  });
}

export function buildAcceptIx(
  handshakePda: PublicKey,
  worker: PublicKey,
): TransactionInstruction {
  return new TransactionInstruction({
    programId: SOUR_HANDSHAKE_PROGRAM_ID,
    data: IX_ACCEPT,
    keys: [
      { pubkey: handshakePda, isSigner: false, isWritable: true },
      { pubkey: worker, isSigner: true, isWritable: false },
    ],
  });
}

export function buildDeliverIx(
  handshakePda: PublicKey,
  worker: PublicKey,
): TransactionInstruction {
  return new TransactionInstruction({
    programId: SOUR_HANDSHAKE_PROGRAM_ID,
    data: IX_DELIVER,
    keys: [
      { pubkey: handshakePda, isSigner: false, isWritable: true },
      { pubkey: worker, isSigner: true, isWritable: false },
    ],
  });
}

export function buildApproveIx(p: {
  config: PublicKey;
  handshakePda: PublicKey;
  vault: PublicKey;
  vaultAuthority: PublicKey;
  workerTokenAccount: PublicKey;
  keepersPool: PublicKey;
  commonsTreasury: PublicKey;
  sourMint: PublicKey;
  creator: PublicKey;
}): TransactionInstruction {
  return new TransactionInstruction({
    programId: SOUR_HANDSHAKE_PROGRAM_ID,
    data: IX_APPROVE,
    keys: [
      { pubkey: p.config, isSigner: false, isWritable: true },
      { pubkey: p.handshakePda, isSigner: false, isWritable: true },
      { pubkey: p.vault, isSigner: false, isWritable: true },
      { pubkey: p.vaultAuthority, isSigner: false, isWritable: false },
      { pubkey: p.workerTokenAccount, isSigner: false, isWritable: true },
      { pubkey: p.keepersPool, isSigner: false, isWritable: true },
      { pubkey: p.commonsTreasury, isSigner: false, isWritable: true },
      { pubkey: p.sourMint, isSigner: false, isWritable: true },
      { pubkey: p.creator, isSigner: true, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
  });
}

export function buildDisputeIx(
  config: PublicKey,
  handshakePda: PublicKey,
  signer: PublicKey,
): TransactionInstruction {
  return new TransactionInstruction({
    programId: SOUR_HANDSHAKE_PROGRAM_ID,
    data: IX_DISPUTE,
    keys: [
      { pubkey: config, isSigner: false, isWritable: true },
      { pubkey: handshakePda, isSigner: false, isWritable: true },
      { pubkey: signer, isSigner: true, isWritable: false },
    ],
  });
}

export function buildCancelIx(p: {
  config: PublicKey;
  handshakePda: PublicKey;
  vault: PublicKey;
  vaultAuthority: PublicKey;
  creatorTokenAccount: PublicKey;
  creator: PublicKey;
}): TransactionInstruction {
  return new TransactionInstruction({
    programId: SOUR_HANDSHAKE_PROGRAM_ID,
    data: IX_CANCEL,
    keys: [
      { pubkey: p.config, isSigner: false, isWritable: false },
      { pubkey: p.handshakePda, isSigner: false, isWritable: true },
      { pubkey: p.vault, isSigner: false, isWritable: true },
      { pubkey: p.vaultAuthority, isSigner: false, isWritable: false },
      { pubkey: p.creatorTokenAccount, isSigner: false, isWritable: true },
      { pubkey: p.creator, isSigner: true, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
  });
}
