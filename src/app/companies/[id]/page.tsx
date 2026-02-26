"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Bookmark,
  Tag,
  Building2,
} from "lucide-react";

import { mockCompanies } from "@/lib/mock-companies";
import { getCompanySignals } from "@/lib/mock-companies";
import { getScoreBreakdown } from "@/lib/mock-score-breakdowns";

import { StageBadge, ScoutBadge } from "@/components/ui/ScoutBadge";
import { ScoutButton } from "@/components/ui/ScoutButton";
import {
  ScoutCard,
  ScoutCardHeader,
  ScoutCardTitle,
  ScoutCardContent,
} from "@/components/ui/ScoutCard";
import SignalTimeline from "@/components/timeline/SignalTimeline";
import ScoreBreakdownPanel from "@/components/score/ScoreBreakdownPanel";
import CompanyNotesPanel from "@/components/cards/CompanyNotesPanel";
import SaveToListModal from "@/components/lists/SaveToListModal";
import EnrichmentPanel from "@/components/enrichment/EnrichmentPanel";
import { useListStore } from "@/store/useListStore";

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

export default function CompanyProfilePage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [isSaveToListOpen, setIsSaveToListOpen] = useState(false);
  const { lists, loadListsFromStorage, getListsContainingCompany } = useListStore();

  // Load lists on mount
  useEffect(() => {
    loadListsFromStorage();
  }, [loadListsFromStorage]);

  // Find company
  const company = useMemo(
    () => mockCompanies.find((c) => c.id === companyId),
    [companyId]
  );

  // Get signals
  const signals = useMemo(
    () => (companyId ? getCompanySignals(companyId) : []),
    [companyId]
  );

  // Get score breakdown
  const scoreBreakdown = useMemo(
    () => (company ? getScoreBreakdown(companyId, company.score) : null),
    [companyId, company]
  );

  // Get lists this company belongs to
  const companyLists = useMemo(
    () => getListsContainingCompany(companyId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [companyId, lists]
  );

  // ─── 404 State ───
  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-24 fade-in">
        <Building2
          size={48}
          className="text-[var(--scout-text-muted)] opacity-20 mb-4"
        />
        <h2 className="text-lg font-semibold text-[var(--scout-text-heading)] mb-2">
          Company Not Found
        </h2>
        <p className="text-sm text-[var(--scout-text-muted)] mb-6">
          The company you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <ScoutButton variant="secondary" onClick={() => router.push("/companies")}>
          <ArrowLeft size={14} />
          Back to Companies
        </ScoutButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* ═══════════ Back Navigation ═══════════ */}
      <Link
        href="/companies"
        className="inline-flex items-center gap-2 text-sm text-[var(--scout-text-muted)] hover:text-[var(--scout-accent-teal)] transition-colors group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        Back to Companies
      </Link>

      {/* ═══════════ Profile Header ═══════════ */}
      <ScoutCard>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Left: Company info */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--scout-accent-teal)]/10 text-[var(--scout-accent-teal)] text-xl font-bold shrink-0">
              {company.name.charAt(0)}
            </div>

            <div className="min-w-0">
              {/* Name + Stage */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold text-[var(--scout-text-heading)]">
                  {company.name}
                </h1>
                <StageBadge stage={company.stage} />
              </div>

              {/* Meta Row */}
              <div className="flex items-center gap-4 mt-2 flex-wrap text-sm text-[var(--scout-text-muted)]">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-[var(--scout-accent-teal)] transition-colors"
                  >
                    <Globe size={13} />
                    {company.website.replace(/https?:\/\//, "")}
                    <ExternalLink size={10} className="opacity-50" />
                  </a>
                )}
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} />
                  {company.city ? `${company.city}, ` : ""}
                  {company.country}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={13} />
                  Founded {company.foundedYear || "—"}
                </span>
              </div>

              {/* Tags */}
              {company.tags && company.tags.length > 0 && (
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  <Tag
                    size={12}
                    className="text-[var(--scout-text-muted)] shrink-0"
                  />
                  {company.tags.map((tag) => (
                    <ScoutBadge key={tag} variant="default" size="sm">
                      {tag}
                    </ScoutBadge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Score + Actions */}
          <div className="flex items-start gap-4 md:flex-col md:items-end shrink-0">
            {/* Score Ring */}
            <div className="relative flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="4"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="23"
                  fill="none"
                  stroke="var(--scout-accent-teal)"
                  strokeWidth="4"
                  strokeDasharray={`${(company.score / 100) * 144.5} 144.5`}
                  strokeLinecap="round"
                  transform="rotate(-90 28 28)"
                  className="transition-all duration-700"
                />
              </svg>
              <span className="absolute text-base font-bold text-[var(--scout-accent-teal)]">
                {company.score}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <ScoutButton
                variant="secondary"
                size="sm"
                onClick={() => setIsSaveToListOpen(true)}
              >
                <Bookmark size={14} />
                Save to List
                {companyLists.length > 0 && (
                  <span className="ml-0.5 text-[10px] font-bold text-[var(--scout-accent-teal)]">
                    ({companyLists.length})
                  </span>
                )}
              </ScoutButton>
            </div>
          </div>
        </div>
      </ScoutCard>

      {/* ═══════════ Main Content Grid ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* ─── Left Column: 8 cols (Overview + Timeline) ─── */}
        <div className="space-y-6">
          {/* Overview Card */}
          <ScoutCard>
            <ScoutCardHeader>
              <ScoutCardTitle>Company Overview</ScoutCardTitle>
            </ScoutCardHeader>
            <ScoutCardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Raised */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-meta">
                    <DollarSign size={12} />
                    Total Raised
                  </div>
                  <p className="text-lg font-semibold text-[var(--scout-text-heading)]">
                    {formatRaised(company.raisedAmount)}
                  </p>
                </div>

                {/* Last Funding */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-meta">
                    <Calendar size={12} />
                    Last Funding
                  </div>
                  <p className="text-lg font-semibold text-[var(--scout-text-heading)]">
                    {formatDate(company.lastFundingDate)}
                  </p>
                </div>

                {/* Employees */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-meta">
                    <Users size={12} />
                    Employees
                  </div>
                  <p className="text-lg font-semibold text-[var(--scout-text-heading)]">
                    {company.employeesEstimate || "—"}
                  </p>
                </div>

                {/* Signal Velocity */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-meta">
                    <TrendingUp size={12} />
                    Signal Velocity
                  </div>
                  <p className="text-lg font-semibold text-[var(--scout-accent-teal)]">
                    {company.signalVelocity ?? "—"}
                  </p>
                </div>
              </div>
            </ScoutCardContent>
          </ScoutCard>

          {/* Signal Timeline */}
          <ScoutCard>
            <ScoutCardHeader>
              <ScoutCardTitle>Signal Timeline</ScoutCardTitle>
              <span className="text-xs text-[var(--scout-text-muted)]">
                {signals.length} {signals.length === 1 ? "signal" : "signals"}
              </span>
            </ScoutCardHeader>
            <ScoutCardContent>
              <SignalTimeline signals={signals} />
            </ScoutCardContent>
          </ScoutCard>
        </div>

        {/* ─── Right Column: 4 cols (Score + Notes) ─── */}
        <div className="space-y-6">
          {/* Score Breakdown */}
          <ScoutCard>
            <ScoutCardHeader>
              <ScoutCardTitle>Score Breakdown</ScoutCardTitle>
            </ScoutCardHeader>
            <ScoutCardContent>
              {scoreBreakdown ? (
                <ScoreBreakdownPanel breakdown={scoreBreakdown} />
              ) : (
                <p className="text-sm text-[var(--scout-text-muted)]">
                  Score data unavailable
                </p>
              )}
            </ScoutCardContent>
          </ScoutCard>

          {/* Live Enrichment */}
          <ScoutCard>
            <ScoutCardContent>
              <EnrichmentPanel
                companyId={companyId}
                companyName={company.name}
                websiteUrl={company.website}
              />
            </ScoutCardContent>
          </ScoutCard>


          {/* Lists this company belongs to */}
          {companyLists.length > 0 && (
            <ScoutCard>
              <ScoutCardHeader>
                <ScoutCardTitle>Saved in Lists</ScoutCardTitle>
              </ScoutCardHeader>
              <ScoutCardContent>
                <div className="space-y-2">
                  {companyLists.map((list) => (
                    <div
                      key={list.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[var(--scout-bg-primary)]/50 border border-[var(--scout-border)]"
                    >
                      <span className="text-sm text-[var(--scout-text-primary)] truncate">
                        {list.name}
                      </span>
                      <span className="text-[10px] text-[var(--scout-text-muted)]">
                        {list.companyIds.length} {list.companyIds.length === 1 ? "company" : "companies"}
                      </span>
                    </div>
                  ))}
                </div>
              </ScoutCardContent>
            </ScoutCard>
          )}

          {/* Notes */}
          <ScoutCard>
            <ScoutCardContent>
              <CompanyNotesPanel companyId={companyId} />
            </ScoutCardContent>
          </ScoutCard>
        </div>
      </div>

      {/* ═══════════ Save to List Modal ═══════════ */}
      <SaveToListModal
        isOpen={isSaveToListOpen}
        onClose={() => setIsSaveToListOpen(false)}
        companyId={companyId}
        companyName={company.name}
      />
    </div>
  );
}
