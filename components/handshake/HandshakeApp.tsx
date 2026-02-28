"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Transaction, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import {
  Wallet,
  Handshake as HandshakeIcon,
  ShieldCheck,
  Copy,
  Check,
  AlertTriangle,
  Search,
  Plus,
  Loader2,
  ExternalLink,
} from "lucide-react";

import {
  SOUR_HANDSHAKE_PROGRAM_ID,
  calculatePinch,
  formatSourAmount,
  getConfigPda,
  getHandshakePda,
  getVaultPda,
  getVaultAuthorityPda,
  getStatusColor,
  getStatusLabel,
  HandshakeStatus,
  shortenAddress,
  buildCreateHandshakeIx,
  buildAcceptIx,
  buildDeliverIx,
  buildApproveIx,
  buildDisputeIx,
  buildCancelIx,
  fetchConfig,
  fetchHandshake,
  type HandshakeAccount,
  type ProtocolConfigAccount,
} from "@/lib/handshake-client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseSourToUnits(value: string, decimals = 6): bigint {
  if (!value.trim()) return BigInt(0);
  const [wholePart, fracPart = ""] = value.split(".");
  const whole = BigInt(wholePart || "0");
  const frac = BigInt((fracPart + "0".repeat(decimals)).slice(0, decimals));
  return whole * BigInt(10 ** decimals) + frac;
}

function tsToDate(ts: bigint): string {
  if (ts === BigInt(0)) return "—";
  return new Date(Number(ts) * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-gold/15 bg-black/30 px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-cream/40 text-xs">{label}</p>
        <p className="text-cream text-sm break-all">{value}</p>
      </div>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          } catch {
            /* noop */
          }
        }}
        className="shrink-0 p-2 rounded-lg border border-gold/20 hover:border-gold/50 hover:bg-gold/10 transition-colors"
        aria-label={`Copy ${label}`}
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Copy className="w-4 h-4 text-gold" />
        )}
      </button>
    </div>
  );
}

type Tab = "create" | "lookup";

