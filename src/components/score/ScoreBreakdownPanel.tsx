"use client";

import React from "react";
import type { ScoreBreakdown } from "@/types/company";

/** Bar color per dimension, matching design system doc */
const dimensionConfig: {
  key: keyof Omit<ScoreBreakdown, "total" | "explanation">;
  label: string;
  weight: string;
  color: string;
}[] = [
  {
    key: "signalStrength",
    label: "Signal Strength",
    weight: "30%",
    color: "var(--scout-accent-teal)",
  },
  {
    key: "marketTiming",
    label: "Market Timing",
    weight: "25%",
    color: "var(--scout-accent-blue)",
  },
  {
    key: "thesisFit",
    label: "Thesis Fit",
    weight: "30%",
    color: "var(--scout-accent-purple)",
  },
  {
    key: "team",
    label: "Team",
    weight: "15%",
    color: "var(--scout-warning)",
  },
];

interface ScoreBreakdownPanelProps {
  breakdown: ScoreBreakdown;
}

export default function ScoreBreakdownPanel({
  breakdown,
}: ScoreBreakdownPanelProps) {
  return (
    <div className="space-y-5">
      {/* Total Score Ring */}
      <div className="flex items-center gap-4 mb-2">
        <div className="relative flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="27"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="5"
            />
            <circle
              cx="32"
              cy="32"
              r="27"
              fill="none"
              stroke="var(--scout-accent-teal)"
              strokeWidth="5"
              strokeDasharray={`${(breakdown.total / 100) * 169.6} 169.6`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute text-lg font-bold text-[var(--scout-accent-teal)]">
            {breakdown.total}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--scout-text-heading)]">
            Overall Score
          </p>
          <p className="text-xs text-[var(--scout-text-muted)]">
            Weighted composite of 4 dimensions
          </p>
        </div>
      </div>

      {/* Dimension Bars */}
      <div className="space-y-3">
        {dimensionConfig.map(({ key, label, weight, color }) => {
          const value = breakdown[key];
          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-[var(--scout-text-primary)]">
                  {label}
                  <span className="ml-1 text-[10px] text-[var(--scout-text-muted)] font-normal">
                    ({weight})
                  </span>
                </span>
                <span
                  className="text-xs font-bold tabular-nums"
                  style={{ color }}
                >
                  {value}
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${value}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}40`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation Bullets */}
      {breakdown.explanation.length > 0 && (
        <div className="pt-3 border-t border-[var(--scout-border)]">
          <p className="text-meta mb-2">Analysis</p>
          <ul className="space-y-1.5">
            {breakdown.explanation.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-[var(--scout-text-muted)]"
              >
                <span className="mt-1 w-1 h-1 rounded-full bg-[var(--scout-accent-teal)] shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
