// ============================================================================
// SOUR Crust Score — Reputation Scoring Engine
// Frontend SDK that reads on-chain data and computes reputation scores
// ============================================================================
//
// Score Weights (user-confirmed):
//   Baker Reputation: 40%  (Handshake history)
//   Holding Power:    30%  (Token balance vs supply)
//   Diamond Hands:    30%  (Consecutive hold duration)
//
// Total Score: 0–1000
// ============================================================================

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const TOTAL_SUPPLY = 1_000_000_000; // 1B $SOUR

export const SCORE_WEIGHTS = {
  reputation: 0.4, // 40%
  holding: 0.3, // 30%
  diamond: 0.3, // 30%
} as const;

export const MAX_COMPONENT_SCORE = 1000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CrustScoreInput {
  /** Current $SOUR token balance */
  balance: number;
  /** Consecutive days holding without selling */
  daysFermenting: number;
  /** Number of completed Handshakes */
  handshakesCompleted: number;
  /** Number of disputes lost */
  disputesLost: number;
  /** Number of cancelled Handshakes */
  handshakesCancelled: number;
  /** Total Handshakes created (includes completed + cancelled + disputed) */
  handshakesTotal: number;
}

export interface CrustScoreBreakdown {
  /** Final Crust Score 0–1000 */
  total: number;
  /** Holding Power component (0–300) */
  holdingScore: number;
  /** Diamond Hands component (0–300) */
  diamondScore: number;
  /** Baker Reputation component (0–400) */
  reputationScore: number;
  /** Tier name derived from total score */
  tier: CrustTier;
  /** Achievement badges earned */
  badges: Badge[];
}

export type CrustTierName = "Fresh Dough" | "Rising Dough" | "Golden Crust" | "Eternal Starter";

export interface CrustTier {
  name: CrustTierName;
  emoji: string;
  minScore: number;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  harvestMultiplier: string;
  cardStyle: "basic" | "warm" | "golden" | "holographic";
}

// ---------------------------------------------------------------------------
// Tier Definitions (score-based, not day-based)
// ---------------------------------------------------------------------------

export const CRUST_TIERS: CrustTier[] = [
  {
    name: "Eternal Starter",
    emoji: "👑",
    minScore: 750,
    color: "from-purple-500 via-violet-500 to-fuchsia-500",
    textColor: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    glowColor: "shadow-purple-500/30",
    harvestMultiplier: "2×",
    cardStyle: "holographic",
  },
  {
    name: "Golden Crust",
    emoji: "🥐",
    minScore: 500,
    color: "from-gold via-amber-500 to-yellow-500",
    textColor: "text-gold",
    bgColor: "bg-gold/10",
    borderColor: "border-gold/20",
    glowColor: "shadow-gold/30",
    harvestMultiplier: "1.5×",
    cardStyle: "golden",
  },
  {
    name: "Rising Dough",
    emoji: "🍞",
    minScore: 200,
    color: "from-blue-400 to-cyan-500",
    textColor: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/20",
    harvestMultiplier: "1×",
    cardStyle: "warm",
  },
  {
    name: "Fresh Dough",
    emoji: "🫓",
    minScore: 0,
    color: "from-cream/40 to-cream/20",
    textColor: "text-cream/50",
    bgColor: "bg-cream/5",
    borderColor: "border-cream/10",
    glowColor: "shadow-cream/5",
    harvestMultiplier: "—",
    cardStyle: "basic",
  },
];

export function getCrustTier(score: number): CrustTier {
  for (const tier of CRUST_TIERS) {
    if (score >= tier.minScore) return tier;
  }
  return CRUST_TIERS[CRUST_TIERS.length - 1];
}

// ---------------------------------------------------------------------------
// Badge System
// ---------------------------------------------------------------------------

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: "holding" | "handshake" | "treasury" | "community";
}

