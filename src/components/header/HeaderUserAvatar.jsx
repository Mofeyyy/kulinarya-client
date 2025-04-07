import { Link } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import AvatarWithDropdown from "./AvatarWithDropdown";

// -----------------------------------------------------------------

const HeaderUserAvatar = () => {
  const userDetails = useAuthStore((state) => state.userDetails);

  const userName = `${userDetails?.firstName} ${userDetails?.lastName}`;
  const userFirstNameInitial = userDetails?.firstName?.charAt(0) || "?";
  const userProfilePictureUrl = userDetails?.profilePictureUrl;

  const authLinks = [
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Signup",
      href: "/signup",
    },
  ];

  return (
    <div className="hidden items-center gap-8 sm:flex">
      {userDetails ? (
        <AvatarWithDropdown
          userProfile={{
            userFirstNameInitial,
            userProfilePictureUrl,
            userName,
            userId: userDetails?._id,
          }}
        />
      ) : (
        authLinks.map(({ label, href }) => (
          <Link key={label} to={href}>
            <Button className="text-primary bg-white font-semibold transition hover:bg-white hover:opacity-80">
              {label}
            </Button>
          </Link>
        ))
      )}
    </div>
  );
};

export default HeaderUserAvatar;
