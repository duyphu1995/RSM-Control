import * as dateRangeStore from "@/hooks/useDateRangeStore";

export function useRouteDateRange(path: any) {
  switch (path) {
    case "/":
      return dateRangeStore.useDateRangeStoreSiteSketch();
    default:
      return dateRangeStore.useDateRangeStoreMajor();
  }
}