const ALL_BADGES: Badge[] = [
  // HOLDING
  { id: "first_dough", name: "First Dough", emoji: "🫓", description: "Bought your first $SOUR", category: "holding" },
  { id: "diamond_7", name: "Diamond 7", emoji: "💎", description: "7 consecutive days holding", category: "holding" },
  { id: "diamond_30", name: "Diamond 30", emoji: "💎", description: "30 consecutive days holding", category: "holding" },
  { id: "diamond_90", name: "Diamond 90", emoji: "💎", description: "90 consecutive days holding", category: "holding" },
  { id: "diamond_365", name: "Diamond 365", emoji: "💎", description: "365 consecutive days holding", category: "holding" },
  { id: "whale_baker", name: "Whale Baker", emoji: "🐋", description: "Top 100 holder by balance", category: "holding" },
  // HANDSHAKE
  { id: "first_shake", name: "First Shake", emoji: "🤝", description: "Completed first Handshake", category: "handshake" },
  { id: "baker_dozen", name: "Baker's Dozen", emoji: "🤝", description: "12 Handshakes completed", category: "handshake" },
  { id: "master_baker", name: "Master Baker", emoji: "🤝", description: "50 Handshakes completed", category: "handshake" },
  { id: "perfect_record", name: "Perfect Record", emoji: "🏆", description: "20+ Handshakes with 0 disputes lost", category: "handshake" },
  // TREASURY (buyback + LP)
  { id: "first_burn", name: "First Contribution", emoji: "🏦", description: "Contributed to your first buyback+LP", category: "treasury" },
  { id: "oven_keeper", name: "Oven Keeper", emoji: "🏦", description: "10K+ $SOUR directed to treasury through your Bakes", category: "treasury" },
  { id: "eternal_flame", name: "Eternal Flame", emoji: "🏦", description: "100K+ $SOUR directed to treasury through your Bakes", category: "treasury" },
  // COMMUNITY
  { id: "genesis_baker", name: "Genesis Baker", emoji: "📜", description: "Among the first 1,000 holders", category: "community" },
  { id: "forge_hand", name: "Forge Hand", emoji: "🏗️", description: "Merged a PR on GitHub", category: "community" },
  { id: "mill_wright", name: "Mill Wright", emoji: "🏭", description: "Published first workflow on the Mill", category: "community" },
  { id: "first_vote", name: "First Vote", emoji: "🗳️", description: "Voted in your first DAO proposal", category: "community" },
];

export function getBadgeById(id: string): Badge | undefined {
  return ALL_BADGES.find((b) => b.id === id);
}

export function getAllBadges(): Badge[] {
  return [...ALL_BADGES];
}

// ---------------------------------------------------------------------------
// Score Calculation — Holding Power (max 300)
// ---------------------------------------------------------------------------

function calcHoldingScore(balance: number): number {
  if (balance <= 0) return 0;

  const ratio = balance / TOTAL_SUPPLY;

  // Logarithmic scale to balance whales
  // 0.001% (10K) = ~80, 0.01% (100K) = ~170, 0.1% (1M) = ~250, 1%+ = 300
  if (ratio >= 0.01) return 300; // 1%+ of supply
  if (ratio >= 0.001) return Math.round(250 + ((ratio - 0.001) / (0.01 - 0.001)) * 50);
  if (ratio >= 0.0001) return Math.round(170 + ((ratio - 0.0001) / (0.001 - 0.0001)) * 80);
  if (ratio >= 0.00001) return Math.round(80 + ((ratio - 0.00001) / (0.0001 - 0.00001)) * 90);

  // Tiny holders
  return Math.round((ratio / 0.00001) * 80);
}

// ---------------------------------------------------------------------------
// Score Calculation — Diamond Hands (max 300)
// ---------------------------------------------------------------------------

function calcDiamondScore(daysFermenting: number): number {
  if (daysFermenting <= 0) return 0;
  if (daysFermenting >= 365) return 300;

  // Breakpoints: 7d=50, 30d=150, 90d=250, 365d=300
  if (daysFermenting >= 90) return Math.round(250 + ((daysFermenting - 90) / (365 - 90)) * 50);
  if (daysFermenting >= 30) return Math.round(150 + ((daysFermenting - 30) / (90 - 30)) * 100);
  if (daysFermenting >= 7) return Math.round(50 + ((daysFermenting - 7) / (30 - 7)) * 100);

  return Math.round((daysFermenting / 7) * 50);
}

// ---------------------------------------------------------------------------
// Score Calculation — Baker Reputation (max 400)
// ---------------------------------------------------------------------------

