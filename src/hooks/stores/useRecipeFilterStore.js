import { create } from "zustand";

export const useRecipeFilterStore = create((set) => ({
  origin: "",
  category: "",
  search: "",

  setOrigin: (origin) => set({ origin }),
  setCategory: (category) => set({ category }),
  setSearch: (search) => set({ search }),

  page: 1,
  limit: 10,
  sortOrder: "newest",

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSortOrder: (sortOrder) => set({ sortOrder }),

  totalRecipeCount: 0,
  setTotalRecipeCount: (count) => set({ totalRecipeCount: count }),

  resetFilters: () =>
    set({
      origin: "",
      category: "",
      search: "",
    }),
}));

export default useRecipeFilterStore;
