import { useState } from "react";
import { Smile, MessageCircleMore } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultFallbackImage from "@/assets/default-fallback-image.png";

// ------------------------------------------------------------

// TODO: --------------------------
// Just pic _id, title, byUser: {firstName, lastName}, totalComments, totalReactions
// Integrate total views
// TODO: --------------------------

const RecipeDisplayCard = ({ recipe }) => {
  const navigateTo = useNavigate();
  const { title, byUser, totalComments, mainPictureUrl, totalReactions } = recipe;

  const [imageSrc, setImageSrc] = useState(mainPictureUrl || defaultFallbackImage);
  const { firstName, lastName } = byUser;
  const recipeOwner = `${firstName} ${lastName}`;

  return (
    <div
      onClick={() => navigateTo(`/recipes/${recipe._id}`)}
      className="flex w-full cursor-pointer flex-col gap-2 rounded-lg border p-3 shadow-sm transition hover:opacity-80"
    >
      {/* Picture */}
      <img
        src={imageSrc}
        alt="recipePicture"
        className="bg-muted h-52 w-full rounded-sm object-cover"
        onError={() => setImageSrc(defaultFallbackImage)}
        loading="lazy"
      />

      {/* Other Details  */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-foreground text-xl font-bold">{title}</p>
          <p className="text-muted-foreground text-sm">{`By ${recipeOwner}`}</p>
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
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplayCard;
