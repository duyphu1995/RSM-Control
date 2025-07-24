import React from "react";
import { LoginForm } from "@/components/login_form/LoginForm.tsx";
import { SetupPasswordForm } from "@/components/set_password_form/SetUpPasswordForm";
import { ResetPasswordForm } from "@/components/reset_password_form/ResetPasswordForm";
import { Images } from "@/constants/images.tsx";
import { forgot, owner, signIn, setupPassword, resetPassword } from "@/constants/strings.ts";
import { BackgroundLayoutType } from "@/layouts/background_layout/backgroundLayoutType.ts";
import { BackgroundPageProps } from "@/layouts/background_layout/BackgroundPageProps.ts";
import { ForgotForm } from "@/components/forgot_form/ForgotForm.tsx";

export const BackgroundPageDesktop: React.FC<BackgroundPageProps> = ({ layoutType }) => {
  const renderContent = () => {
    switch (layoutType) {
      case BackgroundLayoutType.login:
        return (
          <div>
            <h1 className="text-center text-[#171717] font-semibold text-[30px] pt-4">{signIn}</h1>
            <LoginForm />
          </div>
        );
      case BackgroundLayoutType.forgotPassword:
        return (
          <div>
            <h1 className="text-center text-[#171717] font-semibold text-[30px] pt-4">{forgot}</h1>
            <ForgotForm /> {/* Assuming you have a RegisterForm component */}
          </div>
        );
      case BackgroundLayoutType.setPassword:
        return (
          <div>
            <h1 className="text-center text-[#171717] font-semibold text-[30px] pt-4">{setupPassword}</h1>
            <SetupPasswordForm />
          </div>
        );
      case BackgroundLayoutType.resetPassword:
        return (
          <div>
            <h1 className="text-center text-[#171717] font-semibold text-[30px] pt-4">{resetPassword}</h1>
            <ResetPasswordForm />
          </div>
        );
      default:
        return <div />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="img-rounded w-3/5 overflow-hidden p-4">
        <img src={Images.BackgroundCustomerSite} alt="" className="h-full w-full object-cover rounded-md"></img>
      </div>
      <div className="w-2/5 justify-center flex flex-col h-screen">
        <div className="h-screen justify-center items-center flex p-4">
          <div className="justify-center flex flex-col w-full max-w-[500px]">
            <img src={Images.Logo} alt="" className="h-[60px] w-screen"></img>
            {renderContent()}
          </div>
        </div>
        <div className="flex justify-center p-4">
          <footer className="mt-10 text-[14px] text-gray-500">{owner}</footer>
        </div>
      </div>
    </div>
  );
};
