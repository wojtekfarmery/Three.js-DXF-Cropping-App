import { useStore } from "@/store/use-store";
import { Input } from "@/components/ui/input";

export const Sidebar = () => {
  const { roi, setRoi, meta } = useStore();

  const setField = (k: keyof typeof roi, v: number) =>
    setRoi({ ...roi, [k]: v });

  const formatValue = (v: number) => v.toFixed(2);

  return (
    <aside className="w-72 shrink-0 border-l p-3 space-y-4 bg-card/40">
      <div>
        <div className="font-medium mb-2">ROI</div>
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
      </div>

      {meta && (
        <div className="p-3 border-l w-64 bg-background">
          <h3 className="font-semibold mb-2">Model Info</h3>
          <p className="text-sm">Entities: {meta.entities}</p>
          <p className="text-sm">
            Min: {meta.bounds.min.map((v) => v.toFixed(2)).join(", ")}
          </p>
          <p className="text-sm">
            Max: {meta.bounds.max.map((v) => v.toFixed(2)).join(", ")}
          </p>
        </div>
      )}
    </aside>
  );
};
