/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * pointedly uses snake_case. This file is auto-generated from the IDL.
 */
export type SourHandshake = {
  "address": "HUAq4NFymfn4hNvs7RMNCC5uFEoRctkWDWCA9G7prxeF",
  "metadata": {
    "name": "sourHandshake",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "SOUR Protocol — The Handshake: P2P Escrow on Solana"
  },
  "instructions": [
    {
      "name": "initializeConfig",
      "discriminator": number[],
      "accounts": [
        { "name": "config", "writable": true, "pda": { "seeds": [{ "kind": "const", "value": number[] }] } },
        { "name": "sourMint", "writable": false },
        { "name": "keepersPool", "writable": false },
        { "name": "commonsTreasury", "writable": false },
        { "name": "authority", "writable": true, "signer": true },
        { "name": "systemProgram", "address": string }
      ],
      "args": [
        { "name": "pinchBps", "type": "u16" },
        { "name": "burnShareBps", "type": "u16" },
        { "name": "keepersShareBps", "type": "u16" },
        { "name": "commonsShareBps", "type": "u16" }
      ]
    },
    {
      "name": "createHandshake",
      "discriminator": number[],
      "accounts": [
        { "name": "config", "writable": true },
        { "name": "handshake", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "vaultAuthority" },
        { "name": "creatorTokenAccount", "writable": true },
        { "name": "worker" },
        { "name": "sourMint" },
        { "name": "creator", "writable": true, "signer": true },
        { "name": "tokenProgram", "address": string },
        { "name": "systemProgram", "address": string },
        { "name": "rent", "address": string }
      ],
      "args": [
        { "name": "description", "type": "string" },
        { "name": "amount", "type": "u64" },
        { "name": "deadlineTs", "type": "i64" }
      ]
    },
    {
      "name": "acceptHandshake",
      "discriminator": number[],
      "accounts": [
        { "name": "handshake", "writable": true },
        { "name": "worker", "signer": true }
      ],
      "args": []
    },
    {
      "name": "deliver",
      "discriminator": number[],
      "accounts": [
        { "name": "handshake", "writable": true },
        { "name": "worker", "signer": true }
      ],
      "args": []
    },
    {
      "name": "approve",
      "discriminator": number[],
      "accounts": [
        { "name": "config", "writable": true },
        { "name": "handshake", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "vaultAuthority" },
        { "name": "workerTokenAccount", "writable": true },
        { "name": "keepersPool", "writable": true },
        { "name": "commonsTreasury", "writable": true },
        { "name": "sourMint", "writable": true },
        { "name": "creator", "signer": true },
        { "name": "tokenProgram", "address": string }
      ],
      "args": []
    },
    {
      "name": "dispute",
      "discriminator": number[],
      "accounts": [
        { "name": "config", "writable": true },
        { "name": "handshake", "writable": true },
        { "name": "signer", "signer": true }
      ],
      "args": []
    },
    {
      "name": "cancel",
      "discriminator": number[],
      "accounts": [
        { "name": "config" },
        { "name": "handshake", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "vaultAuthority" },
        { "name": "creatorTokenAccount", "writable": true },
        { "name": "creator", "signer": true },
        { "name": "tokenProgram", "address": string }
      ],
      "args": []
    },
    {
      "name": "resolveDispute",
      "discriminator": number[],
      "accounts": [
        { "name": "config", "writable": true },
        { "name": "handshake", "writable": true },
        { "name": "vault", "writable": true },
        { "name": "vaultAuthority" },
        { "name": "creatorTokenAccount", "writable": true },
        { "name": "workerTokenAccount", "writable": true },
        { "name": "keepersPool", "writable": true },
        { "name": "commonsTreasury", "writable": true },
        { "name": "sourMint", "writable": true },
        { "name": "authority", "signer": true },
        { "name": "tokenProgram", "address": string }
      ],
      "args": [
        { "name": "ruling", "type": "u8" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "handshake",
      "discriminator": number[]
    },
    {
      "name": "protocolConfig",
      "discriminator": number[]
    }
  ],
  "events": [
    { "name": "HandshakeCreated", "discriminator": number[] },
    { "name": "HandshakeAccepted", "discriminator": number[] },
    { "name": "WorkDelivered", "discriminator": number[] },
    { "name": "HandshakeApproved", "discriminator": number[] },
    { "name": "HandshakeCancelled", "discriminator": number[] },
    { "name": "HandshakeDisputed", "discriminator": number[] },
    { "name": "DisputeResolved", "discriminator": number[] },
    { "name": "ConfigInitialized", "discriminator": number[] }
  ],
  "errors": [
    { "code": 6000, "name": "invalidStatus", "msg": "Handshake is not in the expected status for this operation" },
    { "code": 6001, "name": "notCreator", "msg": "Only the handshake creator can perform this action" },
    { "code": 6002, "name": "notWorker", "msg": "Only the assigned worker can perform this action" },
    { "code": 6003, "name": "notParticipant", "msg": "Only the creator or worker can perform this action" },
    { "code": 6004, "name": "selfHandshake", "msg": "Worker address cannot be the same as the creator" },
    { "code": 6005, "name": "zeroAmount", "msg": "Escrow amount must be greater than zero" },
    { "code": 6006, "name": "descriptionTooLong", "msg": "Description is too long (max 280 characters)" },
    { "code": 6007, "name": "deadlineInPast", "msg": "Deadline must be in the future" },
    { "code": 6008, "name": "handshakeExpired", "msg": "Handshake has expired past its deadline" },
    { "code": 6009, "name": "deadlineNotReached", "msg": "Handshake deadline has not yet passed" },
    { "code": 6010, "name": "invalidFeeShares", "msg": "Fee shares must sum to 10000 basis points" },
    { "code": 6011, "name": "invalidPinchBps", "msg": "Pinch fee basis points must be between 0 and 5000 (50%)" },
    { "code": 6012, "name": "insufficientEscrow", "msg": "Insufficient escrow balance for transfer" },
    { "code": 6013, "name": "invalidRuling", "msg": "Invalid dispute ruling — must be 0 (refund) or 1 (pay worker)" },
    { "code": 6014, "name": "notAuthority", "msg": "Only the protocol authority can perform this action" },
    { "code": 6015, "name": "mathOverflow", "msg": "Arithmetic overflow in fee calculation" }
  ],
  "types": [
    {
      "name": "HandshakeStatus",
      "type": {
        "kind": "enum",
        "variants": [
          { "name": "Created" },
          { "name": "Accepted" },
          { "name": "Delivered" },
          { "name": "Approved" },
          { "name": "Disputed" },
          { "name": "Cancelled" },
          { "name": "Resolved" },
          { "name": "Expired" }
        ]
      }
    }
  ]
};
