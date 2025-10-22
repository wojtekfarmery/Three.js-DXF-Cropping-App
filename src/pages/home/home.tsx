import DxfParser from "dxf-parser";
import { ThreeCanvas } from "./three-canvas/three-canvas";
import { Toolbar } from "./toolbar";
import { useStore } from "@/store/use-store";

export function Home() {
  const { setDxf } = useStore();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parser = new DxfParser();
    try {
      const parsed = parser.parseSync(text);
      setDxf(parsed);
    } catch (err) {
      console.error("DXF parse failed:", err);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Toolbar />
      <input
        type="file"
        accept=".dxf"
        onChange={handleUpload}
        style={{ margin: "8px" }}
      />
      <div style={{ flex: 1, border: "1px solid #ccc" }}>
        <ThreeCanvas />
      </div>
    </div>
  );
}
