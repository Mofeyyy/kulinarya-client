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
      className="w-full p-3 rounded-lg border shadow-sm flex flex-col gap-2 cursor-pointer hover:opacity-80 transition"
    >
      {/* Picture */}
      <img
        src={imageSrc}
        alt="recipePicture"
        className="h-52 w-full object-cover rounded-sm bg-muted"
        onError={() => setImageSrc(defaultFallbackImage)}
      />

      {/* Other Details  */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="font-bold text-xl text-foreground">{title}</p>
          <p className="text-muted-foreground text-sm">{`By ${recipeOwner}`}</p>
        </div>

        <div className="text-muted-foreground text-sm flex gap-5 items-center">
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
