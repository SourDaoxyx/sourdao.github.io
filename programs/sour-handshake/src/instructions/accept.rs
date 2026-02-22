// ============================================================================
// Accept Handshake — Baker B commits to delivering the work
// ============================================================================

use anchor_lang::prelude::*;

use crate::state::{Handshake, HandshakeStatus};
use crate::errors::SourError;
use crate::events::HandshakeAccepted;

#[derive(Accounts)]
pub struct AcceptHandshake<'info> {
    #[account(
        mut,
        seeds = [Handshake::SEED_PREFIX, handshake.id.to_le_bytes().as_ref()],
        bump = handshake.bump,
        constraint = handshake.status == HandshakeStatus::Created @ SourError::InvalidStatus,
        constraint = handshake.worker == worker.key() @ SourError::NotWorker,
    )]
    pub handshake: Account<'info, Handshake>,

    pub worker: Signer<'info>,
}

pub fn handler(ctx: Context<AcceptHandshake>) -> Result<()> {
    let clock = Clock::get()?;
    let handshake = &mut ctx.accounts.handshake;

    // Check deadline hasn't passed
    require!(
        clock.unix_timestamp <= handshake.deadline_ts,
        SourError::HandshakeExpired
    );

    handshake.status = HandshakeStatus::Accepted;
    handshake.accepted_at = clock.unix_timestamp;

    emit!(HandshakeAccepted {
        handshake_id: handshake.id,
        worker: handshake.worker,
        accepted_at: handshake.accepted_at,
    });

    msg!("Handshake #{} accepted by worker", handshake.id);
    Ok(())
}
