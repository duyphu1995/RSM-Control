import { create } from "zustand";
import { IJobsListFilterOptions, IMajorProjectJobDetailsResponse, IMajorProjectJobsList } from "@/types/majorProjects";
import { ItemUIConfigModel } from "./viewJobItemDetailStore";

const defaultSearchParams: IMajorProjectJobsList = {
  pageSize: 20,
  page: 1,
  search_text: undefined,
  projectId__in: [],
  jobLocation__in: undefined,
  jobCode__in: undefined,
  drawingNumber__in: undefined,
  status__in: undefined,
  deliveryNumbers__in: undefined
};

export interface MajorProjectJobsListStore {
  pageSize: number | undefined;
  page: number | undefined;
  search_text: string | undefined;
  projectId__in: string[] | undefined;
  dataResponse: IMajorProjectJobDetailsResponse;
  jobLocation__in: string[] | undefined;
  jobCode__in: string[] | undefined;
  drawingNumber__in: string[] | undefined;
  status__in: string[] | undefined;
  deliveryNumbers__in: string[] | undefined;

  setPageSize: (pageSize?: number) => void;
  setPage: (page?: number) => void;
  setSearchText: (searchText?: string) => void;
  setProjectIdIn: (projectId__in?: string[]) => void;
  setDataResponse: (dataResponse: IMajorProjectJobDetailsResponse) => void;

  setAllSearchParams: (params: Partial<IMajorProjectJobsList>) => void;
  resetSearchParams: () => void;
  selectedJobLocations: string[];
  selectedDrawingNumber: string[];
  selectedJobCodes: string[];
  selectedJobStatus: string[];
  selectedDeliveryDocket: string[];
  setSelectedJobLocations: (selectedJobLocations: string[]) => void;
  setSelectedDrawingNumber: (selectedDrawingNumber: string[]) => void;
  setSelectedJobCodes: (selectedJobCodes: string[]) => void;
  setSelectedJobStatus: (selectedJobStatus: string[]) => void;
  setSelectedDeliveryDocket: (selectedDeliveryDocket: string[]) => void;
  uiConfig: ItemUIConfigModel[];
  setUIConfig: (uiConfig: ItemUIConfigModel[]) => void;
  filters: IJobsListFilterOptions;
  setFilter: (filter: IJobsListFilterOptions) => void;
}

export const useMajorProjectJobListStore = create<MajorProjectJobsListStore>(set => ({
  pageSize: defaultSearchParams.pageSize,
  page: defaultSearchParams.page,
  search_text: defaultSearchParams.search_text,
  projectId__in: defaultSearchParams.projectId__in,
  jobLocation__in: defaultSearchParams.jobLocation__in,
  jobCode__in: defaultSearchParams.jobCode__in,
  drawingNumber__in: defaultSearchParams.drawingNumber__in,
  status__in: defaultSearchParams.status__in,
  deliveryNumbers__in: defaultSearchParams.deliveryNumbers__in,
  dataResponse: {
    items: [],
    meta: {
      count: 0,
      hasNextPage: false,
      hasPrevPage: false,
      page: 0,
      pageSize: 0,
      totalPages: 0,
      totalRecords: 0,
      type: ""
    }
  },

  filters: {
    statuses: [],
    deliveryNumbers: [],
    jobLocations: [],
    jobCodes: [],
    drawingNumbers: []
  },

  setPageSize: pageSize => set({ pageSize: pageSize }),
  setPage: page => set({ page: page }),
  setSearchText: searchText => set({ search_text: searchText }),
  setProjectIdIn: projectIds => set({ projectId__in: projectIds }),
  setDataResponse: dataResponse => set({ dataResponse: dataResponse }),

  setAllSearchParams: params =>
    set(() => {
      const newState: Partial<MajorProjectJobsListStore> = {};
      if (params.pageSize !== undefined) newState.pageSize = params.pageSize;
      if (params.page !== undefined) newState.page = params.page;
      if (params.search_text !== undefined) newState.search_text = params.search_text;
      if (params.projectId__in !== undefined) newState.projectId__in = params.projectId__in;
      if (params.jobLocation__in !== undefined) newState.jobLocation__in = params.jobLocation__in;
      if (params.jobCode__in !== undefined) newState.jobCode__in = params.jobCode__in;
      if (params.deliveryNumbers__in !== undefined) newState.deliveryNumbers__in = params.deliveryNumbers__in;
      if (params.status__in !== undefined) newState.status__in = params.status__in;
      if (params.deliveryNumbers__in !== undefined) newState.deliveryNumbers__in = params.deliveryNumbers__in;
      return newState;
    }),
  resetSearchParams: () => set(defaultSearchParams),
  selectedJobLocations: [],
  selectedDrawingNumber: [],
  selectedJobCodes: [],
  selectedJobStatus: [],
  selectedDeliveryDocket: [],
  setSelectedJobLocations: (value: string[]) => set({ selectedJobLocations: value }),
  setSelectedDrawingNumber: (value: string[]) => set({ selectedDrawingNumber: value }),
  setSelectedJobCodes: (value: string[]) => set({ selectedJobCodes: value }),
  setSelectedJobStatus: (value: string[]) => set({ selectedJobStatus: value }),
  setSelectedDeliveryDocket: (value: string[]) => set({ selectedDeliveryDocket: value }),
  uiConfig: [],
  setUIConfig: (value: ItemUIConfigModel[]) => set({ uiConfig: value }),
  setFilter: (value: IJobsListFilterOptions) => set({ filters: value })
}));
