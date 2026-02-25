// ─── Company Model ───
export type FundingStage = "Pre-Seed" | "Seed" | "Series A" | "Series B+";

export interface Company {
  id: string;
  name: string;
  website: string;
  sector: string;
  stage: FundingStage;
  country: string;
  city?: string;
  foundedYear?: number;
  raisedAmount?: number;
  lastFundingDate?: string;
  employeesEstimate?: string;
  score: number;
  signalVelocity?: number;
  tags?: string[];
  createdAt: string;
}

// ─── Signal Model ───
export type SignalType =
  | "Funding"
  | "Hiring"
  | "Product"
  | "Press"
  | "Patent"
  | "Other";

export interface Signal {
  id: string;
  companyId: string;
  type: SignalType;
  title: string;
  description: string;
  sourceUrl?: string;
  date: string;
  createdAt: string;
}

// ─── Score Breakdown ───
export interface ScoreBreakdown {
  signalStrength: number;
  marketTiming: number;
  thesisFit: number;
  team: number;
  total: number;
  explanation: string[];
}

// ─── Enrichment Models ───
export interface EnrichmentSource {
  url: string;
  title?: string;
  scrapedAt: string;
}

export interface Enrichment {
  companyId: string;
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals: string[];
  sources: EnrichmentSource[];
  scrapedAt: string;
}

// ─── List Model ───
export interface VCList {
  id: string;
  name: string;
  description?: string;
  companyIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ─── Saved Search ───
export interface SearchFilters {
  query?: string;
  sector?: string[];
  stage?: string[];
  country?: string[];
  minScore?: number;
  maxScore?: number;
  minRaised?: number;
  sortBy?: "score" | "raisedAmount" | "latestSignal";
  sortDirection?: "asc" | "desc";
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  lastRunAt?: string;
}

// ─── Notes Model ───
export interface CompanyNote {
  id: string;
  companyId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── API Schemas ───
export interface EnrichmentRequest {
  url: string;
  companyId: string;
}

export interface EnrichmentResponse {
  success: boolean;
  data?: Enrichment;
  error?: string;
}
