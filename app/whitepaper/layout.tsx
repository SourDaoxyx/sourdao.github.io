import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whitepaper — SOUR: The Civilization Protocol",
  description:
    "Full technical and philosophical documentation of SOUR Protocol. Four pillars, zero-centralization, organic finance on Solana.",
  openGraph: {
    title: "SOUR Whitepaper — The Civilization Protocol",
    description:
      "The complete SOUR Protocol documentation. Tokenomics, architecture, roadmap, and the philosophy of organic finance.",
    url: "https://sourdao.xyz/whitepaper",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SOUR Whitepaper" }],
  },
  twitter: {
    card: "summary",
    title: "SOUR Whitepaper — The Civilization Protocol",
    description: "Full protocol docs. sourdao.xyz/whitepaper",
  },
};

export default function WhitepaperLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
