# 🫓 SOUR Crust — Soulbound Reputation System

> Your reputation is yours. Not on a platform — on the chain.  
> Portable, undeletable, unsellable.

---

## Overview

The Crust is SOUR's soulbound on-chain reputation layer. Every Baker gets a Crust Score (0–1000) computed from three weighted components. This score determines your tier, governance power, Harvest rewards, and trust level across the entire SOUR ecosystem.

**Crust is the answer to Web3's biggest question: "Can I trust this person?"**

---

## Score Algorithm

### Weights

| Component | Weight | Max Points | What It Measures |
|---|---|---|---|
| **Baker Reputation** | 40% | 400 | Handshake completions, dispute history |
| **Holding Power** | 30% | 300 | Token balance vs total supply (log scale) |
| **Diamond Hands** | 30% | 300 | Consecutive days holding without selling |

### Holding Power (0–300)

Logarithmic scale to prevent whale dominance:

| Balance | % of Supply | Score |
|---|---|---|
| 10K $SOUR | 0.001% | ~80 |
| 100K $SOUR | 0.01% | ~170 |
| 1M $SOUR | 0.1% | ~250 |
| 10M+ $SOUR | 1%+ | 300 (max) |

### Diamond Hands (0–300)

Consecutive hold duration with breakpoints:

| Duration | Score |
|---|---|
| 7 days | 50 |
| 30 days | 150 |
| 90 days | 250 |
| 365 days | 300 (max) |

**SELL = RESET**: Any sell transaction resets the timer to 0.

### Baker Reputation (0–400)

Based on completed Handshakes with penalties and bonuses:

| Handshakes Completed | Base Score |
|---|---|
| 1 | ~20 |
| 5 | 100 |
| 20 | 200 |
| 50+ | 300 (max base) |

**Penalties:**
- Dispute lost: -50 per loss
- Cancel rate >20%: -30 per 10% above threshold

**Bonus:**
- Perfect Record (20+ completed, 0 disputes lost): +100

---

## Tier System

| Tier | Score Range | Emoji | Harvest | Card Style |
|---|---|---|---|---|
| **Eternal Starter** | 750–1000 | 👑 | 2× | Holographic |
| **Golden Crust** | 500–749 | 🥐 | 1.5× | Golden glow |
| **Rising Dough** | 200–499 | 🍞 | 1× | Warm tones |
| **Fresh Dough** | 0–199 | 🫓 | — | Basic |

### Tier Privileges

| Feature | Fresh 🫓 | Rising 🍞 | Golden 🥐 | Eternal 👑 |
|---|---|---|---|---|
| Community access | ✅ | ✅ | ✅ | ✅ |
| Harvest eligibility | ❌ | ✅ | ✅ | ✅ |
| DAO voting | ❌ | 1× | 1.5× | 2× |
| Create proposals | ❌ | ❌ | ✅ | ✅ |
| Governance veto | ❌ | ❌ | ❌ | ✅ |
| Mill premium listing | ❌ | ❌ | ✅ | ✅ |
| Reduced Pinch | ❌ | ✅ | ✅ | ✅ |

---

## Achievement Badges

Badges are earned permanently — they persist even if tier drops.

### Holding Badges

| Badge | Requirement |
|---|---|
| 🫓 First Dough | Bought your first $SOUR |
| 💎 Diamond 7 | 7 consecutive days holding |
| 💎 Diamond 30 | 30 consecutive days holding |
| 💎 Diamond 90 | 90 consecutive days holding |
| 💎 Diamond 365 | 1 year consecutive holding |
| 🐋 Whale Baker | Top 100 holder by balance |

### Handshake Badges

| Badge | Requirement |
|---|---|
| 🤝 First Shake | Completed first Handshake |
| 🤝 Baker's Dozen | 12 Handshakes completed |
| 🤝 Master Baker | 50 Handshakes completed |
| 🏆 Perfect Record | 20+ Handshakes, 0 disputes lost |

### Burn Badges

