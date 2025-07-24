//LOGIN
export const stringEmail = "Email";
export const stringPassword = "Password";
export const rememberMe = "Remember Me";
export const forgotPassword = "Forgot Password?";
export const rememberPassword = "Remember password?";
export const signIn = "Sign In";
export const reLogIn = "Re-login";
export const logIn = "Log In";
export const signOut = "Sign Out";
export const setupPassword = "Set Up Password";
export const enterPasswordStr = "Enter your password";
export const enternPasswordStr = "Enter new password";
export const nPasswordStr = "New password";
export const entercPasswordStr = "Enter current password";
export const cPasswordStr = "Current password";
export const confirmnPasswordStr = "Confirm new password";
export const confirmPasswordStr = "Confirm your password";
export const errorMatchingPassword = "Password doesn’t match.";
export const passwordRuleLength = "The password must be at least 8 characters.";
export const passwordRuleLeterDigit = "The password must contain at least:";
export const passwordRuleDetail = ["one (1) letter: a-z", "one (1) digit (0-9)"];
export const submitBtn = "Submit";
export const sendEmail = "Send Email";
export const resetPassword = "Reset Password";
export const forgot = "Forgot Password";
export const forgotError = "The entered email cannot be found. Please try again.";
export const changePassword = "Change Password";
export const errAtLeast8CharMsg = "The password must be at least 8 characters.";
export const errContainAtLeastLetterAndDigitMsg = "Must contain at least one letter and one digit.";
export const changePasswordSuccessfully = "Password changed successfully.";
export const pleaseConfirmNewPassword = "Please confirm your new password.";
export const pleaseEnterCurrentPassword = "Please enter your current password.";
export const enterYourEmail = "Enter your email address";
export const emailAddress = "Email address";
export const forgotDes = "We’ll send a reset password link to your email address shortly. Please enter your email.";
export const owner = "© 2025 Rectangle Sheetmetal. All rights reserved.";
export const stringCancel = "Cancel";
export const confirmSignOut = "Confirm Sign Out";
export const confirmChangePassword = "Change Password";
export const confirmSignOutMessage = "Are you sure you want to sign out?";
export const confirmChangePasswordMessage = "Are you sure you want to change password?";
export const confirmText = "Confirm";
export const confirmTitle = "Confirmation";
export const confirmReLogin = "Your password changed successfully. Please help to re-login with new password.";
export const yourSessionExpired = "Your login session has expired. Please log in again.";
export const stringWarning = "Warning";
export const setupPasswordSuccessfully = "Password updated successfully.";
export const resetPasswordSuccessfully = "Password reset successfully.";
export const tokenNotFound = "Token not found.";
export const sendEmailMessageSuccessfully = "The reset password mail sent successfully.";
export const incorrectEmailOrPassword = "Incorrect email or password. Please try again.";

//Profile
export const stringSave = "Save";
export const stringEditProfile = "Edit Profile";
export const avatarValidation = "Must be a .JPG or .PNG file smaller than 2MB.";
export const stringUploadImage = "Upload Image";
export const stringRemove = "Remove";
export const firstName = "First name";
export const lastName = "Last name";
export const mobilePhone = "Mobile phone";
export const stringChangePassword = "Change Password";
export const firstNameValidation = "First name can contain letters, with a max length of 30.";
export const lastNameValidation = "Last name can contain letters, with a max length of 30.";
export const mobilePhoneValidation = "Wrong phone number format.";
export const thisFieldIsRequired = "This field is required.";
export const yourProfileChangedSuccessfully = "Your profile changed successfully.";

