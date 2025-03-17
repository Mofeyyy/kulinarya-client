import { create } from "zustand";

const usePageStore = create((set) => ({
  page: { href: "", name: "" },
  subPage: { href: "", name: "" },

  setPage: (page) => set({ page }),
  setSubPage: (subPage) => set({ subPage }),
  clearPages: () =>
    set({ page: { href: "", name: "" }, subPage: { href: "", name: "" } }),
}));

export default usePageStore;
