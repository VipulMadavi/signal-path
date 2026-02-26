import type { ScoreBreakdown } from "@/types/company";

/**
 * Mock score breakdowns keyed by company ID.
 * In Phase 5, these will be computed dynamically by the scoring engine.
 */
export const mockScoreBreakdowns: Record<string, ScoreBreakdown> = {
  c001: {
    signalStrength: 92,
    marketTiming: 85,
    thesisFit: 88,
    team: 80,
    total: 87,
    explanation: [
      "Strong signal velocity with 3 recent signals in 60 days",
      "BioTech AI aligns with current market expansion cycle",
      "Direct thesis fit in AI-driven drug discovery",
      "Engineering-heavy team with ML expertise",
    ],
  },
  c002: {
    signalStrength: 71,
    marketTiming: 78,
    thesisFit: 72,
    team: 68,
    total: 74,
    explanation: [
      "Moderate signal activity with focus on energy storage",
      "CleanTech sector experiencing strong tailwinds",
      "Partial thesis alignment in sustainability",
      "Small but growing team in Berlin",
    ],
  },
  c003: {
    signalStrength: 98,
    marketTiming: 90,
    thesisFit: 95,
    team: 85,
    total: 92,
    explanation: [
      "Exceptionally high signal velocity — press + funding in rapid succession",
      "LLM infrastructure is at peak market demand",
      "Perfect thesis fit for enterprise AI infrastructure",
      "Experienced team with prior exits in AI",
    ],
  },
  c004: {
    signalStrength: 72,
    marketTiming: 80,
    thesisFit: 78,
    team: 75,
    total: 79,
    explanation: [
      "Consistent funding signals with steady B2B growth",
      "Cross-border payments market is expanding rapidly",
      "Good thesis alignment in FinTech infrastructure",
      "London-based team with payments industry experience",
    ],
  },
  c005: {
    signalStrength: 55,
    marketTiming: 75,
    thesisFit: 72,
    team: 70,
    total: 71,
    explanation: [
      "Early-stage with limited signal history",
      "Telemedicine adoption continues post-pandemic",
      "NLP-driven patient care fits AI thesis",
      "Small team with healthcare backgrounds",
    ],
  },
  c006: {
    signalStrength: 42,
    marketTiming: 68,
    thesisFit: 65,
    team: 60,
    total: 63,
    explanation: [
      "Pre-seed stage with minimal public signals",
      "SpaceTech is emerging but capital-intensive",
      "Satellite data analytics shows potential thesis fit",
      "Founding team is early but technically strong",
    ],
  },
  c007: {
    signalStrength: 80,
    marketTiming: 82,
    thesisFit: 85,
    team: 78,
    total: 82,
    explanation: [
      "Strong signal velocity in developer tools space",
      "Cloud IDE market is accelerating",
      "Developer platform aligns with infrastructure thesis",
      "Experienced team with prior developer tool experience",
    ],
  },
  c008: {
    signalStrength: 59,
    marketTiming: 72,
    thesisFit: 68,
    team: 65,
    total: 68,
    explanation: [
      "Growing signals in agricultural AI adoption in India",
      "Precision agriculture gaining traction globally",
      "Computer vision for agriculture partially fits thesis",
      "Regional team with strong domain knowledge",
    ],
  },
  c009: {
    signalStrength: 87,
    marketTiming: 90,
    thesisFit: 88,
    team: 85,
    total: 88,
    explanation: [
      "Patent filings indicate strong IP moat",
      "Zero-trust security is a must-have for enterprises",
      "Core thesis fit in cybersecurity infrastructure",
      "Senior team from Unit 8200 with deep expertise",
    ],
  },
  c010: {
    signalStrength: 31,
    marketTiming: 60,
    thesisFit: 55,
    team: 50,
    total: 55,
    explanation: [
      "Very early stage with minimal signal activity",
      "EdTech market is crowded and competitive",
      "AI tutoring has thesis relevance but is nascent",
      "Small founding team, still building",
    ],
  },
  c011: {
    signalStrength: 85,
    marketTiming: 88,
    thesisFit: 86,
    team: 78,
    total: 85,
    explanation: [
      "Forbes recognition and strong press coverage",
      "Quantum-ML optimization at market inflection point",
      "Direct alignment with cutting-edge AI thesis",
      "Co-founders recognized as industry leaders",
    ],
  },
  c012: {
    signalStrength: 63,
    marketTiming: 75,
    thesisFit: 72,
    team: 70,
    total: 72,
    explanation: [
      "IoT fleet signals indicate growth trajectory",
      "Latin American logistics is underserved",
      "IoT + logistics partial thesis alignment",
      "Regional team with supply chain expertise",
    ],
  },
  c013: {
    signalStrength: 61,
    marketTiming: 78,
    thesisFit: 80,
    team: 72,
    total: 76,
    explanation: [
      "Steady funding signals in legal AI",
      "Contract analysis automation demand is rising",
      "NLP for legal fits AI infrastructure thesis",
      "London team with legal industry connections",
    ],
  },
  c014: {
    signalStrength: 90,
    marketTiming: 92,
    thesisFit: 90,
    team: 85,
    total: 90,
    explanation: [
      "Breakthrough product signal with solid-state battery prototype",
      "Advanced materials at critical market timing",
      "Battery tech directly aligns with climate thesis",
      "Established team with deep materials science expertise",
    ],
  },
  c015: {
    signalStrength: 74,
    marketTiming: 80,
    thesisFit: 78,
    team: 70,
    total: 77,
    explanation: [
      "Active signals in autonomous agents space",
      "Enterprise AI agent market is rapidly growing",
      "Autonomous agents align with AI thesis",
      "Paris-based team building in emerging AI space",
    ],
  },
  c016: {
    signalStrength: 78,
    marketTiming: 84,
    thesisFit: 82,
    team: 75,
    total: 81,
    explanation: [
      "Carbon credit signals showing strong momentum",
      "MRV technology timing is excellent",
      "Sustainability + carbon credits fits climate thesis",
      "Australia-based team with environmental science backgrounds",
    ],
  },
  c017: {
    signalStrength: 38,
    marketTiming: 62,
    thesisFit: 58,
    team: 55,
    total: 58,
    explanation: [
      "Pre-seed with very limited signal history",
      "AR/VR wearables market still developing",
      "Fashion tech is tangential to core thesis",
      "Small founding team in early exploration phase",
    ],
  },
  c018: {
    signalStrength: 99,
    marketTiming: 95,
    thesisFit: 92,
    team: 88,
    total: 94,
    explanation: [
      "Mega-round and rapid hiring — extremely high signal velocity",
      "Enterprise AI data platform at peak market demand",
      "Best-in-class thesis alignment for data infrastructure",
      "250+ team with top-tier enterprise experience",
    ],
  },
  c019: {
    signalStrength: 50,
    marketTiming: 70,
    thesisFit: 65,
    team: 62,
    total: 66,
    explanation: [
      "Seed-stage with moderate signal activity",
      "InsurTech claims automation is growing steadily",
      "Partial thesis fit in FinTech automation",
      "India-based team building for local market",
    ],
  },
  c020: {
    signalStrength: 83,
    marketTiming: 86,
    thesisFit: 84,
    team: 80,
    total: 84,
    explanation: [
      "Strong signals in surgical robotics innovation",
      "MedTech robotics market is maturing rapidly",
      "Surgical automation fits healthcare + AI thesis",
      "Swiss team with medical device expertise",
    ],
  },
  c021: {
    signalStrength: 75,
    marketTiming: 82,
    thesisFit: 80,
    team: 76,
    total: 80,
    explanation: [
      "Consistent signals in smart grid technology",
      "Energy management sector is expanding with regulation",
      "Smart grid aligns with infrastructure thesis",
      "Denver-based team with energy sector experience",
    ],
  },
  c022: {
    signalStrength: 40,
    marketTiming: 65,
    thesisFit: 60,
    team: 55,
    total: 60,
    explanation: [
      "Pre-seed with early signal traction",
      "AI matching for recruiting is competitive but growing",
      "Skills graph concept has thesis potential",
      "Small founding team in Vancouver",
    ],
  },
  c023: {
    signalStrength: 68,
    marketTiming: 80,
    thesisFit: 82,
    team: 74,
    total: 78,
    explanation: [
      "Moderate signals with focus on SASE compliance",
      "Cloud security demand continues to accelerate",
      "SASE + compliance fits infrastructure security thesis",
      "Portland team with cloud-native security expertise",
    ],
  },
  c024: {
    signalStrength: 57,
    marketTiming: 72,
    thesisFit: 70,
    team: 68,
    total: 69,
    explanation: [
      "Seed-stage with growing dark kitchen signals",
      "Sustainable food delivery is a growing niche",
      "FoodTech is adjacent to core thesis areas",
      "Amsterdam team with food industry experience",
    ],
  },
};

/** Get score breakdown for a company, generating a fallback if not found */
export function getScoreBreakdown(companyId: string, totalScore: number): ScoreBreakdown {
  if (mockScoreBreakdowns[companyId]) {
    return mockScoreBreakdowns[companyId];
  }

  // Generate a reasonable breakdown from the total score
  const variance = 10;
  const base = totalScore;
  return {
    signalStrength: Math.min(100, Math.max(0, base + Math.floor(Math.random() * variance * 2 - variance))),
    marketTiming: Math.min(100, Math.max(0, base + Math.floor(Math.random() * variance * 2 - variance))),
    thesisFit: Math.min(100, Math.max(0, base + Math.floor(Math.random() * variance * 2 - variance))),
    team: Math.min(100, Math.max(0, base - Math.floor(Math.random() * variance))),
    total: totalScore,
    explanation: [
      "Score breakdown generated from available data signals",
      "Further enrichment may refine this assessment",
    ],
  };
}
