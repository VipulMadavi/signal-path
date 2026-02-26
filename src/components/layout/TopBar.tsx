"use client";

import { Search, Bell, User, ChevronDown, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import ModelSwitcher from "@/components/layout/ModelSwitcher";
import SettingsModal from "@/components/layout/SettingsModal";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { settings, loadSettingsFromStorage, openSettingsModal } = useSettingsStore();

  useEffect(() => {
    loadSettingsFromStorage();
  }, [loadSettingsFromStorage]);

  const hasUserKeys = Boolean(settings.userOpenAIKey || settings.userGeminiKey);

  return (
    <>
      <header
        id="topbar"
        className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[var(--scout-bg-secondary)]/80 backdrop-blur-xl border-b border-[var(--scout-border)]"
      >
        {/* Global Search */}
        <div className="flex-1 max-w-xl">
          <div
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg
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
              placeholder="Search companies, lists, signals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="flex-1 bg-transparent text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)] outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] text-[var(--scout-text-muted)] bg-white/[0.06] border border-[var(--scout-border)]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 ml-4">
          {/* Workspace */}
          <button
            id="workspace-switcher"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-scout"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--scout-accent-teal)]" />
            <span>Default Workspace</span>
            <ChevronDown size={14} />
          </button>

          {/* AI Model Switcher */}
          <ModelSwitcher />

          {/* Settings / API Key Config */}
          <button
            id="settings-btn"
            onClick={openSettingsModal}
            className={`relative p-2 rounded-lg transition-scout ${
              hasUserKeys
                ? "text-[var(--scout-accent-teal)] hover:bg-[var(--scout-accent-teal)]/10"
                : "text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04]"
            }`}
            aria-label="API Settings"
            title="API Configuration"
          >
            <Settings size={18} />
            {hasUserKeys && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--scout-success)]" />
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
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--scout-accent-teal)]/15 text-[var(--scout-accent-teal)] hover:bg-[var(--scout-accent-teal)]/25 transition-scout"
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
