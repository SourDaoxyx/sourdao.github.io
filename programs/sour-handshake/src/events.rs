// ============================================================================
// Events — emitted for indexing and frontend consumption
// ============================================================================

use anchor_lang::prelude::*;

#[event]
pub struct HandshakeCreated {
    pub handshake_id: u64,
    pub creator: Pubkey,
    pub worker: Pubkey,
    pub amount: u64,
    pub deadline_ts: i64,
    pub description: String,
}

#[event]
pub struct HandshakeAccepted {
    pub handshake_id: u64,
    pub worker: Pubkey,
    pub accepted_at: i64,
}

#[event]
pub struct WorkDelivered {
    pub handshake_id: u64,
    pub worker: Pubkey,
    pub delivered_at: i64,
}

#[event]
pub struct HandshakeApproved {
    pub handshake_id: u64,
    pub creator: Pubkey,
    pub worker: Pubkey,
    pub amount: u64,
    pub pinch_total: u64,
    pub burned: u64,
    pub to_keepers: u64,
    pub to_commons: u64,
}

#[event]
pub struct HandshakeCancelled {
    pub handshake_id: u64,
    pub creator: Pubkey,
    pub cancelled_at: i64,
}

#[event]
pub struct HandshakeDisputed {
    pub handshake_id: u64,
    pub disputed_by: Pubkey,
    pub disputed_at: i64,
}

#[event]
pub struct DisputeResolved {
    pub handshake_id: u64,
    pub ruling: u8,   // 0 = refund, 1 = pay worker
    pub resolved_at: i64,
}

#[event]
pub struct ConfigInitialized {
    pub authority: Pubkey,
    pub sour_mint: Pubkey,
    pub pinch_bps: u16,
}
