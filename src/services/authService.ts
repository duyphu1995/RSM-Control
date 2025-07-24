import { service } from "./api";

interface AuthCredentials {
  email: string;
  password?: string;
  loginType?: string;
}

interface AuthResponse {
  token: string;
  userId: string;
}

interface ProfileRequest {
  firstName: string;
  lastName: string;
  countryCallingCode?: string;
  mobileNumber?: string;
}

export interface ProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  countryCallingCode?: string;
  mobileNumber?: string;
  avatar?: string;
}

export const authService = {
  login: (credentials: AuthCredentials) => service.post<AuthResponse>("/customers/login", credentials),
  logout: () => service.post("/customers/logout"),
  forgotPassword: (model: AuthCredentials) => service.post("/customers/forgot-password", model),
  updateProfile: (model: ProfileRequest) => service.put<ProfileResponse>("/customers/edit-profile", model),
  getCustomerProfile: () => service.get<ProfileResponse>("/customers/user-info")
};
