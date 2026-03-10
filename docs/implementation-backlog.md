# Implementation Backlog

Last reviewed: 2026-03-10

## Objective

Convert the documentation phase into an implementation-ready backlog for the next engineering sprint.

## P0 — Must do first

### 1. Freeze canonical payloads

Files likely affected:

- `lib/handshake-signing.ts`
- future shared payload contract file

Tasks:

- add payload version field
- add action field
- add environment field
- define canonical field order
- define milestone canonicalization or milestone hash strategy

Definition of done:

- all Handshake actions have a stable canonical payload contract
- payload format is documented and testable

### 2. Add authoritative verification boundary

Likely target:

- Supabase Edge Function(s)

Tasks:

- verify signature against claimed signer
- reconstruct canonical payload server-side
- validate action-specific business rules
- reject malformed or stale actions before writes are accepted

Definition of done:

- direct write trust no longer depends only on the client

### 3. Implement action-by-action verification

Order:

1. `CREATE`
2. `ACCEPT`
3. `APPROVE_MILESTONE`
4. `CANCEL`

Definition of done:

- each action has explicit verify-and-write logic
- error vocabulary is normalized

## P1 — Should follow immediately after P0

### 4. Split storage and business logic

Files likely affected:

- `lib/handshake-store.ts`
- new `lib/handshake-service.ts`
- new `lib/handshake-types.ts` or feature-local type file

Tasks:

- move raw CRUD into repo/storage layer
- move state transitions into service layer
- stop treating UI as the source of business truth

### 5. Add idempotency and duplicate-action protection

Tasks:

- define per-action dedupe key
- store action hash or action log metadata
- reject duplicate accept/approve/cancel actions cleanly

### 6. Add input validation at the service boundary

Tasks:

- validate addresses
- prevent creator == counterparty
- validate deadline
- validate milestone totals
- validate milestone ownership and role mapping

## P2 — Testing and rollout safety

### 7. Add verification-path tests

Test categories:

- valid signature accepted
- invalid signature rejected
- wrong signer rejected
- stale state rejected
- duplicate action rejected
- payload mismatch rejected

### 8. Add integration tests for critical flows

Coverage targets:

- create handshake
- accept handshake
- approve milestone
- cancel handshake
- failure-mode UX messaging

### 9. Add audit visibility

Tasks:

- define accepted action logging
- define rejected action logging
- decide how much audit detail is safe to persist

## P3 — Supporting cleanup

### 10. Refactor large UI orchestrators

Files likely affected:

- `components/handshake/HandshakeApp.tsx`
- `components/crust/CrustApp.tsx`

Tasks:

- extract form/detail/list components
- extract action hooks
- reduce view/business logic coupling

### 11. Anchor build normalization

Tasks:

- align Anchor Rust / TS / CLI version strategy
- classify tooling noise vs real issues
- clean ambiguous exports and minor warnings

### 12. Documentation sync

Tasks:

- finish README truth alignment
- keep security docs in sync with implementation changes
- add references between docs in `docs/`

## Suggested implementation order

### Phase A

- canonical payload versioning
- `CREATE` verification path
- normalized error vocabulary

### Phase B

- `ACCEPT` / `APPROVE_MILESTONE` / `CANCEL`
- idempotency rules
- storage/service split

### Phase C

- tests
- audit logging
- UI refactor
- docs sync

## Definition of readiness

Engineering implementation can start when:

- payload contract is frozen
- verification boundary is chosen
- first action path (`CREATE`) has a concrete implementation plan
- test expectations are defined
