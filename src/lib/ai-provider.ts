// ─── AI Provider Factory ───
// Multi-LLM support: OpenAI + Gemini
// This module provides a unified interface for calling different LLM providers
// Used exclusively on the server side (API routes)

import type { AIProvider, LLMExtractionResult } from "@/types/enrichment";

// ─── LLM Prompt (shared across providers) ───
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

// ─── Parse LLM JSON response ───
function parseLLMJSON(response: string): LLMExtractionResult | null {
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

// ─── OpenAI Provider ───
async function callOpenAI(cleanedText: string): Promise<LLMExtractionResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_api_key_here") {
    return null;
  }

  // Dynamic import to avoid bundling issues when OpenAI is not used
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey });

  let result: LLMExtractionResult | null = null;
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts && !result) {
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
      result = parseLLMJSON(content);

      if (!result && attempts < maxAttempts) {
        console.log(`[AI Factory] OpenAI parse failed, retrying (attempt ${attempts})`);
      }
    } catch (error) {
      console.error(
        `[AI Factory] OpenAI error (attempt ${attempts}):`,
        error instanceof Error ? error.message : error
      );
      if (attempts >= maxAttempts) {
        throw new Error("OpenAI extraction failed after retries.");
      }
    }
  }

  return result;
}

// ─── Gemini Provider ───
async function callGemini(cleanedText: string): Promise<LLMExtractionResult | null> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return null;
  }

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let result: LLMExtractionResult | null = null;
  let attempts = 0;
  const maxAttempts = 2;

  while (attempts < maxAttempts && !result) {
    attempts++;
    try {
      const fullPrompt = `${SYSTEM_PROMPT}\n\n${buildUserPrompt(cleanedText)}`;
      const completion = await model.generateContent(fullPrompt);
      const response = await completion.response;
      const content = response.text();

      result = parseLLMJSON(content);

      if (!result && attempts < maxAttempts) {
        console.log(`[AI Factory] Gemini parse failed, retrying (attempt ${attempts})`);
      }
    } catch (error) {
      console.error(
        `[AI Factory] Gemini error (attempt ${attempts}):`,
        error instanceof Error ? error.message : error
      );
      if (attempts >= maxAttempts) {
        throw new Error("Gemini extraction failed after retries.");
      }
    }
  }

  return result;
}

// ─── Provider Factory ───
export async function callAIProvider(
  provider: AIProvider,
  cleanedText: string
): Promise<LLMExtractionResult | null> {
  console.log(`[AI Factory] Using provider: ${provider}`);

  switch (provider) {
    case "gemini":
      return callGemini(cleanedText);
    case "openai":
    default:
      return callOpenAI(cleanedText);
  }
}

// ─── Check if a provider is available ───
export function isProviderAvailable(provider: AIProvider): boolean {
  switch (provider) {
    case "openai": {
      const key = process.env.OPENAI_API_KEY;
      return Boolean(key && key !== "your_openai_api_key_here");
    }
    case "gemini": {
      const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      return Boolean(key && key !== "your_gemini_api_key_here");
    }
    default:
      return false;
  }
}

// ─── Get available providers ───
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (isProviderAvailable("openai")) providers.push("openai");
  if (isProviderAvailable("gemini")) providers.push("gemini");
  return providers;
}

// Re-export the shared prompt building utilities
export { SYSTEM_PROMPT, buildUserPrompt, parseLLMJSON };
