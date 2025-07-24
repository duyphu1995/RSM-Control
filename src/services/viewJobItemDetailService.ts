import { service } from "@/services/api.ts";
import { IOptionsFilter } from "@/types/majorProjects";
import { ItemModel, ItemUIConfigModel, PageDataModel } from "@/stores/viewJobItemDetailStore.ts";
import { IUIConfigState } from "@/types/common";

const urlViewJobItemDetailService = "customers/major-project/view-item/job-item";

export interface ViewJobItemDetailFilterResponse {
  statuses: IOptionsFilter[];
  deliveryNumbers: IOptionsFilter[];
}

export interface GetViewJobItemDetailRequest {
  jobId__in: string[];
  status__in: string[];
  deliveryNumbers__in: string[];
  order_by: string;
  search_text?: string;
  page?: number;
  pageSize?: number;
}

export interface GetViewJobItemDetailResponse {
  items: ItemModel[];
  meta: PageDataModel;
}

export interface GetViewJobItemUIConfigResponse {
  configType: string;
  columns: ItemUIConfigModel[];
}

interface ViewJobItemDetailFiltersRequest {
  jobId__in: string[];
}

export const viewJobItemDetailService = {
  getViewJobItemDetailFilters: (params: ViewJobItemDetailFiltersRequest) =>
    service.post<ViewJobItemDetailFilterResponse>(urlViewJobItemDetailService + "/filters", params),
  getViewJobItemDetailUIConfig: () => service.get<GetViewJobItemUIConfigResponse>("/uiConfigs/MajorProject_JobItem"),
  updateViewJobItemDetailUIConfig: (params: IUIConfigState) => service.put<GetViewJobItemUIConfigResponse>("/uiConfigs", params),
  exportCSV: (params: GetViewJobItemDetailRequest) => service.post(urlViewJobItemDetailService + "/exportCsv", params, { responseType: "blob" }),
  getViewJobItemDetail: (params: GetViewJobItemDetailRequest) =>
    service.post<GetViewJobItemDetailResponse>(urlViewJobItemDetailService + "/search", params)
};
