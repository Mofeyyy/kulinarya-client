import { useNavigate } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import AvatarWithDropdown from "./AvatarWithDropdown";

// -----------------------------------------------------------------

const HeaderUserAvatar = () => {
  const { userDetails: user } = useAuthStore();
  const navigateTo = useNavigate();

  const userName = `${user?.firstName} ${user?.lastName}`;
  const userFirstNameInitial = user?.firstName?.charAt(0) || "?";
  const userProfilePictureUrl = user?.profilePictureUrl;

  return (
    <>
      {user ? (
        <AvatarWithDropdown
          userProfile={{
            userFirstNameInitial,
            userProfilePictureUrl,
            userName,
          }}
        />
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
