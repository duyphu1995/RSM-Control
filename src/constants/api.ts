export const API = {
  BASE_URL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      ME: "/auth/me"
    },
    USERS: "/users",
    PRODUCTS: "/products"
  }
} as const;

export type ApiEndpoints = typeof API.ENDPOINTS;
export type AuthEndpoints = typeof API.ENDPOINTS.AUTH;
export type EndpointPaths = ApiEndpoints[keyof ApiEndpoints] | AuthEndpoints[keyof AuthEndpoints];
