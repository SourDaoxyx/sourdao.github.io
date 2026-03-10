// @ts-nocheck
import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import bs58 from "npm:bs58@6.0.0";
import nacl from "npm:tweetnacl@1.0.3";

export const HANDSHAKE_PAYLOAD_VERSION = 1;
export const HANDSHAKE_ENV = "beta";

export type HandshakeVerificationErrorCode =
  | "INVALID_INPUT"
  | "INVALID_SIGNATURE"
  | "SIGNER_MISMATCH"
  | "PAYLOAD_MISMATCH"
  | "DUPLICATE_ACTION"
  | "INVALID_STATE"
  | "PERSISTENCE_ERROR";

export interface CreateHandshakeVerificationPayload {
  handshakeId: string;
  timestamp: string;
  creatorWallet: string;
  counterpartyWallet: string;
  title: string;
  description?: string;
  deadline: string;
  totalAmount: number;
  milestones: Array<{
    index: number;
    title: string;
    amount: string | number;
    amountNumber: number;
  }>;
  canonicalMessage: string;
}

export interface CreateHandshakeRequest {
  action: "CREATE";
  payloadVersion: 1;
  signedMessage: string;
  creatorSignature: string;
  prepared: CreateHandshakeVerificationPayload;
}

export interface HandshakeRow {
  id: string;
  creator_wallet: string;
  counterparty_wallet: string;
  creator_signature: string | null;
  counterparty_signature: string | null;
  title: string;
  description: string | null;
  token_mint: string;
  total_amount: number;
  deadline: string;
  status: "created" | "active" | "completed" | "cancelled" | "expired";
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateHandshakeSuccessResponse {
  ok: true;
  persistence: "remote";
  handshake: HandshakeRow;
}

export interface CreateHandshakeErrorResponse {
  ok: false;
  code: HandshakeVerificationErrorCode;
  message: string;
}

export type CreateHandshakeResponse =
  | CreateHandshakeSuccessResponse
  | CreateHandshakeErrorResponse;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function buildPayloadHeader(action: "CREATE", env = HANDSHAKE_ENV): string[] {
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

export function serializeMilestonesForHash(
  milestones: CreateHandshakeVerificationPayload["milestones"],
): string {
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
  milestones: CreateHandshakeVerificationPayload["milestones"],
): Promise<string> {
  const source = serializeMilestonesForHash(milestones);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(source));
  return bytesToHex(new Uint8Array(digest));
}

export async function buildCreateMessage(
  prepared: CreateHandshakeVerificationPayload,
): Promise<string> {
  const milestoneHash = await computeMilestoneHash(prepared.milestones);

  return buildPayload([
    ...buildPayloadHeader("CREATE"),
    formatField("Handshake ID", prepared.handshakeId),
    formatField("Creator", prepared.creatorWallet),
    formatField("Counterparty", prepared.counterpartyWallet),
    formatField("Title", normalizeTextValue(prepared.title)),
    formatField("Description", normalizeTextValue(prepared.description)),
    formatField("Total Amount", normalizeAmount(prepared.totalAmount)),
    formatField("Deadline", prepared.deadline),
    formatField("Milestone Hash", milestoneHash),
    formatField("Timestamp", prepared.timestamp),
  ]);
}

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

export function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function assertValidWallet(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function validateCreateRequest(
  request: CreateHandshakeRequest,
): Promise<CreateHandshakeErrorResponse | null> {
  if (request.action !== "CREATE" || request.payloadVersion !== 1) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Unsupported action or payload version",
    };
  }

  const { prepared, signedMessage, creatorSignature } = request;

  if (!prepared || typeof prepared !== "object") {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Missing prepared payload",
    };
  }

  if (!isValidUuid(prepared.handshakeId)) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Handshake ID must be a valid UUID",
    };
  }

  if (!assertValidWallet(prepared.creatorWallet) || !assertValidWallet(prepared.counterpartyWallet)) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Invalid wallet address",
    };
  }

  if (prepared.creatorWallet === prepared.counterpartyWallet) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Creator and counterparty must be different wallets",
    };
  }

  if (!normalizeTextValue(prepared.title)) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Title is required",
    };
  }

  if (!Array.isArray(prepared.milestones) || prepared.milestones.length === 0) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "At least one milestone is required",
    };
  }

  const deadlineMs = Date.parse(prepared.deadline);
  if (!Number.isFinite(deadlineMs) || deadlineMs <= Date.now()) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Deadline must be in the future",
    };
  }

  const timestampMs = Date.parse(prepared.timestamp);
  if (!Number.isFinite(timestampMs)) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Timestamp must be a valid ISO date",
    };
  }

  const recomputedTotal = prepared.milestones.reduce((sum, milestone, index) => {
    if (milestone.index !== index) {
      throw new Error(`Milestone ${index + 1} index mismatch`);
    }

    if (!normalizeTextValue(milestone.title)) {
      throw new Error(`Milestone ${index + 1} title is required`);
    }

    const amount = Number(normalizeAmount(milestone.amount));
    if (!Number.isFinite(amount) || amount <= 0 || Math.abs(amount - milestone.amountNumber) > 1e-9) {
      throw new Error(`Milestone ${index + 1} amount is invalid`);
    }

    return sum + milestone.amountNumber;
  }, 0);

  if (Math.abs(recomputedTotal - prepared.totalAmount) > 1e-9) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Total amount does not match milestone sum",
    };
  }

  const canonicalMessage = await buildCreateMessage(prepared);
  if (canonicalMessage !== prepared.canonicalMessage || canonicalMessage !== signedMessage) {
    return {
      ok: false,
      code: "PAYLOAD_MISMATCH",
      message: "Signed message does not match canonical payload",
    };
  }

  if (!creatorSignature || !verifySignature(signedMessage, creatorSignature, prepared.creatorWallet)) {
    return {
      ok: false,
      code: "INVALID_SIGNATURE",
      message: "Signature verification failed for creator wallet",
    };
  }

  return null;
}
