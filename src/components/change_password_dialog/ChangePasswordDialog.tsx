import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "antd"; // Import Modal from antd
import {
  changePassword,
  changePasswordSuccessfully,
  confirmChangePassword,
  confirmChangePasswordMessage,
  confirmnPasswordStr,
  confirmPasswordStr,
  confirmText,
  cPasswordStr,
  entercPasswordStr,
  enternPasswordStr,
  errAtLeast8CharMsg,
  errContainAtLeastLetterAndDigitMsg,
  errorMatchingPassword,
  nPasswordStr,
  pleaseConfirmNewPassword,
  pleaseEnterCurrentPassword,
  stringCancel
} from "@/constants/strings.ts";
import { Images } from "@/constants/images.tsx";
import InputField from "@/components/common/InputField.tsx";
import { hasDigitRegex, hasLetterRegex, minLengthRegex } from "@/constants/app_constants.ts";
import { THEME } from "@/constants/theme.ts";
import { PasswordRules } from "@/components/common/PasswordRules.tsx";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import { useMutation } from "@tanstack/react-query";
import { customerService } from "@/services/passwordService.ts";
import { getAccountEmail } from "@/utils/authUtils.ts";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import { ErrorResponse } from "@/services/api.ts";
import { ConfirmDialog } from "@/components/ConfirmDialog.tsx";
import CommonButton from "@/components/common/button/CommonButton.tsx";

// Define props for the dialog
interface ChangePasswordDialogProps {
  isOpen: boolean; // Controls visibility of the dialog
  onClose: (result: ChangePasswordResult) => void; // Function to close the dialog
}

// Define the result type that ChangePasswordDialog will return
export type ChangePasswordResult = {
  type: ToastType;
  message: string;
} | null;

