import { PublicKey } from "@solana/web3.js";

import {
  buildAcceptMessage,
  buildCancelMessage,
  buildCreateMessage,
  buildMilestoneApproveMessage,
  normalizeAmount,
  normalizeTextValue,
  type HandshakeMilestonePayload,
} from "./handshake-signing";
import {
  getAcceptHandshakeVerifier,
  getApproveMilestoneVerifier,
  getCancelHandshakeVerifier,
  getCreateHandshakeVerifier,
  type AcceptHandshakeVerificationPayload,
  type CancelHandshakeVerificationPayload,
  type ApproveMilestoneVerificationPayload,
  type HandshakeAcceptVerifier,
  type HandshakeApproveMilestoneVerifier,
  type HandshakeCancelVerifier,
  type HandshakeCreateVerifier,
} from "./handshake-verifier";
import {
  acceptHandshake,
  approveMilestone,
  cancelHandshake,
  createHandshake,
  getHandshake,
  type ApprovalMilestoneResult,
  type Handshake,
  type HandshakeWithMilestones,
  type Milestone,
} from "./handshake-store";

export interface CreateHandshakeDraftInput {
  creatorWallet: string;
  counterpartyWallet: string;
  title: string;
  description?: string;
  deadline: string;
  milestones: Array<{
    title: string;
    amount: number | string;
  }>;
}

export interface PreparedCreateHandshake {
  handshakeId: string;
  timestamp: string;
  creatorWallet: string;
  counterpartyWallet: string;
  title: string;
  description?: string;
  deadline: string;
  totalAmount: number;
  milestones: Array<HandshakeMilestonePayload & { amountNumber: number }>;
  canonicalMessage: string;
}

export type PreparedAcceptHandshake = AcceptHandshakeVerificationPayload;
export type PreparedApproveMilestone = ApproveMilestoneVerificationPayload;
export type PreparedCancelHandshake = CancelHandshakeVerificationPayload;

function assertValidWallet(address: string, label: string) {
  try {
    // eslint-disable-next-line no-new
    new PublicKey(address);
  } catch {
    throw new Error(`Invalid ${label} wallet address`);
  }
}

function assertValidFutureDeadline(deadline: string) {
  const deadlineMs = Date.parse(deadline);
  if (!Number.isFinite(deadlineMs)) {
    throw new Error("Invalid deadline");
  }

  if (deadlineMs <= Date.now()) {
    throw new Error("Deadline must be in the future");
  }
}

function normalizeMilestones(
  milestones: CreateHandshakeDraftInput["milestones"],
): PreparedCreateHandshake["milestones"] {
  if (milestones.length === 0) {
    throw new Error("At least one milestone is required");
  }

  return milestones.map((milestone, index) => {
    const title = normalizeTextValue(milestone.title);
    if (!title) {
      throw new Error(`Milestone ${index + 1} title is required`);
    }

    const amount = normalizeAmount(milestone.amount);
    const amountNumber = Number(amount);
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      throw new Error(`Milestone ${index + 1} amount must be greater than zero`);
    }

    return {
      index,
      title,
      amount,
      amountNumber,
    };
  });
}

export async function prepareCreateHandshakeForSigning(
  input: CreateHandshakeDraftInput,
): Promise<PreparedCreateHandshake> {
  const creatorWallet = normalizeTextValue(input.creatorWallet);
  const counterpartyWallet = normalizeTextValue(input.counterpartyWallet);
  const title = normalizeTextValue(input.title);
  const description = normalizeTextValue(input.description);

  if (!title) {
    throw new Error("Title is required");
  }

  assertValidWallet(creatorWallet, "creator");
  assertValidWallet(counterpartyWallet, "counterparty");

  if (creatorWallet === counterpartyWallet) {
    throw new Error("Creator and counterparty must be different wallets");
  }

  assertValidFutureDeadline(input.deadline);

  const milestones = normalizeMilestones(input.milestones);
  const totalAmount = milestones.reduce((sum, milestone) => sum + milestone.amountNumber, 0);
  const handshakeId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const canonicalMessage = await buildCreateMessage({
    handshakeId,
    creator: creatorWallet,
    counterparty: counterpartyWallet,
    title,
    description,
    totalAmount,
    deadline: input.deadline,
    milestones,
    timestamp,
  });

  return {
    handshakeId,
    timestamp,
    creatorWallet,
    counterpartyWallet,
    title,
    description: description || undefined,
    deadline: input.deadline,
    totalAmount,
    milestones,
    canonicalMessage,
  };
}

