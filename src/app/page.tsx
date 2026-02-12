"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageAnalysis from "@/components/_components/ImageAnalysis";
import IngredientRecognition from "@/components/_components/IngredientRecognition";
import ImageCreator from "@/components/_components/ImageCreator";
import { Sparkles } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

export default function Page() {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className="w-full min-h-screen bg-gray-50 relative">
      <h1 className="text-xl text-black font-semibold mb-6 pt-10 pl-10">
        AI tools
      </h1>

      <div className="w-full h-[1px] bg-gray-300 my-6"></div>

      <div className="w-full min-h-screen flex flex-col items-center">
        <div className="flex gap-3 mb-10">
          <Button
            onClick={() => setActiveTab("analysis")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "analysis" ? "bg-gray-500" : "bg-gray-700"
            }`}
          >
            Image analysis
          </Button>

          <Button
            onClick={() => setActiveTab("ingredient")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "ingredient" ? "bg-gray-500" : "bg-gray-700"
            }`}
          >
            Ingredient recognition
          </Button>

          <Button
            onClick={() => setActiveTab("creator")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "creator" ? "bg-gray-500" : "bg-gray-700"
            }`}
          >
            Image creator
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles />
          <h1>Image analysis</h1>
        </div>

        <p>Upload a food photo, and AI will detect the ingredient</p>

        <div className="w-full max-w-xl">
          {activeTab === "analysis" && <ImageAnalysis />}
          {activeTab === "ingredient" && <IngredientRecognition />}
          {activeTab === "creator" && <ImageCreator />}
        </div>
      </div>

      <ChatWidget />
    </div>
  );
}
