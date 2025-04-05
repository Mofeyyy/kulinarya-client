import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Imported Assets
import kulinaryaLogo from "@/assets/kulinarya-logo.jpg";

const Logo = ({ className }) => {
  const navigate = useNavigate();

  return (
    <img
      src={kulinaryaLogo}
      alt="Kulinarya Logo"
      className={cn("size-16 cursor-pointer rounded-full transition hover:scale-105", className)}
      onClick={() => navigate("/")}
      loading="lazy"
    />
  );
};

export default Logo;
