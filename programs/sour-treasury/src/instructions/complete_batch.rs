use anchor_lang::prelude::*;
use crate::state::{TreasuryConfig, BatchRecord};
use crate::errors::TreasuryError;
use crate::events::BatchCompleted;

// ---------------------------------------------------------------------------
// CompleteBatch — keeper reports batch completion with buyback + LP stats
//
// After executing the Jupiter swap and adding LP off-chain, the keeper
// calls this instruction to record how much $SOUR was bought back and
// how many LP tokens were added to protocol-owned liquidity.
//
// Only the original keeper who initiated the batch can complete it.
// ---------------------------------------------------------------------------

#[derive(Accounts)]
#[instruction(batch_id: u64)]
pub struct CompleteBatch<'info> {
    /// Must be the same keeper who initiated this batch
    pub keeper: Signer<'info>,

    #[account(
        mut,
        seeds = [b"treasury-config"],
        bump = config.bump,
    )]
    pub config: Account<'info, TreasuryConfig>,

    #[account(
        mut,
        seeds = [b"batch", batch_id.to_le_bytes().as_ref()],
        bump = batch_record.bump,
        constraint = batch_record.keeper == keeper.key(),
        constraint = !batch_record.completed @ TreasuryError::BatchAlreadyCompleted,
    )]
    pub batch_record: Account<'info, BatchRecord>,
}

pub fn handler(
    ctx: Context<CompleteBatch>,
    batch_id: u64,
    sour_bought_back: u64,
    lp_tokens_added: u64,
) -> Result<()> {
    // Mark batch as completed with reported stats
    let batch = &mut ctx.accounts.batch_record;
    batch.completed = true;
    batch.sour_bought_back = sour_bought_back;
    batch.lp_tokens_added = lp_tokens_added;

    // Update lifetime totals
    let config = &mut ctx.accounts.config;
    config.total_bought_back = config
        .total_bought_back
        .checked_add(sour_bought_back)
        .ok_or(TreasuryError::Overflow)?;
    config.total_lp_added = config
        .total_lp_added
        .checked_add(lp_tokens_added)
        .ok_or(TreasuryError::Overflow)?;

    emit!(BatchCompleted {
        batch_id,
        sour_bought_back,
        lp_tokens_added,
    });

    msg!(
        "Batch #{} completed — {} $SOUR bought back, {} LP tokens added",
        batch_id,
        sour_bought_back,
        lp_tokens_added
    );

    Ok(())
}
