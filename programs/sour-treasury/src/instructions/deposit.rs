use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::state::TreasuryConfig;
use crate::errors::TreasuryError;
use crate::events::Deposited;

// ---------------------------------------------------------------------------
// Deposit — accept any SPL token into the Treasury vault
// Called by Handshake program (approve/resolve) or by anyone directly.
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub depositor: Signer<'info>,

    #[account(
        mut,
        seeds = [b"treasury-config"],
        bump = config.bump,
    )]
    pub config: Account<'info, TreasuryConfig>,

    /// The token being deposited (can be any SPL token — multi-token support)
    pub deposit_mint: Account<'info, Mint>,

    /// Depositor's token account
    #[account(
        mut,
        constraint = depositor_token.owner == depositor.key(),
        constraint = depositor_token.mint == deposit_mint.key(),
    )]
    pub depositor_token: Account<'info, TokenAccount>,

    /// Treasury vault ATA for this token mint, owned by config PDA
    #[account(
        mut,
        constraint = treasury_vault.mint == deposit_mint.key(),
        constraint = treasury_vault.owner == config.key(),
    )]
    pub treasury_vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    require!(amount > 0, TreasuryError::ZeroDeposit);

    // Transfer tokens from depositor → treasury vault
    let cpi_accounts = Transfer {
        from: ctx.accounts.depositor_token.to_account_info(),
        to: ctx.accounts.treasury_vault.to_account_info(),
        authority: ctx.accounts.depositor.to_account_info(),
    };
    token::transfer(
        CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
        amount,
    )?;

    // Update lifetime stats
    let config = &mut ctx.accounts.config;
    config.total_deposited = config
        .total_deposited
        .checked_add(amount)
        .ok_or(TreasuryError::Overflow)?;

    // Reload vault to get updated balance
    ctx.accounts.treasury_vault.reload()?;

    emit!(Deposited {
        mint: ctx.accounts.deposit_mint.key(),
        amount,
        depositor: ctx.accounts.depositor.key(),
        vault_balance: ctx.accounts.treasury_vault.amount,
    });

    msg!(
        "Deposited {} tokens into treasury (vault balance: {})",
        amount,
        ctx.accounts.treasury_vault.amount
    );

    Ok(())
}
