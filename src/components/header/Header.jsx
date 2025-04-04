import { NavLink } from "react-router-dom";
import Logo from "../Logo";
import HeaderSheet from "./HeaderSheet";
import HeaderUserAvatar from "./HeaderUserAvatar";
import HeaderNavLinks from "./HeaderNavLinks";
import ToggleThemeIconButton from "./ToggleThemeIconButton";
import NotificationDropdown from "./NotificationDropdown";

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
            <NotificationDropdown />
            <ToggleThemeIconButton className="sm:hidden" />
            <HeaderUserAvatar />
          </div>

          <div className="justify-cente1 ml-5 flex items-center">
            <HeaderSheet />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
