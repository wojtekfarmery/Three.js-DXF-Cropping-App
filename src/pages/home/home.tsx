import { Sidebar } from "./sidebar";
import { ThreeCanvas } from "./three-canvas/three-canvas";
import { Toolbar } from "./toolbar";

export function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Toolbar />
      <div className="flex-1 flex">
        <div className="flex-1">
          <ThreeCanvas />
        </div>
        <Sidebar />
      </div>
    </div>
  );
}
