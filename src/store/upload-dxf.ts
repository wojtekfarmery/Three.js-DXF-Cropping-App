import DxfParser from "dxf-parser";
import { toast } from "sonner";
import { buildModelFromDxf } from "@/pages/home/three-canvas/build-model-from-dxf";
import type { DxfModel, Roi, ModelData } from "@/types/model";

export const uploadDXF = async (
  file: File,
  set: (partial: {
    dxf?: DxfModel | null;
    roi?: Roi | null;
    modelData?: ModelData;
    meta?: { entities: number } | null;
  }) => void
) => {
  try {
    if (file.size === 0) {
      toast.error("The selected file is empty.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".dxf")) {
      toast.error("Please upload a valid DXF file.");
      return;
    }

    const text = await file.text();

    const parser = new DxfParser();
    const dxf = parser.parseSync(text);

    if (!dxf) {
      throw new Error("Error parsing DXF file.");
    }

    const { bounds, roi, modelSize, center, meshGroup, meshes } =
      buildModelFromDxf(dxf);

    set({
      dxf,
      roi,
      modelData: { bounds, modelSize, center, meshes, meshGroup },
      meta: { entities: dxf.entities.length ?? 0 },
    });

    toast.success("DXF loaded successfully!");
  } catch (err) {
    console.error("DXF upload error:", err);
    set({
      modelData: {
        bounds: null,
        modelSize: null,
        center: null,
        meshes: [],
        meshGroup: null,
      },
    });
    toast.error("Failed to upload DXF", {
      description:
        err instanceof Error ? err.message : "An unexpected error occurred.",
    });
  }
};
