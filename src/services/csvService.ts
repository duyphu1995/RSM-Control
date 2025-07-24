import { InputAndDateFilter } from "@/types/SitesSketches";
import { service } from "./api";

interface exportCSVParams {
  exportCsvFilters: InputAndDateFilter;
}

export const exportCSVService = {
  exportCSVService: (params: exportCSVParams, path: string) =>
    service.post(`/customers/${encodeURIComponent(path)}/exportCsv`, { ...params.exportCsvFilters }, { responseType: "blob", withCredentials: true })
};
