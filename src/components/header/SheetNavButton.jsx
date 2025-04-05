import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------

const SheetNavButton = ({ label, href, Icon, onClick, setOpen }) => {
  return href ? (
    <NavLink to={href} className={({ isActive }) => `w-full ${isActive ? "text-primary" : ""}`}>
      <Button
        variant="ghost"
        className="hover:text-primary w-full rounded-lg py-10 transition-colors"
        onClick={() => setOpen(false)}
      >
        <Icon className="size-5" />

        <span>{label}</span>
      </Button>
    </NavLink>
  ) : (
    <Button
      onClick={() => {
        onClick();
        setOpen(false);
      }}
      variant="ghost"
      className="hover:text-primary w-full rounded-lg py-10 transition-colors"
    >
      <Icon className="size-5" />

      <span>{label}</span>
    </Button>
  );
};

export default SheetNavButton;
