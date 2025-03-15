import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

// Imported Context
import useAuthStore from "@/hooks/stores/useAuthStore";

// Imported Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Imported Mutations
import useLogoutMutation from "@/hooks/mutations/useLogoutMutation";

// -----------------------------------------------------------------

const HeaderUserAvatar = () => {
  const { userDetails: user, logout } = useAuthStore();
  const navigateTo = useNavigate();
  const queryClient = useQueryClient();
  const logoutMutation = useLogoutMutation();

  const userFirstNameInitial = user?.firstName?.charAt(0) || "?";
  const userProfilePictureUrl = user?.profilePictureUrl;

  const handleLogout = async () => {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        logout(); // Clear Auth State
        queryClient.removeQueries(["userDetails"]); // Clear React Query Cache
        toast.success("Logout Success!");
        navigateTo("/");
      },
      onError: (error) => {
        toast.error(error?.message || "Logout Failed! Please try again.");
      },
    });
  };

  return (
    <>
      {user ? (
        <Avatar
          className={`border-2 border-white size-16 cursor-pointer flex justify-center items-center hover:opacity-80 transition`}
          onClick={handleLogout}
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
