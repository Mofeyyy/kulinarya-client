import { create } from "zustand";

// -------------------------------------------------------------------

const getSystemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

const getThemeInLocalStorage = localStorage.getItem("vite-ui-theme");

const useThemeStore = create((set) => ({
  // If there is a theme in local storage, use it, otherwise use the system theme
  theme: getThemeInLocalStorage || getSystemTheme,

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";

      localStorage.setItem("vite-ui-theme", newTheme);

      return { theme: newTheme };
    }),
}));

export default useThemeStore;
