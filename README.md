# MAYA: The Genesis Starter 🧬

> **"Sahipsiz. Sadece bir başlangıç var."**

MAYA, bir memecoin değil — **Organik Finans Medeniyeti** vizyonuyla kurulan bir Web3 protokolüdür. Cüzdanını bağla, itibarını inşa et, aracıları depasaj yap.

🌐 **Live:** [mayastarter.github.io](https://mayastarter.github.io)

---

## 🏛️ Üç Sütun

MAYA medeniyeti üç temel ürün üzerine inşa edilmektedir:

| Sütun | Ürün | Durum | Açıklama |
|-------|------|-------|----------|
| 🍞 **Crust** | Baker Profil Sistemi | ✅ MVP Live | Cüzdan bağla → bakiye oku → tier belirle → kart paylaş |
| 🤝 **Handshake** | P2P Anlaşma Sistemi | 🔜 Yakında | İki cüzdan arası akıllı kontrat anlaşmaları |
| 🌾 **Harvest** | Oven Dashboard | 📋 Planlandı | Burn tracker + topluluk metrikleri |

---

## 🍞 MVP 1: The Crust (Live)

Baker Profil Sistemi — cüzdan tabanlı on-chain kimlik kartı.

### Özellikler
- **Wallet Connect** — Phantom & Solflare desteği
- **On-chain Veri** — $MAYA bakiyesi + ilk TX tarihi otomatik okunur
- **4 Kademeli Keeper Sistemi:**
  - 🌱 Fresh Dough (0+ gün)
  - 🍞 Rising Dough (30+ gün)
  - ✨ Golden Crust (90+ gün)
  - 👑 Eternal Starter (365+ gün)
- **Baker Card** — Avatar, isim, bio, bakiye, tier rozeti + ilerleme çubuğu
- **Profil Düzenleme** — İsim (24 kar), bio (60 kar), avatar seçimi → localStorage
- **Paylaşım** — PNG olarak indir, X/Twitter'da paylaş, link kopyala

### Erişim
```
https://mayastarter.github.io/crust
```

---

## 🎨 Tasarım Dili

| Özellik | Detay |
|---------|-------|
| **Renkler** | Siyah `#000000`, Antik Altın `#D4AF37`, Krem `#F5F5DC`, Amber |
| **Fontlar** | Cinzel (başlıklar), Playfair Display (vurgular), Inter (gövde) |
| **Estetik** | "Love, Death & Robots" × simya laboratuvarı |
| **Animasyon** | Yavaş, organik "rising dough" ease-in efektleri |

---

## 🏗️ Teknoloji

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 15.5 (App Router, TypeScript) |
| Stil | Tailwind CSS (özel tema + grenli doku) |
| Animasyon | Framer Motion |
| İkonlar | Lucide React |
| Blockchain | @solana/web3.js v1, @solana/spl-token |
| Cüzdan | wallet-adapter-react (Phantom + Solflare) |
| Export | html-to-image (PNG kart) |
| Deploy | GitHub Pages (static export) |

---

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install --legacy-peer-deps

# Geliştirme sunucusu
npm run dev

# Prodüksiyon build
npm run build
```

> **Not:** React 19 peer dependency çakışmaları nedeniyle `--legacy-peer-deps` gereklidir.

---

## 📁 Proje Yapısı

```
Maya/
├── app/
│   ├── layout.tsx              # Root layout (fontlar, metadata)
│   ├── page.tsx                # Ana sayfa
│   ├── globals.css             # Global stiller + grenli doku
│   ├── crust/
│   │   └── page.tsx            # 🍞 Crust sayfası (dynamic, ssr:false)
│   └── whitepaper/
│       └── page.tsx            # Whitepaper sayfası
├── components/
│   ├── Hero.tsx                # Hero bölümü (The Altar)
│   ├── Problem.tsx             # Dijital feodalizm + çözüm köprüsü
│   ├── Manifesto.tsx           # Felsefe manifestosu
│   ├── Protocol.tsx            # 3 sütun protokol tanıtımı
│   ├── Value.tsx               # Değer önerisi
│   ├── Roadmap.tsx             # 3 fazlı yol haritası
│   ├── Community.tsx           # Topluluk bölümü
│   ├── Navbar.tsx              # Navigasyon (My Crust linki dahil)
│   ├── Footer.tsx              # Footer + sosyal linkler
│   ├── crust/
│   │   ├── CrustContent.tsx    # SolanaProvider + CrustApp wrapper
│   │   ├── CrustApp.tsx        # Ana orkestratör (wallet, fetch, state)
│   │   ├── SolanaProvider.tsx  # Phantom + Solflare bağlantı sağlayıcı
│   │   ├── BakerCard.tsx       # Görsel profil kartı + tier progress
│   │   ├── EditProfile.tsx     # İsim/bio/avatar düzenleyici
│   │   └── ShareCard.tsx       # PNG export + Twitter paylaşım
│   └── ...                     # Diğer bileşenler
├── lib/
│   ├── constants.ts            # Token mint, tier tanımları, RPC
│   ├── solana.ts               # getMayaBalance, getFirstMayaTx, getMayaHolderInfo
│   ├── translations.ts         # Çeviri anahtarları (EN)
│   └── LanguageContext.tsx      # Dil context provider
├── public/
│   ├── logo.png                # MAYA logosu
│   ├── mascot.svg              # Maskot görseli
│   └── docs/
│       └── whitepaper.md       # Whitepaper markdown
└── tailwind.config.ts          # Özel tema konfigürasyonu
```

---

## 🔐 Tokenomics

| Metrik | Değer |
|--------|-------|
| Toplam Arz | 1 Milyar $MAYA |
| Vergi | %0 |
| Likidite | Yakılacak (burned) |
| Gelir Dağılımı | %50 Burn · %30 Keepers · %20 Commons |
| Platform | Solana (pump.fun launch) |

> Tüm gelir dağılımı $MAYA token üzerinden yapılır. Sahipsiz, topluluk yönetimli.

---

## 🗺️ Yol Haritası

### Faz 1 — Hamur Yoğrulur (Şimdi)
- ✅ Site lansmanı
- ✅ Whitepaper yayınlandı
- ✅ The Crust MVP (Baker Profil Sistemi)
- ⏳ Topluluk oluşturma (Telegram/X)
- ⏳ $MAYA pump.fun lansmanı

### Faz 2 — Fırın Isınır (Sonraki)
- 🔜 The Handshake (P2P anlaşma sistemi)
- 🔜 Keeper ödül sistemi
- 🔜 Maya AI bot (Telegram)
- 🔜 İlk esnaf ortaklıkları

### Faz 3 — Ekmek Dağılır (Gelecek)
- 📋 The Harvest (Oven Dashboard)
- 📋 Çok zincirli genişleme
- 📋 DAO yönetişim
- 📋 Gerçek dünya entegrasyonu

---

## 🤝 Katkıda Bulunma

Bu topluluk sahipli bir projedir. PR'lar, issue'lar ve fikirler her zaman açıktır.

---

## 📜 Lisans

Merkeziyetsiz & Topluluk Sahipli

---

**"Sahipsiz. Sadece bir başlangıç var."**

*Yatırım tavsiyesi değildir. Memecoin değildir. Organik bir finans deneyi.*
