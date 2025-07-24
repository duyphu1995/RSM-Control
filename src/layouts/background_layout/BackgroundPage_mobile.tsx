import React from "react";
import { LoginForm } from "@/components/login_form/LoginForm.tsx";
import { SetupPasswordForm } from "@/components/set_password_form/SetUpPasswordForm";
import { ResetPasswordForm } from "@/components/reset_password_form/ResetPasswordForm";
import "./background-layout.css";
import { Images } from "@/constants/images.tsx";
import { signIn, setupPassword, forgot, resetPassword } from "@/constants/strings.ts";
import { BackgroundPageProps } from "@/layouts/background_layout/BackgroundPageProps.ts";
import { BackgroundLayoutType } from "@/layouts/background_layout/backgroundLayoutType.ts";
import { ForgotForm } from "@/components/forgot_form/ForgotForm.tsx";

export const BackgroundPageMobile: React.FC<BackgroundPageProps> = ({ layoutType }) => {
  const renderContent = () => {
    switch (layoutType) {
      case BackgroundLayoutType.login:
        return (
          <>
            <h1 className="text-center text-[#171717] font-semibold text-[24px] pt-4">{signIn}</h1>
            <LoginForm />
          </>
        );
      case BackgroundLayoutType.setPassword:
        return (
          <>
            <h1 className="text-center text-[#171717] font-semibold text-[24px] pt-4">{setupPassword}</h1>
            <SetupPasswordForm />
          </>
        );
      case BackgroundLayoutType.resetPassword:
        return (
          <>
            <h1 className="text-center text-[#171717] font-semibold text-[24px] pt-4">{resetPassword}</h1>
            <ResetPasswordForm />
          </>
        );
      case BackgroundLayoutType.forgotPassword:
        return (
          <>
            <h1 className="text-center text-[#171717] font-semibold text-[24px] pt-4">{forgot}</h1>
            <ForgotForm />
          </>
        );
      default:
        return <div />;
    }
  };

  return (
    <div className="login-page-container">
      <div className="background-overlay"></div>
      <div className="background-image w-screen h-screen" style={{ backgroundImage: `url(${Images.BackgroundCustomerSite})` }}></div>
      <div className="login-card">
        <img src={Images.Logo} alt="" className="h-[60px] w-screen"></img>
        {renderContent()}
      </div>
    </div>
  );
};
