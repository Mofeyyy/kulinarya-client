import { useState } from "react";
import { Button } from "@/components/ui/button";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import { splitParagraphs } from "@/utils/textUtils";
import ParagraphList from "./ParagraphList";

// ----------------------------------------------------------------

const RecipeDescription = () => {
  const recipe = useRecipeStore((state) => state.recipe);
  const { description } = recipe;

  const MAX_LENGTH = 300;
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDescription = splitParagraphs(description);

  // If already short
  const fullText = formattedDescription.join("\n");
  if (fullText.length <= MAX_LENGTH) {
    return (
      <div className="text-muted-foreground text-justify text-sm leading-loose">
        <ParagraphList paragraphs={formattedDescription} />
      </div>
    );
  }

  let charCount = 0;
  let truncatedText = [];

  for (let para of formattedDescription) {
    if (charCount + para.length > MAX_LENGTH) {
      const remaining = MAX_LENGTH - charCount;
      truncatedText.push(para.slice(0, remaining) + "...");
      break;
    }

    truncatedText.push(para);
    charCount += para.length;
  }

  return (
    <div className="text-muted-foreground flex flex-col text-justify text-sm leading-loose">
      <ParagraphList paragraphs={isExpanded ? formattedDescription : truncatedText} />
      <Button onClick={() => setIsExpanded(!isExpanded)} className="mt-8 self-start">
        {isExpanded ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
};

export default RecipeDescription;
