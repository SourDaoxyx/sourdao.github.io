"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  isMobileWithoutProvider,
  getPhantomBrowseLink,
  getSolflareBrowseLink,
} from "@/lib/mobile-wallet";
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
  Code,
  Palette,
  GraduationCap,
  Globe,
  ShoppingCart,
  FileText,
  ChevronRight,
  List,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  CircleDot,
  Trash2,
  Share2,
  ArrowLeft,
} from "lucide-react";

import {
  getHandshake,
  getHandshakesForWallet,
  type Handshake,
  type HandshakeWithMilestones,
  type Milestone,
} from "@/lib/handshake-store";
import {
  signMessage,
} from "@/lib/handshake-signing";
import {
  prepareCancelHandshakeForSigning,
  prepareCreateHandshakeForSigning,
  prepareAcceptHandshakeForSigning,
  prepareApproveMilestoneForSigning,
  submitPreparedApproveMilestone,
  submitPreparedAcceptHandshake,
  submitPreparedCancelHandshake,
  submitPreparedCreateHandshake,
} from "@/lib/handshake-service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shortenAddress(addr: string, chars = 4): string {
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

function statusConfig(status: string) {
  switch (status) {
    case "created":
      return { label: "Pending", color: "text-amber-300", bg: "bg-amber-500/15 border-amber-500/30", icon: Clock };
    case "active":
      return { label: "Active", color: "text-blue-300", bg: "bg-blue-500/15 border-blue-500/30", icon: CircleDot };
    case "completed":
      return { label: "Completed", color: "text-emerald-300", bg: "bg-emerald-500/15 border-emerald-500/30", icon: CheckCircle2 };
    case "cancelled":
      return { label: "Cancelled", color: "text-red-300", bg: "bg-red-500/15 border-red-500/30", icon: XCircle };
    case "expired":
      return { label: "Expired", color: "text-cream/40", bg: "bg-cream/5 border-cream/10", icon: Clock };
    default:
      return { label: status, color: "text-cream/50", bg: "bg-cream/5 border-cream/10", icon: CircleDot };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysUntil(iso: string): number {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
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
      aria-label={label ?? "Copy"}
    >
      {copied ? (
        <Check className="w-4 h-4 text-emerald-400" />
      ) : (
        <Copy className="w-4 h-4 text-gold" />
      )}
    </button>
  );
}

// Milestone row in create form
function MilestoneFormRow({
  index,
  title,
  amount,
  onUpdate,
  onRemove,
  canRemove,
}: {
  index: number;
  title: string;
  amount: string;
  onUpdate: (field: "title" | "amount", val: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold shrink-0 mt-1">
        {index + 1}
      </div>
      <div className="flex-1 grid sm:grid-cols-3 gap-2">
        <input
          value={title}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder={`Milestone ${index + 1}`}
          className="sm:col-span-2 rounded-lg border border-gold/20 bg-black/40 px-3 py-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
        <input
          value={amount}
          onChange={(e) => onUpdate("amount", e.target.value)}
          placeholder="Amount"
          inputMode="decimal"
          className="rounded-lg border border-gold/20 bg-black/40 px-3 py-2 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
      </div>
      {canRemove && (
        <button
          onClick={onRemove}
          className="p-2 text-cream/30 hover:text-red-400 transition-colors mt-0.5"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "my-deals" | "create" | "lookup";

interface MilestoneInput {
  title: string;
  amount: string;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function HandshakeApp() {
  const { publicKey, connected, signMessage: walletSignMessage } = useWallet();
  const { setVisible } = useWalletModal();

  // Mobile detection
  const [mobileNoProvider, setMobileNoProvider] = useState(false);
  useEffect(() => {
    setMobileNoProvider(isMobileWithoutProvider());
  }, []);

  /* ---- Navigation ---- */
  const [tab, setTab] = useState<Tab>("my-deals");
  const [detailId, setDetailId] = useState<string | null>(null);

  /* ---- List ---- */
  const [deals, setDeals] = useState<Handshake[]>([]);
  const [listLoading, setListLoading] = useState(false);

  /* ---- Detail ---- */
  const [detail, setDetail] = useState<HandshakeWithMilestones | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  /* ---- Create form ---- */
  const [counterpartyAddr, setCounterpartyAddr] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: "", amount: "" },
  ]);

  /* ---- Lookup ---- */
  const [lookupId, setLookupId] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);

  /* ---- Busy/Toast ---- */
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );

  // Check if page was loaded with ?id= query param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setDetailId(id);
      setTab("my-deals");
    }
  }, []);

  /* ---- Auto-clear toast ---- */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(t);
  }, [toast]);

  /* ---- Load deals when wallet connects ---- */
  const loadDeals = useCallback(async () => {
    if (!publicKey) return;
    try {
      setListLoading(true);
      const data = await getHandshakesForWallet(publicKey.toBase58());
      setDeals(data);
    } catch {
      /* silent */
    } finally {
      setListLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (connected && tab === "my-deals" && !detailId) loadDeals();
  }, [connected, tab, detailId, loadDeals]);

  /* ---- Load detail ---- */
  const loadDetail = useCallback(async (id: string) => {
    try {
      setDetailLoading(true);
      const data = await getHandshake(id);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (detailId) loadDetail(detailId);
  }, [detailId, loadDetail]);

  /* ---- Computed ---- */
  const walletAddr = publicKey?.toBase58() ?? "";
  const walletLabel = publicKey ? shortenAddress(walletAddr) : "Not connected";

  const totalAmount = useMemo(
    () => milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0),
    [milestones],
  );

  const canCreate =
    connected &&
    !!walletSignMessage &&
    counterpartyAddr.trim().length >= 32 &&
    formTitle.trim().length > 0 &&
    milestones.every((m) => m.title.trim() && parseFloat(m.amount) > 0) &&
    totalAmount > 0 &&
    !busy;

  const userRole = useMemo(() => {
    if (!publicKey || !detail) return null;
    const pk = publicKey.toBase58();
    if (detail.creator_wallet === pk) return "creator" as const;
    if (detail.counterparty_wallet === pk) return "counterparty" as const;
    return null;
  }, [publicKey, detail]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCreate = useCallback(async () => {
    if (!publicKey || !walletSignMessage) return;
    try {
      setBusy(true);
      const deadlineDate = new Date(
        Date.now() + Number(deadlineDays) * 86_400_000,
      ).toISOString();

      const prepared = await prepareCreateHandshakeForSigning({
        creatorWallet: walletAddr,
        counterpartyWallet: counterpartyAddr,
        title: formTitle,
        description: desc,
        deadline: deadlineDate,
        milestones,
      });
      const sig = await signMessage(prepared.canonicalMessage, walletSignMessage);

      const hs = await submitPreparedCreateHandshake({
        prepared,
        creatorSignature: sig,
        signedMessage: prepared.canonicalMessage,
      });

      setToast({
        ok: true,
        msg: "Handshake created! Share the link with your counterparty.",
      });
      // Reset form
      setCounterpartyAddr("");
      setFormTitle("");
      setDesc("");
      setMilestones([{ title: "", amount: "" }]);
      setDeadlineDays("7");
      // Navigate to detail
      setDetailId(hs.id);
    } catch (e: unknown) {
      setToast({
        ok: false,
        msg: e instanceof Error ? e.message : "Failed to create handshake",
      });
    } finally {
      setBusy(false);
    }
  }, [
    publicKey,
    walletSignMessage,
    walletAddr,
    counterpartyAddr,
    formTitle,
    desc,
    deadlineDays,
    milestones,
  ]);

  const handleAccept = useCallback(async () => {
    if (!publicKey || !walletSignMessage || !detail) return;
    try {
      setBusy(true);
      const { prepared, handshake } = await prepareAcceptHandshakeForSigning({
        handshakeId: detail.id,
        counterpartyWallet: walletAddr,
      });
      const sig = await signMessage(prepared.canonicalMessage, walletSignMessage);
      await submitPreparedAcceptHandshake({
        prepared,
        handshake,
        counterpartySignature: sig,
        signedMessage: prepared.canonicalMessage,
      });
      setToast({
        ok: true,
        msg: "Agreement accepted! The handshake is now active.",
      });
      await loadDetail(detail.id);
    } catch (e: unknown) {
      setToast({
        ok: false,
        msg: e instanceof Error ? e.message : "Failed to accept",
      });
    } finally {
      setBusy(false);
    }
  }, [publicKey, walletSignMessage, detail, walletAddr, loadDetail]);

  const handleApproveMilestone = useCallback(
    async (milestone: Milestone) => {
      if (!publicKey || !walletSignMessage || !detail || !userRole) return;
      try {
        setBusy(true);
        const { prepared, handshake, milestone: currentMilestone } = await prepareApproveMilestoneForSigning({
          handshakeId: detail.id,
          milestoneId: milestone.id,
          signerRole: userRole,
          approverWallet: walletAddr,
        });
        const sig = await signMessage(prepared.canonicalMessage, walletSignMessage);
        const { allApproved } = await submitPreparedApproveMilestone({
          prepared,
          handshake,
          milestone: currentMilestone,
          approverSignature: sig,
          signedMessage: prepared.canonicalMessage,
        });
        if (allApproved) {
          setToast({
            ok: true,
            msg: "All milestones approved — Handshake completed! 🤝",
          });
        } else {
          setToast({
            ok: true,
            msg: `Milestone "${milestone.title}" approved.`,
          });
        }
        await loadDetail(detail.id);
      } catch (e: unknown) {
        setToast({
          ok: false,
          msg:
            e instanceof Error ? e.message : "Failed to approve milestone",
        });
      } finally {
        setBusy(false);
      }
    },
    [publicKey, walletSignMessage, detail, walletAddr, userRole, loadDetail],
  );

  const handleCancel = useCallback(async () => {
    if (!publicKey || !walletSignMessage || !detail) return;
    if (!confirm("Cancel this handshake? This cannot be undone.")) return;
    try {
      setBusy(true);
      const { prepared, handshake } = await prepareCancelHandshakeForSigning({
        handshakeId: detail.id,
        signerWallet: walletAddr,
      });
      const sig = await signMessage(prepared.canonicalMessage, walletSignMessage);
      await submitPreparedCancelHandshake({
        prepared,
        handshake,
        signerSignature: sig,
        signedMessage: prepared.canonicalMessage,
      });
      setToast({ ok: true, msg: "Handshake cancelled." });
      await loadDetail(detail.id);
    } catch (e: unknown) {
      setToast({
        ok: false,
        msg: e instanceof Error ? e.message : "Failed to cancel",
      });
    } finally {
      setBusy(false);
    }
  }, [publicKey, walletSignMessage, detail, walletAddr, loadDetail]);

  const handleLookup = useCallback(async () => {
    if (!lookupId.trim()) return;
    setLookupError(null);
    try {
      setDetailLoading(true);
      const data = await getHandshake(lookupId.trim());
      if (!data) {
        setLookupError("Handshake not found");
        return;
      }
      setDetailId(data.id);
    } catch {
      setLookupError("Lookup failed");
    } finally {
      setDetailLoading(false);
    }
  }, [lookupId]);

  const shareLink = useMemo(() => {
    if (!detail) return "";
    return `${typeof window !== "undefined" ? window.location.origin : ""}/handshake?id=${detail.id}`;
  }, [detail]);

  const handleShareLink = useCallback(async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setToast({
        ok: true,
        msg: "Link copied! Send it to your counterparty.",
      });
    } catch {
      /* noop */
    }
  }, [shareLink]);

  // Milestone form helpers
  const updateMilestone = (
    idx: number,
    field: "title" | "amount",
    val: string,
  ) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: val } : m)),
    );
  };
  const addMilestone = () => {
    if (milestones.length < 10)
      setMilestones((prev) => [...prev, { title: "", amount: "" }]);
  };
  const removeMilestone = (idx: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== idx));
  };

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
          </div>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-cream mb-4">
            P2P Agreement Protocol
          </h1>
          <p className="text-cream/60 max-w-2xl mx-auto mb-3 text-lg">
            Create milestone-based agreements with anyone. Both parties sign
            with their wallet — no middlemen, no escrow (yet). Your reputation
            is your collateral.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {[
              { icon: ShieldCheck, text: "Wallet-signed agreements" },
              { icon: CheckCircle2, text: "Milestone tracking" },
              { icon: Globe, text: "Borderless & permissionless" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-cream/50 text-sm"
              >
                <item.icon className="w-3.5 h-3.5 text-gold/70" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ---- How It Works ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          <h2 className="font-cinzel text-xl font-bold text-cream mb-4 text-center">
            How It Works
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            {[
              {
                step: "1",
                title: "Create",
                desc: "Define the scope, set milestones with amounts, choose a deadline, and sign with your wallet.",
                example: '"Logo design — 3 milestones, 7 days"',
              },
              {
                step: "2",
                title: "Share",
                desc: "Send the agreement link to your counterparty. They review the terms and sign to accept.",
                example: "sourdao.xyz/handshake?id=abc123",
              },
              {
                step: "3",
                title: "Deliver",
                desc: "As each milestone is completed, both parties sign to approve. Progress is tracked.",
                example: "Milestone 1 ✓ → Milestone 2 ✓ → Milestone 3...",
              },
              {
                step: "4",
                title: "Complete",
                desc: "When all milestones are approved by both sides, the handshake is complete. Your Crust Score rises.",
                example: "+138 Trade Score · First Shake stamp 🤝",
              },
            ].map((it) => (
              <div
                key={it.step}
                className="rounded-xl border border-gold/15 bg-black/30 p-5 flex flex-col"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber flex items-center justify-center text-black font-bold text-sm mb-3">
                  {it.step}
                </div>
                <h3 className="font-cinzel text-cream font-bold text-sm mb-1">
                  {it.title}
                </h3>
                <p className="text-cream/50 text-xs leading-relaxed mb-2">
                  {it.desc}
                </p>
                <p className="text-gold/40 text-[11px] italic mt-auto">
                  {it.example}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ---- Use Cases ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="font-cinzel text-xl font-bold text-cream mb-4 text-center">
            Who Is This For?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
            {[
              {
                icon: Code,
                title: "Freelance Development",
                desc: "Smart contracts, bots, dApps — agree on milestones and track delivery.",
                example: '"Build a Telegram bot — 3 milestones"',
              },
              {
                icon: Palette,
                title: "Design & Creative Work",
                desc: "Logos, branding, NFT art. Define deliverables, sign, and approve step by step.",
                example: '"Brand identity — concept → revision → final"',
              },
              {
                icon: FileText,
                title: "Content & Marketing",
                desc: "Articles, threads, video scripts. Set scope, deadlines, milestone approvals.",
                example: '"10 Twitter threads — draft → publish"',
              },
              {
                icon: GraduationCap,
                title: "Consulting & Tutoring",
                desc: "Sessions, code reviews, strategy calls. Track per-session agreements.",
                example: '"Solana audit — review → report → fix"',
              },
              {
                icon: ShoppingCart,
                title: "P2P Trades & OTC",
                desc: "Token swaps, NFT deals. Record the agreement with wallet signatures.",
                example: '"OTC: 50K SOUR ↔ 2 SOL"',
              },
              {
                icon: Globe,
                title: "Cross-Border Services",
                desc: "Work with anyone, anywhere. Wallet signatures prove commitment.",
                example: '"Translation: EN→TR — draft → final"',
              },
            ].map((uc, i) => (
              <div
                key={i}
                className="rounded-xl border border-gold/15 bg-black/30 p-5 hover:border-gold/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold/20 to-amber-500/10 flex items-center justify-center mb-3 group-hover:from-gold/30 group-hover:to-amber-500/20 transition-colors">
                  <uc.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-cinzel text-cream font-bold text-sm mb-1.5">
                  {uc.title}
                </h3>
                <p className="text-cream/50 text-xs leading-relaxed mb-2">
                  {uc.desc}
                </p>
                <p className="text-gold/40 text-[11px] italic">{uc.example}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ================================================================ */}
        {/* Main Panel                                                       */}
        {/* ================================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl border border-gold/20 bg-black/40 backdrop-blur-sm p-6 space-y-5"
        >
          {/* Wallet Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-gold/60" />
              <p className="text-cream/60 text-sm">Wallet</p>
            </div>
            {!connected ? (
              mobileNoProvider ? (
                <div className="flex gap-2">
                  <a
                    href={getPhantomBrowseLink()}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold"
                  >
                    <Wallet className="w-3.5 h-3.5" /> Phantom
                  </a>
                  <a
                    href={getSolflareBrowseLink()}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600 text-white text-xs font-bold"
                  >
                    <Wallet className="w-3.5 h-3.5" /> Solflare
                  </a>
                </div>
              ) : (
                <button
                  onClick={() => setVisible(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-amber text-black text-sm font-bold"
                >
                  <Wallet className="w-4 h-4" /> Connect
                </button>
              )
            ) : (
              <span className="text-emerald-400 text-sm font-medium">
                {walletLabel}
              </span>
            )}
          </div>

          {/* Tabs — only when NOT in detail view */}
          {!detailId && (
            <div className="flex gap-2">
              {(
                [
                  { key: "my-deals" as Tab, icon: List, label: "My Deals" },
                  { key: "create" as Tab, icon: Plus, label: "Create" },
                  { key: "lookup" as Tab, icon: Search, label: "Lookup" },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    tab === t.key
                      ? "bg-gold/15 border border-gold/40 text-gold"
                      : "border border-gold/10 text-cream/40 hover:text-cream/60 hover:border-gold/20"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* ============================================================= */}
          {/* DETAIL VIEW                                                    */}
          {/* ============================================================= */}
          {detailId && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  setDetailId(null);
                  setDetail(null);
                  setTab("my-deals");
                  // Clear URL param
                  if (typeof window !== "undefined") {
                    const url = new URL(window.location.href);
                    url.searchParams.delete("id");
                    window.history.replaceState({}, "", url.pathname);
                  }
                }}
                className="flex items-center gap-1.5 text-cream/40 hover:text-cream text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to deals
              </button>

              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gold animate-spin" />
                </div>
              ) : !detail ? (
                <div className="text-center py-12">
                  <AlertTriangle className="w-8 h-8 text-amber-300 mx-auto mb-2" />
                  <p className="text-cream/50">Handshake not found</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-cinzel text-cream text-lg font-bold">
                        {detail.title}
                      </h3>
                      {detail.description && (
                        <p className="text-cream/50 text-sm mt-1">
                          {detail.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${statusConfig(detail.status).bg} ${statusConfig(detail.status).color}`}
                    >
                      {(() => {
                        const Icon = statusConfig(detail.status).icon;
                        return <Icon className="w-3.5 h-3.5" />;
                      })()}
                      {statusConfig(detail.status).label}
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-gold/15 bg-black/20 p-3">
                      <p className="text-cream/40 text-xs mb-1">Creator</p>
                      <div className="flex items-center gap-2">
                        <p className="text-cream text-sm break-all flex-1">
                          {detail.creator_wallet}
                        </p>
                        <CopyButton value={detail.creator_wallet} />
                      </div>
                    </div>
                    <div className="rounded-xl border border-gold/15 bg-black/20 p-3">
                      <p className="text-cream/40 text-xs mb-1">
                        Counterparty
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-cream text-sm break-all flex-1">
                          {detail.counterparty_wallet}
                        </p>
                        <CopyButton value={detail.counterparty_wallet} />
                      </div>
                    </div>
                    <div className="rounded-xl border border-gold/15 bg-black/20 p-3">
                      <p className="text-cream/40 text-xs mb-1">
                        Total Amount
                      </p>
                      <p className="text-gold font-bold">
                        {detail.total_amount.toLocaleString()} $SOUR
                      </p>
                    </div>
                    <div className="rounded-xl border border-gold/15 bg-black/20 p-3">
                      <p className="text-cream/40 text-xs mb-1">Deadline</p>
                      <p className="text-cream text-sm">
                        {formatDate(detail.deadline)}
                        {detail.status === "active" && (
                          <span
                            className={`ml-2 ${daysUntil(detail.deadline) <= 2 ? "text-red-400" : "text-cream/40"}`}
                          >
                            ({daysUntil(detail.deadline)}d left)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Share Link */}
                  <div className="rounded-xl border border-gold/15 bg-black/20 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-cream/40 text-xs mb-1">
                          Share Link
                        </p>
                        <p className="text-cream/70 text-xs truncate">
                          {shareLink}
                        </p>
                      </div>
                      <button
                        onClick={handleShareLink}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold/15 border border-gold/30 text-gold text-xs font-medium hover:bg-gold/25 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" /> Copy Link
                      </button>
                    </div>
                  </div>

                  {/* Milestones */}
                  {detail.milestones.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-cinzel text-cream text-sm font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold" />{" "}
                        Milestones
                      </h4>
                      {detail.milestones.map((ms) => {
                        const bothApproved =
                          ms.creator_approved && ms.counterparty_approved;
                        const myApproval =
                          userRole === "creator"
                            ? ms.creator_approved
                            : userRole === "counterparty"
                              ? ms.counterparty_approved
                              : false;
                        const otherApproval =
                          userRole === "creator"
                            ? ms.counterparty_approved
                            : userRole === "counterparty"
                              ? ms.creator_approved
                              : false;
                        const canApprove =
                          detail.status === "active" &&
                          userRole &&
                          !myApproval &&
                          !bothApproved;

                        return (
                          <div
                            key={ms.id}
                            className={`rounded-xl border p-4 transition-colors ${
                              bothApproved
                                ? "border-emerald-500/30 bg-emerald-500/5"
                                : "border-gold/15 bg-black/20"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                    bothApproved
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-gold/20 text-gold"
                                  }`}
                                >
                                  {bothApproved ? (
                                    <Check className="w-4 h-4" />
                                  ) : (
                                    ms.index + 1
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p
                                    className={`text-sm font-medium ${bothApproved ? "text-emerald-300" : "text-cream"}`}
                                  >
                                    {ms.title}
                                  </p>
                                  <p className="text-gold/60 text-xs">
                                    {ms.amount.toLocaleString()} $SOUR
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                {/* Approval dots */}
                                <div className="flex gap-1" title="Creator / Counterparty approval">
                                  <span
                                    className={`w-2 h-2 rounded-full ${ms.creator_approved ? "bg-emerald-400" : "bg-cream/20"}`}
                                  />
                                  <span
                                    className={`w-2 h-2 rounded-full ${ms.counterparty_approved ? "bg-emerald-400" : "bg-cream/20"}`}
                                  />
                                </div>

                                {canApprove && (
                                  <button
                                    onClick={() =>
                                      handleApproveMilestone(ms)
                                    }
                                    disabled={busy}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-black disabled:opacity-30 flex items-center gap-1"
                                  >
                                    {busy ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <Check className="w-3 h-3" />
                                    )}
                                    Approve
                                  </button>
                                )}
                                {bothApproved && (
                                  <span className="text-emerald-400 text-xs font-medium">
                                    Done
                                  </span>
                                )}
                                {!bothApproved && !canApprove && (
                                  <span className="text-cream/30 text-xs">
                                    {myApproval
                                      ? "Waiting for other"
                                      : otherApproval
                                        ? "Your turn"
                                        : "Pending"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {/* Accept (counterparty only, status=created) */}
                    {detail.status === "created" &&
                      userRole === "counterparty" && (
                        <button
                          onClick={handleAccept}
                          disabled={busy}
                          className="px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-black disabled:opacity-30 flex items-center gap-2"
                        >
                          {busy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <HandshakeIcon className="w-4 h-4" />
                          )}
                          Accept Agreement
                        </button>
                      )}

                    {/* Cancel (either party, status=created or active) */}
                    {(detail.status === "created" ||
                      detail.status === "active") &&
                      userRole && (
                        <button
                          onClick={handleCancel}
                          disabled={busy}
                          className="px-5 py-3 rounded-xl text-sm font-bold border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-30 flex items-center gap-2 transition-colors"
                        >
                          {busy ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Cancel
                        </button>
                      )}

                    {/* Waiting notice for creator when status=created */}
                    {detail.status === "created" &&
                      userRole === "creator" && (
                        <div className="flex items-center gap-2 text-cream/40 text-sm">
                          <Clock className="w-4 h-4" /> Waiting for
                          counterparty to accept...
                        </div>
                      )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* MY DEALS TAB                                                   */}
          {/* ============================================================= */}
          {!detailId && tab === "my-deals" && (
            <div className="space-y-3">
              {!connected ? (
                <p className="text-center text-cream/40 py-8">
                  Connect your wallet to see your deals.
                </p>
              ) : listLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gold animate-spin" />
                </div>
              ) : deals.length === 0 ? (
                <div className="text-center py-12">
                  <HandshakeIcon className="w-10 h-10 text-cream/20 mx-auto mb-3" />
                  <p className="text-cream/40 mb-3">No handshakes yet</p>
                  <button
                    onClick={() => setTab("create")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-gold to-amber text-black text-sm font-bold"
                  >
                    <Plus className="w-4 h-4" /> Create Your First
                  </button>
                </div>
              ) : (
                deals.map((deal) => {
                  const sc = statusConfig(deal.status);
                  const isCreator = deal.creator_wallet === walletAddr;
                  const otherParty = isCreator
                    ? deal.counterparty_wallet
                    : deal.creator_wallet;
                  return (
                    <button
                      key={deal.id}
                      onClick={() => setDetailId(deal.id)}
                      className="w-full rounded-xl border border-gold/15 bg-black/20 p-4 hover:border-gold/30 transition-colors text-left group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-cream font-medium text-sm truncate">
                              {deal.title}
                            </p>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${sc.bg} ${sc.color}`}
                            >
                              {sc.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-cream/40">
                            <span>
                              {isCreator ? "→" : "←"}{" "}
                              {shortenAddress(otherParty, 6)}
                            </span>
                            <span>
                              {deal.total_amount.toLocaleString()} $SOUR
                            </span>
                            <span>{formatDate(deal.created_at)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-cream/20 group-hover:text-gold transition-colors shrink-0" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* CREATE TAB                                                     */}
          {/* ============================================================= */}
          {!detailId && tab === "create" && (
            <div className="space-y-4">
              {!connected ? (
                <p className="text-center text-cream/40 py-8">
                  Connect your wallet to create a handshake.
                </p>
              ) : (
                <>
                  <div>
                    <label className="block text-cream/70 text-sm mb-2">
                      Counterparty Wallet
                    </label>
                    <input
                      value={counterpartyAddr}
                      onChange={(e) => setCounterpartyAddr(e.target.value)}
                      placeholder="Solana public key"
                      className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                    />
                  </div>

                  <div>
                    <label className="block text-cream/70 text-sm mb-2">
                      Title
                    </label>
                    <input
                      value={formTitle}
                      onChange={(e) =>
                        setFormTitle(e.target.value.slice(0, 100))
                      }
                      placeholder="e.g. Logo design for SOUR Protocol"
                      className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                    />
                  </div>

                  <div>
                    <label className="block text-cream/70 text-sm mb-2">
                      Description{" "}
                      <span className="text-cream/30">(optional, max 500)</span>
                    </label>
                    <textarea
                      value={desc}
                      onChange={(e) => setDesc(e.target.value.slice(0, 500))}
                      placeholder="Detailed scope, requirements, deliverables..."
                      rows={3}
                      className="w-full rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-cream/70 text-sm mb-2">
                      Deadline{" "}
                      <span className="text-cream/30">(days from now)</span>
                    </label>
                    <input
                      value={deadlineDays}
                      onChange={(e) =>
                        setDeadlineDays(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      inputMode="numeric"
                      placeholder="7"
                      className="w-full sm:w-32 rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                    />
                  </div>

                  {/* Milestones */}
                  <div>
                    <label className="block text-cream/70 text-sm mb-3">
                      Milestones
                    </label>
                    <div className="space-y-3">
                      {milestones.map((m, i) => (
                        <MilestoneFormRow
                          key={i}
                          index={i}
                          title={m.title}
                          amount={m.amount}
                          onUpdate={(f, v) => updateMilestone(i, f, v)}
                          onRemove={() => removeMilestone(i)}
                          canRemove={milestones.length > 1}
                        />
                      ))}
                    </div>
                    {milestones.length < 10 && (
                      <button
                        onClick={addMilestone}
                        className="mt-3 flex items-center gap-1.5 text-gold/60 text-xs hover:text-gold transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add milestone
                      </button>
                    )}
                  </div>

                  {/* Total Preview */}
                  {totalAmount > 0 && (
                    <div className="rounded-xl border border-gold/15 bg-black/20 p-4 flex items-center justify-between">
                      <span className="text-cream/50 text-sm">
                        Total Agreement
                      </span>
                      <span className="text-gold font-bold">
                        {totalAmount.toLocaleString()} $SOUR
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleCreate}
                    disabled={!canCreate}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-gold to-amber text-black disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2"
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <HandshakeIcon className="w-4 h-4" />
                    )}
                    {busy ? "Signing..." : "Create & Sign Handshake"}
                  </button>

                  <p className="text-cream/30 text-xs text-center leading-relaxed">
                    Creating a handshake will prompt your wallet to sign a
                    message proving your intent. No tokens are transferred in
                    Phase 1 — your reputation is your collateral.
                  </p>
                </>
              )}
            </div>
          )}

          {/* ============================================================= */}
          {/* LOOKUP TAB                                                     */}
          {/* ============================================================= */}
          {!detailId && tab === "lookup" && (
            <div className="space-y-4">
              <p className="text-cream/50 text-sm">
                Received a handshake link? Paste the ID below, or just visit
                the shared link directly.
              </p>
              <div className="flex gap-2">
                <input
                  value={lookupId}
                  onChange={(e) => setLookupId(e.target.value)}
                  placeholder="Handshake ID (UUID)"
                  className="flex-1 rounded-xl border border-gold/20 bg-black/40 px-4 py-3 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
                />
                <button
                  onClick={handleLookup}
                  disabled={!lookupId.trim() || detailLoading}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-amber text-black font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {detailLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
              {lookupError && (
                <p className="text-red-400 text-sm">{lookupError}</p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* ---- Toast ---- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4 px-5 py-4 rounded-2xl border backdrop-blur-md ${
              toast.ok
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-red-500/40 bg-red-500/10"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p
                className={`text-sm font-medium ${toast.ok ? "text-emerald-300" : "text-red-300"}`}
              >
                {toast.msg}
              </p>
              <button
                onClick={() => setToast(null)}
                className="text-cream/30 hover:text-cream shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
