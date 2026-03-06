// ============================================================================
// SOUR Civilization ID — Reputation Scoring Engine v2
// Frontend SDK that reads on-chain data and computes reputation scores
// ============================================================================
//
// Score Range: 300–850 (FICO-style)
//   Base Score:       300 (everyone starts here)
//   Max Earned:       550 (across 6 categories)
//   Total Max:        850
//
// Categories (6):
//   Holding Power    15%  → Token balance vs supply
//   Time in Protocol 15%  → How long in the ecosystem
//   Loyalty          15%  → Consecutive hold streak
//   Trade History    25%  → Handshake success (ACTIVE — Supabase Phase 1)
//   Community        15%  → DAO participation   (LOCKED until DAO)
//   Network Trust    15%  → Endorsements         (LOCKED until v4)
//
// ============================================================================

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TOTAL_SUPPLY = 1_000_000_000; // 1B $SOUR
export const BASE_SCORE = 300;
export const MAX_SCORE = 850;
export const MAX_EARNED = MAX_SCORE - BASE_SCORE; // 550

/** Category weight definitions — must sum to 1.0 */
export const CATEGORY_WEIGHTS = {
  holding: 0.15,
  time: 0.15,
  loyalty: 0.15,
  trade: 0.25,
  community: 0.15,
  network: 0.15,
} as const;

export type CategoryKey = keyof typeof CATEGORY_WEIGHTS;

/** Max raw points per category (weight × MAX_EARNED) */
export const CATEGORY_MAX: Record<CategoryKey, number> = {
  holding: Math.round(MAX_EARNED * CATEGORY_WEIGHTS.holding),   // 83
  time: Math.round(MAX_EARNED * CATEGORY_WEIGHTS.time),         // 83
  loyalty: Math.round(MAX_EARNED * CATEGORY_WEIGHTS.loyalty),   // 83
  trade: Math.round(MAX_EARNED * CATEGORY_WEIGHTS.trade),       // 138
  community: Math.round(MAX_EARNED * CATEGORY_WEIGHTS.community), // 83
  network: Math.round(MAX_EARNED * CATEGORY_WEIGHTS.network),   // 83
};

/** Categories currently locked (no on-chain data source yet) */
export const LOCKED_CATEGORIES = new Set<CategoryKey>(["community", "network"]);

/** Max earned points from currently-active (unlocked) categories.
 *  Used for grade scaling so grades reflect achievable performance.
 *  Phase 1.5 = holding + time + loyalty + trade = 387 */
export const ACTIVE_MAX_EARNED = (Object.entries(CATEGORY_MAX) as [CategoryKey, number][])
  .filter(([key]) => !LOCKED_CATEGORIES.has(key))
  .reduce((sum, [, max]) => sum + max, 0);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CrustScoreInput {
  /** Current $SOUR token balance */
  balance: number;
  /** Days since first $SOUR transaction */
  daysInProtocol: number;
  /** Consecutive days holding without selling (same as daysInProtocol for now) */
  loyaltyStreak: number;
  /** Number of completed Handshakes */
  handshakesCompleted: number;
  /** Number of disputes lost */
  disputesLost: number;
  /** Number of cancelled Handshakes */
  handshakesCancelled: number;
  /** Total Handshakes created */
  handshakesTotal: number;
}

export interface CategoryScore {
  key: CategoryKey;
  label: string;
  score: number;
  max: number;
  grade: string;
  gradeColor: string;
  locked: boolean;
  lockReason?: string;
}

export interface CrustScoreBreakdown {
  /** Final Crust Score 300–850 */
  total: number;
  /** Individual category scores */
  categories: CategoryScore[];
  /** Tier derived from total score */
  tier: CrustTier;
  /** Earned stamps */
  stamps: Stamp[];
  /** Overall letter grade */
  overallGrade: string;
  /** Overall grade color class */
  overallGradeColor: string;
}

export type CrustTierName =
  | "Unverified"
  | "Verified"
  | "Trusted"
  | "Established"
  | "Sovereign";

export interface CrustTier {
  name: CrustTierName;
  emoji: string;
  minScore: number;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  cardBg: string;
  cardBorder: string;
  accentGradient: string;
}

