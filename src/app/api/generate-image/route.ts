import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt оруулна уу" }, { status: 400 });
    }

    // Step 1: Get ingredients via Gemini text
    let ingredients: string[] = [];
    try {
      const ingredientResult = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `List the main ingredients for: "${prompt}".
Respond ONLY with a JSON array of strings. No explanation, no markdown.
Example: ["chicken", "garlic", "olive oil"]`,
              },
            ],
          },
        ],
      });

      const raw = ingredientResult.text ?? "[]";
      const match = raw.match(/\[[\s\S]*?\]/);
      if (match) {
        ingredients = JSON.parse(match[0]);
      }
    } catch (err) {
      console.error("[generate-image] Ingredient step failed:", err);
    }

    // Step 2: Generate image via Imagen 3
    let image: string | null = null;
    try {
      const imagenResult = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt: `${prompt}, professional food photography, appetizing, high quality`,
        config: {
          numberOfImages: 1,
          aspectRatio: "1:1",
        },
      });

      const bytes = imagenResult.generatedImages?.[0]?.image?.imageBytes;
      if (bytes) {
        image = `data:image/png;base64,${bytes}`;
      }
    } catch (err) {
      console.warn("[generate-image] Imagen step failed (billing may be needed):", err);
    }

    return NextResponse.json({ image, ingredients });
  } catch (error) {
    console.error("[generate-image] Unhandled error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Алдаа гарлаа" },
      { status: 500 }
    );
  }
}