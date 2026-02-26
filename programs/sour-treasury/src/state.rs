use anchor_lang::prelude::*;

// ---------------------------------------------------------------------------
// TreasuryConfig — singleton PDA holding global treasury settings & stats
// Seeds: ["treasury-config"]
// ---------------------------------------------------------------------------

#[account]
pub struct TreasuryConfig {
    /// Admin who can update config
    pub authority: Pubkey,
    /// The $SOUR token mint address
    pub sour_mint: Pubkey,
    /// Minimum vault balance (in token native decimals) to trigger a batch
    pub batch_threshold: u64,
    /// Basis-point reward paid to the keeper who triggers a batch (max 500 = 5%)
    pub keeper_reward_bps: u16,
    /// Lifetime: total tokens deposited across all mints
    pub total_deposited: u64,
    /// Lifetime: total $SOUR acquired via buyback
    pub total_bought_back: u64,
    /// Lifetime: total LP tokens added to protocol-owned liquidity
    pub total_lp_added: u64,
    /// Running batch counter (used as seed for BatchRecord PDAs)
    pub batch_count: u64,
    /// PDA bump
    pub bump: u8,
}

impl TreasuryConfig {
    pub const SIZE: usize = 8  // discriminator
        + 32 // authority
        + 32 // sour_mint
        + 8  // batch_threshold
        + 2  // keeper_reward_bps
        + 8  // total_deposited
        + 8  // total_bought_back
        + 8  // total_lp_added
        + 8  // batch_count
        + 1; // bump
}

// ---------------------------------------------------------------------------
// BatchRecord — tracks each keeper-initiated batch for accountability
// Seeds: ["batch", batch_id.to_le_bytes()]
// ---------------------------------------------------------------------------

#[account]
pub struct BatchRecord {
    /// The keeper who initiated this batch
    pub keeper: Pubkey,
    /// The token mint that was batched
    pub token_mint: Pubkey,
    /// Amount withdrawn from vault (excluding keeper reward)
    pub amount_withdrawn: u64,
    /// Keeper's reward for triggering the batch
    pub keeper_reward: u64,
    /// Timestamp when batch was initiated
    pub initiated_at: i64,
    /// Whether the keeper has reported completion
    pub completed: bool,
    /// $SOUR acquired in this batch (reported by keeper)
    pub sour_bought_back: u64,
    /// LP tokens added in this batch (reported by keeper)
    pub lp_tokens_added: u64,
    /// PDA bump
    pub bump: u8,
}

impl BatchRecord {
    pub const SIZE: usize = 8  // discriminator
        + 32 // keeper
        + 32 // token_mint
        + 8  // amount_withdrawn
        + 8  // keeper_reward
        + 8  // initiated_at
        + 1  // completed
        + 8  // sour_bought_back
        + 8  // lp_tokens_added
        + 1; // bump
}
