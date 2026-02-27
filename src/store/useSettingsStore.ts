"use client";

import { create } from "zustand";
import type { AIProvider } from "@/types/enrichment";

// ─── LocalStorage key ───
const LS_SETTINGS_KEY = "signalpath_settings";

// ─── Settings Interface ───
interface AppSettings {
  defaultProvider: AIProvider;
  enableCaching: boolean;
  // User-provided API keys (GUI-based injection)
  userOpenAIKey: string;
  userGeminiKey: string;
  // Force demo mode even when keys exist
  forceDemoMode: boolean;
}

// Tracks which providers have server-side env var keys
export interface EnvKeyStatus {
  openai: boolean;
  gemini: boolean;
  loaded: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultProvider: "openai",
  enableCaching: true,
  userOpenAIKey: "",
  userGeminiKey: "",
  forceDemoMode: false,
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

  // API Key management
  setUserOpenAIKey: (key: string) => void;
  setUserGeminiKey: (key: string) => void;
  clearUserKeys: () => void;
  hasAnyUserKey: () => boolean;

  // Demo mode
  toggleDemoMode: () => void;

  // Env key status (server-side)
  envKeyStatus: EnvKeyStatus;
  fetchEnvKeyStatus: () => Promise<void>;

  // Computed: is effectively in demo mode?
  isEffectivelyDemoMode: () => boolean;

  // Model switcher UI state
  isModelSwitcherOpen: boolean;
  toggleModelSwitcher: () => void;
  closeModelSwitcher: () => void;

  // Settings modal UI state
  isSettingsModalOpen: boolean;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
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

  // ─── API Key Management ───
  setUserOpenAIKey: (key: string) => {
    const { settings } = get();
    const updated = { ...settings, userOpenAIKey: key.trim() };
    persistSettings(updated);
    set({ settings: updated });
  },

  setUserGeminiKey: (key: string) => {
    const { settings } = get();
    const updated = { ...settings, userGeminiKey: key.trim() };
    persistSettings(updated);
    set({ settings: updated });
  },

  clearUserKeys: () => {
    const { settings } = get();
    const updated = { ...settings, userOpenAIKey: "", userGeminiKey: "" };
    persistSettings(updated);
    set({ settings: updated });
  },

  hasAnyUserKey: () => {
    const { settings } = get();
    return Boolean(settings.userOpenAIKey || settings.userGeminiKey);
  },

  // ─── Demo Mode ───
  toggleDemoMode: () => {
    const { settings } = get();
    const updated = { ...settings, forceDemoMode: !settings.forceDemoMode };
    persistSettings(updated);
    set({ settings: updated });
  },

  // ─── Env Key Status ───
  envKeyStatus: { openai: false, gemini: false, loaded: false },

  fetchEnvKeyStatus: async () => {
    try {
      const res = await fetch("/api/key-status");
      if (res.ok) {
        const data = await res.json();
        set({
          envKeyStatus: {
            openai: Boolean(data.openai),
            gemini: Boolean(data.gemini),
            loaded: true,
          },
        });
      }
    } catch {
      // Silently fail — env status stays as unknown
    }
  },

  // ─── Computed: effectively demo mode? ───
  isEffectivelyDemoMode: () => {
    const { settings, envKeyStatus } = get();
    if (settings.forceDemoMode) return true;
    // No keys at all = demo mode
    const hasUserKeys = Boolean(settings.userOpenAIKey || settings.userGeminiKey);
    const hasEnvKeys = envKeyStatus.openai || envKeyStatus.gemini;
    return !hasUserKeys && !hasEnvKeys;
  },

  // Model switcher dropdown state
  isModelSwitcherOpen: false,
  toggleModelSwitcher: () =>
    set((state) => ({ isModelSwitcherOpen: !state.isModelSwitcherOpen })),
  closeModelSwitcher: () => set({ isModelSwitcherOpen: false }),

  // Settings modal state
  isSettingsModalOpen: false,
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
}));
