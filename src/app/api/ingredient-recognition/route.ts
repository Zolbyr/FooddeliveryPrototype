import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const textPrompt = `List the main ingredients for "${prompt}". Respond ONLY with a JSON array of strings. No explanation, no markdown. Example: ["chicken", "garlic", "olive oil"]`;

    const res = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(textPrompt)}`,
      { signal: AbortSignal.timeout(30000) }
    );

    if (!res.ok) throw new Error("Text service failed");

    const raw = await res.text();
    const match = raw.match(/\[[\s\S]*?\]/);
    const ingredients: string[] = match ? JSON.parse(match[0]) : [];

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("[ingredient-recognition]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
