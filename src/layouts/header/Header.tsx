import React, { useState, useEffect } from "react";
import { Images } from "@/constants/images.tsx";
import { useNavigate } from "react-router";
import "./header.css";
import { ROUTES, THEME } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { authService, ProfileResponse } from "@/services/authService.ts";
import { ConfirmDialog } from "@/components/ConfirmDialog.tsx";
import { confirmSignOut, confirmSignOutMessage, signOut, SitesSketches, MajorProjects } from "@/constants/strings.ts";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import { getLocalProfile, removeToken, saveProfileData } from "@/utils/authUtils.ts";
import { useProfileStore, ProfileModel } from "@/stores/profileStore.ts";
import { useShallow } from "zustand/shallow";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import CustomerAvatar from "@/components/profile/CustomerAvatar.tsx";
import { MenuItem, useSidebarStore } from "@/stores/sidebarStore.ts";
import { ErrorResponse } from "@/services/api.ts";
import { ToastType } from "@/components/common/toast/Toast";

export const HeaderDesktop: React.FC = () => {
  const navigate = useNavigate();
  const activeProfile = getLocalProfile();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { activeTab, setActiveTab } = useSidebarStore(
    useShallow(state => ({
      activeTab: state.selectedItem,
      setActiveTab: state.setSelectedItem
    }))
  );

  const { openProfileModal, updateProfile } = useProfileStore(
    useShallow(state => ({
      openProfileModal: state.openProfileModal,
      updateProfile: state.updateProfile
    }))
  );
  const { setSidebarSelectedItem } = useSidebarStore(
    useShallow(state => ({
      setSidebarSelectedItem: state.setSelectedItem
    }))
  );
  const { showToast } = useToast();

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

  const navigateTab = (tabName: MenuItem) => {
    setActiveTab(tabName);
    switch (tabName) {
      case MenuItem.siteSketches:
        navigate(`${ROUTES.MAIN}?tab=${tabName}`);
        break;
      case MenuItem.majorlProject:
        navigate(`${ROUTES.MAJOR_PROJECT}?tab=${tabName}`);
        break;
    }
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
      saveProfileData(data, true);
    },
    onError: (error: any) => {
      showToast(ToastType.error, error.message);
    }
  });

  // Set active tab when reload/refresh page
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab") as MenuItem;

    if (tab === MenuItem.siteSketches || tab === MenuItem.majorlProject) {
      setActiveTab(tab);
    } else {
      setActiveTab(MenuItem.siteSketches);
    }
    getProfileMutation.mutate();
  }, []);

  /**
   * Triggered when the user clicks "View Profile".
   * - Closes any open pickers (calendar, dropdown, etc.)
   * - Calls the profile API to fetch the latest data
   * - Opens the profile modal only after the profile has been successfully fetched
   */
  const handleOpenProfileModal = () => {
    window.dispatchEvent(new Event("closeAllPickers"));
    getProfileMutation.mutate(undefined, {
      onSuccess: () => {
        openProfileModal();
      }
    });
  };

  return (
    <div className="navigation bg-orange-600 inline-flex self-stretch justify-between items-center px-2.5 bg-cover bg-center overflow-hidden w-full h-14">
      {/* Left header */}
      <div className="self-stretch relative justify-start items-start gap-2 w-1/2">
        <div
          onClick={() => navigateTab(MenuItem.siteSketches)}
          className="w-48 h-6 absolute top-1/2 left-24 -translate-x-1/2 -translate-y-1/2 items-center inline-flex cursor-pointer"
        >
          <img src={Images.LogoIconCustomerSite} className="w-10 h-6 pr-2" alt="" />
          <img src={Images.LogoLetterCustomerSite} className="w-36 h-3.5" alt="" />
        </div>
      </div>

      {/* Right of Header */}
      <div className="self-stretch relative inline-flex justify-end items-start gap-2 w-1/2">
        <div className="w-full h-full items-center inline-flex gap-2 absolute justify-end">
          <div className="h-full inline-flex">
            <div
              className={`inline-flex whitespace-nowrap justify-center items-center px-6 py-3 text-sm leading-tight w-1/2 h-full cursor-pointer ${activeTab === MenuItem.siteSketches ? "text-white" : "text-[#FFFFFF99]"}`}
              onClick={() => navigateTab(MenuItem.siteSketches)}
            >
              {SitesSketches}
            </div>
            <div
              className={`inline-flex justify-center items-center px-6 py-3 text-sm leading-tight w-1/2 h-full cursor-pointer whitespace-nowrap ${activeTab === MenuItem.majorlProject ? "text-white" : "text-[#FFFFFF99]"}`}
              onClick={() => navigateTab(MenuItem.majorlProject)}
            >
              {MajorProjects}
            </div>
          </div>

          <div
            className="bg-white/10 rounded-sm items-center gap-1.5 cursor-pointer mt-[10px] mb-[10px] inline-flex h-[36px] pl-2 pr-2"
            onClick={handleOpenProfileModal}
          >
            <div className="border-white border rounded-full">
              <CustomerAvatar imageSrc={activeProfile?.avatar} size="20px" />
            </div>
            <div className="text-right justify-start text-white text-sm font-medium leading-tight whitespace-nowrap">
              {`${activeProfile?.firstName} ${activeProfile?.lastName}`}
            </div>
          </div>
          <span className="rounded-sm bg-white/10 cursor-pointer mr-6 w-[36px] h-[36px] justify-center items-center flex shrink-0">
            <img className="object-cover object-center w-[16px] h-[16px]" src={Images.LogoutIconCustomerSite} onClick={logoutClick} alt="" />
          </span>
        </div>
      </div>
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        width="448px"
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
    </div>
  );
};