export async function submitPreparedCreateHandshake(params: {
  prepared: PreparedCreateHandshake;
  creatorSignature: string;
  signedMessage?: string;
  verifier?: HandshakeCreateVerifier;
}): Promise<Handshake> {
  const {
    prepared,
    creatorSignature,
    signedMessage = prepared.canonicalMessage,
    verifier = getCreateHandshakeVerifier(),
  } = params;

  const verification = await verifier.verifyCreateHandshake({
    prepared,
    signedMessage,
    creatorSignature,
  });

  if (!verification.ok) {
    throw new Error(`${verification.code}: ${verification.message}`);
  }

  if (verification.persistence === "remote") {
    if (!verification.handshake) {
      throw new Error("PERSISTENCE_ERROR: Remote verifier did not return a handshake record");
    }

    return verification.handshake;
  }

  return createHandshake({
    handshakeId: prepared.handshakeId,
    creatorWallet: prepared.creatorWallet,
    counterpartyWallet: prepared.counterpartyWallet,
    creatorSignature,
    title: prepared.title,
    description: prepared.description,
    totalAmount: prepared.totalAmount,
    deadline: prepared.deadline,
    milestones: prepared.milestones.map((milestone) => ({
      title: milestone.title,
      amount: milestone.amountNumber,
    })),
  });
}

export async function prepareAcceptHandshakeForSigning(params: {
  handshakeId: string;
  counterpartyWallet: string;
}): Promise<{ prepared: PreparedAcceptHandshake; handshake: Handshake }> {
  const handshakeId = normalizeTextValue(params.handshakeId);
  const counterpartyWallet = normalizeTextValue(params.counterpartyWallet);

  assertValidWallet(counterpartyWallet, "counterparty");

  const handshake = await getHandshake(handshakeId);
  if (!handshake) {
    throw new Error("Handshake not found");
  }

  if (handshake.status !== "created") {
    throw new Error("Handshake can only be accepted from created state");
  }

  if (handshake.counterparty_wallet !== counterpartyWallet) {
    throw new Error("Connected wallet does not match the stored counterparty");
  }

  if (handshake.counterparty_signature) {
    throw new Error("Handshake has already been accepted");
  }

  const timestamp = new Date().toISOString();
  const canonicalMessage = buildAcceptMessage({
    handshakeId,
    counterparty: counterpartyWallet,
    timestamp,
  });

  return {
    prepared: {
      handshakeId,
      counterpartyWallet,
      timestamp,
      canonicalMessage,
    },
    handshake,
  };
}

export async function submitPreparedAcceptHandshake(params: {
  prepared: PreparedAcceptHandshake;
  handshake: Handshake;
  counterpartySignature: string;
  signedMessage?: string;
  verifier?: HandshakeAcceptVerifier;
}): Promise<Handshake> {
  const {
    prepared,
    handshake,
    counterpartySignature,
    signedMessage = prepared.canonicalMessage,
    verifier = getAcceptHandshakeVerifier(),
  } = params;

  const verification = await verifier.verifyAcceptHandshake({
    prepared,
    handshake,
    signedMessage,
    counterpartySignature,
  });

  if (!verification.ok) {
    throw new Error(`${verification.code}: ${verification.message}`);
  }

  if (verification.persistence === "remote") {
    if (!verification.handshake) {
      throw new Error("PERSISTENCE_ERROR: Remote verifier did not return a handshake record");
    }

    return verification.handshake;
  }

  return acceptHandshake(prepared.handshakeId, counterpartySignature);
}

