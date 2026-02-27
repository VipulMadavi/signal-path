"use client";

import { Search, Bell, User, ChevronDown, Settings, Menu, FlaskConical, Building2, Zap, LogOut, UserCog, HelpCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import ModelSwitcher from "@/components/layout/ModelSwitcher";
import SettingsModal from "@/components/layout/SettingsModal";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCompanyStore } from "@/store/useCompanyStore";

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { setFilters } = useCompanyStore();

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

  // Sync search query from store when navigating to /companies
  const storeQuery = useCompanyStore((s) => s.filters.query);
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (pathname === "/companies") {
      setSearchQuery(storeQuery || "");
    }
  }, [pathname, storeQuery]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (workspaceRef.current && !workspaceRef.current.contains(e.target as Node)) {
        setWorkspaceOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cmd/Ctrl + , opens settings
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

  // Global search handler — navigates to /companies and sets query in store
  const handleSearchSubmit = useCallback(() => {
    setFilters({ query: searchQuery });
    if (pathname !== "/companies") {
      router.push("/companies");
    }
  }, [searchQuery, setFilters, pathname, router]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    // Live-update the store filter if already on /companies
    if (pathname === "/companies") {
      setFilters({ query: val });
    }
  };

  // Determine button state
  const hasAnyActiveKey =
    Boolean(settings.userOpenAIKey || settings.userGeminiKey) ||
    envKeyStatus.openai ||
    envKeyStatus.gemini;
  const isDemoForced = settings.forceDemoMode;
  const showTeal = hasAnyActiveKey && !isDemoForced;

  // Dropdown menu item style
  const menuItemClass =
    "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-[var(--scout-text-primary)] hover:bg-white/[0.06] transition-colors cursor-pointer rounded-md";
  const menuDividerClass = "my-1 border-t border-[var(--scout-border)]";

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

        {/* Global Search — wired to companies store */}
        <div className="flex-1 min-w-0 max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchSubmit();
            }}
          >
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
                placeholder="Search companies… (Enter to search)"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 min-w-0 bg-transparent text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)] outline-none"
                data-search-input
              />
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/40 border border-white/10">
                /
              </kbd>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
          {/* Workspace Switcher */}
          <div className="relative hidden lg:block" ref={workspaceRef}>
            <button
              id="workspace-switcher"
              onClick={() => setWorkspaceOpen(!workspaceOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-scout"
              aria-label="Switch workspace"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--scout-accent-teal)]" />
              <span>Default Workspace</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${workspaceOpen ? "rotate-180" : ""}`} />
            </button>

            {workspaceOpen && (
              <div className="absolute right-0 top-10 z-50 w-64 bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl p-2 fade-in">
                <p className="text-[10px] font-medium text-[var(--scout-text-muted)] uppercase tracking-wider px-3 py-1.5">Workspaces</p>
                <button
                  className={menuItemClass}
                  onClick={() => setWorkspaceOpen(false)}
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--scout-accent-teal)]" />
                  <span className="flex-1 text-left">Default Workspace</span>
                  <CheckCircle2 size={14} className="text-[var(--scout-accent-teal)]" />
                </button>
                <button
                  className={`${menuItemClass} opacity-50 cursor-not-allowed`}
                  disabled
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--scout-accent-purple)]" />
                  <span className="flex-1 text-left">New Workspace</span>
                  <span className="text-[10px] text-[var(--scout-text-muted)]">Soon</span>
                </button>
              </div>
            )}
          </div>

          {/* AI Model Switcher */}
          <div className="hidden sm:flex">
            <ModelSwitcher />
          </div>

          {/* Demo Mode pill */}
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

          {/* Settings button */}
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
            {showTeal && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--scout-success)]" />
            )}
            {isDemoForced && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--scout-warning)" }}
              />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              id="notifications-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-scout"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--scout-accent-teal)]" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-10 z-50 w-80 bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl fade-in">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--scout-border)]">
                  <h4 className="text-sm font-semibold text-[var(--scout-text-heading)]">Notifications</h4>
                  <span className="text-[10px] text-[var(--scout-accent-teal)] font-medium">3 new</span>
                </div>
                <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                  <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[var(--scout-accent-teal)]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap size={14} className="text-[var(--scout-accent-teal)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--scout-text-primary)]">New high-score company detected</p>
                      <p className="text-xs text-[var(--scout-text-muted)] mt-0.5">NeuraChain scored 85 — 2h ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[var(--scout-accent-purple)]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={14} className="text-[var(--scout-accent-purple)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--scout-text-primary)]">Enrichment completed</p>
                      <p className="text-xs text-[var(--scout-text-muted)] mt-0.5">DataNova profile enriched — 5h ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[var(--scout-accent-blue)]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={14} className="text-[var(--scout-accent-blue)]" />
                    </div>
                    <div>
                      <p className="text-sm text-[var(--scout-text-primary)]">New signal detected</p>
                      <p className="text-xs text-[var(--scout-text-muted)] mt-0.5">SynthBio Labs funding round — 1d ago</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2.5 border-t border-[var(--scout-border)]">
                  <p className="text-xs text-[var(--scout-text-muted)] text-center">All notifications are demo data</p>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="relative hidden sm:block" ref={userMenuRef}>
            <button
              id="user-avatar"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--scout-accent-teal)]/15 text-[var(--scout-accent-teal)] hover:bg-[var(--scout-accent-teal)]/25 transition-scout"
              aria-label="User menu"
            >
              <User size={16} />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-10 z-50 w-56 bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl fade-in">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-[var(--scout-border)]">
                  <p className="text-sm font-semibold text-[var(--scout-text-heading)]">VC Scout</p>
                  <p className="text-xs text-[var(--scout-text-muted)]">scout@signalpath.ai</p>
                </div>
                <div className="p-1.5">
                  <button
                    className={menuItemClass}
                    onClick={() => {
                      openSettingsModal();
                      setUserMenuOpen(false);
                    }}
                  >
                    <UserCog size={14} className="text-[var(--scout-text-muted)]" />
                    Settings
                  </button>
                  <button className={`${menuItemClass} opacity-50 cursor-not-allowed`} disabled>
                    <HelpCircle size={14} className="text-[var(--scout-text-muted)]" />
                    Help & Docs
                    <span className="ml-auto text-[10px] text-[var(--scout-text-muted)]">Soon</span>
                  </button>
                  <div className={menuDividerClass} />
                  <button className={`${menuItemClass} opacity-50 cursor-not-allowed`} disabled>
                    <LogOut size={14} className="text-[var(--scout-text-muted)]" />
                    Sign Out
                    <span className="ml-auto text-[10px] text-[var(--scout-text-muted)]">N/A</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal />
    </>
  );
}
