declare module "./routes" {
  const ROUTES: {
    AUTH: {
      LOGIN: string;
      REGISTER: string;
    };
    DASHBOARD: string;
    ABOUT: string;
    NOT_FOUND: string;
  };
  export type Routes = typeof ROUTES;
  export type AuthRoutes = typeof ROUTES.AUTH;
  export type RoutePaths = Routes[keyof Routes] | AuthRoutes[keyof AuthRoutes];
  export default ROUTES;
}

declare module "./api" {
  const API: {
    BASE_URL: string;
    ENDPOINTS: {
      AUTH: {
        LOGIN: string;
        REGISTER: string;
        ME: string;
      };
      USERS: string;
      PRODUCTS: string;
    };
  };
  export type ApiEndpoints = typeof API.ENDPOINTS;
  export type AuthEndpoints = typeof API.ENDPOINTS.AUTH;
  export type EndpointPaths = ApiEndpoints[keyof ApiEndpoints] | AuthEndpoints[keyof AuthEndpoints];
  export default API;
}

declare module "./theme" {
  const THEME: {
    COLORS: {
      PRIMARY: string;
      SECONDARY: string;
      SUCCESS: string;
      DANGER: string;
      WARNING: string;
      INFO: string;
      LIGHT: string;
      DARK: string;
      WHITE: string;
      BLACK: string;
    };
    SPACING: {
      SMALL: string;
      MEDIUM: string;
      LARGE: string;
      XLARGE: string;
    };
    BREAKPOINTS: {
      MOBILE: string;
    };
  };
  export type ThemeColors = typeof THEME.COLORS;
  export type ThemeSpacing = typeof THEME.SPACING;
  export type ThemeBreakpoints = typeof THEME.BREAKPOINTS;
  export default THEME;
}
