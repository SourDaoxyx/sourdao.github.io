use anchor_lang::prelude::*;

#[error_code]
pub enum TreasuryError {
    #[msg("Vault balance is below the minimum batch threshold")]
    BelowThreshold,

    #[msg("This batch has already been completed")]
    BatchAlreadyCompleted,

    #[msg("Invalid keeper reward basis points (max 500 = 5%)")]
    InvalidKeeperReward,

    #[msg("Arithmetic overflow")]
    Overflow,

    #[msg("Deposit amount must be greater than zero")]
    ZeroDeposit,
}
