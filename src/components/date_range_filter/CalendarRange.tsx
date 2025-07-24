import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useLocation } from "react-router-dom";
import { useRouteDateRange } from "@/hooks/useRouteDateRange";
import { Images } from "@/constants/images";
import { presetDates } from "@/constants/app_constants.ts";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarRange({
  usingCurrentMonth = false,
  setActiveLabel
}: {
  usingCurrentMonth?: any;
  setActiveLabel?: (label: string | null) => void;
}) {
  const today = dayjs();
  const pathname = useLocation().pathname;
  const { startDate, endDate, setDateRange } = useRouteDateRange(pathname);
  const initialStart = startDate ?? today;

  // Separate states for each calendar
  const [leftMonth, setLeftMonth] = useState(() => initialStart.startOf("month"));
  const [rightMonth, setRightMonth] = useState(() => initialStart.add(1, "month").startOf("month"));

  useEffect(() => {
    if (!startDate || !endDate) return;

    const matchedPreset = presetDates.find(preset => {
      const [presetStart, presetEnd] = preset.range;
      return startDate.isSame(presetStart, "day") && endDate.isSame(presetEnd, "day");
    });

    setActiveLabel?.(matchedPreset ? matchedPreset.label : "Custom");
  }, [startDate, endDate, setActiveLabel]);

  const handleDateClick = (date: Dayjs) => {
    if (!startDate || (startDate && endDate)) {
      setDateRange(date, undefined as unknown as Dayjs);
    } else if (date.isBefore(startDate)) {
      setDateRange(date, endDate as Dayjs);
    } else {
      setDateRange(startDate, date);
    }
  };

  useEffect(() => {
    if (startDate) {
      setLeftMonth(startDate.startOf("month"));
      setRightMonth(startDate.add(1, "month").startOf("month"));
    }
  }, [startDate]);

  const isInRange = (date: Dayjs) => {
    if (!startDate || !endDate) return false;
    return date.isAfter(startDate) && date.isBefore(endDate);
  };

  const isSelected = (date: Dayjs) => {
    return (startDate && date.isSame(startDate, "day")) || (endDate && date.isSame(endDate, "day"));
  };

  const isToday = (date: Dayjs) => {
    return date.isSame(today, "day");
  };

  const renderMonth = (monthStart: Dayjs, onPrev: () => void, onNext: () => void, isFirstMonth?: boolean) => {
    const startOfCalendar = monthStart.startOf("month").startOf("week");
    const days = [];

    for (let i = 0; i < 42; i++) {
      const date = startOfCalendar.add(i, "day");
      const isCurrentMonth = date.month() === monthStart.month();

      if (!isCurrentMonth) {
        days.push(<div key={date.toString()} />); // Empty slot
        continue;
      }

      days.push(
        <button
          key={date.toString()}
          onClick={() => handleDateClick(date)}
          className={`btn-calendar w-full h-full aspect-square flex items-center justify-center text-sm rounded transition
            ${isSelected(date) ? "bg-orange-500 text-white" : isInRange(date) ? "bg-gray-200" : ""}
            ${!isCurrentMonth ? "text-gray-400" : ""}
            ${isToday(date) ? "border border-orange-400" : ""}            
          `}
        >
          {date.date()}
        </button>
      );
    }

    return (
      <div
        className={`flex flex-col h-full space-y-1 pr-4 ${isFirstMonth ? "border-r border-r-gray-300" : ""} ${usingCurrentMonth ? "w-full border-0 border-r-0" : "w-[300px]"} `}
      >
        {/* Header Month */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={onPrev} className="btn-calendar p-1 !text-[16px] text-gray-500 hover:text-black">
            <img src={Images.IconCalendarLeft} alt="" />
          </button>
          <div className="font-semibold">{monthStart.format("MMMM YYYY")}</div>
          <button onClick={onNext} className="btn-calendar p-1 !text-[16px] text-gray-500 hover:text-black">
            <img src={Images.IconCalendarRight} alt="" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1 text-sm">{days}</div>
      </div>
    );
  };

  return (
    <div className="flex space-x-4 p-2 items-center h-full max-w-full">
      {renderMonth(
        leftMonth,
        () => setLeftMonth(leftMonth.subtract(1, "month")),
        () => setLeftMonth(leftMonth.add(1, "month")),
        true
      )}

      {!usingCurrentMonth &&
        renderMonth(
          rightMonth,
          () => setRightMonth(rightMonth.subtract(1, "month")),
          () => setRightMonth(rightMonth.add(1, "month")),
          false
        )}
    </div>
  );
}
