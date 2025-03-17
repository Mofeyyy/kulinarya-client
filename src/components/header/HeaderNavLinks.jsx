import { NavLink } from "react-router-dom";

const HeaderNavLinks = () => {
  const links = [
    {
      name: "Home",
      href: "/home",
    },
    {
      name: "Recipes",
      href: "/recipes",
    },
  ];

  return (
    <nav className="flex items-center gap-10">
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className={({ isActive }) =>
            `hover:opacity-80 transition text-white text-md ${
              isActive ? "font-semibold" : ""
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
