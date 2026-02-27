"use client";

import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  Building2,
  Search,
  Bookmark,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { getScoredCompanies } from "@/lib/mock-companies";
import { useCompanyStore } from "@/store/useCompanyStore";
import CompaniesTable from "@/components/tables/CompaniesTable";
import CompanyFilters from "@/components/search/CompanyFilters";
import Pagination from "@/components/tables/Pagination";
import SaveSearchModal from "@/components/search/SaveSearchModal";
import { ScoutButton } from "@/components/ui/ScoutButton";
import AddCompanyModal from "@/components/search/AddCompanyModal";
import type { Company, SearchFilters } from "@/types/company";

// ─── Helpers for filter options ───
function getFilterOptions(
  companies: Company[],
  field: keyof Company
): { label: string; value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of companies) {
    const val = String(c[field] ?? "");
    counts.set(val, (counts.get(val) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ label: value, value, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export default function CompaniesPage() {
  const {
    filters,
    setFilters,
    resetFilters,
    currentPage,
    pageSize,
    setCurrentPage,
    isFilterOpen,
    toggleFilters,
    isSaveSearchOpen,
    toggleSaveSearch,
    saveCurrentSearch,
    loadSavedSearchesFromStorage,
  } = useCompanyStore();

  // User-added companies (local state)
  const [userCompanies, setUserCompanies] = useState<Company[]>([]);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const handleAddCompany = useCallback((company: Company) => {
    setUserCompanies((prev) => [company, ...prev]);
  }, []);

  // Load saved searches on mount
  useEffect(() => {
    loadSavedSearchesFromStorage();
  }, [loadSavedSearchesFromStorage]);

  // ─── Filter options from all companies (mock + user-added) ───
  const allCompanies = useMemo(
    () => [...userCompanies, ...getScoredCompanies()],
    [userCompanies]
  );

  const stageOptions = useMemo(
    () => getFilterOptions(allCompanies, "stage"),
    [allCompanies]
  );
  const sectorOptions = useMemo(
    () => getFilterOptions(allCompanies, "sector"),
    [allCompanies]
  );
  const countryOptions = useMemo(
    () => getFilterOptions(allCompanies, "country"),
    [allCompanies]
  );

  // ─── Apply filters + search ───
  const filteredCompanies = useMemo(() => {
    let result = [...allCompanies];

    // Text search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.sector.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q) ||
          c.website.toLowerCase().includes(q) ||
          (c.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Stage filter
    if (filters.stage && filters.stage.length > 0) {
      result = result.filter((c) => filters.stage!.includes(c.stage));
    }

    // Sector filter
    if (filters.sector && filters.sector.length > 0) {
      result = result.filter((c) => filters.sector!.includes(c.sector));
    }

    // Country filter
    if (filters.country && filters.country.length > 0) {
      result = result.filter((c) => filters.country!.includes(c.country));
    }

    // Sorting
    const sortBy = filters.sortBy || "score";
    const sortDir = filters.sortDirection || "desc";
    result.sort((a, b) => {
      let aVal: number;
      let bVal: number;

      switch (sortBy) {
        case "score":
          aVal = a.score;
          bVal = b.score;
          break;
        case "raisedAmount":
          aVal = a.raisedAmount || 0;
          bVal = b.raisedAmount || 0;
          break;
        case "latestSignal":
          aVal = a.lastFundingDate
            ? new Date(a.lastFundingDate).getTime()
            : 0;
          bVal = b.lastFundingDate
            ? new Date(b.lastFundingDate).getTime()
            : 0;
          break;
        default:
          aVal = a.score;
          bVal = b.score;
      }

      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [filters, allCompanies]);

  // ─── Pagination ───
  const totalPages = Math.ceil(filteredCompanies.length / pageSize);
  const paginatedCompanies = useMemo(
    () =>
      filteredCompanies.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [filteredCompanies, currentPage, pageSize]
  );

  // ─── Sort handler ───
  const handleSort = (field: NonNullable<SearchFilters["sortBy"]>) => {
    if (filters.sortBy === field) {
      setFilters({
        sortDirection: filters.sortDirection === "asc" ? "desc" : "asc",
      });
    } else {
      setFilters({ sortBy: field, sortDirection: "desc" });
    }
  };

  // ─── Active filter count ───
  const activeFilterCount =
    (filters.stage?.length || 0) +
    (filters.sector?.length || 0) +
    (filters.country?.length || 0);

  return (
    <div className="space-y-6 fade-in animate-fadeInUp">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--scout-accent-teal)]/10 flex-shrink-0">
            <Building2 size={22} className="text-[var(--scout-accent-teal)]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[var(--scout-text-heading)]">
              Companies
            </h1>
            <p className="text-sm text-[var(--scout-text-muted)]">
              {filteredCompanies.length} startups found
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ScoutButton
            variant={isFilterOpen ? "primary" : "secondary"}
            size="sm"
            onClick={toggleFilters}
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </ScoutButton>
          <ScoutButton variant="secondary" size="sm" onClick={toggleSaveSearch}>
            <Bookmark size={14} />
            Save Search
          </ScoutButton>
          <ScoutButton variant="primary" size="sm" onClick={() => setIsAddCompanyOpen(true)}>
            <Plus size={14} />
            New Company
          </ScoutButton>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--scout-text-muted)]"
        />
        <input
          type="text"
          value={filters.query || ""}
          onChange={(e) => setFilters({ query: e.target.value })}
          placeholder="Search companies..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--scout-border)] bg-[var(--scout-bg-card)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/30 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/10 transition-all"
        />
      </div>

      {/* Main Content: Filters + Table */}
      <div
        className={`grid gap-6 ${
          isFilterOpen ? "grid-cols-1 lg:grid-cols-[280px_1fr]" : "grid-cols-1"
        }`}
      >
        {/* Filters Panel */}
        {isFilterOpen && (
          <CompanyFilters
            stages={stageOptions}
            sectors={sectorOptions}
            countries={countryOptions}
            selectedStages={filters.stage || []}
            selectedSectors={filters.sector || []}
            selectedCountries={filters.country || []}
            onStageChange={(v) => setFilters({ stage: v })}
            onSectorChange={(v) => setFilters({ sector: v })}
            onCountryChange={(v) => setFilters({ country: v })}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
          />
        )}

        {/* Table + Pagination */}
        <div className="space-y-4">
          <CompaniesTable
            companies={paginatedCompanies}
            sortBy={filters.sortBy}
            sortDirection={filters.sortDirection}
            onSort={handleSort}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredCompanies.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Save Search Modal */}
      <SaveSearchModal
        isOpen={isSaveSearchOpen}
        onClose={toggleSaveSearch}
        onSave={saveCurrentSearch}
      />
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        onAdd={handleAddCompany}
      />
    </div>
  );
}
