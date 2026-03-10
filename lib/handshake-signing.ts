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
// Canonical payload v1
// ---------------------------------------------------------------------------

export const HANDSHAKE_PAYLOAD_VERSION = 1;
export const HANDSHAKE_ENV = "beta";

type HandshakeAction = "CREATE" | "ACCEPT" | "APPROVE_MILESTONE" | "CANCEL";

export interface HandshakeMilestonePayload {
  index: number;
  title: string;
  amount: number | string;
}

function buildPayloadHeader(action: HandshakeAction, env = HANDSHAKE_ENV): string[] {
  return [
    "SOUR Handshake",
    `Version: ${HANDSHAKE_PAYLOAD_VERSION}`,
    `Action: ${action}`,
    `Env: ${env}`,
  ];
}

function buildPayload(lines: string[]): string {
  return lines.join("\n");
}

function formatField(label: string, value: string): string {
  return `${label}: ${value}`;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function normalizeTextValue(value?: string): string {
  return (value ?? "").trim();
}

export function normalizeAmount(value: number | string): string {
  const num = typeof value === "string" ? Number(value.trim()) : value;
  if (!Number.isFinite(num)) {
    throw new Error("Invalid amount");
  }

  const normalized = num.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  return normalized === "-0" ? "0" : normalized;
}

export function serializeMilestonesForHash(milestones: HandshakeMilestonePayload[]): string {
  return milestones
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((milestone) =>
      [
        milestone.index + 1,
        normalizeTextValue(milestone.title),
        normalizeAmount(milestone.amount),
      ].join("|"),
    )
    .join("\n");
}

export async function computeMilestoneHash(
  milestones: HandshakeMilestonePayload[],
): Promise<string> {
  const source = serializeMilestonesForHash(milestones);
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(source),
  );
  return bytesToHex(new Uint8Array(digest));
}

export async function buildCreateMessage(params: {
  handshakeId: string;
  creator: string;
  counterparty: string;
  title: string;
  description?: string;
  totalAmount: number | string;
  deadline: string; // ISO date
  milestones: HandshakeMilestonePayload[];
  timestamp?: string;
  env?: string;
}): Promise<string> {
  const timestamp = params.timestamp ?? new Date().toISOString();
  const milestoneHash = await computeMilestoneHash(params.milestones);

  return buildPayload([
    ...buildPayloadHeader("CREATE", params.env),
    formatField("Handshake ID", params.handshakeId),
    formatField("Creator", params.creator),
    formatField("Counterparty", params.counterparty),
    formatField("Title", normalizeTextValue(params.title)),
    formatField("Description", normalizeTextValue(params.description)),
    formatField("Total Amount", normalizeAmount(params.totalAmount)),
    formatField("Deadline", params.deadline),
    formatField("Milestone Hash", milestoneHash),
    formatField("Timestamp", timestamp),
  ]);
}

export function buildAcceptMessage(params: {
  handshakeId: string;
  counterparty: string;
  timestamp?: string;
  env?: string;
}): string {
  const timestamp = params.timestamp ?? new Date().toISOString();
  return buildPayload([
    ...buildPayloadHeader("ACCEPT", params.env),
    formatField("Handshake ID", params.handshakeId),
    formatField("Counterparty", params.counterparty),
    formatField("Timestamp", timestamp),
  ]);
}

export function buildMilestoneApproveMessage(params: {
  handshakeId: string;
  milestoneId: string;
  milestoneIndex: number;
  milestoneTitle: string;
  approver: string;
  signerRole: "creator" | "counterparty";
  timestamp?: string;
  env?: string;
}): string {
  const timestamp = params.timestamp ?? new Date().toISOString();
  return buildPayload([
    ...buildPayloadHeader("APPROVE_MILESTONE", params.env),
    formatField("Handshake ID", params.handshakeId),
    formatField("Milestone ID", params.milestoneId),
    formatField("Milestone Index", String(params.milestoneIndex)),
    formatField("Milestone Title", normalizeTextValue(params.milestoneTitle)),
    formatField("Signer", params.approver),
    formatField("Role", params.signerRole),
    formatField("Timestamp", timestamp),
  ]);
}

export function buildCancelMessage(params: {
  handshakeId: string;
  wallet: string;
  timestamp?: string;
  env?: string;
}): string {
  const timestamp = params.timestamp ?? new Date().toISOString();
  return buildPayload([
    ...buildPayloadHeader("CANCEL", params.env),
    formatField("Handshake ID", params.handshakeId),
    formatField("Signer", params.wallet),
    formatField("Timestamp", timestamp),
  ]);
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
