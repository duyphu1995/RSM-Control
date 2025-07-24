import React, { useState, useEffect } from "react";
import { Images } from "@/constants/images.tsx";
import { confirmSignOut, confirmSignOutMessage, signOut } from "@/constants/strings.ts";
import { ConfirmDialog } from "@/components/ConfirmDialog.tsx";
import { ROUTES, THEME } from "@/constants";
import { getLocalProfile, removeToken, saveProfileData } from "@/utils/authUtils.ts";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import { useNavigate } from "react-router";
import { ProfileModel, useProfileStore } from "@/stores/profileStore.ts";
import { useShallow } from "zustand/shallow";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { useMutation } from "@tanstack/react-query";
import { authService, ProfileResponse } from "@/services/authService.ts";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import Sidebar from "@/layouts/header/Sidebar.tsx";
import { MenuItem, useSidebarStore } from "@/stores/sidebarStore.ts";
import { ErrorResponse } from "@/services/api.ts";

export const HeaderMobile: React.FC = () => {
  const navigate = useNavigate();
  const [activeProfile, setActiveProfile] = useState<ProfileModel | undefined>(undefined);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { openProfileModal, updateProfile } = useProfileStore(
    useShallow(state => ({
      openProfileModal: state.openProfileModal,
      updateProfile: state.updateProfile
    }))
  );

  const { showToast } = useToast();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setActiveProfile(getLocalProfile() ?? undefined);
  }, []);

  const showDrawer = () => {
    window.dispatchEvent(new Event("closeAllPickers"));
    setIsSidebarOpen(true);
  };

  const onCloseDrawer = () => {
    setIsSidebarOpen(false);
  };

  const { setSidebarSelectedItem } = useSidebarStore(
    useShallow(state => ({
      setSidebarSelectedItem: state.setSelectedItem
    }))
  );

  const logoutClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsLogoutDialogOpen(true);
  };

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setIsLogoutDialogOpen(false);
      removeToken();
      setSidebarSelectedItem(MenuItem.siteSketches);
      window.location.href = ROUTES.AUTH.LOGIN;
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const backToHome = () => {
    setSidebarSelectedItem(MenuItem.siteSketches);
    navigate("/");
  };

  // Mutation to fetch the latest profile data from the server.
  // After success: updates Zustand store, localStorage, and opens the profile modal.
  const getProfileMutation = useMutation({
    mutationFn: authService.getCustomerProfile,
    onSuccess: (data: ProfileResponse) => {
      const profileModel: ProfileModel = {
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        countryCallingCode: data.countryCallingCode,
        avatar: data.avatar ?? null
      };
      updateProfile(profileModel);
      setActiveProfile(profileModel);
      saveProfileData(data, true);

      openProfileModal();
    },
    onError: (error: any) => {
      showToast(ToastType.error, error.message);
    }
  });

  /**
   * Handle profile view click from the sidebar.
   * - Close the sidebar
   * - Fetch fresh profile data from the server
   * - The modal will be opened after successful fetch (inside onSuccess)
   */
  const handleOpenProfileModal = () => {
    window.dispatchEvent(new Event("closeAllPickers"));
    getProfileMutation.mutate();
    onCloseDrawer();
  };

  return (
    <>
      <div className="bg-orange-500 inline-flex justify-between items-center px-2.5 bg-cover bg-center overflow-hidden w-full h-14">
        <button className="p-2 rounded-full hover:bg-white/20 cursor-pointer">
          <img src={Images.IconMenu} alt="menu" onClick={showDrawer} />
        </button>

        <div className="text-white flex items-center justify-center cursor-pointer">
          <img src={Images.LogoIconCustomerSite} alt="menu" onClick={backToHome} />
        </div>

        <button className="p-2 rounded-full hover:bg-white/20 cursor-pointer">
          <img src={Images.LogoutIconCustomerSite} alt="menu" onClick={logoutClick} />
        </button>
      </div>
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        width="312px"
        title={confirmSignOut}
        message={confirmSignOutMessage}
        confirmButtonText={signOut}
        confirmButtonColor={THEME.COLORS.DANGER}
        onClose={() => {
          setIsLogoutDialogOpen(false);
        }}
        onConfirm={() => {
          logoutMutation.mutate();
        }}
      />
      <LoadingComponent isPending={logoutMutation.isPending} />
      {/* Ant Design Drawer as Sidebar */}
      <Sidebar
        onCloseDrawer={onCloseDrawer}
        isSidebarOpen={isSidebarOpen}
        avatar={activeProfile?.avatar}
        onLogout={() => {
          setIsLogoutDialogOpen(true);
          onCloseDrawer();
        }}
        onShowProfile={handleOpenProfileModal}
      />
    </>
  );
};
