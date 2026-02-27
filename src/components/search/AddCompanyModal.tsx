"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, X, Globe, Building2 } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import { toast } from "sonner";
import type { Company, FundingStage } from "@/types/company";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (company: Company) => void;
}

const SECTORS = [
  "AI / ML",
  "BioTech",
  "CleanTech",
  "CyberSecurity",
  "DevTools",
  "EdTech",
  "FinTech",
  "FoodTech",
  "HealthTech",
  "HR Tech",
  "LegalTech",
  "Logistics",
  "SpaceTech",
  "AgriTech",
  "Consumer",
];

const STAGES: FundingStage[] = ["Pre-Seed", "Seed", "Series A", "Series B+"];

function AddCompanyModalContent({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (company: Company) => void;
}) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("https://");
  const [sector, setSector] = useState(SECTORS[0]);
  const [stage, setStage] = useState<FundingStage>("Seed");
  const [country, setCountry] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !website.trim() || !country.trim()) return;

    const newCompany: Company = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      website: website.trim(),
      sector,
      stage,
      country: country.trim(),
      score: 50, // Default score for user-added companies
      signalVelocity: 0,
      tags: [],
      createdAt: new Date().toISOString(),
    };

    onAdd(newCompany);
    toast.success(`${newCompany.name} added to companies`);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl w-full max-w-md pointer-events-auto fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--scout-border)]">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--scout-accent-teal)]/10">
                <Building2 size={16} className="text-[var(--scout-accent-teal)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--scout-text-heading)]">
                  Add Company
                </h3>
                <p className="text-xs text-[var(--scout-text-muted)]">
                  Add a new company to your dataset
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-meta mb-2">Company Name *</label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Acme AI"
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-meta mb-2">
                <span className="inline-flex items-center gap-1">
                  <Globe size={12} />
                  Website URL *
                </span>
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all"
              />
            </div>

            {/* Sector & Stage row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-meta mb-2">Sector *</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all appearance-none cursor-pointer"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-meta mb-2">Stage *</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as FundingStage)}
                  className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all appearance-none cursor-pointer"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-meta mb-2">Country *</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States"
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 justify-end pt-1">
              <ScoutButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </ScoutButton>
              <ScoutButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={!name.trim() || !website.trim() || !country.trim()}
              >
                <Plus size={14} />
                Add Company
              </ScoutButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function AddCompanyModal({
  isOpen,
  onClose,
  onAdd,
}: AddCompanyModalProps) {
  if (!isOpen) return null;
  return <AddCompanyModalContent onClose={onClose} onAdd={onAdd} />;
}
