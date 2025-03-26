import { NavLink } from "react-router-dom";
import useAuthStore from "@/hooks/stores/useAuthStore";

const HeaderNavLinks = () => {
  const { userDetails } = useAuthStore(); // Get user details correctly

  const links = [
    { name: "Home", href: "/home" },
    { name: "Recipes", href: "/recipes" },
  ];

  // Ensure userDetails exists and check the role
  if (userDetails?.role === "admin") {
    links.push({ name: "Control", href: "/admin/dashboard" });
  }

  return (
    <nav className="flex flex-col sm:flex-row items-center gap-10">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className={({ isActive }) =>
            `hover:opacity-80 transition text-background sm:text-white text-xl sm:text-base ${
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
