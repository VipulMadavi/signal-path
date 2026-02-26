"use client";

import React from "react";
import type { Signal, SignalType } from "@/types/company";
import {
  DollarSign,
  Users,
  Rocket,
  Newspaper,
  FileText,
  CircleDot,
} from "lucide-react";

/** Signal type → color mapping per design system doc */
const signalColors: Record<SignalType, string> = {
  Funding: "var(--scout-accent-purple)",
  Hiring: "var(--scout-accent-teal)",
  Product: "var(--scout-accent-blue)",
  Press: "var(--scout-success)",
  Patent: "var(--scout-warning)",
  Other: "var(--scout-text-muted)",
};

/** Signal type → icon mapping */
const signalIcons: Record<SignalType, React.ReactNode> = {
  Funding: <DollarSign size={14} />,
  Hiring: <Users size={14} />,
  Product: <Rocket size={14} />,
  Press: <Newspaper size={14} />,
  Patent: <FileText size={14} />,
  Other: <CircleDot size={14} />,
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface SignalTimelineProps {
  signals: Signal[];
}

export default function SignalTimeline({ signals }: SignalTimelineProps) {
  if (signals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CircleDot
          size={32}
          className="text-[var(--scout-text-muted)] opacity-30 mb-3"
        />
        <p className="text-sm text-[var(--scout-text-muted)]">
          No signals recorded yet
        </p>
        <p className="text-xs text-[var(--scout-text-muted)] opacity-60 mt-1">
          Signals will appear here as events are tracked
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical timeline line */}
      <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-white/10 via-white/6 to-transparent" />

      <div className="space-y-1">
        {signals.map((signal, idx) => {
          const color = signalColors[signal.type];
          const icon = signalIcons[signal.type];

          return (
            <div
              key={signal.id}
              className="relative flex items-start gap-4 pl-0 py-3 group"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Dot / Icon */}
              <div
                className="relative z-10 flex items-center justify-center w-[38px] h-[38px] rounded-full border-2 shrink-0 transition-all duration-200 group-hover:scale-110"
                style={{
                  borderColor: color,
                  backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
                  color,
                }}
              >
                {icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {/* Signal type label */}
                    <span
                      className="inline-block text-[10px] uppercase tracking-wider font-medium mb-1 px-1.5 py-0.5 rounded"
                      style={{
                        color,
                        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
                      }}
                    >
                      {signal.type}
                    </span>
                    {/* Title */}
                    <p className="text-sm font-medium text-[var(--scout-text-heading)] truncate">
                      {signal.title}
                    </p>
                    {/* Description */}
                    <p className="text-xs text-[var(--scout-text-muted)] mt-0.5 line-clamp-2">
                      {signal.description}
                    </p>
                  </div>

                  {/* Date — aligned right */}
                  <span className="text-xs text-[var(--scout-text-muted)] whitespace-nowrap shrink-0 pt-4">
                    {formatDate(signal.date)}
                  </span>
                </div>

                {/* Source URL */}
                {signal.sourceUrl && (
                  <a
                    href={signal.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs text-[var(--scout-accent-teal)] hover:underline mt-1 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    View Source →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
