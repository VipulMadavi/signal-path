// ─── Enrichment Types ───
// Dedicated type file for enrichment-related interfaces

export type AIProvider = "openai" | "gemini";

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
  provider?: AIProvider;
  cached?: boolean;
}

export interface EnrichmentRequest {
  url: string;
  companyId: string;
  provider?: AIProvider;
}

export interface EnrichmentResponse {
  success: boolean;
  data?: Enrichment;
  error?: string;
  provider?: AIProvider;
  cached?: boolean;
}

// ─── Enrichment Cache Entry ───
export interface EnrichmentCacheEntry {
  data: Enrichment;
  cachedAt: string;
  provider: AIProvider;
}

// ─── LLM Extraction Result ───
export interface LLMExtractionResult {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals: string[];
}
