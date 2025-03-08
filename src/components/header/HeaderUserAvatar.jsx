import { useNavigate } from "react-router-dom";

// Imported Context
import useAuthStore from "@/stores/useAuthStore.js";

// Imported Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const HeaderUserAvatar = () => {
  const { user, logout } = useAuthStore();
  const userFirstNameInitial = user?.user?.firstName.charAt(0);
  const userProfilePictureUrl = user?.user?.profilePictureUrl;

  const navigateTo = useNavigate();

  // TODO: FETCH ALL USER DATA INSTEAD
  console.log(user);

  return (
    <>
      {user ? (
        <Avatar
          className={`border-2 border-white size-16 cursor-pointer flex justify-center items-center hover:opacity-80 transition`}
          onClick={logout}
        >
          <AvatarImage src={userProfilePictureUrl} />
          <AvatarFallback className="text-primary text-lg font-semibold">
            {userFirstNameInitial}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Button
          className="bg-white text-primary hover:bg-white hover:opacity-80 transition"
          onClick={() => navigateTo("/login")}
        >
          Login
        </Button>
      )}
    </>
  );
};

export default HeaderUserAvatar;
