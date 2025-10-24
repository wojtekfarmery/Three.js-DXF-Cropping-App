import { create } from "zustand";
import { uploadDXF } from "./upload-dxf";
import type { IDxf } from "dxf-parser";
import type { DxfModel, ModelData, Roi } from "@/types/model";

export type Store = {
  dxf: DxfModel;
  setDxf: (dxf: IDxf | null) => void;

  roi: Roi | null;
  setRoi: (roi: Roi | null) => void;

  isCropped: boolean;
  toggleCropped: () => void;
  setCropped: (value: boolean) => void;

  uploadDXF: (file: File) => Promise<void>;

  modelData: ModelData;
  meta: {
    entities: number;
  } | null;
};

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
    modelSize: null,
    center: null,
    meshes: [],
    meshGroup: null,
  },

  meta: null,
  uploadDXF: (file) => uploadDXF(file, set),
}));
