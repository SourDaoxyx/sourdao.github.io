# Verification Boundary Decision

Last reviewed: 2026-03-10

## Purpose

Decide where authoritative Handshake signature verification should happen before production writes are accepted.

## Why this decision exists

Today, the client collects signatures and sends data into the persistence layer. That is good enough for a beta prototype, but not strong enough for a verification-first beta.

The system needs a boundary outside the browser that can:

- reconstruct canonical payload bytes
- verify signatures against claimed wallets
- validate actor authorization and handshake state
- reject malformed or replayed actions before storage becomes truth

## Current constraints

- the frontend is deployed as a static export on GitHub Pages
- there is no always-on Next.js server runtime in the current deployment model
- Supabase is already part of the live architecture
- any chosen solution should not overcomplicate near-term operations
- future migration toward stronger protocol enforcement should remain possible

## Evaluation criteria

The chosen verification boundary should score well on:

- deployment fit
- operational simplicity
- security isolation from the client
- ability to verify canonical payloads deterministically
- good logging / audit potential
- compatibility with static frontend delivery
- migration path toward stronger enforcement later

## Option A — Supabase Edge Function

### Option A description

Move write-capable Handshake actions behind Edge Functions. The browser sends action payload + signature to the function. The function verifies signature, checks state, then performs the write.

### Option A pros

- fits naturally with a static frontend
- keeps verification outside the client
- close to Supabase data and policies
- easy place to centralize logs and idempotency handling
- reduces direct browser-to-table write authority

### Option A cons

- introduces function deployment and operational surface
- requires careful payload reconstruction and shared canonicalization logic
- debugging may be split across UI and Supabase runtime

### Option A fit assessment

**Strong fit** for the current deployment model.

## Option B — Dedicated Next.js server endpoint

### Option B description

Use a server-side endpoint to verify actions and then write to storage.

### Option B pros

- clean application-level service boundary
- flexible business logic composition
- good long-term ergonomics if the app moves away from pure static export

### Option B cons

- poor fit for the current GitHub Pages static deployment model
- effectively requires a deployment model change or an auxiliary backend
- increases infrastructure decision complexity right now

### Option B fit assessment

**Weak fit for current deployment**, stronger fit only if hosting architecture changes.

## Option C — Hybrid verification service

### Option C description

Use a separate lightweight verification layer or mixed model where some checks happen in one service and writes in another.

### Option C pros

- maximum flexibility
- can be designed around future protocol evolution

### Option C cons

- highest complexity
- overkill for current product maturity
- more room for inconsistent logic between layers

### Option C fit assessment

**Not recommended as the first hardening step**.

## Recommended decision

### Recommendation

Adopt **Supabase Edge Function** as the first authoritative verification boundary.

### Why

It best matches the current architecture:

- static frontend remains unchanged
- verification moves outside the client
- storage and verification stay close together
- implementation can remain incremental and low-risk

### What this does not solve yet

- full escrow enforcement
- on-chain settlement guarantees
- long-term protocol neutrality between storage backends

That is acceptable because the current goal is to harden the beta, not to finish the final protocol architecture in one jump.

## Proposed near-term architecture

### New request flow

1. client builds canonical payload
2. wallet signs canonical payload
3. client sends action request to verification function
4. verification function reconstructs payload and verifies signature
5. verification function checks authorization, state, and idempotency
6. verification function writes accepted action to Supabase
7. UI receives normalized success or error result

## Required supporting decisions

Before implementation, the following must be frozen:

- canonical payload format versioning
- action error vocabulary
- idempotency keys per action
- message-to-storage field mapping
- audit log strategy for accepted and rejected actions

## Initial implementation sequence

1. create canonical payload version spec
2. implement `CREATE` verification path first
3. implement `ACCEPT`
4. implement `APPROVE_MILESTONE`
5. implement `CANCEL`
6. remove direct table-write assumptions from UI helpers

## Decision status

Proposed and recommended for implementation planning.
