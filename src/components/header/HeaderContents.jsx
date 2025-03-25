import { NavLink } from "react-router-dom";
import HeaderUserAvatar from "./HeaderUserAvatar";
import HeaderNavLinks from "./HeaderNavLinks";
import Logo from "../Logo";
import NotificationDropdown from "./NotificationWithDropdown";

// --------------------------------------------------------------------

const HeaderContents = () => {
  return (
    <>
      <NavLink to="/" className="hidden sm:flex">
        <Logo />
      </NavLink>

      <div className="flex flex-col-reverse sm:flex-row items-center gap-10 mb-10 sm:mb-0">
        <HeaderNavLinks />
        <NotificationDropdown />
        <HeaderUserAvatar />
      </div>
    </>
  );
};

export default HeaderContents;
