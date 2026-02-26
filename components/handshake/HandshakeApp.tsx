"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, Handshake, ShieldCheck, Copy, Check, AlertTriangle } from "lucide-react";
import {
  SOUR_HANDSHAKE_PROGRAM_ID,
  calculatePinch,
  formatSourAmount,
  getConfigPda,
  getHandshakePda,
  getStatusColor,
  getStatusLabel,
  HandshakeStatus,
  shortenAddress,
} from "@/lib/handshake-client";

function parseSourToUnits(value: string, decimals = 9): bigint {
  if (!value.trim()) return BigInt(0);
  const [wholePart, fracPart = ""] = value.split(".");
  const whole = BigInt(wholePart || "0");
  const frac = BigInt((fracPart + "0".repeat(decimals)).slice(0, decimals));
  return whole * BigInt(10 ** decimals) + frac;
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-xl border border-gold/15 bg-black/30 px-4 py-3 flex items-center justify-between gap-3">
      <div>
        <p className="text-cream/40 text-xs">{label}</p>
        <p className="text-cream text-sm break-all">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className="shrink-0 p-2 rounded-lg border border-gold/20 hover:border-gold/50 hover:bg-gold/10 transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gold" />}
      </button>
    </div>
  );
}

export default function HandshakeApp() {
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const [description, setDescription] = useState("Design + copy sprint");
  const [workerAddress, setWorkerAddress] = useState("");
  const [amountSour, setAmountSour] = useState("1.25");
  const [mockHandshakeId, setMockHandshakeId] = useState("0");

  const amountUnits = useMemo(() => parseSourToUnits(amountSour), [amountSour]);
  const pinch = useMemo(() => calculatePinch(amountUnits), [amountUnits]);

  const [configPda] = useMemo(() => getConfigPda(), []);
  const [handshakePda] = useMemo(
    () => getHandshakePda(Number.isNaN(Number(mockHandshakeId)) ? 0 : Number(mockHandshakeId)),
    [mockHandshakeId]
  );

  const statusPreview = [
    HandshakeStatus.Created,
    HandshakeStatus.Accepted,
    HandshakeStatus.Delivered,
    HandshakeStatus.Approved,
    HandshakeStatus.Disputed,
  ];

  const isWorkerAddressFilled = workerAddress.trim().length > 0;
  const walletText = publicKey ? shortenAddress(publicKey.toBase58()) : "Not connected";

  return (
    <section className="min-h-[80vh] px-4 py-24 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-gold/10 to-transparent blur-[200px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider mb-6">
            <Handshake className="w-4 h-4" />
            THE HANDSHAKE · BETA
          </span>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-4">
            P2P Escrow Flow Preview
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto">
            Wallet bağlantısı, protokol fee hesaplaması ve PDA türetimi canlı. Üretimde zincire yazım akışı bir sonraki sprintte açılacak.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-gold/20 bg-black/40 backdrop-blur-sm p-6 space-y-5"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-cream/60 text-sm">Wallet</p>
              {!connected ? (
                <button
                  onClick={() => setVisible(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-amber text-black text-sm font-bold"
                >
                  <Wallet className="w-4 h-4" /> Connect
                </button>
              ) : (
                <span className="text-emerald-400 text-sm font-medium">{walletText}</span>
              )}
            </div>

            <div>
              <label className="block text-cream/70 text-sm mb-2">Worker Address</label>
              <input
                value={workerAddress}
                onChange={(e) => setWorkerAddress(e.target.value)}
                placeholder="Worker public key"
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
              />
            </div>

            <div>
              <label className="block text-cream/70 text-sm mb-2">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deliverable details"
                className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-cream/70 text-sm mb-2">Amount ($SOUR)</label>
                <input
                  value={amountSour}
                  onChange={(e) => setAmountSour(e.target.value)}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                />
              </div>
              <div>
                <label className="block text-cream/70 text-sm mb-2">Handshake ID (preview)</label>
                <input
                  value={mockHandshakeId}
                  onChange={(e) => setMockHandshakeId(e.target.value.replace(/[^0-9]/g, ""))}
                  inputMode="numeric"
                  className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
              <p className="text-amber-100/90 text-xs leading-relaxed">
                Bu ekran beta/mvp önizleme ekranıdır. Canlı üretim ağında sözleşmeye yazım aksiyonu henüz aktif değildir.
              </p>
            </div>

            <div className="rounded-xl border border-gold/15 bg-black/20 px-4 py-3">
              <p className="text-cream/40 text-xs">Draft Summary</p>
              <p className="text-cream text-sm mt-1">{description || "No description"}</p>
              <p className="text-cream/70 text-xs mt-1">
                Worker: {isWorkerAddressFilled ? shortenAddress(workerAddress, 6) : "not set"}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-gold/20 bg-black/40 backdrop-blur-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-gold">
              <ShieldCheck className="w-4 h-4" />
              <p className="font-semibold">Protocol Preview</p>
            </div>

            <ReadOnlyRow label="Program ID" value={SOUR_HANDSHAKE_PROGRAM_ID.toBase58()} />
            <ReadOnlyRow label="Config PDA" value={configPda.toBase58()} />
            <ReadOnlyRow label="Handshake PDA" value={handshakePda.toBase58()} />

            <div className="rounded-xl border border-gold/15 bg-black/20 p-4 space-y-2">
              <p className="text-sm text-cream/50">Pinch Breakdown (2% · 50/30/20)</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p className="text-cream/60">Amount</p>
                <p className="text-right text-cream">{formatSourAmount(amountUnits)} $SOUR</p>
                <p className="text-cream/60">Pinch Total</p>
                <p className="text-right text-gold">{formatSourAmount(pinch.pinchTotal)} $SOUR</p>
                <p className="text-cream/60">Burn</p>
                <p className="text-right text-red-400">{formatSourAmount(pinch.burnAmount)} $SOUR</p>
                <p className="text-cream/60">Keepers</p>
                <p className="text-right text-blue-400">{formatSourAmount(pinch.keepersAmount)} $SOUR</p>
                <p className="text-cream/60">Commons</p>
                <p className="text-right text-purple-400">{formatSourAmount(pinch.commonsAmount)} $SOUR</p>
                <p className="text-cream/60">Worker Receives</p>
                <p className="text-right text-emerald-400">{formatSourAmount(pinch.workerAmount)} $SOUR</p>
              </div>
            </div>

            <div className="rounded-xl border border-gold/15 bg-black/20 p-4">
              <p className="text-sm text-cream/50 mb-2">Lifecycle</p>
              <div className="flex flex-wrap gap-2">
                {statusPreview.map((status) => (
                  <span
                    key={status}
                    className={`text-xs px-2.5 py-1 rounded-full border border-current/20 ${getStatusColor(status)}`}
                  >
                    {getStatusLabel(status)}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
