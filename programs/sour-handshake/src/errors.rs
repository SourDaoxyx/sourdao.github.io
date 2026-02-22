// ============================================================================
// Custom Error Codes
// ============================================================================

use anchor_lang::prelude::*;

#[error_code]
pub enum SourError {
    // Handshake lifecycle errors
    #[msg("Handshake is not in the expected status for this operation")]
    InvalidStatus,

    #[msg("Only the handshake creator can perform this action")]
    NotCreator,

    #[msg("Only the assigned worker can perform this action")]
    NotWorker,

    #[msg("Only the creator or worker can perform this action")]
    NotParticipant,

    #[msg("Worker address cannot be the same as the creator")]
    SelfHandshake,

    #[msg("Escrow amount must be greater than zero")]
    ZeroAmount,

    #[msg("Description is too long (max 280 characters)")]
    DescriptionTooLong,

    #[msg("Deadline must be in the future")]
    DeadlineInPast,

    #[msg("Handshake has expired past its deadline")]
    HandshakeExpired,

    #[msg("Handshake deadline has not yet passed")]
    DeadlineNotReached,

    // Fee / config errors
    #[msg("Fee shares must sum to 10000 basis points")]
    InvalidFeeShares,

    #[msg("Pinch fee basis points must be between 0 and 5000 (50%)")]
    InvalidPinchBps,

    #[msg("Insufficient escrow balance for transfer")]
    InsufficientEscrow,

    // Dispute errors
    #[msg("Invalid dispute ruling — must be 0 (refund) or 1 (pay worker)")]
    InvalidRuling,

    // Authority errors
    #[msg("Only the protocol authority can perform this action")]
    NotAuthority,

    // Math errors
    #[msg("Arithmetic overflow in fee calculation")]
    MathOverflow,
}
