"use client";

import { create } from "zustand";
import type { SearchFilters, SavedSearch } from "@/types/search";

// ─── LocalStorage key ───
const LS_SEARCH_CONFIG_KEY = "signalpath_search_config";

// ─── Default filter configuration ───
const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  sector: [],
  stage: [],
  country: [],
  sortBy: "score",
  sortDirection: "desc",
};

// ─── Load search config from localStorage ───
function loadSearchConfig(): SearchFilters {
  if (typeof window === "undefined") return { ...DEFAULT_FILTERS };
  try {
    const data = localStorage.getItem(LS_SEARCH_CONFIG_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_FILTERS, ...parsed };
    }
    return { ...DEFAULT_FILTERS };
  } catch {
    return { ...DEFAULT_FILTERS };
  }
}

// ─── Persist search config to localStorage ───
function persistSearchConfig(filters: SearchFilters): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_SEARCH_CONFIG_KEY, JSON.stringify(filters));
  } catch {
    // silently fail
  }
}

// ─── Store Interface ───
interface SearchStoreState {
  // Filter configuration
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  loadFiltersFromStorage: () => void;
  
  // Search history
  recentQueries: string[];
  addRecentQuery: (query: string) => void;
  clearRecentQueries: () => void;
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  filters: { ...DEFAULT_FILTERS },

  setFilters: (partial) => {
    const { filters } = get();
    const updated = { ...filters, ...partial };
    persistSearchConfig(updated);
    set({ filters: updated });
  },

  resetFilters: () => {
    persistSearchConfig(DEFAULT_FILTERS);
    set({ filters: { ...DEFAULT_FILTERS } });
  },

  loadFiltersFromStorage: () => {
    set({ filters: loadSearchConfig() });
  },

  // Search history (kept in memory for MVP)
  recentQueries: [],
  addRecentQuery: (query: string) => {
    if (!query.trim()) return;
    const { recentQueries } = get();
    const updated = [
      query,
      ...recentQueries.filter((q) => q !== query),
    ].slice(0, 10);
    set({ recentQueries: updated });
  },
  clearRecentQueries: () => set({ recentQueries: [] }),
}));
