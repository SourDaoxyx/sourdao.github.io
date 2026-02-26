// ============================================================================
// Approve — Baker A approves delivery, releases funds with Pinch fee
//
// Pinch Fee Flow (default 2% of escrow):
//   50% → Treasury PDA (batched → SOUR buyback + Protocol-Owned LP)
//   30% → Keepers pool (holder rewards)
//   20% → Commons treasury (community fund)
//
// Remaining 98% → Worker's token account
// ============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, Mint};

use crate::state::{Handshake, HandshakeStatus, ProtocolConfig};
use crate::errors::SourError;
use crate::events::HandshakeApproved;

#[derive(Accounts)]
pub struct Approve<'info> {
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
        constraint = handshake.status == HandshakeStatus::Delivered @ SourError::InvalidStatus,
        constraint = handshake.creator == creator.key() @ SourError::NotCreator,
    )]
    pub handshake: Account<'info, Handshake>,

    /// The escrow vault holding $SOUR
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

    /// Worker's token account — receives the payment
    #[account(
        mut,
        constraint = worker_token_account.mint == config.sour_mint,
        constraint = worker_token_account.owner == handshake.worker,
    )]
    pub worker_token_account: Account<'info, TokenAccount>,

    /// Keepers pool — receives 30% of Pinch
    #[account(
        mut,
        constraint = keepers_pool.key() == config.keepers_pool,
    )]
    pub keepers_pool: Account<'info, TokenAccount>,

    /// Commons treasury — receives 20% of Pinch
    #[account(
        mut,
        constraint = commons_treasury.key() == config.commons_treasury,
    )]
    pub commons_treasury: Account<'info, TokenAccount>,

    /// Buyback+LP treasury — receives 50% of Pinch (batched → buyback + LP)
    #[account(
        mut,
        constraint = buyback_treasury.key() == config.buyback_treasury,
    )]
    pub buyback_treasury: Account<'info, TokenAccount>,

    /// The creator (Baker A) approving the delivery
    pub creator: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Approve>) -> Result<()> {
    let clock = Clock::get()?;
    let config = &ctx.accounts.config;
    let handshake_id = ctx.accounts.handshake.id;
    let amount = ctx.accounts.handshake.amount;

    // -----------------------------------------------------------------------
    // Calculate Pinch fee splits
    // -----------------------------------------------------------------------
    let pinch_total = (amount as u128)
        .checked_mul(config.pinch_bps as u128)
        .ok_or(SourError::MathOverflow)?
        .checked_div(10_000)
        .ok_or(SourError::MathOverflow)? as u64;

    let treasury_amount = (pinch_total as u128)
        .checked_mul(config.treasury_share_bps as u128)
        .ok_or(SourError::MathOverflow)?
        .checked_div(10_000)
        .ok_or(SourError::MathOverflow)? as u64;

    let keepers_amount = (pinch_total as u128)
        .checked_mul(config.keepers_share_bps as u128)
        .ok_or(SourError::MathOverflow)?
        .checked_div(10_000)
        .ok_or(SourError::MathOverflow)? as u64;

    // Commons gets the remainder to avoid rounding dust
    let commons_amount = pinch_total
        .checked_sub(treasury_amount)
        .ok_or(SourError::MathOverflow)?
        .checked_sub(keepers_amount)
        .ok_or(SourError::MathOverflow)?;

    let worker_amount = amount
        .checked_sub(pinch_total)
        .ok_or(SourError::MathOverflow)?;

    // -----------------------------------------------------------------------
    // Build PDA signer seeds for vault authority
    // -----------------------------------------------------------------------
    let id_bytes = handshake_id.to_le_bytes();
    let vault_bump = ctx.accounts.handshake.vault_bump;
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"vault_auth",
        id_bytes.as_ref(),
        &[vault_bump],
    ]];

    // -----------------------------------------------------------------------
    // 1. Transfer to worker (98% by default)
    // -----------------------------------------------------------------------
    if worker_amount > 0 {
        let transfer_worker_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.worker_token_account.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_worker_ctx, worker_amount)?;
    }

    // -----------------------------------------------------------------------
    // 2. Transfer 50% of Pinch to Buyback+LP Treasury
    // -----------------------------------------------------------------------
    if treasury_amount > 0 {
        let transfer_treasury_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.buyback_treasury.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_treasury_ctx, treasury_amount)?;
    }

    // -----------------------------------------------------------------------
    // 3. Transfer 30% of Pinch to Keepers pool
    // -----------------------------------------------------------------------
    if keepers_amount > 0 {
        let transfer_keepers_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.keepers_pool.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_keepers_ctx, keepers_amount)?;
    }

    // -----------------------------------------------------------------------
    // 4. Transfer 20% of Pinch to Commons treasury
    // -----------------------------------------------------------------------
    if commons_amount > 0 {
        let transfer_commons_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vault.to_account_info(),
                to: ctx.accounts.commons_treasury.to_account_info(),
                authority: ctx.accounts.vault_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_commons_ctx, commons_amount)?;
    }

    // -----------------------------------------------------------------------
    // Update state
    // -----------------------------------------------------------------------
    let handshake = &mut ctx.accounts.handshake;
    handshake.status = HandshakeStatus::Approved;
    handshake.resolved_at = clock.unix_timestamp;

    let config = &mut ctx.accounts.config;
    config.total_completed = config
        .total_completed
        .checked_add(1)
        .ok_or(SourError::MathOverflow)?;
    config.total_to_treasury = config
        .total_to_treasury
        .checked_add(treasury_amount)
        .ok_or(SourError::MathOverflow)?;
    config.total_to_keepers = config
        .total_to_keepers
        .checked_add(keepers_amount)
        .ok_or(SourError::MathOverflow)?;
    config.total_to_commons = config
        .total_to_commons
        .checked_add(commons_amount)
        .ok_or(SourError::MathOverflow)?;

    emit!(HandshakeApproved {
        handshake_id: handshake.id,
        creator: handshake.creator,
        worker: handshake.worker,
        amount,
        pinch_total,
        to_treasury: treasury_amount,
        to_keepers: keepers_amount,
        to_commons: commons_amount,
    });

    msg!(
        "Handshake #{} approved! {} to worker, {} to treasury, {} to keepers, {} to commons",
        handshake.id,
        worker_amount,
        treasury_amount,
        keepers_amount,
        commons_amount,
    );
    Ok(())
}
