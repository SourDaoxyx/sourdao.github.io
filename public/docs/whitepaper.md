# MAYA: The Solidarity Marketplace Protocol

**Version 2.0 — February 2026**

> *"Sourdough starter didn't just make bread — it made civilization.
> MAYA doesn't just make trades — it makes trust obsolete."*

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [The Sourdough Thesis](#2-the-sourdough-thesis)
3. [Problem Statement](#3-problem-statement)
4. [The Starter Culture Model](#4-the-starter-culture-model)
5. [Layer 1: AI-Verified Escrow Marketplace](#5-layer-1-ai-verified-escrow-marketplace)
6. [Production Bonds](#6-production-bonds)
7. [Reputation NFT — The Real Reward](#7-reputation-nft--the-real-reward)
8. [Guilds, Challenges & Launchpad](#8-guilds-challenges--launchpad)
9. [Layer 2: Commons Treasury](#9-layer-2-commons-treasury)
10. [Revenue Model & Burn Mechanics](#10-revenue-model--burn-mechanics)
11. [Why We Don't Give Away Tokens](#11-why-we-dont-give-away-tokens)
12. [Security Architecture](#12-security-architecture)

**Appendices**
- [A: AI Contract Specification](#appendix-a-ai-contract-specification)
- [B: Reputation Score Formula](#appendix-b-reputation-score-formula)
- [C: Burn Schedule Projections](#appendix-c-burn-schedule-projections)

---

## 1. Abstract

MAYA is a solidarity marketplace protocol built on Solana. It combines AI-verified escrow trading with production bonds, soulbound reputation NFTs, and an opt-in community treasury — creating a self-sustaining economic ecosystem where every trade strengthens the community.

Unlike speculative tokens, MAYA derives value from real marketplace activity. A 1–3% escrow fee on every trade generates protocol revenue, distributed across operations (50%), community treasury (30%), and permanent token buyback-and-burn (20%).

**We don't give away tokens. We don't pay for engagement. We don't dilute your holdings with "staking rewards." Your Reputation NFT — earned through real work — is worth more than any airdrop ever could be.**

---

## 2. The Sourdough Thesis

### 2.1 How Fermentation Built Civilization

Around 10,000 BC, humans discovered that grain left in water would ferment. This microscopic event — wild yeast consuming sugars — triggered the greatest transformation in human history:

| Era | Innovation | Impact |
|-----|-----------|--------|
| 10,000 BC | Grain fermentation | Invented bread & beer, enabled settlement |
| 3,000 BC | Grain as currency | First money systems, trade networks |
| 1,400 AD | Banking system | Centralized trust, enabled commerce |
| 2009 | Bitcoin | Decentralized trust, eliminated middlemen |
| 2026 | **MAYA** | **Decentralized reputation, eliminated platforms** |

Sourdough starter is the oldest continuously living organism cultivated by humans. It doesn't just ferment — **it transforms everything it touches.** Flour becomes bread. Grain becomes beer. Communities become civilizations.

### 2.2 MAYA as Digital Starter Culture

MAYA follows the same pattern:
- **It's alive**: The ecosystem grows with every trade, every bond, every contribution
- **It's self-sustaining**: No central authority feeds it — the community feeds itself
- **It transforms**: Strangers become collaborators, skills become capital, reputation becomes value
- **It cannot be killed**: Like a sourdough starter shared across generations, the culture persists

**The old financial system is stale bread. We're here to start a new culture.**

---

## 3. Problem Statement

### 3.1 The Extraction Economy

Traditional freelance platforms extract 20–30% of every transaction:

| Platform | Fee Structure | Value Returned to Workers |
|----------|--------------|--------------------------|
| Fiverr | 20% seller fee | 0% ownership, 0% reputation portability |
| Upwork | 10–20% sliding | 0% governance, locked-in reputation |
| TaskRabbit | 15% service fee | 0% data ownership |

Workers build these platforms with their labor but receive zero ownership, zero governance rights, and zero portability of their hard-earned reputation.

### 3.2 The Memecoin Problem

Most community tokens launch with grand promises but deliver nothing:
- **Fake utility**: Staking rewards funded by new buyers (Ponzi dynamics)
- **Token giveaways**: Devalue holdings of real believers
- **No revenue**: Token value dependent entirely on speculation
- **Centralized control**: "Decentralized" in name only

### 3.3 MAYA's Thesis

**What if a token's value came from real economic activity? And what if the reward wasn't more tokens — but your reputation?**

Not from staking yields. Not from referral bonuses. Not from airdrops that dilute everyone. From actual humans trading actual services, secured by AI-verified smart contracts, building soulbound reputations that travel with them forever.

---

## 4. The Starter Culture Model

### 4.1 Two-Layer Architecture

```
┌─────────────────────────────────────────┐
│         LAYER 2: COMMONS                │
│   Opt-in Treasury · DAO Governance      │
│   Revenue-Based Financing · Launchpad   │
├─────────────────────────────────────────┤
│         LAYER 1: MARKETPLACE            │
│   AI-Verified Escrow · Production Bonds │
│   Reputation NFT · Skill Guilds         │
└─────────────────────────────────────────┘
```

**Layer 1 (Marketplace)** handles the economic engine: AI-verified escrow trades, production bonds, reputation NFTs, and the fee mechanism that generates protocol revenue.

**Layer 2 (Commons)** handles communal welfare: treasury governance, micro-loans, community launchpad, and grants — all funded by Layer 1 revenue.

### 4.2 The Flywheel

```
More Users → More Trades → More Fees → More Burns + More Commons
     ↑                                            │
     └────── Better Reputation ←───────────────────┘
```

Each trade simultaneously:
1. Generates revenue for the protocol
2. Burns tokens (increasing scarcity)
3. Funds the community treasury
4. Builds soulbound reputation for both participants

**No tokens are distributed as rewards. The ecosystem is self-sustaining.**

---

## 5. Layer 1: AI-Verified Escrow Marketplace

### 5.1 Smart Contract Agreements

Unlike traditional escrow that relies on subjective human judgment, MAYA uses **crypto-signed contracts with measurable terms**:

```
┌─────────────────────────────────────────────┐
│          📋 MAYA SMART CONTRACT              │
│                                             │
│  Deliverables:                              │
│  ☐ 3 logo concepts (PNG, 1000x1000+)       │
│  ☐ Final version in PNG + SVG + AI          │
│                                             │
│  Client Rights:                             │
│  ☐ 2 major revisions                        │
│  ☐ 3 minor corrections (color/font)         │
│                                             │
│  Deadline: 7 days                           │
│  Payment: 200 USDC                          │
│                                             │
│  ✍️ Buyer signed  (wallet: 0x...)           │
│  ✍️ Seller signed (wallet: 0x...)           │
│  🔒 STATUS: ACTIVE — AI MONITORING          │
└─────────────────────────────────────────────┘
```

Both parties sign with their crypto wallets. The agreement is immutable on-chain. Nobody can say "I didn't agree to that."

### 5.2 AI Agent Verification

When the seller submits delivery, an AI agent checks:

```
AI Verification Checklist:
├── ✅ Required files uploaded? → Count matches contract
├── ✅ File formats correct? → PNG, SVG, AI all present
├── ✅ Deadline met? → Submitted within timeframe
├── ✅ Revision limits respected? → 2 of 2 used
└── → ALL CONDITIONS MET → ESCROW RELEASED ✅
```

The AI doesn't judge quality — it verifies **measurable, objective criteria** defined in the contract. This eliminates 90% of disputes.

### 5.3 Last-Resort Arbitration

For the rare cases AI can't resolve (plagiarism, fraud, bad faith):

- **Arbiter fee: 50 USDC** (high — intentionally discouraging)
- **Losing party pays** the full arbiter fee
- **Winner is refunded** their deposit
- Most disputes never reach this stage because contracts are specific and AI-verified

### 5.4 Fee Structure

| Trade Volume (30d) | Fee Rate | Rationale |
|-------------------|----------|-----------|
| < 1,000 USDC | 3% | Onboarding tier |
| 1,000–10,000 USDC | 2% | Growth tier |
| > 10,000 USDC | 1% | Power user tier |

Higher reputation NFT scores can unlock lower fee tiers faster.

---

## 6. Production Bonds

### 6.1 Concept

Production Bonds are forward contracts — sell your future production capacity at a discount, receive capital today. **Not debt. Pre-orders on the blockchain.**

### 6.2 How It Works

```
EXAMPLE: Baker needs a dough mixer ($1,000)

Step 1: Baker creates a bond
├── Product: 40 Sourdough Starter Kits
├── Normal retail value: 40 × $35 = $1,400
├── Bond price: $1,000 (28% discount)
├── Delivery: 6 months
└── Staged releases: every 10 kits delivered

Step 2: Investors buy the bond
├── 10 people × $100 each = $1,000
├── Money goes to ESCROW (not to baker directly)

Step 3: Staged delivery
├── Month 2: 10 kits delivered → $250 released to baker
├── Month 3: 10 kits delivered → $250 released
├── Month 4: 10 kits delivered → $250 released
├── Month 6: 10 kits delivered → $250 released
└── Bond COMPLETE ✅

RESULT:
├── Baker: Got $1,000 capital + keeps the mixer
├── Investors: Got $1,400 worth of product for $1,000
├── Platform: Earned ~$10-30 in fees
├── Everyone's reputation: INCREASED
```

### 6.3 Where Does the "Extra" Value Come From?

**Nobody "pays" the difference. The baker PRODUCES it.**

Just like a farmer: seeds cost $10, labor costs $20, harvest is worth $200. The $170 "extra" comes from the earth + labor, not from another person's pocket.

Bond investors get a discount for providing capital upfront. The baker accepts the discount because they need the capital now. **Both sides win through production, not speculation.**

### 6.4 Secondary Market

Bonds are transferable SPL tokens:
- Buyer no longer needs the product → sells bond to someone who does
- Market price reflects the worker's reputation score
- Creates a liquid market for **future labor** — a first in crypto

### 6.5 Risk Protection

- **Staged releases**: Baker only gets money as they deliver
- **Reputation limits**: First bond max $200, grows with trust score
- **Partial default**: Undelivered portion auto-refunds from escrow
- **Full default**: 100% refund, massive reputation penalty

---

## 7. Reputation NFT — The Real Reward

### 7.1 Why Reputation, Not Tokens

Most projects reward engagement with tokens. This creates:
- **Mercenaries**: People who farm rewards and dump
- **Inflation**: More tokens = less value for real believers
- **Fake engagement**: Bots, sock puppets, attention farming

MAYA takes the opposite approach: **Your reputation is the reward.**

### 7.2 Soulbound Dynamic NFT

Every MAYA holder receives a soulbound NFT that:

```
┌──────────────────────────────────────────┐
│           🏅 MAYA SOUL BADGE             │
│              @baker_ali                  │
│                                          │
│  Tier: ████████░░ Master Baker          │
│  Score: 82/100                           │
│  Guild: 🍞 Craft + 💻 Dev              │
│  Trades: 34 completed                    │
│  Bonds: 3 fulfilled / 0 defaulted       │
│  Member since: March 2026                │
│                                          │
│  🏆 First Bond  ⚡ Speed Delivery       │
│  🤝 Trusted    🔥 Top Producer          │
└──────────────────────────────────────────┘
```

- **Cannot be sold** (soulbound — tied to your wallet)
- **Dynamically updates** — visuals change as tier grows
- **Portable** — reads from Solana state, works across Web3
- **More valuable than tokens** — it unlocks real economic benefits

### 7.3 What Reputation Unlocks

| Reputation Level | Benefit |
|-----------------|---------|
| Any holder | Marketplace access, basic trading |
| Score 20+ | Lower escrow fees (2.5% → 2%) |
| Score 40+ | Bond issuance (up to $500) |
| Score 60+ | Guild leadership eligibility |
| Score 80+ | Arbiter eligibility, bond limit $5,000 |
| Score 95+ | Launchpad proposal rights, 1% fee tier |

**Your reputation is your credit score, your CV, and your access pass — all in one.**

### 7.4 Score Calculation

```
ReputationScore = Σ(trade_value × completion_rate × time_factor × bond_factor)
```

Where:
- `trade_value` = normalized value (log scale, caps at large trades)
- `completion_rate` = 1.0 successful, 0.0 failed, 0.5 partial
- `time_factor` = decay favoring recent activity
- `bond_factor` = 1.5x bonus for fulfilled bonds, 0.3x penalty for defaults

---

## 8. Guilds, Challenges & Launchpad

### 8.1 Skill Guilds

**The community creates these, not us.** When enough people with similar skills exist, they form a guild:

- 🎨 **Design Guild** — Designers, illustrators, brand artists
- 💻 **Dev Guild** — Developers, smart contract engineers
- 📝 **Content Guild** — Writers, translators, marketers
- 🍞 **Craft Guild** — Physical producers, artisans
- And any other guild the community decides to create

**Guild benefits:**
- Collective visibility (guild portfolio page)
- Collective bond issuance (take on bigger projects as a team)
- Guild-level reputation (your guild's performance affects you)
- Internal mentorship (learn from senior guild members)

**No token incentives for guilds.** The incentive is better work, more clients, higher reputation.

### 8.2 Community Challenges

**We don't organize these. The community does.** We provide the platform:

- **Weekly Bake-offs**: Community-proposed themes, community votes
- **Collab Sprints**: Random teams, real deadlines, shipped products
- **Seasonal Leaderboards**: Hall of Fame — on-chain forever

**The prize? Reputation.** Higher reputation = better bond terms, lower fees, guild leadership, arbiter eligibility. No tokens distributed.

### 8.3 Community Launchpad

When the Commons Treasury has funds, the community can back real projects:

1. **Propose**: A member submits a project idea with budget
2. **Discuss**: Community reviews for 1 week
3. **Vote**: Quadratic voting (DAO governance)
4. **Fund**: Approved projects receive Commons funds
5. **Build**: Guild members staff the team
6. **Return**: 15% of project revenue flows back to Commons

**No VCs. No gatekeepers. The community funds its own ecosystem.**

---

## 9. Layer 2: Commons Treasury

### 9.1 Funding

The Commons Treasury receives 30% of all protocol revenue automatically. No manual intervention. No governance vote needed to fund it — only to spend it.

### 9.2 Governance: Quadratic Voting

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

A whale with 10,000 tokens gets 100 votes, not 10,000.

### 9.3 Revenue-Based Financing (RBF)

The Commons can issue micro-loans repaid as a percentage of future marketplace earnings:

- **No interest** — repay a fixed cap (1.3–1.5x principal)
- **Revenue-linked** — repay 10% of marketplace earnings
- **Grace period** — no repayment for first 2 months
- **Natural cap** — maximum repayment period: 24 months

### 9.4 Sybil Resistance

- Only wallets with completed trades can vote (reputation gate)
- Minimum token lock per vote
- Time-weighted voting (longer holding = more effective)

---

## 10. Revenue Model & Burn Mechanics

### 10.1 Revenue Distribution

```
Protocol Revenue (1-3% of GMV)
         │
         ├── 50% → Operations
         │         ├── Development
         │         ├── Infrastructure
         │         └── Growth
         │
         ├── 30% → Commons Treasury
         │         ├── Community loans (RBF)
         │         ├── Launchpad funding
         │         └── Emergency fund
         │
         └── 20% → Buyback & Burn
                   ├── Market buy MAYA tokens
                   └── Send to burn address (permanent)
```

### 10.2 Burn Formula

```
Monthly_Burn = GMV × fee_rate × 0.20
```

### 10.3 Projected Burn Schedule

| Monthly GMV | Fee Rate | Monthly Revenue | Monthly Burn | Annual Burn |
|-------------|----------|----------------|-------------|-------------|
| $100K | 2.5% | $2,500 | $500 | $6,000 |
| $1M | 2.0% | $20,000 | $4,000 | $48,000 |
| $10M | 1.5% | $150,000 | $30,000 | $360,000 |
| $100M | 1.2% | $1,200,000 | $240,000 | $2,880,000 |

### 10.4 Fixed Supply, Only Burns

MAYA has a fixed supply of 1 billion tokens with **no minting capability**. Every burn permanently reduces circulating supply. There is no inflation mechanism. No staking rewards. No airdrops. No team unlocks.

```
Circulating_Supply(t) = 1,000,000,000 - Σ(all_burns)
```

---

## 11. Why We Don't Give Away Tokens

This is important enough to be its own chapter.

### 11.1 The Problem with Token Rewards

| Method | What They Tell You | What Actually Happens |
|--------|-------------------|----------------------|
| Staking Rewards | "Earn 20% APY!" | Inflation dilutes everyone equally |
| Airdrops | "Free tokens!" | Dumped immediately, price crashes |
| Referral Bonuses | "Bring friends, earn!" | Attracts mercenaries, not believers |
| Quest Rewards | "Complete tasks!" | Bots farm, real users get diluted |

Every token "given away" is a token that **reduces the value of tokens already held by real believers.**

### 11.2 MAYA's Approach

- **You buy MAYA because you believe** in the solidarity marketplace
- **You build reputation because you contribute** real work
- **Your Reputation NFT is the reward** — it unlocks economic benefits worth more than any airdrop
- **The only token movement is burns** — deflation, not inflation

### 11.3 The Math

If a project gives away 5% of supply as "rewards":
- Every holder's share is diluted by 5%
- Recipients typically sell 60-80% immediately
- Net effect: price dump + less engaged community

If MAYA burns 5% of supply from marketplace revenue:
- Every holder's share increases by ~5.26%
- The burn is funded by real economic activity
- Net effect: price appreciation + active marketplace

---

## 12. Security Architecture

### 12.1 Smart Contract Security

- **AI verification layer**: Contracts checked before escrow release
- **Escrow isolation**: Each trade has its own escrow account
- **Circuit breakers**: Emergency pause functionality (multisig)
- **Bug bounty**: Ongoing program for responsible disclosure

### 12.2 Treasury Security

- **Squads Protocol**: 3-of-5 multisig for operational funds
- **Time locks**: 48-hour delay on treasury transactions > $10,000
- **Transparency**: All treasury movements visible on-chain
- **Progressive decentralization**: Multisig → DAO over time

### 12.3 User Security

- **Non-custodial**: Users always control their own wallets
- **Soulbound NFTs**: Cannot be stolen and used by another wallet
- **Rate limiting**: Anti-spam and anti-manipulation protections
- **Open source**: All code publicly auditable

### 12.4 Risk Factors

| Risk | Mitigation |
|------|-----------|
| Smart contract exploit | Audits + bug bounty + insurance fund |
| Low marketplace adoption | Organic growth, no fake incentives |
| Regulatory uncertainty | Pure utility token, no securities |
| Token price volatility | Revenue tied to GMV, not speculation |
| AI verification errors | Human arbitration as last resort |

---

## Appendix A: AI Contract Specification

```
Contract Structure:
├── parties:       [buyer_wallet, seller_wallet]
├── deliverables:  [
│     { type: "file", format: "PNG", min_resolution: "1000x1000", count: 3 },
│     { type: "file", format: "SVG", count: 1 },
│   ]
├── revisions:     { major: 2, minor: 3 }
├── deadline:      timestamp
├── payment:       { amount: 200, currency: "USDC" }
├── signatures:    [buyer_sig, seller_sig]  // crypto signatures
└── status:        Created | Active | Delivered | Verified | Complete | Disputed

AI Verification Rules:
├── check_file_count(deliverables)     → bool
├── check_file_formats(deliverables)   → bool
├── check_deadline(submission_time)    → bool
├── check_revision_count(history)      → bool
└── all_checks_passed()                → release_escrow()

Dispute Escalation:
├── AI cannot verify → human arbiter panel
├── Arbiter fee: 50 USDC (paid by loser)
├── 3-of-5 majority ruling
└── Arbiter reputation at stake
```

---

## Appendix B: Reputation Score Formula

```
ReputationScore = Σ(trade_value × completion_rate × time_factor × bond_factor)

Where:
  trade_value = min(log10(usd_value + 1) / 4, 1.0)
  completion_rate = {
    successful: 1.0,
    partial: delivered_percentage,
    failed: 0.0,
    disputed_won: 0.8,
    disputed_lost: -0.5
  }
  time_factor = e^(-days_since_completion / 365)
  bond_factor = {
    bond_fulfilled: 1.5,
    bond_partial: 0.8,
    bond_defaulted: 0.3,
    no_bond: 1.0
  }

Tier Thresholds:
  Fresh Dough:    0-19
  Rising:         20-39
  Proofing:       40-59
  Fermented:      60-79
  Master Baker:   80-94
  Aged Starter:   95-100

Decay:
  Inactive accounts lose 0.5 points per month after 90 days of inactivity
  Minimum score: 0 (cannot go negative, but disputed losses reduce significantly)
```

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

At optimistic Year 5, assuming average MAYA price of $0.01:
- Annual burn: $4.8M / $0.01 = 480M tokens
- Cumulative burn: ~25-48% of total supply
- Remaining circulating: 520M–750M tokens

**Every trade reduces supply. Every burn rewards holders. No tokens were given away to achieve this.**

---

## Disclaimer

MAYA is a community-driven experimental protocol. This document describes intended functionality and is not a guarantee of future performance. The protocol involves smart contract risk, market risk, and regulatory uncertainty. Do not invest more than you can afford to lose. MAYA tokens are utility tokens for marketplace access and governance — they are not securities, investment contracts, or promises of financial return.

---

*"10,000 years ago, a microscopic organism transformed grain into bread and built civilization.*
*Today, a digital starter culture transforms trades into trust and builds the organic finance empire."*

*Built with 🍞 by bakers, for bakers.*
*No owner. Just a beginning.*
