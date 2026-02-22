// ============================================================================
// Initialize Protocol Config — one-time setup
// ============================================================================

use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

use crate::state::ProtocolConfig;
use crate::errors::SourError;
use crate::events::ConfigInitialized;

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProtocolConfig::INIT_SPACE,
        seeds = [ProtocolConfig::SEED_PREFIX],
        bump,
    )]
    pub config: Account<'info, ProtocolConfig>,

    /// The $SOUR token mint
    pub sour_mint: Account<'info, Mint>,

    /// Token account that receives the Keepers' share of Pinch fees
    /// CHECK: validated by the authority; must be a token account for sour_mint
    #[account()]
    pub keepers_pool: UncheckedAccount<'info>,

    /// Token account that receives the Commons' share of Pinch fees
    /// CHECK: validated by the authority; must be a token account for sour_mint
    #[account()]
    pub commons_treasury: UncheckedAccount<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeConfig>,
    pinch_bps: u16,
    burn_share_bps: u16,
    keepers_share_bps: u16,
    commons_share_bps: u16,
) -> Result<()> {
    // Validate: pinch fee must be reasonable (max 50%)
    require!(pinch_bps <= 5000, SourError::InvalidPinchBps);

    // Validate: fee shares must sum to 10000 bps (100%)
    let share_sum = burn_share_bps as u32 + keepers_share_bps as u32 + commons_share_bps as u32;
    require!(share_sum == 10_000, SourError::InvalidFeeShares);

    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.sour_mint = ctx.accounts.sour_mint.key();
    config.keepers_pool = ctx.accounts.keepers_pool.key();
    config.commons_treasury = ctx.accounts.commons_treasury.key();
    config.pinch_bps = pinch_bps;
    config.burn_share_bps = burn_share_bps;
    config.keepers_share_bps = keepers_share_bps;
    config.commons_share_bps = commons_share_bps;
    config.handshake_count = 0;
    config.total_burned = 0;
    config.total_to_keepers = 0;
    config.total_to_commons = 0;
    config.total_completed = 0;
    config.total_disputed = 0;
    config.bump = ctx.bumps.config;

    emit!(ConfigInitialized {
        authority: config.authority,
        sour_mint: config.sour_mint,
        pinch_bps,
    });

    msg!("SOUR Protocol config initialized. Pinch: {}bps", pinch_bps);
    Ok(())
}
