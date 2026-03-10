// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2.98.0";

import {
  CORS_HEADERS,
  type CreateHandshakeRequest,
  type CreateHandshakeResponse,
  validateCreateRequest,
} from "../_shared/create-contract.ts";
import {
  buildActionAuditMetadata,
  findLoggedActionByDedupeKey,
  writeActionAuditLog,
} from "../_shared/action-audit.ts";

const SOUR_TOKEN_MINT = "2spRmiYSWyqFB5XhqnbSkAKH6b2sKpchjVgzYajmpump";

function json(body: CreateHandshakeResponse | { ok: false; code: string; message: string }, status = 200) {
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

  let body: CreateHandshakeRequest;
  try {
    body = (await request.json()) as CreateHandshakeRequest;
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

    const validationError = await validateCreateRequest(body);
    if (validationError) {
      await writeActionAuditLog(supabase, {
        handshakeId: body.prepared?.handshakeId || "unknown",
        actionType: "CREATE",
        signerWallet: body.prepared?.creatorWallet || "unknown",
        payloadVersion: body.payloadVersion || 1,
        signedMessage: body.signedMessage || "",
        status: "rejected",
        errorCode: validationError.code,
        errorMessage: validationError.message,
        requestPayload: body,
      });
      return json(validationError, 400);
    }

    const { prepared, creatorSignature } = body;

    const auditMetadata = await buildActionAuditMetadata({
      actionType: "CREATE",
      handshakeId: prepared.handshakeId,
      signerWallet: prepared.creatorWallet,
      signedMessage: body.signedMessage,
    });
    const existingAction = await findLoggedActionByDedupeKey(supabase, auditMetadata.dedupeKey);
    if (existingAction) {
      return json(
        {
          ok: false,
          code: "DUPLICATE_ACTION",
          message: "Create action has already been processed",
        },
        409,
      );
    }

    const { data: existingHandshake, error: existingError } = await supabase
      .from("handshakes")
      .select("id")
      .eq("id", prepared.handshakeId)
      .maybeSingle();

    if (existingError) {
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: existingError.message,
        },
        500,
      );
    }

    if (existingHandshake) {
      await writeActionAuditLog(supabase, {
        handshakeId: prepared.handshakeId,
        actionType: "CREATE",
        signerWallet: prepared.creatorWallet,
        payloadVersion: body.payloadVersion,
        signedMessage: body.signedMessage,
        status: "rejected",
        errorCode: "DUPLICATE_ACTION",
        errorMessage: "Handshake ID already exists",
        requestPayload: body,
      });
      return json(
        {
          ok: false,
          code: "DUPLICATE_ACTION",
          message: "Handshake ID already exists",
        },
        409,
      );
    }

    const { data: handshake, error: handshakeError } = await supabase
      .from("handshakes")
      .insert({
        id: prepared.handshakeId,
        creator_wallet: prepared.creatorWallet,
        counterparty_wallet: prepared.counterpartyWallet,
        creator_signature: creatorSignature,
        title: prepared.title,
        description: prepared.description || null,
        token_mint: SOUR_TOKEN_MINT,
        total_amount: prepared.totalAmount,
        deadline: prepared.deadline,
        status: "created",
      })
      .select()
      .single();

    if (handshakeError || !handshake) {
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: handshakeError?.message || "Failed to create handshake",
        },
        500,
      );
    }

    const milestoneRows = prepared.milestones.map((milestone) => ({
      handshake_id: handshake.id,
      index: milestone.index,
      title: milestone.title,
      amount: milestone.amountNumber,
    }));

    const { error: milestoneError } = await supabase
      .from("handshake_milestones")
      .insert(milestoneRows);

    if (milestoneError) {
      await supabase.from("handshakes").delete().eq("id", handshake.id);
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: milestoneError.message,
        },
        500,
      );
    }

    const { error: messageError } = await supabase.from("handshake_messages").insert({
      handshake_id: handshake.id,
      sender_wallet: "system",
      message: `Handshake created by ${prepared.creatorWallet.slice(0, 6)}...`,
      type: "system",
    });

    if (messageError) {
      await supabase.from("handshake_milestones").delete().eq("handshake_id", handshake.id);
      await supabase.from("handshakes").delete().eq("id", handshake.id);
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
      actionType: "CREATE",
      signerWallet: prepared.creatorWallet,
      payloadVersion: body.payloadVersion,
      signedMessage: body.signedMessage,
      status: "accepted",
      requestPayload: body,
    });

    return json({
      ok: true,
      persistence: "remote",
      handshake,
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
