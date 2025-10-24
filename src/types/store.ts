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
