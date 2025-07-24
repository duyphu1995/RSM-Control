import React, { InputHTMLAttributes } from "react";
import { Images } from "@/constants/images.tsx";
import { THEME } from "@/constants/theme";
import { passwordRuleDetail, passwordRuleLeterDigit, passwordRuleLength } from "@/constants/strings";

interface PasswordRulesProps extends InputHTMLAttributes<HTMLInputElement> {
  lengthIcon: string;
  lengthColor: string;
  letterAndDigitIcon: string;
  letterAndDigitColor: string;
}

export const PasswordRules: React.FC<PasswordRulesProps> = ({
  lengthColor = THEME.COLORS.PASSWORD.INIT,
  lengthIcon = Images.IconCheckInit,
  letterAndDigitColor = THEME.COLORS.PASSWORD.INIT,
  letterAndDigitIcon = Images.IconCheckInit
}) => {
  return (
    <div className="mt-2 mb-5 font-inter text-sm leading-5">
      <ul className="space-y-1 text-[12px]">
        <li className="flex items-start gap-2 text-sm text-[12px]" style={{ color: lengthColor }}>
          <img src={lengthIcon} alt="length rule icon" className="w-4 h-4 mt-[2px] flex-shrink-0" />
          <span>{passwordRuleLength}</span>
        </li>

        <li className="flex items-start gap-2 text-sm text-[12px]" style={{ color: letterAndDigitColor }}>
          <img src={letterAndDigitIcon} alt="letter/digit rule icon" className="w-4 h-4 mt-[2px] flex-shrink-0" />
          <div>
            <div>{passwordRuleLeterDigit}</div>
            <ul className="mt-1 space-y-1 text-[12px] leading-[18px]">
              {passwordRuleDetail.map((rule, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-[16px] leading-none mr-[6px] mt-[2px]">&#8226;</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};
