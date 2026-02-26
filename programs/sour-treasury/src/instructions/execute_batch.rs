use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::state::{TreasuryConfig, BatchRecord};
use crate::errors::TreasuryError;
use crate::events::BatchInitiated;

// ---------------------------------------------------------------------------
// ExecuteBatch — keeper triggers buyback when vault ≥ threshold
//
// Flow:
//   1. Verify vault balance ≥ batch_threshold
//   2. Calculate keeper reward (keeper_reward_bps of vault balance)
//   3. Transfer entire vault balance to keeper's token account
//      - Keeper keeps their reward portion
//      - Keeper uses the rest for Jupiter swap (→ $SOUR) + LP add
//   4. Create BatchRecord PDA for accountability
//
// The keeper then uses off-chain tooling (Jupiter API) to:
//   - Swap tokens → $SOUR
//   - Pair $SOUR + native → add LP on Raydium/Orca
//   - LP tokens are sent to a protocol-owned vault (locked)
//
// Keeper calls complete_batch afterwards to record results.
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct ExecuteBatch<'info> {
    /// The keeper triggering the batch
    #[account(mut)]
    pub keeper: Signer<'info>,

    #[account(
        mut,
        seeds = [b"treasury-config"],
        bump = config.bump,
    )]
    pub config: Account<'info, TreasuryConfig>,

    /// Batch record PDA for this batch (seeded by batch_count)
    #[account(
        init,
        payer = keeper,
        space = BatchRecord::SIZE,
        seeds = [b"batch", config.batch_count.to_le_bytes().as_ref()],
        bump,
    )]
    pub batch_record: Account<'info, BatchRecord>,

    /// The token mint being batched
    pub token_mint: Account<'info, Mint>,

    /// Treasury vault holding accumulated tokens
    #[account(
        mut,
        constraint = treasury_vault.mint == token_mint.key(),
        constraint = treasury_vault.owner == config.key(),
    )]
    pub treasury_vault: Account<'info, TokenAccount>,

    /// Keeper's token account to receive tokens for swap
    #[account(
        mut,
        constraint = keeper_token.owner == keeper.key(),
        constraint = keeper_token.mint == token_mint.key(),
    )]
    pub keeper_token: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ExecuteBatch>) -> Result<()> {
    let vault_balance = ctx.accounts.treasury_vault.amount;

    require!(
        vault_balance >= ctx.accounts.config.batch_threshold,
        TreasuryError::BelowThreshold
    );

    // Calculate keeper reward
    let keeper_reward = vault_balance
        .checked_mul(ctx.accounts.config.keeper_reward_bps as u64)
        .ok_or(TreasuryError::Overflow)?
        .checked_div(10_000)
        .ok_or(TreasuryError::Overflow)?;

    let batch_amount = vault_balance
        .checked_sub(keeper_reward)
        .ok_or(TreasuryError::Overflow)?;

    // Transfer entire vault balance to keeper
    // (keeper keeps reward, uses batch_amount for swap + LP)
    let seeds = &[b"treasury-config".as_ref(), &[ctx.accounts.config.bump]];
    let signer_seeds = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.treasury_vault.to_account_info(),
        to: ctx.accounts.keeper_token.to_account_info(),
        authority: ctx.accounts.config.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        ),
        vault_balance,
    )?;

    // Record batch
    let batch = &mut ctx.accounts.batch_record;
    batch.keeper = ctx.accounts.keeper.key();
    batch.token_mint = ctx.accounts.token_mint.key();
    batch.amount_withdrawn = batch_amount;
    batch.keeper_reward = keeper_reward;
    batch.initiated_at = Clock::get()?.unix_timestamp;
    batch.completed = false;
    batch.sour_bought_back = 0;
    batch.lp_tokens_added = 0;
    batch.bump = ctx.bumps.batch_record;

    // Increment batch counter
    let config = &mut ctx.accounts.config;
    let batch_id = config.batch_count;
    config.batch_count = config
        .batch_count
        .checked_add(1)
        .ok_or(TreasuryError::Overflow)?;

    emit!(BatchInitiated {
        batch_id,
        keeper: ctx.accounts.keeper.key(),
        token_mint: ctx.accounts.token_mint.key(),
        amount: batch_amount,
        keeper_reward,
    });

    msg!(
        "Batch #{} initiated — {} tokens released (keeper reward: {})",
        batch_id,
        batch_amount,
        keeper_reward
    );

    Ok(())
}
