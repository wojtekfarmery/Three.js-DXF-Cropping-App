import { useStore } from "@/store/use-store";
import { Input } from "@/components/ui/input";

export const Sidebar = () => {
  const { roi, setRoi } = useStore();

  const setField = (k: keyof typeof roi, v: number) =>
    setRoi({ ...roi, [k]: v });

  return (
    <aside className="w-72 shrink-0 border-l p-3 space-y-4 bg-card/40">
      <div>
        <div className="font-medium mb-2">ROI</div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={roi.minX}
            onChange={(e) => setField("minX", +e.target.value)}
            placeholder="minX"
          />
          <Input
            type="number"
            value={roi.maxX}
            onChange={(e) => setField("maxX", +e.target.value)}
            placeholder="maxX"
          />
          <Input
            type="number"
            value={roi.minY}
            onChange={(e) => setField("minY", +e.target.value)}
            placeholder="minY"
          />
          <Input
            type="number"
            value={roi.maxY}
            onChange={(e) => setField("maxY", +e.target.value)}
            placeholder="maxY"
          />
        </div>
      </div>
    </aside>
  );
};
