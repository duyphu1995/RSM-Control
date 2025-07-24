import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FilterOptions {
  id: string;
  displayName: string;
  companyId?: string;
}

interface DropdownFilterState {
  filters: Record<string, FilterOptions[]>;
  selected: Record<string, FilterOptions[]>;
  allProjectNames: FilterOptions[];
  setOptions: (key: string, options: FilterOptions[]) => void;
  setSelected: (key: string, selected: FilterOptions[]) => void;
  setAllProjectNames: (options: FilterOptions[]) => void;
  clearFilter: () => void;
}

export const useFilterStore = create<DropdownFilterState>()(
  persist(
    set => ({
      filters: {},
      selected: {},
      allProjectNames: [],
      setOptions: (key, options) => {
        set(state => ({
          filters: { ...state.filters, [key]: options },
          selected: {
            ...state.selected,
            // If already selected, keep it. Otherwise, select all.
            [key]: state.selected[key]?.length ? state.selected[key] : options
          }
        }));
      },
      setSelected: (key, selected) =>
        set(state => ({
          selected: { ...state.selected, [key]: selected }
        })),
      setAllProjectNames: options => set({ allProjectNames: options }),
      clearFilter: () =>
        set({
          selected: {
            companies: [],
            projectNames: [],
            orderBy: [],
            jobCodes: [],
            statuses: [],
            states: []
          }
        })
    }),
    {
      name: "filter-store-sketch",
      partialize: state => ({
        selected: state.selected,
        filters: state.filters
      })
    }
  )
);
