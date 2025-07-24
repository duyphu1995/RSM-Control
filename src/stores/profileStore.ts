import { create } from "zustand";

export interface ProfileModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  countryCallingCode?: string;
  avatar: string | null;
}

interface ProfileStore {
  profile: ProfileModel;
  isVisible: boolean;
  updateProfile: (profile: ProfileModel) => void;
  openProfileModal: () => void;
  closeProfileModal: () => void;
}

export const useProfileStore = create<ProfileStore>(set => ({
  profile: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    avatar: "",
    countryCallingCode: ""
  },
  isVisible: false,
  updateProfile: (newProfile: ProfileModel) => {
    set(state => ({
      profile: {
        ...state.profile,
        ...newProfile
      }
    }));
  },
  openProfileModal: () => set({ isVisible: true }),
  closeProfileModal: () => set({ isVisible: false })
}));
