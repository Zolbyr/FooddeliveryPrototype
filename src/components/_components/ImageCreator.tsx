"use client";

import { useState } from "react";

export default function ImageCreator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [ingredient, setIngredients] = useState<string[]>([]);

  const handGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      setIngredients(data.ingredients || []);
      setGeneratedImage(data.image || null);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setGeneratedImage(null);
    setIngredients([]);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-black">Image creator</h2>
      <p className="text-black text-sm">Image creator content here.</p>

      {/* Prompt input */}
      <textarea
        className="border p-2 w-full rounded-md"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type prompt..."
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handGenerate}
          disabled={isGenerating}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </button>

        <button onClick={handleReset} className="border px-4 py-2 rounded-md">
          Reset
        </button>
      </div>

      {/* Generated image */}
      {generatedImage && (
        <img src={generatedImage} alt="generated" className="rounded-lg mt-4" />
      )}

      {/* Ingredients list */}
      <div className="space-y-1">
        {ingredient.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}
