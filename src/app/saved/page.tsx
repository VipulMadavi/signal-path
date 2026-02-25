import { Bookmark } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <Bookmark size={22} className="text-[var(--scout-accent-blue)]" />
        <div>
          <h1 className="text-2xl font-semibold text-[var(--scout-text-heading)]">Saved Searches</h1>
          <p className="text-sm text-[var(--scout-text-muted)]">Re-run your saved queries</p>
        </div>
      </div>
      <div className="p-12 rounded-xl border border-dashed border-[var(--scout-border)] text-center">
        <p className="text-[var(--scout-text-muted)]">Saved searches coming in Phase 4</p>
      </div>
    </div>
  );
}
