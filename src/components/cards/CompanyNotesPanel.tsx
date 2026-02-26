"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { CompanyNote } from "@/types/company";
import { StickyNote, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";

const LS_NOTES_KEY = "signalpath_notes";

// ─── LocalStorage helpers ───
function loadNotes(): CompanyNote[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(LS_NOTES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function persistNotes(notes: CompanyNote[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_NOTES_KEY, JSON.stringify(notes));
  } catch {
    // silently fail on storage quota errors
  }
}

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ─── Component ───
interface NotesProps {
  companyId: string;
}

export default function CompanyNotesPanel({ companyId }: NotesProps) {
  const [notes, setNotes] = useState<CompanyNote[]>([]);
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Load notes for this company on mount
  useEffect(() => {
    const allNotes = loadNotes();
    setNotes(allNotes.filter((n) => n.companyId === companyId));
  }, [companyId]);

  // ─── Save a new note ───
  const handleAdd = useCallback(() => {
    if (!newContent.trim()) return;

    const note: CompanyNote = {
      id: generateId(),
      companyId,
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
    };

    const allNotes = loadNotes();
    const updated = [note, ...allNotes];
    persistNotes(updated);
    setNotes(updated.filter((n) => n.companyId === companyId));
    setNewContent("");
    setIsAdding(false);
  }, [newContent, companyId]);

  // ─── Delete a note ───
  const handleDelete = useCallback(
    (noteId: string) => {
      const allNotes = loadNotes();
      const updated = allNotes.filter((n) => n.id !== noteId);
      persistNotes(updated);
      setNotes(updated.filter((n) => n.companyId === companyId));
    },
    [companyId]
  );

  // ─── Start editing ───
  const startEdit = (note: CompanyNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  // ─── Save edit ───
  const saveEdit = useCallback(() => {
    if (!editingId || !editContent.trim()) return;

    const allNotes = loadNotes();
    const updated = allNotes.map((n) =>
      n.id === editingId
        ? { ...n, content: editContent.trim(), updatedAt: new Date().toISOString() }
        : n
    );
    persistNotes(updated);
    setNotes(updated.filter((n) => n.companyId === companyId));
    setEditingId(null);
    setEditContent("");
  }, [editingId, editContent, companyId]);

  // ─── Cancel edit ───
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  // ─── Format date ───
  function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-4">
      {/* Header + Add Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote
            size={14}
            className="text-[var(--scout-accent-teal)]"
          />
          <span className="text-xs font-medium text-[var(--scout-text-primary)]">
            Notes ({notes.length})
          </span>
        </div>
        {!isAdding && (
          <ScoutButton
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={12} />
            Add Note
          </ScoutButton>
        )}
      </div>

      {/* Add Note Input */}
      {isAdding && (
        <div className="space-y-2 fade-in">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write a note about this company..."
            className="w-full p-3 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-primary)] text-sm text-[var(--scout-text-primary)] placeholder:text-[var(--scout-text-muted)]/50 focus:outline-none focus:border-[var(--scout-accent-teal)]/30 resize-none min-h-[80px]"
            autoFocus
          />
          <div className="flex items-center gap-2 justify-end">
            <ScoutButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsAdding(false);
                setNewContent("");
              }}
            >
              Cancel
            </ScoutButton>
            <ScoutButton
              variant="primary"
              size="sm"
              onClick={handleAdd}
              disabled={!newContent.trim()}
            >
              Save Note
            </ScoutButton>
          </div>
        </div>
      )}

      {/* Notes List */}
      {notes.length === 0 && !isAdding ? (
        <div className="py-6 text-center">
          <p className="text-xs text-[var(--scout-text-muted)] opacity-60">
            No notes yet. Click &quot;Add Note&quot; to start.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group relative p-3 rounded-lg border border-[var(--scout-border)] bg-[var(--scout-bg-primary)]/50 hover:border-white/10 transition-all fade-in"
            >
              {editingId === note.id ? (
                /* Edit mode */
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[var(--scout-accent-teal)]/30 bg-[var(--scout-bg-primary)] text-sm text-[var(--scout-text-primary)] focus:outline-none resize-none min-h-[60px]"
                    autoFocus
                  />
                  <div className="flex items-center gap-1 justify-end">
                    <ScoutButton
                      variant="muted"
                      size="sm"
                      onClick={cancelEdit}
                    >
                      <X size={12} />
                    </ScoutButton>
                    <ScoutButton
                      variant="primary"
                      size="sm"
                      onClick={saveEdit}
                    >
                      <Check size={12} />
                    </ScoutButton>
                  </div>
                </div>
              ) : (
                /* View mode */
                <>
                  <p className="text-sm text-[var(--scout-text-primary)] whitespace-pre-wrap pr-14">
                    {note.content}
                  </p>
                  <p className="text-[10px] text-[var(--scout-text-muted)] mt-2">
                    {formatDate(note.updatedAt || note.createdAt)}
                    {note.updatedAt && " (edited)"}
                  </p>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(note)}
                      className="p-1.5 rounded-md hover:bg-white/[0.06] text-[var(--scout-text-muted)] hover:text-[var(--scout-accent-teal)] transition-colors cursor-pointer"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1.5 rounded-md hover:bg-[var(--scout-error)]/10 text-[var(--scout-text-muted)] hover:text-[var(--scout-error)] transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