function calcReputationScore(input: CrustScoreInput): number {
  const { handshakesCompleted, disputesLost, handshakesCancelled, handshakesTotal } = input;

  if (handshakesCompleted <= 0) return 0;

  // Base score from completed handshakes (log scale)
  let base = 0;
  if (handshakesCompleted >= 50) base = 300;
  else if (handshakesCompleted >= 20) base = Math.round(200 + ((handshakesCompleted - 20) / 30) * 100);
  else if (handshakesCompleted >= 5) base = Math.round(100 + ((handshakesCompleted - 5) / 15) * 100);
  else base = Math.round((handshakesCompleted / 5) * 100);

  // Penalties
  const disputePenalty = disputesLost * 50;

  // Cancel ratio penalty: if >20% cancelled, -30 per 10% above threshold
  let cancelPenalty = 0;
  if (handshakesTotal > 0) {
    const cancelRatio = handshakesCancelled / handshakesTotal;
    if (cancelRatio > 0.2) {
      cancelPenalty = Math.round(((cancelRatio - 0.2) / 0.1) * 30);
    }
  }

  // Perfect record bonus: 20+ completed with 0 disputes
  const perfectBonus = handshakesCompleted >= 20 && disputesLost === 0 ? 100 : 0;

  return Math.max(0, Math.min(400, base - disputePenalty - cancelPenalty + perfectBonus));
}

// ---------------------------------------------------------------------------
// Main Score Calculator
// ---------------------------------------------------------------------------

export function calculateCrustScore(input: CrustScoreInput): CrustScoreBreakdown {
  const holdingRaw = calcHoldingScore(input.balance);
  const diamondRaw = calcDiamondScore(input.daysFermenting);
  const reputationRaw = calcReputationScore(input);

  // Weighted scores (already in correct range: holding 0-300, diamond 0-300, reputation 0-400)
  const holdingScore = holdingRaw;
  const diamondScore = diamondRaw;
  const reputationScore = reputationRaw;
  const total = Math.min(MAX_COMPONENT_SCORE, holdingScore + diamondScore + reputationScore);

  const tier = getCrustTier(total);
  const badges = computeBadges(input);

  return {
    total,
    holdingScore,
    diamondScore,
    reputationScore,
    tier,
    badges,
  };
}

// ---------------------------------------------------------------------------
// Badge Computation
// ---------------------------------------------------------------------------

function computeBadges(input: CrustScoreInput): Badge[] {
  const earned: Badge[] = [];
  const { balance, daysFermenting, handshakesCompleted, disputesLost } = input;

  // Holding badges
  if (balance > 0) earned.push(ALL_BADGES.find((b) => b.id === "first_dough")!);
  if (daysFermenting >= 7) earned.push(ALL_BADGES.find((b) => b.id === "diamond_7")!);
  if (daysFermenting >= 30) earned.push(ALL_BADGES.find((b) => b.id === "diamond_30")!);
  if (daysFermenting >= 90) earned.push(ALL_BADGES.find((b) => b.id === "diamond_90")!);
  if (daysFermenting >= 365) earned.push(ALL_BADGES.find((b) => b.id === "diamond_365")!);

  // Handshake badges
  if (handshakesCompleted >= 1) earned.push(ALL_BADGES.find((b) => b.id === "first_shake")!);
  if (handshakesCompleted >= 12) earned.push(ALL_BADGES.find((b) => b.id === "baker_dozen")!);
  if (handshakesCompleted >= 50) earned.push(ALL_BADGES.find((b) => b.id === "master_baker")!);
  if (handshakesCompleted >= 20 && disputesLost === 0) {
    earned.push(ALL_BADGES.find((b) => b.id === "perfect_record")!);
  }

  // Treasury badge (any completed handshake means contribution to buyback+LP)
  if (handshakesCompleted >= 1) earned.push(ALL_BADGES.find((b) => b.id === "first_burn")!);

  return earned.filter(Boolean);
}

// ---------------------------------------------------------------------------
// Leaderboard entry type
// ---------------------------------------------------------------------------

export interface LeaderboardEntry {
  address: string;
  displayName: string;
  avatar: string;
  crustScore: number;
  tier: CrustTier;
  daysFermenting: number;
  handshakesCompleted: number;
  balance: number;
  badges: Badge[];
}
