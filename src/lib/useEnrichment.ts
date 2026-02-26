"use client";

// ─── useEnrichment Hook ───
// React Query hook for managing enrichment server state with caching

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { AIProvider, Enrichment, EnrichmentCacheEntry } from "@/types/enrichment";

// ─── localStorage enrichment cache ───
const LS_ENRICHMENT_CACHE_KEY = "signalpath_enrichment_cache";

// ─── Get all cached enrichments ───
function getEnrichmentCache(): Record<string, EnrichmentCacheEntry> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(LS_ENRICHMENT_CACHE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

// ─── Get single cached enrichment by companyId ───
export function getCachedEnrichment(companyId: string): EnrichmentCacheEntry | null {
  const cache = getEnrichmentCache();
  return cache[companyId] || null;
}

// ─── Store enrichment in cache ───
export function setCachedEnrichment(
  companyId: string,
  data: Enrichment,
  provider: AIProvider
): void {
  if (typeof window === "undefined") return;
  try {
    const cache = getEnrichmentCache();
    cache[companyId] = {
      data: { ...data, provider, cached: true },
      cachedAt: new Date().toISOString(),
      provider,
    };
    localStorage.setItem(LS_ENRICHMENT_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // silently fail on storage quota errors
  }
}

// ─── Clear enrichment cache for a company ───
export function clearCachedEnrichment(companyId: string): void {
  if (typeof window === "undefined") return;
  try {
    const cache = getEnrichmentCache();
    delete cache[companyId];
    localStorage.setItem(LS_ENRICHMENT_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // silently fail
  }
}

// ─── API call to enrich ───
async function fetchEnrichment(params: {
  companyId: string;
  url: string;
  provider?: AIProvider;
}): Promise<{ data: Enrichment; provider: AIProvider; cached: boolean }> {
  const response = await fetch("/api/enrich", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    const errorMsg =
      response.status === 429
        ? "Rate limit exceeded. Please wait a moment and try again."
        : response.status === 504
          ? "The website took too long to respond. Try again later."
          : result.error || "Enrichment failed. Please try again.";
    throw new Error(errorMsg);
  }

  return {
    data: result.data as Enrichment,
    provider: result.provider || params.provider || "openai",
    cached: result.cached || false,
  };
}

// ─── useEnrichment Hook ───
export function useEnrichment(companyId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["enrichment", companyId],
    mutationFn: (params: { url: string; provider?: AIProvider; skipCache?: boolean }) =>
      fetchEnrichment({
        companyId,
        url: params.url,
        provider: params.provider,
      }),
    onSuccess: (result) => {
      // Store in localStorage cache
      setCachedEnrichment(companyId, result.data, result.provider);
      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ["enrichment", companyId] });
    },
  });

  const enrich = useCallback(
    (url: string, provider?: AIProvider, skipCache?: boolean) => {
      // Check cache first (unless explicitly skipped)
      if (!skipCache) {
        const cached = getCachedEnrichment(companyId);
        if (cached) {
          return Promise.resolve({
            data: cached.data,
            provider: cached.provider,
            cached: true,
          });
        }
      }
      return mutation.mutateAsync({ url, provider, skipCache });
    },
    [companyId, mutation]
  );

  return {
    enrich,
    mutate: mutation.mutate,
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    reset: mutation.reset,
  };
}
