"use client";

import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import { toast } from "sonner";

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

function SaveSearchModalContent({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      toast.success('Search saved!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-xl border border-[rgba(255,255,255,0.08)] bg-[var(--scout-bg-card)] shadow-2xl fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--scout-border)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--scout-accent-teal)]/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--scout-accent-teal)]"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--scout-text-heading)]">
                Save Search
              </h3>
              <p className="text-xs text-[var(--scout-text-muted)]">
                Save your current filters for quick access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} className="text-[var(--scout-text-muted)]" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-meta mb-2">Search Name</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., AI Series A in US"
              className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 justify-end">
            <ScoutButton type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </ScoutButton>
            <ScoutButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={!name.trim()}
            >
              Save Search
            </ScoutButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SaveSearchModal({
  isOpen,
  onClose,
  onSave,
}: SaveSearchModalProps) {
  if (!isOpen) return null;
  return <SaveSearchModalContent onClose={onClose} onSave={onSave} />;
}
