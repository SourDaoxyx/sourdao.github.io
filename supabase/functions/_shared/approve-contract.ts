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

export interface ApprovalMilestoneResult {
  allApproved: boolean;
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

export interface MilestoneRow {
  id: string;
  handshake_id: string;
  index: number;
  title: string;
  amount: number;
  creator_approved: boolean;
  counterparty_approved: boolean;
  creator_approve_sig: string | null;
  counterparty_approve_sig: string | null;
  status: "pending" | "approved";
  approved_at: string | null;
  created_at: string;
}

export interface ApproveMilestoneVerificationPayload {
  handshakeId: string;
  milestoneId: string;
  milestoneIndex: number;
  milestoneTitle: string;
  approverWallet: string;
  signerRole: "creator" | "counterparty";
  timestamp: string;
  canonicalMessage: string;
}

export interface ApproveMilestoneRequest {
  action: "APPROVE_MILESTONE";
  payloadVersion: 1;
  signedMessage: string;
  approverSignature: string;
  prepared: ApproveMilestoneVerificationPayload;
}

export interface ApproveMilestoneSuccessResponse {
  ok: true;
  persistence: "remote";
  approval: ApprovalMilestoneResult;
}

export interface ApproveMilestoneErrorResponse {
  ok: false;
  code: HandshakeVerificationErrorCode;
  message: string;
}

export type ApproveMilestoneResponse =
  | ApproveMilestoneSuccessResponse
  | ApproveMilestoneErrorResponse;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HANDSHAKE_PAYLOAD_VERSION = 1;
const HANDSHAKE_ENV = "beta";

function buildPayloadHeader(action: "APPROVE_MILESTONE", env = HANDSHAKE_ENV): string[] {
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

export function buildApprovalMessage(prepared: ApproveMilestoneVerificationPayload): string {
  return buildPayload([
    ...buildPayloadHeader("APPROVE_MILESTONE"),
    formatField("Handshake ID", prepared.handshakeId),
    formatField("Milestone ID", prepared.milestoneId),
    formatField("Milestone Index", String(prepared.milestoneIndex)),
    formatField("Milestone Title", prepared.milestoneTitle.trim()),
    formatField("Signer", prepared.approverWallet),
    formatField("Role", prepared.signerRole),
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

export async function validateApproveMilestoneRequest(
  request: ApproveMilestoneRequest,
  handshake: HandshakeRow | null,
  milestone: MilestoneRow | null,
): Promise<ApproveMilestoneErrorResponse | null> {
  if (request.action !== "APPROVE_MILESTONE" || request.payloadVersion !== 1) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Unsupported action or payload version",
    };
  }

  const { prepared, signedMessage, approverSignature } = request;

  if (!prepared || typeof prepared !== "object") {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Missing prepared payload",
    };
  }

  if (!prepared.handshakeId || !prepared.milestoneId) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Handshake ID and milestone ID are required",
    };
  }

  if (!assertValidWallet(prepared.approverWallet)) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Invalid approver wallet",
    };
  }

  if (prepared.signerRole !== "creator" && prepared.signerRole !== "counterparty") {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Invalid signer role",
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

  if (!handshake || !milestone) {
    return {
      ok: false,
      code: "INVALID_STATE",
      message: "Handshake or milestone not found",
    };
  }

  if (handshake.status !== "active") {
    return {
      ok: false,
      code: "INVALID_STATE",
      message: "Milestones can only be approved while handshake is active",
    };
  }

  if (handshake.id !== prepared.handshakeId || milestone.handshake_id !== prepared.handshakeId) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Approval payload handshake ID does not match stored state",
    };
  }

  if (milestone.id !== prepared.milestoneId) {
    return {
      ok: false,
      code: "INVALID_INPUT",
      message: "Approval payload milestone ID does not match stored milestone",
    };
  }

  if (milestone.index !== prepared.milestoneIndex || milestone.title !== prepared.milestoneTitle) {
    return {
      ok: false,
      code: "PAYLOAD_MISMATCH",
      message: "Approval payload does not match milestone snapshot",
    };
  }

  if (milestone.status === "approved" || (milestone.creator_approved && milestone.counterparty_approved)) {
    return {
      ok: false,
      code: "DUPLICATE_ACTION",
      message: "Milestone has already been fully approved",
    };
  }

  const expectedWallet =
    prepared.signerRole === "creator" ? handshake.creator_wallet : handshake.counterparty_wallet;
  if (expectedWallet !== prepared.approverWallet) {
    return {
      ok: false,
      code: "SIGNER_MISMATCH",
      message: "Approval signer does not match stored handshake role",
    };
  }

  const alreadyApproved =
    prepared.signerRole === "creator" ? milestone.creator_approved : milestone.counterparty_approved;
  if (alreadyApproved) {
    return {
      ok: false,
      code: "DUPLICATE_ACTION",
      message: "Signer has already approved this milestone",
    };
  }

  const canonicalMessage = buildApprovalMessage(prepared);
  if (canonicalMessage !== prepared.canonicalMessage || canonicalMessage !== signedMessage) {
    return {
      ok: false,
      code: "PAYLOAD_MISMATCH",
      message: "Signed message does not match canonical approval payload",
    };
  }

  if (!approverSignature || !verifySignature(signedMessage, approverSignature, prepared.approverWallet)) {
    return {
      ok: false,
      code: "INVALID_SIGNATURE",
      message: "Signature verification failed for milestone approver",
    };
  }

  return null;
}
