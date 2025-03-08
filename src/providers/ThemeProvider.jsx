import { useEffect } from "react";

// Imported Stores
import useThemeStore from "@/stores/useThemeStore";

// -------------------------------------------------------------------

export function ThemeProvider({ children }) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return children;
}
