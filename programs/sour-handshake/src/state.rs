// ============================================================================
// State — Account structures stored on-chain
// ============================================================================

use anchor_lang::prelude::*;

// ---------------------------------------------------------------------------
// Handshake Account — one per escrow deal
// ---------------------------------------------------------------------------
#[account]
#[derive(InitSpace)]
pub struct Handshake {
    /// Unique sequential ID for this handshake
    pub id: u64,

    /// Baker A — the one who creates and funds the escrow
    pub creator: Pubkey,

    /// Baker B — the one who accepts and delivers work
    pub worker: Pubkey,

    /// Amount of $SOUR escrowed (in token smallest units)
    pub amount: u64,

    /// Description of the work agreement
    #[max_len(280)]
    pub description: String,

    /// Current status of the handshake
    pub status: HandshakeStatus,

    /// Unix timestamp when the handshake was created
    pub created_at: i64,

    /// Unix timestamp when work must be delivered by
    pub deadline_ts: i64,

    /// Unix timestamp when the handshake was accepted (0 if not yet)
    pub accepted_at: i64,

    /// Unix timestamp when delivery was marked (0 if not yet)
    pub delivered_at: i64,

    /// Unix timestamp when approved/cancelled/disputed (0 if not yet)
    pub resolved_at: i64,

    /// Who raised the dispute (Pubkey::default if none)
    pub disputed_by: Pubkey,

    /// PDA bump seed for vault authority
    pub vault_bump: u8,

    /// Bump seed for the handshake PDA itself
    pub bump: u8,
}

impl Handshake {
    /// Total size: 8 discriminator + fields
    /// We use InitSpace derive, but keep this for reference
    pub const SEED_PREFIX: &'static [u8] = b"handshake";
}

// ---------------------------------------------------------------------------
// Handshake Status Enum
// ---------------------------------------------------------------------------
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, InitSpace)]
pub enum HandshakeStatus {
    /// Created by Baker A, waiting for Baker B to accept
    Created,
    /// Baker B accepted, work in progress
    Accepted,
    /// Baker B marked as delivered, waiting for approval
    Delivered,
    /// Baker A approved — funds released (terminal state)
    Approved,
    /// Disputed by either party
    Disputed,
    /// Cancelled by creator before acceptance (terminal state)
    Cancelled,
    /// Dispute resolved by authority (terminal state)
    Resolved,
    /// Expired — deadline passed without delivery (terminal state)
    Expired,
}

// ---------------------------------------------------------------------------
// Protocol Config — global settings (one per program)
// ---------------------------------------------------------------------------
#[account]
#[derive(InitSpace)]
pub struct ProtocolConfig {
    /// Authority who can update config and resolve disputes
    pub authority: Pubkey,

    /// The $SOUR token mint address
    pub sour_mint: Pubkey,

    /// Keepers pool token account (receives 30% of Pinch)
    pub keepers_pool: Pubkey,

    /// Commons treasury token account (receives 20% of Pinch)
    pub commons_treasury: Pubkey,

    /// Buyback+LP Treasury token account (receives 50% of Pinch for batched buyback+LP)
    pub buyback_treasury: Pubkey,

    /// Total Pinch fee in basis points (200 = 2.00%)
    pub pinch_bps: u16,

    /// Share of Pinch to Treasury (buyback+LP), in bps of the fee (5000 = 50%)
    pub treasury_share_bps: u16,

    /// Share of Pinch to Keepers, in bps of the fee (3000 = 30%)
    pub keepers_share_bps: u16,

    /// Share of Pinch to Commons, in bps of the fee (2000 = 20%)
    pub commons_share_bps: u16,

    /// Running counter for handshake IDs
    pub handshake_count: u64,

    /// Total $SOUR sent to buyback+LP treasury
    pub total_to_treasury: u64,

    /// Total $SOUR distributed to keepers
    pub total_to_keepers: u64,

    /// Total $SOUR distributed to commons
    pub total_to_commons: u64,

    /// Total number of completed handshakes
    pub total_completed: u64,

    /// Total number of disputed handshakes
    pub total_disputed: u64,

    /// Bump for this PDA
    pub bump: u8,
}

impl ProtocolConfig {
    pub const SEED_PREFIX: &'static [u8] = b"config";
}
