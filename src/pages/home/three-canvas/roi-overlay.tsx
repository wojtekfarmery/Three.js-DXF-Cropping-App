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
  };
  setRoi: (roi: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }) => void;
  meshRef: React.RefObject<THREE.Mesh | null>;
};

export const RoiOverlay: FC<RoiOverlayProps> = ({
  modelSize,
  visible,
  roi,
  setRoi,
  meshRef,
}) => {
  const { scene } = useThree();

  const [activeHandle, setActiveHandle] = useState<ControlHandle>("roi");

  const handleSetHandle = (handle: ControlHandle) => setActiveHandle(handle);

  const width = roi.maxX - roi.minX;
  const height = roi.maxY - roi.minY;
  const center: [number, number, number] = [
    (roi.maxX + roi.minX) / 2,
    (roi.maxY + roi.minY) / 2,
    0,
  ];

  const handleRoiMove = (pos: THREE.Vector3) => {
    const dx = (roi.maxX - roi.minX) / 2;
    const dy = (roi.maxY - roi.minY) / 2;
    setRoi({
      minX: pos.x - dx,
      maxX: pos.x + dx,
      minY: pos.y - dy,
      maxY: pos.y + dy,
    });
  };

  const handleCornerMove = (corner: string, pos: THREE.Vector3) => {
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
  return (
    <>
      <TransformControls
        mode="translate"
        {...(activeHandle && {
          object: scene.getObjectByName(activeHandle),
        })}
        showZ={false}
        onObjectChange={(e) => {
          const obj = e.target.object as THREE.Mesh;

          if (activeHandle === "roi") {
            handleRoiMove(obj.position);
            return;
          }
          handleCornerMove(activeHandle, obj.position);
        }}
      />

      <mesh
        ref={meshRef}
        position={center}
        name="roi"
        onClick={() => handleSetHandle("roi")}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="orange" transparent opacity={0.3} />
      </mesh>

      {(["minXminY", "maxXminY", "minXmaxY", "maxXmaxY"] as const).map(
        (corner) => {
          const x = corner.includes("minX") ? roi.minX : roi.maxX;
          const y = corner.includes("minY") ? roi.minY : roi.maxY;
          return (
            <mesh
              name={corner}
              key={corner}
              position={[x, y, 0]}
              onClick={() => handleSetHandle(corner)}
            >
              <sphereGeometry args={[2, 16, 16]} />
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
