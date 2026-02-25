"use client";

import { create } from "zustand";
import type { SearchFilters, SavedSearch } from "@/types/company";

// ─── Generate unique IDs ───
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ─── LocalStorage keys ───
const LS_SAVED_SEARCHES = "scoutvc_saved_searches";

// ─── Load saved searches from localStorage ───
function loadSavedSearches(): SavedSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LS_SAVED_SEARCHES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ─── Persist saved searches to localStorage ───
function persistSavedSearches(searches: SavedSearch[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_SAVED_SEARCHES, JSON.stringify(searches));
  } catch {
    // silently fail on storage quota errors
  }
}

// ─── Store Interface ───
interface CompanyStoreState {
  // Filters
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Pagination
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;

  // UI toggles
  isFilterOpen: boolean;
  toggleFilters: () => void;
  isSaveSearchOpen: boolean;
  toggleSaveSearch: () => void;

  // Saved searches
  savedSearches: SavedSearch[];
  loadSavedSearchesFromStorage: () => void;
  saveCurrentSearch: (name: string) => void;
  deleteSavedSearch: (id: string) => void;
  applySavedSearch: (search: SavedSearch) => void;
}

const defaultFilters: SearchFilters = {
  query: "",
  sector: [],
  stage: [],
  country: [],
  sortBy: "score",
  sortDirection: "desc",
};

export const useCompanyStore = create<CompanyStoreState>((set, get) => ({
  // ─── Filters ───
  filters: { ...defaultFilters },
  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
      currentPage: 1, // reset to first page on filter change
    })),
  resetFilters: () =>
    set({ filters: { ...defaultFilters }, currentPage: 1 }),

  // ─── Pagination ───
  currentPage: 1,
  pageSize: 10,
  setCurrentPage: (page) => set({ currentPage: page }),

  // ─── UI Toggles ───
  isFilterOpen: true,
  toggleFilters: () =>
    set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  isSaveSearchOpen: false,
  toggleSaveSearch: () =>
    set((state) => ({ isSaveSearchOpen: !state.isSaveSearchOpen })),

  // ─── Saved Searches ───
  savedSearches: [],
  loadSavedSearchesFromStorage: () => {
    set({ savedSearches: loadSavedSearches() });
  },
  saveCurrentSearch: (name) => {
    const { filters, savedSearches } = get();
    const newSearch: SavedSearch = {
      id: generateId(),
      name,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      lastRunAt: new Date().toISOString(),
    };
    const updated = [newSearch, ...savedSearches];
    persistSavedSearches(updated);
    set({ savedSearches: updated, isSaveSearchOpen: false });
  },
  deleteSavedSearch: (id) => {
    const { savedSearches } = get();
    const updated = savedSearches.filter((s) => s.id !== id);
    persistSavedSearches(updated);
    set({ savedSearches: updated });
  },
  applySavedSearch: (search) => {
    set({
      filters: { ...search.filters },
      currentPage: 1,
    });
    // Update lastRunAt
    const { savedSearches } = get();
    const updated = savedSearches.map((s) =>
      s.id === search.id ? { ...s, lastRunAt: new Date().toISOString() } : s
    );
    persistSavedSearches(updated);
    set({ savedSearches: updated });
  },
}));