export const ChangePasswordDialog: React.FC<ChangePasswordDialogProps> = ({ isOpen, onClose }) => {
  // States for the three password fields
  const [currentPassword, setCurrentPassword] = useState(entercPasswordStr);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Error states for individual fields
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const [isFormValid, setIsFormInvalid] = useState(true); // State to control button disabled

  const [passwordRules, setPasswordRules] = useState({
    length: {
      icon: Images.IconCheckInit,
      color: THEME.COLORS.PASSWORD.INIT
    },
    letterAndDigit: {
      icon: Images.IconCheckInit,
      color: THEME.COLORS.PASSWORD.INIT
    }
  });

  const handleNewPasswordFocus = () => {
    setIsNewPasswordFocused(true);
  };

  const handleNewPasswordBlur = () => {
    setIsNewPasswordFocused(false);
    validateNewPasswordRules(newPassword);
  };

  const shouldShowPasswordRules = isNewPasswordFocused || newPassword.length > 0;

  // Helper function to update password rule display
  const updatePasswordRule = (rule: keyof typeof passwordRules, icon: string, color: string) => {
    setPasswordRules(prevState => ({
      ...prevState,
      [rule]: {
        ...prevState[rule],
        icon,
        color
      }
    }));
  };

  // Validate a new password against rules (length, letter, digit)
  const validateNewPasswordRules = (password: string): string => {
    let errorMsg = "";
    if (!minLengthRegex.test(password.trim())) {
      updatePasswordRule("length", Images.IconCheckError, THEME.COLORS.PASSWORD.FAIL);
      errorMsg = errAtLeast8CharMsg;
    } else {
      updatePasswordRule("length", Images.IconCheckOK, THEME.COLORS.PASSWORD.VALID);
    }

    if (!hasLetterRegex.test(password.trim()) || !hasDigitRegex.test(password.trim())) {
      updatePasswordRule("letterAndDigit", Images.IconCheckError, THEME.COLORS.PASSWORD.FAIL);
      if (!errorMsg) errorMsg = errContainAtLeastLetterAndDigitMsg; // Only set if no other error
    } else {
      updatePasswordRule("letterAndDigit", Images.IconCheckOK, THEME.COLORS.PASSWORD.VALID);
    }
    return errorMsg;
  };

  // Handle a new password input change
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    const ruleError = validateNewPasswordRules(value);
    setNewPasswordError(ruleError);
    validatePasswordMatch(value, confirmNewPassword); // Validate match
  };

  // Handle confirms a new password input change
  const handleConfirmNewPasswordChange = (value: string) => {
    setConfirmNewPassword(value);
    validatePasswordMatch(newPassword, value); // Validate match
  };

  // Function to check if new passwords match
  const validatePasswordMatch = (newPass: string, confirmPass: string) => {
    if (newPass !== confirmPass && confirmPass.length > 0) {
      // Only show an error if confirmPass is typed
      setConfirmNewPasswordError(errorMatchingPassword);
    } else {
      setConfirmNewPasswordError("");
    }
  };

  // Effect to update form validity whenever relevant states change
  useEffect(() => {
    const areAllFieldsFilled = currentPassword.length > 0 && newPassword.length > 0 && confirmNewPassword.length > 0;
    const noErrors = !currentPasswordError && !newPasswordError && !confirmNewPasswordError;
    const passwordsMatch = newPassword === confirmNewPassword;
    const newPasswordMeetsRules =
      minLengthRegex.test(newPassword.trim()) && hasLetterRegex.test(newPassword.trim()) && hasDigitRegex.test(newPassword.trim());

    setIsFormInvalid(!(areAllFieldsFilled && noErrors && passwordsMatch && newPasswordMeetsRules));
  }, [currentPassword, newPassword, confirmNewPassword, currentPasswordError, newPasswordError, confirmNewPasswordError]);

  const changePasswordMutation = useMutation({
    mutationFn: customerService.changePassword,
    onSuccess: () => {
      onClose({
        type: ToastType.success,
        message: changePasswordSuccessfully
      });
    },
    onError: (err: ErrorResponse) => {
      onClose({ type: ToastType.error, message: err.message });
    }
  });

  const handleChangePassword = () => {
    // Basic client-side validation before sending to API
    let formHasError = false;

    if (currentPassword.length === 0) {
      setCurrentPasswordError(pleaseEnterCurrentPassword);
      formHasError = true;
    } else {
      setCurrentPasswordError("");
    }

    const newPassRuleError = validateNewPasswordRules(newPassword);
    if (newPassRuleError) {
      setNewPasswordError(newPassRuleError);
      formHasError = true;
    } else {
      setNewPasswordError("");
    }

    if (confirmNewPassword.length === 0) {
      setConfirmNewPasswordError(pleaseConfirmNewPassword);
      formHasError = true;
    } else if (newPassword !== confirmNewPassword) {
      setConfirmNewPasswordError(errorMatchingPassword);
      formHasError = true;
    } else {
      setConfirmNewPasswordError("");
    }

    if (!formHasError) {
      setOpenConfirmDialog(true);
    }
  };

  return (
    <Modal
      open={isOpen} // Control visibility with isOpen prop
      title={changePassword}
      width="450px" // Adjust width as per screenshot
      footer={[
        <Button key="cancel" style={{ height: "40px" }} onClick={() => onClose(null)}>
          {stringCancel}
        </Button>,
        <CommonButton
          key={changePassword}
          style={{ maxWidth: "155px", marginLeft: "10px" }}
          onClick={handleChangePassword}
          label={changePassword}
          disabled={isFormValid}
        ></CommonButton>
      ]}
      onCancel={() => onClose(null)}
      centered // Center the modal on the screen
    >
      <Form name="change-password-form" layout="vertical" initialValues={{ remember: false }} autoComplete="off">
        <div className="mb-5 pt-8">
          <InputField
            label={entercPasswordStr}
            reLabel={cPasswordStr}
            type="password"
            name="currentPassword" // Unique name for each input
            value={currentPassword}
            disabled={true}
            onChange={e => setCurrentPassword(e.target.value)}
            isError={!!currentPasswordError}
            errorText={currentPasswordError}
          />
        </div>
        <div className="mb-5">
          <InputField
            label={enternPasswordStr}
            reLabel={nPasswordStr}
            type="password"
            name="newPassword" // Unique name for each input
            value={newPassword}
            onChange={e => handleNewPasswordChange(e.target.value)} // Use handleNewPasswordChange
            isError={!!newPasswordError}
            // errorText={newPasswordError}
            onFocus={handleNewPasswordFocus}
            onBlur={handleNewPasswordBlur}
          />
          {shouldShowPasswordRules && (
            <PasswordRules
              lengthIcon={passwordRules.length.icon}
              lengthColor={passwordRules.length.color}
              letterAndDigitIcon={passwordRules.letterAndDigit.icon}
              letterAndDigitColor={passwordRules.letterAndDigit.color}
            />
          )}
        </div>
        <div className="mb-5">
          <InputField
            label={confirmnPasswordStr} // This seems like a typo, should be confirmNewPasswordStr
            reLabel={confirmPasswordStr} // Re-label when focused
            type="password"
            name="confirmNewPassword" // Unique name for each input
            value={confirmNewPassword}
            onChange={e => handleConfirmNewPasswordChange(e.target.value)} // Use handleConfirmNewPasswordChange
            isError={!!confirmNewPasswordError}
            errorText={confirmNewPasswordError}
          />
        </div>
      </Form>
      <ConfirmDialog
        isOpen={openConfirmDialog}
        width="448px"
        title={confirmChangePassword}
        message={confirmChangePasswordMessage}
        confirmButtonText={confirmText}
        confirmButtonColor={THEME.COLORS.PRIMARY}
        onClose={() => {
          setOpenConfirmDialog(false);
        }}
        onConfirm={() => {
          changePasswordMutation.mutate({
            email: getAccountEmail(),
            password: newPassword // Use a newPassword for the payload
          });
        }}
      />
      {<LoadingComponent isPending={changePasswordMutation.isPending}></LoadingComponent>}
    </Modal>
  );
};
