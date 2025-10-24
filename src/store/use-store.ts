import { create } from "zustand";
import { type IDxf } from "dxf-parser";
import DxfParser from "dxf-parser";
import * as THREE from "three";
import { buildModelFromDxf } from "@/pages/home/three-canvas/build-model-from-dxf";

type Roi = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

type ModelData = {
  bounds: THREE.Box3 | null;
  size: THREE.Vector3 | null;
  center: THREE.Vector3 | null;
  meshes: THREE.Mesh[];
  meshGroup: THREE.Group | null;
};

type Store = {
  dxf: IDxf | null;
  setDxf: (dxf: IDxf | null) => void;

  roi: Roi | null;
  setRoi: (roi: Roi | null) => void;

  isCropped: boolean;
  toggleCropped: () => void;
  setCropped: (value: boolean) => void;
  error: null | string;
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
    size: null,
    center: null,
    meshes: [],
    meshGroup: null,
  },

  error: null,
  meta: null,
  uploadDXF: async (file) => {
    try {
      const text = await file.text();
      const parser = new DxfParser();
      const dxf = parser.parseSync(text);
      const { bounds, roi, size, center, meshGroup, meshes } =
        buildModelFromDxf(dxf);

      if (!bounds) throw new Error("Failed to compute model bounds");

      set({
        dxf,
        roi,
        modelData: {
          bounds,
          size,
          center,
          meshes,
          meshGroup,
        },
        meta: {
          entities: dxf?.entities.length ?? 0,
        },
      });
    } catch (err) {
      console.error("DXF upload error:", err);
      set({
        modelData: {
          bounds: null,
          size: null,
          center: null,
          meshes: [],
          meshGroup: null,
        },
        error: "Failed to upload DXF",
      });
    }
  },
}));
