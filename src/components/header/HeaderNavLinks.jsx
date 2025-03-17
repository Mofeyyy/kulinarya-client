import { NavLink } from "react-router-dom";

const HeaderNavLinks = () => {
  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Recipes",
      href: "/recipes",
    },
  ];

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
