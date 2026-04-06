"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ImageCreator() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/image-creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to generate image. Please try again.");
      } else {
        setGeneratedImage(data.image);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe a food or dish... e.g. Mongolian buuz on a wooden plate"
        rows={3}
        className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
      />

      <div className="flex justify-end gap-2 mt-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button
          className="bg-zinc-800 hover:bg-zinc-700"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {generatedImage && (
        <div className="mt-4">
          <img
            src={generatedImage}
            alt="generated food"
            className="w-64 rounded-lg block"
          />
          <a
            href={generatedImage}
            download="generated-food.png"
            className="mt-2 inline-block text-sm text-zinc-600 underline"
          >
            Download image
          </a>
        </div>
      )}
    </div>
  );
}
