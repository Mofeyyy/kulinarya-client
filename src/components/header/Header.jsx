import { NavLink } from "react-router-dom";

// Imported Components
import ModeToggle from "@/components/ModeToggle";
import HeaderUserAvatar from "./HeaderUserAvatar";
import HeaderNavLinks from "./HeaderNavLinks";

// Imported Assets
import Logo from "@/components/Logo";
// -------------------------------------------------------------------

const Header = () => {
  return (
    <header className="w-full h-20 flex justify-between items-center gap-10 px-40 bg-primary">
      <NavLink to="/">
        <Logo />
      </NavLink>

      <div className="flex items-center gap-10">
        <HeaderNavLinks />
        <HeaderUserAvatar />
      </div>

      {/* Uncomment this line to enable Dark Mode Toggle */}
      <ModeToggle />
    </header>
  );
};

export default Header;
