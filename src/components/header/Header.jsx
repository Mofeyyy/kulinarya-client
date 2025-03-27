import { NavLink } from "react-router-dom";
import HeaderUserAvatar from "./HeaderUserAvatar";
import HeaderNavLinks from "./HeaderNavLinks";
import Logo from "../Logo";
import NotificationDropdown from "./NotificationWithDropdown";
import HeaderDrawer from "./HeaderDrawer";
import HeaderNav from "./HeaderNav";

// -------------------------------------------------------------------

const Header = () => {
  return (
    <header className="w-full h-20 flex justify-center items-center bg-primary">
      <div className="w-full flex justify-between items-center gap-10 max-w-[90vw]">
        <NavLink to="/">
          <Logo />
        </NavLink>

        <div className="hidden sm:flex">
          <HeaderNav />
        </div>

        <HeaderDrawer />
      </div>
    </header>
  );
};

export default Header;
