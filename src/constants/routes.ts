export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    REGISTER: "/register",
    SETPASSWORD: "/setup-password",
    RESETPASSWORD: "/reset-password"
  },
  MAIN: "/",
  DASHBOARD: "/dashboard",
  ABOUT: "/about",
  NOT_FOUND: "/404",
  MAJOR_PROJECT: "/major-projects",
  VIEW_JOB_ITEM_DETAIL: "/view-job-item-detail",
  VIEW_PROJECT_ITEM_DETAIL: "/view-project-item-detail",
  JOBS_LIST: "/jobs-list"
} as const;

export type Routes = typeof ROUTES;
export type AuthRoutes = typeof ROUTES.AUTH;
export type RoutePaths = Routes[keyof Routes] | AuthRoutes[keyof AuthRoutes];
