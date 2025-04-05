import { NavLink } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";

// -------------------------------------------------------------------

const HeaderNavLinks = () => {
  const userDetails = useAuthStore((state) => state.userDetails);
  const isUserAdminOrCreator = userDetails?.role === "admin" || userDetails?.role === "creator";

  const links = [
    { name: "Home", href: "/" },
    { name: "Recipes", href: "/recipes" },
  ];

  // Add "Control" button if user is admin or creator
  if (isUserAdminOrCreator) {
    links.push({ name: "Control", href: "/admin/dashboard" });
  }

  return (
    <nav className="hidden items-center gap-10 sm:flex">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className={({ isActive }) =>
            `text-base text-white transition-opacity hover:opacity-80 ${
              isActive ? "font-bold" : "font-medium"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default HeaderNavLinks;
