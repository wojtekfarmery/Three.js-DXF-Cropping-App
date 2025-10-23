import { create } from "zustand";
import { type IDxf } from "dxf-parser";
import DxfParser from "dxf-parser";
import { computeBounds } from "@/pages/home/three-canvas/compute-bounds";

type Roi = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type Bounds = {
  min: [number, number, number];
  max: [number, number, number];
};

export type Meta = {
  entities: number;
  bounds: Bounds;
};

type Store = {
  dxf: IDxf | null;
  setDxf: (dxf: IDxf | null) => void;

  roi: Roi;
  setRoi: (roi: Partial<Roi>) => void;

  isCropped: boolean;
  toggleCropped: () => void;
  setCropped: (value: boolean) => void;
  error: null | string;

  uploadDXF: (file: File) => Promise<void>;
  meta: Meta | null;
};

export const useStore = create<Store>((set) => ({
  dxf: null,
  setDxf: (dxf) => set({ dxf }),

  roi: { minX: -50, minY: -50, maxX: 50, maxY: 50 },
  setRoi: (roi) => set((state) => ({ roi: { ...state.roi, ...roi } })),

  isCropped: false,
  toggleCropped: () => set((state) => ({ isCropped: !state.isCropped })),
  setCropped: (value) => set({ isCropped: value }),

  error: null,
  meta: null,
  uploadDXF: async (file) => {
    try {
      const text = await file.text();
      const parser = new DxfParser();
      const dxf = parser.parseSync(text);
      const box = computeBounds(dxf?.entities);

      if (!box || !dxf) {
        set({ error: "Failed to compute DXF bounds" });
        return;
      }

      const meta: Meta = {
        entities: dxf.entities.length ?? 0,
        bounds: {
          min: [box.min.x, box.min.y, box.min.z ?? 0],
          max: [box.max.x, box.max.y, box.max.z ?? 0],
        },
      };

      set({ dxf, meta, error: null });
    } catch {
      set({ error: "Failed to upload DXF file" });
    }
  },
  bounds: null,
}));
