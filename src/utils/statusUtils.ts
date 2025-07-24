import { THEME } from "@/constants";

export const statusColors: Record<string, string> = {
  "In Production": THEME.COLORS.STATUS.IN_PRODUCTION,
  Ready: "#D19500",
  Cancelled: "#83664B",
  Delivered: "#22C55E",
  Exception: "#DC2626",
  "Required Booking": "#EC4899",
  "On Hold": "#A855F7",
  "Delivery Booked": "#3B82F6"
};
