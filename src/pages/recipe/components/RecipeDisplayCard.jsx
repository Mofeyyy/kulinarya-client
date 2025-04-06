import { Smile, MessageCircleMore, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageWithFallback from "@/components/ImageWithFallback";
import useAuthStore from "@/hooks/stores/useAuthStore";
import RecipeOptions from "./RecipeOptions";

// ------------------------------------------------------------

// TODO: --------------------------
// Just pic _id, title, byUser: {firstName, lastName}, totalComments, totalReactions
// Integrate total views
// TODO: --------------------------

const RecipeDisplayCard = ({ recipe }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userDetails = useAuthStore((state) => state.userDetails);
  const navigateTo = useNavigate();
  const {
    title,
    byUser,
    mainPictureUrl,
    totalComments = 0,
    totalReactions = 0,
    totalViews = 0,
  } = recipe;

  const { firstName, lastName } = byUser;
  const recipeOwner = `${firstName} ${lastName}`;

  return (
    <div
      onClick={(e) => {
        // Prevent clicking when the RecipeOptions button is clicked
        if (e.target.closest(".recipe-options")) return;

        navigateTo(`/recipes/${recipe._id}`);
      }}
      className="hover:border-primary flex w-full cursor-pointer flex-col gap-2 rounded-lg border p-3 shadow-lg transition-colors"
    >
      {/* Picture */}
      <ImageWithFallback
        src={mainPictureUrl}
        alt="recipePicture"
        className="h-52 w-full rounded-sm object-cover"
      />

      {/* Other Details  */}
      <div className="flex w-full flex-col gap-5 border">
        <div className="flex w-full justify-between gap-2 border">
          <div className="flex w-full min-w-0 flex-col">
            <p className="text-foreground truncate text-xl font-bold break-words">{title}</p>
            <p className="text-muted-foreground truncate text-sm break-words">{`By ${recipeOwner}`}</p>
          </div>

          {isLoggedIn && byUser._id === userDetails?._id && (
            <RecipeOptions
              recipeId={recipe._id}
              className="recipe-options"
              buttonClassName="size-5"
            />
          )}
        </div>

        <div className="text-muted-foreground flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1">
            <Smile className="size-5" />
            {totalReactions}
          </div>

          <div className="flex items-center gap-1">
            <MessageCircleMore className="size-5" />
            {totalComments}
          </div>

          <div className="flex items-center gap-1">
            <Eye className="size-5" />
            {totalViews}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplayCard;
