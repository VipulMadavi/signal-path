"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bookmark, X } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SaveSearchModal({
  isOpen,
  onClose,
  onSave,
}: SaveSearchModalProps) {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      // slight delay to ensure DOM is ready
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
      setName("");
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
              <Bookmark size={16} className="text-[var(--scout-accent-teal)]" />
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
              <Bookmark size={14} />
              Save Search
            </ScoutButton>
          </div>
        </form>
      </div>
    </div>
  );
}
