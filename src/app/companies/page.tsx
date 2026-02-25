import { Building2 } from "lucide-react";

export default function CompaniesPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <Building2 size={22} className="text-[var(--scout-accent-teal)]" />
        <div>
          <h1 className="text-2xl font-semibold text-[var(--scout-text-heading)]">Companies</h1>
          <p className="text-sm text-[var(--scout-text-muted)]">Discover and filter startups</p>
        </div>
      </div>
      <div className="p-12 rounded-xl border border-dashed border-[var(--scout-border)] text-center">
        <p className="text-[var(--scout-text-muted)]">Companies discovery coming in Phase 2</p>
      </div>
    </div>
  );
}
