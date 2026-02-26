"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HandshakeContent = dynamic(
  () => import("@/components/handshake/HandshakeContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function HandshakePage() {
  return (
    <main className="min-h-screen bg-black text-cream">
      <Navbar />
      <HandshakeContent />
      <Footer />
    </main>
  );
}
