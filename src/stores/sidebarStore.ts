import { create } from "zustand";

export enum MenuItem {
  siteSketches = "SiteSketches",
  majorlProject = "MajorProject"
}

interface SidebarStore {
  selectedItem: MenuItem;
  setSelectedItem: (item: MenuItem) => void;
}

export const useSidebarStore = create<SidebarStore>(set => ({
  selectedItem: MenuItem.siteSketches,
  setSelectedItem: value => set({ selectedItem: value })
}));
