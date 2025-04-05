import { cn } from "@/lib/utils";
import useThemeStore from "@/hooks/stores/useThemeStore";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";

//  ------------------------------------------------------

const ToggleThemeIconButton = ({ className }) => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <Button
      className={cn(
        "rounded-full bg-gradient-to-r from-orange-500 to-orange-600 !p-2 text-white shadow-lg transition-transform hover:scale-110",
        className,
      )}
      onClick={toggleTheme}
    >
      {theme === "light" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
};

export default ToggleThemeIconButton;
