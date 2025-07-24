import { stringEmDash } from "@/constants/app_constants";
import { Tooltip } from "antd";
import { ReactNode } from "react";

export const formatNumberWithDecimalPlaces = (value: number = 0, decimalPlaces: number = 2): number => {
  if (Number.isInteger(value)) {
    return value;
  }

  return Number(value.toFixed(decimalPlaces));
};

export const renderWithFallback = (data: ReactNode, truncateLength: number = 30) => {
  if (data === "" || data === null || data === undefined || (Array.isArray(data) && data.length === 0)) {
    return stringEmDash;
  }

  if (typeof data === "number") {
    return formatNumberWithDecimalPlaces(data);
  }

  if (typeof data === "string" && data.length > truncateLength) {
    const truncatedName = data.slice(0, truncateLength) + "...";
    return <Tooltip title={data}>{truncatedName}</Tooltip>;
  }

  return data;
};
