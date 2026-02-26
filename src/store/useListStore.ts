"use client";

import { create } from "zustand";
import type { VCList } from "@/types/company";

// ─── LocalStorage key ───
const LS_LISTS_KEY = "scoutvc_lists";

// ─── Generate unique IDs ───
function generateId(): string {
  return `list-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Load lists from localStorage ───
function loadLists(): VCList[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LS_LISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ─── Persist lists to localStorage ───
function persistLists(lists: VCList[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_LISTS_KEY, JSON.stringify(lists));
  } catch {
    // silently fail on storage quota errors
  }
}

// ─── Store Interface ───
interface ListStoreState {
  lists: VCList[];
  loadListsFromStorage: () => void;

  // CRUD
  createList: (name: string, description?: string) => VCList;
  deleteList: (listId: string) => void;
  updateList: (listId: string, updates: Partial<Pick<VCList, "name" | "description">>) => void;

  // Company management
  addCompanyToList: (listId: string, companyId: string) => void;
  removeCompanyFromList: (listId: string, companyId: string) => void;
  isCompanyInList: (listId: string, companyId: string) => boolean;
  getListsContainingCompany: (companyId: string) => VCList[];

  // Save to list modal
  isSaveToListOpen: boolean;
  toggleSaveToList: () => void;
}

export const useListStore = create<ListStoreState>((set, get) => ({
  lists: [],

  loadListsFromStorage: () => {
    set({ lists: loadLists() });
  },

  // ─── Create ───
  createList: (name, description) => {
    const now = new Date().toISOString();
    const newList: VCList = {
      id: generateId(),
      name,
      description,
      companyIds: [],
      createdAt: now,
      updatedAt: now,
    };
    const { lists } = get();
    const updated = [newList, ...lists];
    persistLists(updated);
    set({ lists: updated });
    return newList;
  },

  // ─── Delete ───
  deleteList: (listId) => {
    const { lists } = get();
    const updated = lists.filter((l) => l.id !== listId);
    persistLists(updated);
    set({ lists: updated });
  },

  // ─── Update ───
  updateList: (listId, updates) => {
    const { lists } = get();
    const updated = lists.map((l) =>
      l.id === listId
        ? { ...l, ...updates, updatedAt: new Date().toISOString() }
        : l
    );
    persistLists(updated);
    set({ lists: updated });
  },

  // ─── Add company ───
  addCompanyToList: (listId, companyId) => {
    const { lists } = get();
    const updated = lists.map((l) => {
      if (l.id !== listId) return l;
      // Prevent duplicate company IDs
      if (l.companyIds.includes(companyId)) return l;
      return {
        ...l,
        companyIds: [...l.companyIds, companyId],
        updatedAt: new Date().toISOString(),
      };
    });
    persistLists(updated);
    set({ lists: updated });
  },

  // ─── Remove company ───
  removeCompanyFromList: (listId, companyId) => {
    const { lists } = get();
    const updated = lists.map((l) => {
      if (l.id !== listId) return l;
      return {
        ...l,
        companyIds: l.companyIds.filter((id) => id !== companyId),
        updatedAt: new Date().toISOString(),
      };
    });
    persistLists(updated);
    set({ lists: updated });
  },

  // ─── Check membership ───
  isCompanyInList: (listId, companyId) => {
    const { lists } = get();
    const list = lists.find((l) => l.id === listId);
    return list ? list.companyIds.includes(companyId) : false;
  },

  // ─── Get lists containing company ───
  getListsContainingCompany: (companyId) => {
    const { lists } = get();
    return lists.filter((l) => l.companyIds.includes(companyId));
  },

  // ─── Modal toggle ───
  isSaveToListOpen: false,
  toggleSaveToList: () =>
    set((state) => ({ isSaveToListOpen: !state.isSaveToListOpen })),
}));
