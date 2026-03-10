// @ts-nocheck
export interface ActionAuditRecordInput {
  handshakeId: string;
  actionType: "CREATE" | "ACCEPT" | "APPROVE_MILESTONE" | "CANCEL";
  signerWallet: string;
  milestoneId?: string;
  payloadVersion: number;
  signedMessage: string;
  status: "accepted" | "rejected";
  errorCode?: string;
  errorMessage?: string;
  requestPayload?: unknown;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function buildActionAuditMetadata(params: {
  actionType: ActionAuditRecordInput["actionType"];
  handshakeId: string;
  signerWallet: string;
  signedMessage: string;
  milestoneId?: string;
}): Promise<{ actionHash: string; dedupeKey: string }> {
  const actionHash = await sha256Hex(params.signedMessage);
  const dedupeKey = [
    params.actionType,
    params.handshakeId,
    params.milestoneId || "-",
    params.signerWallet,
    actionHash,
  ].join(":");

  return { actionHash, dedupeKey };
}

export async function findLoggedActionByDedupeKey(supabase: unknown, dedupeKey: string) {
  try {
    const { data, error } = await supabase
      .from("handshake_action_logs")
      .select("id, status")
      .eq("dedupe_key", dedupeKey)
      .maybeSingle();

    if (error) {
      console.warn("[handshake-audit] lookup failed", error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.warn("[handshake-audit] lookup exception", error);
    return null;
  }
}

export async function writeActionAuditLog(
  supabase: unknown,
  input: ActionAuditRecordInput,
): Promise<{ actionHash: string; dedupeKey: string }> {
  const { actionHash, dedupeKey } = await buildActionAuditMetadata({
    actionType: input.actionType,
    handshakeId: input.handshakeId,
    signerWallet: input.signerWallet,
    signedMessage: input.signedMessage,
    milestoneId: input.milestoneId,
  });

  try {
    const { error } = await supabase.from("handshake_action_logs").insert({
      handshake_id: input.handshakeId,
      action_type: input.actionType,
      signer_wallet: input.signerWallet,
      milestone_id: input.milestoneId || null,
      payload_version: input.payloadVersion,
      action_hash: actionHash,
      dedupe_key: dedupeKey,
      status: input.status,
      verifier_source: "edge-function",
      persistence_mode: "remote",
      error_code: input.errorCode || null,
      error_message: input.errorMessage || null,
      request_payload: input.requestPayload ?? null,
    });

    if (error) {
      console.warn("[handshake-audit] insert failed", error.message);
    }
  } catch (error) {
    console.warn("[handshake-audit] insert exception", error);
  }

  return { actionHash, dedupeKey };
}
