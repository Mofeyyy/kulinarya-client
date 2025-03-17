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
    <header className="w-full h-20 flex justify-between items-center gap-10 bg-primary px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40">
      <NavLink to="/">
        <Logo />
      </NavLink>

      <div className="flex items-center gap-10">
        <ModeToggle />

        <HeaderNavLinks />
        <HeaderUserAvatar />
      </div>
    </header>
  );
};

export default Header;
