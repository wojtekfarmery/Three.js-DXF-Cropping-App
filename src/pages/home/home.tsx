import { useState } from "react";
import DxfParser, { type IDxf } from "dxf-parser";
import { ThreeCanvas } from "./three-canvas";

export function Home() {
  const [dxf, setDxf] = useState<IDxf | null>(null);

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
      <input
        type="file"
        accept=".dxf"
        onChange={handleUpload}
        style={{ margin: "8px" }}
      />
      <div style={{ flex: 1, border: "1px solid #ccc" }}>
        <ThreeCanvas dxf={dxf} />
      </div>
    </div>
  );
}
