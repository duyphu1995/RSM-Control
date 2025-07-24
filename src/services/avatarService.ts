import { service } from "./api";
import { AxiosRequestConfig } from "axios";
import { ProfileResponse } from "@/services/authService.ts";

export const customerAvatarService = {
  changeAvatar: (file?: File) => {
    const config: AxiosRequestConfig = {};
    config.headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();
    if (file) {
      formData.append("avatarFile", file);
    }
    return service.put<ProfileResponse>("/customers/change-avatar", formData, config);
  }
};
