"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Sparkles,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Clock,
  Tag,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { ScoutButton } from "@/components/ui/ScoutButton";
import { ScoutBadge } from "@/components/ui/ScoutBadge";
import type { Enrichment } from "@/types/company";

// ─── localStorage cache helpers ───
const LS_ENRICHMENT_PREFIX = "signalpath_enrichment_";

function getCachedEnrichment(companyId: string): Enrichment | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(`${LS_ENRICHMENT_PREFIX}${companyId}`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setCachedEnrichment(companyId: string, data: Enrichment): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${LS_ENRICHMENT_PREFIX}${companyId}`,
      JSON.stringify(data)
    );
  } catch {
    // Silently fail on quota errors
  }
}

// ─── State types ───
type EnrichmentState = "idle" | "loading" | "success" | "error";

interface EnrichmentPanelProps {
  companyId: string;
  companyName: string;
  websiteUrl: string;
}

export default function EnrichmentPanel({
  companyId,
  companyName,
  websiteUrl,
}: EnrichmentPanelProps) {
  const [state, setState] = useState<EnrichmentState>("idle");
  const [enrichment, setEnrichment] = useState<Enrichment | null>(null);
  const [error, setError] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);

  // Load cached enrichment on mount
  useEffect(() => {
    const cached = getCachedEnrichment(companyId);
    if (cached) {
      setEnrichment(cached);
      setState("success");
    }
  }, [companyId]);

  const handleEnrich = useCallback(async () => {
    setState("loading");
    setError("");

    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, url: websiteUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorMsg =
          response.status === 429
            ? "Rate limit exceeded. Please wait a moment and try again."
            : response.status === 504
              ? "The website took too long to respond. Try again later."
              : data.error || "Enrichment failed. Please try again.";
        setError(errorMsg);
        setState("error");
        return;
      }

      const enrichmentData: Enrichment = data.data;
      setEnrichment(enrichmentData);
      setCachedEnrichment(companyId, enrichmentData);
      setState("success");
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setState("error");
    }
  }, [companyId, websiteUrl]);

  // Format timestamp
  const formatTimestamp = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-0">
      {/* ═══ Header ═══ */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--scout-accent-purple)]" />
          <h3 className="text-sm font-medium text-[var(--scout-text-heading)]">
            Live Enrichment
          </h3>
          {state === "success" && (
            <span className="flex items-center gap-1 text-[10px] text-[var(--scout-success)]">
              <CheckCircle2 size={10} />
              Enriched
            </span>
          )}
        </div>
        {state === "success" && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-white/[0.06] text-[var(--scout-text-muted)] transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* ═══ IDLE State ═══ */}
      {state === "idle" && (
        <div className="space-y-3 fade-in">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--scout-accent-purple)]/5 border border-[var(--scout-accent-purple)]/10">
            <Lightbulb size={14} className="text-[var(--scout-accent-purple)] shrink-0" />
            <p className="text-xs text-[var(--scout-text-muted)]">
              Enrich <span className="text-[var(--scout-text-primary)] font-medium">{companyName}</span> by
              scanning their website for venture-relevant intelligence.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--scout-text-muted)]">
            <Globe size={12} />
            <span className="truncate">{websiteUrl}</span>
          </div>

          <ScoutButton
            variant="primary"
            size="sm"
            onClick={handleEnrich}
            className="w-full"
          >
            <Sparkles size={14} />
            Enrich from Website
          </ScoutButton>
        </div>
      )}

      {/* ═══ LOADING State ═══ */}
      {state === "loading" && (
        <div className="space-y-4 fade-in">
          {/* Animated loading indicator */}
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[var(--scout-accent-purple)]/20 animate-ping" />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[var(--scout-accent-purple)]/10">
                <Loader2
                  size={24}
                  className="text-[var(--scout-accent-purple)] animate-spin"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--scout-text-heading)]">
                Enriching {companyName}...
              </p>
              <p className="text-xs text-[var(--scout-text-muted)] mt-1">
                Fetching and analyzing website content
              </p>
            </div>
          </div>

          {/* Loading skeleton */}
          <div className="space-y-3">
            <div className="h-3 rounded bg-white/[0.04] shimmer" />
            <div className="h-3 rounded bg-white/[0.04] shimmer w-4/5" />
            <div className="h-3 rounded bg-white/[0.04] shimmer w-3/5" />
            <div className="flex gap-2 mt-4">
              <div className="h-6 w-16 rounded-full bg-white/[0.04] shimmer" />
              <div className="h-6 w-20 rounded-full bg-white/[0.04] shimmer" />
              <div className="h-6 w-14 rounded-full bg-white/[0.04] shimmer" />
            </div>
          </div>
        </div>
      )}

      {/* ═══ ERROR State ═══ */}
      {state === "error" && (
        <div className="space-y-3 fade-in">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--scout-error)]/5 border border-[var(--scout-error)]/10">
            <AlertCircle
              size={16}
              className="text-[var(--scout-error)] shrink-0 mt-0.5"
            />
            <div>
              <p className="text-xs font-medium text-[var(--scout-error)]">
                Enrichment Failed
              </p>
              <p className="text-xs text-[var(--scout-text-muted)] mt-1">
                {error}
              </p>
            </div>
          </div>

          <ScoutButton
            variant="secondary"
            size="sm"
            onClick={handleEnrich}
            className="w-full"
          >
            <RefreshCw size={14} />
            Try Again
          </ScoutButton>
        </div>
      )}

      {/* ═══ SUCCESS State ═══ */}
      {state === "success" && enrichment && isExpanded && (
        <div className="space-y-4 fade-in">
          {/* Summary */}
          <div className="space-y-1.5">
            <p className="text-meta flex items-center gap-1.5">
              <Lightbulb size={11} />
              Summary
            </p>
            <p className="text-sm text-[var(--scout-text-primary)] leading-relaxed">
              {enrichment.summary}
            </p>
          </div>

          {/* What They Do */}
          {enrichment.whatTheyDo.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-meta flex items-center gap-1.5">
                <Globe size={11} />
                What They Do
              </p>
              <ul className="space-y-1.5">
                {enrichment.whatTheyDo.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[var(--scout-text-primary)]"
                  >
                    <span className="inline-block w-1 h-1 rounded-full bg-[var(--scout-accent-teal)] mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Keywords */}
          {enrichment.keywords.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-meta flex items-center gap-1.5">
                <Tag size={11} />
                Keywords
              </p>
              <div className="flex flex-wrap gap-1.5">
                {enrichment.keywords.map((keyword, i) => (
                  <ScoutBadge key={i} variant="default" size="sm">
                    {keyword}
                  </ScoutBadge>
                ))}
              </div>
            </div>
          )}

          {/* Derived Signals */}
          {enrichment.derivedSignals.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-meta flex items-center gap-1.5">
                <Zap size={11} />
                Derived Signals
              </p>
              <div className="space-y-1.5">
                {enrichment.derivedSignals.map((signal, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--scout-accent-teal)]/5 border border-[var(--scout-accent-teal)]/10"
                  >
                    <Zap
                      size={12}
                      className="text-[var(--scout-accent-teal)] shrink-0"
                    />
                    <span className="text-xs text-[var(--scout-text-primary)]">
                      {signal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {enrichment.sources.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-meta flex items-center gap-1.5">
                <ExternalLink size={11} />
                Sources
              </p>
              <div className="space-y-1">
                {enrichment.sources.map((source, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-[var(--scout-border)]"
                  >
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--scout-accent-blue)] hover:underline truncate mr-2"
                    >
                      {source.title || source.url}
                    </a>
                    <span className="text-[10px] text-[var(--scout-text-muted)] whitespace-nowrap">
                      {formatTimestamp(source.scrapedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp + Re-enrich */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--scout-border)]">
            <span className="flex items-center gap-1.5 text-[10px] text-[var(--scout-text-muted)]">
              <Clock size={10} />
              Enriched {formatTimestamp(enrichment.scrapedAt)}
            </span>
            <ScoutButton variant="ghost" size="sm" onClick={handleEnrich}>
              <RefreshCw size={12} />
              Re-enrich
            </ScoutButton>
          </div>
        </div>
      )}
    </div>
  );
}
