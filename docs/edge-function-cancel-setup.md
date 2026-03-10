# CANCEL Edge Function Setup

Last reviewed: 2026-03-10

## Purpose

Bootstrap the authoritative remote verification path for Handshake `CANCEL`.

## Files added

- `supabase/functions/verify-cancel-handshake/index.ts`
- `supabase/functions/_shared/cancel-contract.ts`

## What this function does

The function receives a signed `CANCEL` request, then:

1. loads the target handshake from Supabase
2. validates current state and signer membership
3. rebuilds the canonical cancel payload
4. verifies the signer signature
5. updates the handshake to `cancelled`
6. writes the cancel system message
7. returns the updated handshake row

## Required Supabase secrets

Configure these in the Supabase project that will host the function:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Client configuration

Set the public cancel verifier URL at build time:

- `NEXT_PUBLIC_HANDSHAKE_CANCEL_REMOTE_VERIFIER_URL`
- `NEXT_PUBLIC_HANDSHAKE_CANCEL_VERIFIER_MODE`

Recommended modes:

- `auto` during rollout
- `remote` after the function is deployed and validated

## Rollout note

The browser-side service currently supports three modes for `CANCEL`:

- `local` — always verify in-browser and persist from the client
- `auto` — try remote verification first, then fall back to local verification
- `remote` — require the remote verifier to succeed

## Important implementation note

The cancel verifier does not trust client-provided state. It binds the signature only to:

- handshake id
- signer wallet
- action timestamp

and derives cancelability from persisted handshake state.

## Next steps

- deploy the cancel Edge Function to the live Supabase project
- set `NEXT_PUBLIC_HANDSHAKE_CANCEL_REMOTE_VERIFIER_URL`
- smoke test `CANCEL` in `auto` mode
- switch to `remote` mode once stable
- add shared audit / idempotency logging across all actions
