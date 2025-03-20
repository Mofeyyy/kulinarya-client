import { create } from "zustand";

const useMediaPreviewStore = create((set) => ({
  mediaPreview: {
    mainPictureUrl: "",
    videoUrl: "",
    additionalPicturesUrls: [],
  },
  fileNames: {
    mainPicture: "",
    video: "",
    additionalPictures: [],
  },

  setMediaPreview: (updateFn) =>
    set((state) => ({
      mediaPreview: { ...state.mediaPreview, ...updateFn(state.mediaPreview) },
    })),

  setFileNames: (updateFn) =>
    set((state) => ({
      fileNames: { ...state.fileNames, ...updateFn(state.fileNames) },
    })),

  resetAllMediaPreview: () =>
    set(() => ({
      mediaPreview: {
        mainPictureUrl: "",
        videoUrl: "",
        additionalPicturesUrls: [],
      },
      fileNames: {
        mainPicture: "",
        video: "",
        additionalPictures: [],
      },
    })),
}));

export default useMediaPreviewStore;
