import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import generateRecipePDF from "@/pages/recipe/view/components/generateRecipePDF";

const RecipeTabs = () => {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [isGenerating, setIsGenerating] = useState(false);  // New state for loading
  const recipe = useRecipeStore((state) => state.recipe);
  const { ingredients, procedure } = recipe;

  const handleDownloadPDF = async () => {
    setIsGenerating(true); // Set loading state to true
    await generateRecipePDF(recipe); // Wait for PDF generation
    setIsGenerating(false); // Set loading state back to false after the download is triggered
  };

  return (
    <Card className="bg-background text-foreground w-full overflow-hidden rounded-t-none rounded-b-lg border-0 p-0 pt-2">
      {/* Tabs */}
      <div className="flex border-b">
        {[
          { id: "ingredients", label: "Ingredients" },
          { id: "procedure", label: "Procedure" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`cursor-pointer border-b-3 px-5 py-1 font-bold transition-opacity hover:opacity-80 ${
              activeTab === tab.id ? "border-primary" : "border-background"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <CardContent className="text-sm">
        {activeTab === "ingredients" ? (
          <ul className="list-disc space-y-2 px-5">
            {ingredients.map(({ _id, quantity, unit, name }) => (
              <li key={_id}>
                {quantity} {unit} {name}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {procedure.map(({ _id, stepNumber, content }) => (
              <li key={_id}>
                <strong>Step {stepNumber}:</strong> {content}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      {/* Download PDF Button */}
      <div className="flex items-center border-t p-5">
        <Button onClick={handleDownloadPDF} disabled={isGenerating}>
          {isGenerating ? (
            <span>Generating...</span> // Feedback while generating
          ) : (
            <>
              <Download className="size-5" />
              Download
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default RecipeTabs;
