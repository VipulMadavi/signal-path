"use client";

import React, { useEffect, useRef } from "react";
import { Bot, ChevronDown, Check, Sparkles, FlaskConical } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import type { AIProvider } from "@/types/enrichment";

const PROVIDERS: { id: AIProvider; name: string; description: string; color: string }[] = [
  {
    id: "openai",
    name: "OpenAI",
    description: "GPT-4o Mini",
    color: "var(--scout-accent-teal)",
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Gemini 1.5 Flash",
    color: "var(--scout-accent-blue)",
  },
];

export default function ModelSwitcher() {
  const {
    settings,
    loadSettingsFromStorage,
    setDefaultProvider,
    isModelSwitcherOpen,
    toggleModelSwitcher,
    closeModelSwitcher,
    isEffectivelyDemoMode,
  } = useSettingsStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettingsFromStorage();
  }, [loadSettingsFromStorage]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeModelSwitcher();
      }
    }
    if (isModelSwitcherOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModelSwitcherOpen, closeModelSwitcher]);

  const currentProvider = PROVIDERS.find((p) => p.id === settings.defaultProvider) || PROVIDERS[0];
  // #3: Check if demo mode is forcing mock data
  const demoMode = isEffectivelyDemoMode();

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id="model-switcher-btn"
        onClick={toggleModelSwitcher}
        className={`
          flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium
          border transition-all duration-200
          ${
            demoMode
              ? "opacity-60 cursor-default"
              : isModelSwitcherOpen
                ? "border-[var(--scout-accent-teal)]/30 bg-[var(--scout-accent-teal)]/5 text-[var(--scout-text-primary)]"
                : "border-[var(--scout-border)] hover:border-white/15 text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] bg-white/[0.03] hover:bg-white/[0.05]"
          }
        `}
        style={demoMode ? {
          borderColor: "color-mix(in srgb, var(--scout-warning) 25%, transparent)",
          background: "color-mix(in srgb, var(--scout-warning) 5%, transparent)",
          color: "var(--scout-warning)",
        } : {}}
        aria-label="Switch AI model"
        title={demoMode ? "Demo Mode is active — model selection bypassed" : "Switch AI model"}
      >
        {demoMode ? (
          <FlaskConical size={14} style={{ color: "var(--scout-warning)" }} />
        ) : (
          <Bot size={14} style={{ color: currentProvider.color }} />
        )}
        <span className="hidden sm:inline">
          {demoMode ? "Demo" : currentProvider.name}
        </span>
        {!demoMode && (
          <ChevronDown
            size={12}
            className={`transition-transform duration-200 ${isModelSwitcherOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {/* Dropdown — only show when NOT in demo mode */}
      {isModelSwitcherOpen && !demoMode && (
        <div
          className="absolute right-0 top-full mt-1.5 w-56 z-50 rounded-xl border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] shadow-xl shadow-black/40 overflow-hidden fade-in"
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-[var(--scout-border)]">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-[var(--scout-accent-purple)]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--scout-text-muted)]">
                AI Model
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="p-1">
            {PROVIDERS.map((provider) => {
              const isActive = settings.defaultProvider === provider.id;
              return (
                <button
                  key={provider.id}
                  id={`model-option-${provider.id}`}
                  onClick={() => setDefaultProvider(provider.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150
                    ${
                      isActive
                        ? "bg-[var(--scout-accent-teal)]/8 text-[var(--scout-text-primary)]"
                        : "text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04]"
                    }
                  `}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 ${
                      isActive ? "bg-[var(--scout-accent-teal)]/15" : "bg-white/[0.04]"
                    }`}
                  >
                    <Bot size={16} style={{ color: provider.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{provider.name}</p>
                    <p className="text-[10px] text-[var(--scout-text-muted)]">
                      {provider.description}
                    </p>
                  </div>
                  {isActive && (
                    <Check size={14} className="text-[var(--scout-accent-teal)] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* #8: Footer hint — mentions Demo Mode */}
          <div className="px-3 py-2 border-t border-[var(--scout-border)]">
            <p className="text-[10px] text-[var(--scout-text-muted)]">
              Applies to new enrichments. Override per-company in the enrichment panel. Demo Mode in Settings bypasses model selection entirely.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
