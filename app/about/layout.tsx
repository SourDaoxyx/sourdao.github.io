import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The Civilization Protocol | SOUR",
  description:
    "SOUR is not a memecoin. It's a four-pillar Web3 civilization built on Solana — Crust, Handshake, Harvest, and Mill. Learn the vision, the team, and the roadmap.",
  openGraph: {
    title: "About SOUR — The Civilization Protocol",
    description:
      "Ownerless. Community-owned. Four pillars building the infrastructure for an organic finance civilization on Solana.",
    url: "https://sourdao.xyz/about",
    images: [{ url: "/sour-logo.png", width: 512, height: 512, alt: "SOUR Protocol — About" }],
  },
  twitter: {
    card: "summary",
    title: "About SOUR — The Civilization Protocol",
    description: "Not a memecoin. A civilization protocol. sourdao.xyz/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
