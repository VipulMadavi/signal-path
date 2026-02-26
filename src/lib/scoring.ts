import type { Company, Signal, ScoreBreakdown } from "@/types/company";

// ─── Scoring Weights (from PRD & docs) ───
const WEIGHTS = {
  signalStrength: 0.30,
  marketTiming: 0.25,
  thesisFit: 0.30,
  team: 0.15,
} as const;

// ─── Thesis-aligned sectors (ranked by fit) ───
const THESIS_FIT_SECTORS: Record<string, number> = {
  "AI / ML": 95,
  "CyberSecurity": 85,
  "DevTools": 82,
  "FinTech": 78,
  "BioTech": 76,
  "CleanTech": 74,
  "HealthTech": 72,
  "LegalTech": 70,
  "Logistics": 65,
  "AgriTech": 62,
  "SpaceTech": 60,
  "HR Tech": 58,
  "EdTech": 55,
  "Consumer": 48,
  "FoodTech": 50,
};

// ─── Thesis-aligned tags (boost values) ───
const THESIS_TAG_BOOSTS: Record<string, number> = {
  "AI": 12,
  "LLM Infrastructure": 14,
  "Enterprise AI": 13,
  "Data Platform": 12,
  "ML Optimization": 11,
  "Autonomous Agents": 10,
  "NLP": 9,
  "Cloud Security": 8,
  "Zero Trust": 8,
  "Developer Platform": 7,
  "Drug Discovery": 7,
  "Genomics": 6,
  "IoT": 5,
  "Computer Vision": 8,
  "Smart Grid": 5,
  "Battery Tech": 6,
  "Advanced Materials": 5,
  "Quantum Computing": 9,
  "AI Matching": 6,
  "AI Legal": 7,
  "AI Tutoring": 5,
  "Surgical Robotics": 6,
  "Precision Agriculture": 5,
  "Carbon Credits": 4,
  "Satellite Data": 5,
};

// ─── Market Timing Signals ───
const HOT_SECTORS: Record<string, number> = {
  "AI / ML": 92,
  "CyberSecurity": 88,
  "CleanTech": 82,
  "FinTech": 78,
  "DevTools": 80,
  "HealthTech": 76,
  "BioTech": 74,
  "LegalTech": 72,
  "Logistics": 68,
  "AgriTech": 65,
  "SpaceTech": 62,
  "HR Tech": 60,
  "EdTech": 58,
  "Consumer": 52,
  "FoodTech": 55,
};

// ─── Stage-based Team Score Baseline ───
const STAGE_TEAM_BASELINES: Record<string, number> = {
  "Pre-Seed": 45,
  "Seed": 58,
  "Series A": 72,
  "Series B+": 82,
};

// ─── Helpers ───

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Compute signal strength score (0-100)
 * Based on: number & recency of signals, signal velocity, funding activity
 */
