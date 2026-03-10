// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2.98.0";

import {
  CORS_HEADERS,
  type CancelHandshakeRequest,
  type CancelHandshakeResponse,
  validateCancelRequest,
} from "../_shared/cancel-contract.ts";
import {
  buildActionAuditMetadata,
  findLoggedActionByDedupeKey,
  writeActionAuditLog,
} from "../_shared/action-audit.ts";

function json(body: CancelHandshakeResponse | { ok: false; code: string; message: string }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return json({ ok: false, code: "INVALID_INPUT", message: "Method not allowed" }, 405);
  }

  let body: CancelHandshakeRequest;
  try {
    body = (await request.json()) as CancelHandshakeRequest;
  } catch {
    return json({ ok: false, code: "INVALID_INPUT", message: "Invalid JSON body" }, 400);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: "Supabase service role secrets are not configured",
        },
        500,
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { prepared } = body;

    const { data: handshake, error: handshakeLookupError } = await supabase
      .from("handshakes")
      .select("*")
      .eq("id", prepared.handshakeId)
      .maybeSingle();

    if (handshakeLookupError) {
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: handshakeLookupError.message,
        },
        500,
      );
    }

    const validationError = await validateCancelRequest(body, handshake);
    if (validationError) {
      await writeActionAuditLog(supabase, {
        handshakeId: prepared.handshakeId,
        actionType: "CANCEL",
        signerWallet: prepared.signerWallet,
        payloadVersion: body.payloadVersion,
        signedMessage: body.signedMessage,
        status: "rejected",
        errorCode: validationError.code,
        errorMessage: validationError.message,
        requestPayload: body,
      });
      const status = validationError.code === "DUPLICATE_ACTION" ? 409 : 400;
      return json(validationError, status);
    }

    const auditMetadata = await buildActionAuditMetadata({
      actionType: "CANCEL",
      handshakeId: prepared.handshakeId,
      signerWallet: prepared.signerWallet,
      signedMessage: body.signedMessage,
    });
    const existingAction = await findLoggedActionByDedupeKey(supabase, auditMetadata.dedupeKey);
    if (existingAction) {
      return json(
        {
          ok: false,
          code: "DUPLICATE_ACTION",
          message: "Cancel action has already been processed",
        },
        409,
      );
    }

    const { data: updatedHandshake, error: cancelError } = await supabase
      .from("handshakes")
      .update({ status: "cancelled" })
      .eq("id", prepared.handshakeId)
      .or("status.eq.created,status.eq.active")
      .select()
      .single();

    if (cancelError || !updatedHandshake) {
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: cancelError?.message || "Failed to cancel handshake",
        },
        500,
      );
    }

    const { error: messageError } = await supabase.from("handshake_messages").insert({
      handshake_id: prepared.handshakeId,
      sender_wallet: "system",
      message: `Handshake cancelled by ${prepared.signerWallet.slice(0, 6)}...`,
      type: "system",
    });

    if (messageError) {
      await supabase
        .from("handshakes")
        .update({ status: handshake?.status ?? "created" })
        .eq("id", prepared.handshakeId)
        .eq("status", "cancelled");

      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: messageError.message,
        },
        500,
      );
    }

    await writeActionAuditLog(supabase, {
      handshakeId: prepared.handshakeId,
      actionType: "CANCEL",
      signerWallet: prepared.signerWallet,
      payloadVersion: body.payloadVersion,
      signedMessage: body.signedMessage,
      status: "accepted",
      requestPayload: body,
    });

    return json({
      ok: true,
      persistence: "remote",
      handshake: updatedHandshake,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        code: "PERSISTENCE_ERROR",
        message: error instanceof Error ? error.message : "Unknown verifier error",
      },
      500,
    );
  }
});
