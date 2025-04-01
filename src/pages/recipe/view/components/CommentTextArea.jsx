import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal } from "lucide-react";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import { Textarea } from "@/components/ui/textarea";
import useCommentMutations from "@/hooks/mutations/useCommentMutations";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// ----------------------------------------------------------------

const CommentTextArea = ({ type = "add", value = "", onChange, onSave, onCancel }) => {
  const [comment, setComment] = useState(value);
  const recipe = useRecipeStore((state) => state.recipe);
  const { _id: recipeId } = recipe;

  const { addCommentMutation } = useCommentMutations(recipeId);

  const handleAddComment = () => {
    if (comment.trim()) {
      addCommentMutation.mutate(comment);
      setComment("");
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      <Textarea
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          if (onChange) onChange(e.target.value); // Call onChange for edit mode
        }}
        placeholder="Type your comment..."
        className="pr-12"
      />

      {type === "add" ? (
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-2 bottom-2 p-2"
          onClick={handleAddComment}
        >
          <SendHorizontal className="text-muted-foreground size-5" />
        </Button>
      ) : (
        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(comment)}>Save</Button>
        </div>
      )}
    </div>
  );
};

export default CommentTextArea;
