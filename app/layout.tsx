import type { Metadata } from "next";
import { Inter, Playfair_Display, Cinzel } from "next/font/google";
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
  title: "MAYA: The Genesis Starter | Organic Finance Revolution",
  description: "Modern finance went stale. We came to ferment. The decentralized sourdough revolution against dollar hegemony.",
  keywords: ["MAYA", "Genesis Starter", "Organic Finance", "Web3", "DeFi", "Cryptocurrency", "Pump.fun", "Sourdough"],
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "MAYA: The Genesis Starter",
    description: "Modern finance went stale. We came to ferment.",
    type: "website",
    siteName: "MAYA Genesis",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "MAYA Protocol - The Civilization Coin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAYA: The Genesis Starter",
    description: "Modern finance went stale. We came to ferment.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
        </LanguageProvider>
      </body>
    </html>
  );
}
