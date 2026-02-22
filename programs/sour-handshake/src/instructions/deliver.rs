// ============================================================================
// Deliver — Baker B marks the work as delivered
// ============================================================================

use anchor_lang::prelude::*;

use crate::state::{Handshake, HandshakeStatus};
use crate::errors::SourError;
use crate::events::WorkDelivered;

#[derive(Accounts)]
pub struct Deliver<'info> {
    #[account(
        mut,
        seeds = [Handshake::SEED_PREFIX, handshake.id.to_le_bytes().as_ref()],
        bump = handshake.bump,
        constraint = handshake.status == HandshakeStatus::Accepted @ SourError::InvalidStatus,
        constraint = handshake.worker == worker.key() @ SourError::NotWorker,
    )]
    pub handshake: Account<'info, Handshake>,

    pub worker: Signer<'info>,
}

pub fn handler(ctx: Context<Deliver>) -> Result<()> {
    let clock = Clock::get()?;
    let handshake = &mut ctx.accounts.handshake;

    handshake.status = HandshakeStatus::Delivered;
    handshake.delivered_at = clock.unix_timestamp;

    emit!(WorkDelivered {
        handshake_id: handshake.id,
        worker: handshake.worker,
        delivered_at: handshake.delivered_at,
    });

    msg!("Handshake #{} — work delivered", handshake.id);
    Ok(())
}
