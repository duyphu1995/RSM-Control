import { InputAndDateFilter } from "@/types/SitesSketches";
import { service } from "./api";

interface SketchUIConfigState {
  configType: string;
  columns: string[];
}

interface SketchDateRangeFilter {
  fromDate?: string;
  toDate?: string;
}

export const siteSketchesService = {
  getSketchesList: (filter: InputAndDateFilter) => service.post("/customers/site-sketch/search", filter, undefined, false)
};

export const siteSkectchNumberStatus = {
  getNumberStatus: () => service.get("/customers/site-sketch/count-by-status")
};

export const siteSkectchFilter = {
  getSiteSkectchFilter: (filter: SketchDateRangeFilter) =>
    service.get(`/customers/site-sketch/filters?fromDate=${filter.fromDate}&toDate=${filter.toDate}`)
};

export const siteSketchUiConfig = {
  getSiteSketchUiConfig: () => service.get("/uiConfigs/SiteSketch")
};

export const updateSiteSketchUiConfig = {
  updateSiteSketchUiConfig: (siteSketchConfig: SketchUIConfigState) => service.put("/uiConfigs", siteSketchConfig)
};
