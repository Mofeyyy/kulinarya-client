import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserCard = ({ user }) => {
  return (
    <div key={user._id} className="flex flex-col items-center justify-center gap-5 py-5">
      <Avatar className="size-40">
        <AvatarImage
          src={
            user.profilePictureUrl ||
            "https://icons.veryicon.com/png/o/business/multi-color-financial-and-business-icons/user-139.png"
          }
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <p className="font-semibolb flex justify-center text-lg">
        {user.firstName} {user.lastName}
      </p>

      <Link to={`/users/${user._id}`}>
        <Button size="lg" className="bg-card/80 hover:bg-card/60">
          View Profile
        </Button>
      </Link>
    </div>
  );
};

export default UserCard;
