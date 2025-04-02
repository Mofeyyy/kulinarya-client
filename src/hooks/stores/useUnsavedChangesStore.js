import { create } from "zustand";

const useUnsavedChangesStore = create((set) => ({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
}));

export default useUnsavedChangesStore;
