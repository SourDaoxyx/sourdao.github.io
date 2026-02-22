# SOUR: The Genesis Starter 🫙

> **"Ownerless. There is only a beginning."**

SOUR is not a memecoin — it is a Web3 protocol founded with the vision of an **Organic Finance Civilization**. Connect your wallet, build your reputation, bypass the middlemen.

🌐 **Live:** [sourdao.xyz](https://sourdao.xyz)

---

## 🏛️ Three Pillars

The SOUR civilization is built on three core products:

| Pillar | Product | Status | Description |
|--------|---------|--------|-------------|
| 🍞 **Crust** | Baker Profile System | ✅ MVP Live | Connect wallet → read balance → determine tier → share card |
| 🤝 **Handshake** | P2P Agreement System | 🔜 Coming Soon | Smart contract agreements between two wallets |
| 🌾 **Harvest** | Oven Dashboard | 📋 Planned | Burn tracker + community metrics |

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

## 🎨 Design Language

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
| Wallets | wallet-adapter-react (Phantom + Solflare) |
| Export | html-to-image (PNG card) |
| Deploy | Vercel (static export) |

---

## 📦 Setup

```bash
# Install dependencies
npm install --legacy-peer-deps

# Development server
npm run dev

# Production build
npm run build
```

> **Note:** `--legacy-peer-deps` is required due to React 19 peer dependency conflicts.

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
│   ├── Navbar.tsx              # Navigation (incl. My Crust link)
│   ├── Footer.tsx              # Footer + social links
│   ├── crust/
│   │   ├── CrustContent.tsx    # SolanaProvider + CrustApp wrapper
│   │   ├── CrustApp.tsx        # Main orchestrator (wallet, fetch, state)
│   │   ├── SolanaProvider.tsx  # Phantom + Solflare connection provider
│   │   ├── BakerCard.tsx       # Visual profile card + tier progress
│   │   ├── EditProfile.tsx     # Name/bio/avatar editor
│   │   └── ShareCard.tsx       # PNG export + Twitter sharing
│   └── ...                     # Other components
├── lib/
│   ├── constants.ts            # Token mint, tier definitions, RPC
│   ├── solana.ts               # getSourBalance, getFirstSourTx, getSourHolderInfo
│   ├── translations.ts         # Translation keys (EN)
│   └── LanguageContext.tsx      # Language context provider
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
- 🔜 The Handshake (P2P agreement system)
- 🔜 Keeper reward system
- 🔜 Sour AI bot (Telegram)
- 🔜 First artisan partnerships

### Phase 3 — The Bread Spreads (Future)
- 📋 The Harvest (Oven Dashboard)
- 📋 Multi-chain expansion
- 📋 DAO governance
- 📋 Real-world integration

---

## 🤝 Contributing

This is a community-owned project. PRs, issues, and ideas are always welcome.

---

## 📜 License

Decentralized & Community Owned

---

**"Ownerless. There is only a beginning."**

*Not financial advice. Not a memecoin. An organic finance experiment.*
