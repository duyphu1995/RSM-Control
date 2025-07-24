export const THEME = {
  COLORS: {
    PRIMARY: "#F97316",
    SECONDARY: "#6c757d",
    SUCCESS: "#28a745",
    DANGER: "#DC2626",
    WARNING: "#ffc107",
    INFO: "#17a2b8",
    LIGHT: "#f8f9fa",
    DARK: "#343a40",
    WHITE: "#ffffff",
    BLACK: "#000000",
    HEADER: "#101828",
    ORANGE_600: "#EA580C",
    SLIDER_THUMB: "#E04F16",
    SLIDER_RAIL: "#ffe0e6",
    PASSWORD: {
      VALID: "#16A34A",
      INIT: "#737373",
      FAIL: "#DC2626"
    },
    SITES_SKETCHES: {
      INPRODUCTION: "#CFF7FE",
      READY: "#FFFEC1",
      DELIVERED: "#DCFCE8",
      COMPLETED: "#DCFCE8"
    },
    STATUS: {
      IN_PRODUCTION: "#06B6D4",
      READY: "#D19500",
      DELIVERED: "#22C55E",
      CANCELLED: "#83664B",
      EXCEPTION: "#DC2626",
      REQUIRED_BOOKING: "#EC4899",
      ON_HOLD: "#A855F7",
      DELIVERY_BOOKED: "#3B82F6"
    }
  },
  SPACING: {
    SMALL: "0.5rem",
    MEDIUM: "1rem",
    LARGE: "2rem",
    XLARGE: "4rem"
  },
  BREAKPOINTS: {
    MOBILE: "576px",
    TABLET: "768px",
    DESKTOP: "992px",
    WIDESCREEN: "1200px"
  }
} as const;

export type ThemeColors = typeof THEME.COLORS;
export type ThemeSpacing = typeof THEME.SPACING;
export type ThemeBreakpoints = typeof THEME.BREAKPOINTS;
