# Implementation Roadmap

Last reviewed: 2026-03-10

## Objective

Move SOUR from a visually strong but partially enforced beta into a technically explicit, verification-first protocol beta.

## Principles

- document reality before expanding claims
- improve trust boundaries before adding surface area
- prefer small, reversible changes
- separate live beta truth from future on-chain roadmap

## P0

### Security and reality alignment

- publish current architecture notes
- publish Handshake security model
- correct README deployment and live-product descriptions
- stop describing live Handshake as if on-chain escrow already enforces it

### Verification design

- freeze canonical payload formats
- define action-by-action verification rules
- define replay protection requirements
- choose a verification boundary after design review

### Data integrity

- validate creator/counterparty identities
- validate milestone sums and deadline rules
- define idempotency and duplicate-action strategy
- review Supabase access rules against actual product behavior

## P1

### Service boundary

- split persistence helpers from business rules
- introduce a handshake service layer
- reduce direct UI ownership of state transitions

### UI maintainability

- split `HandshakeApp.tsx` into view and action modules
- split `CrustApp.tsx` into smaller panels/hooks
- centralize shared types

### Configuration hygiene

- centralize network and public config handling
- document static-export build-time constraints
- reduce config drift across `constants.ts`, `supabase.ts`, and docs

## P2

### Performance and cache

- cache expensive Crust inputs
- reduce repeated RPC history scans
- move leaderboard-heavy aggregation away from client-only execution

### Testing

- add verification-path tests
- add invalid-signature and stale-state tests
- add UI-to-storage integration test coverage for critical flows

## P3

### Stronger enforcement

- add authoritative verification to production write flows
- create audit trail / action log guarantees
- prepare migration path from signed beta to stronger protocol enforcement

### On-chain roadmap

- keep Anchor workspace healthy and buildable
- align protocol docs with actual adoption phase
- integrate on-chain settlement only after verification and product rules are stable

## Sprint sequence

### Sprint 1

- architecture truth docs
- security model v0
- Anchor build health review
- README correction draft

### Sprint 2

- verification boundary decision
- authorization matrix
- repo/service split design
- implementation-ready security backlog

### Sprint 3

- implementation backlog ordering
- test matrix
- docs sync for merge readiness
- Anchor cleanup ordering

## Definition of done for this roadmap phase

This roadmap phase is complete when:

- live system behavior is documented accurately
- verification strategy is specified clearly enough to implement without ambiguity
- Anchor workspace health issues are categorized by severity
- next implementation sprint can begin without re-discovering trust assumptions
