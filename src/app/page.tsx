"use client";

import { Building2, ListChecks, Bookmark, Zap, TrendingUp, Target } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import { ScoutCard, ScoutCardHeader, ScoutCardTitle, ScoutCardContent } from "@/components/ui/ScoutCard";
import { ScoutBadge, StageBadge } from "@/components/ui/ScoutBadge";
import Link from "next/link";
import { mockCompanies } from "@/lib/mock-companies";

export default function Home() {
  const totalCompanies = mockCompanies.length;
  const avgScore = Math.round(
    mockCompanies.reduce((sum, c) => sum + c.score, 0) / totalCompanies
  );
  const topCompany = mockCompanies.reduce((best, c) =>
    c.score > best.score ? c : best
  );

  return (
    <div className="space-y-8 fade-in">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--scout-accent-teal)]/10">
            <Zap size={22} className="text-[var(--scout-accent-teal)]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--scout-text-heading)]">
              Welcome to ScoutVC
            </h1>
            <p className="text-sm text-[var(--scout-text-muted)]">
              Your thesis-first venture intelligence platform
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScoutCard interactive>
          <Link href="/companies" className="block">
            <ScoutCardHeader>
              <ScoutCardTitle>
                <span className="flex items-center gap-2">
                  <Building2 size={16} className="text-[var(--scout-accent-teal)]" />
                  Companies
                </span>
              </ScoutCardTitle>
              <ScoutBadge variant="teal" size="sm">Active</ScoutBadge>
            </ScoutCardHeader>
            <ScoutCardContent>
              <p className="text-3xl font-bold text-[var(--scout-text-heading)]">{totalCompanies}</p>
              <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                Tracked startups
              </p>
            </ScoutCardContent>
          </Link>
        </ScoutCard>

        <ScoutCard interactive>
          <Link href="/companies" className="block">
            <ScoutCardHeader>
              <ScoutCardTitle>
                <span className="flex items-center gap-2">
                  <Target size={16} className="text-[var(--scout-accent-purple)]" />
                  Avg Score
                </span>
              </ScoutCardTitle>
              <ScoutBadge variant="purple" size="sm">Metric</ScoutBadge>
            </ScoutCardHeader>
            <ScoutCardContent>
              <p className="text-3xl font-bold text-[var(--scout-text-heading)]">{avgScore}</p>
              <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                Average company score
              </p>
            </ScoutCardContent>
          </Link>
        </ScoutCard>

        <ScoutCard interactive>
          <Link href={`/companies/${topCompany.id}`} className="block">
            <ScoutCardHeader>
              <ScoutCardTitle>
                <span className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[var(--scout-accent-blue)]" />
                  Top Rated
                </span>
              </ScoutCardTitle>
              <ScoutBadge variant="blue" size="sm">{topCompany.score}</ScoutBadge>
            </ScoutCardHeader>
            <ScoutCardContent>
              <p className="text-3xl font-bold text-[var(--scout-text-heading)]">{topCompany.name}</p>
              <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                {topCompany.sector} · {topCompany.stage}
              </p>
            </ScoutCardContent>
          </Link>
        </ScoutCard>
      </div>

      {/* Getting Started */}
      <ScoutCard>
        <ScoutCardHeader>
          <ScoutCardTitle>
            <span className="flex items-center gap-2">
              <Zap size={16} className="text-[var(--scout-accent-teal)]" />
              Get Started
            </span>
          </ScoutCardTitle>
        </ScoutCardHeader>
        <ScoutCardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/companies" className="group">
              <div className="p-4 rounded-lg border border-[var(--scout-border)] hover:border-[var(--scout-accent-teal)]/30 transition-all duration-200 hover:bg-white/[0.02]">
                <h3 className="text-sm font-medium text-[var(--scout-text-heading)] group-hover:text-[var(--scout-accent-teal)] transition-colors">
                  → Explore Companies
                </h3>
                <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                  Browse, filter, and sort {totalCompanies} startups in the database
                </p>
              </div>
            </Link>
            <Link href="/lists" className="group">
              <div className="p-4 rounded-lg border border-[var(--scout-border)] hover:border-[var(--scout-accent-purple)]/30 transition-all duration-200 hover:bg-white/[0.02]">
                <h3 className="text-sm font-medium text-[var(--scout-text-heading)] group-hover:text-[var(--scout-accent-purple)] transition-colors">
                  → Create a List
                </h3>
                <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                  Organize companies into custom lists
                </p>
              </div>
            </Link>
          </div>
        </ScoutCardContent>
      </ScoutCard>
    </div>
  );
}
