import React from "react";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useResponsive } from "@/hooks/useResponsive";
import { MainLayout } from "./layouts/MainLayout.tsx";
import { ROUTES, THEME } from "@/constants";

// Import for Desktop version
import { BackgroundPageDesktop } from "@/layouts/background_layout/BackgroundPage.tsx";
import { SiteSketches } from "./layouts/Desktop/SiteSketches";
import { ToastProvider } from "@/components/common/toast/ToastProvider.tsx";

// Import for Mobile version
import { BackgroundPageMobile } from "@/layouts/background_layout/BackgroundPage_mobile.tsx";
import { SiteSketchesMobile } from "./layouts/Mobile/SiteSketches";
import { BackgroundLayoutType } from "@/layouts/background_layout/backgroundLayoutType.ts";
import { getBearerToken, isTokenExpired, removeToken } from "@/utils/authUtils.ts";
import { WarningDialog } from "@/components/WarningDialog.tsx";
import { signIn, stringWarning, yourSessionExpired } from "@/constants/strings.ts";
import { useAuthStore } from "@/stores/authStore.ts";
import { useShallow } from "zustand/shallow";
import MajorProjectsDesktop from "./layouts/Desktop/MajorProjects/index.tsx";
import MajorProjectJobsList from "./layouts/Desktop/MajorProjects/JobsList/index.tsx";
import { ViewJobItemDetailPage } from "@/layouts/view_job_item_detail/ViewJobItemDetailPage.tsx";
import { ViewProjectItemDetailPage } from "@/layouts/view_project_item_detail/ViewProjectItemDetailPage.tsx";

// Create a client
const queryClient = new QueryClient();

const ResponsiveApp: React.FC = () => {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const { isExpired, setIsExpired, message, setMessage } = useAuthStore(
    useShallow(state => ({
      isExpired: state.isExpired,
      setIsExpired: state.setIsExpired,
      message: state.message,
      setMessage: state.setMessage
    }))
  );

  const ProtectedRoute = () => {
    const token = getBearerToken();
    const location = useLocation();

    if (isTokenExpired()) {
      removeToken();
      setIsExpired(true);
      return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    } else if (location.pathname === ROUTES.AUTH.LOGIN && token) return <Navigate to={ROUTES.MAIN} replace />;
    else return <Outlet />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="mx-auto w-full">
          {isMobile ? (
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.AUTH.LOGIN} element={<BackgroundPageMobile layoutType={BackgroundLayoutType.login} />} />
                <Route path={ROUTES.AUTH.SETPASSWORD} element={<BackgroundPageMobile layoutType={BackgroundLayoutType.setPassword} />} />
                <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<BackgroundPageMobile layoutType={BackgroundLayoutType.forgotPassword} />} />
                <Route path={ROUTES.AUTH.RESETPASSWORD} element={<BackgroundPageMobile layoutType={BackgroundLayoutType.resetPassword} />} />
                <Route path={ROUTES.MAIN} element={<MainLayout isMobile={isMobile} element={<SiteSketchesMobile />} />} />
                <Route path={ROUTES.MAJOR_PROJECT} element={<MainLayout isMobile={isMobile} element={<MajorProjectsDesktop />} />} />
                <Route path={ROUTES.JOBS_LIST} element={<MainLayout isMobile={isMobile} element={<MajorProjectJobsList />} />} />
                <Route path={ROUTES.VIEW_JOB_ITEM_DETAIL} element={<MainLayout element={<ViewJobItemDetailPage />} isMobile={isMobile} />} />
                <Route path={ROUTES.VIEW_PROJECT_ITEM_DETAIL} element={<MainLayout element={<ViewProjectItemDetailPage />} isMobile={isMobile} />} />
              </Route>
            </Routes>
          ) : (
            <Routes>
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.AUTH.LOGIN} element={<BackgroundPageDesktop layoutType={BackgroundLayoutType.login} />} />
                <Route path={ROUTES.AUTH.SETPASSWORD} element={<BackgroundPageDesktop layoutType={BackgroundLayoutType.setPassword} />} />
                <Route path={ROUTES.AUTH.FORGOT_PASSWORD} element={<BackgroundPageDesktop layoutType={BackgroundLayoutType.forgotPassword} />} />
                <Route path={ROUTES.AUTH.RESETPASSWORD} element={<BackgroundPageDesktop layoutType={BackgroundLayoutType.resetPassword} />} />
                <Route path={ROUTES.MAIN} element={<MainLayout element={<SiteSketches />} isMobile={isMobile} />} />
                <Route path={ROUTES.MAJOR_PROJECT} element={<MainLayout isMobile={isMobile} element={<MajorProjectsDesktop />} />} />
                <Route path={ROUTES.JOBS_LIST} element={<MainLayout isMobile={isMobile} element={<MajorProjectJobsList />} />} />
                <Route path={ROUTES.VIEW_JOB_ITEM_DETAIL} element={<MainLayout element={<ViewJobItemDetailPage />} isMobile={isMobile} />} />
                <Route path={ROUTES.VIEW_PROJECT_ITEM_DETAIL} element={<MainLayout element={<ViewProjectItemDetailPage />} isMobile={isMobile} />} />
              </Route>
            </Routes>
          )}
          {isExpired ? (
            <WarningDialog
              isOpen={isExpired}
              title={stringWarning}
              message={!message ? yourSessionExpired : message}
              confirmButtonText={signIn}
              confirmButtonColor={THEME.COLORS.DANGER}
              onClose={() => {
                removeToken();
                navigate(ROUTES.AUTH.LOGIN);
                setIsExpired(false);
                setMessage("");
              }}
            />
          ) : null}
        </div>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default ResponsiveApp;
