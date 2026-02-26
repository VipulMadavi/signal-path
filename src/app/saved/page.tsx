"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Bookmark,
  Play,
  Trash2,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  X,
  CalendarClock,
  Zap,
} from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import {
  ScoutCard,
} from "@/components/ui/ScoutCard";
import { ScoutBadge } from "@/components/ui/ScoutBadge";
import { useCompanyStore } from "@/store/useCompanyStore";
import type { SavedSearch } from "@/types/company";
import { useRouter } from "next/navigation";

// ─── Format helpers ───
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(iso);
}

// ─── Filter summary helper ───
function getFilterSummary(filters: SavedSearch["filters"]): string[] {
  const parts: string[] = [];

  if (filters.query) {
    parts.push(`Query: "${filters.query}"`);
  }
  if (filters.sector && filters.sector.length > 0) {
    parts.push(
      `Sector: ${filters.sector.length > 2 ? `${filters.sector.slice(0, 2).join(", ")} +${filters.sector.length - 2}` : filters.sector.join(", ")}`
    );
  }
  if (filters.stage && filters.stage.length > 0) {
    parts.push(
      `Stage: ${filters.stage.length > 2 ? `${filters.stage.slice(0, 2).join(", ")} +${filters.stage.length - 2}` : filters.stage.join(", ")}`
    );
  }
  if (filters.country && filters.country.length > 0) {
    parts.push(
      `Country: ${filters.country.length > 2 ? `${filters.country.slice(0, 2).join(", ")} +${filters.country.length - 2}` : filters.country.join(", ")}`
    );
  }
  if (filters.minScore !== undefined) {
    parts.push(`Min Score: ${filters.minScore}`);
  }
  if (filters.sortBy) {
    const sortLabels: Record<string, string> = {
      score: "Score",
      raisedAmount: "Raised",
      latestSignal: "Latest Signal",
    };
    const dir = filters.sortDirection === "asc" ? "↑" : "↓";
    parts.push(`Sort: ${sortLabels[filters.sortBy] || filters.sortBy} ${dir}`);
  }

  if (parts.length === 0) {
    parts.push("All companies (no filters)");
  }

  return parts;
}

// ─── Active filter count ───
function getActiveFilterCount(filters: SavedSearch["filters"]): number {
  let count = 0;
  if (filters.query) count++;
  if (filters.sector && filters.sector.length > 0) count++;
  if (filters.stage && filters.stage.length > 0) count++;
  if (filters.country && filters.country.length > 0) count++;
  if (filters.minScore !== undefined) count++;
  if (filters.maxScore !== undefined) count++;
  return count;
}

// ─── Delete Confirmation Modal ───
function DeleteSearchModal({
  isOpen,
  onClose,
  onConfirm,
  searchName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  searchName: string;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl w-full max-w-sm pointer-events-auto fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--scout-error)]/10">
                <Trash2 size={18} className="text-[var(--scout-error)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--scout-text-heading)]">
                  Delete Saved Search
                </h3>
                <p className="text-xs text-[var(--scout-text-muted)]">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--scout-text-primary)] mb-5">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[var(--scout-error)]">
                &quot;{searchName}&quot;
              </span>
              ?
            </p>
            <div className="flex items-center gap-3 justify-end">
              <ScoutButton variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </ScoutButton>
              <ScoutButton variant="danger" size="sm" onClick={onConfirm}>
                <Trash2 size={14} />
                Delete
              </ScoutButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Saved Search Card ───
function SavedSearchCard({
  search,
  onRerun,
  onDelete,
}: {
  search: SavedSearch;
  onRerun: () => void;
  onDelete: () => void;
}) {
  const filterParts = useMemo(
    () => getFilterSummary(search.filters),
    [search.filters]
  );
  const filterCount = useMemo(
    () => getActiveFilterCount(search.filters),
    [search.filters]
  );

  return (
    <ScoutCard
      interactive
      className="group relative overflow-hidden"
    >
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--scout-accent-blue)]/40 via-[var(--scout-accent-teal)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--scout-accent-blue)]/10">
              <Bookmark
                size={14}
                className="text-[var(--scout-accent-blue)]"
              />
            </div>
            <h3 className="text-sm font-semibold text-[var(--scout-text-heading)] truncate">
              {search.name}
            </h3>
            {filterCount > 0 && (
              <ScoutBadge variant="blue" size="sm">
                <Filter size={10} />
                {filterCount} {filterCount === 1 ? "filter" : "filters"}
              </ScoutBadge>
            )}
          </div>

          {/* Filter Details */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {filterParts.map((part, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] border border-[var(--scout-border)] text-xs text-[var(--scout-text-muted)]"
              >
                {part}
              </span>
            ))}
          </div>

          {/* Timestamps */}
          <div className="flex items-center gap-4 text-xs text-[var(--scout-text-muted)]">
            <span className="flex items-center gap-1">
              <CalendarClock size={12} />
              Created {formatDate(search.createdAt)}
            </span>
            {search.lastRunAt && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Last run {timeAgo(search.lastRunAt)}
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ScoutButton
            variant="primary"
            size="sm"
            onClick={onRerun}
            className="gap-1.5"
          >
            <Play size={13} />
            Re-run
          </ScoutButton>
          <ScoutButton
            variant="muted"
            size="icon"
            onClick={onDelete}
            className="hover:!bg-[var(--scout-error)]/10 hover:!text-[var(--scout-error)]"
          >
            <Trash2 size={14} />
          </ScoutButton>
        </div>
      </div>
    </ScoutCard>
  );
}

