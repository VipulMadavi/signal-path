import { ListChecks } from "lucide-react";

export default function ListsPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center gap-3">
        <ListChecks size={22} className="text-[var(--scout-accent-purple)]" />
        <div>
          <h1 className="text-2xl font-semibold text-[var(--scout-text-heading)]">Lists</h1>
          <p className="text-sm text-[var(--scout-text-muted)]">Organize companies into custom lists</p>
        </div>
      </div>
      <div className="p-12 rounded-xl border border-dashed border-[var(--scout-border)] text-center">
        <p className="text-[var(--scout-text-muted)]">Lists management coming in Phase 4</p>
      </div>
    </div>
  );
}
