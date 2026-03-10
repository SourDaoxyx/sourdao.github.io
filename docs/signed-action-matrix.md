# Handshake Signed Action Matrix

Last reviewed: 2026-03-10

## Purpose

This document translates the security model into an implementation-facing matrix for each signed Handshake action.

## Scope

Current actions covered:

- create handshake
- accept handshake
- approve milestone
- cancel handshake

## Common invariants

Every signed action should satisfy these invariants before a write is accepted:

- the payload is canonical and byte-stable
- the signature verifies against the claimed signer wallet
- the signer is authorized for the action
- the action is valid for the current handshake state
- the action has not already been consumed or superseded
- the server/verification layer derives truth from stored state, not only from client claims

## Matrix

| Action | Signer | Signed fields | Required state | Verification checks | Reject reasons |
| --- | --- | --- | --- | --- | --- |
| `CREATE` | Creator | version, action, handshake id, creator wallet, counterparty wallet, title, description hash or description, total amount, deadline, milestone hash, timestamp | no existing handshake with same id | signer == creator; creator != counterparty; handshake id unique; deadline in future; total amount equals milestone sum; signed payload matches submitted payload | invalid signature; signer mismatch; duplicate handshake id; malformed payload; invalid counterparty; invalid deadline; amount mismatch |
| `ACCEPT` | Counterparty | version, action, handshake id, counterparty wallet, timestamp | handshake exists and status is `created` | signer == counterparty; handshake id exists; actor matches stored counterparty; payload action references same handshake; action not already accepted | invalid signature; signer mismatch; handshake missing; stale state; duplicate accept |
| `APPROVE_MILESTONE` | Creator or Counterparty | version, action, handshake id, milestone id or milestone index, milestone title snapshot, signer wallet, signer role, timestamp | handshake exists and status is `active`; milestone belongs to handshake; milestone not fully approved | signer belongs to handshake; signer role matches stored party; milestone maps to handshake; approval column for signer not already true; payload matches milestone snapshot | invalid signature; unauthorized actor; stale state; milestone mismatch; duplicate approval |
| `CANCEL` | Creator or Counterparty | version, action, handshake id, signer wallet, timestamp | handshake exists and product rules still allow cancellation | signer belongs to handshake; cancellation window still valid; current state is cancellable; action has not already been applied | invalid signature; unauthorized actor; stale state; already cancelled; cancellation forbidden |

## Canonical payload requirements

### Versioning

All future payloads should include:

- `Version`
- `Action`
- `Env`

This allows safe evolution of message templates without silent compatibility drift.

### Recommended canonical fields

The payload should include fields in a deterministic order with stable labels. Recommended base structure:

- `Version`
- `Action`
- `Env`
- `Handshake ID`
- action-specific fields
- `Timestamp`

### Milestone hashing

For create operations, the milestone list should be normalized and represented by one of:

- full canonical milestone block in the signed payload, or
- a deterministic milestone hash derived from canonical milestone serialization

The second option is usually easier to verify consistently if milestone lists become longer.

## Action-specific notes

### Create action notes

Create is the most important payload because it defines the agreement truth. The verification layer should treat this as the authoritative intent snapshot.

Recommended additions beyond current beta:

- version field
- environment field
- description hash or exact description value
- milestone hash

### Accept action notes

Accept should not trust any client-provided creator or title fields. It only needs enough data to bind the signer to the specific existing handshake.

### Approve milestone action notes

The approval payload should bind to a stable milestone identifier. Using only title and index is weaker than using a persistent milestone id plus handshake id.

### Cancel action notes

Cancel should use product rules that are derived from persisted handshake state, not from the client payload.

## Idempotency and replay guidance

### Create

- natural dedupe key: `handshake_id`

### Accept

- dedupe key: `handshake_id + action + signer`

### Approve milestone

- dedupe key: `handshake_id + milestone_id + signer + action`

### Cancel

- dedupe key: `handshake_id + action + signer`

## Recommended error vocabulary

To keep UI and service behavior predictable, use a stable set of error classes:

- `INVALID_SIGNATURE`
- `SIGNER_MISMATCH`
- `UNAUTHORIZED_ACTOR`
- `HANDSHAKE_NOT_FOUND`
- `INVALID_STATE`
- `DUPLICATE_ACTION`
- `PAYLOAD_MISMATCH`
- `INVALID_INPUT`

## Immediate implementation implications

From this matrix, the next engineering tasks are:

1. freeze canonical payload versions
2. choose the verification boundary
3. move write acceptance behind verification
4. attach idempotency rules to storage design
