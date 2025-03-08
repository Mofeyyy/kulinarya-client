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
      className={cn(
        "size-16 rounded-full cursor-pointer hover:scale-105 transition",
        className
      )}
      onClick={() => navigate("/")}
    />
  );
};

export default Logo;
