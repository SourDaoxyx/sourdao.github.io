// ============================================================================
// Dispute — either party raises a dispute
// ============================================================================

use anchor_lang::prelude::*;

use crate::state::{Handshake, HandshakeStatus, ProtocolConfig};
use crate::errors::SourError;
use crate::events::HandshakeDisputed;

#[derive(Accounts)]
pub struct Dispute<'info> {
    #[account(
        mut,
        seeds = [ProtocolConfig::SEED_PREFIX],
        bump = config.bump,
    )]
    pub config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
        seeds = [Handshake::SEED_PREFIX, handshake.id.to_le_bytes().as_ref()],
        bump = handshake.bump,
        // Can dispute if Accepted or Delivered
        constraint = (
            handshake.status == HandshakeStatus::Accepted ||
            handshake.status == HandshakeStatus::Delivered
        ) @ SourError::InvalidStatus,
    )]
    pub handshake: Account<'info, Handshake>,

    /// Must be either creator or worker
    pub signer: Signer<'info>,
}

pub fn handler(ctx: Context<Dispute>) -> Result<()> {
    let handshake = &mut ctx.accounts.handshake;
    let signer_key = ctx.accounts.signer.key();

    // Only creator or worker can dispute
    require!(
        signer_key == handshake.creator || signer_key == handshake.worker,
        SourError::NotParticipant
    );

    let clock = Clock::get()?;

    handshake.status = HandshakeStatus::Disputed;
    handshake.disputed_by = signer_key;

    // Update global stats
    let config = &mut ctx.accounts.config;
    config.total_disputed = config
        .total_disputed
        .checked_add(1)
        .ok_or(SourError::MathOverflow)?;

    emit!(HandshakeDisputed {
        handshake_id: handshake.id,
        disputed_by: signer_key,
        disputed_at: clock.unix_timestamp,
    });

    msg!("Handshake #{} disputed by {}", handshake.id, signer_key);
    Ok(())
}
