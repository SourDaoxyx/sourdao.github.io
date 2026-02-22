// ============================================================================
// Create Handshake — escrow $SOUR into a PDA vault
// ============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::{Handshake, HandshakeStatus, ProtocolConfig};
use crate::errors::SourError;
use crate::events::HandshakeCreated;

#[derive(Accounts)]
pub struct CreateHandshake<'info> {
    #[account(
        mut,
        seeds = [ProtocolConfig::SEED_PREFIX],
        bump = config.bump,
    )]
    pub config: Account<'info, ProtocolConfig>,

    #[account(
        init,
        payer = creator,
        space = 8 + Handshake::INIT_SPACE,
        seeds = [
            Handshake::SEED_PREFIX,
            config.handshake_count.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub handshake: Account<'info, Handshake>,

    /// The escrow vault — PDA-owned token account holding $SOUR
    #[account(
        init,
        payer = creator,
        token::mint = sour_mint,
        token::authority = vault_authority,
        seeds = [b"vault", config.handshake_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub vault: Account<'info, TokenAccount>,

    /// PDA authority over the vault
    /// CHECK: PDA derived from seeds, no data needed
    #[account(
        seeds = [b"vault_auth", config.handshake_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub vault_authority: UncheckedAccount<'info>,

    /// Creator's $SOUR token account (source of escrowed funds)
    #[account(
        mut,
        constraint = creator_token_account.mint == config.sour_mint,
        constraint = creator_token_account.owner == creator.key(),
    )]
    pub creator_token_account: Account<'info, TokenAccount>,

    /// The worker's wallet address (Baker B) — not signing, just referenced
    /// CHECK: any valid pubkey, validated in handler
    pub worker: UncheckedAccount<'info>,

    /// $SOUR token mint
    /// CHECK: validated against config
    #[account(address = config.sour_mint)]
    pub sour_mint: UncheckedAccount<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateHandshake>,
    description: String,
    amount: u64,
    deadline_ts: i64,
) -> Result<()> {
    // Validations
    require!(amount > 0, SourError::ZeroAmount);
    require!(description.len() <= 280, SourError::DescriptionTooLong);
    require!(
        ctx.accounts.worker.key() != ctx.accounts.creator.key(),
        SourError::SelfHandshake
    );

    let clock = Clock::get()?;
    require!(deadline_ts > clock.unix_timestamp, SourError::DeadlineInPast);

    // Transfer $SOUR from creator to vault
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.creator_token_account.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.creator.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, amount)?;

    // Initialize handshake state
    let handshake = &mut ctx.accounts.handshake;
    let config = &mut ctx.accounts.config;

    handshake.id = config.handshake_count;
    handshake.creator = ctx.accounts.creator.key();
    handshake.worker = ctx.accounts.worker.key();
    handshake.amount = amount;
    handshake.description = description.clone();
    handshake.status = HandshakeStatus::Created;
    handshake.created_at = clock.unix_timestamp;
    handshake.deadline_ts = deadline_ts;
    handshake.accepted_at = 0;
    handshake.delivered_at = 0;
    handshake.resolved_at = 0;
    handshake.disputed_by = Pubkey::default();
    handshake.vault_bump = ctx.bumps.vault_authority;
    handshake.bump = ctx.bumps.handshake;

    // Increment global counter
    config.handshake_count = config
        .handshake_count
        .checked_add(1)
        .ok_or(SourError::MathOverflow)?;

    emit!(HandshakeCreated {
        handshake_id: handshake.id,
        creator: handshake.creator,
        worker: handshake.worker,
        amount,
        deadline_ts,
        description,
    });

    msg!(
        "Handshake #{} created: {} $SOUR escrowed",
        handshake.id,
        amount
    );
    Ok(())
}
