import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useState, type FC } from "react";
import * as THREE from "three";

type ControlHandle = "roi" | "minXminY" | "maxXminY" | "minXmaxY" | "maxXmaxY";

type RoiOverlayProps = {
  modelSize: THREE.Vector3 | null;
  visible: boolean;
  roi: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null;
  setRoi: (roi: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }) => void;
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
    if (!roi) return;
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

  if (!shouldShowROI) {
    return null;
  }
  console.log(scene.getObjectByName(activeHandle));

  return (
    <>
      <TransformControls
        mode="translate"
        object={scene.getObjectByName(activeHandle)}
        showZ={false}
        onObjectChange={(event) => {
          const controls = event?.target as THREE.Event & {
            object: THREE.Object3D;
          };

          const obj = controls.object;

          if (obj instanceof THREE.Mesh) {
            if (activeHandle === "roi") {
              handleRoiMove(obj.position);
              return;
            }
            handleCornerMove(activeHandle, obj.position);
          }
        }}
      />

      <mesh position={center} name="roi" onClick={() => handleSetHandle("roi")}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="orange" transparent opacity={0.3} />
      </mesh>

      {(["minXminY", "maxXminY", "minXmaxY", "maxXmaxY"] as const).map(
        (corner) => {
          const x = corner.includes("minX") ? roi?.minX : roi?.maxX;
          const y = corner.includes("minY") ? roi?.minY : roi?.maxY;
          return (
            <mesh
              name={corner}
              key={corner}
              position={[x ?? 0, y ?? 0, 0]}
              onClick={() => handleSetHandle(corner)}
            >
              <sphereGeometry args={[width * 0.02, 16, 16]} />
              <meshBasicMaterial
                color={corner === activeHandle ? "red" : "yellow"}
              />
            </mesh>
          );
        }
      )}
    </>
  );
};
