import { NavLink } from "react-router-dom";
import Logo from "../Logo";
import HeaderSheet from "./HeaderSheet";
import NotificationDropdown from "./NotificationWithDropdown";
import HeaderUserAvatar from "./HeaderUserAvatar";
import HeaderNavLinks from "./HeaderNavLinks";
import ToggleThemeIconButton from "./ToggleThemeIconButton";
import TestNewNotification from "./TestNewNotification";

// -------------------------------------------------------------------

const Header = () => {
  return (
    <header className="bg-primary flex h-20 w-full items-center justify-center">
      <div className="flex w-full max-w-[90vw] items-center justify-between">
        <NavLink to="/">
          <Logo />
        </NavLink>

        <div className="flex items-center">
          <div className="flex items-center gap-5 sm:gap-10">
            <HeaderNavLinks />
            <TestNewNotification />
            {/* <NotificationDropdown /> */}
            <ToggleThemeIconButton />
            <HeaderUserAvatar />
          </div>

          <div className="flex items-center justify-center">
            <HeaderSheet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
