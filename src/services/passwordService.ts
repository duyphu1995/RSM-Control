import { service } from "./api";

interface PasswordService {
  email: string;
  password: string;
}

interface checkTokenRequest {
  token: string;
}

interface EmailResponse {
  email: string;
}

export const customerService = {
  resetPassword: (token: string, credentials: PasswordService) =>
    service.put(`/customers/setup-password?token=${encodeURIComponent(token)}`, credentials),
  changePassword: (credentials: PasswordService) => service.put<PasswordService>("/customers/change-password", credentials),
  setupPassword: (token: string, credentials: PasswordService) =>
    service.put(`/customers/setup-password?token=${encodeURIComponent(token)}`, credentials),
  getEmailByToken: ({ token }: checkTokenRequest) => service.get<EmailResponse>(`/customers/setup-password?token=${encodeURIComponent(token)}`)
};