| Badge | Requirement |
|---|---|
| 🔥 First Burn | Contributed to first burn via Bake |
| 🔥 Oven Keeper | 10K+ $SOUR burned through your Bakes |
| 🔥 Eternal Flame | 100K+ $SOUR burned through your Bakes |

### Community Badges

| Badge | Requirement |
|---|---|
| 📜 Genesis Baker | Among the first 1,000 holders |
| 🏗️ Forge Hand | Merged a PR on GitHub |
| 🏭 Mill Wright | Published first workflow on the Mill |
| 🗳️ First Vote | Voted in first DAO proposal |

---

## Baker Card

Each tier has a unique card design:

- **Fresh Dough**: Minimal, grayscale, subdued styling
- **Rising Dough**: Warm blue tones, subtle glow
- **Golden Crust**: Gold gradient, shimmer effect, prominent badge display
- **Eternal Starter**: Holographic animated border, purple-violet glow, full badge wall, premium layout

### Card Information

- Display name + wallet address
- Avatar
- Crust Score bar (0–1000)
- Current tier + emoji
- Stats: Holding, Days Fermenting, Bakes, Score
- Earned badges
- Profile link: `sourdao.xyz/crust/[address]`

---

## Public Profile

**URL:** `sourdao.xyz/crust/[wallet-address]`

Publicly accessible (no wallet connection needed):
- Full Baker Card
- Crust Score breakdown (holding / diamond / reputation)
- Achievement badges
- Handshake history summary
- Tier with progress to next tier

---

## Leaderboard

**URL:** `sourdao.xyz/crust/leaderboard`

Tabs:
- 🏆 Top Crust Score
- 💎 Longest Holders
- 🤝 Most Handshakes
- 🆕 Rising Stars (biggest score increase in 7 days)

Each entry shows: Rank, Display Name (optional), Wallet, Score, Tier, Bakes, Days.

---

## Ecosystem Integration

### Handshake
- View counterparty's Crust Score before agreeing
- Set minimum Crust requirement for proposals
- Higher Crust = more trustworthy in disputes

### Mill
- Creator's Crust Score displayed on listings
- Golden+ required for premium workflow listing
- Rising+ required to write reviews

### DAO / Governance
- Fresh: no vote
- Rising: 1× vote weight
- Golden: 1.5× vote weight
- Eternal: 2× vote weight + veto power

### Harvest
- Keeper rewards weighted by tier multiplier
- Higher Crust = larger share of 30% Keepers allocation

---

## Implementation Layers

### Layer 1: Frontend Crust (Current — No Smart Contract)
- Score computed from on-chain reads (balance, transfer history, Handshake program data)
- Baker Card with tier-based designs
- Public profile pages
- Leaderboard with demo data
- Achievement badge system

### Layer 2: On-Chain Crust (Post-Token)
- Anchor smart contract: `sour-crust`
- PDA per wallet: `["crust", wallet_pubkey]`
- CPI from Handshake program to auto-record completions
- Transfer hook to detect sells and reset Diamond timer
- On-chain score update via crank/keeper

### Layer 3: Cross-Protocol Composability (Post-Mill)
- Other Solana programs can query Crust PDAs
- API for external integrations
- Multichain Crust bridging

---

## File Structure

```
lib/
  crust-score.ts         — Score algorithm, badge system, tier definitions
  solana.ts              — On-chain data reads (balance, first TX)
  constants.ts           — Token config, keeper tiers

components/crust/
  CrustApp.tsx           — Main crust page (wallet connect + card)
  BakerCard.tsx          — Tier-based visual card
  EditProfile.tsx        — Name/bio/avatar editor
  ShareCard.tsx          — PNG export + social sharing
  BadgeWall.tsx          — Badge display component
  ScoreBreakdown.tsx     — Score visualization with 3 components

app/crust/
  page.tsx               — /crust (wallet-connected view)
  [address]/page.tsx     — /crust/[address] (public profile)
  leaderboard/page.tsx   — /crust/leaderboard
```

---

*The Crust is the civilizational trust layer. Without it, every Handshake is a leap of faith. With it, every Baker's history speaks for itself.*
