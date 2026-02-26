// ============================================================================
// SOUR Protocol — The Treasury
// Buyback + Protocol-Owned LP Smart Contract on Solana (Anchor Framework)
// ============================================================================
//
// Flow:
//   Handshake fees (50% of Pinch) are deposited into Treasury vaults.
//   Tokens accumulate until batch_threshold is reached.
//   A Keeper triggers execute_batch:
//     - Tokens are released for off-chain Jupiter swap → buy $SOUR
//     - Keeper pairs SOUR + native token → adds LP
//     - LP tokens are locked in Protocol Treasury (permanent POL)
//     - Keeper receives a small reward (configurable bps) for gas + service
//   Keeper calls complete_batch to record LP stats.
//
//   Multi-token support: any SPL token can be deposited & batched.
//   Batch efficiency: ~99.2% at $500+ vs ~84% for micro-swaps.
// ============================================================================

use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;
pub mod events;

use instructions::*;

declare_id!("Ho84Z1zGWKCKhXZc1QcfinehucRAKZn3vpofSp7HseXW");

#[program]
pub mod sour_treasury {
    use super::*;

    /// One-time initialization of the Treasury config PDA.
    pub fn initialize_config(
        ctx: Context<InitializeConfig>,
        batch_threshold: u64,
        keeper_reward_bps: u16,
    ) -> Result<()> {
        instructions::init_config::handler(ctx, batch_threshold, keeper_reward_bps)
    }

    /// Deposit tokens into the Treasury vault (called by Handshake or anyone).
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::handler(ctx, amount)
    }

    /// Keeper triggers a batch buyback when vault balance ≥ threshold.
    /// Tokens are released to keeper for off-chain Jupiter swap + LP add.
    pub fn execute_batch(ctx: Context<ExecuteBatch>) -> Result<()> {
        instructions::execute_batch::handler(ctx)
    }

    /// Keeper reports batch completion with LP stats.
    pub fn complete_batch(
        ctx: Context<CompleteBatch>,
        batch_id: u64,
        sour_bought_back: u64,
        lp_tokens_added: u64,
    ) -> Result<()> {
        instructions::complete_batch::handler(ctx, batch_id, sour_bought_back, lp_tokens_added)
    }

    /// Authority updates treasury configuration.
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        new_batch_threshold: Option<u64>,
        new_keeper_reward_bps: Option<u16>,
    ) -> Result<()> {
        instructions::update_config::handler(ctx, new_batch_threshold, new_keeper_reward_bps)
    }
}
