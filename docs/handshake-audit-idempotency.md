# Handshake Audit and Idempotency

Last reviewed: 2026-03-10

## Purpose

Define the first shared audit and duplicate-action strategy for Handshake Edge Functions.

## What was added

### Database migration

- `supabase/migrations/20260310_handshake_action_logs.sql`

This creates `public.handshake_action_logs` for accepted and rejected action records.

### Shared function helper

- `supabase/functions/_shared/action-audit.ts`

This helper provides:

- SHA-256 action hashing from the signed message
- deterministic dedupe key generation
- duplicate lookup by dedupe key
- accepted / rejected log writing

## Dedupe key format

The current dedupe key shape is:

```text
ACTION:HANDSHAKE_ID:MILESTONE_ID_OR_DASH:SIGNER_WALLET:ACTION_HASH
```

Where:

- `ACTION_HASH = sha256(signedMessage)`
- `MILESTONE_ID_OR_DASH` is `-` for non-milestone actions

## Current behavior

The remote verifier functions now do two extra things:

1. look up an existing action log with the same dedupe key
2. write an accepted or rejected audit record whenever possible

This now applies to:

- `CREATE`
- `ACCEPT`
- `APPROVE_MILESTONE`
- `CANCEL`

## Important operational note

The audit helper is intentionally soft-fail for now:

- if the audit table is missing or insert fails, the function logs a warning
- action persistence is not blocked solely by audit-log failure

That keeps rollout safer while the migration is being introduced.

## What this solves

- basic duplicate-action detection for remote requests
- a shared place to inspect accepted vs rejected actions
- a consistent action fingerprint across all implemented Handshake actions

## What it does not solve yet

- strict fail-closed audit guarantees
- replay protection across local-only verification mode
- cross-action correlation or analytics views
- retention / pruning rules for audit data

## Next steps

- apply the new Supabase migration in the target project
- validate duplicate behavior against the deployed Edge Functions
- decide whether audit-log failure should remain soft-fail or become hard-fail
- add shared response metadata so the UI can surface dedupe / audit references if needed
