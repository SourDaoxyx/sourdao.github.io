# Handshake Security Model v0

Last reviewed: 2026-03-10

## Status

This document describes the **current beta security model** of the live Handshake product and the intended hardening path.

The live Handshake experience is currently:

- non-custodial
- off-chain
- wallet-signed
- Supabase-persisted
- **not yet enforced by on-chain escrow logic**

## Security goal

The Handshake beta should guarantee that:

- the claimed actor actually signed the action payload
- the signed payload matches the stored agreement intent
- only authorized parties can create, accept, approve, or cancel a handshake
- stale or replayed actions are rejected
- database writes do not become the system of truth without verification

## Actors

### Creator

The party proposing the agreement.

### Counterparty

The party reviewing and accepting the agreement.

### Client application

The browser UI that builds messages, requests wallet signatures, and submits payloads.

### Verification layer

A future authoritative layer that must verify signature, payload integrity, actor role, and handshake state before writes are accepted.

### Database layer

Supabase storage for handshakes, milestones, and message logs.

### Future on-chain layer

Anchor programs intended for later escrow / settlement enforcement.

## Current live trust boundaries

### Trusted today

- wallet adapter returns a signature from the connected wallet
- UI builds messages in a deterministic format
- database accepts valid-shaped writes

### Not yet authoritative

- signature verification on the live write path
- replay protection guarantees
- state transition enforcement outside client logic and DB conditions
- on-chain settlement or escrow guarantees

## Signed actions

### Create handshake

Current inputs include:

- handshake id
- creator wallet
- counterparty wallet
- title
- total amount
- deadline
- timestamp

### Accept handshake

Current inputs include:

- handshake id
- counterparty wallet
- timestamp

### Approve milestone

Current inputs include:

- handshake id
- milestone index
- milestone title
- approver wallet
- timestamp

### Cancel handshake

Current inputs include:

- handshake id
- actor wallet
- timestamp

## Required verification contract

Every write-capable action should be accepted only if all conditions pass.

### Common checks

- signature decodes successfully
- message bytes match the canonical payload exactly
- signature verifies against the claimed wallet public key
- wallet is authorized for the requested action
- action is valid for the current handshake state
- action has not already been consumed or superseded

### Create checks

- signer must equal `creator_wallet`
- creator and counterparty must be different addresses
- title, deadline, amount, and milestone values must match the signed payload
- handshake id must be unique
- deadline must be in the future
- total amount must match the milestone sum

### Accept checks

- signer must equal `counterparty_wallet`
- handshake must exist
- handshake status must still be `created`
- accepted handshake id must match the signed handshake id exactly

### Milestone approval checks

- signer must be creator or counterparty for the handshake
- milestone must belong to the handshake
- milestone must not already be fully approved
- actor role must map correctly to the approval column being written
- approval payload must identify the same milestone being mutated

### Cancel checks

- signer must be creator or counterparty
- handshake must still be cancellable under product rules
- cancel request must target the current handshake state

## Replay protection requirements

Replay protection is currently weak and should be hardened.

### Minimum acceptable safeguards

- unique handshake id for create
- state-checked action application
- per-action idempotency guard where possible

### Recommended safeguards

- canonical action hash stored with each verified action
- dedupe on `(handshake_id, action_type, signer, action_hash)`
- bounded timestamp freshness for actions that should not be replayable indefinitely
- optional nonce or revision number for mutable workflows

## Canonical message design requirements

The signed message format should be treated as a contract.

It should be:

- deterministic
- human-readable
- versioned
- explicit about actor and action type
- explicit about the object being changed

Recommended future addition:

- `Version: 1`
- `Action: CREATE | ACCEPT | APPROVE_MILESTONE | CANCEL`
- `Chain/Env: mainnet | devnet | beta`

## Failure handling requirements

On verification failure, the system should reject writes and return precise failure reasons such as:

- invalid signature
- signer mismatch
- stale state
- duplicate action
- malformed payload
- unauthorized actor

## Current beta limitations

The current beta should be described honestly with the following constraints:

- signatures are collected client-side
- authoritative verification is not yet guaranteed in the live write path
- agreement execution is reputation-based, not escrow-enforced
- on-chain Anchor programs exist but do not currently enforce production Handshake beta actions

## Recommended implementation path

### Phase 1

Document and freeze the canonical signed payload shapes.

### Phase 2

Introduce a verification boundary outside the client before accepting writes.

### Phase 3

Move write orchestration behind a service boundary so UI cannot directly define business truth.

### Phase 4

Bridge verified off-chain intent into stronger settlement or on-chain enforcement.

## Decision still open

Technology choice for the verification boundary is intentionally deferred.

Candidate approaches:

- Supabase Edge Function
- dedicated Next.js server endpoint / server action equivalent
- hybrid verification service

Selection should be based on deployment fit, operational simplicity, secret handling, and long-term migration toward stronger protocol enforcement.