// ---------------------------------------------------------------------------
// Tier Definitions (300–850 range)
// ---------------------------------------------------------------------------

export const CRUST_TIERS: CrustTier[] = [
  // Phase 1.5 thresholds — 4 of 6 categories active (max achievable ≈ 687)
  // These will be raised as Community and Network categories unlock
  {
    name: "Sovereign",
    emoji: "💎",
    minScore: 560,
    color: "from-purple-500 via-fuchsia-500 to-violet-500",
    textColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    glowColor: "shadow-purple-500/30",
    cardBg: "from-purple-950 via-black to-violet-950",
    cardBorder: "border-purple-500/40",
    accentGradient: "from-purple-500 via-fuchsia-400 to-violet-500",
  },
  {
    name: "Established",
    emoji: "🥇",
    minScore: 510,
    color: "from-gold via-amber-500 to-yellow-500",
    textColor: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/20",
    glowColor: "shadow-gold/30",
    cardBg: "from-amber-950/60 via-black to-yellow-950/40",
    cardBorder: "border-gold/30",
    accentGradient: "from-gold via-amber-400 to-yellow-500",
  },
  {
    name: "Trusted",
    emoji: "🥈",
    minScore: 440,
    color: "from-slate-300 via-gray-300 to-slate-400",
    textColor: "text-slate-300",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/20",
    glowColor: "shadow-slate-400/20",
    cardBg: "from-slate-950/40 via-black to-gray-950/30",
    cardBorder: "border-slate-400/20",
    accentGradient: "from-slate-300 via-gray-300 to-slate-400",
  },
  {
    name: "Verified",
    emoji: "🥉",
    minScore: 350,
    color: "from-amber-600 via-orange-600 to-amber-700",
    textColor: "text-amber-500",
    bgColor: "bg-amber-600/10",
    borderColor: "border-amber-600/20",
    glowColor: "shadow-amber-600/15",
    cardBg: "from-amber-950/30 via-black to-orange-950/20",
    cardBorder: "border-amber-600/20",
    accentGradient: "from-amber-600 via-orange-500 to-amber-700",
  },
  {
    name: "Unverified",
    emoji: "🪪",
    minScore: 0,
    color: "from-cream/30 to-cream/20",
    textColor: "text-cream/50",
    bgColor: "bg-cream/5",
    borderColor: "border-cream/10",
    glowColor: "shadow-cream/5",
    cardBg: "from-gray-950 via-black to-gray-950",
    cardBorder: "border-cream/10",
    accentGradient: "from-cream/20 to-cream/10",
  },
];

export function getCrustTier(score: number): CrustTier {
  for (const tier of CRUST_TIERS) {
    if (score >= tier.minScore) return tier;
  }
  return CRUST_TIERS[CRUST_TIERS.length - 1];
}

// ---------------------------------------------------------------------------
// Grade System — A+ through F
// ---------------------------------------------------------------------------

export interface GradeInfo {
  grade: string;
  color: string;
}

/** Convert a 0–1 ratio to a letter grade */
export function getGrade(ratio: number): GradeInfo {
  if (ratio >= 0.9) return { grade: "A+", color: "text-emerald-400" };
  if (ratio >= 0.8) return { grade: "A", color: "text-emerald-400" };
  if (ratio >= 0.7) return { grade: "B+", color: "text-green-400" };
  if (ratio >= 0.6) return { grade: "B", color: "text-lime-400" };
  if (ratio >= 0.5) return { grade: "C+", color: "text-yellow-400" };
  if (ratio >= 0.4) return { grade: "C", color: "text-amber-400" };
  if (ratio >= 0.2) return { grade: "D", color: "text-orange-400" };
  return { grade: "F", color: "text-red-400" };
}

/** Grade for overall score — scaled to ACTIVE categories only
 *  so grades reflect what's achievable in current phase */
export function getOverallGrade(score: number): GradeInfo {
  const ratio = (score - BASE_SCORE) / ACTIVE_MAX_EARNED;
  return getGrade(Math.max(0, Math.min(1, ratio)));
}

// ---------------------------------------------------------------------------
// Stamp System
// ---------------------------------------------------------------------------

export interface Stamp {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: "holding" | "trade" | "protocol";
}

