import HeaderDrawer from "./HeaderDrawer";
import HeaderContents from "./HeaderContents";

// -------------------------------------------------------------------

const Header = () => {
  return (
    <header className="w-full h-20 flex justify-center sm:justify-between items-center bg-primary px-5 min-[400px]:px-10 min-[500px]:px-16 sm:px-12 md:px-16 lg:px-24 xl:px-40">
      <div className="w-full hidden sm:flex justify-between items-center gap-10">
        <HeaderContents />
      </div>

      <HeaderDrawer />
    </header>
  );
};

export default Header;
