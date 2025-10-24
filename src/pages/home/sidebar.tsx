import { useStore } from "@/store/use-store";
import { Input } from "@/components/ui/input";

export const Sidebar = () => {
  const { roi, setRoi, meta, modelData } = useStore();
  const bounds = modelData.bounds;

  const setField = (key: keyof NonNullable<typeof roi>, value: number) => {
    if (!roi) return;
    setRoi({ ...roi, [key]: value });
  };

  const formatValue = (v?: number) =>
    typeof v === "number" ? v.toFixed(2) : "";

  const formatVector = (v: [number, number, number]) =>
    v.map((n) => n.toFixed(2)).join(", ");

  const dimensions = bounds && {
    width: (bounds.max.x - bounds.min.x).toFixed(2),
    height: (bounds.max.y - bounds.min.y).toFixed(2),
    depth: (bounds.max.z - bounds.min.z).toFixed(2),
  };

  return (
    <aside className="w-72 shrink-0 border-l p-3 space-y-4 bg-card/40">
      <div>
        <div className="font-medium mb-2">ROI</div>
        {roi ? (
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={formatValue(roi.minX)}
              onChange={(e) => setField("minX", +e.target.value)}
              placeholder="minX"
            />
            <Input
              type="number"
              value={formatValue(roi.maxX)}
              onChange={(e) => setField("maxX", +e.target.value)}
              placeholder="maxX"
            />
            <Input
              type="number"
              value={formatValue(roi.minY)}
              onChange={(e) => setField("minY", +e.target.value)}
              placeholder="minY"
            />
            <Input
              type="number"
              value={formatValue(roi.maxY)}
              onChange={(e) => setField("maxY", +e.target.value)}
              placeholder="maxY"
            />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Load a DXF file to adjust ROI.
          </p>
        )}
      </div>

      {meta && bounds && (
        <div className="p-3 border rounded-md bg-background space-y-1">
          <h3 className="font-semibold mb-2">Model Info</h3>
          <p className="text-sm">Entities: {meta.entities}</p>

          <div className="mt-2 text-sm">
            <div className="font-medium">Bounds:</div>
            <p className="text-muted-foreground">
              Min:{" "}
              <span className="font-mono">
                {formatVector([bounds.min.x, bounds.min.y, bounds.min.z])}
              </span>
            </p>
            <p className="text-muted-foreground">
              Max:{" "}
              <span className="font-mono">
                {formatVector([bounds.max.x, bounds.max.y, bounds.max.z])}
              </span>
            </p>
          </div>

          {dimensions && (
            <div className="mt-2 text-sm">
              <div className="font-medium">Dimensions:</div>
              <p className="font-mono">
                W: {dimensions.width}, H: {dimensions.height}, D:{" "}
                {dimensions.depth}
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
