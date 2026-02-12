import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

export default function IngredientRecognition() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setisGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [ingredient, setIngredients] = useState<string[]>([]);
  const handGenerate = async () => {
    setisGenerating(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setIngredients(data.ingredients);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setisGenerating(false);
    }
  };
  const handleReset = () => {
    setPrompt("");
    setGeneratedImage(null);
  };
  return (
    <div>
      <h2 className="font-semibold text-black">Ingredient recognition</h2>
      <p className="text-black text-sm ">
        Ingredient recognition content here.
      </p>

      <Textarea className="mt-10"></Textarea>

      <div className="flex gap-2 mt-5">
        <Button className="bg-black text-white px-4 rounded-md">
          Generate
        </Button>
      </div>
    </div>
  );
}
