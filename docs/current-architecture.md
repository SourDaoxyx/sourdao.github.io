# Current Architecture

Last reviewed: 2026-03-10

## Executive summary

SOUR currently operates as a hybrid product:

- **Frontend:** Next.js static export deployed via GitHub Pages
- **Wallet layer:** Solana wallet-adapter (Phantom, Solflare)
- **Handshake Beta:** wallet-signed, off-chain agreements persisted in Supabase
- **Crust:** reputation score derived from on-chain reads plus Handshake-derived stats
- **Anchor programs:** present in-repo and tested locally, but **not** currently enforcing the live Handshake beta flow

This means the live product is **not yet an on-chain escrow system**. The production Handshake experience is an off-chain beta that uses wallet signatures as intent proofs.

## Deployment reality

### Live deployment

- Deploy target: **GitHub Pages**
- Build mode: `next build` with `output: "export"`
- Build workflow: `.github/workflows/deploy.yml`

### Practical consequence

Because the site is statically exported, all `NEXT_PUBLIC_*` values are resolved at build time. Runtime environment mutation is not available in the same way as a server-rendered deployment.

## Frontend structure

### App routes

- `/` — marketing / protocol landing page
- `/crust` — wallet-connected identity and score view
- `/crust/leaderboard` — leaderboard view
- `/crust/profile` — public profile style route
- `/handshake` — Handshake beta UI
- `/about`, `/whitepaper` — static content

### Shared runtime concerns

- `app/layout.tsx` provides fonts, metadata, language provider, analytics, and scroll helper
- most interactive protocol experiences are rendered client-side
- wallet-enabled feature pages are isolated behind dedicated wrappers

## Handshake Beta architecture

### Current flow

1. user fills agreement form in `HandshakeApp`
2. client normalizes agreement fields into canonical payload v1
3. wallet signs the payload using `signMessage`
4. UI submits signed Handshake actions through a service boundary
5. the service uses pluggable verifier paths for implemented actions:
   - local verifier by default
   - optional remote verifier adapters when configured
6. implemented actions currently following this path are:
   - `CREATE`
   - `ACCEPT`
   - `APPROVE_MILESTONE`
   - `CANCEL`
7. Crust reads aggregate handshake stats from Supabase-derived views/tables

### Source files

- UI orchestration: `components/handshake/HandshakeApp.tsx`
- wallet/provider wrapper: `components/handshake/HandshakeContent.tsx`
- signing helpers: `lib/handshake-signing.ts`
- service boundary: `lib/handshake-service.ts`
- verifier layer: `lib/handshake-verifier.ts`
- persistence and queries: `lib/handshake-store.ts`
- database client: `lib/supabase.ts`

### Important limitation

`CREATE`, `ACCEPT`, `APPROVE_MILESTONE`, and `CANCEL` now pass through a verifier layer and no longer rely purely on the raw UI-to-store path. However, the default production-safe posture is still transitional:

- local verification is available immediately in-browser
- remote verifier adapters are now scaffolded for `CREATE`, `ACCEPT`, `APPROVE_MILESTONE`, and `CANCEL`, but only become authoritative once real endpoints are deployed and configured

## Crust architecture

### Current score inputs

- token balance from Solana RPC
- first SOUR transaction age from Solana history scans
- loyalty proxy derived from time-in-protocol
- handshake completion stats from Supabase

### Crust source files

- UI orchestration: `components/crust/CrustApp.tsx`
- score engine: `lib/crust-score.ts`
- on-chain reads: `lib/solana.ts`
- constants and network config: `lib/constants.ts`

### Current trade-off

Crust score logic is reasonably well isolated, but input acquisition is still RPC-heavy and mostly client-side.

## Anchor workspace role

### What exists now

- `programs/sour-handshake` — escrow-oriented program with tests
- `programs/sour-treasury` — treasury-oriented program scaffold
- `tests/sour-handshake.ts` — local Anchor integration tests

### What it means today

The Anchor workspace is a **future protocol track** and a local development/test artifact. It should not currently be described as the enforcement layer of the live Handshake beta.

## Architectural risks

### High

- live Handshake writes are not yet gated by authoritative signature verification
- docs can easily overstate the current enforcement model
- static export increases configuration coupling at build time

### Medium

- `HandshakeApp.tsx` and `CrustApp.tsx` are large orchestration-heavy components
- Solana reads are RPC-expensive and mostly uncached
- Supabase client is public by necessity, so DB policy design matters significantly

### Low / accumulating

- README and implementation reality can drift
- Anchor workspace warnings increase maintenance noise
- config values are spread across multiple files

## Recommended architecture direction

### Short term

- document current beta honestly
- deploy the remote verifier endpoint and switch create writes to remote-authoritative mode
- move all implemented verifier adapters to real remote-authoritative deployment mode

### Mid term

- cache expensive Crust input reads
- modularize Handshake and Crust UI components
- centralize configuration and network mode handling

### Long term

- bridge verified off-chain agreements into an on-chain settlement/escrow model
- align product docs, security docs, and roadmap around that phased migration
