import type { Roi } from "@/types/model";
import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, type FC } from "react";
import * as THREE from "three";

type ControlHandle = "roi" | "minXminY" | "maxXminY" | "minXmaxY" | "maxXmaxY";

const HANDLES: ControlHandle[] = [
  "minXminY",
  "maxXminY",
  "minXmaxY",
  "maxXmaxY",
];

type RoiOverlayProps = {
  modelSize: THREE.Vector3 | null;
  visible: boolean;
  roi: Roi | null;
  setRoi: (roi: Roi) => void;
};

export const RoiOverlay: FC<RoiOverlayProps> = ({
  modelSize,
  visible,
  roi,
  setRoi,
}) => {
  const { scene } = useThree();

  const [activeHandle, setActiveHandle] = useState<ControlHandle>("roi");

  const handleSetHandle = (handle: ControlHandle) => setActiveHandle(handle);

  const width = roi ? roi.maxX - roi.minX : 0;
  const height = roi ? roi.maxY - roi.minY : 0;
  const center: [number, number, number] = [
    roi ? (roi.maxX + roi.minX) / 2 : 0,
    roi ? (roi.maxY + roi.minY) / 2 : 0,
    0,
  ];

  const handleRoiMove = (pos: THREE.Vector3) => {
    const dx = roi ? (roi.maxX - roi.minX) / 2 : 0;
    const dy = roi ? (roi.maxY - roi.minY) / 2 : 0;
    setRoi({
      minX: pos.x - dx,
      maxX: pos.x + dx,
      minY: pos.y - dy,
      maxY: pos.y + dy,
    });
  };

  const handleCornerMove = (corner: string, pos: THREE.Vector3) => {
    if (!roi) {
      return;
    }
    setRoi({
      ...roi,
      ...(corner.includes("minX") ? { minX: pos.x } : { maxX: pos.x }),
      ...(corner.includes("minY") ? { minY: pos.y } : { maxY: pos.y }),
    });
  };

  const shouldShowROI =
    visible &&
    modelSize &&
    width > modelSize.x * 0.01 &&
    height > modelSize.y * 0.01 &&
    width < modelSize.x * 10 &&
    height < modelSize.y * 10;

  const handleTransformChange = (event: THREE.Event | undefined) => {
    const controls = event?.target as THREE.Event & {
      object: THREE.Object3D;
    };

    const obj = controls.object;

    if (activeHandle === "roi") {
      handleRoiMove(obj.position);
      return;
    }
    handleCornerMove(activeHandle, obj.position);
  };

  if (!shouldShowROI) {
    return null;
  }

  return (
    <>
      <TransformControls
        mode="translate"
        {...(activeHandle && {
          object: scene.getObjectByName(activeHandle),
        })}
        showZ={false}
        onObjectChange={handleTransformChange}
      />

      <mesh position={center} name="roi" onClick={() => handleSetHandle("roi")}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="orange" transparent opacity={0.3} />
      </mesh>

      {HANDLES.map((corner) => {
        const x = corner.includes("minX") ? roi?.minX : roi?.maxX;
        const y = corner.includes("minY") ? roi?.minY : roi?.maxY;

        const handleRadius = modelSize
          ? Math.max(modelSize.x, modelSize.y) * 0.02
          : 1;

        return (
          <mesh
            name={corner}
            key={corner}
            position={[x ?? 0, y ?? 0, 0]}
            onClick={() => handleSetHandle(corner)}
          >
            <sphereGeometry args={[handleRadius, 16, 16]} />
            <meshBasicMaterial
              color={corner === activeHandle ? "red" : "yellow"}
            />
          </mesh>
        );
      })}
    </>
  );
};
