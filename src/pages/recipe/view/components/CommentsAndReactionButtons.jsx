import useAuthStore from "@/hooks/stores/useAuthStore";
import ReactionsDialog from "./ReactionsDialog";
import AddReactionButton from "./AddReactionButton";
import CommentsDialog from "./CommentsDialog";
// ----------------------------------------------------------------

const CommentsAndReactionButtons = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleReaction = (reaction) => {
    console.log("User reacted with:", reaction);
  };

  return (
    <div className="flex max-w-fit items-center overflow-hidden rounded-lg border">
      {isLoggedIn && <AddReactionButton onReact={handleReaction} />}
      <CommentsDialog />
      <ReactionsDialog />
    </div>
  );
};

export default CommentsAndReactionButtons;
