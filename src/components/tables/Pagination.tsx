"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-[var(--scout-text-muted)]">
        Showing{" "}
        <span className="font-medium text-[var(--scout-text-primary)]">
          {startItem}–{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[var(--scout-text-primary)]">
          {totalItems}
        </span>{" "}
        companies
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-[var(--scout-border)] text-[var(--scout-text-muted)] hover:bg-white/[0.04] hover:text-[var(--scout-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-[var(--scout-text-muted)] text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                ${
                  currentPage === page
                    ? "bg-[var(--scout-accent-teal)]/15 text-[var(--scout-accent-teal)] border border-[var(--scout-accent-teal)]/30"
                    : "text-[var(--scout-text-muted)] hover:bg-white/[0.04] hover:text-[var(--scout-text-primary)] border border-transparent"
                }
              `}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-[var(--scout-border)] text-[var(--scout-text-muted)] hover:bg-white/[0.04] hover:text-[var(--scout-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
