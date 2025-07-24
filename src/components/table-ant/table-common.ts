import { TIME_FORMAT } from "@/constants/app_constants";
import dayjs from "dayjs";

const compareString = (a: string, b: string) => (a || "").localeCompare(b || "");

const compareDate = (a: string, b: string) => dayjs(a, "DD/MM/YYYY").unix() - dayjs(b, "DD/MM/YYYY").unix();

const compareNumber = (a: number, b: number) => {
  return a - b;
};

const compareBoolean = (a: boolean, b: boolean) => (a === b ? 0 : a ? 1 : -1);

const compareGrade = <T extends { minGrade: number; maxGrade: number }>(a: T, b: T): number => {
  if (!a || !b) return 0;

  const { minGrade: minGradeA, maxGrade: maxGradeA } = a;
  const { minGrade: minGradeB, maxGrade: maxGradeB } = b;

  return minGradeA !== minGradeB ? minGradeA - minGradeB : maxGradeA - maxGradeB;
};

export const createSorter = <T>(dataIndex: keyof T, type: "string" | "date" | "number" | "boolean" | "grade" = "string") => {
  return (a: T, b: T) => {
    if (type === "grade") {
      return compareGrade(a as { minGrade: number; maxGrade: number }, b as { minGrade: number; maxGrade: number });
    }

    let valueA: any = a[dataIndex];
    let valueB: any = b[dataIndex];

    if (type === "boolean") {
      if (valueA === undefined) valueA = false;
      if (valueB === undefined) valueB = false;
    }

    if (valueA === undefined) return 1;
    if (valueB === undefined) return -1;

    switch (type) {
      case "date":
        return compareDate(valueA as string, valueB as string);
      case "number":
        return compareNumber(valueA as number, valueB as number);
      case "boolean":
        return compareBoolean(valueA as boolean, valueB as boolean);
      default:
        return compareString(valueA?.trim() as string, valueB?.trim() as string);
    }
  };
};

export const formatTimeDayMonthYear = (time: any, formatType: string = "YYYY-MM-DD") => {
  if (time) {
    return dayjs(time, formatType).format(TIME_FORMAT.VN_DATE);
  }
  return null;
};

export const formatTimeWeekDayMonthYear = (time: any, formatType: string = "YYYY-MM-DD") => {
  if (time) {
    return dayjs(time, formatType).format(TIME_FORMAT.WEEK_VN_DATE);
  }
  return null;
};