const ALL_STAMPS: Stamp[] = [
  // HOLDING STAMPS
  { id: "diamond_7", name: "Diamond 7", emoji: "💎", description: "7 consecutive days holding", category: "holding" },
  { id: "diamond_30", name: "Diamond 30", emoji: "💎", description: "30 consecutive days holding", category: "holding" },
  { id: "diamond_90", name: "Diamond 90", emoji: "💎", description: "90 consecutive days holding", category: "holding" },
  { id: "diamond_365", name: "Diamond 365", emoji: "💎", description: "365 consecutive days holding", category: "holding" },
  { id: "whale", name: "Whale", emoji: "🐋", description: "Top 20 holder by balance", category: "holding" },
  // TRADE STAMPS
  { id: "first_shake", name: "First Shake", emoji: "🤝", description: "Completed first Handshake", category: "trade" },
  { id: "five_star", name: "5-Star Baker", emoji: "⭐", description: "5 successful Handshakes", category: "trade" },
  { id: "perfect_record", name: "Perfect Record", emoji: "🏆", description: "20+ Handshakes, 0 disputes", category: "trade" },
  { id: "power_trader", name: "Power Trader", emoji: "🔥", description: "20+ completed Handshakes", category: "trade" },
  // PROTOCOL STAMPS
  { id: "genesis", name: "Genesis Baker", emoji: "📜", description: "Among the first 1,000 holders", category: "protocol" },
  { id: "citizen", name: "Citizen", emoji: "🏛️", description: "30+ days in the protocol", category: "protocol" },
  { id: "veteran", name: "Veteran", emoji: "👑", description: "180+ days in the protocol", category: "protocol" },
  { id: "og", name: "OG", emoji: "⚡", description: "365+ days in the protocol", category: "protocol" },
];

export function getStampById(id: string): Stamp | undefined {
  return ALL_STAMPS.find((s) => s.id === id);
}

export function getAllStamps(): Stamp[] {
  return [...ALL_STAMPS];
}

export const STAMP_CATEGORY_META: Record<string, { label: string; icon: string; desc: string }> = {
  holding: { label: "Holding", icon: "💰", desc: "Earned by holding $SOUR over time" },
  trade: { label: "Trade", icon: "🤝", desc: "Earned by completing P2P deals" },
  protocol: { label: "Protocol", icon: "🏛️", desc: "Earned by protocol participation" },
};

// ---------------------------------------------------------------------------
// Score Calculation — Holding Power (max = CATEGORY_MAX.holding ≈ 82)
// ---------------------------------------------------------------------------

function calcHoldingScore(balance: number): number {
  const max = CATEGORY_MAX.holding;
  if (balance <= 0) return 0;

  const ratio = balance / TOTAL_SUPPLY;

  // Logarithmic scale — rewards early holders fairly
  if (ratio >= 0.01) return max; // 1%+ of supply → max
  if (ratio >= 0.001) return Math.round(max * (0.85 + ((ratio - 0.001) / (0.01 - 0.001)) * 0.15));
  if (ratio >= 0.0001) return Math.round(max * (0.60 + ((ratio - 0.0001) / (0.001 - 0.0001)) * 0.25));
  if (ratio >= 0.00001) return Math.round(max * (0.30 + ((ratio - 0.00001) / (0.0001 - 0.00001)) * 0.30));

  return Math.round(max * (ratio / 0.00001) * 0.30);
}

// ---------------------------------------------------------------------------
// Score Calculation — Time in Protocol (max = CATEGORY_MAX.time ≈ 82)
// ---------------------------------------------------------------------------

function calcTimeScore(daysInProtocol: number): number {
  const max = CATEGORY_MAX.time;
  if (daysInProtocol <= 0) return 0;
  if (daysInProtocol >= 365) return max;

  // Breakpoints: 7d→15%, 30d→40%, 90d→70%, 180d→90%, 365d→100%
  if (daysInProtocol >= 180) return Math.round(max * (0.90 + ((daysInProtocol - 180) / (365 - 180)) * 0.10));
  if (daysInProtocol >= 90) return Math.round(max * (0.70 + ((daysInProtocol - 90) / (180 - 90)) * 0.20));
  if (daysInProtocol >= 30) return Math.round(max * (0.40 + ((daysInProtocol - 30) / (90 - 30)) * 0.30));
  if (daysInProtocol >= 7) return Math.round(max * (0.15 + ((daysInProtocol - 7) / (30 - 7)) * 0.25));

  return Math.round(max * (daysInProtocol / 7) * 0.15);
}

