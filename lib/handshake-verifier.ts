import type {
  ApprovalMilestoneResult,
  Handshake,
  HandshakeWithMilestones,
  Milestone,
} from "./handshake-store";
import { verifySignature } from "./handshake-signing";

type HandshakeCreateVerifierMode = "local" | "remote" | "auto";

const HANDSHAKE_REMOTE_VERIFIER_URL =
  process.env.NEXT_PUBLIC_HANDSHAKE_REMOTE_VERIFIER_URL?.trim() || "";
const HANDSHAKE_ACCEPT_REMOTE_VERIFIER_URL =
  process.env.NEXT_PUBLIC_HANDSHAKE_ACCEPT_REMOTE_VERIFIER_URL?.trim() || "";
const HANDSHAKE_APPROVE_REMOTE_VERIFIER_URL =
  process.env.NEXT_PUBLIC_HANDSHAKE_APPROVE_REMOTE_VERIFIER_URL?.trim() || "";
const HANDSHAKE_CANCEL_REMOTE_VERIFIER_URL =
  process.env.NEXT_PUBLIC_HANDSHAKE_CANCEL_REMOTE_VERIFIER_URL?.trim() || "";

const HANDSHAKE_CREATE_VERIFIER_MODE = normalizeCreateVerifierMode(
  process.env.NEXT_PUBLIC_HANDSHAKE_CREATE_VERIFIER_MODE,
);
const HANDSHAKE_ACCEPT_VERIFIER_MODE = normalizeCreateVerifierMode(
  process.env.NEXT_PUBLIC_HANDSHAKE_ACCEPT_VERIFIER_MODE,
);
const HANDSHAKE_APPROVE_VERIFIER_MODE = normalizeCreateVerifierMode(
  process.env.NEXT_PUBLIC_HANDSHAKE_APPROVE_VERIFIER_MODE,
);
const HANDSHAKE_CANCEL_VERIFIER_MODE = normalizeCreateVerifierMode(
  process.env.NEXT_PUBLIC_HANDSHAKE_CANCEL_VERIFIER_MODE,
);

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

export interface CreateHandshakeVerificationInput {
  prepared: CreateHandshakeVerificationPayload;
  signedMessage: string;
  creatorSignature: string;
}

export interface AcceptHandshakeVerificationPayload {
  handshakeId: string;
  counterpartyWallet: string;
  timestamp: string;
  canonicalMessage: string;
}

