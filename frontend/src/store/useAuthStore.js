import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isRegistering: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/check_auth");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isRegistering: true });
    try {
      const res = await axiosInstance.post("/users/register", data);
      set({ authUser: res.data });
    } finally {
      set({ isRegistering: false });
    }
  },
  logout: async () => {
    await axiosInstance.post("/users/logout");
    set({ authUser: null });
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error logging in:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
}));
