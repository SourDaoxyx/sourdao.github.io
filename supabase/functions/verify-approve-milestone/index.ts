// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2.98.0";

import {
  CORS_HEADERS,
  type ApproveMilestoneRequest,
  type ApproveMilestoneResponse,
  validateApproveMilestoneRequest,
} from "../_shared/approve-contract.ts";
import {
  buildActionAuditMetadata,
  findLoggedActionByDedupeKey,
  writeActionAuditLog,
} from "../_shared/action-audit.ts";

function json(
  body: ApproveMilestoneResponse | { ok: false; code: string; message: string },
  status = 200,
) {
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

  let body: ApproveMilestoneRequest;
  try {
    body = (await request.json()) as ApproveMilestoneRequest;
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

    const { prepared, approverSignature } = body;
    const approveCol =
      prepared.signerRole === "creator" ? "creator_approved" : "counterparty_approved";
    const sigCol =
      prepared.signerRole === "creator" ? "creator_approve_sig" : "counterparty_approve_sig";

    const [{ data: handshake, error: handshakeError }, { data: milestone, error: milestoneError }] =
      await Promise.all([
        supabase.from("handshakes").select("*").eq("id", prepared.handshakeId).maybeSingle(),
        supabase
          .from("handshake_milestones")
          .select("*")
          .eq("id", prepared.milestoneId)
          .eq("handshake_id", prepared.handshakeId)
          .maybeSingle(),
      ]);

    if (handshakeError || milestoneError) {
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: handshakeError?.message || milestoneError?.message || "Failed to load milestone state",
        },
        500,
      );
    }

    const validationError = await validateApproveMilestoneRequest(body, handshake, milestone);
    if (validationError) {
      await writeActionAuditLog(supabase, {
        handshakeId: prepared.handshakeId,
        actionType: "APPROVE_MILESTONE",
        signerWallet: prepared.approverWallet,
        milestoneId: prepared.milestoneId,
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
      actionType: "APPROVE_MILESTONE",
      handshakeId: prepared.handshakeId,
      signerWallet: prepared.approverWallet,
      milestoneId: prepared.milestoneId,
      signedMessage: body.signedMessage,
    });
    const existingAction = await findLoggedActionByDedupeKey(supabase, auditMetadata.dedupeKey);
    if (existingAction) {
      return json(
        {
          ok: false,
          code: "DUPLICATE_ACTION",
          message: "Milestone approval action has already been processed",
        },
        409,
      );
    }

    const { data: updatedMilestone, error: updateError } = await supabase
      .from("handshake_milestones")
      .update({ [approveCol]: true, [sigCol]: approverSignature })
      .eq("id", prepared.milestoneId)
      .select("*")
      .single();

    if (updateError || !updatedMilestone) {
      return json(
        {
          ok: false,
          code: "PERSISTENCE_ERROR",
          message: updateError?.message || "Failed to approve milestone",
        },
        500,
      );
    }

    let allApproved = false;

    if (updatedMilestone.creator_approved && updatedMilestone.counterparty_approved) {
      const { error: finalizeMilestoneError } = await supabase
        .from("handshake_milestones")
        .update({ status: "approved", approved_at: new Date().toISOString() })
        .eq("id", prepared.milestoneId);

      if (finalizeMilestoneError) {
        return json(
          {
            ok: false,
            code: "PERSISTENCE_ERROR",
            message: finalizeMilestoneError.message,
          },
          500,
        );
      }

      const { error: milestoneMessageError } = await supabase.from("handshake_messages").insert({
        handshake_id: prepared.handshakeId,
        sender_wallet: "system",
        message: `Milestone "${updatedMilestone.title}" approved by both parties ✅`,
        type: "system",
      });

      if (milestoneMessageError) {
        return json(
          {
            ok: false,
            code: "PERSISTENCE_ERROR",
            message: milestoneMessageError.message,
          },
          500,
        );
      }

      const { data: allMilestones, error: allMilestonesError } = await supabase
        .from("handshake_milestones")
        .select("status")
        .eq("handshake_id", prepared.handshakeId);

      if (allMilestonesError) {
        return json(
          {
            ok: false,
            code: "PERSISTENCE_ERROR",
            message: allMilestonesError.message,
          },
          500,
        );
      }

      allApproved = allMilestones?.every((item) => item.status === "approved") ?? false;
      if (allApproved) {
        const { error: completeHandshakeError } = await supabase
          .from("handshakes")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", prepared.handshakeId)
          .eq("status", "active");

        if (completeHandshakeError) {
          return json(
            {
              ok: false,
              code: "PERSISTENCE_ERROR",
              message: completeHandshakeError.message,
            },
            500,
          );
        }

        const { error: completionMessageError } = await supabase.from("handshake_messages").insert({
          handshake_id: prepared.handshakeId,
          sender_wallet: "system",
          message: "All milestones completed! Handshake successful 🤝",
          type: "system",
        });

        if (completionMessageError) {
          return json(
            {
              ok: false,
              code: "PERSISTENCE_ERROR",
              message: completionMessageError.message,
            },
            500,
          );
        }
      }
    }

    await writeActionAuditLog(supabase, {
      handshakeId: prepared.handshakeId,
      actionType: "APPROVE_MILESTONE",
      signerWallet: prepared.approverWallet,
      milestoneId: prepared.milestoneId,
      payloadVersion: body.payloadVersion,
      signedMessage: body.signedMessage,
      status: "accepted",
      requestPayload: body,
    });

    return json({
      ok: true,
      persistence: "remote",
      approval: { allApproved },
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
