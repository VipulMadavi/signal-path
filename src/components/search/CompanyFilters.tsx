"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";

interface FilterOption {
  label: string;
  value: string;
  count: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function FilterDropdown({
  label,
  options,
  selected,
  onChange,
}: FilterDropdownProps) {
  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-meta">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => toggleValue(option.value)}
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
                transition-all duration-150 cursor-pointer border
                ${
                  isSelected
                    ? "bg-[var(--scout-accent-teal)]/10 text-[var(--scout-accent-teal)] border-[var(--scout-accent-teal)]/30"
                    : "bg-white/[0.03] text-[var(--scout-text-muted)] border-[var(--scout-border)] hover:bg-white/[0.06] hover:text-[var(--scout-text-primary)]"
                }
              `}
            >
              {option.label}
              <span className="text-[10px] opacity-50">({option.count})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CompanyFiltersProps {
  stages: FilterOption[];
  sectors: FilterOption[];
  countries: FilterOption[];
  selectedStages: string[];
  selectedSectors: string[];
  selectedCountries: string[];
  onStageChange: (values: string[]) => void;
  onSectorChange: (values: string[]) => void;
  onCountryChange: (values: string[]) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export default function CompanyFilters({
  stages,
  sectors,
  countries,
  selectedStages,
  selectedSectors,
  selectedCountries,
  onStageChange,
  onSectorChange,
  onCountryChange,
  onReset,
  activeFilterCount,
}: CompanyFiltersProps) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.05)] bg-[var(--scout-bg-card)] p-5 space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--scout-text-heading)]">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--scout-accent-teal)]/15 text-[var(--scout-accent-teal)] text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </p>
        {activeFilterCount > 0 && (
          <ScoutButton variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw size={12} />
            Reset
          </ScoutButton>
        )}
      </div>

      {/* Stage filter */}
      <FilterDropdown
        label="Stage"
        options={stages}
        selected={selectedStages}
        onChange={onStageChange}
      />

      {/* Sector filter */}
      <FilterDropdown
        label="Sector"
        options={sectors}
        selected={selectedSectors}
        onChange={onSectorChange}
      />

      {/* Country filter */}
      <FilterDropdown
        label="Country"
        options={countries}
        selected={selectedCountries}
        onChange={onCountryChange}
      />

      {/* Active filters summary */}
      {activeFilterCount > 0 && (
        <div className="pt-3 border-t border-[var(--scout-border)]">
          <p className="text-meta mb-2">Active Filters</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedStages.map((s) => (
              <ActiveTag key={s} label={s} onRemove={() => onStageChange(selectedStages.filter((v) => v !== s))} />
            ))}
            {selectedSectors.map((s) => (
              <ActiveTag key={s} label={s} onRemove={() => onSectorChange(selectedSectors.filter((v) => v !== s))} />
            ))}
            {selectedCountries.map((s) => (
              <ActiveTag key={s} label={s} onRemove={() => onCountryChange(selectedCountries.filter((v) => v !== s))} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ActiveTag({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--scout-accent-teal)]/8 text-[var(--scout-accent-teal)] text-xs font-medium">
      {label}
      <button
        onClick={onRemove}
        className="hover:bg-white/10 rounded-sm p-0.5 transition-colors cursor-pointer"
      >
        <X size={10} />
      </button>
    </span>
  );
}