// ---------------------------------------------------------------------------
// Score Calculation — Loyalty (max = CATEGORY_MAX.loyalty ≈ 82)
// ---------------------------------------------------------------------------

function calcLoyaltyScore(loyaltyStreak: number): number {
  const max = CATEGORY_MAX.loyalty;
  if (loyaltyStreak <= 0) return 0;
  if (loyaltyStreak >= 365) return max;

  if (loyaltyStreak >= 180) return Math.round(max * (0.90 + ((loyaltyStreak - 180) / (365 - 180)) * 0.10));
  if (loyaltyStreak >= 90) return Math.round(max * (0.70 + ((loyaltyStreak - 90) / (180 - 90)) * 0.20));
  if (loyaltyStreak >= 30) return Math.round(max * (0.40 + ((loyaltyStreak - 30) / (90 - 30)) * 0.30));
  if (loyaltyStreak >= 7) return Math.round(max * (0.15 + ((loyaltyStreak - 7) / (30 - 7)) * 0.25));

  return Math.round(max * (loyaltyStreak / 7) * 0.15);
}

// ---------------------------------------------------------------------------
// Score Calculation — Trade History (max = CATEGORY_MAX.trade ≈ 138)
// ---------------------------------------------------------------------------

function calcTradeScore(input: CrustScoreInput): number {
  const max = CATEGORY_MAX.trade;
  const { handshakesCompleted, disputesLost, handshakesCancelled, handshakesTotal } = input;

  if (handshakesCompleted <= 0) return 0;

  let base = 0;
  if (handshakesCompleted >= 50) base = max * 0.75;
  else if (handshakesCompleted >= 20) base = max * (0.50 + ((handshakesCompleted - 20) / 30) * 0.25);
  else if (handshakesCompleted >= 5) base = max * (0.25 + ((handshakesCompleted - 5) / 15) * 0.25);
  else base = max * (handshakesCompleted / 5) * 0.25;

  const disputePenalty = disputesLost * (max * 0.10);
  let cancelPenalty = 0;
  if (handshakesTotal > 0) {
    const cancelRatio = handshakesCancelled / handshakesTotal;
    if (cancelRatio > 0.2) cancelPenalty = (cancelRatio - 0.2) * max * 0.5;
  }

  const perfectBonus = handshakesCompleted >= 20 && disputesLost === 0 ? max * 0.25 : 0;

  return Math.max(0, Math.min(max, Math.round(base - disputePenalty - cancelPenalty + perfectBonus)));
}

// ---------------------------------------------------------------------------
// Main Score Calculator
// ---------------------------------------------------------------------------