// ─── Main Page ───
export default function SavedPage() {
  const {
    savedSearches,
    loadSavedSearchesFromStorage,
    applySavedSearch,
    deleteSavedSearch,
  } = useCompanyStore();

  const router = useRouter();
  const [deletingSearch, setDeletingSearch] = useState<SavedSearch | null>(null);
  const [searchFilter, setSearchFilter] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    loadSavedSearchesFromStorage();
  }, [loadSavedSearchesFromStorage]);

  // Filtered saved searches
  const filteredSearches = useMemo(() => {
    if (!searchFilter.trim()) return savedSearches;
    const q = searchFilter.toLowerCase();
    return savedSearches.filter((s) => s.name.toLowerCase().includes(q));
  }, [savedSearches, searchFilter]);

  const handleRerun = (search: SavedSearch) => {
    applySavedSearch(search);
    router.push("/companies");
  };

  const handleDelete = () => {
    if (deletingSearch) {
      deleteSavedSearch(deletingSearch.id);
      setDeletingSearch(null);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--scout-accent-blue)]/10">
            <Bookmark size={20} className="text-[var(--scout-accent-blue)]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--scout-text-heading)]">
              Saved Searches
            </h1>
            <p className="text-sm text-[var(--scout-text-muted)]">
              Re-run your saved filter configurations
            </p>
          </div>
        </div>

        {/* Search bar for saved searches */}
        {savedSearches.length > 3 && (
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--scout-text-muted)]"
            />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter searches..."
              className="pl-8 pr-3 py-2 w-48 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 transition-all"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoutCard className="!p-4">
          <p className="text-meta mb-1">Total Saved</p>
          <p className="text-2xl font-semibold text-[var(--scout-text-heading)] tabular-nums">
            {savedSearches.length}
          </p>
        </ScoutCard>
        <ScoutCard className="!p-4">
          <p className="text-meta mb-1">Recently Run</p>
          <p className="text-2xl font-semibold text-[var(--scout-accent-blue)] tabular-nums">
            {
              savedSearches.filter((s) => {
                if (!s.lastRunAt) return false;
                const dayAgo = Date.now() - 86_400_000;
                return new Date(s.lastRunAt).getTime() > dayAgo;
              }).length
            }
          </p>
          <p className="text-xs text-[var(--scout-text-muted)] mt-0.5">
            in last 24h
          </p>
        </ScoutCard>
        <ScoutCard className="!p-4">
          <p className="text-meta mb-1">With Active Filters</p>
          <p className="text-2xl font-semibold text-[var(--scout-accent-teal)] tabular-nums">
            {
              savedSearches.filter(
                (s) => getActiveFilterCount(s.filters) > 0
              ).length
            }
          </p>
        </ScoutCard>
      </div>

      {/* Saved Searches List */}
      {savedSearches.length === 0 ? (
        <ScoutCard className="!py-16 text-center">
          <Zap
            size={40}
            className="mx-auto text-[var(--scout-text-muted)] opacity-20 mb-4"
          />
          <h3 className="text-base font-medium text-[var(--scout-text-heading)] mb-2">
            No saved searches
          </h3>
          <p className="text-sm text-[var(--scout-text-muted)] mb-6 max-w-sm mx-auto">
            Save your filter configurations from the{" "}
            <span className="text-[var(--scout-accent-teal)]">Companies</span>{" "}
            page to quickly re-run them later.
          </p>
          <ScoutButton
            variant="primary"
            size="md"
            onClick={() => router.push("/companies")}
          >
            <Search size={16} />
            Go to Companies
          </ScoutButton>
        </ScoutCard>
      ) : filteredSearches.length === 0 ? (
        <ScoutCard className="!py-12 text-center">
          <Search
            size={32}
            className="mx-auto text-[var(--scout-text-muted)] opacity-20 mb-3"
          />
          <p className="text-sm text-[var(--scout-text-muted)]">
            No saved searches match &quot;{searchFilter}&quot;
          </p>
        </ScoutCard>
      ) : (
        <div className="space-y-3">
          {filteredSearches.map((search) => (
            <SavedSearchCard
              key={search.id}
              search={search}
              onRerun={() => handleRerun(search)}
              onDelete={() => setDeletingSearch(search)}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteSearchModal
        isOpen={deletingSearch !== null}
        onClose={() => setDeletingSearch(null)}
        onConfirm={handleDelete}
        searchName={deletingSearch?.name || ""}
      />
    </div>
  );
}
