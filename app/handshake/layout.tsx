import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handshake — P2P Agreement Engine | SOUR Protocol",
  description:
    "Create trustless peer-to-peer agreements on Solana. Escrow your $SOUR, set terms, and let the protocol enforce the deal. No lawyers. No middlemen.",
  openGraph: {
    title: "Handshake — P2P Agreement Engine | SOUR Protocol",
    description:
      "Trustless P2P escrow powered by $SOUR on Solana. Create deals, lock funds, enforce agreements — on-chain.",
    url: "https://sourdao.xyz/handshake",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SOUR Handshake — P2P Agreements" }],
  },
  twitter: {
    card: "summary",
    title: "Handshake — P2P Agreement Engine | SOUR Protocol",
    description: "Trustless escrow on Solana. sourdao.xyz/handshake",
  },
};

export default function HandshakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
