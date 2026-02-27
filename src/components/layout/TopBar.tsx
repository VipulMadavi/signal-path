"use client";

import { Search, Bell, User, ChevronDown, Settings, Menu, FlaskConical } from "lucide-react";
import { useState, useEffect } from "react";
import ModelSwitcher from "@/components/layout/ModelSwitcher";
import SettingsModal from "@/components/layout/SettingsModal";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const {
    settings,
    loadSettingsFromStorage,
    openSettingsModal,
    envKeyStatus,
    fetchEnvKeyStatus,
  } = useSettingsStore();

  useEffect(() => {
    loadSettingsFromStorage();
    fetchEnvKeyStatus();
  }, [loadSettingsFromStorage, fetchEnvKeyStatus]);

  // #7: Cmd/Ctrl + , opens settings
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "," && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openSettingsModal();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [openSettingsModal]);

  // #1 + #2: Determine button state
  const hasAnyActiveKey =
    Boolean(settings.userOpenAIKey || settings.userGeminiKey) ||
    envKeyStatus.openai ||
    envKeyStatus.gemini;
  const isDemoForced = settings.forceDemoMode;
  // Teal = keys active and NOT in forced demo mode
  const showTeal = hasAnyActiveKey && !isDemoForced;

  return (
    <>
      <header
        id="topbar"
        className="sticky top-0 z-30 flex items-center justify-between h-14 md:h-16 px-3 md:px-6 gap-2 bg-[var(--scout-bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--scout-border)]"
      >
        {/* Hamburger menu - mobile only */}
        <button
          id="mobile-menu-btn"
          onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-scout flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Global Search */}
        <div className="flex-1 min-w-0 max-w-xl">
          <div
            className={`
              flex items-center gap-2 px-3 py-1.5 md:py-2 rounded-lg
              bg-white/[0.04] border transition-all duration-200
              ${
                searchFocused
                  ? "border-[var(--scout-accent-teal)]/40 ring-1 ring-[var(--scout-accent-teal)]/20"
                  : "border-[var(--scout-border)] hover:border-white/10"
              }
            `}
          >
            <Search
              size={16}
              className={`flex-shrink-0 transition-colors duration-200 ${
                searchFocused
                  ? "text-[var(--scout-accent-teal)]"
                  : "text-[var(--scout-text-muted)]"
              }`}
            />
            <input
              id="global-search"
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 min-w-0 bg-transparent text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)] outline-none"
              data-search-input
            />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/40 border border-white/10">
              /
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
          {/* Workspace */}
          <button
            id="workspace-switcher"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-scout"
            aria-label="Switch workspace"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--scout-accent-teal)]" />
            <span>Default Workspace</span>
            <ChevronDown size={14} />
          </button>

          {/* AI Model Switcher */}
          <div className="hidden sm:flex">
            <ModelSwitcher />
          </div>

          {/* #2: Demo Mode pill — shown when demo is forced */}
          {isDemoForced && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-medium transition-all duration-200"
              style={{
                borderColor: "color-mix(in srgb, var(--scout-warning) 30%, transparent)",
                background: "color-mix(in srgb, var(--scout-warning) 8%, transparent)",
                color: "var(--scout-warning)",
              }}
            >
              <FlaskConical size={12} />
              Demo
            </div>
          )}

          {/* #1: Settings button — teal when keys active, amber when demo forced */}
          <button
            id="settings-btn"
            onClick={openSettingsModal}
            className={`relative p-2 rounded-lg transition-scout ${
              isDemoForced
                ? "hover:bg-amber-500/10"
                : showTeal
                  ? "text-[var(--scout-accent-teal)] hover:bg-[var(--scout-accent-teal)]/10"
                  : "text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04]"
            }`}
            style={isDemoForced ? { color: "var(--scout-warning)" } : {}}
            aria-label="API Settings"
            title={isDemoForced ? "Demo Mode active — click to configure (Ctrl+,)" : "API Configuration (Ctrl+,)"}
          >
            {isDemoForced ? <FlaskConical size={18} /> : <Settings size={18} />}

            {/* #1: Green dot when live keys active */}
            {showTeal && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--scout-success)]" />
            )}
            {/* #2: Amber pulsing dot when demo mode forced */}
            {isDemoForced && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--scout-warning)" }}
              />
            )}
          </button>

          {/* Notifications */}
          <button
            id="notifications-btn"
            className="relative p-2 rounded-lg text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-scout"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--scout-accent-teal)]" />
          </button>

          {/* User Avatar */}
          <button
            id="user-avatar"
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[var(--scout-accent-teal)]/15 text-[var(--scout-accent-teal)] hover:bg-[var(--scout-accent-teal)]/25 transition-scout"
            aria-label="User menu"
          >
            <User size={16} />
          </button>
        </div>
      </header>

      {/* Settings Modal (rendered at root level) */}
      <SettingsModal />
    </>
  );
}
