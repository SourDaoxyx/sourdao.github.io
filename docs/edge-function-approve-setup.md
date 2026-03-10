# APPROVE_MILESTONE Edge Function Setup

Last reviewed: 2026-03-10

## Purpose

Bootstrap the authoritative remote verification path for Handshake `APPROVE_MILESTONE`.

## Files added

- `supabase/functions/verify-approve-milestone/index.ts`
- `supabase/functions/_shared/approve-contract.ts`

## What this function does

The function receives a signed `APPROVE_MILESTONE` request, then:

1. loads the target handshake and milestone from Supabase
2. validates handshake state, milestone ownership, and signer role
3. rebuilds the canonical milestone approval payload
4. verifies the approver signature
5. sets the signer-specific approval column
6. finalizes the milestone if both parties have approved
7. completes the handshake if all milestones are fully approved
8. returns whether all milestones are now approved

## Required Supabase secrets

Configure these in the Supabase project that will host the function:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Client configuration

Set the public approval verifier URL at build time:

- `NEXT_PUBLIC_HANDSHAKE_APPROVE_REMOTE_VERIFIER_URL`
- `NEXT_PUBLIC_HANDSHAKE_APPROVE_VERIFIER_MODE`

Recommended modes:

- `auto` during rollout
- `remote` after the function is deployed and validated

## Rollout note

The browser-side service currently supports three modes for `APPROVE_MILESTONE`:

- `local` — always verify in-browser and persist from the client
- `auto` — try remote verification first, then fall back to local verification
- `remote` — require the remote verifier to succeed

## Important implementation note

The approval verifier binds the signature to a stable milestone snapshot:

- handshake id
- milestone id
- milestone index
- milestone title
- signer wallet
- signer role
- action timestamp

This is stronger than trusting only client-provided title/index pairs during persistence.

## Next steps

- deploy the milestone approval Edge Function to the live Supabase project
- set `NEXT_PUBLIC_HANDSHAKE_APPROVE_REMOTE_VERIFIER_URL`
- smoke test `APPROVE_MILESTONE` in `auto` mode
- switch to `remote` mode once stable
- extend the same verify-and-write model to `CANCEL`
