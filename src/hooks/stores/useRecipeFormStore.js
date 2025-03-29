import { create } from "zustand";

export const recipeDefaultValues = {
  firstStepValues: {
    title: "",
    originProvince: "",
    foodCategory: "",
    description: "",
  },

  secondStepValues: {
    ingredients: [{ quantity: "", unit: "", name: "" }],
    procedure: [{ stepNumber: 1, content: "" }],
  },

  thirdStepValues: {
    mainPicture: null,
    video: null,
    additionalPictures: [],
  },
};

const useRecipeFormStore = create((set, get) => ({
  ...recipeDefaultValues,

  setFirstStepValues: (data) => set({ firstStepValues: data }),
  setSecondStepValues: (data) => set({ secondStepValues: data }),
  setThirdStepValues: (data) => set({ thirdStepValues: data }),

  getFirstStepValues: () => get().firstStepValues,
  getSecondStepValues: () => get().secondStepValues,
  getThirdStepValues: () => get().thirdStepValues,

  clearStepsValues: () => set({ ...recipeDefaultValues }),
}));

export default useRecipeFormStore;
