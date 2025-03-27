import HeaderUserAvatar from "./HeaderUserAvatar";
import HeaderNavLinks from "./HeaderNavLinks";
import NotificationDropdown from "./NotificationWithDropdown";

const HeaderNav = () => {
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center gap-10 mb-10 sm:mb-0">
      <HeaderNavLinks />
      <NotificationDropdown />
      <HeaderUserAvatar />
    </div>
  );
};

export default HeaderNav;
