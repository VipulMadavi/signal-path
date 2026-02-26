"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Check, List as ListIcon } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import { useListStore } from "@/store/useListStore";

interface SaveToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
}

export default function SaveToListModal({
  isOpen,
  onClose,
  companyId,
  companyName,
}: SaveToListModalProps) {
  const {
    lists,
    loadListsFromStorage,
    createList,
    addCompanyToList,
    removeCompanyFromList,
  } = useListStore();

  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDesc, setNewListDesc] = useState("");

  // Load lists on open
  useEffect(() => {
    if (isOpen) {
      loadListsFromStorage();
    }
  }, [isOpen, loadListsFromStorage]);

  if (!isOpen) return null;

  const handleCreateAndAdd = () => {
    if (!newListName.trim()) return;
    const list = createList(newListName.trim(), newListDesc.trim() || undefined);
    addCompanyToList(list.id, companyId);
    setNewListName("");
    setNewListDesc("");
    setIsCreating(false);
  };

  const handleToggle = (listId: string, isInList: boolean) => {
    if (isInList) {
      removeCompanyFromList(listId, companyId);
    } else {
      addCompanyToList(listId, companyId);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-[var(--scout-bg-card)] border border-[var(--scout-border)] rounded-xl shadow-2xl w-full max-w-md pointer-events-auto fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--scout-border)]">
            <div>
              <h3 className="text-sm font-semibold text-[var(--scout-text-heading)]">
                Save to List
              </h3>
              <p className="text-xs text-[var(--scout-text-muted)] mt-0.5">
                Add <span className="text-[var(--scout-accent-teal)]">{companyName}</span> to a list
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--scout-text-muted)] hover:text-[var(--scout-text-primary)] transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Lists */}
          <div className="px-5 py-4 max-h-[300px] overflow-y-auto space-y-2">
            {lists.length === 0 && !isCreating && (
              <div className="py-6 text-center">
                <ListIcon
                  size={24}
                  className="mx-auto text-[var(--scout-text-muted)] opacity-30 mb-2"
                />
                <p className="text-xs text-[var(--scout-text-muted)]">
                  No lists yet. Create one to get started.
                </p>
              </div>
            )}

            {lists.map((list) => {
              const isInList = list.companyIds.includes(companyId);
              return (
                <button
                  key={list.id}
                  onClick={() => handleToggle(list.id, isInList)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    isInList
                      ? "border-[var(--scout-accent-teal)]/30 bg-[var(--scout-accent-teal)]/5"
                      : "border-[var(--scout-border)] hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-md border-2 transition-all ${
                      isInList
                        ? "border-[var(--scout-accent-teal)] bg-[var(--scout-accent-teal)]"
                        : "border-white/20"
                    }`}
                  >
                    {isInList && (
                      <Check size={14} className="text-[var(--scout-bg-primary)]" />
                    )}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--scout-text-heading)] truncate">
                      {list.name}
                    </p>
                    <p className="text-[10px] text-[var(--scout-text-muted)]">
                      {list.companyIds.length} {list.companyIds.length === 1 ? "company" : "companies"}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Create New List inline */}
            {isCreating && (
              <div className="p-3 rounded-lg border border-[var(--scout-accent-teal)]/20 bg-[var(--scout-accent-teal)]/5 space-y-2 fade-in">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-primary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/30"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateAndAdd();
                    if (e.key === "Escape") setIsCreating(false);
                  }}
                />
                <input
                  type="text"
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Description (optional)..."
                  className="w-full px-3 py-2 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-primary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/30"
                />
                <div className="flex gap-2 justify-end">
                  <ScoutButton
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false);
                      setNewListName("");
                      setNewListDesc("");
                    }}
                  >
                    Cancel
                  </ScoutButton>
                  <ScoutButton
                    variant="primary"
                    size="sm"
                    onClick={handleCreateAndAdd}
                    disabled={!newListName.trim()}
                  >
                    Create & Add
                  </ScoutButton>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[var(--scout-border)] flex items-center justify-between">
            <ScoutButton
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(true)}
              disabled={isCreating}
            >
              <Plus size={14} />
              New List
            </ScoutButton>
            <ScoutButton variant="secondary" size="sm" onClick={onClose}>
              Done
            </ScoutButton>
          </div>
        </div>
      </div>
    </>
  );
}
