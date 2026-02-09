# MAYA: The Solidarity Marketplace Protocol

**Version 1.0 — June 2025**

> *"The old financial system is stale bread. We're here to start a new culture."*

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Problem Statement](#2-problem-statement)
3. [The Starter Culture Model](#3-the-starter-culture-model)
4. [Layer 1: Escrow Marketplace](#4-layer-1-escrow-marketplace)
5. [Proof-of-Value Bonds](#5-proof-of-value-bonds)
6. [Layer 2: Commons Treasury](#6-layer-2-commons-treasury)
7. [Revenue Model & Burn Mechanics](#7-revenue-model--burn-mechanics)
8. [Token Utility & Governance](#8-token-utility--governance)
9. [Security Architecture](#9-security-architecture)

**Appendices**
- [A: Escrow Contract Specification](#appendix-a-escrow-contract-specification)
- [B: Quadratic Voting Formula](#appendix-b-quadratic-voting-formula)
- [C: Burn Schedule Projections](#appendix-c-burn-schedule-projections)

---

## 1. Abstract

MAYA is a solidarity marketplace protocol built on Solana. It combines escrow-secured peer-to-peer service trading with an opt-in community treasury, creating a self-sustaining economic ecosystem where every trade strengthens the community.

Unlike speculative tokens, MAYA derives value from real marketplace activity. A 1–3% escrow fee on every trade generates protocol revenue, distributed across operations (50%), community treasury (30%), and permanent token buyback-and-burn (20%).

**Key Innovation**: MAYA bridges the gap between decentralized freelancing and mutual aid — a protocol where working together is more profitable than working alone.

---

## 2. Problem Statement

### 2.1 The Extraction Economy

Traditional freelance platforms extract 20–30% of every transaction:

| Platform | Fee Structure | Value Returned to Workers |
|----------|--------------|--------------------------|
| Fiverr | 20% seller fee | 0% ownership |
| Upwork | 10–20% sliding | 0% governance |
| TaskRabbit | 15% service fee | 0% reputation portability |

Workers build these platforms with their labor but receive zero ownership, zero governance rights, and zero portability of their hard-earned reputation.

### 2.2 The Memecoin Problem

Most community tokens launch with grand promises but deliver nothing:
- **Fake utility**: Staking rewards funded by new buyers (Ponzi dynamics)
- **No revenue**: Token value dependent entirely on speculation
- **Centralized control**: "Decentralized" in name only

### 2.3 MAYA's Thesis

**What if a token's value came from real economic activity?**

Not from staking yields. Not from referral bonuses. Not from "partnerships" that never materialize. From actual humans trading actual services, secured by actual smart contracts.

---

## 3. The Starter Culture Model

Like sourdough starter — a living culture that grows stronger with each feeding — MAYA is designed as a self-reinforcing economic loop.

### 3.1 Two-Layer Architecture

```
┌─────────────────────────────────────────┐
│         LAYER 2: COMMONS                │
│   Opt-in Treasury · DAO Governance      │
│   Revenue-Based Financing · Grants      │
├─────────────────────────────────────────┤
│         LAYER 1: MARKETPLACE            │
│   Escrow P2P Trading · Value Bonds      │
│   Reputation System · Fee Engine        │
└─────────────────────────────────────────┘
```

**Layer 1 (Marketplace)** handles the economic engine: escrow-secured trades, proof-of-value bonds, and the fee mechanism that generates protocol revenue.

**Layer 2 (Commons)** handles communal welfare: treasury governance, micro-loans, and community grants — all funded by Layer 1 revenue.

### 3.2 The Flywheel

```
More Users → More Trades → More Fees → More Burns + More Commons
     ↑                                            │
     └────────── Better Services ←─────────────────┘
```

Each trade simultaneously:
1. Generates revenue for the protocol
2. Burns tokens (increasing scarcity)
3. Funds the community treasury
4. Builds on-chain reputation for participants

---

## 4. Layer 1: Escrow Marketplace

### 4.1 Trade Lifecycle

```
[Buyer]                    [Escrow Contract]              [Seller]
   │                             │                           │
   ├── 1. Create Order ─────────►│                           │
   │      (deposit funds)        │                           │
   │                             │◄── 2. Accept Order ───────┤
   │                             │                           │
   │                             │    3. Deliver Work ───────►│
   │                             │                           │
   ├── 4. Confirm Delivery ─────►│                           │
   │                             │                           │
   │                             ├── 5. Release Funds ───────►│
   │                             │      (minus 1-3% fee)     │
   │                             │                           │
   │                             ├── 6. Fee Distribution ────►│
   │                             │      50% Ops              │
   │                             │      30% Commons          │
   │                             │      20% Burn             │
```

### 4.2 Fee Structure

| Trade Volume (30d) | Fee Rate | Rationale |
|-------------------|----------|-----------|
| < 1,000 USDC | 3% | Onboarding tier |
| 1,000–10,000 USDC | 2% | Growth tier |
| > 10,000 USDC | 1% | Power user tier |

Fees are calculated on the total trade value and deducted at the point of fund release.

### 4.3 Dispute Resolution

When parties disagree, a 3-of-5 arbiter panel resolves disputes:

1. **Arbiter Pool**: MAYA holders who stake tokens to qualify
2. **Random Selection**: 5 arbiters randomly chosen per dispute
3. **Evidence Period**: 72 hours for both parties to submit evidence
4. **Voting**: 3-of-5 majority determines outcome
5. **Arbiter Rewards**: Correct-side voters share a small arbiter fee

Arbiter stake acts as a bond — incorrect or negligent arbiters lose a portion of their stake.

### 4.4 Reputation System

Every completed trade generates an immutable reputation record:

```
ReputationScore = Σ(trade_value × completion_rate × time_factor)
```

Where:
- `trade_value` = normalized value of the trade (log scale)
- `completion_rate` = 1.0 for successful, 0.0 for disputed-and-lost
- `time_factor` = decay function favoring recent activity

Reputation is soul-bound (non-transferable) and lives on-chain, making it portable across any platform that reads Solana state.

---

## 5. Proof-of-Value Bonds

### 5.1 Concept

Proof-of-Value Bonds are prepaid work vouchers — forward contracts for future labor. A skilled worker can sell their future capacity at a discount, receiving capital upfront.

### 5.2 Bond Mechanics

```
Bond Structure:
├── issuer:        Worker's wallet address
├── denomination:  Service type + hours/deliverables
├── face_value:    Full price of the service
├── sale_price:    Discounted price (typically 80-90% of face)
├── expiry:        Maximum redemption date
├── escrow:        Held in protocol escrow until redemption
└── status:        Active | Redeemed | Expired | Refunded
```

**Example**: A web developer issues a bond for "10 hours of React development" with face value of 500 USDC, selling it for 425 USDC (15% discount). The buyer locks 425 USDC in escrow, and can redeem the bond within 90 days.

### 5.3 Secondary Market

Bonds are transferable SPL tokens, enabling a secondary market:
- Buyer purchases a bond but no longer needs the service → sells to another user
- Market price reflects the worker's reputation and demand
- Creates a liquid market for future labor

---

## 6. Layer 2: Commons Treasury

### 6.1 Funding

The Commons Treasury receives 30% of all protocol revenue automatically. No manual intervention. No governance vote needed to fund it — only to spend it.

### 6.2 Governance: Quadratic Voting

Treasury allocation decisions use quadratic voting to prevent plutocracy:

```
Voting Power = √(tokens_committed)
```

| Tokens Committed | Voting Power | Cost per Additional Vote |
|-----------------|--------------|------------------------|
| 1 | 1.00 | 1 token |
| 4 | 2.00 | 3 tokens |
| 9 | 3.00 | 5 tokens |
| 100 | 10.00 | 19 tokens |
| 10,000 | 100.00 | 199 tokens |

This means a whale with 10,000 tokens gets 100 votes, not 10,000 — dramatically leveling the playing field.

### 6.3 Revenue-Based Financing (RBF)

The Commons can issue micro-loans repaid as a percentage of future earnings:

```
Loan Terms:
├── principal:        Loan amount (from Commons)
├── repayment_cap:    Maximum total repayment (typically 1.3-1.5x principal)
├── revenue_share:    % of marketplace earnings directed to repayment
├── grace_period:     Months before repayment begins
└── max_term:         Maximum repayment period
```

**Example**: A baker receives a 1,000 USDC loan from Commons. They repay 10% of their marketplace earnings until they've repaid 1,300 USDC total (1.3x cap), or until the 24-month maximum term expires.

### 6.4 Grant Programs

The community can vote to fund:
- **Tool Grants**: Subsidize equipment for artisan workers
- **Education Grants**: Fund skill development courses
- **Emergency Fund**: Hardship relief for active community members
- **Protocol Development**: Fund new features and improvements

---

## 7. Revenue Model & Burn Mechanics

### 7.1 Revenue Distribution

```
Protocol Revenue (1-3% of GMV)
         │
         ├── 50% → Operations
         │         ├── Development team
         │         ├── Infrastructure costs
         │         └── Marketing & growth
         │
         ├── 30% → Commons Treasury
         │         ├── Community loans (RBF)
         │         ├── Grants
         │         └── Emergency fund
         │
         └── 20% → Buyback & Burn
                   ├── Market buy MAYA tokens
                   └── Send to burn address (permanent)
```

### 7.2 Burn Formula

Monthly burn amount is determined by marketplace activity:

```
Monthly_Burn = GMV × fee_rate × 0.20
```

Where GMV = Gross Marketplace Volume for the month.

### 7.3 Projected Burn Schedule

| Monthly GMV | Fee Rate | Monthly Revenue | Monthly Burn | Annual Burn |
|-------------|----------|----------------|-------------|-------------|
| $100K | 2.5% | $2,500 | $500 | $6,000 |
| $1M | 2.0% | $20,000 | $4,000 | $48,000 |
| $10M | 1.5% | $150,000 | $30,000 | $360,000 |
| $100M | 1.2% | $1,200,000 | $240,000 | $2,880,000 |

As marketplace volume grows, burn rate accelerates while fee rates decrease — benefiting both users and token holders.

### 7.4 Deflation vs. Inflation

MAYA has a fixed supply of 1 billion tokens with no minting capability. Every burn permanently reduces circulating supply. There is no inflation mechanism.

```
Circulating_Supply(t) = 1,000,000,000 - Σ(burns from t=0 to t)
```

---

## 8. Token Utility & Governance

### 8.1 Utility Matrix

| Function | Minimum Holding | Description |
|----------|----------------|-------------|
| Marketplace Access | Any amount | Place and accept orders |
| Governance Voting | 100 MAYA | Vote on proposals via Snapshot |
| Arbiter Eligibility | 1,000 MAYA | Stake to become dispute arbiter |
| Bond Issuance | 500 MAYA | Issue Proof-of-Value Bonds |
| Commons Borrowing | Active reputation | Apply for RBF micro-loans |
| Premium Features | 5,000 MAYA | Priority listing, analytics dashboard |

### 8.2 Governance Structure

**Phase 1 (Current)**: Core team multisig (3-of-5 Squads Protocol)
**Phase 2**: Snapshot.org off-chain voting for non-critical decisions
**Phase 3**: On-chain governance for treasury and protocol parameters
**Phase 4**: Full DAO — community controls all protocol parameters

### 8.3 What Governance Controls

- Fee rate adjustments (within 0.5–5% bounds)
- Commons Treasury spending proposals
- RBF loan parameters
- New feature prioritization
- Partnership approvals
- Emergency actions (circuit breakers)

---

## 9. Security Architecture

### 9.1 Smart Contract Security

- **Escrow contracts**: Open-source, audited, with time-locked upgrades
- **No admin keys**: Contract ownership renounced after deployment
- **Circuit breakers**: Emergency pause functionality (multisig controlled)
- **Bug bounty**: Ongoing program for responsible disclosure

### 9.2 Treasury Security

- **Squads Protocol**: 3-of-5 multisig for operational funds
- **Time locks**: 48-hour delay on treasury transactions > $10,000
- **Transparency**: All treasury movements visible on-chain
- **Progressive decentralization**: Multisig → DAO governance over time

### 9.3 User Security

- **Non-custodial**: Users always control their own wallets
- **Escrow isolation**: Each trade has its own escrow account
- **Dispute bonds**: Arbiters stake tokens, creating accountability
- **Rate limiting**: Anti-spam and anti-manipulation protections

### 9.4 Risk Factors

| Risk | Mitigation |
|------|-----------|
| Smart contract exploit | Audits + bug bounty + insurance fund |
| Low marketplace adoption | Minimal viable community approach |
| Regulatory uncertainty | No securities offering, pure utility token |
| Token price volatility | Revenue tied to GMV, not token price |
| Arbiter collusion | Random selection + stake slashing |

---

## Appendix A: Escrow Contract Specification

```
Program: maya_escrow_v1
Chain: Solana (Mainnet)

Instructions:
├── create_order(buyer, amount, description, deadline)
│   └── Creates PDA escrow account, transfers funds
│
├── accept_order(seller, order_id)
│   └── Locks seller commitment, starts deadline timer
│
├── submit_delivery(seller, order_id, proof_hash)
│   └── Records delivery proof on-chain
│
├── confirm_delivery(buyer, order_id)
│   └── Releases funds: (amount - fee) to seller
│   └── Distributes fee: 50% ops, 30% commons, 20% burn
│
├── open_dispute(party, order_id, evidence_hash)
│   └── Freezes funds, initiates arbiter selection
│
├── resolve_dispute(arbiter_panel, order_id, ruling)
│   └── 3-of-5 majority releases funds per ruling
│
└── cancel_order(buyer, order_id)
    └── Only before seller acceptance, full refund
```

---

## Appendix B: Quadratic Voting Formula

For a proposal P with N voters:

```
For each voter i:
  cost_i = votes_i²  (tokens locked)
  
Total voting power for proposal P:
  VP(P) = Σ √(tokens_committed_i) for all voters i who vote for P

Proposal passes when:
  VP(P) > VP(¬P)  AND  quorum ≥ 10% of circulating supply participation
```

### Sybil Resistance

Quadratic voting is susceptible to sybil attacks (splitting tokens across wallets). Mitigations:
1. **Reputation gating**: Only wallets with completed trades can vote
2. **Minimum stake**: Small minimum token lock per vote
3. **Time-weighted voting**: Longer holding periods increase effective votes

---

## Appendix C: Burn Schedule Projections

### Conservative Scenario

```
Year 1: $2M GMV → $50K revenue → $10K burned
Year 2: $10M GMV → $200K revenue → $40K burned  
Year 3: $50M GMV → $750K revenue → $150K burned
Year 5: $200M GMV → $2.4M revenue → $480K burned
```

### Optimistic Scenario

```
Year 1: $10M GMV → $200K revenue → $40K burned
Year 2: $100M GMV → $1.5M revenue → $300K burned
Year 3: $500M GMV → $6M revenue → $1.2M burned
Year 5: $2B GMV → $24M revenue → $4.8M burned
```

### Supply Impact

At optimistic Year 5 projections, assuming average MAYA price of $0.01:
- Annual burn: $4.8M / $0.01 = 480M tokens
- Cumulative burn: ~25-48% of total supply
- Remaining circulating: 520M–750M tokens

---

## Disclaimer

MAYA is a community-driven experimental protocol. This document describes intended functionality and is not a guarantee of future performance. The protocol involves smart contract risk, market risk, and regulatory uncertainty. Do not invest more than you can afford to lose. MAYA tokens are utility tokens for marketplace access and governance — they are not securities, investment contracts, or promises of financial return.

---

*Built with 🍞 by bakers, for bakers.*
*No owner. Just a beginning.*