// Site Sketches
export const SitesSketches = "Site Sketches";
export const MajorProjects = "Major Projects";
export const InProduction = "In Production";
export const Ready = "Ready";
export const Delivered = "Delivered";
export const searchPlaceHolder = "Search by Job Code, Project Name, P.O Number, Job Address";
export const searchPlaceHolderMajorProjects = "Search by Project Name, Project Address, Company";
export const searchPlaceHolderMajorProjectsJobsList = "Search by Job Code, Job Code - Part No.";
export function couldNotLoadImageDueToAllowedFile(allowedFileExtension: string[]): string {
  return `Could not load image. Only ${allowedFileExtension.join(", ")} files are allowed. Please try again.`;
}
export function couldNotLoadImageDueToFileSize(maxFileSizeMB: number): string {
  return `Could not load image, the maximum size is ${maxFileSizeMB}MB. Please try again.`;
}
export const uploadAvatar = "Upload avatar";
export const stringMenu = "MENU";
export const stringProfile = "PROFILE";

// Major Project Job List
export const filterTitles = [
  {
    key: "drawingNumbers",
    name: "Drawing Number"
  },
  {
    key: "statuses",
    name: "Job Status"
  },
  {
    key: "jobLocations",
    name: "Job Location"
  },
  {
    key: "jobCodes",
    name: "Job Code"
  },
  {
    key: "deliveryNumbers",
    name: "Delivery Docket"
  }
];
export const txtStartDate = "Start Date";
export const txtDueDate = "Due Date";
export const txtJobLocation = "Job Location";
export const txtDrawing = "Drawing";
export const txtExportCSVSuccessfully = "Export CSV successfully.";
export const txtExportCSVFileName = "major_project_jobs_list_";

//View Job Items Detail
export const jobItemDetailPageHeader = "Major Projects List - Jobs List - Job Items List";
export const jobItemDetailMobilePageHeader = "Job Items List";
export const projectName = "Project Name";
export const jobCode = "Job Code";
export const drawing = "Drawing";
export const jobLocation = "Job Location";
export const searchByPieceNumber = "Search by Piece Number";
export const itemStatus = "Item Status";
export const deliveryDocket = "Delivery Docket";
export const textClear = "Clear";
export const textApply = "Apply";
export const textUIConfig = "UI Config";
export const textTotalItems = "total items";
export const textTotalProjects = "projects";
export const textExportCSV = "Export CSV";
export const textPieceNumber = "Piece Number";
export const textQuantity = "Quantity";
export const textReadyQty = "Ready Qty";
export const textDeliveredQty = "Delivered Qty";
export const textStatus = "Status";
export const textDescription = "Description";
export const textCompany = "Company";
export const textProjectName = "Project Name";
export const textReadyDate = "Ready Date";
export const textDeliveredDate = "Delivered Date";
export const textDeliveryDocket = "Delivery Docket";
export const textCSV = "CSV";
export const somethingWentWrong = "Something went wrong. Please try again.";
export const textFilters = "Filters";
export const noResultFound = "No result found. Try adjusting your search or filter to find what you’re looking for.";

//Status
export const statusInProduction = "In Production";
export const statusReady = "Ready";
export const statusCancelled = "Cancelled";
export const statusDelivered = "Delivered";
export const statusException = "Exception";
export const statusRequiredBooking = "Required Booking";
export const statusOnHold = "On Hold";
export const statusDeliveryBooked = "Delivery Booked";

//Query String on URL for get method
export const tokenQueryStr = "token";

//View Project Items Detail
export const projectItemDetailPageHeader = "Major Projects List - Project Items List";
export const textProjectId = "Project ID";
export const textProject = "Project";
export const textDrawingNumber = "Drawing Number";
export const textJobCode = "Job Code";
export const textJobLocation = "Job Location";
export const textLocation = "Location";
export const textItemStatus = "Item Status";
export const projectItemDetailMobilePageHeader = "Project Items List";
export const textReady = "Ready";
export const textDelivered = "Delivered";
export const textViewLess = "View less";
export const textViewMore = "View more";
export const accountDeletedOrDeactivated = "Your account has been inactivated or deleted. Please contact the staff to get support.";
export const downloadCSVSuccessfully = "Export CSV successfully.";

//Auth string
export const emailAddressHasBeenChanged = "Your email address has been updated. Check your new email for a link to setup your new password.";
