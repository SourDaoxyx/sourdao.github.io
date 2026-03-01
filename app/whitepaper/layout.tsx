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
    images: [{ url: "/sour-logo.png", width: 512, height: 512, alt: "SOUR Whitepaper" }],
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
