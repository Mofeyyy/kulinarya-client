import useRecipeStore from "@/hooks/stores/useRecipeStore";
import useAuthStore from "@/hooks/stores/useAuthStore";
import CommentsAndReactionButtons from "./CommentsAndReactionButtons";
import CommentTextArea from "./CommentTextArea";
import Comments from "./Comments";

// ----------------------------------------------------------------

const CommentsPreviewSection = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userDetails = useAuthStore((state) => state.userDetails);
  const recipe = useRecipeStore((state) => state.recipe);
  const { commentsPreview } = recipe;

  return (
    <>
      <div className="flex flex-col gap-2">
        <CommentsAndReactionButtons />

        {isLoggedIn && userDetails && <CommentTextArea />}
      </div>

      <Comments comments={commentsPreview} />
    </>
  );
};

export default CommentsPreviewSection;
