// ============================================================================
// Resolve Dispute — authority decides outcome
//
// Ruling:
//   0 = Refund creator (full amount returned, no fee)
//   1 = Pay worker (full amount minus Pinch fee)
// ============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{Handshake, HandshakeStatus, ProtocolConfig};
use crate::errors::SourError;
use crate::events::DisputeResolved;

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(
        mut,
        seeds = [ProtocolConfig::SEED_PREFIX],
        bump = config.bump,
        constraint = config.authority == authority.key() @ SourError::NotAuthority,
    )]
    pub config: Account<'info, ProtocolConfig>,

    #[account(
        mut,
        seeds = [Handshake::SEED_PREFIX, handshake.id.to_le_bytes().as_ref()],
        bump = handshake.bump,
        constraint = handshake.status == HandshakeStatus::Disputed @ SourError::InvalidStatus,
    )]
    pub handshake: Account<'info, Handshake>,

    /// Escrow vault
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

    /// Creator's token account — receives refund if ruling = 0
    #[account(
        mut,
        constraint = creator_token_account.mint == config.sour_mint,
        constraint = creator_token_account.owner == handshake.creator,
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    /// Worker's token account — receives payment if ruling = 1
    #[account(
        mut,
        constraint = worker_token_account.mint == config.sour_mint,
        constraint = worker_token_account.owner == handshake.worker,
    )]
    pub worker_token_account: Account<'info, TokenAccount>,

    /// Keepers pool
    #[account(
        mut,
        constraint = keepers_pool.key() == config.keepers_pool,
    )]
    pub keepers_pool: Account<'info, TokenAccount>,

    /// Commons treasury
    #[account(
        mut,
        constraint = commons_treasury.key() == config.commons_treasury,
    )]
    pub commons_treasury: Account<'info, TokenAccount>,

    /// Buyback+LP treasury — receives 50% of Pinch
    #[account(
        mut,
        constraint = buyback_treasury.key() == config.buyback_treasury,
    )]
    pub buyback_treasury: Account<'info, TokenAccount>,

    /// Protocol authority (resolver)
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<ResolveDispute>, ruling: u8) -> Result<()> {
    require!(ruling <= 1, SourError::InvalidRuling);

    let clock = Clock::get()?;
    let handshake_id = ctx.accounts.handshake.id;
    let amount = ctx.accounts.handshake.amount;

    let id_bytes = handshake_id.to_le_bytes();
    let vault_bump = ctx.accounts.handshake.vault_bump;
    let signer_seeds: &[&[&[u8]]] = &[&[
        b"vault_auth",
        id_bytes.as_ref(),
        &[vault_bump],
    ]];

    if ruling == 0 {
        // ===================================================================
        // RULING 0: Refund creator — full amount, no fee
        // ===================================================================
        let vault_balance = ctx.accounts.vault.amount;
        if vault_balance > 0 {
            let transfer_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.creator_token_account.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            );
            token::transfer(transfer_ctx, vault_balance)?;
        }
        msg!("Dispute #{} resolved: REFUND to creator", handshake_id);
    } else {
        // ===================================================================
        // RULING 1: Pay worker — apply Pinch fee
        // ===================================================================
        let config = &ctx.accounts.config;

        let pinch_total = (amount as u128)
            .checked_mul(config.pinch_bps as u128)
            .ok_or(SourError::MathOverflow)?
            .checked_div(10_000)
            .ok_or(SourError::MathOverflow)? as u64;

        let burn_amount = (pinch_total as u128)
            .checked_mul(config.treasury_share_bps as u128)
            .ok_or(SourError::MathOverflow)?
            .checked_div(10_000)
            .ok_or(SourError::MathOverflow)? as u64;

        let keepers_amount = (pinch_total as u128)
            .checked_mul(config.keepers_share_bps as u128)
            .ok_or(SourError::MathOverflow)?
            .checked_div(10_000)
            .ok_or(SourError::MathOverflow)? as u64;

        let commons_amount = pinch_total
            .checked_sub(burn_amount)
            .ok_or(SourError::MathOverflow)?
            .checked_sub(keepers_amount)
            .ok_or(SourError::MathOverflow)?;

        let worker_amount = amount
            .checked_sub(pinch_total)
            .ok_or(SourError::MathOverflow)?;

        // Transfer to worker
        if worker_amount > 0 {
            let ctx_transfer = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.worker_token_account.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            );
            token::transfer(ctx_transfer, worker_amount)?;
        }

        // Transfer to buyback+LP treasury
        if burn_amount > 0 {
            let treasury_ctx = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.buyback_treasury.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            );
            token::transfer(treasury_ctx, burn_amount)?;
        }

        // To keepers
        if keepers_amount > 0 {
            let ctx_keepers = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.keepers_pool.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            );
            token::transfer(ctx_keepers, keepers_amount)?;
        }

        // To commons
        if commons_amount > 0 {
            let ctx_commons = CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.commons_treasury.to_account_info(),
                    authority: ctx.accounts.vault_authority.to_account_info(),
                },
                signer_seeds,
            );
            token::transfer(ctx_commons, commons_amount)?;
        }

        // Update config stats
        let config = &mut ctx.accounts.config;
        config.total_completed = config
            .total_completed
            .checked_add(1)
            .ok_or(SourError::MathOverflow)?;
        config.total_to_treasury = config
            .total_to_treasury
            .checked_add(burn_amount)
            .ok_or(SourError::MathOverflow)?;
        config.total_to_keepers = config
            .total_to_keepers
            .checked_add(keepers_amount)
            .ok_or(SourError::MathOverflow)?;
        config.total_to_commons = config
            .total_to_commons
            .checked_add(commons_amount)
            .ok_or(SourError::MathOverflow)?;

        msg!(
            "Dispute #{} resolved: PAY worker. {} paid, {} to treasury",
            handshake_id,
            worker_amount,
            burn_amount,
        );
    }

    // Update handshake state
    let handshake = &mut ctx.accounts.handshake;
    handshake.status = HandshakeStatus::Resolved;
    handshake.resolved_at = clock.unix_timestamp;

    emit!(DisputeResolved {
        handshake_id: handshake.id,
        ruling,
        resolved_at: handshake.resolved_at,
    });

    Ok(())
}
