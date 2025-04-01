import useRecipeStore from "@/hooks/stores/useRecipeStore";
import useAuthStore from "@/hooks/stores/useAuthStore";
import RecipeOptions from "../../components/RecipeOptions";
import { Eye, MessageCircleMore, Smile } from "lucide-react";

// ----------------------------------------------------------------

const RecipeTitleSection = () => {
  const userDetails = useAuthStore((state) => state.userDetails);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const recipe = useRecipeStore((state) => state.recipe);

  const { title, byUser, _id: recipeId, totalComments, totalReactions, totalViews } = recipe;
  const { firstName, lastName } = byUser;
  const ownerName = `${firstName} ${lastName}`;

  const stats = [
    { icon: Smile, value: totalReactions, label: "Reaction" },
    { icon: MessageCircleMore, value: totalComments, label: "Comment" },
    { icon: Eye, value: totalViews, label: "View" },
  ];

  return (
    <div className="-mt-4 flex justify-between gap-20">
      <div className="flex w-full min-w-0 flex-col">
        <p className="text-primary text-[clamp(32px,5vw,48px)] font-bold break-words whitespace-normal">
          {title}
        </p>

        <p className="text-sm">By {ownerName}</p>

        <div className="mt-2 flex gap-3">
          {stats.map(({ icon: Icon, value, label }, index) => (
            <div key={index} className="text-muted-foreground flex items-center gap-1 text-xs">
              <Icon className="size-4" />
              <p>
                {value} <span className="hidden sm:inline">{value <= 1 ? label : `${label}s`}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {isLoggedIn && byUser._id === userDetails?._id && (
        <RecipeOptions
          recipeId={recipeId}
          buttonClassName="size-8 lg:size-10 mt-2 lg:mt-3"
          className="size-fit"
        />
      )}
    </div>
  );
};

export default RecipeTitleSection;
