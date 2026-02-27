import { NextResponse } from "next/server";

// ─── GET /api/key-status ───
// Returns which AI providers have server-side env var keys configured
// Does NOT expose the actual key values — only boolean status
export async function GET() {
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  return NextResponse.json({
    openai: Boolean(openaiKey && openaiKey !== "your_openai_api_key_here"),
    gemini: Boolean(geminiKey && geminiKey !== "your_gemini_api_key_here"),
  });
}
