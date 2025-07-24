import { create } from "zustand";
import { ViewJobItemDetailFilterResponse } from "@/services/viewJobItemDetailService.ts";
import { sortASC } from "@/constants/app_constants.ts";

interface JobItemDetailModel {
  items: ItemModel[];
  meta: PageDataModel;
}

export interface PageDataModel {
  page: number;
  pageSize: number;
  totalRecords: number;
  hasNextPage: boolean;
}

export interface SortModel {
  order: string;
  columnKey: string;
}

export interface ItemModel {
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

export interface ItemUIConfigModel {
  name: string;
  displayName: string;
  order: number;
  selected: boolean;
}

interface ViewJobItemDetailStore {
  data: JobItemDetailModel;
  setData: (data: JobItemDetailModel) => void;
  filters: ViewJobItemDetailFilterResponse;
  setFilter: (filter: ViewJobItemDetailFilterResponse) => void;
  selectedStatus: string[];
  selectedDeliveryDocket: string[];
  setSelectedStatus: (status: string[]) => void;
  setSelectedDeliveryDocket: (status: string[]) => void;
  searchKey?: string;
  setSearchKey: (searchKey: string) => void;
  uiConfig: ItemUIConfigModel[];
  setUIConfig: (uiConfig: ItemUIConfigModel[]) => void;
  initialData: () => void;
  sortModel: SortModel;
  setSortModel: (sortModel: SortModel) => void;
  isLoadMore: boolean;
  setIsLoadMore: (isLoading: boolean) => void;
}

export const useViewJobItemDetailStore = create<ViewJobItemDetailStore>(set => ({
  data: {
    items: [],
    meta: {
      page: 1,
      pageSize: 20,
      totalRecords: 0,
      hasNextPage: false
    }
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
  filters: {
    statuses: [],
    deliveryNumbers: []
  },
  selectedStatus: [],
  selectedDeliveryDocket: [],
  uiConfig: [],
  sortModel: {
    columnKey: "pieceNo",
    order: sortASC
  },
  isLoadMore: false,
  setIsLoadMore: (value: boolean) => set({ isLoadMore: value }),
  setSortModel: (value: SortModel) => set({ sortModel: value }),
  setUIConfig: (value: ItemUIConfigModel[]) => set({ uiConfig: value }),
  setSelectedStatus: (value: string[]) => set({ selectedStatus: value }),
  setSearchKey: (value: string) => set({ searchKey: value }),
  setSelectedDeliveryDocket: (value: string[]) => set({ selectedDeliveryDocket: value }),
  setData: (value: JobItemDetailModel) =>
    set(state => {
      if (state.isLoadMore) {
        const mergedMap = new Map<string, ItemModel>();

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
  setFilter: (value: ViewJobItemDetailFilterResponse) => set({ filters: value })
}));
