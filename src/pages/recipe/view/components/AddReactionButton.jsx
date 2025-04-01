import { useState } from "react";
import { SmilePlus } from "lucide-react";
import useToggleReaction from "@/hooks/mutations/useToggleReaction";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const reactions = [
  { value: "heart", reaction: "❤️" },
  { value: "drool", reaction: "🤤" },
  { value: "neutral", reaction: "😐" },
];

// ----------------------------------------------------------------

const AddReactionButton = () => {
  const recipe = useRecipeStore((state) => state.recipe);
  const { _id: recipeId, userReaction } = recipe;
  const existingReaction = userReaction?.reaction;
  const [selectedReaction, setSelectedReaction] = useState(existingReaction || null);
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: toggleReaction } = useToggleReaction(recipeId);

  const handleReactionClick = (reactionValue) => {
    setSelectedReaction((prev) => (prev === reactionValue ? null : reactionValue));
    toggleReaction(reactionValue);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`w-auto max-w-fit cursor-pointer px-4 py-2 text-sm ${
            selectedReaction
              ? "transition-transform hover:scale-125"
              : "hover:text-primary transition-colors"
          }`}
        >
          {selectedReaction ? (
            <span className="text-lg transition-transform">
              {reactions.find((r) => r.value === selectedReaction)?.reaction}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <SmilePlus className="size-5" />
              <span>React</span>
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex gap-4 p-2">
        {reactions.map(({ value, reaction }) => (
          <button
            key={value}
            className="cursor-pointer text-2xl transition-transform hover:scale-125"
            onClick={() => handleReactionClick(value)}
          >
            {reaction}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default AddReactionButton;
