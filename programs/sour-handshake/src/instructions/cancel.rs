// ============================================================================
// Cancel — creator cancels before acceptance, gets full refund
// ============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{Handshake, HandshakeStatus, ProtocolConfig};
use crate::errors::SourError;
use crate::events::HandshakeCancelled;

#[derive(Accounts)]
pub struct Cancel<'info> {
    #[account(
        seeds = [ProtocolConfig::SEED_PREFIX],
        bump = config.bump,
    )]
    pub config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
        seeds = [Handshake::SEED_PREFIX, handshake.id.to_le_bytes().as_ref()],
        bump = handshake.bump,
        constraint = handshake.status == HandshakeStatus::Created @ SourError::InvalidStatus,
        constraint = handshake.creator == creator.key() @ SourError::NotCreator,
    )]
    pub handshake: Account<'info, Handshake>,

    /// The escrow vault
    #[account(
        mut,
        seeds = [b"vault", handshake.id.to_le_bytes().as_ref()],
        bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    /// PDA authority over the vault
    /// CHECK: PDA seeds verified
    #[account(
        seeds = [b"vault_auth", handshake.id.to_le_bytes().as_ref()],
        bump = handshake.vault_bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,

    /// Creator's token account — receives the refund
    #[account(
        mut,
        constraint = creator_token_account.mint == config.sour_mint,
        constraint = creator_token_account.owner == creator.key(),
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    pub creator: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Cancel>) -> Result<()> {
    let clock = Clock::get()?;
    let handshake = &ctx.accounts.handshake;

    // Build PDA signer seeds
    let id_bytes = handshake.id.to_le_bytes();
    let vault_bump = handshake.vault_bump;
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"vault_auth",
        id_bytes.as_ref(),
        &[vault_bump],
    ]];

    // Refund full amount back to creator
    let refund_amount = ctx.accounts.vault.amount;
    if refund_amount > 0 {
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.creator_token_account.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, refund_amount)?;
    }

    // Update state
    let handshake = &mut ctx.accounts.handshake;
    handshake.status = HandshakeStatus::Cancelled;
    handshake.resolved_at = clock.unix_timestamp;

    emit!(HandshakeCancelled {
        handshake_id: handshake.id,
        creator: handshake.creator,
        cancelled_at: handshake.resolved_at,
    });

    msg!("Handshake #{} cancelled. Full refund.", handshake.id);
    Ok(())
}
