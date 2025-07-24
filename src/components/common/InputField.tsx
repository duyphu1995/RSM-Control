import React, { InputHTMLAttributes, useEffect, useState } from "react";
import "./input_field.css";
import { Images } from "@/constants/images.tsx";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isError?: boolean;
  reLabel?: string;
  errorText?: string;
  disabled?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  isError = false,
  reLabel = "",
  errorText = "",
  disabled = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState<string>((value as string) || "");

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value as string);
    }
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e);
  };

  const togglePasswordVisibility = () => {
    if (!disabled) {
      setIsShowPassword(prev => !prev);
    }
  };

  // Determine if the label should be "shrunk" (moved up and scaled down)
  const shouldShrinkLabel = isFocused || inputValue !== "";

  const actualInputType = type === "password" && !isShowPassword ? "password" : "text";

  const inputlabelClasses = [
    "input-field-label ",
    disabled ? (inputValue.trim() === null || inputValue.trim() === "" ? "input-field-label-disable-empty" : "input-field-label-disable") : ""
  ]
    .filter(Boolean)
    .join("");

  const containerClasses = [
    "input-field-container",
    isFocused ? "focused" : "",
    shouldShrinkLabel ? "shrunk-label" : "",
    isError ? "error" : "",
    type === "password" ? "has-password-toggle" : "",
    disabled ? "input-field-container-disable" : ""
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={containerClasses}>
      <label className={inputlabelClasses}>{isFocused || inputValue.length > 0 ? label : reLabel.length > 0 ? reLabel : label}</label>
      <input
        type={actualInputType}
        className={`input-field-input`}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        {...rest}
      />
      {type === "password" && ( // Only render the icon if the original type is 'password'
        <div className="password-toggle-icon" onClick={togglePasswordVisibility}>
          {isShowPassword ? <img src={Images.IconShowPassword} alt="" /> : <img src={Images.IconHidePassword} alt="" />}
        </div>
      )}
      {isError && errorText && <div className="input-field-error-text text-left">{errorText}</div>}
    </div>
  );
};

export default InputField;
