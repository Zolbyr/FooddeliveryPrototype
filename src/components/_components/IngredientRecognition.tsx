"use client";

import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function IngredientRecognition() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setIngredients([]);

    try {
      const res = await fetch("/api/ingredient-recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setIngredients(data.ingredients || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Алдаа гарлаа");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setIngredients([]);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-black">Ingredient recognition</h2>
      <p className="text-black text-sm">
        Enter a food or dish name to get its ingredient list.
      </p>

      <Textarea
        className="mt-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. Mongolian buuz, beef stew, Caesar salad..."
        rows={3}
      />

      <div className="flex gap-2">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="bg-black text-white px-4 rounded-md"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate"
          )}
        </Button>

        <Button onClick={handleReset} variant="outline" className="px-4 rounded-md">
          Reset
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">❌ {error}</p>}

      {ingredients.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-black">
            Ingredients ({ingredients.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full border border-gray-200"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
