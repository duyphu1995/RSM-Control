import dayjs from "dayjs";
import CommonButton from "@/components/common/button/CommonButton";
import { THEME } from "@/constants";
import IconActived from "@/assets/Icon-actived.svg";
import { presetDates } from "@/constants/app_constants.ts";

interface PresetDateRangeProps {
  setShowPresetDates?: (show: boolean) => void;
  setActiveLabel: any;
  activeLabel: any;
  showPresetDates: boolean;
  setTempStartDate: (date: dayjs.Dayjs) => void;
  setTempEndDate: (date: dayjs.Dayjs) => void;
}

export default function PresetDateRange({
  setShowPresetDates = () => {},
  setActiveLabel,
  activeLabel,
  showPresetDates,
  setTempStartDate,
  setTempEndDate
}: PresetDateRangeProps) {
  const handlePresetClick = (label: string, rangeFn: () => [dayjs.Dayjs, dayjs.Dayjs]) => {
    const [start, end] = rangeFn();
    setTempStartDate(start);
    setTempEndDate(end);
    setActiveLabel(label);
    setShowPresetDates(!showPresetDates);
  };

  return (
    <div className="preset-range w-[135px] h-[436px] text-sm flex flex-col">
      {presetDates.map(presetDate => (
        <CommonButton
          label={
            <span className="w-full">
              {presetDate.label} {activeLabel === presetDate.label && <img className="float-end" src={IconActived} alt="" />}
            </span>
          }
          backgroundColor={THEME.COLORS.WHITE}
          className={`btn-calendar text-left pl-3 cursor-pointer h-[40px] mb-1 ${activeLabel === presetDate.label ? "actived" : ""}`}
          key={presetDate.label}
          onClick={() => handlePresetClick(presetDate.label, () => [presetDate.range[0], presetDate.range[1]])}
        />
      ))}
      <CommonButton
        label={<span className="w-full">Custom {activeLabel === "Custom" && <img className="float-end" src={IconActived} alt="" />}</span>}
        backgroundColor={THEME.COLORS.WHITE}
        className={`btn-calendar text-left pl-3 cursor-pointer h-[40px] mb-1 ${activeLabel === "Custom" ? "actived" : ""}`}
        key="Custom"
      />
    </div>
  );
}
