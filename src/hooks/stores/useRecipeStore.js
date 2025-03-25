import { create } from "zustand";

const useRecipeStore = create((set) => ({
  recipe: null,

  setRecipe: (recipeData) => set({ recipe: recipeData }),
  clearRecipe: () => set({ recipe: null }),
}));

export default useRecipeStore;
