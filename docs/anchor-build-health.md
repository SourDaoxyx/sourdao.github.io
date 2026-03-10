# Anchor Build Health

Last reviewed: 2026-03-10

## Summary

The Anchor workspace is promising but currently has version-friction and tooling-noise signals that should be normalized before it becomes part of the main implementation narrative.

## Confirmed version picture

### Rust program crates

Both program crates currently declare:

- `anchor-lang = "0.30.1"`
- `anchor-spl = "0.30.1"`

### Node / TypeScript workspace

The root package currently declares:

- `@coral-xyz/anchor = ^0.32.1`
- `@coral-xyz/anchor-cli = ^0.31.2`

### Risk

This means the repository spans multiple Anchor version families across:

- Rust macros and crates
- TypeScript client library
- CLI expectations
- editor diagnostics / cargo tooling behavior

## Current signal categories

### Likely real issues to investigate

- cross-version Anchor mismatch between Rust and TypeScript tooling
- possible macro/tooling incompatibility causing noisy `cfg` diagnostics
- ambiguous glob re-exports in instruction modules
- small cleanup issues such as unused imports

### Likely tooling/editor noise

Diagnostics such as:

- `unexpected cfg condition value: anchor-debug`
- `unexpected cfg condition value: custom-heap`
- `unexpected cfg condition value: custom-panic`
- `unexpected cfg condition value: solana`

may be produced by local editor/check-cfg behavior rather than representing immediate runtime failures.

They still matter, because they reduce signal quality for future development.

## Severity classification

### Blocker

None confirmed yet from this review alone.

### Should fix soon

- version alignment strategy across Anchor Rust / TS / CLI
- ambiguous glob re-export cleanup
- deterministic local build-health verification process

### Can fix later

- low-priority lint cleanup
- warning volume reduction after version alignment is resolved

## Why this matters

The Anchor workspace is currently part of the repo's long-term protocol credibility, even if it is not yet the live enforcement layer.

If the workspace appears noisy or partially misaligned:

- contributors will distrust the toolchain
- warnings will hide real regressions
- protocol claims in docs will feel less credible

## Recommended plan

### Step 1

Choose an Anchor version strategy:

- either align Rust, TS, and CLI around one compatible family
- or document a deliberate split with explicit reasons and local workflow instructions

### Step 2

Establish one canonical local health command set, for example:

- Rust build/check command
- Anchor test command
- TS test command

### Step 3

Clean instruction module exports and minor warnings so remaining noise is meaningful.

### Step 4

Only after the above, decide whether to expose the on-chain roadmap more prominently in top-level docs.

## Open questions

- Which Anchor CLI version is actually used locally by the maintainer?
- Are the current diagnostics reproducible in CI, or only in editor tooling?
- Is the intended future source of truth the Rust program IDL, the TS SDK, or both?

## Working conclusion

The Anchor workspace looks like a valid future track, but it should currently be treated as:

- **valuable**
- **real**
- **not yet the live enforcement layer**
- **in need of version and tooling normalization before broader expansion**
