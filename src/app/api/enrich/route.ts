import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  validateUrl,
  fetchWebsite,
  extractTextFromHtml,
  detectDerivedSignals,
  parseLlmResponse,
} from "@/lib/enrichment";

// ─── Rate Limiter (in-memory, per IP) ───
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// ─── Server-side cache (in-memory, TTL 10 min) ───
const enrichmentCache = new Map<
  string,
  { data: Record<string, unknown>; cachedAt: number }
>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// ─── LLM Prompt ───
const SYSTEM_PROMPT = `You are an intelligence extraction engine. Extract structured venture-relevant information from the provided website text. Return only valid JSON. No commentary. No markdown.`;

function buildUserPrompt(cleanedText: string): string {
  return `Website content:

${cleanedText}

Return strictly in this format:
{
  "summary": "1-2 sentence summary of the company",
  "whatTheyDo": ["bullet1", "bullet2", "bullet3"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "derivedSignals": ["signal1", "signal2"]
}

No commentary. No markdown. Only valid JSON.`;
}

// ─── POST /api/enrich ───
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // ── Rate limiting ──
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Max 5 requests per minute." },
        { status: 429 }
      );
    }

    // ── Parse request body ──
    let body: { companyId?: string; url?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { companyId, url } = body;

    // ── Validate companyId ──
    if (!companyId || typeof companyId !== "string") {
      return NextResponse.json(
        { success: false, error: "companyId is required." },
        { status: 400 }
      );
    }

    // ── Validate URL ──
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "url is required." },
        { status: 400 }
      );
    }

    const urlValidation = validateUrl(url);
    if (!urlValidation.valid) {
      return NextResponse.json(
        { success: false, error: urlValidation.reason },
        { status: 400 }
      );
    }

    // ── Check server-side cache ──
    const cacheKey = `${companyId}:${url}`;
    const cached = enrichmentCache.get(cacheKey);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
      console.log(`[Enrich] Cache hit for ${companyId}`);
      return NextResponse.json({ success: true, data: cached.data });
    }

    // ── Check for API key ──
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
      // Fallback: return a mock enrichment response for demo purposes
      console.log(`[Enrich] No API key configured, returning mock enrichment for ${companyId}`);
      const mockData = generateMockEnrichment(companyId, url);
      return NextResponse.json({ success: true, data: mockData });
    }

    console.log(`[Enrich] Starting enrichment for ${companyId} — ${url}`);

    // ── Step 1: Fetch website ──
    let html: string;
    let finalUrl: string;
    try {
      const fetchResult = await fetchWebsite(url, 10_000);
      html = fetchResult.html;
      finalUrl = fetchResult.finalUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown fetch error";

      if (message.includes("aborted") || message.includes("timeout")) {
        return NextResponse.json(
          { success: false, error: "Website fetch timed out." },
          { status: 504 }
        );
      }

      return NextResponse.json(
        { success: false, error: `Unable to fetch website: ${message}` },
        { status: 500 }
      );
    }

    // ── Step 2: Extract text ──
    const cleanedText = extractTextFromHtml(html);

    if (cleanedText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          error: "Website did not return enough readable content.",
        },
        { status: 400 }
      );
    }

    // ── Step 3: Detect derived signals from HTML ──
    const htmlDerivedSignals = detectDerivedSignals(html, url);

    // ── Step 4: LLM extraction ──
    const openai = new OpenAI({ apiKey });

    let llmResult: ReturnType<typeof parseLlmResponse> = null;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts && !llmResult) {
      attempts++;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(cleanedText) },
          ],
          temperature: 0.3,
          max_tokens: 1000,
          response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content || "";
        llmResult = parseLlmResponse(content);

        if (!llmResult && attempts < maxAttempts) {
          console.log(`[Enrich] LLM parse failed, retrying (attempt ${attempts})`);
        }
      } catch (error) {
        console.error(`[Enrich] LLM error (attempt ${attempts}):`, error instanceof Error ? error.message : error);
        if (attempts >= maxAttempts) {
          return NextResponse.json(
            { success: false, error: "AI extraction failed." },
            { status: 500 }
          );
        }
      }
    }

    if (!llmResult) {
      return NextResponse.json(
        { success: false, error: "Failed to extract structured data from website." },
        { status: 500 }
      );
    }

    // ── Step 5: Merge derived signals ──
    const allDerivedSignals = [
      ...new Set([...llmResult.derivedSignals, ...htmlDerivedSignals]),
    ];

    // ── Step 6: Build response ──
    const scrapedAt = new Date().toISOString();
    const enrichmentData = {
      companyId,
      summary: llmResult.summary,
      whatTheyDo: llmResult.whatTheyDo,
      keywords: llmResult.keywords,
      derivedSignals: allDerivedSignals,
      sources: [
        {
          url: finalUrl || url,
          title: extractPageTitle(html),
          scrapedAt,
        },
      ],
      scrapedAt,
    };

    // ── Cache the result ──
    enrichmentCache.set(cacheKey, { data: enrichmentData, cachedAt: Date.now() });

    const duration = Date.now() - startTime;
    console.log(`[Enrich] Completed for ${companyId} in ${duration}ms`);

    return NextResponse.json({ success: true, data: enrichmentData });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[Enrich] Unexpected error after ${duration}ms:`, error instanceof Error ? error.message : error);

    // Check for overall timeout (20s)
    if (duration > 20_000) {
      return NextResponse.json(
        { success: false, error: "Enrichment timed out." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// ─── Helper: extract page <title> from HTML ───
function extractPageTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (match?.[1]) {
    return match[1].replace(/\s+/g, " ").trim().substring(0, 200);
  }
  return undefined;
}

// ─── Mock enrichment for when no API key is configured ───
function generateMockEnrichment(companyId: string, url: string) {
  const scrapedAt = new Date().toISOString();
  return {
    companyId,
    summary:
      "This company builds innovative technology solutions targeting enterprise and growth markets. They leverage cutting-edge AI and automation to deliver measurable business impact.",
    whatTheyDo: [
      "Develops AI-powered platform for enterprise workflows",
      "Provides data analytics and business intelligence tools",
      "Offers automated integration with existing tech stacks",
      "Serves mid-market and enterprise customers globally",
    ],
    keywords: [
      "AI",
      "Enterprise",
      "SaaS",
      "Automation",
      "Data Analytics",
      "Machine Learning",
    ],
    derivedSignals: [
      "Hiring activity detected",
      "Active content publishing",
      "Product iteration visible",
    ],
    sources: [
      {
        url,
        title: "Company Website",
        scrapedAt,
      },
    ],
    scrapedAt,
  };
}
