import { useToast } from "@/components/common/toast/ToastProvider";
import { useMutation } from "@tanstack/react-query";
import { exportCSVService } from "@/services/csvService";
import { ToastType } from "@/components/common/toast/Toast";
import { TIME_FORMAT } from "@/constants/app_constants.ts";
import dayjs from "dayjs";
import { downloadCSVSuccessfully } from "@/constants/strings";
import { InputAndDateFilter } from "@/types/SitesSketches";

export const useExportCsv = (fileName: string, urlPath: string, exportCsvFilters: InputAndDateFilter) => {
  const { showToast } = useToast();
  // Parse date strings to dayjs objects for filename formatting
  const parsedFromDate = dayjs(exportCsvFilters?.fromDate);
  const parsedToDate = dayjs(exportCsvFilters?.toDate);
  // Get the IANA timezone name of the device/browser.
  const getDeviceTimezone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone;
  // Create a new filters object with the timezone property included
  const filtersWithTimezone = {
    ...exportCsvFilters,
    timezone: getDeviceTimezone()
  };
  return useMutation({
    mutationFn: () => exportCSVService.exportCSVService({ exportCsvFilters: filtersWithTimezone }, urlPath),
    onSuccess: (response: unknown) => {
      // If you know the type of response, replace 'unknown' with the actual type.
      const blob = (response as any)?.data as Blob;
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${fileName}_${parsedFromDate.format(TIME_FORMAT.CSV_DATE)}_${parsedToDate.format(TIME_FORMAT.CSV_DATE)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
      showToast(ToastType.success, downloadCSVSuccessfully);
    },
    onError: (error: unknown) => {
      showToast(ToastType.error, (error as Error).message);
    }
  });
};
