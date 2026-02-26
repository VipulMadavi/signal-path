import { NextRequest, NextResponse } from "next/server";

// ─── POST /api/test-key ───
// Verifies an API key by making a minimal call to the provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, key } = body;

    if (!provider || !key) {
      return NextResponse.json(
        { success: false, error: "Provider and key are required." },
        { status: 400 }
      );
    }

    if (provider === "openai") {
      return await testOpenAIKey(key);
    } else if (provider === "gemini") {
      return await testGeminiKey(key);
    }

    return NextResponse.json(
      { success: false, error: "Unknown provider." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// ─── Test OpenAI key with a minimal models.list call ───
async function testOpenAIKey(key: string) {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key}`,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, message: "OpenAI key is valid." });
    }

    if (response.status === 401) {
      return NextResponse.json(
        { success: false, error: "Invalid API key." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: `OpenAI responded with status ${response.status}.` },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection failed.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 200 }
    );
  }
}

// ─── Test Gemini key with a minimal models.list call ───
async function testGeminiKey(key: string) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
      {
        method: "GET",
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (response.ok) {
      return NextResponse.json({ success: true, message: "Gemini key is valid." });
    }

    if (response.status === 400 || response.status === 403) {
      return NextResponse.json(
        { success: false, error: "Invalid API key." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Gemini responded with status ${response.status}.` },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connection failed.";
    return NextResponse.json(
      { success: false, error: message },
      { status: 200 }
    );
  }
}
