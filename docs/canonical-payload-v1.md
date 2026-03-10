# Canonical Payload v1

Last reviewed: 2026-03-10

## Purpose

Define the canonical, byte-stable message format used for Handshake signature generation and verification.

This document is the source of truth for payload construction before authoritative verification is implemented.

## Design goals

The payload format must be:

- deterministic
- human-readable
- versioned
- action-specific
- reconstructable outside the client
- safe to verify byte-for-byte

## General rules

### Encoding

- UTF-8 text
- newline-delimited records
- no extra blank lines
- no trailing spaces
- fields always appear in the same order

### Field formatting

- use `Label: Value` format
- labels are case-sensitive and fixed
- missing optional values should still be represented in a deterministic way

### Versioning

Every payload begins with:

- `SOUR Handshake`
- `Version: 1`
- `Action: ...`
- `Env: beta`

## Base header template

All payloads should begin with the same header block:

```text
SOUR Handshake
Version: 1
Action: <ACTION>
Env: beta
```

## Action templates

## `CREATE`

### Create canonical field order

```text
SOUR Handshake
Version: 1
Action: CREATE
Env: beta
Handshake ID: <uuid>
Creator: <wallet>
Counterparty: <wallet>
Title: <title>
Description: <description-or-empty>
Total Amount: <normalized-amount>
Deadline: <iso8601>
Milestone Hash: <sha256-or-placeholder>
Timestamp: <iso8601>
```

### Notes

- `Handshake ID` must be generated before signing
- `Description` should be an empty string if omitted
- `Total Amount` must be normalized consistently before signing
- `Milestone Hash` is preferred over embedding the full milestone block in v1

## `ACCEPT`

### Accept canonical field order

```text
SOUR Handshake
Version: 1
Action: ACCEPT
Env: beta
Handshake ID: <uuid>
Counterparty: <wallet>
Timestamp: <iso8601>
```

## `APPROVE_MILESTONE`

### Approve milestone canonical field order

```text
SOUR Handshake
Version: 1
Action: APPROVE_MILESTONE
Env: beta
Handshake ID: <uuid>
Milestone ID: <uuid-or-stable-id>
Milestone Index: <integer>
Milestone Title: <title>
Signer: <wallet>
Role: <creator|counterparty>
Timestamp: <iso8601>
```

## `CANCEL`

### Cancel canonical field order

```text
SOUR Handshake
Version: 1
Action: CANCEL
Env: beta
Handshake ID: <uuid>
Signer: <wallet>
Timestamp: <iso8601>
```

## Normalization rules

### Wallet addresses

- base58 strings
- no trimming after canonicalization
- UI should trim before payload construction

### Amounts

Amounts should be normalized to a deterministic string representation before signing.

Recommended rule:

- parse as decimal number
- preserve numeric value only
- serialize without currency suffix
- avoid locale formatting

Examples:

- `100`
- `100.5`
- `0.25`

Avoid:

- `100 SOUR`
- `1,000`
- locale-specific separators

### Deadlines and timestamps

- ISO 8601 UTC string
- always generated as full timestamp
- verification compares exact signed value plus business rules

### Description

- if absent, serialize as an empty string
- do not omit the label

## Milestone hash v1

For `CREATE`, milestone content should be canonicalized separately and hashed.

### Canonical milestone source string

Recommended normalized serialization before hashing:

```text
1|<title>|<amount>
2|<title>|<amount>
3|<title>|<amount>
```

Rules:

- milestones sorted by their final index
- title trimmed before serialization
- amount normalized with the same rules as total amount
- newline-delimited rows

### Hash algorithm

Recommended:

- SHA-256 hex string

## Verification contract

Verification must rebuild the exact canonical string server-side from request data and persisted state context where relevant.

A signature is valid only if:

- the canonical string reconstructed by the verification layer exactly matches the signed payload
- the signature verifies for the claimed signer wallet
- the payload is allowed for the current handshake state

## Immediate implementation implications

### Code areas likely affected

- `lib/handshake-signing.ts`
- future shared payload builder/parser module
- verification function implementation

### Migration note

Current message builders are Phase 1 human-readable templates. They should be migrated to this v1 canonical structure before authoritative verification is introduced.