export interface AcceptHandshakeVerificationInput {
  prepared: AcceptHandshakeVerificationPayload;
  handshake: Handshake;
  signedMessage: string;
  counterpartySignature: string;
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

export interface ApproveMilestoneVerificationInput {
  prepared: ApproveMilestoneVerificationPayload;
  handshake: HandshakeWithMilestones;
  milestone: Milestone;
  signedMessage: string;
  approverSignature: string;
}

export interface CancelHandshakeVerificationPayload {
  handshakeId: string;
  signerWallet: string;
  timestamp: string;
  canonicalMessage: string;
}

export interface CancelHandshakeVerificationInput {
  prepared: CancelHandshakeVerificationPayload;
  handshake: Handshake;
  signedMessage: string;
  signerSignature: string;
}

export type HandshakeVerificationResult =
  | {
      ok: true;
      source: "local" | "remote";
      persistence: "client" | "remote";
      handshake?: Handshake;
      approval?: ApprovalMilestoneResult;
    }
  | { ok: false; code: HandshakeVerificationErrorCode; message: string };

export interface HandshakeCreateVerifier {
  verifyCreateHandshake(
    input: CreateHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult>;
}

export interface HandshakeAcceptVerifier {
  verifyAcceptHandshake(
    input: AcceptHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult>;
}

export interface HandshakeApproveMilestoneVerifier {
  verifyApproveMilestone(
    input: ApproveMilestoneVerificationInput,
  ): Promise<HandshakeVerificationResult>;
}

export interface HandshakeCancelVerifier {
  verifyCancelHandshake(
    input: CancelHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult>;
}

interface RemoteCreateHandshakeVerificationResponse {
  ok: boolean;
  code?: HandshakeVerificationErrorCode;
  message?: string;
  persistence?: "client" | "remote";
  handshake?: Handshake;
}

interface RemoteAcceptHandshakeVerificationResponse {
  ok: boolean;
  code?: HandshakeVerificationErrorCode;
  message?: string;
  persistence?: "client" | "remote";
  handshake?: Handshake;
}

interface RemoteApproveMilestoneVerificationResponse {
  ok: boolean;
  code?: HandshakeVerificationErrorCode;
  message?: string;
  persistence?: "client" | "remote";
  approval?: ApprovalMilestoneResult;
}

interface RemoteCancelHandshakeVerificationResponse {
  ok: boolean;
  code?: HandshakeVerificationErrorCode;
  message?: string;
  persistence?: "client" | "remote";
  handshake?: Handshake;
}

interface RemoteVerifierFailureResponse {
  code?: HandshakeVerificationErrorCode;
  message?: string;
}

function normalizeCreateVerifierMode(value?: string): HandshakeCreateVerifierMode {
  switch ((value || "auto").trim().toLowerCase()) {
    case "local":
      return "local";
    case "remote":
      return "remote";
    default:
      return "auto";
  }
}

function isHandshake(value: unknown): value is Handshake {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Handshake>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.creator_wallet === "string" &&
    typeof candidate.counterparty_wallet === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.deadline === "string" &&
    typeof candidate.status === "string"
  );
}

function normalizeRemoteVerifierFailure(
  response: RemoteVerifierFailureResponse | null,
  fallbackMessage: string,
): HandshakeVerificationResult {
  return {
    ok: false,
    code: response?.code ?? "PERSISTENCE_ERROR",
    message: response?.message || fallbackMessage,
  };
}

export const localHandshakeVerifier: HandshakeCreateVerifier = {
  async verifyCreateHandshake(
    input: CreateHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    const { prepared, signedMessage, creatorSignature } = input;

    if (prepared.canonicalMessage !== signedMessage) {
      return {
        ok: false,
        code: "PAYLOAD_MISMATCH",
        message: "Signed message does not match canonical payload",
      };
    }

    if (prepared.creatorWallet === prepared.counterpartyWallet) {
      return {
        ok: false,
        code: "INVALID_INPUT",
        message: "Creator and counterparty must be different wallets",
      };
    }

    const recomputedTotal = prepared.milestones.reduce(
      (sum, milestone) => sum + milestone.amountNumber,
      0,
    );
    if (Math.abs(recomputedTotal - prepared.totalAmount) > 1e-9) {
      return {
        ok: false,
        code: "INVALID_INPUT",
        message: "Total amount does not match milestone sum",
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

    const validSignature = verifySignature(
      signedMessage,
      creatorSignature,
      prepared.creatorWallet,
    );

    if (!validSignature) {
      return {
        ok: false,
        code: "INVALID_SIGNATURE",
        message: "Signature verification failed for creator wallet",
      };
    }

    return {
      ok: true,
      source: "local",
      persistence: "client",
    };
  },
};

export const localAcceptHandshakeVerifier: HandshakeAcceptVerifier = {
  async verifyAcceptHandshake(
    input: AcceptHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    const { prepared, handshake, signedMessage, counterpartySignature } = input;

    if (prepared.canonicalMessage !== signedMessage) {
      return {
        ok: false,
        code: "PAYLOAD_MISMATCH",
        message: "Signed message does not match canonical accept payload",
      };
    }

    if (handshake.id !== prepared.handshakeId) {
      return {
        ok: false,
        code: "INVALID_INPUT",
        message: "Accept payload handshake ID does not match stored handshake",
      };
    }

    if (handshake.status !== "created") {
      return {
        ok: false,
        code: "INVALID_STATE",
        message: "Handshake can only be accepted from created state",
      };
    }

    if (handshake.counterparty_wallet !== prepared.counterpartyWallet) {
      return {
        ok: false,
        code: "SIGNER_MISMATCH",
        message: "Accept signer does not match stored counterparty",
      };
    }

    if (handshake.counterparty_signature) {
      return {
        ok: false,
        code: "DUPLICATE_ACTION",
        message: "Handshake has already been accepted",
      };
    }

    const validSignature = verifySignature(
      signedMessage,
      counterpartySignature,
      prepared.counterpartyWallet,
    );

    if (!validSignature) {
      return {
        ok: false,
        code: "INVALID_SIGNATURE",
        message: "Signature verification failed for counterparty wallet",
      };
    }

    return {
      ok: true,
      source: "local",
      persistence: "client",
    };
  },
};

export const remoteHandshakeVerifier: HandshakeCreateVerifier = {
  async verifyCreateHandshake(
    input: CreateHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    if (!HANDSHAKE_REMOTE_VERIFIER_URL) {
      return normalizeRemoteVerifierFailure(
        null,
        "Remote create verifier URL is not configured",
      );
    }

    let response: Response;
    try {
      response = await fetch(HANDSHAKE_REMOTE_VERIFIER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "CREATE",
          payloadVersion: 1,
          signedMessage: input.signedMessage,
          creatorSignature: input.creatorSignature,
          prepared: input.prepared,
        }),
      });
    } catch (error) {
      return normalizeRemoteVerifierFailure(
        null,
        error instanceof Error ? error.message : "Remote verifier request failed",
      );
    }

    let payload: RemoteCreateHandshakeVerificationResponse | null = null;
    try {
      payload = (await response.json()) as RemoteCreateHandshakeVerificationResponse;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.ok) {
      return normalizeRemoteVerifierFailure(
        payload,
        `Remote verifier rejected create request (${response.status})`,
      );
    }

    if (payload.persistence === "remote") {
      if (!isHandshake(payload.handshake)) {
        return normalizeRemoteVerifierFailure(
          null,
          "Remote verifier indicated remote persistence without returning a handshake",
        );
      }

      return {
        ok: true,
        source: "remote",
        persistence: "remote",
        handshake: payload.handshake,
      };
    }

    return {
      ok: true,
      source: "remote",
      persistence: "client",
    };
  },
};

export const remoteAcceptHandshakeVerifier: HandshakeAcceptVerifier = {
  async verifyAcceptHandshake(
    input: AcceptHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    if (!HANDSHAKE_ACCEPT_REMOTE_VERIFIER_URL) {
      return normalizeRemoteVerifierFailure(
        null,
        "Remote accept verifier URL is not configured",
      );
    }

    let response: Response;
    try {
      response = await fetch(HANDSHAKE_ACCEPT_REMOTE_VERIFIER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "ACCEPT",
          payloadVersion: 1,
          signedMessage: input.signedMessage,
          counterpartySignature: input.counterpartySignature,
          prepared: input.prepared,
        }),
      });
    } catch (error) {
      return normalizeRemoteVerifierFailure(
        null,
        error instanceof Error ? error.message : "Remote accept verifier request failed",
      );
    }

