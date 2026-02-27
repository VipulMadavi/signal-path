import { describe, it, expect } from 'vitest';
import { computeScoreBreakdown, computeTotalScore, getScoringWeights } from '../scoring';
import type { Company, Signal } from '@/types/company';

// ─── Test Fixtures ───

const baseCompany: Company = {
  id: 'test-001',
  name: 'TestCo',
  website: 'https://testco.ai',
  sector: 'AI / ML',
  stage: 'Series A',
  country: 'United States',
  city: 'San Francisco',
  foundedYear: 2022,
  raisedAmount: 18_000_000,
  lastFundingDate: '2025-11-15',
  employeesEstimate: '51–100',
  score: 0,
  signalVelocity: 8.0,
  tags: ['AI', 'LLM Infrastructure', 'Enterprise AI'],
  createdAt: '2025-08-01T00:00:00Z',
};

const recentSignals: Signal[] = [
  {
    id: 's1',
    companyId: 'test-001',
    type: 'Funding',
    title: 'Series A — $18M',
    description: 'Led by top VC.',
    date: new Date(Date.now() - 10 * 86_400_000).toISOString(), // 10 days ago
    createdAt: new Date().toISOString(),
  },
  {
    id: 's2',
    companyId: 'test-001',
    type: 'Hiring',
    title: 'Hiring 10 engineers',
    description: 'Expanding team.',
    date: new Date(Date.now() - 5 * 86_400_000).toISOString(), // 5 days ago
    createdAt: new Date().toISOString(),
  },
  {
    id: 's3',
    companyId: 'test-001',
    type: 'Press',
    title: 'Featured in TechCrunch',
    description: 'Named top startup.',
    date: new Date(Date.now() - 20 * 86_400_000).toISOString(), // 20 days ago
    createdAt: new Date().toISOString(),
  },
];

// ─── Test Suite ───

