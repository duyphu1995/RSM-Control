import { Navigate } from "react-router-dom";
import React, { ReactElement, useEffect, useState } from "react";
import { HeaderDesktop } from "@/layouts/header/Header.tsx";
import { HeaderMobile } from "@/layouts/header/Header_mobile.tsx";
import { ROUTES } from "@/constants";
import { getBearerToken, getLocalProfile, saveProfileData } from "@/utils/authUtils.ts";
import { ProfileDialog } from "@/components/profile/ProfileDialog.tsx";
import { useProfileStore } from "@/stores/profileStore.ts";
import { useShallow } from "zustand/shallow";
import { useMutation } from "@tanstack/react-query";
import { authService, ProfileResponse } from "@/services/authService.ts";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import { yourProfileChangedSuccessfully } from "@/constants/strings.ts";
import { customerAvatarService } from "@/services/avatarService.ts";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import { ErrorResponse } from "@/services/api.ts";

interface PrivateRouteProps {
  element: ReactElement;
  isMobile: boolean;
}

export const MainLayout: React.FC<PrivateRouteProps> = ({ element, isMobile }) => {
  const isLoggedIn = getBearerToken();
  const [profileModalKey, setProfileModalKey] = useState(0);
  const activeProfile = getLocalProfile();
  const { profile, isVisible, closeProfileModal, updateProfileFunc } = useProfileStore(
    useShallow(state => ({
      profile: state.profile,
      isVisible: state.isVisible,
      closeProfileModal: state.closeProfileModal,
      updateProfileFunc: state.updateProfile
    }))
  );
  const { showToast } = useToast();

  useEffect(() => {
    if (activeProfile && activeProfile?.email !== profile?.email) {
      updateProfileFunc(activeProfile);
    }
  }, []);

  const updateProfileMutation = useMutation({
    mutationFn: authService.updateProfile,
    onSuccess: (data: ProfileResponse) => {
      saveProfileData(data);
      onCloseProfileModal();
      updateProfileFunc(getLocalProfile()!);
      showToast(ToastType.success, yourProfileChangedSuccessfully);
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file?: File) => customerAvatarService.changeAvatar(file),
    onSuccess: (data: ProfileResponse) => {
      saveProfileData(data);
      updateProfileFunc(getLocalProfile()!);
      showToast(ToastType.success, "Avatar updated successfully!");
    },
    onError: (err: ErrorResponse) => {
      showToast(ToastType.error, err.message);
    }
  });

  const onCloseProfileModal = () => {
    closeProfileModal();
    setProfileModalKey(prevKey => prevKey + 1);
  };

  return isLoggedIn ? (
    <div>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />} {element}
      <ProfileDialog
        key={profileModalKey}
        isOpen={isVisible}
        onClose={() => {
          onCloseProfileModal();
          updateProfileFunc(getLocalProfile()!);
        }}
        onSave={file => {
          if (
            activeProfile?.firstName !== profile.firstName ||
            activeProfile?.lastName !== profile.lastName ||
            activeProfile?.mobileNumber != profile.mobileNumber ||
            activeProfile?.countryCallingCode !== profile.countryCallingCode
          ) {
            updateProfileMutation.mutate({
              firstName: profile.firstName,
              lastName: profile.lastName,
              countryCallingCode: profile.countryCallingCode,
              mobileNumber: profile.mobileNumber
            });
          }
          if (activeProfile?.avatar !== profile.avatar) {
            uploadAvatarMutation.mutate(file);
          }
        }}
        profile={profile}
      />
      <LoadingComponent isPending={updateProfileMutation.isPending || uploadAvatarMutation.isPending} />
    </div>
  ) : (
    <Navigate to={ROUTES.AUTH.LOGIN} />
  );
};
