"use client";

import React from "react";
import Link from "next/link";
import type { Company } from "@/types/company";
import { StageBadge } from "@/components/ui/ScoutBadge";
import { ArrowUpDown, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import type { SearchFilters } from "@/types/company";

interface CompaniesTableProps {
  companies: Company[];
  sortBy: SearchFilters["sortBy"];
  sortDirection: SearchFilters["sortDirection"];
  onSort: (field: NonNullable<SearchFilters["sortBy"]>) => void;
}

function ScoreBadge({ score }: { score: number }) {
  let color = "var(--scout-accent-teal)";
  if (score < 60) color = "var(--scout-text-muted)";
  else if (score < 75) color = "var(--scout-accent-blue)";
  else if (score < 85) color = "var(--scout-accent-teal)";
  else color = "var(--scout-accent-purple)";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r="17"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeDasharray={`${(score / 100) * 106.8} 106.8`}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          className="transition-all duration-500"
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

function SortHeader({
  label,
  field,
  currentSort,
  currentDirection,
  onSort,
}: {
  label: string;
  field: NonNullable<SearchFilters["sortBy"]>;
  currentSort: SearchFilters["sortBy"];
  currentDirection: SearchFilters["sortDirection"];
  onSort: (field: NonNullable<SearchFilters["sortBy"]>) => void;
}) {
  const isActive = currentSort === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 text-meta hover:text-[var(--scout-text-primary)] transition-colors cursor-pointer group"
    >
      {label}
      {isActive ? (
        currentDirection === "asc" ? (
          <ArrowUp size={12} className="text-[var(--scout-accent-teal)]" />
        ) : (
          <ArrowDown size={12} className="text-[var(--scout-accent-teal)]" />
        )
      ) : (
        <ArrowUpDown
          size={12}
          className="opacity-0 group-hover:opacity-50 transition-opacity"
        />
      )}
    </button>
  );
}

function formatRaised(amount?: number): string {
  if (!amount) return "—";
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CompaniesTable({
  companies,
  sortBy,
  sortDirection,
  onSort,
}: CompaniesTableProps) {
  if (companies.length === 0) {
    return (
      <div className="p-12 rounded-xl border border-dashed border-[var(--scout-border)] text-center">
        <p className="text-[var(--scout-text-muted)]">
          No companies match your filters
        </p>
        <p className="text-sm text-[var(--scout-text-muted)] mt-1 opacity-60">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--scout-border)] bg-[var(--scout-bg-secondary)]">
              <th className="text-left py-3 px-4 text-meta font-medium">
                Company
              </th>
              <th className="text-left py-3 px-4 text-meta font-medium">
                Stage
              </th>
              <th className="text-left py-3 px-4 text-meta font-medium">
                Sector
              </th>
              <th className="text-left py-3 px-4 text-meta font-medium">
                Country
              </th>
              <th className="text-right py-3 px-4">
                <SortHeader
                  label="Raised"
                  field="raisedAmount"
                  currentSort={sortBy}
                  currentDirection={sortDirection}
                  onSort={onSort}
                />
              </th>
              <th className="text-center py-3 px-4">
                <SortHeader
                  label="Score"
                  field="score"
                  currentSort={sortBy}
                  currentDirection={sortDirection}
                  onSort={onSort}
                />
              </th>
              <th className="text-right py-3 px-4">
                <SortHeader
                  label="Latest Signal"
                  field="latestSignal"
                  currentSort={sortBy}
                  currentDirection={sortDirection}
                  onSort={onSort}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, idx) => (
              <tr
                key={company.id}
                className="border-b border-[var(--scout-border)] hover:bg-white/[0.02] transition-colors duration-150 group"
                style={{
                  animationDelay: `${idx * 30}ms`,
                }}
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/companies/${company.id}`}
                    className="flex items-center gap-3 group/name"
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--scout-accent-teal)]/8 text-[var(--scout-accent-teal)] text-sm font-bold shrink-0">
                      {company.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--scout-text-heading)] group-hover/name:text-[var(--scout-accent-teal)] transition-colors truncate">
                        {company.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[var(--scout-text-muted)]">
                        <span className="truncate max-w-[140px]">
                          {company.website.replace(/https?:\/\//, "")}
                        </span>
                        <ExternalLink size={10} className="opacity-0 group-hover/name:opacity-50 transition-opacity shrink-0" />
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <StageBadge stage={company.stage} />
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[var(--scout-text-primary)]">
                    {company.sector}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-[var(--scout-text-muted)]">
                    {company.country}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm font-medium text-[var(--scout-text-primary)]">
                    {formatRaised(company.raisedAmount)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-center">
                    <ScoreBadge score={company.score} />
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-sm text-[var(--scout-text-muted)]">
                    {formatDate(company.lastFundingDate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
