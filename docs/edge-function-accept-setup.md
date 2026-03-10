# ACCEPT Edge Function Setup

Last reviewed: 2026-03-10

## Purpose

Bootstrap the authoritative remote verification path for Handshake `ACCEPT`.

## Files added

- `supabase/functions/verify-accept-handshake/index.ts`
- `supabase/functions/_shared/accept-contract.ts`

## What this function does

The function receives a signed `ACCEPT` request, then:

1. loads the target handshake from Supabase
2. validates current state and signer identity
3. rebuilds the canonical accept payload
4. verifies the counterparty signature
5. updates the handshake from `created` to `active`
6. writes the initial accept system message
7. returns the updated handshake row

## Required Supabase secrets

Configure these in the Supabase project that will host the function:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Client configuration

Set the public accept verifier URL at build time:

- `NEXT_PUBLIC_HANDSHAKE_ACCEPT_REMOTE_VERIFIER_URL`
- `NEXT_PUBLIC_HANDSHAKE_ACCEPT_VERIFIER_MODE`

Recommended modes:

- `auto` during rollout
- `remote` after the function is deployed and validated

## Rollout note

The browser-side service currently supports three modes for `ACCEPT`:

- `local` — always verify in-browser and persist from the client
- `auto` — try remote verification first, then fall back to local verification
- `remote` — require the remote verifier to succeed

## Important implementation note

The accept verifier does not trust client-provided creator, title, or handshake state. It binds the signature only to:

- handshake id
- stored counterparty wallet
- action timestamp

and derives the rest from persisted state.

## Next steps

- deploy the accept Edge Function to the live Supabase project
- set `NEXT_PUBLIC_HANDSHAKE_ACCEPT_REMOTE_VERIFIER_URL`
- smoke test `ACCEPT` in `auto` mode
- switch to `remote` mode once stable
- extend the same verify-and-write model to `APPROVE_MILESTONE` and `CANCEL`

