import { Building2, ListChecks, Bookmark, Zap, TrendingUp, Target } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import { ScoutCard, ScoutCardHeader, ScoutCardTitle, ScoutCardContent } from "@/components/ui/ScoutCard";
import { ScoutBadge, StageBadge } from "@/components/ui/ScoutBadge";
import Link from "next/link";

export default function Home() {
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
              <p className="text-3xl font-bold text-[var(--scout-text-heading)]">—</p>
              <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                Tracked startups
              </p>
            </ScoutCardContent>
          </Link>
        </ScoutCard>

        <ScoutCard interactive>
          <Link href="/lists" className="block">
            <ScoutCardHeader>
              <ScoutCardTitle>
                <span className="flex items-center gap-2">
                  <ListChecks size={16} className="text-[var(--scout-accent-purple)]" />
                  Lists
                </span>
              </ScoutCardTitle>
              <ScoutBadge variant="purple" size="sm">Manage</ScoutBadge>
            </ScoutCardHeader>
            <ScoutCardContent>
              <p className="text-3xl font-bold text-[var(--scout-text-heading)]">—</p>
              <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                Custom lists
              </p>
            </ScoutCardContent>
          </Link>
        </ScoutCard>

        <ScoutCard interactive>
          <Link href="/saved" className="block">
            <ScoutCardHeader>
              <ScoutCardTitle>
                <span className="flex items-center gap-2">
                  <Bookmark size={16} className="text-[var(--scout-accent-blue)]" />
                  Saved Searches
                </span>
              </ScoutCardTitle>
              <ScoutBadge variant="blue" size="sm">Saved</ScoutBadge>
            </ScoutCardHeader>
            <ScoutCardContent>
              <p className="text-3xl font-bold text-[var(--scout-text-heading)]">—</p>
              <p className="text-sm text-[var(--scout-text-muted)] mt-1">
                Saved queries
              </p>
            </ScoutCardContent>
          </Link>
        </ScoutCard>
      </div>

      {/* Design System Showcase */}
      <ScoutCard>
        <ScoutCardHeader>
          <ScoutCardTitle>
            <span className="flex items-center gap-2">
              <Target size={16} className="text-[var(--scout-accent-teal)]" />
              Design System
            </span>
          </ScoutCardTitle>
          <span className="text-meta">Phase 1</span>
        </ScoutCardHeader>
        <ScoutCardContent className="space-y-6">
          {/* Buttons */}
          <div>
            <p className="text-meta mb-3">Button Variants</p>
            <div className="flex flex-wrap items-center gap-3">
              <ScoutButton variant="primary">Primary</ScoutButton>
              <ScoutButton variant="secondary">Secondary</ScoutButton>
              <ScoutButton variant="ghost">Ghost</ScoutButton>
              <ScoutButton variant="danger">Danger</ScoutButton>
              <ScoutButton variant="muted">Muted</ScoutButton>
              <ScoutButton variant="primary" loading>Loading</ScoutButton>
            </div>
          </div>

          {/* Badges */}
          <div>
            <p className="text-meta mb-3">Badge Variants</p>
            <div className="flex flex-wrap items-center gap-2">
              <ScoutBadge variant="teal">Teal</ScoutBadge>
              <ScoutBadge variant="purple">Purple</ScoutBadge>
              <ScoutBadge variant="blue">Blue</ScoutBadge>
              <ScoutBadge variant="warning">Warning</ScoutBadge>
              <ScoutBadge variant="error">Error</ScoutBadge>
              <ScoutBadge variant="success">Success</ScoutBadge>
            </div>
          </div>

          {/* Stage Badges */}
          <div>
            <p className="text-meta mb-3">Stage Badges</p>
            <div className="flex flex-wrap items-center gap-2">
              <StageBadge stage="Pre-Seed" />
              <StageBadge stage="Seed" />
              <StageBadge stage="Series A" />
              <StageBadge stage="Series B" />
              <StageBadge stage="Series C" />
              <StageBadge stage="Growth" />
            </div>
          </div>

          {/* Colors */}
          <div>
            <p className="text-meta mb-3">Color Palette</p>
            <div className="flex gap-2">
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-bg-primary)] border border-[var(--scout-border)]" title="Primary BG" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-bg-secondary)]" title="Secondary BG" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-bg-card)]" title="Card BG" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-accent-teal)]" title="Accent Teal" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-accent-purple)]" title="Accent Purple" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-accent-blue)]" title="Accent Blue" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-warning)]" title="Warning" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-error)]" title="Error" />
              <div className="w-10 h-10 rounded-lg bg-[var(--scout-success)]" title="Success" />
            </div>
          </div>
        </ScoutCardContent>
      </ScoutCard>

      {/* Getting Started */}
      <ScoutCard>
        <ScoutCardHeader>
          <ScoutCardTitle>
            <span className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[var(--scout-accent-teal)]" />
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
                  Browse and filter the startup database
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
