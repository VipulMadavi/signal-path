import type { ScoreBreakdown } from "@/types/company";
import { mockCompanies, getCompanySignals } from "@/lib/mock-companies";
import { computeScoreBreakdown } from "@/lib/scoring";

/**
 * Pre-computed score breakdowns for all companies.
 * Generated using the scoring engine in `/lib/scoring.ts`
 * with the weighted formula: Signal 30%, Market 25%, Thesis 30%, Team 15%.
 */
const computedBreakdowns: Record<string, ScoreBreakdown> = {};

// Pre-compute on module load for deterministic, cached access
for (const company of mockCompanies) {
  const signals = getCompanySignals(company.id);
  computedBreakdowns[company.id] = computeScoreBreakdown(company, signals);
}

/**
 * Get the computed score breakdown for a company.
 * Falls back to a dynamically computed breakdown if not pre-cached.
 */
export function getScoreBreakdown(
  companyId: string,
  _totalScore?: number
): ScoreBreakdown {
  // Return pre-computed breakdown if available
  if (computedBreakdowns[companyId]) {
    return computedBreakdowns[companyId];
  }

  // Dynamic fallback: compute from company data
  const company = mockCompanies.find((c) => c.id === companyId);
  if (company) {
    const signals = getCompanySignals(companyId);
    const breakdown = computeScoreBreakdown(company, signals);
    computedBreakdowns[companyId] = breakdown; // Cache it
    return breakdown;
  }

  // Ultimate fallback for unknown company
  return {
    signalStrength: 50,
    marketTiming: 50,
    thesisFit: 50,
    team: 50,
    total: 50,
    explanation: [
      "Score data unavailable — company not found in dataset",
    ],
  };
}

/**
 * Get all pre-computed score breakdowns.
 * Useful for updating company scores in bulk.
 */
export function getAllScoreBreakdowns(): Record<string, ScoreBreakdown> {
  return computedBreakdowns;
}
