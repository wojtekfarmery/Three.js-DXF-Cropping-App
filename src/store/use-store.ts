import { create } from "zustand";
import { type IDxf } from "dxf-parser";

type Roi = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

type Store = {
  dxf: IDxf | null;
  setDxf: (dxf: IDxf | null) => void;

  roi: Roi;
  setRoi: (roi: Partial<Roi>) => void;

  isCropped: boolean;
  toggleCropped: () => void;
  setCropped: (value: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  dxf: null,
  setDxf: (dxf) => set({ dxf }),

  roi: { minX: -50, minY: -50, maxX: 50, maxY: 50 },
  setRoi: (roi) => set((state) => ({ roi: { ...state.roi, ...roi } })),

  isCropped: false,
  toggleCropped: () => set((state) => ({ isCropped: !state.isCropped })),
  setCropped: (value) => set({ isCropped: value }),
}));
