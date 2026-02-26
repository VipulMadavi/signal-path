"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Settings,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Bot,
  Shield,
  Info,
} from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ScoutButton } from "@/components/ui/ScoutButton";

// ─── Key validation helpers ───
function isValidOpenAIKey(key: string): boolean {
  if (!key) return true; // Empty is ok (optional)
  return key.startsWith("sk-") && key.length > 20;
}

function isValidGeminiKey(key: string): boolean {
  if (!key) return true; // Empty is ok (optional)
  return key.length > 20;
}

// ─── Test connection helper ───
async function testAPIKey(
  provider: "openai" | "gemini",
  key: string
): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetch("/api/test-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, key }),
    });
    const data = await response.json();
    if (data.success) {
      return { ok: true, message: "Connection successful!" };
    }
    return { ok: false, message: data.error || "Invalid key." };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export default function SettingsModal() {
  const {
    settings,
    loadSettingsFromStorage,
    setUserOpenAIKey,
    setUserGeminiKey,
    clearUserKeys,
    isSettingsModalOpen,
    closeSettingsModal,
  } = useSettingsStore();

  const [openaiKey, setOpenaiKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showGemini, setShowGemini] = useState(false);
  const [testingOpenAI, setTestingOpenAI] = useState(false);
  const [testingGemini, setTestingGemini] = useState(false);
  const [openAIStatus, setOpenAIStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [geminiStatus, setGeminiStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  // Load current keys when modal opens
  useEffect(() => {
    if (isSettingsModalOpen) {
      loadSettingsFromStorage();
      setOpenaiKey(settings.userOpenAIKey || "");
      setGeminiKey(settings.userGeminiKey || "");
      setOpenAIStatus(null);
      setGeminiStatus(null);
      setSaved(false);
    }
  }, [isSettingsModalOpen, loadSettingsFromStorage, settings.userOpenAIKey, settings.userGeminiKey]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isSettingsModalOpen) {
        closeSettingsModal();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsModalOpen, closeSettingsModal]);

  const handleSave = useCallback(() => {
    setUserOpenAIKey(openaiKey);
    setUserGeminiKey(geminiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [openaiKey, geminiKey, setUserOpenAIKey, setUserGeminiKey]);

  const handleClearAll = useCallback(() => {
    setOpenaiKey("");
    setGeminiKey("");
    clearUserKeys();
    setOpenAIStatus(null);
    setGeminiStatus(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [clearUserKeys]);

  const handleTestOpenAI = useCallback(async () => {
    if (!openaiKey.trim()) return;
    setTestingOpenAI(true);
    setOpenAIStatus(null);
    const result = await testAPIKey("openai", openaiKey.trim());
    setOpenAIStatus(result);
    setTestingOpenAI(false);
  }, [openaiKey]);

  const handleTestGemini = useCallback(async () => {
    if (!geminiKey.trim()) return;
    setTestingGemini(true);
    setGeminiStatus(null);
    const result = await testAPIKey("gemini", geminiKey.trim());
    setGeminiStatus(result);
    setTestingGemini(false);
  }, [geminiKey]);

  if (!isSettingsModalOpen) return null;

  const openAIValid = isValidOpenAIKey(openaiKey);
  const geminiValid = isValidGeminiKey(geminiKey);
  const hasKeys = Boolean(openaiKey.trim() || geminiKey.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeSettingsModal}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] shadow-2xl shadow-black/50 fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--scout-border)]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--scout-accent-teal)]/10">
              <Settings size={16} className="text-[var(--scout-accent-teal)]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--scout-text-heading)]">
                API Configuration
              </h2>
              <p className="text-[10px] text-[var(--scout-text-muted)]">
                Provide your API keys for live enrichment
              </p>
            </div>
          </div>
          <button
            onClick={closeSettingsModal}
            className="p-1.5 rounded-lg text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.06] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Security Notice */}
        <div className="mx-6 mt-4 flex items-start gap-2.5 p-3 rounded-lg bg-[var(--scout-accent-teal)]/5 border border-[var(--scout-accent-teal)]/10">
          <Shield size={14} className="text-[var(--scout-accent-teal)] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-[var(--scout-text-primary)]">
              Your keys are private
            </p>
            <p className="text-[10px] text-[var(--scout-text-muted)] mt-0.5">
              Keys are stored only in your browser&apos;s localStorage and sent directly to the AI
              provider via the server route. They are never stored on any server or database.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* OpenAI Key */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot size={14} style={{ color: "var(--scout-accent-teal)" }} />
              <label className="text-xs font-medium text-[var(--scout-text-heading)]">
                OpenAI API Key
              </label>
              <span className="text-[10px] text-[var(--scout-text-muted)] px-1.5 py-0.5 rounded bg-white/[0.04]">
                GPT-4o Mini
              </span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--scout-text-muted)]"
                />
                <input
                  id="openai-key-input"
                  type={showOpenAI ? "text" : "password"}
                  value={openaiKey}
                  onChange={(e) => {
                    setOpenaiKey(e.target.value);
                    setOpenAIStatus(null);
                  }}
                  placeholder="sk-..."
                  className={`w-full pl-9 pr-10 py-2.5 rounded-lg bg-white/[0.03] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)] outline-none border transition-colors ${
                    !openAIValid
                      ? "border-[var(--scout-error)]/40 focus:border-[var(--scout-error)]/60"
                      : "border-[var(--scout-border)] focus:border-[var(--scout-accent-teal)]/40"
                  }`}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => setShowOpenAI(!showOpenAI)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] transition-colors"
                  tabIndex={-1}
                >
                  {showOpenAI ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                onClick={handleTestOpenAI}
                disabled={!openaiKey.trim() || !openAIValid || testingOpenAI}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-[var(--scout-border)] text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {testingOpenAI ? <Loader2 size={14} className="animate-spin" /> : "Test"}
              </button>
            </div>
            {!openAIValid && (
              <p className="text-[10px] text-[var(--scout-error)] flex items-center gap-1">
                <AlertCircle size={10} />
                OpenAI keys start with &quot;sk-&quot; and are at least 20 characters.
              </p>
            )}
            {openAIStatus && (
              <p
                className={`text-[10px] flex items-center gap-1 ${
                  openAIStatus.ok ? "text-[var(--scout-success)]" : "text-[var(--scout-error)]"
                }`}
              >
                {openAIStatus.ok ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                {openAIStatus.message}
              </p>
            )}
          </div>

          {/* Gemini Key */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Bot size={14} style={{ color: "var(--scout-accent-blue)" }} />
              <label className="text-xs font-medium text-[var(--scout-text-heading)]">
                Google Gemini API Key
              </label>
              <span className="text-[10px] text-[var(--scout-text-muted)] px-1.5 py-0.5 rounded bg-white/[0.04]">
                Gemini 1.5 Flash
              </span>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--scout-text-muted)]"
                />
                <input
                  id="gemini-key-input"
                  type={showGemini ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => {
                    setGeminiKey(e.target.value);
                    setGeminiStatus(null);
                  }}
                  placeholder="AIza..."
                  className={`w-full pl-9 pr-10 py-2.5 rounded-lg bg-white/[0.03] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)] outline-none border transition-colors ${
                    !geminiValid
                      ? "border-[var(--scout-error)]/40 focus:border-[var(--scout-error)]/60"
                      : "border-[var(--scout-border)] focus:border-[var(--scout-accent-teal)]/40"
                  }`}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  onClick={() => setShowGemini(!showGemini)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] transition-colors"
                  tabIndex={-1}
                >
                  {showGemini ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                onClick={handleTestGemini}
                disabled={!geminiKey.trim() || !geminiValid || testingGemini}
                className="px-3 py-2 rounded-lg text-xs font-medium border border-[var(--scout-border)] text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {testingGemini ? <Loader2 size={14} className="animate-spin" /> : "Test"}
              </button>
            </div>
            {!geminiValid && (
              <p className="text-[10px] text-[var(--scout-error)] flex items-center gap-1">
                <AlertCircle size={10} />
                Gemini keys must be at least 20 characters.
              </p>
            )}
            {geminiStatus && (
              <p
                className={`text-[10px] flex items-center gap-1 ${
                  geminiStatus.ok ? "text-[var(--scout-success)]" : "text-[var(--scout-error)]"
                }`}
              >
                {geminiStatus.ok ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
                {geminiStatus.message}
              </p>
            )}
          </div>

          {/* Info box */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-[var(--scout-accent-purple)]/5 border border-[var(--scout-accent-purple)]/10">
            <Info size={13} className="text-[var(--scout-accent-purple)] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[var(--scout-text-muted)] leading-relaxed">
              At least one API key is required for live AI enrichment. Without keys, the system runs
              in <strong className="text-[var(--scout-text-primary)]">Demo Mode</strong> with mock
              data. You can switch the active model in the TopBar or per-company in the Enrichment
              Panel.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--scout-border)]">
          <div className="flex items-center gap-2">
            {hasKeys && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--scout-error)] hover:bg-[var(--scout-error)]/5 transition-colors"
              >
                <Trash2 size={12} />
                Clear All Keys
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--scout-success)] fade-in">
                <CheckCircle2 size={10} />
                Saved!
              </span>
            )}
            <ScoutButton variant="secondary" size="sm" onClick={closeSettingsModal}>
              Cancel
            </ScoutButton>
            <ScoutButton variant="primary" size="sm" onClick={handleSave}>
              Save Keys
            </ScoutButton>
          </div>
        </div>
      </div>
    </div>
  );
}
