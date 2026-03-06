"use client";

import { Component, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HandshakeContent = dynamic(
  () =>
    import("@/components/handshake/HandshakeContent").catch((err) => {
      // Surface the actual import/module error as a component
      const ErrorFallback = () => (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="max-w-lg text-center space-y-4">
            <p className="text-red-400 font-bold text-lg">Module Load Error</p>
            <p className="text-cream/60 text-sm font-mono break-all">
              {err?.message ?? String(err)}
            </p>
          </div>
        </div>
      );
      ErrorFallback.displayName = "HandshakeLoadError";
      return { default: ErrorFallback };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    ),
  }
);

// Error boundary to surface the actual error instead of showing generic message
class HandshakeErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="max-w-lg text-center space-y-4">
            <p className="text-red-400 font-bold text-lg">Handshake Error</p>
            <p className="text-cream/60 text-sm font-mono break-all">
              {this.state.error.message}
            </p>
            <p className="text-cream/40 text-xs font-mono break-all">
              {this.state.error.stack?.split("\n").slice(0, 5).join("\n")}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-gold/20 border border-gold/40 rounded-lg text-gold text-sm hover:bg-gold/30 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HandshakePage() {
  return (
    <main className="min-h-screen bg-black text-cream">
      <Navbar />
      <HandshakeErrorBoundary>
        <HandshakeContent />
      </HandshakeErrorBoundary>
      <Footer />
    </main>
  );
}
