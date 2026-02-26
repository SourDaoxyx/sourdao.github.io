use anchor_lang::prelude::*;

#[event]
pub struct Deposited {
    pub mint: Pubkey,
    pub amount: u64,
    pub depositor: Pubkey,
    pub vault_balance: u64,
}

#[event]
pub struct BatchInitiated {
    pub batch_id: u64,
    pub keeper: Pubkey,
    pub token_mint: Pubkey,
    pub amount: u64,
    pub keeper_reward: u64,
}

#[event]
pub struct BatchCompleted {
    pub batch_id: u64,
    pub sour_bought_back: u64,
    pub lp_tokens_added: u64,
}

#[event]
pub struct ConfigUpdated {
    pub authority: Pubkey,
    pub batch_threshold: u64,
    pub keeper_reward_bps: u16,
}
