use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use crate::state::TreasuryConfig;
use crate::errors::TreasuryError;

// ---------------------------------------------------------------------------
// InitializeConfig — one-time setup of the Treasury PDA
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = TreasuryConfig::SIZE,
        seeds = [b"treasury-config"],
        bump,
    )]
    pub config: Account<'info, TreasuryConfig>,

    /// The $SOUR token mint
    pub sour_mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeConfig>,
    batch_threshold: u64,
    keeper_reward_bps: u16,
) -> Result<()> {
    require!(
        keeper_reward_bps <= 500,
        TreasuryError::InvalidKeeperReward
    );

    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.sour_mint = ctx.accounts.sour_mint.key();
    config.batch_threshold = batch_threshold;
    config.keeper_reward_bps = keeper_reward_bps;
    config.total_deposited = 0;
    config.total_bought_back = 0;
    config.total_lp_added = 0;
    config.batch_count = 0;
    config.bump = ctx.bumps.config;

    msg!(
        "Treasury initialized — threshold: {}, keeper reward: {} bps",
        batch_threshold,
        keeper_reward_bps
    );

    Ok(())
}
