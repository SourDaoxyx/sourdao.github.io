/**
 * Wallet message signing for Handshake Protocol (Phase 1).
 *
 * Instead of on-chain escrow transactions, both parties SIGN a structured
 * message with their wallet. This proves cryptographic intent without
 * moving any tokens. The signatures are stored in Supabase.
 */

import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import nacl from "tweetnacl";

// ---------------------------------------------------------------------------
// Message Templates
// ---------------------------------------------------------------------------

export function buildCreateMessage(params: {
  handshakeId: string;
  creator: string;
  counterparty: string;
  title: string;
  totalAmount: number;
  deadline: string; // ISO date
}): string {
  return [
    "SOUR Handshake — Create Agreement",
    `ID: ${params.handshakeId}`,
    `Creator: ${params.creator}`,
    `Counterparty: ${params.counterparty}`,
    `Title: ${params.title}`,
    `Amount: ${params.totalAmount} SOUR`,
    `Deadline: ${params.deadline}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join("\n");
}

export function buildAcceptMessage(params: {
  handshakeId: string;
  counterparty: string;
}): string {
  return [
    "SOUR Handshake — Accept Agreement",
    `ID: ${params.handshakeId}`,
    `Accepted by: ${params.counterparty}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join("\n");
}

export function buildMilestoneApproveMessage(params: {
  handshakeId: string;
  milestoneIndex: number;
  milestoneTitle: string;
  approver: string;
}): string {
  return [
    "SOUR Handshake — Approve Milestone",
    `Handshake ID: ${params.handshakeId}`,
    `Milestone #${params.milestoneIndex + 1}: ${params.milestoneTitle}`,
    `Approved by: ${params.approver}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join("\n");
}

export function buildCancelMessage(params: {
  handshakeId: string;
  wallet: string;
}): string {
  return [
    "SOUR Handshake — Cancel Agreement",
    `ID: ${params.handshakeId}`,
    `Cancelled by: ${params.wallet}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join("\n");
}

// ---------------------------------------------------------------------------
// Sign & Verify
// ---------------------------------------------------------------------------

/**
 * Request a wallet signature for a text message.
 * Works with Phantom / Solflare `signMessage()`.
 */
export async function signMessage(
  message: string,
  signMessageFn: (message: Uint8Array) => Promise<Uint8Array>,
): Promise<string> {
  const encoded = new TextEncoder().encode(message);
  const signature = await signMessageFn(encoded);
  return bs58.encode(signature);
}

/**
 * Verify that a signature was produced by the given wallet for the message.
 */
export function verifySignature(
  message: string,
  signature: string,
  walletAddress: string,
): boolean {
  try {
    const msgBytes = new TextEncoder().encode(message);
    const sigBytes = bs58.decode(signature);
    const pubkeyBytes = new PublicKey(walletAddress).toBytes();
    return nacl.sign.detached.verify(msgBytes, sigBytes, pubkeyBytes);
  } catch {
    return false;
  }
}
