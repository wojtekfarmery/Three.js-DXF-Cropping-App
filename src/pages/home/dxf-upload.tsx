import { Button } from "@/components/ui/button";
import { useStore } from "@/store/use-store";
import { useRef } from "react";

export const DxfUpload = () => {
  const { uploadDXF } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed");
    const file = e.target.files?.[0];
    if (file) {
      await uploadDXF(file);
      e.target.value = "";
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".dxf"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
        Open DXF
      </Button>
    </div>
  );
};
