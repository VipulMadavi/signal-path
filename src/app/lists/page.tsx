"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ListChecks,
  Plus,
  Trash2,
  Download,
  FileJson,
  FileSpreadsheet,
  X,
  Building2,
  Calendar,
  ExternalLink,
  MoreVertical,
  Edit3,
  FolderOpen,
} from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import {
  ScoutCard,
} from "@/components/ui/ScoutCard";
import { ScoutBadge, StageBadge } from "@/components/ui/ScoutBadge";
import { useListStore } from "@/store/useListStore";
import { getScoredCompanies } from "@/lib/mock-companies";
import type { Company, VCList } from "@/types/company";
import Link from "next/link";
import { toast } from "sonner";

// ─── Create List Modal ───
function CreateListModalContent({
  onClose,
}: {
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createList = useListStore((s) => s.createList);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createList(name.trim(), description.trim() || undefined);
    toast.success('List created!');
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl w-full max-w-md pointer-events-auto fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--scout-border)]">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--scout-accent-purple)]/10">
                <Plus size={16} className="text-[var(--scout-accent-purple)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--scout-text-heading)]">
                  Create New List
                </h3>
                <p className="text-xs text-[var(--scout-text-muted)]">
                  Organize companies into curated groups
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-meta mb-2">List Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Top AI Picks Q1 2026"
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-meta mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this list for?"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all resize-none"
              />
            </div>
            <div className="flex items-center gap-3 justify-end pt-1">
              <ScoutButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </ScoutButton>
              <ScoutButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={!name.trim()}
              >
                <Plus size={14} />
                Create List
              </ScoutButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Edit List Modal ───
function EditListModalContent({
  list,
  onClose,
}: {
  list: VCList;
  onClose: () => void;
}) {
  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description || "");
  const updateList = useListStore((s) => s.updateList);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateList(list.id, {
      name: name.trim(),
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl w-full max-w-md pointer-events-auto fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--scout-border)]">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--scout-accent-blue)]/10">
                <Edit3
                  size={16}
                  className="text-[var(--scout-accent-blue)]"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--scout-text-heading)]">
                  Edit List
                </h3>
                <p className="text-xs text-[var(--scout-text-muted)]">
                  Update list details
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-meta mb-2">List Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="List name"
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-meta mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this list for?"
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-secondary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/40 focus:ring-1 focus:ring-[var(--scout-accent-teal)]/20 transition-all resize-none"
              />
            </div>
            <div className="flex items-center gap-3 justify-end pt-1">
              <ScoutButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                Cancel
              </ScoutButton>
              <ScoutButton
                type="submit"
                variant="primary"
                size="sm"
                disabled={!name.trim()}
              >
                Save Changes
              </ScoutButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Delete Confirmation Modal ───
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  listName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listName: string;
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
                  Delete List
                </h3>
                <p className="text-xs text-[var(--scout-text-muted)]">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--scout-text-primary)] mb-5">
              Are you sure you want to delete{" "}
              <span className="font-medium text-[var(--scout-error)]">
                &quot;{listName}&quot;
              </span>
              ? All associated company assignments will be removed.
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

