import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Cinzel } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sourdao.xyz"),
  title: "SOUR: The Civilization Protocol",
  description: "Modern finance went stale. We came to ferment. The decentralized sourdough revolution against dollar hegemony.",
  keywords: ["SOUR", "Civilization Protocol", "Organic Finance", "Web3", "DeFi", "Cryptocurrency", "Pump.fun", "Sourdough", "SourDAO"],
  manifest: "/manifest.json",
  icons: {
    icon: "/sour-logo.png",
    shortcut: "/sour-logo.png",
    apple: "/sour-logo.png",
  },
  openGraph: {
    title: "SOUR: The Civilization Protocol",
    description: "Modern finance went stale. We came to ferment.",
    type: "website",
    siteName: "SOUR Protocol",
    images: [
      {
        url: "/sour-logo.png",
        width: 1200,
        height: 1200,
        alt: "SOUR: The Civilization Protocol",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOUR: The Civilization Protocol",
    description: "Modern finance went stale. We came to ferment.",
    images: ["/sour-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#D4AF37",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} ${cinzel.variable} font-inter antialiased`}
      >
        <LanguageProvider>
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
