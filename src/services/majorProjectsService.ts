import { IUIConfigState } from "@/types/common";
import { service } from "./api";
import {
  IExportCSV,
  IFilterData,
  IJobsListFilterOptions,
  IMajorProjectJobDetails,
  IMajorProjectJobsList,
  MajorProjectFilterBody,
  MajorProjectJobResponse,
  MajorProjectSearchBody
} from "@/types/majorProjects";

const urlMajorProjects = "customers/major-project";

const majorProjectService = {
  getMajorProjectsList: (params: MajorProjectSearchBody) => service.post<MajorProjectJobResponse>(urlMajorProjects + "/search", params),
  getFilter: (model: MajorProjectFilterBody) =>
    service.get<IFilterData>(urlMajorProjects + "/filters", {
      params: {
        fromDate: model.fromDate,
        toDate: model.toDate
      }
    }),

  // UI Config
  getUiConfig: () => service.get("/uiConfigs/MajorProject_Job"),
  updateUiConfig: (params: IUIConfigState) => service.put<IUIConfigState>("/uiConfigs", params),

  //Major Project Job List
  getFilterDataJobList: (params: IExportCSV) => service.post<IJobsListFilterOptions>(urlMajorProjects + "/view-job/filters", params),

  getFilterApply: (params: IMajorProjectJobsList) => service.post<IMajorProjectJobDetails>(urlMajorProjects + "/view-job/search", params),

  getMajorProjectJobsListDetails: (params: IMajorProjectJobsList) =>
    service.post<IMajorProjectJobDetails>(urlMajorProjects + "/view-job/search", params),

  // Export CSV
  exportCSV: (params: IExportCSV) => service.post<IExportCSV>(urlMajorProjects + "/view-job/exportCsv", params, { responseType: "blob" }),

  // Print Delivery Docket
  printDeliveryDocket: (params: string) => service.post(`deliveryDockets/print-by-delivery-no/${params}`, {})
};

export default majorProjectService;
