import { Switch } from "@/components/ui/switch";
import { useStore } from "@/store/use-store";
import { DxfUpload } from "./dxf-upload";

export function Toolbar() {
  const { isCropped, toggleCropped } = useStore();

  return (
    <div className="w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-6xl flex items-center gap-3 p-2">
        <DxfUpload />

        <div className="flex items-center gap-2 px-2">
          <Switch
            checked={isCropped}
            onCheckedChange={toggleCropped}
            id="crop"
          />
          <label htmlFor="crop" className="text-sm">
            Cropped view
          </label>
        </div>
      </div>
    </div>
  );
}
