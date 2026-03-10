// @ts-nocheck
import { PublicKey } from "npm:@solana/web3.js@1.98.4";
import bs58 from "npm:bs58@6.0.0";
import nacl from "npm:tweetnacl@1.0.3";

export type HandshakeVerificationErrorCode =
  | "INVALID_INPUT"
  | "INVALID_SIGNATURE"
  | "SIGNER_MISMATCH"
  | "PAYLOAD_MISMATCH"
  | "DUPLICATE_ACTION"
  | "INVALID_STATE"
  | "PERSISTENCE_ERROR";

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

export interface CancelHandshakeVerificationPayload {
  handshakeId: string;
  signerWallet: string;
  timestamp: string;
  canonicalMessage: string;
}

export interface CancelHandshakeRequest {
  action: "CANCEL";
  payloadVersion: 1;
  signedMessage: string;
  signerSignature: string;
  prepared: CancelHandshakeVerificationPayload;
}

export interface CancelHandshakeSuccessResponse {
  ok: true;
  persistence: "remote";
  handshake: HandshakeRow;
}

export interface CancelHandshakeErrorResponse {
  ok: false;
  code: HandshakeVerificationErrorCode;
  message: string;
}

export type CancelHandshakeResponse =
  | CancelHandshakeSuccessResponse
  | CancelHandshakeErrorResponse;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HANDSHAKE_PAYLOAD_VERSION = 1;
const HANDSHAKE_ENV = "beta";

function buildPayloadHeader(action: "CANCEL", env = HANDSHAKE_ENV): string[] {
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

export function buildCancelMessage(prepared: CancelHandshakeVerificationPayload): string {
  return buildPayload([
    ...buildPayloadHeader("CANCEL"),
    formatField("Handshake ID", prepared.handshakeId),
    formatField("Signer", prepared.signerWallet),
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

export function assertValidWallet(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function validateCancelRequest(
  request: CancelHandshakeRequest,
  handshake: HandshakeRow | null,
): Promise<CancelHandshakeErrorResponse | null> {
  if (request.action !== "CANCEL" || request.payloadVersion !== 1) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Unsupported action or payload version",
    };
  }

  const { prepared, signedMessage, signerSignature } = request;

  if (!prepared || typeof prepared !== "object") {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Missing prepared payload",
    };
  }

  if (!prepared.handshakeId) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Handshake ID is required",
    };
  }

  if (!assertValidWallet(prepared.signerWallet)) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Invalid signer wallet",
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

  if (!handshake) {
    return {
      ok: false,
      code: "INVALID_STATE",
      message: "Handshake not found",
    };
  }

  if (handshake.id !== prepared.handshakeId) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Cancel payload handshake ID does not match stored handshake",
    };
  }

  if (handshake.status !== "created" && handshake.status !== "active") {
    return {
      ok: false,
      code: "INVALID_STATE",
      message: "Handshake can only be cancelled from created or active state",
    };
  }

  if (prepared.signerWallet !== handshake.creator_wallet && prepared.signerWallet !== handshake.counterparty_wallet) {
    return {
      ok: false,
      code: "SIGNER_MISMATCH",
      message: "Cancel signer does not belong to this handshake",
    };
  }

  const canonicalMessage = buildCancelMessage(prepared);
  if (canonicalMessage !== prepared.canonicalMessage || canonicalMessage !== signedMessage) {
    return {
      ok: false,
      code: "PAYLOAD_MISMATCH",
      message: "Signed message does not match canonical cancel payload",
    };
  }

  if (!signerSignature || !verifySignature(signedMessage, signerSignature, prepared.signerWallet)) {
    return {
      ok: false,
      code: "INVALID_SIGNATURE",
      message: "Signature verification failed for cancel signer",
    };
  }

  return null;
}
