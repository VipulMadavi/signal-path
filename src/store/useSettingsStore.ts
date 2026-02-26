"use client";

import { create } from "zustand";
import type { AIProvider } from "@/types/enrichment";

// ─── LocalStorage key ───
const LS_SETTINGS_KEY = "signalpath_settings";

// ─── Settings Interface ───
interface AppSettings {
  defaultProvider: AIProvider;
  enableCaching: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultProvider: "openai",
  enableCaching: true,
};

// ─── Load settings from localStorage ───
function loadSettings(): AppSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SETTINGS };
  try {
    const data = localStorage.getItem(LS_SETTINGS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
      };
    }
    return { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

// ─── Persist settings to localStorage ───
function persistSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // silently fail on storage quota errors
  }
}

// ─── Store Interface ───
interface SettingsStoreState {
  // Settings
  settings: AppSettings;
  loadSettingsFromStorage: () => void;
  setDefaultProvider: (provider: AIProvider) => void;
  toggleCaching: () => void;

  // Model switcher UI state
  isModelSwitcherOpen: boolean;
  toggleModelSwitcher: () => void;
  closeModelSwitcher: () => void;
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },

  loadSettingsFromStorage: () => {
    set({ settings: loadSettings() });
  },

  setDefaultProvider: (provider: AIProvider) => {
    const { settings } = get();
    const updated = { ...settings, defaultProvider: provider };
    persistSettings(updated);
    set({ settings: updated, isModelSwitcherOpen: false });
  },

  toggleCaching: () => {
    const { settings } = get();
    const updated = { ...settings, enableCaching: !settings.enableCaching };
    persistSettings(updated);
    set({ settings: updated });
  },

  // Model switcher dropdown state
  isModelSwitcherOpen: false,
  toggleModelSwitcher: () =>
    set((state) => ({ isModelSwitcherOpen: !state.isModelSwitcherOpen })),
  closeModelSwitcher: () => set({ isModelSwitcherOpen: false }),
}));
