import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set) => ({
  // States
  user: null,
  isLoading: false,
  apiError: null,

  //  Actions
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      console.log(`Login on process. ${email}, ${password}`);

      await axios.post(
        "http://localhost:4000/api/auth/login",
        { email, password },
        { withCredentials: true } // For cookies
      );

      // Fetch user data after login
      const response = await axios.get(
        "http://localhost:4000/api/auth/user-details/",
        {
          withCredentials: true,
        }
      );

      console.log(`Login Success. Data: ${response.data}`);

      set({ user: response.data, isLoading: false, apiError: null });

      return { success: true };
    } catch (err) {
      console.log(`Error on Login. Error: ${err.response?.data?.message}`);

      set({
        apiError: err.response?.data?.message || "Login failed",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await axios.post(
      "http://localhost:4000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    set({ user: null });
  },

  fetchUser: async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/auth/user-details/",
        {
          withCredentials: true,
        }
      );
      set({ user: response.data });
    } catch (err) {
      set({ user: null });
    }
  },
}));

export default useAuthStore;
