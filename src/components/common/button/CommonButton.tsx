import "./common_button.css";
import React, { ButtonHTMLAttributes } from "react";
import { THEME } from "@/constants";

interface CommonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: any;
  backgroundColor?: string;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  label,
  onClick,
  type = "button",
  backgroundColor = THEME.COLORS.PRIMARY,
  disabled = false,
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="common-button hover:opacity-90 cursor-pointer"
      disabled={disabled}
      style={{ backgroundColor: backgroundColor }}
      {...rest}
    >
      {label}
    </button>
  );
};

export default CommonButton;
