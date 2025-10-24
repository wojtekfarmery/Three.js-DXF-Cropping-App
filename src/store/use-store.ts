import { create } from "zustand";
import { uploadDXF } from "./upload-dxf";
import type { Store } from "@/types/store";

export const useStore = create<Store>((set) => ({
  dxf: null,
  setDxf: (dxf) => set({ dxf }),
  roi: null,
  setRoi: (roi) => set({ roi }),

  isCropped: false,
  toggleCropped: () => set((state) => ({ isCropped: !state.isCropped })),
  setCropped: (value) => set({ isCropped: value }),

  modelData: {
    bounds: null,
    size: null,
    center: null,
    meshes: [],
    meshGroup: null,
  },

  meta: null,
  uploadDXF: (file) => uploadDXF(file, set),
}));
