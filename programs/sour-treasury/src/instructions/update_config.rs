use anchor_lang::prelude::*;
use crate::state::TreasuryConfig;
use crate::errors::TreasuryError;
use crate::events::ConfigUpdated;

// ---------------------------------------------------------------------------
// UpdateConfig — authority can adjust treasury parameters
// ---------------------------------------------------------------------------

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(constraint = authority.key() == config.authority)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"treasury-config"],
        bump = config.bump,
    )]
    pub config: Account<'info, TreasuryConfig>,
}

pub fn handler(
    ctx: Context<UpdateConfig>,
    new_batch_threshold: Option<u64>,
    new_keeper_reward_bps: Option<u16>,
) -> Result<()> {
    let config = &mut ctx.accounts.config;

    if let Some(threshold) = new_batch_threshold {
        config.batch_threshold = threshold;
    }

    if let Some(bps) = new_keeper_reward_bps {
        require!(bps <= 500, TreasuryError::InvalidKeeperReward);
        config.keeper_reward_bps = bps;
    }

    emit!(ConfigUpdated {
        authority: config.authority,
        batch_threshold: config.batch_threshold,
        keeper_reward_bps: config.keeper_reward_bps,
    });

    msg!(
        "Config updated — threshold: {}, keeper reward: {} bps",
        config.batch_threshold,
        config.keeper_reward_bps
    );

    Ok(())
}
