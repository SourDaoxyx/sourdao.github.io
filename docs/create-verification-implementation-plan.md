# CREATE Verification Implementation Plan

Last reviewed: 2026-03-10

## Goal

Implement the first authoritative Handshake verification path for the `CREATE` action.

This is the first and most important hardening step because `CREATE` defines the agreement truth snapshot.

## Scope

This plan covers:

- canonical payload v1 adoption for `CREATE`
- verification boundary behavior
- required validations before persistence
- rollout sequence

It does not yet implement:

- `ACCEPT`
- `APPROVE_MILESTONE`
- `CANCEL`
- full audit log system

## High-level flow

1. UI collects agreement inputs
2. UI normalizes create payload fields
3. UI computes milestone hash
4. UI builds canonical payload v1
5. wallet signs canonical payload
6. UI sends signed request to verification boundary
7. verification layer reconstructs canonical payload
8. verification layer verifies signature and business rules
9. verification layer writes handshake + milestones + initial system message
10. verification layer returns normalized result

## Required request contract

Recommended request shape:

```ts
interface CreateHandshakeRequest {
  action: "CREATE";
  payloadVersion: 1;
  signedMessage: string;
  signature: string;
  creatorWallet: string;
  counterpartyWallet: string;
  title: string;
  description: string;
  deadline: string;
  milestones: Array<{
    index: number;
    title: string;
    amount: string;
  }>;
  totalAmount: string;
  handshakeId: string;
  timestamp: string;
}
```

## Required validations

### Input validation

- creator wallet is valid base58 public key
- counterparty wallet is valid base58 public key
- creator != counterparty
- title is non-empty and within product limits
- deadline is a valid ISO string in the future
- milestones list is non-empty
- each milestone has non-empty title
- each milestone amount is valid and positive
- total amount equals normalized milestone sum
- handshake id is valid UUID format

### Verification validation

- canonical payload rebuilt from request exactly matches `signedMessage`
- signature verifies against `creatorWallet`
- milestone hash matches normalized milestone list
- handshake id is not already used

### Persistence validation

- write is treated as atomic as far as possible
- handshake record and milestone records are not left half-created silently
- failure path returns clear error class

## Error vocabulary for `CREATE`

Recommended normalized errors:

- `INVALID_INPUT`
- `INVALID_SIGNATURE`
- `SIGNER_MISMATCH`
- `PAYLOAD_MISMATCH`
- `DUPLICATE_ACTION`
- `INVALID_STATE`
- `PERSISTENCE_ERROR`

## Suggested code changes

### Frontend / shared logic

Files likely affected:

- `lib/handshake-signing.ts`
- `components/handshake/HandshakeApp.tsx`

Changes:

- replace current create message builder with canonical payload v1 builder
- add milestone hash utility
- stop letting UI call raw create persistence directly once verification boundary exists

### Verification boundary

Likely target:

- Supabase Edge Function

Responsibilities:

- parse request
- normalize request data
- reconstruct canonical payload
- verify signature
- validate business rules
- persist accepted action
- return normalized response

### Storage layer

Files likely affected later:

- `lib/handshake-store.ts`
- future `lib/handshake-service.ts`

Changes:

- separate raw DB write helper from public action entrypoint
- make verification boundary the owner of write acceptance

## Rollout order

### Step 1

Implement canonical payload builder for `CREATE` in shared code.

### Step 2

Implement milestone hash helper and deterministic amount normalization.

### Step 3

Implement verification boundary endpoint/function for `CREATE` only.

### Step 4

Wire UI create flow to verification boundary.

### Step 5

Return normalized success/error results and update UI to surface them clearly.

### Step 6

Only after `CREATE` is stable, repeat pattern for remaining actions.

## Test matrix for `CREATE`

### Success cases

- valid payload + valid signature + valid milestones
- description omitted but canonicalized as empty string
- decimal amounts normalized correctly

### Failure cases

- wrong signer wallet
- tampered title after signing
- tampered deadline after signing
- milestone hash mismatch
- creator equals counterparty
- duplicate handshake id
- invalid amount total
- malformed UUID
- expired or past deadline

## Definition of done

`CREATE` verification is ready when:

- the create action uses canonical payload v1
- signature verification happens outside the client
- writes are rejected on signature or payload mismatch
- successful creates still produce handshake + milestones correctly
- tests cover both valid and invalid create paths
