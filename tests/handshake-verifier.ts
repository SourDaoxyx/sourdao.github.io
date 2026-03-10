import { assert } from "chai";
import bs58 from "bs58";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";

import {
  buildAcceptMessage,
  buildCancelMessage,
  buildCreateMessage,
  buildMilestoneApproveMessage,
} from "../lib/handshake-signing";
import {
  localAcceptHandshakeVerifier,
  localApproveMilestoneVerifier,
  localCancelHandshakeVerifier,
  localHandshakeVerifier,
} from "../lib/handshake-verifier";
import type { Handshake, HandshakeWithMilestones, Milestone } from "../lib/handshake-store";
import { buildActionAuditMetadata } from "../supabase/functions/_shared/action-audit";

type Role = "creator" | "counterparty";

function generateWallet() {
  const pair = nacl.sign.keyPair();
  return {
    publicKey: new PublicKey(pair.publicKey).toBase58(),
    sign(message: string) {
      const bytes = new TextEncoder().encode(message);
      return bs58.encode(nacl.sign.detached(bytes, pair.secretKey));
    },
  };
}

const creator = generateWallet();
const counterparty = generateWallet();
const outsider = generateWallet();

function buildBaseHandshake(status: Handshake["status"] = "created"): Handshake {
  return {
    id: "8a0f3a24-6c8d-4e39-89e0-6f25cbf5d401",
    creator_wallet: creator.publicKey,
    counterparty_wallet: counterparty.publicKey,
    creator_signature: null,
    counterparty_signature: null,
    title: "Logo Design",
    description: "Create a SOUR wordmark",
    token_mint: "2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump",
    total_amount: 100,
    deadline: "2026-12-31T00:00:00.000Z",
    status,
    created_at: "2026-03-10T00:00:00.000Z",
    updated_at: "2026-03-10T00:00:00.000Z",
    completed_at: null,
  };
}

function buildMilestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: "milestone-1",
    handshake_id: "8a0f3a24-6c8d-4e39-89e0-6f25cbf5d401",
    index: 0,
    title: "Draft",
    amount: 25,
    creator_approved: false,
    counterparty_approved: false,
    creator_approve_sig: null,
    counterparty_approve_sig: null,
    status: "pending",
    approved_at: null,
    created_at: "2026-03-10T00:00:00.000Z",
    ...overrides,
  };
}

function buildHandshakeWithMilestones(
  status: Handshake["status"] = "active",
  milestoneOverrides: Partial<Milestone> = {},
): HandshakeWithMilestones {
  return {
    ...buildBaseHandshake(status),
    milestones: [buildMilestone(milestoneOverrides)],
  };
}

