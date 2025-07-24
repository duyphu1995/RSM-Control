import { create } from "zustand";
import { ViewProjectItemDetailFilterResponse } from "@/services/viewProjectItemDetailService.ts";
import { PageDataModel, SortModel } from "@/stores/viewJobItemDetailStore.ts";
import { sortASC } from "@/constants/app_constants.ts";

interface ProjectItemDetailModel {
  items: ProjectItemModel[];
  meta: PageDataModel;
}

export interface ProjectItemModel {
  id: string;
  projectName?: string;
  jobCodeAndPart: string;
  jobLocation: string;
  drawingNumber: string;
  pieceNo?: string;
  quantity?: number;
  itemReadyQty?: string;
  itemDeliveredQty?: string;
  status?: string;
  description?: string;
  itemReadyDate?: string;
  itemDeliveredDate?: string;
  deliveryNumbers?: string[];
}

export interface ProjectItemUIConfigModel {
  name: string;
  displayName: string;
  order: number;
  selected: boolean;
}

interface ViewProjectItemDetailStore {
  data: ProjectItemDetailModel;
  setData: (data: ProjectItemDetailModel) => void;
  filters: ViewProjectItemDetailFilterResponse;
  setFilter: (filter: ViewProjectItemDetailFilterResponse) => void;
  selectedStatus: string[];
  selectedDeliveryDocket: string[];
  selectedDrawingNumbers: string[];
  selectedJobCodes: string[];
  selectedJobLocations: string[];
  setSelectedStatus: (status: string[]) => void;
  setSelectedDeliveryDocket: (status: string[]) => void;
  setSelectedDrawingNumbers: (status: string[]) => void;
  setSelectedJobCodes: (status: string[]) => void;
  setSelectedJobLocations: (status: string[]) => void;
  searchKey?: string;
  setSearchKey: (searchKey: string) => void;
  uiConfig: ProjectItemUIConfigModel[];
  setUIConfig: (uiConfig: ProjectItemUIConfigModel[]) => void;
  sortModel: SortModel;
  setSortModel: (sortModel: SortModel) => void;
  initialData: () => void;
  isLoadMore: boolean;
  setIsLoadMore: (isLoading: boolean) => void;
}

export const useViewProjectItemDetailStore = create<ViewProjectItemDetailStore>(set => ({
  data: {
    items: [],
    meta: {
      page: 1,
      pageSize: 20,
      totalRecords: 0,
      hasNextPage: false
    }
  },
  filters: {
    statuses: [],
    deliveryNumbers: [],
    jobLocations: [],
    jobCodes: [],
    drawingNumbers: []
  },
  selectedStatus: [],
  selectedDeliveryDocket: [],
  selectedDrawingNumbers: [],
  selectedJobCodes: [],
  selectedJobLocations: [],
  uiConfig: [],
  sortModel: {
    columnKey: "jobCodeAndPart",
    order: sortASC
  },
  initialData: () =>
    set({
      data: {
        items: [],
        meta: {
          page: 1,
          pageSize: 20,
          totalRecords: 0,
          hasNextPage: false
        }
      }
    }),
  isLoadMore: false,
  setIsLoadMore: (value: boolean) => set({ isLoadMore: value }),
  setSortModel: (value: SortModel) => set({ sortModel: value }),
  setUIConfig: (value: ProjectItemUIConfigModel[]) => set({ uiConfig: value }),
  setSelectedStatus: (value: string[]) => set({ selectedStatus: value }),
  setSearchKey: (value: string) => set({ searchKey: value }),
  setSelectedDeliveryDocket: (value: string[]) => set({ selectedDeliveryDocket: value }),
  setSelectedDrawingNumbers: (value: string[]) => set({ selectedDrawingNumbers: value }),
  setSelectedJobCodes: (value: string[]) => set({ selectedJobCodes: value }),
  setSelectedJobLocations: (value: string[]) => set({ selectedJobLocations: value }),
  setData: (value: ProjectItemDetailModel) =>
    set(state => {
      if (state.isLoadMore) {
        const mergedMap = new Map<string, ProjectItemModel>();

        for (const item of state.data.items) {
          mergedMap.set(item.id, item);
        }

        for (const item of value.items) {
          mergedMap.set(item.id, item);
        }

        return {
          data: {
            items: Array.from(mergedMap.values()),
            meta: value.meta
          }
        };
      } else {
        return {
          data: {
            items: value.items,
            meta: value.meta
          }
        };
      }
    }),
  setFilter: (value: ViewProjectItemDetailFilterResponse) => set({ filters: value })
}));
