import dayjs from "dayjs";
import CommonButton from "@/components/common/button/CommonButton";
import { THEME } from "@/constants";
import { presetDates } from "@/constants/app_constants.ts";

type PresetDateRangeProps = {
  activeLabel: string | null;
  setActiveLabel: (label: string | null) => void;
  setDateRange: (start: dayjs.Dayjs, end: dayjs.Dayjs) => void;
};

export default function PresetDateRange({ activeLabel, setActiveLabel, setDateRange }: PresetDateRangeProps) {
  const handlePresetClick = (label: string, rangeFn: () => [dayjs.Dayjs, dayjs.Dayjs]) => {
    const [start, end] = rangeFn();
    setDateRange(start, end);
    setActiveLabel(label);
  };

  return (
    <div className="preset-range w-[120px] h-[436px] text-sm flex flex-col">
      {presetDates.map(presetDate => (
        <CommonButton
          label={presetDate.label}
          backgroundColor={activeLabel === presetDate.label ? THEME.COLORS.PRIMARY : THEME.COLORS.WHITE}
          className={`cursor-pointer text-left pl-4 rounded-md h-[40px] mb-1 btn-calendar ${activeLabel === presetDate.label ? "text-white" : ""}`}
          key={presetDate.label}
          onClick={() => handlePresetClick(presetDate.label, () => [presetDate.range[0], presetDate.range[1]])}
        />
      ))}
      <CommonButton
        label="Custom"
        backgroundColor={activeLabel === "Custom" ? THEME.COLORS.PRIMARY : THEME.COLORS.WHITE}
        className="cursor-pointer text-left pl-4 rounded-md h-[40px] mb-1 btn-calendar"
        key="Custom"
      />
    </div>
  );
}
