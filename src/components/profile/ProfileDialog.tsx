import { Button, Modal } from "antd";
import {
  avatarValidation,
  confirmReLogin,
  confirmTitle,
  couldNotLoadImageDueToAllowedFile,
  couldNotLoadImageDueToFileSize,
  firstName,
  firstNameValidation,
  lastName,
  lastNameValidation,
  reLogIn,
  signIn,
  stringCancel,
  stringChangePassword,
  stringEditProfile,
  stringEmail,
  stringRemove,
  stringSave,
  stringUploadImage,
  stringWarning,
  thisFieldIsRequired,
  yourSessionExpired
} from "@/constants/strings.ts";
import React, { useRef, useState, useEffect } from "react"; // Import useRef
import { ROUTES, THEME } from "@/constants";
import { ProfileModel, useProfileStore } from "@/stores/profileStore.ts";
import InputField from "@/components/common/InputField.tsx";
import { useResponsive } from "@/hooks/useResponsive.ts";
import CustomerAvatar from "@/components/profile/CustomerAvatar.tsx";
import {
  allowedFileExtension,
  allowedFileType,
  imageAllowedFileExtension,
  maxFileSizeBytes,
  maxFileSizeMB,
  nameRegex
} from "@/constants/app_constants.ts";
import { getLocalProfile, removeToken } from "@/utils/authUtils.ts";
import PhoneNumberInput, { PhoneNumberInputRef } from "@/components/common/phone_input_number/PhoneInputNumber.tsx";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { useNavigate } from "react-router-dom";
import { ChangePasswordDialog, ChangePasswordResult } from "@/components/change_password_dialog/ChangePasswordDialog.tsx";
import { WarningDialog } from "@/components/WarningDialog.tsx";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import { UploadAvatarModal } from "@/components/upload_avatar_modal/UploadAvatarModal.tsx";
import { deepCompareObjects } from "@/utils/objectUtil.ts";
import { useShallow } from "zustand/shallow";
import CommonButton from "@/components/common/button/CommonButton.tsx";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file?: File) => void;
  profile: ProfileModel;
}

