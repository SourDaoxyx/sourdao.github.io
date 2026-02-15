"use client";

import SolanaProvider from "./SolanaProvider";
import CrustApp from "./CrustApp";

export default function CrustContent() {
  return (
    <SolanaProvider>
      <CrustApp />
    </SolanaProvider>
  );
}
