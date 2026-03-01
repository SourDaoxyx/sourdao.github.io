import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crust — On-Chain Baker Identity | SOUR Protocol",
  description:
    "Your wallet's reputation made visible. Connect, build your Crust score, earn badges, and rise through the tiers. The longer you hold $SOUR, the higher you rise.",
  openGraph: {
    title: "Crust — On-Chain Baker Identity | SOUR Protocol",
    description:
      "Connect your wallet and build your on-chain reputation. 4 tiers, 17 badges, real Solana data.",
    url: "https://sourdao.xyz/crust",
    images: [{ url: "/sour-logo.png", width: 512, height: 512, alt: "SOUR Crust — Baker Identity" }],
  },
  twitter: {
    card: "summary",
    title: "Crust — On-Chain Baker Identity | SOUR Protocol",
    description: "Your $SOUR reputation, on-chain. sourdao.xyz/crust",
  },
};

export default function CrustLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
