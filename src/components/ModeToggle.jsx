// Imported Stores
import useThemeStore from "@/hooks/stores/useThemeStore";

// Imported Components
import { Button } from "@/components/ui/button";

// Imported Assets
import { Moon, Sun } from "lucide-react";

// -------------------------------------------------------------------
// TODO: Delete if did'nt use in the future

function ModeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="outline"
      size="icon"
      className="cursor-pointer"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ModeToggle;