    let payload: RemoteAcceptHandshakeVerificationResponse | null = null;
    try {
      payload = (await response.json()) as RemoteAcceptHandshakeVerificationResponse;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.ok) {
      return normalizeRemoteVerifierFailure(
        payload,
        `Remote verifier rejected accept request (${response.status})`,
      );
    }

    if (payload.persistence === "remote") {
      if (!isHandshake(payload.handshake)) {
        return normalizeRemoteVerifierFailure(
          null,
          "Remote verifier indicated remote persistence without returning a handshake",
        );
      }

      return {
        ok: true,
        source: "remote",
        persistence: "remote",
        handshake: payload.handshake,
      };
    }

    return {
      ok: true,
      source: "remote",
      persistence: "client",
    };
  },
};

export const localApproveMilestoneVerifier: HandshakeApproveMilestoneVerifier = {
  async verifyApproveMilestone(
    input: ApproveMilestoneVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    const { prepared, handshake, milestone, signedMessage, approverSignature } = input;

    if (prepared.canonicalMessage !== signedMessage) {
      return {
        ok: false,
        code: "PAYLOAD_MISMATCH",
        message: "Signed message does not match canonical approval payload",
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

    if (handshake.status !== "active") {
      return {
        ok: false,
        code: "INVALID_STATE",
        message: "Milestones can only be approved while handshake is active",
      };
    }

    if (milestone.status === "approved" || (milestone.creator_approved && milestone.counterparty_approved)) {
      return {
        ok: false,
        code: "DUPLICATE_ACTION",
        message: "Milestone has already been fully approved",
      };
    }

    if (milestone.index !== prepared.milestoneIndex || milestone.title !== prepared.milestoneTitle) {
      return {
        ok: false,
        code: "PAYLOAD_MISMATCH",
        message: "Approval payload does not match milestone snapshot",
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

    const validSignature = verifySignature(
      signedMessage,
      approverSignature,
      prepared.approverWallet,
    );

    if (!validSignature) {
      return {
        ok: false,
        code: "INVALID_SIGNATURE",
        message: "Signature verification failed for milestone approver",
      };
    }

    return {
      ok: true,
      source: "local",
      persistence: "client",
    };
  },
};

export const remoteApproveMilestoneVerifier: HandshakeApproveMilestoneVerifier = {
  async verifyApproveMilestone(
    input: ApproveMilestoneVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    if (!HANDSHAKE_APPROVE_REMOTE_VERIFIER_URL) {
      return normalizeRemoteVerifierFailure(
        null,
        "Remote milestone approval verifier URL is not configured",
      );
    }

    let response: Response;
    try {
      response = await fetch(HANDSHAKE_APPROVE_REMOTE_VERIFIER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "APPROVE_MILESTONE",
          payloadVersion: 1,
          signedMessage: input.signedMessage,
          approverSignature: input.approverSignature,
          prepared: input.prepared,
        }),
      });
    } catch (error) {
      return normalizeRemoteVerifierFailure(
        null,
        error instanceof Error ? error.message : "Remote milestone approval verifier request failed",
      );
    }

    let payload: RemoteApproveMilestoneVerificationResponse | null = null;
    try {
      payload = (await response.json()) as RemoteApproveMilestoneVerificationResponse;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.ok) {
      return normalizeRemoteVerifierFailure(
        payload,
        `Remote verifier rejected milestone approval request (${response.status})`,
      );
    }

    return {
      ok: true,
      source: "remote",
      persistence: payload.persistence ?? "client",
      approval: payload.approval,
    };
  },
};

export const localCancelHandshakeVerifier: HandshakeCancelVerifier = {
  async verifyCancelHandshake(
    input: CancelHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    const { prepared, handshake, signedMessage, signerSignature } = input;

    if (prepared.canonicalMessage !== signedMessage) {
      return {
        ok: false,
        code: "PAYLOAD_MISMATCH",
        message: "Signed message does not match canonical cancel payload",
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

    if (
      prepared.signerWallet !== handshake.creator_wallet &&
      prepared.signerWallet !== handshake.counterparty_wallet
    ) {
      return {
        ok: false,
        code: "SIGNER_MISMATCH",
        message: "Cancel signer does not belong to this handshake",
      };
    }

    const validSignature = verifySignature(
      signedMessage,
      signerSignature,
      prepared.signerWallet,
    );

    if (!validSignature) {
      return {
        ok: false,
        code: "INVALID_SIGNATURE",
        message: "Signature verification failed for cancel signer",
      };
    }

    return {
      ok: true,
      source: "local",
      persistence: "client",
    };
  },
};

export const remoteCancelHandshakeVerifier: HandshakeCancelVerifier = {
  async verifyCancelHandshake(
    input: CancelHandshakeVerificationInput,
  ): Promise<HandshakeVerificationResult> {
    if (!HANDSHAKE_CANCEL_REMOTE_VERIFIER_URL) {
      return normalizeRemoteVerifierFailure(
        null,
        "Remote cancel verifier URL is not configured",
      );
    }

    let response: Response;
    try {
      response = await fetch(HANDSHAKE_CANCEL_REMOTE_VERIFIER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "CANCEL",
          payloadVersion: 1,
          signedMessage: input.signedMessage,
          signerSignature: input.signerSignature,
          prepared: input.prepared,
        }),
      });
    } catch (error) {
      return normalizeRemoteVerifierFailure(
        null,
        error instanceof Error ? error.message : "Remote cancel verifier request failed",
      );
    }

    let payload: RemoteCancelHandshakeVerificationResponse | null = null;
    try {
      payload = (await response.json()) as RemoteCancelHandshakeVerificationResponse;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.ok) {
      return normalizeRemoteVerifierFailure(
        payload,
        `Remote verifier rejected cancel request (${response.status})`,
      );
    }

    if (payload.persistence === "remote") {
      if (!isHandshake(payload.handshake)) {
        return normalizeRemoteVerifierFailure(
          null,
          "Remote verifier indicated remote persistence without returning a handshake",
        );
      }

      return {
        ok: true,
        source: "remote",
        persistence: "remote",
        handshake: payload.handshake,
      };
    }

    return {
      ok: true,
      source: "remote",
      persistence: "client",
    };
  },
};