describe('Scoring Engine', () => {
  describe('computeScoreBreakdown', () => {
    it('returns a valid ScoreBreakdown object', () => {
      const result = computeScoreBreakdown(baseCompany, recentSignals);

      expect(result).toHaveProperty('signalStrength');
      expect(result).toHaveProperty('marketTiming');
      expect(result).toHaveProperty('thesisFit');
      expect(result).toHaveProperty('team');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('explanation');
      expect(Array.isArray(result.explanation)).toBe(true);
    });

    it('produces scores clamped between 0 and 100', () => {
      const result = computeScoreBreakdown(baseCompany, recentSignals);

      expect(result.signalStrength).toBeGreaterThanOrEqual(0);
      expect(result.signalStrength).toBeLessThanOrEqual(100);
      expect(result.marketTiming).toBeGreaterThanOrEqual(0);
      expect(result.marketTiming).toBeLessThanOrEqual(100);
      expect(result.thesisFit).toBeGreaterThanOrEqual(0);
      expect(result.thesisFit).toBeLessThanOrEqual(100);
      expect(result.team).toBeGreaterThanOrEqual(0);
      expect(result.team).toBeLessThanOrEqual(100);
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
    });

    it('calculates total as weighted sum of dimensions', () => {
      const result = computeScoreBreakdown(baseCompany, recentSignals);
      const weights = getScoringWeights();

      // Total should be approximately the weighted sum
      const expectedTotal = Math.round(
        result.signalStrength * weights.signalStrength.weight +
        result.marketTiming * weights.marketTiming.weight +
        result.thesisFit * weights.thesisFit.weight +
        result.team * weights.team.weight
      );

      expect(result.total).toBe(expectedTotal);
    });

    it('produces higher scores for AI/ML with strong signals', () => {
      const aiCompany: Company = { ...baseCompany, sector: 'AI / ML', tags: ['AI', 'LLM Infrastructure'] };
      const consumerCompany: Company = { ...baseCompany, sector: 'Consumer', tags: ['Fashion Tech'] };

      const aiScore = computeScoreBreakdown(aiCompany, recentSignals);
      const consumerScore = computeScoreBreakdown(consumerCompany, recentSignals);

      // AI/ML is a higher thesis fit sector, so total should be higher
      expect(aiScore.thesisFit).toBeGreaterThan(consumerScore.thesisFit);
    });

    it('gives higher signal strength with more recent signals', () => {
      const recentResult = computeScoreBreakdown(baseCompany, recentSignals);

      const staleSignals: Signal[] = [
        {
          id: 's-old',
          companyId: 'test-001',
          type: 'Other',
          title: 'Old event',
          description: 'Happened long ago.',
          date: '2023-01-01',
          createdAt: '2023-01-01T00:00:00Z',
        },
      ];
      const staleResult = computeScoreBreakdown(baseCompany, staleSignals);

      expect(recentResult.signalStrength).toBeGreaterThan(staleResult.signalStrength);
    });

    it('boosts team score when hiring signals are present', () => {
      const withHiring = computeScoreBreakdown(baseCompany, recentSignals);
      const withoutHiring = computeScoreBreakdown(baseCompany, [recentSignals[0], recentSignals[2]]); // no Hiring signal

      expect(withHiring.team).toBeGreaterThan(withoutHiring.team);
    });

    it('generates human-readable explanation bullets', () => {
      const result = computeScoreBreakdown(baseCompany, recentSignals);

      expect(result.explanation.length).toBeGreaterThanOrEqual(1);
      result.explanation.forEach((bullet) => {
        expect(typeof bullet).toBe('string');
        expect(bullet.length).toBeGreaterThan(0);
      });
    });

    it('handles company with no signals', () => {
      const result = computeScoreBreakdown(baseCompany, []);

      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
      expect(result.signalStrength).toBeLessThan(
        computeScoreBreakdown(baseCompany, recentSignals).signalStrength
      );
    });

    it('is deterministic — same inputs produce same scores', () => {
      const result1 = computeScoreBreakdown(baseCompany, recentSignals);
      const result2 = computeScoreBreakdown(baseCompany, recentSignals);

      expect(result1.total).toBe(result2.total);
      expect(result1.signalStrength).toBe(result2.signalStrength);
      expect(result1.marketTiming).toBe(result2.marketTiming);
      expect(result1.thesisFit).toBe(result2.thesisFit);
      expect(result1.team).toBe(result2.team);
    });
  });

  describe('computeTotalScore', () => {
    it('returns a number between 0 and 100', () => {
      const total = computeTotalScore(baseCompany, recentSignals);
      expect(typeof total).toBe('number');
      expect(total).toBeGreaterThanOrEqual(0);
      expect(total).toBeLessThanOrEqual(100);
    });

    it('matches the total from computeScoreBreakdown', () => {
      const total = computeTotalScore(baseCompany, recentSignals);
      const breakdown = computeScoreBreakdown(baseCompany, recentSignals);
      expect(total).toBe(breakdown.total);
    });
  });

  describe('getScoringWeights', () => {
    it('returns weights that sum to 1.0', () => {
      const weights = getScoringWeights();
      const sum =
        weights.signalStrength.weight +
        weights.marketTiming.weight +
        weights.thesisFit.weight +
        weights.team.weight;

      expect(sum).toBeCloseTo(1.0, 5);
    });

    it('returns expected percentage labels', () => {
      const weights = getScoringWeights();
      expect(weights.signalStrength.percentage).toBe('30%');
      expect(weights.marketTiming.percentage).toBe('25%');
      expect(weights.thesisFit.percentage).toBe('30%');
      expect(weights.team.percentage).toBe('15%');
    });
  });

  describe('Edge Cases', () => {
    it('handles Pre-Seed company with minimal data', () => {
      const minimalCompany: Company = {
        id: 'min-001',
        name: 'TinyStartup',
        website: 'https://tiny.io',
        sector: 'EdTech',
        stage: 'Pre-Seed',
        country: 'Singapore',
        score: 0,
        createdAt: '2025-01-01T00:00:00Z',
      };

      const result = computeScoreBreakdown(minimalCompany, []);

      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.total).toBeLessThanOrEqual(100);
      expect(result.explanation.length).toBeGreaterThanOrEqual(1);
    });

    it('handles Series B+ company with large funding', () => {
      const bigCompany: Company = {
        ...baseCompany,
        stage: 'Series B+',
        raisedAmount: 100_000_000,
        employeesEstimate: '250+',
      };

      const result = computeScoreBreakdown(bigCompany, recentSignals);

      expect(result.team).toBeGreaterThan(50); // Later stage + large team
      expect(result.total).toBeGreaterThan(50);
    });

    it('handles unknown sector gracefully', () => {
      const unknownSector: Company = {
        ...baseCompany,
        sector: 'UnknownSector',
        tags: [],
      };

      const result = computeScoreBreakdown(unknownSector, []);
      expect(result.total).toBeGreaterThanOrEqual(0);
    });
  });
});
