# SOUR: The Civilization Protocol 🫙

> **"Ownerless. There is only a beginning."**

SOUR is not a memecoin — it is a Web3 protocol founded with the vision of an **Organic Finance Civilization**. Connect your wallet, build your reputation, bypass the middlemen.

🌐 **Live:** [sourdao.xyz](https://sourdao.xyz)

---

## 🏛️ Four Pillars

The SOUR civilization is built on four core products:

| Pillar | Product | Status | Description |
|--------|---------|--------|-------------|
| 🍞 **Crust** | Baker Profile System | ✅ MVP Live | Connect wallet → read balance → determine tier → share card |
| 🤝 **Handshake** | P2P Agreement System | 🧪 Beta Live | Smart contract escrow between two wallets (Anchor) |
| 🌾 **Harvest** | Oven Dashboard | 📋 Planned | Burn tracker + community metrics |
| 🏭 **Mill** | AI Workflow Marketplace | 📋 Planned | Decentralized automation marketplace powered by $SOUR |

---

## 🍞 MVP 1: The Crust (Live)

Baker Profile System — wallet-based on-chain identity card.

### Features
- **Wallet Connect** — Phantom & Solflare support
- **On-chain Data** — $SOUR balance + first TX date auto-read
- **4-Tier Keeper System:**
  - 🌱 Fresh Dough (0+ days)
  - 🍞 Rising Dough (30+ days)
  - ✨ Golden Crust (90+ days)
  - 👑 Eternal Starter (365+ days)
- **Baker Card** — Avatar, name, bio, balance, tier badge + progress bar
- **Profile Editing** — Name (24 chars), bio (60 chars), avatar selection → localStorage
- **Sharing** — Download as PNG, share on X/Twitter, copy link

### Access
```
https://sourdao.xyz/crust
```

---

## 🤝 MVP 2: The Handshake (Beta)

P2P Agreement Beta — wallet-signed, milestone-based agreements between two wallets.

> **Current live state:** the production Handshake experience is an off-chain beta using wallet signatures + Supabase persistence.
> The Anchor escrow programs in this repo represent the future enforcement path, not the current live enforcement layer.

### On-Chain Program Track

| Detail | Value |
|--------|-------|
| Program ID | `HUAq4NFymfn4hNvs7RMNCC5uFEoRctkWDWCA9G7prxeF` |
| Framework | Anchor 0.30.1 (@coral-xyz/anchor 0.32.1) |
| Network | Solana (localnet tested, devnet next) |
| Tests | 9/9 passing |

### Program Instructions

1. `init_config` — Initialize protocol config (admin, fee rate, treasury)
2. `create_handshake` — Create escrow with SOL deposit + terms
3. `accept_handshake` — Counterparty accepts and matches deposit
4. `deliver` — Provider marks work as delivered
5. `approve` — Client approves, releases escrow + collects Pinch
6. `dispute` — Either party raises a dispute
7. `cancel` — Cancel before acceptance (full refund)
8. `resolve_dispute` — Admin resolves dispute with split ratio

### Pinch Fee (Default 2%)

- **50% Burn** — permanently removed from supply
- **30% Keepers** — distributed to long-term holders
- **20% Commons** — community treasury

### Access
```
https://sourdao.xyz/handshake
```

### Current Beta Capabilities

- Wallet-signed agreement creation
- Off-chain milestone tracking
- Counterparty acceptance by signature
- Milestone approval flow
- Crust score trade-history integration

### Not Yet Enforced Live

- On-chain escrow settlement
- Anchor-based production enforcement
- Fully authoritative server/edge-side signature verification

---

## � The Mill (Planned)

Decentralized AI Workflow Marketplace — where Bakers create, sell, and run automations.

### Concept
- **Workflow Marketplace** — Buy/sell AI automations & agent templates with $SOUR
- **Creator Royalties** — Earn 10-20% on every re-use of your workflow
- **Agent Fuel** — AI agents burn micro $SOUR per execution (constant deflationary pressure)
- **Sandbox Testing** — Try before you buy (5 min free test)
- **Crust Integration** — Seller reputation visible, "Golden Workflow" badge for top automations
- **Handshake Escrow** — All purchases secured by existing smart contract infrastructure

### Example Workflows
- 📦 Order management → inventory alert → invoice generation
- 🤖 AI content writer → social scheduler → analytics
- 💰 DeFi portfolio rebalancer → yield optimizer
- 📧 Customer support AI → CRM sync → follow-up

---

## 🏛️ Community Ownership

SOUR follows progressive decentralization:

| Phase | Timeline | Model |
|-------|----------|-------|
| Builder | Now | Founder builds core, open source from day one |
| Guided DAO | Month 2-4 | Snapshot voting, Recipe Bounties, Commons spending |
| Full DAO | Month 6-12 | On-chain governance (Solana Realms), multisig contracts |

### Recipe Bounties
Earn $SOUR by contributing:
- 🫏 Mini Bake (100-500 $SOUR) — translations, docs, small fixes
- 🍞 Standard Bake (1K-10K $SOUR) — features, UI, tutorials
- 🥐 Golden Bake (10K-100K $SOUR) — smart contracts, integrations
- 👑 Eternal Bake (100K+ $SOUR) — core protocol, security audits

### Mill Guilds
- ⚒️ Forge Guild — Smart contract developers
- 🎨 Crust Guild — UI/UX design
- 🤖 Mill Guild — AI workflow & agent development
- 📣 Sourdough Circle — Marketing & community
- 🔍 Audit Guild — Security & testing

---

## �🎨 Design Language

| Feature | Detail |
|---------|--------|
| **Colors** | Black `#000000`, Ancient Gold `#D4AF37`, Cream `#F5F5DC`, Amber |
| **Fonts** | Cinzel (headings), Playfair Display (accents), Inter (body) |
| **Aesthetic** | "Love, Death & Robots" × alchemy laboratory |
| **Animation** | Slow, organic "rising dough" ease-in effects |

---

## 🏗️ Technology

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.5 (App Router, TypeScript) |
| Styling | Tailwind CSS (custom theme + grainy texture) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Blockchain | @solana/web3.js v1, @solana/spl-token |
| Smart Contracts | Anchor 0.30.1 (Rust), @coral-xyz/anchor 0.32.1 |
| Wallets | wallet-adapter-react (Phantom + Solflare) |
| Export | html-to-image (PNG card) |
| Deploy | GitHub Pages (Next.js static export) |

---

## 📦 Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development server
npm run dev

# Production build
npm run build

# Handshake signing + verifier tests
npm run test:handshake
```

> **Note:** `--legacy-peer-deps` is required due to React 19 peer dependency conflicts.

### Handshake test commands

- `npm run test:handshake` — runs the Handshake helper and verifier test suite
- `npm run test:handshake:signing` — runs canonical payload/signing helper tests only
- `npm run test:handshake:verifier` — runs local verifier and audit helper tests only

## 🧭 Implementation Reality

The repo contains both:

- a **live static web app** deployed through GitHub Pages
- a **future on-chain protocol track** implemented in Anchor

Today, `Crust` is live as a wallet-connected reputation interface, and `Handshake` is live as a signed-agreement beta. The Anchor programs are real and tested locally, but they do **not** currently enforce the production Handshake UI flow.

---

## 📁 Project Structure

```
SOUR/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles + grainy texture
│   ├── about/
│   │   └── page.tsx            # About page
│   ├── crust/
│   │   └── page.tsx            # 🍞 Crust page (dynamic, ssr:false)
│   ├── handshake/
│   │   └── page.tsx            # 🤝 Handshake page (dynamic, ssr:false)
│   └── whitepaper/
│       └── page.tsx            # Whitepaper page
├── components/
│   ├── Hero.tsx                # Hero section (The Altar)
│   ├── Problem.tsx             # Digital feudalism + solution bridge
│   ├── Manifesto.tsx           # Philosophy manifesto
│   ├── Protocol.tsx            # 3-pillar protocol showcase
│   ├── Value.tsx               # Value proposition
│   ├── Roadmap.tsx             # 3-phase roadmap
│   ├── Community.tsx           # Community section
│   ├── Navbar.tsx              # Navigation (Crust + Handshake links)
│   ├── Footer.tsx              # Footer + social links
│   ├── crust/
│   │   ├── CrustContent.tsx    # SolanaProvider + CrustApp wrapper
│   │   ├── CrustApp.tsx        # Main orchestrator (wallet, fetch, state)
│   │   ├── SolanaProvider.tsx  # Phantom + Solflare connection provider
│   │   ├── BakerCard.tsx       # Visual profile card + tier progress
│   │   ├── EditProfile.tsx     # Name/bio/avatar editor
│   │   └── ShareCard.tsx       # PNG export + Twitter sharing
│   ├── handshake/
│   │   ├── HandshakeContent.tsx # SolanaProvider + HandshakeApp wrapper
│   │   └── HandshakeApp.tsx     # Handshake MVP UI (calculator, PDA preview)
│   └── ...                     # Other components
├── lib/
│   ├── constants.ts            # Token mint, tier definitions, RPC
│   ├── solana.ts               # getSourBalance, getFirstSourTx, getSourHolderInfo
│   ├── handshake-client.ts     # Handshake SDK (PDA helpers, fee calc, status)
│   ├── translations.ts         # Translation keys (EN)
│   └── LanguageContext.tsx      # Language context provider
├── programs/
│   └── sour-handshake/
│       └── src/
│           ├── lib.rs          # 8 instructions (Anchor program)
│           ├── state.rs        # Config, Handshake account structs
│           ├── errors.rs       # Custom error codes
│           └── events.rs       # On-chain event definitions
├── tests/
│   └── sour-handshake.ts       # 9 integration tests (all passing)
├── public/
│   ├── sour-logo.svg           # SOUR logo
│   ├── mascot.svg              # Mascot visual
│   └── docs/
│       └── whitepaper.md       # Whitepaper markdown
└── tailwind.config.ts          # Custom theme configuration
```

---

## 🔐 Tokenomics

| Metric | Value |
|--------|-------|
| Total Supply | 1 Billion $SOUR |
| Tax | 0% |
| Liquidity | To be burned |
| Revenue Distribution | 50% Burn · 30% Keepers · 20% Commons |
| Platform | Solana (pump.fun launch) |

> All revenue distribution is in $SOUR tokens. Ownerless, community-governed.

---

## 🗺️ Roadmap

### Phase 1 — The Dough Rises (Now)
- ✅ Site launch
- ✅ Whitepaper published
- ✅ The Crust MVP (Baker Profile System)
- ⏳ Community building (Telegram/X)
- ⏳ $SOUR pump.fun launch

### Phase 2 — The Oven Heats (Next)
- ✅ The Handshake smart contract (8 instructions, 9/9 tests)
- ✅ Handshake Beta page live
- ⏳ Handshake devnet deployment
- 🔜 Keeper reward system
- 🔜 Recipe Bounties launch
- 🔜 First artisan partnerships

### Phase 3 — The Mill Grinds (Q2-Q3 2026)
- 📋 The Mill MVP (first 50 workflows)
- 📋 AI agent template marketplace
- 📋 Creator royalty system
- 📋 Agent Fuel burn mechanism
- 📋 Mill Guilds formed

### Phase 4 — The Bread Spreads (Future)
- 📋 The Harvest (Oven Dashboard)
- 📋 Bakery DAO — full community governance
- 📋 Visual workflow builder
- 📋 Multi-chain expansion
- 📋 Forge DAO — community-built AI tools

---

## 🤝 Contributing

This is a community-owned project. PRs, issues, and ideas are always welcome.

---

## 📜 License

Decentralized & Community Owned

---

**"Ownerless. There is only a beginning."**

*Not financial advice. Not a memecoin. An organic finance experiment.*
