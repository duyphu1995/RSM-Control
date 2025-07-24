import { create } from "zustand";

export type SketchConfigUIItem = {
  name: string;
  displayName: string;
  order: number;
  selected: boolean;
};

interface SketchUIConfigState {
  config: SketchConfigUIItem[];
  setConfig: (config: SketchConfigUIItem[]) => void;
  updateSelection: (name: string, selected: boolean) => void;
  updateOrder: (orderedNames: string[]) => void;
}

export const useSketchUIConfigStore = create<SketchUIConfigState>(set => ({
  config: [],
  setConfig: config => set({ config }),
  updateSelection: (name, selected) =>
    set(state => ({
      config: state.config.map(item => (item.name === name ? { ...item, selected } : item))
    })),
  updateOrder: orderedNames =>
    set(state => ({
      config: orderedNames.map((name, index) => {
        const item = state.config.find(c => c.name === name)!;
        return { ...item, order: index };
      })
    }))
}));