export function getCreateHandshakeVerifier(): HandshakeCreateVerifier {
  if (HANDSHAKE_CREATE_VERIFIER_MODE === "local") {
    return localHandshakeVerifier;
  }

  if (HANDSHAKE_CREATE_VERIFIER_MODE === "remote") {
    return remoteHandshakeVerifier;
  }

  if (HANDSHAKE_REMOTE_VERIFIER_URL) {
    return {
      async verifyCreateHandshake(
        input: CreateHandshakeVerificationInput,
      ): Promise<HandshakeVerificationResult> {
        const remoteResult = await remoteHandshakeVerifier.verifyCreateHandshake(input);
        if (remoteResult.ok) {
          return remoteResult;
        }

        return localHandshakeVerifier.verifyCreateHandshake(input);
      },
    };
  }

  return localHandshakeVerifier;
}

export function getAcceptHandshakeVerifier(): HandshakeAcceptVerifier {
  if (HANDSHAKE_ACCEPT_VERIFIER_MODE === "local") {
    return localAcceptHandshakeVerifier;
  }

  if (HANDSHAKE_ACCEPT_VERIFIER_MODE === "remote") {
    return remoteAcceptHandshakeVerifier;
  }

  if (HANDSHAKE_ACCEPT_REMOTE_VERIFIER_URL) {
    return {
      async verifyAcceptHandshake(
        input: AcceptHandshakeVerificationInput,
      ): Promise<HandshakeVerificationResult> {
        const remoteResult = await remoteAcceptHandshakeVerifier.verifyAcceptHandshake(input);
        if (remoteResult.ok) {
          return remoteResult;
        }

        return localAcceptHandshakeVerifier.verifyAcceptHandshake(input);
      },
    };
  }

  return localAcceptHandshakeVerifier;
}