export async function prepareApproveMilestoneForSigning(params: {
  handshakeId: string;
  milestoneId: string;
  approverWallet: string;
  signerRole: "creator" | "counterparty";
}): Promise<{
  prepared: PreparedApproveMilestone;
  handshake: HandshakeWithMilestones;
  milestone: Milestone;
}> {
  const handshakeId = normalizeTextValue(params.handshakeId);
  const milestoneId = normalizeTextValue(params.milestoneId);
  const approverWallet = normalizeTextValue(params.approverWallet);

  assertValidWallet(approverWallet, "approver");

  const handshake = await getHandshake(handshakeId);
  if (!handshake) {
    throw new Error("Handshake not found");
  }

  if (handshake.status !== "active") {
    throw new Error("Milestones can only be approved while handshake is active");
  }

  const expectedWallet =
    params.signerRole === "creator" ? handshake.creator_wallet : handshake.counterparty_wallet;
  if (expectedWallet !== approverWallet) {
    throw new Error("Connected wallet does not match the selected signer role");
  }

  const milestone = handshake.milestones.find((item) => item.id === milestoneId);
  if (!milestone) {
    throw new Error("Milestone not found");
  }

  if (milestone.status === "approved" || (milestone.creator_approved && milestone.counterparty_approved)) {
    throw new Error("Milestone has already been fully approved");
  }

  const alreadyApproved =
    params.signerRole === "creator" ? milestone.creator_approved : milestone.counterparty_approved;
  if (alreadyApproved) {
    throw new Error("You have already approved this milestone");
  }

  const timestamp = new Date().toISOString();
  const canonicalMessage = buildMilestoneApproveMessage({
    handshakeId,
    milestoneId,
    milestoneIndex: milestone.index,
    milestoneTitle: milestone.title,
    approver: approverWallet,
    signerRole: params.signerRole,
    timestamp,
  });

  return {
    prepared: {
      handshakeId,
      milestoneId,
      milestoneIndex: milestone.index,
      milestoneTitle: milestone.title,
      approverWallet,
      signerRole: params.signerRole,
      timestamp,
      canonicalMessage,
    },
    handshake,
    milestone,
  };
}

export async function submitPreparedApproveMilestone(params: {
  prepared: PreparedApproveMilestone;
  handshake: HandshakeWithMilestones;
  milestone: Milestone;
  approverSignature: string;
  signedMessage?: string;
  verifier?: HandshakeApproveMilestoneVerifier;
}): Promise<ApprovalMilestoneResult> {
  const {
    prepared,
    handshake,
    milestone,
    approverSignature,
    signedMessage = prepared.canonicalMessage,
    verifier = getApproveMilestoneVerifier(),
  } = params;

  const verification = await verifier.verifyApproveMilestone({
    prepared,
    handshake,
    milestone,
    signedMessage,
    approverSignature,
  });

  if (!verification.ok) {
    throw new Error(`${verification.code}: ${verification.message}`);
  }

  if (verification.persistence === "remote") {
    return verification.approval ?? { allApproved: false };
  }

  return approveMilestone({
    milestoneId: prepared.milestoneId,
    handshakeId: prepared.handshakeId,
    role: prepared.signerRole,
    signature: approverSignature,
  });
}

export async function prepareCancelHandshakeForSigning(params: {
  handshakeId: string;
  signerWallet: string;
}): Promise<{ prepared: PreparedCancelHandshake; handshake: Handshake }> {
  const handshakeId = normalizeTextValue(params.handshakeId);
  const signerWallet = normalizeTextValue(params.signerWallet);

  assertValidWallet(signerWallet, "signer");

  const handshake = await getHandshake(handshakeId);
  if (!handshake) {
    throw new Error("Handshake not found");
  }

  if (handshake.status !== "created" && handshake.status !== "active") {
    throw new Error("Handshake can only be cancelled from created or active state");
  }

  if (signerWallet !== handshake.creator_wallet && signerWallet !== handshake.counterparty_wallet) {
    throw new Error("Connected wallet does not belong to this handshake");
  }

  const timestamp = new Date().toISOString();
  const canonicalMessage = buildCancelMessage({
    handshakeId,
    wallet: signerWallet,
    timestamp,
  });

  return {
    prepared: {
      handshakeId,
      signerWallet,
      timestamp,
      canonicalMessage,
    },
    handshake,
  };
}

export async function submitPreparedCancelHandshake(params: {
  prepared: PreparedCancelHandshake;
  handshake: Handshake;
  signerSignature: string;
  signedMessage?: string;
  verifier?: HandshakeCancelVerifier;
}): Promise<Handshake> {
  const {
    prepared,
    handshake,
    signerSignature,
    signedMessage = prepared.canonicalMessage,
    verifier = getCancelHandshakeVerifier(),
  } = params;

  const verification = await verifier.verifyCancelHandshake({
    prepared,
    handshake,
    signedMessage,
    signerSignature,
  });

  if (!verification.ok) {
    throw new Error(`${verification.code}: ${verification.message}`);
  }

  if (verification.persistence === "remote") {
    if (!verification.handshake) {
      throw new Error("PERSISTENCE_ERROR: Remote verifier did not return a handshake record");
    }

    return verification.handshake;
  }

  return cancelHandshake(prepared.handshakeId, prepared.signerWallet);
}
