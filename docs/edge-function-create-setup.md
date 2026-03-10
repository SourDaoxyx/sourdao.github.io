# CREATE Edge Function Setup

Last reviewed: 2026-03-10

## Purpose

Bootstrap the first authoritative remote verification path for Handshake `CREATE`.

## Files added

- `supabase/functions/verify-create-handshake/index.ts`
- `supabase/functions/_shared/create-contract.ts`

## What this function does

The function receives a signed `CREATE` request, then:

1. validates the request shape
2. rebuilds the canonical payload using the submitted fields
3. verifies the creator signature against the claimed wallet
4. rejects duplicate handshake IDs
5. writes the handshake, milestones, and initial system message via service-role access
6. returns the created handshake row

## Required Supabase secrets

Configure these in the Supabase project that will host the function:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Client configuration

Set the public verifier URL at build time:

- `NEXT_PUBLIC_HANDSHAKE_REMOTE_VERIFIER_URL`
- `NEXT_PUBLIC_HANDSHAKE_CREATE_VERIFIER_MODE`

Recommended modes:

- `auto` during rollout
- `remote` after the function is deployed and validated

## Expected endpoint shape

The frontend remote verifier currently expects a JSON response like:

```ts
{
  ok: true,
  persistence: "remote",
  handshake: HandshakeRow
}
```

and normalized failures like:

```ts
{
  ok: false,
  code: "INVALID_INPUT" | "INVALID_SIGNATURE" | "PAYLOAD_MISMATCH" | "DUPLICATE_ACTION" | "PERSISTENCE_ERROR",
  message: string
}
```

## Rollout note

The browser-side service currently supports three modes:

- `local` — always verify in-browser and persist from the client
- `auto` — try remote verification first, then fall back to local verification
- `remote` — require the remote verifier to succeed

## Important implementation note

The remote verifier now depends on `prepared.timestamp` being included in the signed create payload. Without that timestamp, the function would not be able to deterministically reconstruct the canonical message.

## Next steps

- deploy the Edge Function to the live Supabase project
- set `NEXT_PUBLIC_HANDSHAKE_REMOTE_VERIFIER_URL`
- smoke test `CREATE` in `auto` mode
- switch to `remote` mode once stable
- extend the same verify-and-write model to `ACCEPT`, `APPROVE_MILESTONE`, and `CANCEL`
