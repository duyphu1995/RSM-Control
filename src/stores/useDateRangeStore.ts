import { create } from "zustand";
import dayjs, { Dayjs } from "dayjs";

const LOCAL_STORAGE_PREFIX = "date-range";
export interface DateRangeState {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  setDateRange: (start: Dayjs | null, end: Dayjs | null) => void;
  setStartDate: (start: Dayjs | null) => void;
  setEndDate: (end: Dayjs | null) => void;
  clearRange: () => void;
}

function getStorageKey(key: string) {
  return `${LOCAL_STORAGE_PREFIX}:${key}`;
}

function loadInitialState(key: string): Pick<DateRangeState, "startDate" | "endDate"> {
  try {
    const raw = localStorage.getItem(getStorageKey(key));
    if (!raw) return { startDate: dayjs().subtract(30, "day"), endDate: dayjs() };

    const parsed = JSON.parse(raw);
    return {
      startDate: parsed.startDate ? dayjs(parsed.startDate) : null,
      endDate: parsed.endDate ? dayjs(parsed.endDate) : null
    };
  } catch {
    return { startDate: dayjs(), endDate: dayjs() };
  }
}

function saveState(key: string, startDate: Dayjs | null, endDate: Dayjs | null) {
  localStorage.setItem(
    getStorageKey(key),
    JSON.stringify({
      startDate: startDate?.toISOString() ?? null,
      endDate: endDate?.toISOString() ?? null
    })
  );
}

export function useDateRangeStore(key: string) {
  const { startDate, endDate } = loadInitialState(key);

  return create<DateRangeState>((set, get) => ({
    startDate,
    endDate,
    setDateRange: (s, e) => {
      saveState(key, s, e);
      set({ startDate: s, endDate: e });
    },
    setStartDate: s => {
      saveState(key, s, get().endDate);
      set({ startDate: s });
    },
    setEndDate: e => {
      saveState(key, get().startDate, e);
      set({ endDate: e });
    },
    clearRange: () => {
      saveState(key, null, null);
      set({ startDate: null, endDate: null });
    }
  }));
}
