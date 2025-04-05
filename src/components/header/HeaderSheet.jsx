import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Menu, LogOut, User, UserPlus, ChefHat, UserCog, House, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/hooks/stores/useAuthStore";
import useThemeStore from "@/hooks/stores/useThemeStore";
import {
  Sheet,
  SheetTitle,
  SheetDescription,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import useLogoutMutation from "@/hooks/mutations/useLogoutMutation";
import { useQueryClient } from "@tanstack/react-query";
import SheetNavButton from "./SheetNavButton";

// Navigation and User Action Data
const navLinks = [
  { label: "Home", href: "/", Icon: House },
  { label: "Recipes", href: "/recipes", Icon: ChefHat },
];

// -----------------------------------------------------------

const HeaderSheet = () => {
  const userDetails = useAuthStore((state) => state.userDetails);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [open, setOpen] = useState(false);
  const logoutMutation = useLogoutMutation();
  const queryClient = useQueryClient();
  const navigateTo = useNavigate();

  const isUserAdminOrCreator = userDetails?.role === "admin" || userDetails?.role === "creator";
  const isUserLoggedIn = isLoggedIn && userDetails !== null;
  const userFullName = `${userDetails?.firstName} ${userDetails?.lastName}`;
  const userProfilePicture = userDetails?.profilePictureUrl;
  const userInitialFirstName = userDetails?.firstName?.[0] || "?";

  const handleLogout = async () => {
    logoutMutation.mutate(null, {
      onSuccess: () => {
        logout();
        queryClient.removeQueries(["userDetails"]);
        toast.success("Logout Success!");
        navigateTo("/");
        setOpen(false);
      },
      onError: (error) => toast.error(error?.message || "Logout Failed!"),
    });
  };

  const userButtons = isUserLoggedIn
    ? [
        { label: "Profile", Icon: User, onClick: () => navigateTo("/profile") },
        { label: "Logout", Icon: LogOut, onClick: handleLogout },
      ]
    : [
        { label: "Login", Icon: User, onClick: () => navigateTo("/login") },
        { label: "Signup", Icon: UserPlus, onClick: () => navigateTo("/signup") },
      ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTitle />
      <SheetDescription />

      <SheetTrigger asChild>
        <Button className="!p-0 shadow-none transition-opacity hover:opacity-80 sm:hidden">
          <Menu className="size-10 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent className="!max-w-xs rounded-l-lg !p-0">
        <div className="flex h-full w-full flex-col">
          {/* User Profile Section */}
          {isUserLoggedIn && (
            <div className="flex w-full flex-col items-center justify-center gap-5 border-b-2 py-5">
              <Avatar className="border-primary size-32 border-2">
                <AvatarImage src={userProfilePicture} />
                <AvatarFallback>{userInitialFirstName}</AvatarFallback>
              </Avatar>

              <span className="text-primary font-semibold">{userFullName}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex h-full w-full flex-col items-center justify-between">
            <div className="flex w-full flex-col items-center">
              {navLinks.map(({ label, href, Icon }) => (
                <SheetNavButton
                  key={label}
                  label={label}
                  href={href}
                  Icon={Icon}
                  setOpen={setOpen}
                />
              ))}

              {/* Control Button If User Is Admin Or Creator */}
              {isUserAdminOrCreator && (
                <SheetNavButton
                  label={"Control"}
                  href={"/admin/dashboard"}
                  Icon={UserCog}
                  setOpen={setOpen}
                />
              )}
            </div>

            {/* User Buttons */}
            <div className="flex w-full flex-col items-center">
              {userButtons.map(({ label, Icon, onClick }) => (
                <SheetNavButton
                  key={label}
                  label={label}
                  Icon={Icon}
                  onClick={onClick}
                  setOpen={setOpen}
                />
              ))}

              <SheetNavButton
                label="Toggle Theme"
                Icon={theme === "light" ? Sun : Moon}
                onClick={toggleTheme}
                setOpen={setOpen}
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HeaderSheet;