enum EditingField {
  firstName,
  lastName
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ isOpen, onClose, onSave, profile }) => {
  const { isMobile } = useResponsive();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [openCPDialog, setOpenCPDialog] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isFirstNameValid, setIsFirstNameValid] = useState(true);
  const [firstNameErrorMessage, setFirstNameErrorMessage] = useState("");
  const [isLastNameValid, setIsLastNameValid] = useState(true);
  const [lastNameErrorMessage, setLastNameErrorMessage] = useState("");
  const { updateProfile, closeProfileModal } = useProfileStore(
    useShallow(state => ({
      updateProfile: state.updateProfile,
      closeProfileModal: state.closeProfileModal
    }))
  );
  const activeProfile = getLocalProfile();
  const [isUploadAvatarModalOpen, setIsUploadAvatarModalOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [tempAvatar, setTempAvatar] = useState<File | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<PhoneNumberInputRef>(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [hasPhoneError, setHasPhoneError] = useState(false);

  useEffect(() => {
    if (phoneInputRef.current?.isErrorVisible()) {
      setHasPhoneError(true);
    } else {
      setHasPhoneError(false);
    }
    const enabled = enableOrDisableSaveProfile();
    setIsSaveEnabled(enabled);
  }, [isFirstNameValid, isLastNameValid, activeProfile, profile, phoneInputRef.current]);

  const save = () => {
    onSave(tempAvatar);
    resetState();
    onClose();
  };

  const handleOpenCPDialog = () => {
    setOpenCPDialog(!openCPDialog);
  };
  const handleCloseChangePasswordDialog = (result: ChangePasswordResult) => {
    setOpenCPDialog(false);
    if (result) {
      showToast(result.type, result.message.split("_").join(" "));
      setIsExpired(result.type === ToastType.success);
    }
  };
  const handleCloseExpiredDialog = () => {
    setIsExpired(false);
    closeProfileModal();
    removeToken();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const resetState = () => {
    setFirstNameErrorMessage("");
    setLastNameErrorMessage("");
    setIsFirstNameValid(true);
    setIsLastNameValid(true);
    setTempAvatar(undefined);
    setFileToUpload(null);
  };

  const getErrorMessage = (value: string, type: EditingField) => {
    switch (type) {
      case EditingField.firstName: {
        if (!nameRegex.test(value)) {
          return firstNameValidation;
        }
        return "";
      }
      case EditingField.lastName: {
        if (!nameRegex.test(value)) {
          return lastNameValidation;
        }
        return "";
      }
    }
  };

  const onChanged = (value: string, type: EditingField) => {
    let isValid;
    let errorMessage;
    if (!value) {
      isValid = false;
      errorMessage = thisFieldIsRequired;
    } else if (!nameRegex.test(value)) {
      isValid = false;
      errorMessage = getErrorMessage(value, type);
    } else {
      isValid = true;
      errorMessage = "";
    }
    switch (type) {
      case EditingField.firstName: {
        setIsFirstNameValid(isValid);
        setFirstNameErrorMessage(errorMessage);
        profile.firstName = value;
        break;
      }
      case EditingField.lastName: {
        setIsLastNameValid(isValid);
        setLastNameErrorMessage(errorMessage);
        profile.lastName = value;
        break;
      }
    }
    updateProfile(profile);
  };

  const handleCloseUploadAvatarModal = (isUploaded: boolean, file?: File) => {
    setIsUploadAvatarModalOpen(false);
    if (isUploaded) {
      setTempAvatar(file!);
      profile.avatar = file!.name;
      updateProfile(profile);
    }
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!allowedFileType.includes(file.type)) {
      showToast(ToastType.error, couldNotLoadImageDueToAllowedFile(allowedFileExtension));
      return;
    }

    if (file.size > maxFileSizeBytes) {
      showToast(ToastType.error, couldNotLoadImageDueToFileSize(maxFileSizeMB));
      return;
    }

    setFileToUpload(file);
    setIsUploadAvatarModalOpen(true);
  };

  const handleUploadImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setTempAvatar(undefined);
    profile.avatar = null;
    updateProfile(profile);
  };

  const enableOrDisableSaveProfile = () => {
    if (tempAvatar) {
      return true;
    }
    const isPhoneValid = phoneInputRef.current ? !phoneInputRef.current.isErrorVisible() : true;
    return isFirstNameValid && isLastNameValid && isPhoneValid && !deepCompareObjects(activeProfile, profile);
  };

  const mobileLayout = () => {
    return (
      <Modal
        open={isOpen}
        title={stringEditProfile}
        onCancel={() => {
          resetState();
          onClose();
        }}
        width="360px"
        maskClosable={false}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              resetState();
              onClose();
            }}
            style={{ height: "40px" }}
          >
            {stringCancel}
          </Button>,
          <CommonButton
            key={stringSave}
            style={{ maxWidth: "65px", marginLeft: "10px" }}
            onClick={save}
            label={stringSave}
            disabled={!isSaveEnabled}
          ></CommonButton>
        ]}
        centered
      >
        <div className="flex flex-col pt-[16px] justify-center items-center">
          <CustomerAvatar imageSrc={tempAvatar ? URL.createObjectURL(tempAvatar) : profile.avatar} size="120px" />
          <h2 className="text-[18px] text-gray-900 font-semibold mt-6">
            {activeProfile?.firstName} {activeProfile?.lastName}
          </h2>
          <div className="flex flex-col">
            <div className="mt-3">
              <Button
                key="upload"
                onClick={handleUploadImageClick}
                style={{
                  color: THEME.COLORS.PRIMARY,
                  fontSize: "16px",
                  fontWeight: "semibold",
                  height: "32px"
                }}
              >
                {stringUploadImage}
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept={imageAllowedFileExtension} style={{ display: "none" }} />
              <Button
                key="remove"
                className="ml-2"
                onClick={handleRemoveImage}
                style={{
                  fontSize: "16px",
                  fontWeight: "semibold",
                  height: "32px"
                }}
              >
                {stringRemove}
              </Button>
            </div>
            <h2 className="mt-2 text-xs text-gray-700 font-normal">{avatarValidation}</h2>
          </div>
        </div>
        <div className="mt-8">
          <div>
            <InputField
              label={firstName}
              value={profile.firstName}
              isError={!isFirstNameValid}
              errorText={firstNameErrorMessage}
              onChange={e => onChanged(e.target.value, EditingField.firstName)}
            />
          </div>
          <div className="mt-5">
            <InputField
              label={lastName}
              value={profile.lastName}
              isError={!isLastNameValid}
              errorText={lastNameErrorMessage}
              onChange={e => onChanged(e.target.value, EditingField.lastName)}
            />
          </div>
          <div className="mt-5">
            <InputField label={stringEmail} value={profile.email} disabled={true} />
          </div>
          <div className="mt-5">
            <PhoneNumberInput
              ref={phoneInputRef}
              initialValue={activeProfile?.mobileNumber ? `${activeProfile?.countryCallingCode}${activeProfile?.mobileNumber}` : undefined}
              onValueChange={value => {
                profile.mobileNumber = value;
                updateProfile(profile);
              }}
              onCountryChange={countryCallingCode => {
                profile.countryCallingCode = countryCallingCode;
                updateProfile(profile);
              }}
            />
          </div>
        </div>
        <div className={`${hasPhoneError ? "mt-8" : "mt-5"} mb-[48px]`}>
          <Button key="changePassword" onClick={handleOpenCPDialog} style={{ fontSize: "14px", fontWeight: "semibold", height: "32px" }}>
            {stringChangePassword}
          </Button>
        </div>

        {openCPDialog && <ChangePasswordDialog isOpen={openCPDialog} onClose={handleCloseChangePasswordDialog} />}

        {isUploadAvatarModalOpen && fileToUpload && (
          <UploadAvatarModal
            isOpen={isUploadAvatarModalOpen}
            onClose={handleCloseUploadAvatarModal}
            fileToCrop={fileToUpload}
            currentAvatarUrl={fileToUpload ? URL.createObjectURL(fileToUpload) : undefined}
          />
        )}

        {isExpired && (
          <WarningDialog
            isOpen={isExpired}
            title={stringWarning}
            message={yourSessionExpired}
            confirmButtonText={signIn}
            confirmButtonColor={THEME.COLORS.DANGER}
            onClose={handleCloseExpiredDialog}
          />
        )}
      </Modal>
    );
  };

  const desktopLayout = () => {
    return (
      <Modal
        open={isOpen}
        title={stringEditProfile}
        onCancel={() => {
          resetState();
          onClose();
        }}
        width="640px"
        maskClosable={false}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              resetState();
              onClose();
            }}
            style={{ height: "40px" }}
          >
            {stringCancel}
          </Button>,
          <CommonButton
            key={stringSave}
            style={{ maxWidth: "65px", marginLeft: "10px" }}
            onClick={save}
            label={stringSave}
            disabled={!isSaveEnabled}
          ></CommonButton>
        ]}
        centered
      >
        <div className="flex pt-[16px]">
          <CustomerAvatar imageSrc={tempAvatar ? URL.createObjectURL(tempAvatar) : profile.avatar} size="120px" />
          <div className="ml-[32px] flex flex-col">
            <h2 className="text-[18px] text-gray-900 font-semibold">
              {activeProfile?.firstName} {activeProfile?.lastName}
            </h2>
            <div className="flex gap-2 mt-[24px]">
              <Button
                key="upload"
                onClick={handleUploadImageClick}
                style={{
                  color: THEME.COLORS.PRIMARY,
                  fontSize: "16px",
                  fontWeight: "semibold",
                  height: "32px"
                }}
              >
                {stringUploadImage}
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelected} accept={imageAllowedFileExtension} style={{ display: "none" }} />
              <Button
                key="remove"
                onClick={handleRemoveImage}
                style={{
                  fontSize: "16px",
                  fontWeight: "semibold",
                  height: "32px"
                }}
              >
                {stringRemove}
              </Button>
            </div>
            <div className="mt-2">
              <h2 className="text-xs text-gray-700 font-normal">{avatarValidation}</h2>
            </div>
          </div>
        </div>
        <div className="flex w-full mt-8">
          <div className="flex-1 pr-2">
            <InputField
              label={firstName}
              value={profile.firstName}
              isError={!isFirstNameValid}
              errorText={firstNameErrorMessage}
              onChange={e => onChanged(e.target.value, EditingField.firstName)}
            />
          </div>
          <div className="flex-1 pl-2">
            <InputField
              label={lastName}
              value={profile.lastName}
              isError={!isLastNameValid}
              errorText={lastNameErrorMessage}
              onChange={e => onChanged(e.target.value, EditingField.lastName)}
            />
          </div>
        </div>
        <div className="flex w-full mt-5">
          <div className="flex-1 pr-2">
            <InputField label={stringEmail} value={profile.email} disabled={true} />
          </div>
          <div className="flex-1 pl-2">
            <PhoneNumberInput
              ref={phoneInputRef}
              initialValue={activeProfile?.mobileNumber ? `${activeProfile?.countryCallingCode}${activeProfile?.mobileNumber}` : undefined}
              onValueChange={value => {
                profile.mobileNumber = value;
                updateProfile(profile);
              }}
              onCountryChange={countryCallingCode => {
                profile.countryCallingCode = countryCallingCode;
                updateProfile(profile);
              }}
            />
          </div>
        </div>
        <div className="mt-5 mb-[30px]">
          <Button key="changePassword" onClick={handleOpenCPDialog} style={{ fontSize: "14px", fontWeight: "semibold", height: "32px" }}>
            {stringChangePassword}
          </Button>
        </div>
        {openCPDialog && <ChangePasswordDialog isOpen={openCPDialog} onClose={handleCloseChangePasswordDialog} />}

        {isUploadAvatarModalOpen && fileToUpload && (
          <UploadAvatarModal
            isOpen={isUploadAvatarModalOpen}
            onClose={handleCloseUploadAvatarModal}
            fileToCrop={fileToUpload}
            currentAvatarUrl={fileToUpload ? URL.createObjectURL(fileToUpload) : undefined}
          />
        )}

        {isExpired ? (
          <WarningDialog
            isOpen={isExpired}
            title={confirmTitle}
            message={confirmReLogin}
            confirmButtonText={reLogIn}
            confirmButtonColor={THEME.COLORS.DANGER}
            onClose={handleCloseExpiredDialog}
          />
        ) : null}
      </Modal>
    );
  };

  return isMobile ? mobileLayout() : desktopLayout();
};
