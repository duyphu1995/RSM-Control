import { create } from "zustand";

interface ProfileStore {
  isExpired: boolean;
  message: string;
  setIsExpired: (isExpired: boolean) => void;
  setMessage: (message: string) => void;
}

export const useAuthStore = create<ProfileStore>(set => ({
  isExpired: false,
  message: "",
  setIsExpired: value => set({ isExpired: value }),
  setMessage: value => set({ message: value })
}));
