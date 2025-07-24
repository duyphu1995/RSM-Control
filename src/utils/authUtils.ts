import {
  AuthError,
  BEARER_TOKEN,
  BEARER_TOKEN_EXPIRATION_TIME,
  EMAIL,
  MILLISECONDS_IN_ONE_DAY,
  PROFILE,
  TOKEN_EXPIRATION_DAYS,
  clearLocalDateRangeAndFilter
} from "@/constants/app_constants.ts";
import { ProfileModel } from "@/stores/profileStore.ts";
import { ProfileResponse } from "@/services/authService.ts";
import { deepCompareObjects } from "@/utils/objectUtil.ts";
import { ErrorResponse } from "@/services/api.ts";
import { accountDeletedOrDeactivated, emailAddressHasBeenChanged } from "@/constants/strings.ts";
import { useAuthStore } from "@/stores/authStore.ts";

export const getBearerToken = () => {
  const localStorageToken = localStorage.getItem(BEARER_TOKEN);
  if (localStorageToken && !isTokenExpired()) {
    return localStorageToken;
  }
  return sessionStorage.getItem(BEARER_TOKEN);
};

export const getAccountEmail = () => {
  const email = localStorage.getItem(EMAIL);
  if (email && !isTokenExpired()) {
    return email;
  }
  return sessionStorage.getItem(EMAIL) ?? "";
};

export const isTokenExpired = () => {
  const tokenTime = localStorage.getItem(BEARER_TOKEN_EXPIRATION_TIME);
  if (tokenTime) {
    const diffInMilliseconds = Math.abs(parseInt(tokenTime, 10) - Date.now());
    const diffInDays = diffInMilliseconds / MILLISECONDS_IN_ONE_DAY;
    return diffInDays > TOKEN_EXPIRATION_DAYS;
  }
  return false;
};

export const removeToken = () => {
  localStorage.removeItem(BEARER_TOKEN);
  localStorage.removeItem(BEARER_TOKEN_EXPIRATION_TIME);
  localStorage.removeItem(EMAIL);
  localStorage.removeItem(PROFILE);
  localStorage.removeItem(clearLocalDateRangeAndFilter.dateRangeSiteSketch);
  localStorage.removeItem(clearLocalDateRangeAndFilter.dateRangeMajor);
  localStorage.removeItem(clearLocalDateRangeAndFilter.filterSiteSketch);
  sessionStorage.removeItem(BEARER_TOKEN);
  sessionStorage.removeItem(EMAIL);
};

export const getLocalProfile = () => {
  const storedProfile = localStorage.getItem(PROFILE);
  return storedProfile ? (JSON.parse(storedProfile) as ProfileModel) : null;
};

export const saveProfileData = (data: ProfileResponse, isForce: boolean = false) => {
  const profile = JSON.stringify({
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    countryCallingCode: data.countryCallingCode,
    mobileNumber: data.mobileNumber,
    avatar: data.avatar
  });
  if (isForce) {
    localStorage.setItem(PROFILE, profile);
    return;
  }
  const currentProfile = getLocalProfile();
  if (currentProfile && !deepCompareObjects(currentProfile, profile)) {
    localStorage.setItem(PROFILE, profile);
  }
};

export const isAuthErrorMessageLoop = (message: string) => {
  for (const enumValue of Object.values(AuthError)) {
    if (enumValue === message) {
      return true;
    }
  }
  return false;
};

export const handleClearSession = (err: ErrorResponse) => {
  const { isExpired, setIsExpired, setMessage } = useAuthStore.getState();
  if (isExpired && isAuthErrorMessageLoop(err.message)) {
    return;
  }
  switch (err.message) {
    case AuthError.accountHasBeenDeactivated:
    case AuthError.accountHasBeenDeleted: {
      setIsExpired(true);
      setMessage(accountDeletedOrDeactivated);
      break;
    }
    case AuthError.accountHasBeenLoggedInOnAnotherDevice:
    case AuthError.passwordHasBeenChange:
    case AuthError.tokenIsExpired: {
      setIsExpired(true);
      break;
    }
    case AuthError.emailAddressHasBeenChanged: {
      setIsExpired(true);
      setMessage(emailAddressHasBeenChanged);
      break;
    }
    default: {
      break;
    }
  }
};
