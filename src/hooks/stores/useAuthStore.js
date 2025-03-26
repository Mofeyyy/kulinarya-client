import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      userDetails: null,
      isLoggedIn: false,

      setUserDetails: (user) => set({ userDetails: user }),
      setIsLoggedIn: (status) => set({ isLoggedIn: status }),

      login: (user) => set({ userDetails: user, isLoggedIn: true }),
      logout: () => set({ userDetails: null, isLoggedIn: false }),

      updateProfilePicture: (profilePictureUrl) =>
        set((state) => ({
          userDetails: {
            ...state.userDetails,
            profilePictureUrl, // Update only the profile picture
          },
        })),
    }),

    // Persist to Local Storage
    {
      name: "kulinarya-auth-storage",
      partialize: (state) => ({
        userDetails: state.userDetails,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
