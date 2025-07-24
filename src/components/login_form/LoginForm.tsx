import React, { useState } from "react";
import { Form } from "antd";
import { forgotPassword, incorrectEmailOrPassword, rememberMe, signIn, stringEmail, stringPassword } from "@/constants/strings.ts";
import { AuthError, BEARER_TOKEN, BEARER_TOKEN_EXPIRATION_TIME, customerLoginType, EMAIL } from "@/constants/app_constants.ts";
import InputField from "@/components/common/InputField.tsx";
import "./login_form.css";
import CommonButton from "@/components/common/button/CommonButton.tsx";
import { Images } from "@/constants/images.tsx";
import { useMutation } from "@tanstack/react-query";
import { authService, ProfileResponse } from "@/services/authService.ts";
import LoadingComponent from "@/components/common/loading_spinner/LoadingSpinner.tsx";
import { ROUTES } from "@/constants";
import { useNavigate } from "react-router-dom";
import { saveProfileData } from "@/utils/authUtils.ts";

export const LoginForm: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCheckboxChange = (value: boolean) => {
    setIsChecked(value);
  };

  const navigate = useNavigate();

  const handleSignIn = async () => {
    signInMutation.mutate({
      email: email,
      password: password,
      loginType: customerLoginType
    });
  };

  const getCustomerProfile = useMutation({
    mutationFn: authService.getCustomerProfile,
    onError: error => {
      setError(error.message);
    },
    onSuccess: (data: ProfileResponse) => {
      saveProfileData(data, true);
      navigate("/");
    }
  });

  const signInMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: data => {
      if (isChecked) {
        localStorage.setItem(BEARER_TOKEN_EXPIRATION_TIME, Date.now().toString());
        localStorage.setItem(BEARER_TOKEN, data.token);
        localStorage.setItem(EMAIL, email);
      } else {
        sessionStorage.setItem(BEARER_TOKEN, data.token);
        sessionStorage.setItem(EMAIL, email);
      }
      getCustomerProfile.mutate();
    },
    onError: error => {
      setError(error.message == AuthError.accountValidationFailed ? incorrectEmailOrPassword : error.message);
    }
  });

  const isSignInDisabled = !email || !password;

  return (
    <div>
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
        <div className="pt-10">
          <InputField
            label={stringEmail}
            type="email"
            name="email"
            onChange={e => setEmail(e.target.value)}
            id="email-input"
            isError={false}
            value={email}
          />
        </div>
        <div className="pt-5">
          <InputField
            label={stringPassword}
            type="password"
            name="email"
            id="password-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            isError={false}
          />
        </div>
        <Form.Item>
          <div className="justify-between flex pt-4">
            <div className="remember-me-container">
              <input
                type="checkbox"
                id="rememberMe"
                checked={isChecked}
                onChange={e => handleCheckboxChange(e.target.checked)}
                className="remember-me-checkbox"
              />
              <label htmlFor="rememberMe" className="remember-me-label">
                {rememberMe}
              </label>
            </div>
            <a onClick={() => navigate(ROUTES.AUTH.FORGOT_PASSWORD)} href="javascript:void(0)" className="text-sm text-blue-600 hover:underline">
              {forgotPassword}
            </a>
          </div>
        </Form.Item>
        <div className="pt-5">
          <CommonButton onClick={handleSignIn} label={signIn} type="submit" disabled={isSignInDisabled} onKeyDown={handleSignIn}></CommonButton>
        </div>
      </Form>
      {signInMutation.isPending ? <LoadingComponent isPending={signInMutation.isPending} /> : null}
    </div>
  );
};
