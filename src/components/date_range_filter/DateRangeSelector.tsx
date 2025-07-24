import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { THEME } from "@/constants";
import CommonButton from "@/components/common/button/CommonButton";
import CalendarRange from "./CalendarRange";
import PresetDateRange from "./PresetDates";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { useRouteDateRange } from "@/hooks/useRouteDateRange";

type DateRangeSelectorProps = {
  label?: string;
  handleFilterData: (filterType?: string) => void;
};

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ label = "Order Date", handleFilterData }) => {
  const [showPicker, setShowPicker] = useState(false);
  const today = dayjs();
  const pathname = useLocation().pathname;
  const { startDate, endDate, setDateRange } = useRouteDateRange(pathname);

  const [previousDateRange, setPreviousDateRange] = useState<{ start: dayjs.Dayjs; end: dayjs.Dayjs } | null>(null);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [previousLabel, setPreviousLabel] = useState<string | null>(null);

  useEffect(() => {
    const handleClosePicker = () => setShowPicker(false);

    window.addEventListener("closeAllPickers", handleClosePicker);
    return () => window.removeEventListener("closeAllPickers", handleClosePicker);
  }, []);

  const handleOpenPicker = () => {
    if (startDate && endDate) {
      setPreviousDateRange({ start: startDate, end: endDate });
    }
    setPreviousLabel(activeLabel);
    setShowPicker(prev => !prev);
  };

  const handleApplyDaterange = () => {
    handleFilterData("clearFilter");
    setShowPicker(false);
  };

  const handleCancelDaterange = () => {
    if (previousDateRange) {
      setDateRange(previousDateRange.start, previousDateRange.end);
    }
    setActiveLabel(previousLabel);
    setShowPicker(false);
  };

  return (
    <div className="relative flex items-center py-1 space-x-2">
      {showPicker && <div onClick={() => setShowPicker(false)} className="ui-config-modal z-[100]"></div>}
      <button onClick={handleOpenPicker} className="flex items-center gap-2">
        <div className="mr-6">
          <span className="font-semibold text-sm text-gray-900">{label}: </span>
          <span className="text-sm font-normal text-gray-800">
            {startDate?.format("DD/MM/YYYY") ?? today.format("DD/MM/YYYY")} - {endDate?.format("DD/MM/YYYY") ?? today.format("DD/MM/YYYY")}
          </span>
        </div>
        <CalendarIcon className="h-4 w-4 text-gray-500 cursor-pointer" />
      </button>

      <div
        className={`absolute top-full -left-[490px] z-[9999] mt-2 transition-all duration-200 ease-out transform ${
          showPicker ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="wrapper-picker rounded-lg border bg-[#FFFFFF] border-gray-300 w-[712px] h-[468px] z-50 inline-flex justify-start items-start">
          {/* Preset range date */}
          <div className="border-r border-gray-300 h-full">
            <div className="preset-range w-[120px] h-[436px] mx-2 my-4 text-sm flex flex-col">
              <PresetDateRange activeLabel={activeLabel} setActiveLabel={setActiveLabel} setDateRange={setDateRange} />
            </div>
          </div>

          <div className="calendar w-[570px] h-full flex flex-col">
            {/* Render calendar */}
            <div className="calendar-picker flex-1 h-[328px]">
              <CalendarRange setActiveLabel={setActiveLabel} />
            </div>

            {/* Bottom section for buttons */}
            <div className="botom-panel-wrapper w-full h-[72px] border-t border-gray-300 items-center">
              <div className="bottom-panel mx-6 my-4 max-w-full h-[40px] flex justify-end">
                <div className="w-[164px] h-full gap-3 inline-flex">
                  <CommonButton
                    label="Cancel"
                    backgroundColor={THEME.COLORS.WHITE}
                    onClick={handleCancelDaterange}
                    className="text-gray-900 flex-1 rounded-md border border-gray-300 h-full cursor-pointer"
                  />
                  <CommonButton
                    label="Apply"
                    backgroundColor={!(startDate && endDate) ? THEME.COLORS.WARNING : THEME.COLORS.PRIMARY}
                    onClick={handleApplyDaterange}
                    disabled={!(startDate && endDate)}
                    className={`text-white flex-1 rounded-md border border-gray-300 h-full ${!(startDate && endDate) ? null : "cursor-pointer"} ${!(startDate && endDate) ? "!bg-[#FDBA74]" : null} `}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