// ─── Export Helpers ───
function exportAsCSV(list: VCList, companies: Company[]) {
  const headers = [
    "Name",
    "Website",
    "Sector",
    "Stage",
    "Country",
    "City",
    "Score",
    "Raised Amount",
    "Founded Year",
  ];
  const rows = companies.map((c) => [
    c.name,
    c.website,
    c.sector,
    c.stage,
    c.country,
    c.city || "",
    String(c.score),
    c.raisedAmount ? String(c.raisedAmount) : "",
    c.foundedYear ? String(c.foundedYear) : "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${list.name.replace(/[^a-zA-Z0-9]/g, "_")}_export.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAsJSON(list: VCList, companies: Company[]) {
  const data = {
    listName: list.name,
    description: list.description || null,
    exportedAt: new Date().toISOString(),
    companiesCount: companies.length,
    companies: companies.map((c) => ({
      id: c.id,
      name: c.name,
      website: c.website,
      sector: c.sector,
      stage: c.stage,
      country: c.country,
      city: c.city || null,
      score: c.score,
      raisedAmount: c.raisedAmount || null,
      foundedYear: c.foundedYear || null,
      tags: c.tags || [],
    })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${list.name.replace(/[^a-zA-Z0-9]/g, "_")}_export.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Format helpers ───
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRaised(amount?: number): string {
  if (!amount) return "—";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

// ─── Expanded List Card ───
function ListDetailCard({
  list,
  onEdit,
  onDelete,
}: {
  list: VCList;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const removeCompanyFromList = useListStore((s) => s.removeCompanyFromList);

  // Resolve company objects from IDs
  const listCompanies = useMemo(
    () =>
      list.companyIds
        .map((id) => getScoredCompanies().find((c) => c.id === id))
        .filter((c): c is Company => c !== undefined),
    [list.companyIds]
  );

  return (
    <ScoutCard className="overflow-hidden transition-all duration-200 card-hover">
      {/* List Header */}
      <div className="flex items-start justify-between">
        <button
          className="flex-1 text-left cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--scout-accent-purple)]/10 group-hover:bg-[var(--scout-accent-purple)]/15 transition-colors">
              <ListChecks
                size={18}
                className="text-[var(--scout-accent-purple)]"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--scout-text-heading)] group-hover:text-[var(--scout-accent-teal)] transition-colors">
                {list.name}
              </h3>
              {list.description && (
                <p className="text-xs text-[var(--scout-text-muted)] mt-0.5 line-clamp-1">
                  {list.description}
                </p>
              )}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1">
          {/* Company count badge */}
          <ScoutBadge variant="default" size="sm" className="mr-2">
            {list.companyIds.length}{" "}
            {list.companyIds.length === 1 ? "company" : "companies"}
          </ScoutBadge>

          {/* Actions menu */}
          <div className="relative">
            <ScoutButton
              variant="muted"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="List actions menu"
            >
              <MoreVertical size={14} />
            </ScoutButton>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-10 z-50 w-48 bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl py-1 fade-in">
                  <button
                    onClick={() => {
                      onEdit();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-colors cursor-pointer"
                  >
                    <Edit3 size={14} className="text-[var(--scout-text-muted)]" />
                    Edit List
                  </button>
                  <button
                    onClick={() => {
                      exportAsCSV(list, listCompanies);
                      toast.success('Exported as CSV');
                      setShowMenu(false);
                    }}
                    disabled={listCompanies.length === 0}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FileSpreadsheet
                      size={14}
                      className="text-[var(--scout-success)]"
                    />
                    Export CSV
                  </button>
                  <button
                    onClick={() => {
                      exportAsJSON(list, listCompanies);
                      toast.success('Exported as JSON');
                      setShowMenu(false);
                    }}
                    disabled={listCompanies.length === 0}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--scout-text-primary)] hover:bg-white/[0.04] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FileJson
                      size={14}
                      className="text-[var(--scout-accent-blue)]"
                    />
                    Export JSON
                  </button>
                  <div className="my-1 border-t border-[var(--scout-border)]" />
                  <button
                    onClick={() => {
                      onDelete();
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--scout-error)] hover:bg-[var(--scout-error)]/5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Delete List
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-4 mt-3 text-xs text-[var(--scout-text-muted)]">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          Created {formatDate(list.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          Updated {formatDate(list.updatedAt)}
        </span>
      </div>

      {/* Expanded: Company list */}
      {isExpanded && (
        <div className="mt-4 border-t border-[var(--scout-border)] pt-4 fade-in">
          {listCompanies.length === 0 ? (
            <div className="py-6 text-center">
              <FolderOpen
                size={24}
                className="mx-auto text-[var(--scout-text-muted)] opacity-30 mb-2"
              />
              <p className="text-xs text-[var(--scout-text-muted)]">
                No companies in this list yet.
              </p>
              <p className="text-xs text-[var(--scout-text-muted)] mt-1">
                Add companies from the{" "}
                <Link
                  href="/companies"
                  className="text-[var(--scout-accent-teal)] hover:underline"
                >
                  Companies
                </Link>{" "}
                page.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Mobile-friendly Table Header */}
              <div className="hidden md:grid grid-cols-[1fr_100px_100px_90px_80px_40px] gap-3 px-3 py-2 text-meta">
                <span>Company</span>
                <span>Sector</span>
                <span>Stage</span>
                <span>Score</span>
                <span>Raised</span>
                <span></span>
              </div>
              {listCompanies.map((company) => (
                <div
                  key={company.id}
                  className="group grid grid-cols-1 md:grid-cols-[1fr_100px_100px_90px_80px_40px] gap-3 items-center px-3 py-2.5 rounded-lg border border-[var(--scout-border)] hover:border-white/10 hover:bg-white/[0.02] transition-all"
                >
                  {/* Company name + link */}
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2
                      size={14}
                      className="text-[var(--scout-text-muted)] shrink-0"
                    />
                    <Link
                      href={`/companies/${company.id}`}
                      className="text-sm font-medium text-[var(--scout-text-heading)] hover:text-[var(--scout-accent-teal)] transition-colors truncate"
                    >
                      {company.name}
                    </Link>
                    <ExternalLink
                      size={12}
                      className="text-[var(--scout-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                  </div>

                  {/* Sector */}
                  <span className="text-xs text-[var(--scout-text-muted)] truncate">
                    {company.sector}
                  </span>

                  {/* Stage */}
                  <StageBadge stage={company.stage} />

                  {/* Score */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${company.score}%`,
                          backgroundColor:
                            company.score >= 80
                              ? "var(--scout-accent-teal)"
                              : company.score >= 60
                              ? "var(--scout-warning)"
                              : "var(--scout-error)",
                        }}
                      />
                    </div>
                    <span className="text-xs text-[var(--scout-text-primary)] font-medium tabular-nums">
                      {company.score}
                    </span>
                  </div>

                  {/* Raised */}
                  <span className="text-xs text-[var(--scout-text-muted)] tabular-nums">
                    {formatRaised(company.raisedAmount)}
                  </span>

                  {/* Remove button */}
                  <button
                    onClick={() =>
                      removeCompanyFromList(list.id, company.id)
                    }
                    className="p-1 rounded-md hover:bg-[var(--scout-error)]/10 text-[var(--scout-text-muted)] hover:text-[var(--scout-error)] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title="Remove from list"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick export buttons at bottom when expanded */}
          {listCompanies.length > 0 && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--scout-border)]">
              <span className="text-xs text-[var(--scout-text-muted)] mr-auto">
                {listCompanies.length}{" "}
                {listCompanies.length === 1 ? "company" : "companies"}
              </span>
              <ScoutButton
                variant="muted"
                size="sm"
                onClick={() => exportAsCSV(list, listCompanies)}
              >
                <FileSpreadsheet size={13} />
                CSV
              </ScoutButton>
              <ScoutButton
                variant="muted"
                size="sm"
                onClick={() => exportAsJSON(list, listCompanies)}
              >
                <FileJson size={13} />
                JSON
              </ScoutButton>
            </div>
          )}
        </div>
      )}
    </ScoutCard>
  );
}

// ─── Main Page ───
export default function ListsPage() {
  const { lists, loadListsFromStorage, deleteList } = useListStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingList, setEditingList] = useState<VCList | null>(null);
  const [deletingList, setDeletingList] = useState<VCList | null>(null);

  // Load lists from localStorage on mount
  useEffect(() => {
    loadListsFromStorage();
  }, [loadListsFromStorage]);

  // Summary stats
  const totalCompanies = useMemo(() => {
    const uniqueIds = new Set(lists.flatMap((l) => l.companyIds));
    return uniqueIds.size;
  }, [lists]);

  return (
    <div className="space-y-6 fade-in animate-fadeInUp">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--scout-accent-purple)]/10 flex-shrink-0">
            <ListChecks
              size={20}
              className="text-[var(--scout-accent-purple)]"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[var(--scout-text-heading)]">
              Lists
            </h1>
            <p className="text-sm text-[var(--scout-text-muted)]">
              Organize companies into custom lists
            </p>
          </div>
        </div>

        <ScoutButton
          variant="primary"
          size="md"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus size={16} />
          New List
        </ScoutButton>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoutCard className="!p-4">
          <p className="text-meta mb-1">Total Lists</p>
          <p className="text-2xl font-semibold text-[var(--scout-text-heading)] tabular-nums">
            {lists.length}
          </p>
        </ScoutCard>
        <ScoutCard className="!p-4">
          <p className="text-meta mb-1">Unique Companies</p>
          <p className="text-2xl font-semibold text-[var(--scout-accent-teal)] tabular-nums">
            {totalCompanies}
          </p>
        </ScoutCard>
        <ScoutCard className="!p-4">
          <p className="text-meta mb-1">Quick Export</p>
          <div className="flex items-center gap-2 mt-1">
            <ScoutButton
              variant="muted"
              size="sm"
              disabled={lists.length === 0}
              onClick={() => {
                // Export all lists as one JSON
                const allCompanyIds = [
                  ...new Set(lists.flatMap((l) => l.companyIds)),
                ];
                const allCompanies = allCompanyIds
                  .map((id) => getScoredCompanies().find((c) => c.id === id))
                  .filter((c): c is Company => c !== undefined);
                const allList: VCList = {
                  id: "all",
                  name: "All Lists",
                  companyIds: allCompanyIds,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                exportAsJSON(allList, allCompanies);
              }}
            >
              <Download size={13} />
              All JSON
            </ScoutButton>
          </div>
        </ScoutCard>
      </div>

      {/* Lists Grid */}
      {lists.length === 0 ? (
        <ScoutCard className="!py-16 text-center">
          <FolderOpen
            size={40}
            className="mx-auto text-[var(--scout-text-muted)] opacity-20 mb-4"
          />
          <h3 className="text-base font-medium text-[var(--scout-text-heading)] mb-2">
            No lists yet
          </h3>
          <p className="text-sm text-[var(--scout-text-muted)] mb-6 max-w-sm mx-auto">
            Create your first list to start organizing companies. You can add
            companies from the Companies page or from individual company
            profiles.
          </p>
          <ScoutButton
            variant="primary"
            size="md"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={16} />
            Create Your First List
          </ScoutButton>
        </ScoutCard>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <ListDetailCard
              key={list.id}
              list={list}
              onEdit={() => setEditingList(list)}
              onDelete={() => setDeletingList(list)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateListModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditListModal
        list={editingList}
        isOpen={editingList !== null}
        onClose={() => setEditingList(null)}
      />
      <DeleteConfirmModal
        isOpen={deletingList !== null}
        onClose={() => setDeletingList(null)}
        onConfirm={() => {
          if (deletingList) {
            deleteList(deletingList.id);
            toast.success('List deleted');
            setDeletingList(null);
          }
        }}
        listName={deletingList?.name || ""}
      />
    </div>
  );
}

function CreateListModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return <CreateListModalContent onClose={onClose} />;
}

function EditListModal({
  list,
  isOpen,
  onClose,
}: {
  list: VCList | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !list) return null;
  return <EditListModalContent list={list} onClose={onClose} />;
}

