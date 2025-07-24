// src/stores/majorProjectStore.ts
import { create } from "zustand";
import { IFilterData, IMajorProjectJob, MajorProjectJobResponse, MajorProjectSearchBody } from "@/types/majorProjects";
import { SortModel } from "@/stores/viewJobItemDetailStore.ts";

const defaultSearchParams: MajorProjectSearchBody = {
  order_by: "{ lastActivityDate: DESC }",
  pageSize: 20,
  page: 1,
  fromDate: undefined,
  toDate: undefined,
  search_text: undefined,
  companyId__in: [],
  id__in: []
};

interface MajorProjectStore {
  order_by: string | undefined;
  pageSize: number | undefined;
  page: number | undefined;
  fromDate: string | undefined;
  toDate: string | undefined;
  search_text: string | undefined;
  companyId__in: string[];
  id__in: string[];
  dataResponse: MajorProjectJobResponse;
  filters: IFilterData;
  tempFilters: IFilterData;
  sortModel: SortModel;

  setOrderBy: (orderBy?: string) => void;
  setPageSize: (pageSize?: number) => void;
  setPage: (page?: number) => void;
  setFromDate: (fromDate?: string) => void;
  setToDate: (toDate?: string) => void;
  setSearchText: (searchText?: string) => void;
  setCompanyIdIn: (companyIds: string[]) => void;
  setIdIn: (names: string[]) => void;
  setDataResponse: (dataResponse: MajorProjectJobResponse) => void;
  setFilters: (filters: IFilterData) => void;
  setTempFilters: (filters: IFilterData) => void;
  setSortModel: (sortModel: SortModel) => void;

  setAllSearchParams: (params: Partial<MajorProjectSearchBody>) => void;
  getSearchParams: () => MajorProjectSearchBody;
  resetSearchParams: () => void;
}

export const useMajorProjectStore = create<MajorProjectStore>((set, get) => ({
  order_by: defaultSearchParams.order_by,
  pageSize: defaultSearchParams.pageSize,
  page: defaultSearchParams.page,
  fromDate: defaultSearchParams.fromDate,
  toDate: defaultSearchParams.toDate,
  search_text: defaultSearchParams.search_text,
  companyId__in: defaultSearchParams.companyId__in ?? [],
  id__in: defaultSearchParams.id__in ?? [],
  filters: {
    companies: [],
    projectNames: []
  },
  sortModel: {
    columnKey: "lastActivityDate",
    order: "DESC"
  },
  tempFilters: {
    companies: [],
    projectNames: []
  },
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

  setSortModel: (value: SortModel) => set({ sortModel: value }),
  setOrderBy: orderBy => set({ order_by: orderBy }),
  setPageSize: pageSize => set({ pageSize: pageSize }),
  setPage: page => set({ page: page }),
  setFromDate: fromDate => set({ fromDate: fromDate }),
  setToDate: toDate => set({ toDate: toDate }),
  setSearchText: searchText => set({ search_text: searchText }),
  setCompanyIdIn: companyIds => set({ companyId__in: companyIds }),
  setIdIn: names => set({ id__in: names }),
  setDataResponse: (value: MajorProjectJobResponse) =>
    set(state => {
      const isAppending = value.meta.page > 1;

      let newItems: IMajorProjectJob[];

      if (isAppending) {
        const mergedMap = new Map<string, IMajorProjectJob>();

        for (const item of state.dataResponse.items) {
          mergedMap.set(item.id, item);
        }

        for (const item of value.items) {
          mergedMap.set(item.id, item);
        }

        newItems = Array.from(mergedMap.values());
      } else {
        newItems = value.items;
      }

      return {
        dataResponse: {
          items: newItems,
          meta: value.meta
        }
      };
    }),
  setFilters: filters => set({ filters: filters }),
  setTempFilters: filters => set({ tempFilters: filters }),

  setAllSearchParams: params =>
    set(() => {
      const newState: Partial<MajorProjectStore> = {};
      if (params.order_by !== undefined) newState.order_by = params.order_by;
      if (params.pageSize !== undefined) newState.pageSize = params.pageSize;
      if (params.page !== undefined) newState.page = params.page;
      if (params.fromDate !== undefined) newState.fromDate = params.fromDate;
      if (params.toDate !== undefined) newState.toDate = params.toDate;
      if (params.search_text !== undefined) newState.search_text = params.search_text;
      if (params.companyId__in !== undefined) newState.companyId__in = params.companyId__in;
      if (params.id__in !== undefined) newState.id__in = params.id__in;
      return newState;
    }),

  getSearchParams: () => {
    const state = get();
    return {
      order_by: state.order_by,
      pageSize: state.pageSize,
      page: state.page,
      fromDate: state.fromDate,
      toDate: state.toDate,
      search_text: state.search_text,
      companyId__in:
        state.companyId__in.length > 0 && state.companyId__in.length < state.filters.companies.length && state.filters.companies.length != 0
          ? state.companyId__in
          : undefined,
      id__in:
        state.id__in.length > 0 && state.id__in.length < state.filters.projectNames.length && state.filters.projectNames.length != 0
          ? state.id__in
          : undefined
    };
  },

  resetSearchParams: () => set(defaultSearchParams)
}));