const ACTION_META: Record<string, { label: string; color: string }> = {
  accept: { label: "Accept Deal", color: "from-blue-500 to-cyan-500" },
  deliver: { label: "Mark Delivered", color: "from-purple-500 to-pink-500" },
  approve: { label: "Approve & Pay", color: "from-emerald-500 to-green-500" },
  dispute: { label: "Dispute", color: "from-red-500 to-orange-500" },
  cancel: { label: "Cancel", color: "from-cream/30 to-cream/20" },
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function HandshakeApp() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();

  /* ---- Protocol config ---- */
  const [config, setConfig] = useState<ProtocolConfigAccount | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  /* ---- Tab ---- */
  const [tab, setTab] = useState<Tab>("create");

  /* ---- Create form ---- */
  const [workerAddr, setWorkerAddr] = useState("");
  const [desc, setDesc] = useState("");
  const [amtStr, setAmtStr] = useState("");
  const [dlDays, setDlDays] = useState("7");

  /* ---- Lookup ---- */
  const [lookupId, setLookupId] = useState("");
  const [handshake, setHandshake] = useState<HandshakeAccount | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  /* ---- Transaction ---- */
  const [txBusy, setTxBusy] = useState(false);
  const [txResult, setTxResult] = useState<{
    ok: boolean;
    sig?: string;
    err?: string;
  } | null>(null);

  /* ---- Fetch config on mount ---- */
  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        setConfigLoading(true);
        setConfigError(null);
        const c = await fetchConfig(connection);
        if (!dead) setConfig(c);
      } catch (e: unknown) {
        if (!dead)
          setConfigError(
            e instanceof Error ? e.message : "Network error"
          );
      } finally {
        if (!dead) setConfigLoading(false);
      }
    })();
    return () => {
      dead = true;
    };
  }, [connection]);

  /* ---- Auto-clear toast ---- */
  useEffect(() => {
    if (!txResult) return;
    const t = setTimeout(() => setTxResult(null), 12_000);
    return () => clearTimeout(t);
  }, [txResult]);

  /* ---- Computed ---- */
  const amountUnits = useMemo(() => parseSourToUnits(amtStr), [amtStr]);
  const pinch = useMemo(
    () =>
      calculatePinch(
        amountUnits,
        config?.pinchBps,
        config?.burnShareBps,
        config?.keepersShareBps,
      ),
    [amountUnits, config],
  );
  const [configPda] = useMemo(() => getConfigPda(), []);

  const userRole = useMemo(() => {
    if (!publicKey || !handshake) return null;
    const pk = publicKey.toBase58();
    if (handshake.creator.toBase58() === pk) return "creator" as const;
    if (handshake.worker.toBase58() === pk) return "worker" as const;
    return null;
  }, [publicKey, handshake]);

  const actions = useMemo(() => {
    if (!userRole || !handshake) return [] as string[];
    const s = handshake.status;
    const a: string[] = [];
    if (userRole === "creator") {
      if (s === HandshakeStatus.Created) a.push("cancel");
      if (s === HandshakeStatus.Delivered) a.push("approve", "dispute");
    }
    if (userRole === "worker") {
      if (s === HandshakeStatus.Created) a.push("accept");
      if (s === HandshakeStatus.Accepted) a.push("deliver");
    }
    if (
      (s === HandshakeStatus.Accepted || s === HandshakeStatus.Delivered) &&
      !a.includes("dispute")
    ) {
      a.push("dispute");
    }
    return a;
  }, [userRole, handshake]);

  const canCreate =
    connected &&
    !!config &&
    workerAddr.trim().length >= 32 &&
    desc.trim().length > 0 &&
    amountUnits > BigInt(0) &&
    !txBusy;

  /* ---- Handlers ---- */
  const doCreate = useCallback(async () => {
    if (!publicKey || !config || !sendTransaction) return;
    try {
      setTxBusy(true);
      setTxResult(null);
      const worker = new PublicKey(workerAddr.trim());
      const hsId = config.handshakeCount;
      const [hsPda] = getHandshakePda(hsId);
      const [vault] = getVaultPda(hsId);
      const [vaultAuth] = getVaultAuthorityPda(hsId);
      const creatorAta = await getAssociatedTokenAddress(
        config.sourMint,
        publicKey,
      );
      const deadline = BigInt(
        Math.floor(Date.now() / 1000) + Number(dlDays) * 86400,
      );
      const ix = buildCreateHandshakeIx({
        config: configPda,
        handshakePda: hsPda,
        vault,
        vaultAuthority: vaultAuth,
        creatorTokenAccount: creatorAta,
        worker,
        sourMint: config.sourMint,
        creator: publicKey,
        description: desc.trim(),
        amount: amountUnits,
        deadlineTs: deadline,
      });
      const tx = new Transaction().add(ix);
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setTxResult({ ok: true, sig });
      const fresh = await fetchConfig(connection);
      if (fresh) setConfig(fresh);
      setDesc("");
      setWorkerAddr("");
      setAmtStr("");
    } catch (e: unknown) {
      setTxResult({
        ok: false,
        err: e instanceof Error ? e.message : "Transaction failed",
      });
    } finally {
      setTxBusy(false);
    }
  }, [
    publicKey,
    config,
    sendTransaction,
    connection,
    workerAddr,
    desc,
    amountUnits,
    dlDays,
    configPda,
  ]);

  const doLookup = useCallback(async () => {
    try {
      setLookupLoading(true);
      setLookupError(null);
      setHandshake(null);
      const hs = await fetchHandshake(connection, Number(lookupId));
      if (!hs) setLookupError("Handshake not found");
      else setHandshake(hs);
    } catch (e: unknown) {
      setLookupError(e instanceof Error ? e.message : "Fetch failed");
    } finally {
      setLookupLoading(false);
    }
  }, [connection, lookupId]);

  const doAction = useCallback(
    async (action: string) => {
      if (!publicKey || !handshake || !sendTransaction || !config) return;
      try {
        setTxBusy(true);
        setTxResult(null);
        const hsId = handshake.id;
        const [hsPda] = getHandshakePda(hsId);
        const tx = new Transaction();

        if (action === "accept") {
          tx.add(buildAcceptIx(hsPda, publicKey));
        } else if (action === "deliver") {
          tx.add(buildDeliverIx(hsPda, publicKey));
        } else if (action === "approve") {
          const [vault] = getVaultPda(hsId);
          const [vaultAuth] = getVaultAuthorityPda(hsId);
          const workerAta = await getAssociatedTokenAddress(
            config.sourMint,
            handshake.worker,
          );
          tx.add(
            buildApproveIx({
              config: configPda,
              handshakePda: hsPda,
              vault,
              vaultAuthority: vaultAuth,
              workerTokenAccount: workerAta,
              keepersPool: config.keepersPool,
              commonsTreasury: config.commonsTreasury,
              sourMint: config.sourMint,
              creator: publicKey,
            }),
          );
        } else if (action === "dispute") {
          tx.add(buildDisputeIx(configPda, hsPda, publicKey));
        } else if (action === "cancel") {
          const [vault] = getVaultPda(hsId);
          const [vaultAuth] = getVaultAuthorityPda(hsId);
          const creatorAta = await getAssociatedTokenAddress(
            config.sourMint,
            publicKey,
          );
          tx.add(
            buildCancelIx({
              config: configPda,
              handshakePda: hsPda,
              vault,
              vaultAuthority: vaultAuth,
              creatorTokenAccount: creatorAta,
              creator: publicKey,
            }),
          );
        }

        const sig = await sendTransaction(tx, connection);
        await connection.confirmTransaction(sig, "confirmed");
        setTxResult({ ok: true, sig });
        const fresh = await fetchHandshake(connection, Number(hsId));
        if (fresh) setHandshake(fresh);
      } catch (e: unknown) {
        setTxResult({
          ok: false,
          err: e instanceof Error ? e.message : "Transaction failed",
        });
      } finally {
        setTxBusy(false);
      }
    },
    [publicKey, handshake, sendTransaction, connection, config, configPda],
  );

  const walletLabel = publicKey
    ? shortenAddress(publicKey.toBase58())
    : "Not connected";

  const statusPreview = [
    HandshakeStatus.Created,
    HandshakeStatus.Accepted,
    HandshakeStatus.Delivered,
    HandshakeStatus.Approved,
    HandshakeStatus.Disputed,
  ];

  // =========================================================================
  // Render
  // =========================================================================
  return (
    <section className="min-h-[80vh] px-4 py-24 relative">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-b from-gold/10 to-transparent blur-[200px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        {/* ---- Hero ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold text-gold text-sm font-medium tracking-wider">
              <HandshakeIcon className="w-4 h-4" />
              THE HANDSHAKE
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wider animate-pulse">
              DEVNET
            </span>
          </div>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-4">
            P2P Escrow Protocol
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto mb-3">
            Two people, one Recipe. No middleman, no borders, no waiting. Code
            guards the deal, the Starter carries the payment.
          </p>
          <p className="text-cream/40 max-w-2xl mx-auto text-sm">
            Trustless P2P agreements on Solana. Every deal is a smart contract
            — deliverables, deadlines, and payment locked on-chain. A 2% Pinch
            fuels the ecosystem: 50% buyback+LP, 30% Keepers, 20% Commons.
          </p>
        </motion.div>

        {/* ---- How It Works ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2"
        >
          {[
            {
              step: "1",
              title: "Create",
              desc: "Define deliverables, deadline, and $SOUR amount. Funds lock on-chain.",
            },
            {
              step: "2",
              title: "Accept",
              desc: "Worker reviews and accepts. Escrow is untouchable until conditions are met.",
            },
            {
              step: "3",
              title: "Deliver",
              desc: "Worker submits. Creator reviews. Approved? Funds release instantly.",
            },
            {
              step: "4",
              title: "Resolve",
              desc: "Dispute? An arbiter resolves. The 2% Pinch feeds buyback, Keepers & Commons.",
            },
          ].map((it) => (
            <div
              key={it.step}
              className="rounded-xl border border-gold/15 bg-black/30 p-4"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber flex items-center justify-center text-black font-bold text-sm mb-3">
                {it.step}
              </div>
              <h3 className="font-cinzel text-cream font-bold text-sm mb-1">
                {it.title}
              </h3>
              <p className="text-cream/45 text-xs leading-relaxed">
                {it.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* ---- Main Grid ---- */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT — Create / Lookup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-gold/20 bg-black/40 backdrop-blur-sm p-6 space-y-5"
          >
            {/* Wallet */}
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
                <span className="text-emerald-400 text-sm font-medium">
                  {walletLabel}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {(["create", "lookup"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    tab === t
                      ? "bg-gold/15 border border-gold/40 text-gold"
                      : "border border-gold/10 text-cream/40 hover:text-cream/60 hover:border-gold/20"
                  }`}
                >
                  {t === "create" ? (
                    <Plus className="w-4 h-4" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {t === "create" ? "Create" : "Lookup"}
                </button>
              ))}
            </div>

            {/* ---- Create Tab ---- */}
            {tab === "create" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-cream/70 text-sm mb-2">
                    Worker Address
                  </label>
                  <input
                    value={workerAddr}
                    onChange={(e) => setWorkerAddr(e.target.value)}
                    placeholder="Solana public key"
                    className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-cream/70 text-sm mb-2">
                    Description{" "}
                    <span className="text-cream/30">(max 280)</span>
                  </label>
                  <input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value.slice(0, 280))}
                    placeholder="What needs to be delivered?"
                    className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cream/70 text-sm mb-2">
                      Amount ($SOUR)
                    </label>
                    <input
                      value={amtStr}
                      onChange={(e) => setAmtStr(e.target.value)}
                      inputMode="decimal"
                      placeholder="0.00"
                      className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-cream/70 text-sm mb-2">
                      Deadline (days)
                    </label>
                    <input
                      value={dlDays}
                      onChange={(e) =>
                        setDlDays(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      inputMode="numeric"
                      className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                {/* Pinch Preview */}
                {amountUnits > BigInt(0) && (
                  <div className="rounded-xl border border-gold/15 bg-black/20 p-4 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cream/50">Pinch (2%)</span>
                      <span className="text-gold">
                        {formatSourAmount(pinch.pinchTotal)} $SOUR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cream/50">Worker receives</span>
                      <span className="text-emerald-400">
                        {formatSourAmount(pinch.workerAmount)} $SOUR
                      </span>
                    </div>
                  </div>
                )}

                {/* Not-initialized warning */}
                {!config && !configLoading && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
                    <p className="text-amber-100/90 text-xs leading-relaxed">
                      Protocol not initialized on devnet. Deploy the program
                      and run initialize_config before creating handshakes.
                    </p>
                  </div>
                )}

                <button
                  onClick={doCreate}
                  disabled={!canCreate}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-gold to-amber text-black disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2"
                >
                  {txBusy ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <HandshakeIcon className="w-4 h-4" />
                  )}
                  {txBusy ? "Sending..." : "Create Handshake"}
                </button>
              </div>
            )}

            {/* ---- Lookup Tab ---- */}
            {tab === "lookup" && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    value={lookupId}
                    onChange={(e) =>
                      setLookupId(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Handshake ID"
                    inputMode="numeric"
                    className="flex-1 rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                  />
                  <button
                    onClick={doLookup}
                    disabled={!lookupId || lookupLoading}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {lookupLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {lookupError && (
                  <p className="text-red-400 text-sm">{lookupError}</p>
                )}

                {/* Fetched Handshake Card */}
                {handshake && (
                  <div className="rounded-xl border border-gold/20 bg-black/30 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-cinzel text-cream font-bold">
                        Handshake #{handshake.id.toString()}
                      </h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border border-current/20 ${getStatusColor(handshake.status)}`}
                      >
                        {getStatusLabel(handshake.status)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-cream/50">Creator</span>
                        <span className="text-cream">
                          {shortenAddress(handshake.creator.toBase58(), 6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cream/50">Worker</span>
                        <span className="text-cream">
                          {shortenAddress(handshake.worker.toBase58(), 6)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cream/50">Amount</span>
                        <span className="text-gold">
                          {formatSourAmount(handshake.amount)} $SOUR
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cream/50">Created</span>
                        <span className="text-cream">
                          {tsToDate(handshake.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-cream/50">Deadline</span>
                        <span className="text-cream">
                          {tsToDate(handshake.deadlineTs)}
                        </span>
                      </div>
                      {handshake.description && (
                        <div className="pt-2 border-t border-gold/10">
                          <p className="text-cream/50 text-xs mb-1">
                            Description
                          </p>
                          <p className="text-cream text-sm">
                            {handshake.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {userRole && (
                      <p className="text-xs text-cream/40">
                        You are the{" "}
                        <span className="text-gold font-semibold">
                          {userRole}
                        </span>{" "}
                        in this deal.
                      </p>
                    )}

                    {actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {actions.map((a) => {
                          const m = ACTION_META[a];
                          return (
                            <button
                              key={a}
                              onClick={() => doAction(a)}
                              disabled={txBusy}
                              className={`px-4 py-2 rounded-lg text-sm font-bold bg-gradient-to-r ${m?.color ?? "from-gold to-amber"} text-black disabled:opacity-30 flex items-center gap-2`}
                            >
                              {txBusy && (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              )}
                              {m?.label ?? a}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* RIGHT — Protocol Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-gold/20 bg-black/40 backdrop-blur-sm p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-gold">
              <ShieldCheck className="w-4 h-4" />
              <p className="font-semibold">Protocol Info</p>
              <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                DEVNET
              </span>
            </div>

            <CopyRow
              label="Program ID"
              value={SOUR_HANDSHAKE_PROGRAM_ID.toBase58()}
            />
            <CopyRow label="Config PDA" value={configPda.toBase58()} />

            {configLoading ? (
              <div className="flex items-center gap-2 text-cream/40 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading config...
              </div>
            ) : configError ? (
              <p className="text-red-400 text-sm">{configError}</p>
            ) : config ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-gold/15 bg-black/20 p-4 space-y-2">
                  <p className="text-sm text-cream/50">On-Chain Stats</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <p className="text-cream/60">Total Handshakes</p>
                    <p className="text-right text-cream">
                      {config.handshakeCount.toString()}
                    </p>
                    <p className="text-cream/60">Completed</p>
                    <p className="text-right text-emerald-400">
                      {config.totalCompleted.toString()}
                    </p>
                    <p className="text-cream/60">Disputed</p>
                    <p className="text-right text-red-400">
                      {config.totalDisputed.toString()}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-gold/15 bg-black/20 p-4 space-y-2">
                  <p className="text-sm text-cream/50">
                    Pinch Config ({(config.pinchBps / 100).toFixed(1)}%)
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <p className="text-cream/60">Buyback+LP</p>
                    <p className="text-right text-red-400">
                      {(config.burnShareBps / 100).toFixed(0)}%
                    </p>
                    <p className="text-cream/60">Keepers</p>
                    <p className="text-right text-blue-400">
                      {(config.keepersShareBps / 100).toFixed(0)}%
                    </p>
                    <p className="text-cream/60">Commons</p>
                    <p className="text-right text-purple-400">
                      {(config.commonsShareBps / 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
                <p className="text-amber-100/90 text-xs leading-relaxed">
                  Protocol not yet initialized on devnet. Deploy the program
                  and run{" "}
                  <code className="text-gold">initialize_config</code> to
                  activate.
                </p>
              </div>
            )}

            {/* Pinch Breakdown */}
            <div className="rounded-xl border border-gold/15 bg-black/20 p-4 space-y-2">
              <p className="text-sm text-cream/50">
                Pinch Breakdown (2% · 50/30/20)
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <p className="text-cream/60">Amount</p>
                <p className="text-right text-cream">
                  {formatSourAmount(amountUnits)} $SOUR
                </p>
                <p className="text-cream/60">Pinch Total</p>
                <p className="text-right text-gold">
                  {formatSourAmount(pinch.pinchTotal)} $SOUR
                </p>
                <p className="text-cream/60">Buyback+LP</p>
                <p className="text-right text-red-400">
                  {formatSourAmount(pinch.burnAmount)} $SOUR
                </p>
                <p className="text-cream/60">Keepers</p>
                <p className="text-right text-blue-400">
                  {formatSourAmount(pinch.keepersAmount)} $SOUR
                </p>
                <p className="text-cream/60">Commons</p>
                <p className="text-right text-purple-400">
                  {formatSourAmount(pinch.commonsAmount)} $SOUR
                </p>
                <p className="text-cream/60">Worker Receives</p>
                <p className="text-right text-emerald-400">
                  {formatSourAmount(pinch.workerAmount)} $SOUR
                </p>
              </div>
            </div>

            {/* Lifecycle */}
            <div className="rounded-xl border border-gold/15 bg-black/20 p-4">
              <p className="text-sm text-cream/50 mb-2">Lifecycle</p>
              <div className="flex flex-wrap gap-2">
                {statusPreview.map((s) => (
                  <span
                    key={s}
                    className={`text-xs px-2.5 py-1 rounded-full border border-current/20 ${getStatusColor(s)}`}
                  >
                    {getStatusLabel(s)}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---- Transaction Toast ---- */}
      {txResult && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-5 py-4 rounded-2xl border backdrop-blur-md ${
            txResult.ok
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-red-500/40 bg-red-500/10"
          }`}
        >
          <p
            className={`text-sm font-medium ${txResult.ok ? "text-emerald-300" : "text-red-300"}`}
          >
            {txResult.ok ? "Transaction confirmed!" : "Transaction failed"}
          </p>
          {txResult.sig && (
            <a
              href={`https://solscan.io/tx/${txResult.sig}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gold hover:underline mt-1"
            >
              View on Solscan <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {txResult.err && (
            <p className="text-red-300/70 text-xs mt-1 break-all">
              {txResult.err}
            </p>
          )}
        </motion.div>
      )}
    </section>
  );
}
