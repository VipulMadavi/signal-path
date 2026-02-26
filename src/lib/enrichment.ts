// ─── Enrichment Utilities ───
// URL validation, SSRF protection, HTML parsing for the enrichment pipeline

// ─── SSRF Protection: Block private/internal IP ranges ───
const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^0\.0\.0\.0/,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/,
  /^fe80:/,
  /^localhost$/i,
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
];

/**
 * Validate a URL for enrichment requests.
 * Returns { valid: true } or { valid: false, reason: string }
 */
export function validateUrl(url: string): { valid: boolean; reason?: string } {
  // Must be a non-empty string
  if (!url || typeof url !== "string") {
    return { valid: false, reason: "URL is required." };
  }

  const trimmed = url.trim();

  // Must begin with http:// or https://
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return { valid: false, reason: "URL must begin with http:// or https://." };
  }

  // Block file:// and ftp://
  if (trimmed.startsWith("file://") || trimmed.startsWith("ftp://")) {
    return { valid: false, reason: "Protocol not allowed." };
  }

  // Parse URL
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, reason: "Invalid URL format." };
  }

  // SSRF: block localhost
  if (BLOCKED_HOSTNAMES.includes(parsed.hostname.toLowerCase())) {
    return { valid: false, reason: "Internal addresses are not allowed." };
  }

  // SSRF: block private IP ranges
  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(parsed.hostname)) {
      return { valid: false, reason: "Internal addresses are not allowed." };
    }
  }

  return { valid: true };
}

/**
 * Fetch website HTML with timeout and size limits.
 * Returns the HTML string or throws an error.
 */
export async function fetchWebsite(
  url: string,
  timeoutMs: number = 10_000
): Promise<{ html: string; finalUrl: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SignalPath/1.0; +https://signalpath.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Check content type
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain") && !contentType.includes("application/xhtml")) {
      throw new Error("Response is not HTML.");
    }

    // Limit response size (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    const text = await response.text();
    if (text.length > maxSize) {
      return { html: text.substring(0, maxSize), finalUrl: response.url };
    }

    return { html: text, finalUrl: response.url };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Extract readable text from HTML by removing scripts, styles, nav, and footer.
 * Returns clean text suitable for sending to an LLM.
 */
export function extractTextFromHtml(html: string): string {
  let text = html;

  // Remove script tags and content
  text = text.replace(/<script[\s\S]*?<\/script>/gi, "");

  // Remove style tags and content
  text = text.replace(/<style[\s\S]*?<\/style>/gi, "");

  // Remove SVG tags and content
  text = text.replace(/<svg[\s\S]*?<\/svg>/gi, "");

  // Remove navigation
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, "");

  // Remove footer
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, "");

  // Remove header (navigation header, not h1-h6)
  text = text.replace(/<header[\s\S]*?<\/header>/gi, "");

  // Remove all HTML tags
  text = text.replace(/<[^>]+>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Truncate to ~8000 chars to stay within LLM token limits
  const maxChars = 8000;
  if (text.length > maxChars) {
    text = text.substring(0, maxChars) + "...";
  }

  return text;
}

/**
 * Detect derived signals from HTML content.
 * Checks for careers, blog, changelog, and press pages.
 */
export function detectDerivedSignals(html: string, baseUrl: string): string[] {
  const signals: string[] = [];
  const lowerHtml = html.toLowerCase();

  // Careers page detection
  if (
    lowerHtml.includes("/careers") ||
    lowerHtml.includes("/jobs") ||
    lowerHtml.includes("we're hiring") ||
    lowerHtml.includes("we are hiring") ||
    lowerHtml.includes("join our team") ||
    lowerHtml.includes("open positions")
  ) {
    signals.push("Hiring activity detected");
  }

  // Blog detection
  if (
    lowerHtml.includes("/blog") ||
    lowerHtml.includes("blog post") ||
    lowerHtml.includes("latest news") ||
    lowerHtml.includes("our blog")
  ) {
    signals.push("Active content publishing");
  }

  // Changelog detection
  if (
    lowerHtml.includes("/changelog") ||
    lowerHtml.includes("release notes") ||
    lowerHtml.includes("what's new") ||
    lowerHtml.includes("product updates")
  ) {
    signals.push("Product iteration visible");
  }

  // Press/PR detection
  if (
    lowerHtml.includes("/press") ||
    lowerHtml.includes("/newsroom") ||
    lowerHtml.includes("press release") ||
    lowerHtml.includes("in the news") ||
    lowerHtml.includes("media coverage")
  ) {
    signals.push("PR presence detected");
  }

  return signals;
}

/**
 * Parse the LLM response JSON, with retry-safe parsing.
 */
export function parseLlmResponse(response: string): {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals: string[];
} | null {
  try {
    // Try extracting JSON from markdown code blocks if present
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : response.trim();

    const parsed = JSON.parse(jsonStr);

    // Validate required fields
    if (
      typeof parsed.summary !== "string" ||
      !Array.isArray(parsed.whatTheyDo) ||
      !Array.isArray(parsed.keywords) ||
      !Array.isArray(parsed.derivedSignals)
    ) {
      return null;
    }

    return {
      summary: parsed.summary,
      whatTheyDo: parsed.whatTheyDo.filter(
        (s: unknown): s is string => typeof s === "string"
      ),
      keywords: parsed.keywords.filter(
        (s: unknown): s is string => typeof s === "string"
      ),
      derivedSignals: parsed.derivedSignals.filter(
        (s: unknown): s is string => typeof s === "string"
      ),
    };
  } catch {
    return null;
  }
}
