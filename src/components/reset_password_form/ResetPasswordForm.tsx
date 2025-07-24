import React from "react";
import { useState, useEffect } from "react";
import { customerService } from "@/services/passwordService.ts";
import { Form } from "antd";
import {
  enterPasswordStr,
  confirmPasswordStr,
  resetPassword,
  errorMatchingPassword,
  resetPasswordSuccessfully,
  tokenNotFound,
  tokenQueryStr
} from "@/constants/strings.ts";
import { Images } from "@/constants/images.tsx";
import InputField from "@/components/common/InputField.tsx";
import { useNavigate } from "react-router-dom";
import CommonButton from "@/components/common/button/CommonButton.tsx";
import { minLengthRegex, hasLetterRegex, hasDigitRegex } from "@/constants/app_constants.ts";
import { THEME } from "@/constants/theme";
import { ROUTES } from "@/constants";
import { PasswordRules } from "@/components/common/PasswordRules";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse } from "@/services/api.ts";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { ToastType } from "@/components/common/toast/Toast.tsx";
import { removeToken } from "@/utils/authUtils.ts";

export const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // Function to handle password change and validate
  const handleValidatePassword = (password: string) => {
    setPassword(password);
    if (password.trim() === "" && confirmPassword.trim() === "") {
      updatePasswordRule("length", Images.IconCheckInit, THEME.COLORS.PASSWORD.INIT);
      updatePasswordRule("letterAndDigit", Images.IconCheckInit, THEME.COLORS.PASSWORD.INIT);
      setIsError(false);
      setErrorPassword("");
      return;
    }
    if (minLengthRegex.test(password.trim())) {
      updatePasswordRule("length", Images.IconCheckOK, THEME.COLORS.PASSWORD.VALID);
    } else {
      updatePasswordRule("length", Images.IconCheckError, THEME.COLORS.PASSWORD.FAIL);
    }
    if (hasLetterRegex.test(password.trim()) && hasDigitRegex.test(password.trim())) {
      updatePasswordRule("letterAndDigit", Images.IconCheckOK, THEME.COLORS.PASSWORD.VALID);
    } else {
      updatePasswordRule("letterAndDigit", Images.IconCheckError, THEME.COLORS.PASSWORD.FAIL);
    }
    // Validate both field password when one of 2 fields is changed
    if (confirmPassword.trim() !== null && confirmPassword.trim() !== "") {
      validatePasswordMatch(password.trim(), confirmPassword.trim());
    }
  };

  // Function to handle confirm password change
  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setConfirmPassword(confirmPassword);
    validatePasswordMatch(password.trim(), confirmPassword.trim()); // Validate both field password when one of 2 fields is changed
  };

  // Function to check if passwords match
  const validatePasswordMatch = (passwordParams: string, confirmPasswordParams: string) => {
    if (confirmPasswordParams === "") {
      setErrorPassword("");
      setIsError(false);
      return;
    }
    if (passwordParams !== confirmPasswordParams) {
      setErrorPassword(errorMatchingPassword); // Set error message
      setIsError(true); // Set error status
    } else {
      setErrorPassword("");
      setIsError(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get(tokenQueryStr);
    if (!tokenParam) {
      setError(tokenNotFound);
      setIsError(true);
      return;
    } else {
      setToken(tokenParam);
    }
  }, []);

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, email, password }: { token: string; email: string; password: string }) =>
      customerService.resetPassword(token, { email, password }),
    onSuccess: () => {
      removeToken();
      showToast(ToastType.success, resetPasswordSuccessfully);
      navigate(ROUTES.AUTH.LOGIN); // Setup password successfully then redirect to login page
    },
    onError: (err: ErrorResponse) => {
      setIsError(true);
      setError(err.message.replace(/_/g, " "));
    }
  });

  const handleResetPassword = async () => {
    resetPasswordMutation.mutate({
      token: token,
      email: email,
      password: password
    });
  };

  const fetchEmailMutation = useMutation({
    mutationFn: customerService.getEmailByToken,
    onSuccess: (data: any) => {
      setEmail(data.email);
    },
    onError: (error: any) => {
      console.error(error.message);
      setIsError(true);
      setError(error.message.replace(/_/g, " "));
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get(tokenQueryStr);
    if (!tokenParam) {
      setError(tokenNotFound);
      setIsError(true);
      return;
    } else {
      setToken(tokenParam);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchEmailMutation.mutate({ token });
    }
  }, [token]);

  const isResetDisabled = () => {
    if (!password || !confirmPassword) return true;
    const isPasswordValid = minLengthRegex.test(password.trim()) && hasLetterRegex.test(password.trim()) && hasDigitRegex.test(password.trim());
    const isConfirmPasswordValid = password.trim() === confirmPassword.trim();
    return !(isPasswordValid && isConfirmPasswordValid);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 25 }}
      initialValues={{
        remember: false
      }}
      autoComplete="off"
      layout="vertical"
    >
      {error && (
        <div className="error-container">
          <span className="w-[20px] h-[20px] mr-2">
            {" "}
            <img src={Images.IconError} alt="" />
          </span>
          {error}
        </div>
      )}
      <div className={error ? "pt-3" : "pt-10"}>
        <InputField
          label={enterPasswordStr}
          type="password"
          name="password"
          id="set-password"
          value={password}
          onChange={e => handleValidatePassword(e.target.value)}
          isError={false}
        />
      </div>
      <PasswordRules
        lengthIcon={passwordRules.length.icon}
        lengthColor={passwordRules.length.color}
        letterAndDigitIcon={passwordRules.letterAndDigit.icon}
        letterAndDigitColor={passwordRules.letterAndDigit.color}
      />
      <div>
        <InputField
          label={confirmPasswordStr}
          type="password"
          name="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={e => handleConfirmPasswordChange(e.target.value)}
          isError={isError}
          errorText={errorPassword}
        />
      </div>
      <div className="pt-8">
        <CommonButton type="submit" onClick={handleResetPassword} label={resetPassword} disabled={isResetDisabled()}></CommonButton>
      </div>
    </Form>
  );
};
