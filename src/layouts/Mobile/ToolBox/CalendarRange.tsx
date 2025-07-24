import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { Images } from "@/constants/images";
import { presetDates } from "@/constants/app_constants.ts";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarRange({
  usingCurrentMonth = false,
  setActiveLabel,
  tempStartDate,
  tempEndDate,
  setTempStartDate,
  setTempEndDate
}: {
  usingCurrentMonth?: any;
  setActiveLabel?: (label: string | null) => void;
  tempStartDate: Dayjs | null;
  tempEndDate: Dayjs | null;
  setTempStartDate: (date: Dayjs | null) => void;
  setTempEndDate: (date: Dayjs | null) => void;
}) {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today.startOf("month"));
  // const { startDate, endDate, setDateRange } = useRouteDateRange(pathname);

  // Use temporary date to avoid auto-apply without clicking "Apply"
  const handleDateClick = (date: Dayjs) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else if (date.isBefore(tempStartDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else {
      setTempEndDate(date);
    }
  };

  useEffect(() => {
    if (!tempStartDate || !tempEndDate) return;

    const matchedPreset = presetDates.find(preset => {
      const [presetStart, presetEnd] = preset.range;
      return tempStartDate.isSame(presetStart, "day") && tempEndDate.isSame(presetEnd, "day");
    });

    setActiveLabel?.(matchedPreset ? matchedPreset.label : "Custom");
  }, [tempStartDate, tempEndDate, setActiveLabel]);

  const isInRange = (date: Dayjs) => {
    if (!tempStartDate || !tempEndDate) return false;
    return date.isAfter(tempStartDate) && date.isBefore(tempEndDate);
  };

  const isSelected = (date: Dayjs) => {
    return (tempStartDate && date.isSame(tempStartDate, "day")) || (tempEndDate && date.isSame(tempEndDate, "day"));
  };

  const isToday = (date: Dayjs) => {
    return date.isSame(today, "day");
  };

  const renderMonth = (monthStart: Dayjs, isFirstMonth?: boolean) => {
    const startOfCalendar = monthStart.startOf("month").startOf("week");
    const days = [];

    // Render button day, 7 days a week, 1 month has 4 weeks and 2 weeks in advanced/previous month
    // So total has 42 buttons
    for (let i = 0; i < 42; i++) {
      const date = startOfCalendar.add(i, "day");
      const isCurrentMonth = date.month() === monthStart.month();

      // If not current month, render empty div to maintain grid structure
      if (!isCurrentMonth) {
        days.push(<div key={date.toString()} />); // Empty slot
        continue;
      }

      days.push(
        <button
          key={date.toString()}
          onClick={() => handleDateClick(date)}
          className={`btn-calendar aspect-square flex items-center justify-center text-sm rounded transition
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
        className={`flex flex-col h-full space-y-1 ${isFirstMonth ? "border-r border-r-gray-300" : ""} ${usingCurrentMonth ? "w-full border-0 border-r-0" : "w-[280px]"} `}
      >
        {/* Header Month */}
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))} className="btn-calendar p-1 text-gray-500 hover:text-black">
            <img src={Images.IconCalendarLeft} alt="" />
          </button>
          <div className="font-semibold">{monthStart.format("MMMM YYYY")}</div>
          <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))} className="btn-calendar p-1 text-gray-500 hover:text-black">
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
      {renderMonth(currentMonth, true)}
      {!usingCurrentMonth && renderMonth(currentMonth.add(1, "month"), false)}
    </div>
  );
}
