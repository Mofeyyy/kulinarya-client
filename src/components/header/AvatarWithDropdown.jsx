import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useLogoutMutation from "@/hooks/mutations/useLogoutMutation";
import { LogOut, Settings, User, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useThemeStore from "@/hooks/stores/useThemeStore";

// -----------------------------------------------------------------

const AvatarWithDropdown = ({ userProfile }) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const logout = useAuthStore((state) => state.logout);

  const logoutMutation = useLogoutMutation();
  const queryClient = useQueryClient();

  const navigateTo = useNavigate();
  const { userFirstNameInitial, userProfilePictureUrl, userName, userId } = userProfile;

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

  const buttons = [
    {
      label: "Profile",
      Icon: User,
      onClick: () => {
        navigateTo(`/profile/${userId}`);
      },
    },
    {
      label: "Logout",
      Icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar
          className={`flex size-16 cursor-pointer items-center justify-center border-2 border-white transition hover:opacity-80`}
        >
          <AvatarImage src={userProfilePictureUrl} />
          <AvatarFallback className="text-primary text-lg font-semibold capitalize">
            {userFirstNameInitial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-primary text-center">{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {buttons.map(({ label, Icon, onClick }) => (
            <DropdownMenuItem key={label} onClick={onClick} className="cursor-pointer">
              <Icon />
              <p>{label}</p>
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
            {theme === "light" ? <Sun /> : <Moon />}
            <p>Toggle Theme</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AvatarWithDropdown;
