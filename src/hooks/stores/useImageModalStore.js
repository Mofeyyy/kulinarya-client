import { create } from "zustand";

const useImageModalStore = create((set) => ({
  isImageModalOpen: false,
  imageSrc: "",

  openImageModal: (src) => set({ isImageModalOpen: true, imageSrc: src }),
  closeImageModal: () => set({ isImageModalOpen: false, imageSrc: "" }),
}));

export default useImageModalStore;
