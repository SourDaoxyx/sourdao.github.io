"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HandshakePage() {
  return (
    <main className="min-h-screen bg-black text-cream">
      <Navbar />
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gold text-2xl">Handshake Loading Test</p>
      </div>
      <Footer />
    </main>
  );
}
