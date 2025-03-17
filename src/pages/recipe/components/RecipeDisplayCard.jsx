import { Smile, MessageCircleMore } from "lucide-react";
import sampleRecipePic from "@/assets/sampleRecipePic.jpg";

// ------------------------------------------------------------

// TODO: --------------------------
// add computations in reactions, set it to all reactions
// Just pic _id, title, byUser: {firstName, lastName}, totalComments, totalReactions
// Integrate total views
// TODO: --------------------------

const RecipeDisplayCard = ({ recipe }) => {
  const { title, byUser, totalComments, mainPictureUrl, totalReactions } =
    recipe;
  const { firstName, lastName } = byUser;
  const recipeOwner = `${firstName} ${lastName}`;

  // Sample Data
  const numberOfReactions = 10;

  return (
    <div className="w-full p-3 rounded-lg border shadow-sm flex flex-col gap-2 cursor-pointer hover:opacity-80 transition">
      {/* Picture */}
      <img
        src={mainPictureUrl}
        alt="recipePicture"
        className="h-52 w-full object-cover rounded-sm"
      />

      {/* Other Details  */}
      <div className="flex flex-col gap-5">
        <div>
          <p className="font-bold text-xl text-foreground">{title}</p>
          <p className="text-gray-500 text-sm">{`By ${recipeOwner}`}</p>
        </div>

        <div className="text-gray-500 text-sm flex gap-5 items-center">
          <div className="flex items-center gap-1">
            <Smile className="size-5" />
            {numberOfReactions}
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
