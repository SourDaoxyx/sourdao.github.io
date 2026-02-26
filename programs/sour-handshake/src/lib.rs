// ============================================================================
// SOUR Protocol — The Handshake
// P2P Escrow Smart Contract on Solana (Anchor Framework)
// ============================================================================
//
// Flow:
//   Baker A creates a handshake (escrows $SOUR into PDA vault)
//   Baker B accepts the handshake
//   Baker B delivers work
//   Baker A approves → funds released, Pinch fee applied:
//     - 50% of fee sent to Treasury PDA (batched → buyback + LP)
//     - 30% of fee to Keepers pool
//     - 20% of fee to Commons treasury
//
//   OR: either party disputes → enters dispute resolution
//   OR: creator cancels (only before acceptance)
// ============================================================================

use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;
pub mod events;

use instructions::*;

declare_id!("HUAq4NFymfn4hNvs7RMNCC5uFEoRctkWDWCA9G7prxeF");

#[program]
pub mod sour_handshake {
    use super::*;

    /// Create a new handshake — escrow $SOUR tokens into a PDA vault.
    /// Only the initiator (Baker A) can call this.
    pub fn create_handshake(
        ctx: Context<CreateHandshake>,
        description: String,
        amount: u64,
        deadline_ts: i64,
    ) -> Result<()> {
        instructions::create::handler(ctx, description, amount, deadline_ts)
    }

    /// Baker B accepts the handshake, committing to deliver.
    pub fn accept_handshake(ctx: Context<AcceptHandshake>) -> Result<()> {
        instructions::accept::handler(ctx)
    }

    /// Baker B marks work as delivered.
    pub fn deliver(ctx: Context<Deliver>) -> Result<()> {
        instructions::deliver::handler(ctx)
    }

    /// Baker A approves delivery — releases funds minus the Pinch fee.
    /// Pinch (2%): 50% treasury (buyback+LP) + 30% keepers + 20% commons
    pub fn approve(ctx: Context<Approve>) -> Result<()> {
        instructions::approve::handler(ctx)
    }

    /// Either party raises a dispute.
    pub fn dispute(ctx: Context<Dispute>) -> Result<()> {
        instructions::dispute::handler(ctx)
    }

    /// Creator cancels a handshake (only before it's accepted).
    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        instructions::cancel::handler(ctx)
    }

    /// Resolve a dispute (authority only — community multisig in v2).
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        ruling: u8, // 0 = refund creator, 1 = pay worker
    ) -> Result<()> {
        instructions::resolve::handler(ctx, ruling)
    }

    /// Initialize the protocol config (one-time setup).
    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        pinch_bps: u16,           // fee in basis points (200 = 2%)
        treasury_share_bps: u16,  // 5000 = 50% of fee → buyback+LP
        keepers_share_bps: u16,   // 3000 = 30% of fee
        commons_share_bps: u16,   // 2000 = 20% of fee
    ) -> Result<()> {
        instructions::init_config::handler(
            ctx,
            pinch_bps,
            treasury_share_bps,
            keepers_share_bps,
            commons_share_bps,
        )
    }
}