export function getApproveMilestoneVerifier(): HandshakeApproveMilestoneVerifier {
  if (HANDSHAKE_APPROVE_VERIFIER_MODE === "local") {
    return localApproveMilestoneVerifier;
  }

  if (HANDSHAKE_APPROVE_VERIFIER_MODE === "remote") {
    return remoteApproveMilestoneVerifier;
  }

  if (HANDSHAKE_APPROVE_REMOTE_VERIFIER_URL) {
    return {
      async verifyApproveMilestone(
        input: ApproveMilestoneVerificationInput,
      ): Promise<HandshakeVerificationResult> {
        const remoteResult = await remoteApproveMilestoneVerifier.verifyApproveMilestone(input);
        if (remoteResult.ok) {
          return remoteResult;
        }

        return localApproveMilestoneVerifier.verifyApproveMilestone(input);
      },
    };
  }

  return localApproveMilestoneVerifier;
}

export function getCancelHandshakeVerifier(): HandshakeCancelVerifier {
  if (HANDSHAKE_CANCEL_VERIFIER_MODE === "local") {
    return localCancelHandshakeVerifier;
  }

  if (HANDSHAKE_CANCEL_VERIFIER_MODE === "remote") {
    return remoteCancelHandshakeVerifier;
  }

  if (HANDSHAKE_CANCEL_REMOTE_VERIFIER_URL) {
    return {
      async verifyCancelHandshake(
        input: CancelHandshakeVerificationInput,
      ): Promise<HandshakeVerificationResult> {
        const remoteResult = await remoteCancelHandshakeVerifier.verifyCancelHandshake(input);
        if (remoteResult.ok) {
          return remoteResult;
        }

        return localCancelHandshakeVerifier.verifyCancelHandshake(input);
      },
    };
  }

  return localCancelHandshakeVerifier;
}
