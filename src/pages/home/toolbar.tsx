import { Button } from "@/components/ui/button";
import { useStore } from "@/store/use-store";
import { Scissors } from "lucide-react";

export const Toolbar = () => {
  const { isCropped, toggleCropped, dxf } = useStore();

  return (
    <div className="w-full bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
      <Button
        variant={isCropped ? "secondary" : "default"}
        size="sm"
        disabled={!dxf}
        onClick={toggleCropped}
      >
        <Scissors className="w-4 h-4 mr-2" />
        {isCropped ? "Show Full" : "Crop View"}
      </Button>
    </div>
  );
};
