import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { mobilePhone, mobilePhoneValidation } from "@/constants/strings.ts";
import parsePhoneNumberFromString, { getCountryCallingCode, getExampleNumber, isValidPhoneNumber } from "libphonenumber-js";
import PhoneInput, { Country } from "react-phone-number-input";
import "./phone-number-input.css";
import examples from "libphonenumber-js/examples.mobile.json";
import { defaultCountry, phoneNumberCountryCode, phoneNumberMaxLength, phonePrefix } from "@/constants/app_constants.ts";

interface PhoneNumberInputProps {
  initialValue?: string;
  onValueChange: (value?: string) => void;
  onCountryChange: (value?: string) => void;
}

export interface PhoneNumberInputRef {
  isErrorVisible: () => boolean;
}
const PhoneNumberInput = forwardRef<PhoneNumberInputRef, PhoneNumberInputProps>(
  ({ initialValue = phoneNumberCountryCode, onCountryChange, onValueChange }, ref) => {
    const [phoneNumber, setPhoneNumber] = useState<string | undefined>(initialValue);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [country, setCountry] = useState<Country>(defaultCountry);
    const [maxLength, setMaxLength] = useState(phoneNumberMaxLength);
    const errorPhoneNumberFormatRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
      isErrorVisible: () => !isValid,
      isPhoneValid: () => {
        const phoneNumbertrimmed = phoneNumber?.trim() ?? "";
        const prefixLength = `${phonePrefix}${getCountryCallingCode(country)}`.length;
        return phoneNumbertrimmed.length > prefixLength && isValid;
      }
    }));

    useEffect(() => {
      if (country) {
        const example = getExampleNumber(country, examples);
        if (example) {
          const newMaxLength = example.formatInternational().length;
          setMaxLength(newMaxLength);
        } else {
          setMaxLength(phoneNumberMaxLength);
        }
      }
    }, [country]);

    useEffect(() => {
      const prefix = `${phonePrefix}${getCountryCallingCode(country)}`;
      if (phoneNumber && phoneNumber.length > prefix.length) {
        validatePhone(phoneNumber, prefix.length);
      } else {
        setIsValid(true);
        setErrorMessage("");
      }
    }, [country]);

    const validatePhone = (value: string, prefixLength: number) => {
      const phoneNumber = value?.trim() ?? "";
      if (!phoneNumber) {
        setIsValid(true);
        setErrorMessage("");
        return;
      }

      if (phoneNumber.length <= prefixLength) {
        setIsValid(false);
        setErrorMessage(mobilePhoneValidation); // show l?i
        return;
      }

      if (!isValidPhoneNumber(phoneNumber, country)) {
        setIsValid(false);
        setErrorMessage(mobilePhoneValidation);
        return;
      }

      setIsValid(true);
      setErrorMessage("");
    };

    return (
      <div className="phone-input-container">
        <label htmlFor="phone-input" className="phone-input-label">
          {mobilePhone}
        </label>
        <PhoneInput
          id="phone-input"
          className={`phone-input-custom ${!isValid ? "phone-input-custom-error" : ""}`}
          international
          onCountryChange={country => {
            if (country) {
              setCountry(country);
              onCountryChange(`${phonePrefix}${getCountryCallingCode(country)}`);
            }
          }}
          defaultCountry={country}
          containerclass="h-full w-full"
          countryCallingCodeEditable={false}
          inputstyle={{ height: "40px", width: "100%", borderRadius: "8px" }}
          buttonclass={"h-full"}
          value={phoneNumber}
          country={country}
          numberInputProps={{
            maxLength: maxLength,
            onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
              const input = e.currentTarget;
              const selectionStart = input.selectionStart ?? 0;
              const callingCodeLength = getCountryCallingCode(country).length + phonePrefix.length;
              if ((e.key === "Backspace" || e.key === "Delete") && selectionStart <= callingCodeLength) {
                e.preventDefault();
              }
            }
          }}
          onChange={value => {
            if (country) {
              const callingCode = getCountryCallingCode(country);
              const prefix = `${phonePrefix}${callingCode}`;

              setPhoneNumber(value || undefined);
              validatePhone(value ?? "", prefix.length);

              const phoneNumber = parsePhoneNumberFromString(value ?? "");
              onValueChange(phoneNumber?.nationalNumber);
              onCountryChange(prefix);
            }
          }}
        />
        {!isValid && errorMessage && (
          <div className="absolute mt-1 ml-3 text-xs text-red-600 font-normal mr-4" ref={errorPhoneNumberFormatRef}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
