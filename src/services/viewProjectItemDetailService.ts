import { service } from "@/services/api.ts";
import { IOptionsFilter } from "@/types/majorProjects";
import { IUIConfigState } from "@/types/common";
import { ProjectItemModel, ProjectItemUIConfigModel } from "@/stores/viewProjectItemDetailStore.ts";
import { PageDataModel } from "@/stores/viewJobItemDetailStore.ts";

const urlViewProjectItemDetailService = "customers/major-project/view-item/project-item";

export interface ViewProjectItemDetailFilterResponse {
  statuses: IOptionsFilter[];
  deliveryNumbers: IOptionsFilter[];
  drawingNumbers: IOptionsFilter[];
  jobCodes: IOptionsFilter[];
  jobLocations: IOptionsFilter[];
}

export interface GetViewProjectItemDetailRequest {
  projectId__in: string[];
  status__in: string[];
  order_by: string;
  deliveryNumbers__in: string[];
  jobLocation__in: string[];
  jobCodeAndPart__in: string[];
  drawingNumber__in: string[];
  search_text?: string;
  page?: number;
  pageSize?: number;
}

export interface GetViewProjectItemDetailResponse {
  items: ProjectItemModel[];
  meta: PageDataModel;
}

export interface GetViewProjectItemUIConfigResponse {
  configType: string;
  columns: ProjectItemUIConfigModel[];
}

interface ViewProjectItemDetailFiltersRequest {
  projectId__in: string[];
}

export const viewProjectItemDetailService = {
  getViewProjectItemDetailFilters: (params: ViewProjectItemDetailFiltersRequest) =>
    service.post<ViewProjectItemDetailFilterResponse>(urlViewProjectItemDetailService + "/filters", params),
  getViewProjectItemDetailUIConfig: () => service.get<GetViewProjectItemUIConfigResponse>("/uiConfigs/MajorProject_Item"),
  updateViewProjectItemDetailUIConfig: (params: IUIConfigState) => service.put<GetViewProjectItemUIConfigResponse>("/uiConfigs", params),
  exportCSV: (params: GetViewProjectItemDetailRequest) =>
    service.post(urlViewProjectItemDetailService + "/exportCsv", params, { responseType: "blob" }),
  getViewProjectItemDetail: (params: GetViewProjectItemDetailRequest) =>
    service.post<GetViewProjectItemDetailResponse>(urlViewProjectItemDetailService + "/search", params)
};
