import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------

const RecipeOptions = ({ recipeId, className, buttonClassName }) => {
  const navigateTo = useNavigate();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn("hover:text-primary cursor-pointer transition-colors", className)}>
          <MoreVertical className={cn("size-10", buttonClassName)} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-28 overflow-hidden p-0">
        <Button
          variant="ghost"
          className="recipe-options w-full justify-center rounded-none"
          onClick={() => navigateTo(`/recipes/${recipeId}/edit`)}
        >
          Edit
        </Button>

        <Button
          variant="ghost"
          className="text-destructive-foreground recipe-options w-full justify-center rounded-none"
          onClick={() => alert("Coming Soon")}
        >
          Delete
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default RecipeOptions;
