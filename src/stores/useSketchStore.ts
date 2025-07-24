import { create } from "zustand";

export type Job = {
  sketchJobId: string | null;
  sketchJobCode: string | null;
  sketchNumber: number;
  sketchProjectName: string | null;
  sketchJobAddress: string | null;
  sketchProjectId: string | null;
  companyId: string | null;
  poNumber: string | null;
  status: string | null;
  confirmDelivery: boolean;
  dueDate: string | null;
  orderDate: string | null;
  qcDate: string | null;
  completedDate: string | null;
  state: string | null;
  drawing: string | null;
  drawingLink: string | null;
  orderBy: string | null;
  companyName: string | null;
  id: string | null;
};

export type JobPageData = {
  count: number | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  page: number | null;
  pageSize: number | null;
  totalPages: number | null;
  totalRecords: number | null;
  type: string | null;
};

type SketchStore = {
  page: number;
  setPage: () => void;
  siteSketchList: Job[];
  siteSketchListPageData: JobPageData | undefined;
  setSiteSketchList: (list: Job[]) => void;
  appendSiteSketchList: (list: Job[]) => void;
  setSiteSketchListPageData: (pageData: JobPageData) => void;
  reset: () => void;
  isAnyFilterApply: boolean;
};

export const useSketchStore = create<SketchStore>(set => ({
  isAnyFilterApply: false,
  page: 1,
  setPage: () => set(state => ({ page: (state.page ?? 1) + 1 })),
  siteSketchList: [],
  siteSketchListPageData: undefined,
  setSiteSketchList: list => set({ siteSketchList: list }),
  appendSiteSketchList: list =>
    set(state => {
      if (state.page === 1) {
        // Fix first load call api twice and render list twice
        const existingIds = new Set(state.siteSketchList.map(job => job.id));
        const newUniqueItems = list.filter(job => !existingIds.has(job.id));
        return {
          siteSketchList: [...state.siteSketchList, ...newUniqueItems]
        };
      } else {
        // Render append as normal
        return {
          siteSketchList: [...state.siteSketchList, ...list]
        };
      }
    }),
  setSiteSketchListPageData: pageData => set({ siteSketchListPageData: pageData }),
  reset: () =>
    // Reset all data when apply filter
    set({
      page: 1,
      siteSketchList: [],
      siteSketchListPageData: undefined,
      isAnyFilterApply: true
    })
}));
