import { Button } from "@/components/ui/button";
import useRecipeStore from "@/hooks/stores/useRecipeStore";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ----------------------------------------------------------------

const OwnerProfileCard = () => {
  const recipe = useRecipeStore((state) => state.recipe);
  const owner = recipe.byUser;
  const { _id: ownerId, profilePictureUrl, bio, firstName, lastName } = owner;
  const ownerName = `${firstName} ${lastName}`;
  const ownerFirstNameInitial = owner?.firstName?.charAt(0) || "?";
  const MAX_BIO_LENGTH = 200;

  const truncatedBio = bio.length > MAX_BIO_LENGTH ? bio.slice(0, MAX_BIO_LENGTH) + "..." : bio;

  return (
    <div className="bg-background text-foreground flex w-full max-w-md flex-col items-center rounded-lg border px-10 pb-10 shadow-lg lg:max-w-none">
      <Avatar className="border-primary aspect-square size-32 -translate-y-1/2 rounded-full border-3 object-cover lg:size-40">
        <AvatarImage src={profilePictureUrl} />
        <AvatarFallback className="text-primary text-3xl font-semibold">
          {ownerFirstNameInitial}
        </AvatarFallback>
      </Avatar>

      <div className="-mt-10 flex w-full min-w-0 flex-col items-center gap-5 lg:-mt-14">
        <p className="w-full text-center text-[clamp(20px,2.5vw,30px)] font-bold break-words">
          {ownerName}
        </p>
        <p className="text-muted-foreground w-full text-center text-sm leading-loose break-words">
          {truncatedBio}
        </p>

        <Link to={`/profile/${ownerId}`}>
          <Button className="w-full">View Profile</Button>
        </Link>
      </div>
    </div>
  );
};

export default OwnerProfileCard;
