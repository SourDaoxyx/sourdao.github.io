/**
 * SOUR Handshake — Supabase CRUD Store (Phase 1)
 *
 * All handshake data lives in Supabase during Phase 1.
 * Phase 2 will add on-chain escrow; these records will serve as the index.
 */

import { supabase } from "./supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Handshake {
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

export interface Milestone {
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

export interface HandshakeMessage {
  id: string;
  handshake_id: string;
  sender_wallet: string;
  message: string;
  type: "message" | "system";
  created_at: string;
}

export interface HandshakeStats {
  wallet: string;
  total_created: number;
  total_completed: number;
  total_cancelled: number;
  total_expired: number;
  unique_partners: number;
  success_rate: number;
}

export interface HandshakeWithMilestones extends Handshake {
  milestones: Milestone[];
}

// ---------------------------------------------------------------------------
// Handshake CRUD
// ---------------------------------------------------------------------------

/** Create a new handshake + milestones in one go */
export async function createHandshake(params: {
  creatorWallet: string;
  counterpartyWallet: string;
  creatorSignature: string;
  title: string;
  description?: string;
  totalAmount: number;
  deadline: string; // ISO date
  milestones: { title: string; amount: number }[];
}): Promise<Handshake> {
  // Insert handshake
  const { data: hs, error: hsErr } = await supabase
    .from("handshakes")
    .insert({
      creator_wallet: params.creatorWallet,
      counterparty_wallet: params.counterpartyWallet,
      creator_signature: params.creatorSignature,
      title: params.title,
      description: params.description || null,
      total_amount: params.totalAmount,
      deadline: params.deadline,
      status: "created",
    })
    .select()
    .single();

  if (hsErr || !hs) throw new Error(hsErr?.message ?? "Failed to create handshake");

  // Insert milestones
  if (params.milestones.length > 0) {
    const rows = params.milestones.map((m, i) => ({
      handshake_id: hs.id,
      index: i,
      title: m.title,
      amount: m.amount,
    }));
    const { error: mErr } = await supabase.from("handshake_milestones").insert(rows);
    if (mErr) throw new Error(mErr.message);
  }

  // System message
  await addSystemMessage(hs.id, `Handshake created by ${params.creatorWallet.slice(0, 6)}...`);

  return hs as Handshake;
}

/** Counterparty accepts and signs */
export async function acceptHandshake(
  handshakeId: string,
  counterpartySignature: string,
): Promise<void> {
  const { error } = await supabase
    .from("handshakes")
    .update({
      counterparty_signature: counterpartySignature,
      status: "active",
    })
    .eq("id", handshakeId)
    .eq("status", "created");

  if (error) throw new Error(error.message);
  await addSystemMessage(handshakeId, "Agreement accepted — handshake is now active!");
}

/** Approve a milestone (either party) */
export async function approveMilestone(params: {
  milestoneId: string;
  handshakeId: string;
  role: "creator" | "counterparty";
  signature: string;
}): Promise<{ allApproved: boolean }> {
  const approveCol = params.role === "creator" ? "creator_approved" : "counterparty_approved";
  const sigCol = params.role === "creator" ? "creator_approve_sig" : "counterparty_approve_sig";

  // Set this party's approval
  const { error } = await supabase
    .from("handshake_milestones")
    .update({ [approveCol]: true, [sigCol]: params.signature })
    .eq("id", params.milestoneId);

  if (error) throw new Error(error.message);

  // Check if both approved
  const { data: ms } = await supabase
    .from("handshake_milestones")
    .select("*")
    .eq("id", params.milestoneId)
    .single();

  if (ms && ms.creator_approved && ms.counterparty_approved) {
    await supabase
      .from("handshake_milestones")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", params.milestoneId);

    await addSystemMessage(
      params.handshakeId,
      `Milestone "${ms.title}" approved by both parties ✅`,
    );

    // Check if ALL milestones are now approved → complete the handshake
    const { data: allMs } = await supabase
      .from("handshake_milestones")
      .select("status")
      .eq("handshake_id", params.handshakeId);

    const allDone = allMs?.every((m) => m.status === "approved") ?? false;
    if (allDone) {
      await supabase
        .from("handshakes")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", params.handshakeId);

      await addSystemMessage(params.handshakeId, "All milestones completed! Handshake successful 🤝");
    }
    return { allApproved: allDone };
  }

  return { allApproved: false };
}

/** Cancel a handshake (only if created or active, both parties can cancel) */
export async function cancelHandshake(handshakeId: string, wallet: string): Promise<void> {
  const { error } = await supabase
    .from("handshakes")
    .update({ status: "cancelled" })
    .eq("id", handshakeId)
    .or(`status.eq.created,status.eq.active`);

  if (error) throw new Error(error.message);
  await addSystemMessage(handshakeId, `Handshake cancelled by ${wallet.slice(0, 6)}...`);
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/** Fetch a single handshake with milestones */
export async function getHandshake(id: string): Promise<HandshakeWithMilestones | null> {
  const { data: hs } = await supabase
    .from("handshakes")
    .select("*")
    .eq("id", id)
    .single();

  if (!hs) return null;

  const { data: milestones } = await supabase
    .from("handshake_milestones")
    .select("*")
    .eq("handshake_id", id)
    .order("index", { ascending: true });

  return { ...hs, milestones: milestones ?? [] } as HandshakeWithMilestones;
}

/** Fetch all handshakes for a wallet (as creator OR counterparty) */
export async function getHandshakesForWallet(wallet: string): Promise<Handshake[]> {
  const { data } = await supabase
    .from("handshakes")
    .select("*")
    .or(`creator_wallet.eq.${wallet},counterparty_wallet.eq.${wallet}`)
    .order("created_at", { ascending: false });

  return (data ?? []) as Handshake[];
}

/** Fetch messages for a handshake */
export async function getMessages(handshakeId: string): Promise<HandshakeMessage[]> {
  const { data } = await supabase
    .from("handshake_messages")
    .select("*")
    .eq("handshake_id", handshakeId)
    .order("created_at", { ascending: true });

  return (data ?? []) as HandshakeMessage[];
}

/** Fetch stats for a wallet */
export async function getStats(wallet: string): Promise<HandshakeStats | null> {
  const { data } = await supabase
    .from("handshake_stats")
    .select("*")
    .eq("wallet", wallet)
    .single();

  return (data as HandshakeStats) ?? null;
}

/** Fetch stats for a wallet (for Crust Score calculation) */
export async function getHandshakeStatsForCrust(wallet: string): Promise<{
  totalCompleted: number;
  totalHandshakes: number;
  uniquePartners: number;
  successRate: number;
}> {
  const stats = await getStats(wallet);
  if (!stats) {
    return { totalCompleted: 0, totalHandshakes: 0, uniquePartners: 0, successRate: 0 };
  }
  const total = stats.total_completed + stats.total_cancelled + stats.total_expired + stats.total_created;
  return {
    totalCompleted: stats.total_completed,
    totalHandshakes: total,
    uniquePartners: stats.unique_partners,
    successRate: stats.success_rate,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function addSystemMessage(handshakeId: string, message: string) {
  await supabase.from("handshake_messages").insert({
    handshake_id: handshakeId,
    sender_wallet: "system",
    message,
    type: "system",
  });
}

/** Check and expire overdue handshakes */
export async function expireOverdueHandshakes(): Promise<number> {
  const { data, error } = await supabase
    .from("handshakes")
    .update({ status: "expired" })
    .lt("deadline", new Date().toISOString())
    .in("status", ["created", "active"])
    .select("id");

  if (error) return 0;
  return data?.length ?? 0;
}