describe("handshake local verifiers", () => {
  it("accepts a valid CREATE payload and signature", async () => {
    const canonicalMessage = await buildCreateMessage({
      handshakeId: "8a0f3a24-6c8d-4e39-89e0-6f25cbf5d401",
      creator: creator.publicKey,
      counterparty: counterparty.publicKey,
      title: "Logo Design",
      description: "Create a SOUR wordmark",
      totalAmount: 100,
      deadline: "2026-12-31T00:00:00.000Z",
      milestones: [
        { index: 0, title: "Draft", amount: 25 },
        { index: 1, title: "Final delivery", amount: 75 },
      ],
      timestamp: "2026-03-10T12:00:00.000Z",
    });

    const signature = creator.sign(canonicalMessage);
    const result = await localHandshakeVerifier.verifyCreateHandshake({
      prepared: {
        handshakeId: "8a0f3a24-6c8d-4e39-89e0-6f25cbf5d401",
        timestamp: "2026-03-10T12:00:00.000Z",
        creatorWallet: creator.publicKey,
        counterpartyWallet: counterparty.publicKey,
        title: "Logo Design",
        description: "Create a SOUR wordmark",
        deadline: "2026-12-31T00:00:00.000Z",
        totalAmount: 100,
        milestones: [
          { index: 0, title: "Draft", amount: "25", amountNumber: 25 },
          { index: 1, title: "Final delivery", amount: "75", amountNumber: 75 },
        ],
        canonicalMessage,
      },
      signedMessage: canonicalMessage,
      creatorSignature: signature,
    });

    assert.deepInclude(result, { ok: true, source: "local", persistence: "client" });
  });

  it("rejects ACCEPT when signer does not match stored counterparty", async () => {
    const timestamp = "2026-03-10T12:00:00.000Z";
    const canonicalMessage = buildAcceptMessage({
      handshakeId: buildBaseHandshake().id,
      counterparty: outsider.publicKey,
      timestamp,
    });

    const result = await localAcceptHandshakeVerifier.verifyAcceptHandshake({
      prepared: {
        handshakeId: buildBaseHandshake().id,
        counterpartyWallet: outsider.publicKey,
        timestamp,
        canonicalMessage,
      },
      handshake: buildBaseHandshake("created"),
      signedMessage: canonicalMessage,
      counterpartySignature: outsider.sign(canonicalMessage),
    });

    assert.deepInclude(result, { ok: false, code: "SIGNER_MISMATCH" });
  });

  it("accepts valid APPROVE_MILESTONE input for creator role", async () => {
    const handshake = buildHandshakeWithMilestones("active");
    const milestone = handshake.milestones[0];
    const timestamp = "2026-03-10T12:00:00.000Z";
    const canonicalMessage = buildMilestoneApproveMessage({
      handshakeId: handshake.id,
      milestoneId: milestone.id,
      milestoneIndex: milestone.index,
      milestoneTitle: milestone.title,
      approver: creator.publicKey,
      signerRole: "creator",
      timestamp,
    });

    const result = await localApproveMilestoneVerifier.verifyApproveMilestone({
      prepared: {
        handshakeId: handshake.id,
        milestoneId: milestone.id,
        milestoneIndex: milestone.index,
        milestoneTitle: milestone.title,
        approverWallet: creator.publicKey,
        signerRole: "creator",
        timestamp,
        canonicalMessage,
      },
      handshake,
      milestone,
      signedMessage: canonicalMessage,
      approverSignature: creator.sign(canonicalMessage),
    });

    assert.deepInclude(result, { ok: true, source: "local", persistence: "client" });
  });

  it("rejects duplicate creator approval for a milestone", async () => {
    const handshake = buildHandshakeWithMilestones("active", { creator_approved: true });
    const milestone = handshake.milestones[0];
    const timestamp = "2026-03-10T12:00:00.000Z";
    const canonicalMessage = buildMilestoneApproveMessage({
      handshakeId: handshake.id,
      milestoneId: milestone.id,
      milestoneIndex: milestone.index,
      milestoneTitle: milestone.title,
      approver: creator.publicKey,
      signerRole: "creator",
      timestamp,
    });

    const result = await localApproveMilestoneVerifier.verifyApproveMilestone({
      prepared: {
        handshakeId: handshake.id,
        milestoneId: milestone.id,
        milestoneIndex: milestone.index,
        milestoneTitle: milestone.title,
        approverWallet: creator.publicKey,
        signerRole: "creator",
        timestamp,
        canonicalMessage,
      },
      handshake,
      milestone,
      signedMessage: canonicalMessage,
      approverSignature: creator.sign(canonicalMessage),
    });

    assert.deepInclude(result, { ok: false, code: "DUPLICATE_ACTION" });
  });

  it("accepts valid CANCEL input for a participating signer", async () => {
    const handshake = buildBaseHandshake("active");
    const timestamp = "2026-03-10T12:00:00.000Z";
    const canonicalMessage = buildCancelMessage({
      handshakeId: handshake.id,
      wallet: counterparty.publicKey,
      timestamp,
    });

    const result = await localCancelHandshakeVerifier.verifyCancelHandshake({
      prepared: {
        handshakeId: handshake.id,
        signerWallet: counterparty.publicKey,
        timestamp,
        canonicalMessage,
      },
      handshake,
      signedMessage: canonicalMessage,
      signerSignature: counterparty.sign(canonicalMessage),
    });

    assert.deepInclude(result, { ok: true, source: "local", persistence: "client" });
  });

  it("rejects CANCEL from a wallet outside the handshake", async () => {
    const handshake = buildBaseHandshake("active");
    const timestamp = "2026-03-10T12:00:00.000Z";
    const canonicalMessage = buildCancelMessage({
      handshakeId: handshake.id,
      wallet: outsider.publicKey,
      timestamp,
    });

    const result = await localCancelHandshakeVerifier.verifyCancelHandshake({
      prepared: {
        handshakeId: handshake.id,
        signerWallet: outsider.publicKey,
        timestamp,
        canonicalMessage,
      },
      handshake,
      signedMessage: canonicalMessage,
      signerSignature: outsider.sign(canonicalMessage),
    });

    assert.deepInclude(result, { ok: false, code: "SIGNER_MISMATCH" });
  });
});

describe("handshake action audit helper", () => {
  it("builds stable dedupe keys for the same signed action", async () => {
    const signedMessage = "signed-message-example";

    const a = await buildActionAuditMetadata({
      actionType: "CANCEL",
      handshakeId: "hs-1",
      signerWallet: creator.publicKey,
      signedMessage,
    });

    const b = await buildActionAuditMetadata({
      actionType: "CANCEL",
      handshakeId: "hs-1",
      signerWallet: creator.publicKey,
      signedMessage,
    });

    assert.equal(a.actionHash, b.actionHash);
    assert.equal(a.dedupeKey, b.dedupeKey);
    assert.match(a.actionHash, /^[a-f0-9]{64}$/);
  });
});
