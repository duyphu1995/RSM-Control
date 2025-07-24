import dayjs from "dayjs";
export const BEARER_TOKEN = "BEARER_TOKEN";
export const EMAIL = "EMAIL";
export const BEARER_TOKEN_EXPIRATION_TIME = "BEARER_TOKEN_EXPIRATION_TIME";
export const MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24;
export const TOKEN_EXPIRATION_DAYS = 30; //Days
export const PROFILE = "PROFILE";
export const FILE_NAME_DEFAULT = "CSV";
//REGEX
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
export const nameRegex = /^[A-Za-z\s]{1,30}$/;
export const phonePrefix = "+";
export const fileNameBlobRegex = /filename="?([^"]+)"?/;

// Regular expression to check the criteria when setup password
export const minLengthRegex = /^.{8,}$/; // At least 8 characters
export const hasLetterRegex = /[a-zA-Z]/; // At least one letter
export const hasDigitRegex = /\d/; // At least one digit

//BE Constants
export const customerLoginType = "CustomerWebApp";
export enum AuthError {
  passwordHasBeenChange = "Password_has_been_changed",
  tokenIsExpired = "Token_is_expired",
  accountHasBeenLoggedInOnAnotherDevice = "Account_has_been_logged_in_on_another_device",
  accountHasBeenDeactivated = "Account_has_been_deactivated",
  accountHasBeenDeleted = "Account_has_been_deleted",
  accountValidationFailed = "Validation Failed",
  emailAddressHasBeenChanged = "Email_has_been_changed",
  unknown = "Unknown"
}

export enum UIConfigTypes {
  majorProjectItem = "MajorProject_Item",
  majorJobItem = "MajorProject_JobItem"
}

export enum StatusId {
  inProduction = "InProduction"
}

export const phoneNumberMaxLength = 15;
export const defaultCountry = "AU";
export const phoneNumberCountryCode = "+61";
export const maxFileSizeMB = 2;
export const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
export const allowedFileType = ["image/jpeg", "image/jpg", "image/jfif", "image/png"];
export const allowedFileExtension = [".jpg", ".jpeg", ".jfif", ".png"];
export const imageAllowedFileExtension = "image/jpeg,image/jpg,image/jfif,image/png";
export const sortASC = "ASC";
export const sortDESC = "DESC";

//DATE
export const ddMMyyFormat = "dd/MM/yyyy";

export const TIME_FORMAT = {
  WEEK_VN_DATE: "ddd DD/MM/YYYY",
  VN_DATE: "DD/MM/YYYY",
  US_DATE: "MMM DD, YYYY",
  DATE: "YYYY-MM-DD",
  ISO: "YYYY-MM-DDTHH:mm:ss",
  MONTH_YEAR: "MMM - YYYY",
  GMT: "MMM DD, YYYY h:mm:ss A [(GMT] Z[)]",
  CSV_DATE: "DD-MM-YYYY",
  DUE_DATE: "ddd DD/MM/YYYY",
  DATE_HRS: "DD/MM/YYYY HH:mm"
};

export const STATUS_FORMAT_COLOR: Record<string, string> = {
  "In Production": "#00C2EF",
  Ready: "#C18D00",
  "Required Booking": "#EC4899",
  "Delivery Booked": "#3B82F6",
  Cancelled: "#6D4C41",
  Delivered: "#00C853",
  "On Hold": "#B266FF",
  Exception: "#DC2626",
  default: "#d9d9d9"
};

export const stringEmDash = "\u2014";

export const clearLocalDateRangeAndFilter = {
  dateRangeSiteSketch: "date-range:siteSketch",
  dateRangeMajor: "date-range:major",
  filterSiteSketch: "filter-store-sketch"
};
const today = dayjs();
export const presetDates = [
  { label: "Today", range: [today, today] },
  {
    label: "Yesterday",
    range: [today.subtract(1, "day"), today.subtract(1, "day")]
  },
  { label: "This week", range: [today.startOf("week"), today.endOf("week")] },
  {
    label: "Last week",
    range: [today.subtract(1, "week").startOf("week"), today.subtract(1, "week").endOf("week")]
  },
  {
    label: "This month",
    range: [today.startOf("month"), today.endOf("month")]
  },
  { label: "Last 7 days", range: [today.subtract(6, "day"), today] },
  { label: "Last 14 days", range: [today.subtract(13, "day"), today] },
  { label: "Last 30 days", range: [today.subtract(29, "day"), today] },
  { label: "Last 45 days", range: [today.subtract(44, "day"), today] },
  { label: "Last 60 days", range: [today.subtract(59, "day"), today] }
];
