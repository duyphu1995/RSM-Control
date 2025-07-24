import React, { useState } from "react";
import { Form } from "antd";
import {
  emailAddress,
  enterYourEmail,
  forgotDes,
  logIn,
  rememberPassword,
  resetPassword,
  sendEmailMessageSuccessfully
} from "@/constants/strings.ts";
import { emailRegex } from "@/constants/app_constants.ts";
import InputField from "@/components/common/InputField.tsx";
import CommonButton from "@/components/common/button/CommonButton.tsx";
import { ROUTES, THEME } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService.ts";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import { ErrorResponse } from "@/services/api.ts";
import { useToast } from "@/components/common/toast/ToastProvider.tsx";
import { ToastType } from "@/components/common/toast/Toast.tsx";

export const ForgotForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const forgotPasswordAction = async () => {
    forgotMutation.mutate({
      email: email
    });
  };

  const navigate = useNavigate();
  const { showToast } = useToast();

  const forgotMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      showToast(ToastType.success, sendEmailMessageSuccessfully);
      navigate(ROUTES.AUTH.LOGIN);
    },
    onError: (err: ErrorResponse) => {
      setError(err.message);
    }
  });

  const isSignInDisabled = !email || !emailRegex.test(email);

  return (
    <Form name="basic" labelCol={{ span: 6 }} wrapperCol={{ span: 25 }} autoComplete="off" layout="vertical">
      <div className="flex justify-center pr-5 pb-4 pt-10 text-center text-gray-600 text-sm">{forgotDes}</div>
      <InputField
        label={emailAddress}
        type="email"
        name="email"
        reLabel={enterYourEmail}
        onChange={e => setEmail(e.target.value)}
        id="email-input"
        isError={error != ""}
        errorText={error}
        value={email}
      />
      <div className={"pt-12"}>
        <CommonButton onClick={forgotPasswordAction} label={resetPassword} disabled={isSignInDisabled}></CommonButton>
      </div>
      <div className="flex justify-center pt-10">
        <label htmlFor="remember" className="text-sm pr-1">
          {rememberPassword}
        </label>
        <a
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
          href="javascript:void(0)"
          className="text-sm text-blue-500 hover:underline"
          style={{ color: THEME.COLORS.PRIMARY }}
        >
          {logIn}
        </a>
      </div>
      {<LoadingComponent isPending={forgotMutation.isPending}></LoadingComponent>}
    </Form>
  );
};
