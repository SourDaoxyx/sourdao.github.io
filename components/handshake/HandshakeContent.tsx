"use client";

import SolanaProvider from "@/components/crust/SolanaProvider";
import HandshakeApp from "./HandshakeApp";

export default function HandshakeContent() {
  return (
    <SolanaProvider>
      <HandshakeApp />
    </SolanaProvider>
  );
}
