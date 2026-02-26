// ─── Search Types ───
// Dedicated type file for search-related interfaces

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