export function calculateCrustScore(input: CrustScoreInput): CrustScoreBreakdown {
  // Guard against NaN/undefined
  const safeInput: CrustScoreInput = {
    balance: Number(input.balance) || 0,
    daysInProtocol: Number(input.daysInProtocol) || 0,
    loyaltyStreak: Number(input.loyaltyStreak) || 0,
    handshakesCompleted: Number(input.handshakesCompleted) || 0,
    disputesLost: Number(input.disputesLost) || 0,
    handshakesCancelled: Number(input.handshakesCancelled) || 0,
    handshakesTotal: Number(input.handshakesTotal) || 0,
  };

  const holdingScore = calcHoldingScore(safeInput.balance);
  const timeScore = calcTimeScore(safeInput.daysInProtocol);
  const loyaltyScore = calcLoyaltyScore(safeInput.loyaltyStreak);
  const tradeScore = calcTradeScore(safeInput);
  const communityScore = 0; // LOCKED — no DAO yet
  const networkScore = 0;   // LOCKED — no endorsements yet

  const earned = holdingScore + timeScore + loyaltyScore + tradeScore + communityScore + networkScore;
  const total = Math.min(MAX_SCORE, BASE_SCORE + earned);

  const holdingGrade = getGrade(CATEGORY_MAX.holding > 0 ? holdingScore / CATEGORY_MAX.holding : 0);
  const timeGrade = getGrade(CATEGORY_MAX.time > 0 ? timeScore / CATEGORY_MAX.time : 0);
  const loyaltyGrade = getGrade(CATEGORY_MAX.loyalty > 0 ? loyaltyScore / CATEGORY_MAX.loyalty : 0);
  const tradeGrade = getGrade(CATEGORY_MAX.trade > 0 ? tradeScore / CATEGORY_MAX.trade : 0);
  const lockedGrade: GradeInfo = { grade: "—", color: "text-cream/30" };

  const categories: CategoryScore[] = [
    { key: "holding", label: "HLD", score: holdingScore, max: CATEGORY_MAX.holding, grade: holdingGrade.grade, gradeColor: holdingGrade.color, locked: false },
    { key: "time", label: "TIM", score: timeScore, max: CATEGORY_MAX.time, grade: timeGrade.grade, gradeColor: timeGrade.color, locked: false },
    { key: "loyalty", label: "LOY", score: loyaltyScore, max: CATEGORY_MAX.loyalty, grade: loyaltyGrade.grade, gradeColor: loyaltyGrade.color, locked: false },
    { key: "trade", label: "TRD", score: tradeScore, max: CATEGORY_MAX.trade, grade: tradeGrade.grade, gradeColor: tradeGrade.color, locked: false },
    { key: "community", label: "COM", score: communityScore, max: CATEGORY_MAX.community, grade: lockedGrade.grade, gradeColor: lockedGrade.color, locked: true, lockReason: "DAO launch" },
    { key: "network", label: "NET", score: networkScore, max: CATEGORY_MAX.network, grade: lockedGrade.grade, gradeColor: lockedGrade.color, locked: true, lockReason: "Endorsements v4" },
  ];

  const tier = getCrustTier(total);
  const stamps = computeStamps(safeInput);
  const overall = getOverallGrade(total);

  return {
    total,
    categories,
    tier,
    stamps,
    overallGrade: overall.grade,
    overallGradeColor: overall.color,
  };
}

// ---------------------------------------------------------------------------
// Stamp Computation
// ---------------------------------------------------------------------------

function computeStamps(input: CrustScoreInput): Stamp[] {
  const earned: Stamp[] = [];
  const { loyaltyStreak, daysInProtocol, handshakesCompleted, disputesLost } = input;

  // Holding stamps (based on loyalty streak)
  if (loyaltyStreak >= 7) earned.push(ALL_STAMPS.find((s) => s.id === "diamond_7")!);
  if (loyaltyStreak >= 30) earned.push(ALL_STAMPS.find((s) => s.id === "diamond_30")!);
  if (loyaltyStreak >= 90) earned.push(ALL_STAMPS.find((s) => s.id === "diamond_90")!);
  if (loyaltyStreak >= 365) earned.push(ALL_STAMPS.find((s) => s.id === "diamond_365")!);

  // Trade stamps
  if (handshakesCompleted >= 1) earned.push(ALL_STAMPS.find((s) => s.id === "first_shake")!);
  if (handshakesCompleted >= 5) earned.push(ALL_STAMPS.find((s) => s.id === "five_star")!);
  if (handshakesCompleted >= 20 && disputesLost === 0) {
    earned.push(ALL_STAMPS.find((s) => s.id === "perfect_record")!);
  }
  if (handshakesCompleted >= 20) earned.push(ALL_STAMPS.find((s) => s.id === "power_trader")!);

  // Protocol stamps
  if (daysInProtocol >= 30) earned.push(ALL_STAMPS.find((s) => s.id === "citizen")!);
  if (daysInProtocol >= 180) earned.push(ALL_STAMPS.find((s) => s.id === "veteran")!);
  if (daysInProtocol >= 365) earned.push(ALL_STAMPS.find((s) => s.id === "og")!);

  return earned.filter(Boolean);
}

// ---------------------------------------------------------------------------
// Leaderboard entry type
// ---------------------------------------------------------------------------

export interface LeaderboardEntry {
  address: string;
  displayName: string;
  crustScore: number;
  tier: CrustTier;
  overallGrade: string;
  daysInProtocol: number;
  loyaltyStreak: number;
  handshakesCompleted: number;
  balance: number;
  stamps: Stamp[];
  categories: CategoryScore[];
}
