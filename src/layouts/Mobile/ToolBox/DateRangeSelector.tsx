import React, { useEffect, useState, useRef } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { THEME } from "@/constants";
import CommonButton from "@/components/common/button/CommonButton";
import CalendarRange from "./CalendarRange";
import PresetDateRange from "./PresetDates";
import { useLocation } from "react-router-dom";
import { useRouteDateRange } from "@/hooks/useRouteDateRange";
import dayjs, { Dayjs } from "dayjs";
import { ChevronDown } from "lucide-react";
import { Images } from "@/constants/images";

type DateRangeSelectorProps = {
  label?: string;
  isMobile?: boolean;
  handleFilterData: () => void;
};

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ label = "Order Date", handleFilterData }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showPresetDates, setShowPresetDates] = useState(false);
  const pathname = useLocation().pathname;
  const { startDate, endDate, setDateRange } = useRouteDateRange(pathname);
  const [activeLabel, setActiveLabel] = useState<string | null>("Last 30 days");
  const [, setPreviousDateRange] = useState<{ start: Dayjs; end: Dayjs } | null>(null);
  const [previousLabel, setPreviousLabel] = useState<string | null>("Today"); // ✅ Added

  const [tempStartDate, setTempStartDate] = useState<Dayjs | null>(startDate); // Use temporary date to avoid auto-apply without clicking "Apply"
  const [tempEndDate, setTempEndDate] = useState<Dayjs | null>(endDate);
  const shouldApplyRef = useRef(false); // Flag to know when "Apply" button should work

  const today = dayjs();

  useEffect(() => {
    const handleClosePicker = () => setShowPicker(false);

    window.addEventListener("closeAllPickers", handleClosePicker);
    return () => window.removeEventListener("closeAllPickers", handleClosePicker);
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (showPicker) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showPicker]);

  const handleOpenPicker = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    if (startDate && endDate) {
      setPreviousDateRange({ start: startDate, end: endDate });
    }
    setPreviousLabel(activeLabel);
    setShowPicker(prev => !prev);
  };

  const handleApplyDaterange = () => {
    if (tempStartDate && tempEndDate) {
      shouldApplyRef.current = true; // mark that we want to apply when state updates
      setDateRange(tempStartDate, tempEndDate);
    }
    setShowPicker(false);
    setShowPresetDates(false);
  };
  // Only call handleFilterData when start and end date already updated
  useEffect(() => {
    if (shouldApplyRef.current && startDate?.isSame(tempStartDate, "day") && endDate?.isSame(tempEndDate, "day")) {
      handleFilterData(); //
      shouldApplyRef.current = false; // reset flag
    }
  }, [startDate, endDate]);

  const handleCancelDaterange = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setShowPresetDates(false);
    setActiveLabel(previousLabel);
    setShowPicker(false);
  };

  return (
    <div className="relative w-full">
      {showPicker && <div className="ui-config-modal z-[9]"></div>}
      <div className="flex items-center py-1 space-x-2 w-full">
        <button onClick={handleOpenPicker} className="flex justify-between items-center gap-2 w-full">
          <div className="mr-0">
            <span className="font-semibold text-sm">{label}: </span>
            <span className="text-sm font-normal text-gray-800">
              {startDate?.format("DD/MM/YYYY") ?? today.subtract(30, "days").format("DD/MM/YYYY")} -{" "}
              {endDate?.format("DD/MM/YYYY") ?? today.format("DD/MM/YYYY")}
            </span>
          </div>
          <img src={Images.IconCalendarMobile} alt="" />
        </button>

        <div
          className={`absolute w-full top-full -left-[auto] -right-0 z-[10] mt-2 transition-all duration-200 ease-out transform ${
            showPicker ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="relative wrapper-picker rounded-lg border bg-[#FFFFFF] border-gray-300 w-full h-[468px] z-50 inline-flex justify-start items-start">
            <div className="calendar w-full h-full flex flex-col">
              {/* Calendar */}
              <div className="calendar-picker flex-1 h-[328px]" onClick={() => setShowPresetDates(false)}>
                <CalendarRange
                  usingCurrentMonth={true}
                  setActiveLabel={setActiveLabel}
                  tempStartDate={tempStartDate}
                  tempEndDate={tempEndDate}
                  setTempStartDate={setTempStartDate}
                  setTempEndDate={setTempEndDate}
                />
              </div>

              {showPresetDates && (
                <div className="absolute -top-5 -left-[auto] z-[11] bg-[#fff] w-[145px] border border-gray-300 rounded-sm">
                  <PresetDateRange
                    activeLabel={activeLabel}
                    setShowPresetDates={setShowPresetDates}
                    setActiveLabel={setActiveLabel}
                    showPresetDates={showPresetDates}
                    setTempStartDate={setTempStartDate}
                    setTempEndDate={setTempEndDate}
                  />
                </div>
              )}

              {/* Bottom buttons */}
              <div className="botom-panel-wrapper w-full h-[72px] border-t border-gray-300 items-center">
                <div className="bottom-panel mx-0 px-4 my-4 w-full h-[40px] flex justify-between">
                  <button className="btn-calendar items-center flex gap-1" onClick={() => setShowPresetDates(!showPresetDates)}>
                    {activeLabel}
                    <ChevronDown />
                  </button>
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
                      className={`text-white flex-1 rounded-md border ${!(startDate && endDate) ? "!bg-[#FDBA74]" : null} border-gray-300 h-full ${!(startDate && endDate) ? null : "cursor-pointer"} `}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