function computeSignalStrength(
  company: Company,
  signals: Signal[]
): { score: number; explanations: string[] } {
  const explanations: string[] = [];
  let score = 0;

  // 1. Signal count contribution (0-30)
  const signalCount = signals.length;
  if (signalCount >= 3) {
    score += 30;
    explanations.push(`Strong signal velocity with ${signalCount} tracked signals`);
  } else if (signalCount >= 2) {
    score += 22;
    explanations.push(`Moderate signal coverage with ${signalCount} signals`);
  } else if (signalCount >= 1) {
    score += 14;
    explanations.push(`Limited signal data — ${signalCount} signal tracked`);
  } else {
    score += 5;
    explanations.push("Minimal signal history available");
  }

  // 2. Signal recency (0-30) — how recent are the signals?
  if (signals.length > 0) {
    const latestDate = new Date(
      Math.max(...signals.map((s) => new Date(s.date).getTime()))
    );
    const daysSinceLatest = Math.floor(
      (Date.now() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLatest <= 30) {
      score += 30;
    } else if (daysSinceLatest <= 90) {
      score += 22;
    } else if (daysSinceLatest <= 180) {
      score += 14;
    } else {
      score += 6;
    }
  }

  // 3. Signal velocity (0-20)
  const velocity = company.signalVelocity ?? 0;
  score += Math.min(20, Math.round(velocity * 2));

  // 4. Funding signal boost (0-20)
  const hasFunding = signals.some((s) => s.type === "Funding");
  const hasPatent = signals.some((s) => s.type === "Patent");
  const hasProduct = signals.some((s) => s.type === "Product");
  if (hasFunding) score += 10;
  if (hasPatent) score += 6;
  if (hasProduct) score += 4;

  return { score: clamp(score, 0, 100), explanations };
}

/**
 * Compute market timing score (0-100)
 * Based on: sector heat, funding momentum, stage maturity
 */
function computeMarketTiming(
  company: Company,
  signals: Signal[]
): { score: number; explanations: string[] } {
  const explanations: string[] = [];

  // 1. Sector heat (0-50)
  const sectorHeat = HOT_SECTORS[company.sector] ?? 50;
  let score = Math.round(sectorHeat * 0.5);

  const sectorLabel =
    sectorHeat >= 80 ? "surging" : sectorHeat >= 65 ? "growing" : "developing";
  explanations.push(`${company.sector} sector is ${sectorLabel} (${sectorHeat}/100 heat)`);

  // 2. Recent funding in sector (0-25)
  const fundingSignals = signals.filter((s) => s.type === "Funding");
  if (fundingSignals.length > 0) {
    score += 25;
  } else if (company.raisedAmount && company.raisedAmount > 5_000_000) {
    score += 18;
  } else if (company.raisedAmount && company.raisedAmount > 1_000_000) {
    score += 12;
  } else {
    score += 5;
  }

  // 3. Stage timing boost (0-25) — later stages in hot sectors get a boost
  const stageMultiplier =
    company.stage === "Series B+" ? 1.0 :
    company.stage === "Series A" ? 0.85 :
    company.stage === "Seed" ? 0.7 :
    0.55;
  score += Math.round(25 * stageMultiplier);

  return { score: clamp(score, 0, 100), explanations };
}

/**
 * Compute thesis fit score (0-100)
 * Based on: sector alignment, tag relevance, company characteristics
 */
function computeThesisFit(
  company: Company
): { score: number; explanations: string[] } {
  const explanations: string[] = [];

  // 1. Sector fit (0-50)
  const sectorFit = THESIS_FIT_SECTORS[company.sector] ?? 45;
  let score = Math.round(sectorFit * 0.5);

  if (sectorFit >= 80) {
    explanations.push(`Strong thesis alignment — ${company.sector} is a core focus area`);
  } else if (sectorFit >= 65) {
    explanations.push(`Good thesis alignment in ${company.sector}`);
  } else {
    explanations.push(`${company.sector} is tangential to core thesis areas`);
  }

  // 2. Tag fit (0-35)
  const tags = company.tags ?? [];
  let tagBoost = 0;
  const matchedTags: string[] = [];
  for (const tag of tags) {
    const boost = THESIS_TAG_BOOSTS[tag] ?? 0;
    if (boost > 0) {
      tagBoost += boost;
      matchedTags.push(tag);
    }
  }
  tagBoost = Math.min(35, tagBoost);
  score += tagBoost;

  if (matchedTags.length > 0) {
    explanations.push(`Tag overlap: ${matchedTags.slice(0, 3).join(", ")}`);
  }

  // 3. Company profile signals (0-15)
  if (company.raisedAmount && company.raisedAmount >= 10_000_000) {
    score += 15;
  } else if (company.raisedAmount && company.raisedAmount >= 3_000_000) {
    score += 10;
  } else {
    score += 5;
  }

  return { score: clamp(score, 0, 100), explanations };
}

/**
 * Compute team score (0-100)
 * Based on: stage (as proxy for team maturity), employee count, signals
 */
function computeTeamScore(
  company: Company,
  signals: Signal[]
): { score: number; explanations: string[] } {
  const explanations: string[] = [];

  // 1. Stage baseline (0-50) — later stages usually mean stronger teams
  const stageBaseline = STAGE_TEAM_BASELINES[company.stage] ?? 50;
  let score = Math.round(stageBaseline * 0.5);

  // 2. Employee headcount proxy (0-25)
  const empLabel = company.employeesEstimate ?? "";
  let empScore = 8;
  if (empLabel.includes("250+")) {
    empScore = 25;
  } else if (empLabel.includes("101")) {
    empScore = 22;
  } else if (empLabel.includes("51")) {
    empScore = 18;
  } else if (empLabel.includes("11")) {
    empScore = 12;
  } else if (empLabel.includes("1–10") || empLabel.includes("1-10")) {
    empScore = 8;
  }
  score += empScore;

  const empExplain =
    empScore >= 20 ? "Large established team" :
    empScore >= 15 ? "Growing mid-size team" :
    empScore >= 10 ? "Early-stage team building" :
    "Small founding team";
  explanations.push(empExplain);

  // 3. Hiring signals (0-15) — indicates growth
  const hiringSignals = signals.filter((s) => s.type === "Hiring");
  if (hiringSignals.length > 0) {
    score += 15;
    explanations.push("Active hiring signals indicate team expansion");
  } else {
    score += 5;
  }

  // 4. Press/recognition boost (0-10)
  const pressSignals = signals.filter((s) => s.type === "Press");
  if (pressSignals.length > 0) {
    score += 10;
    explanations.push("Press coverage validates team credibility");
  }

  return { score: clamp(score, 0, 100), explanations };
}

// ─── Main Scoring Function ───

/**
 * Compute a full ScoreBreakdown for a company based on available data.
 *
 * Weights:
 * - Signal Strength  30%
 * - Market Timing    25%
 * - Thesis Fit       30%
 * - Team             15%
 *
 * The function is deterministic for the same inputs and produces
 * explainable, human-readable breakdown bullets.
 */
export function computeScoreBreakdown(
  company: Company,
  signals: Signal[]
): ScoreBreakdown {
  const ss = computeSignalStrength(company, signals);
  const mt = computeMarketTiming(company, signals);
  const tf = computeThesisFit(company);
  const tm = computeTeamScore(company, signals);

  const total = Math.round(
    ss.score * WEIGHTS.signalStrength +
    mt.score * WEIGHTS.marketTiming +
    tf.score * WEIGHTS.thesisFit +
    tm.score * WEIGHTS.team
  );

  // Build concise explanation (pick strongest bullet from each dimension)
  const explanation: string[] = [];
  if (ss.explanations.length > 0) explanation.push(ss.explanations[0]);
  if (mt.explanations.length > 0) explanation.push(mt.explanations[0]);
  if (tf.explanations.length > 0) explanation.push(tf.explanations[0]);
  if (tm.explanations.length > 0) explanation.push(tm.explanations[0]);

  return {
    signalStrength: ss.score,
    marketTiming: mt.score,
    thesisFit: tf.score,
    team: tm.score,
    total: clamp(total, 0, 100),
    explanation,
  };
}

/**
 * Compute the weighted total score only (lighter version for table display).
 */
export function computeTotalScore(
  company: Company,
  signals: Signal[]
): number {
  const breakdown = computeScoreBreakdown(company, signals);
  return breakdown.total;
}

/**
 * Get the weights configuration (useful for UI display).
 */
export function getScoringWeights() {
  return {
    signalStrength: { weight: WEIGHTS.signalStrength, label: "Signal Strength", percentage: "30%" },
    marketTiming: { weight: WEIGHTS.marketTiming, label: "Market Timing", percentage: "25%" },
    thesisFit: { weight: WEIGHTS.thesisFit, label: "Thesis Fit", percentage: "30%" },
    team: { weight: WEIGHTS.team, label: "Team", percentage: "15%" },
  };
}
