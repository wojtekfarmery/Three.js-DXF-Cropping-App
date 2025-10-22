import { useEffect, useRef, useState, type FC } from "react";
import * as THREE from "three";
import { OrbitControls, TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { type IDxf, type IPolylineEntity } from "dxf-parser";
import { buildMeshFromPolyface } from "./build-mesh-from-polyface";

type ThreeSixtyModelProps = {
  dxf: IDxf | null;
};

type ControlHandle = "roi" | "minXminY" | "maxXminY" | "minXmaxY" | "maxXmaxY";

export const ThreeSixtyModel: FC<ThreeSixtyModelProps> = ({ dxf }) => {
  const groupRef = useRef(new THREE.Group());
  const roiMeshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const scene = useThree((state) => state.scene);

  const [activeHandle, setActiveHandle] = useState<ControlHandle>("roi");

  const [roi, setRoi] = useState({
    minX: -50,
    minY: -50,
    maxX: 50,
    maxY: 50,
  });

  const width = roi.maxX - roi.minX;
  const height = roi.maxY - roi.minY;
  const center: [number, number, number] = [
    (roi.maxX + roi.minX) / 2,
    (roi.maxY + roi.minY) / 2,
    0,
  ];

  const handleSetHandle = (handle: ControlHandle) => {
    setActiveHandle(handle);
  };

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
    setRoi((prev) => ({
      ...prev,
      ...(corner.includes("minX") ? { minX: pos.x } : { maxX: pos.x }),
      ...(corner.includes("minY") ? { minY: pos.y } : { maxY: pos.y }),
    }));
  };

  useEffect(() => {
    if (!dxf || !groupRef.current) return;

    const group = groupRef.current;
    group.clear();

    const meshGroup = new THREE.Group();
    for (const entity of dxf.entities) {
      if (entity.type === "POLYLINE") {
        const mesh = buildMeshFromPolyface(entity as IPolylineEntity);
        if (mesh) meshGroup.add(mesh);
      }
    }

    group.add(meshGroup);

    const box = new THREE.Box3().setFromObject(meshGroup);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);

    camera.near = maxDim / 1000;
    camera.far = maxDim * 10;
    camera.updateProjectionMatrix();

    const distance = maxDim * 1.5;
    camera.position.set(center.x, center.y, distance);
    camera.lookAt(center);

    meshGroup.position.sub(center);

    if (roiMeshRef.current) {
      roiMeshRef.current.position.set(0, 0, 0);
      roiMeshRef.current.scale.set(size.x * 0.3, size.y * 0.3, 1);
    }
  }, [dxf, camera]);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <axesHelper args={[500]} />

      <TransformControls
        mode="translate"
        {...(activeHandle && { object: scene.getObjectByName(activeHandle) })}
        showZ={false}
        onObjectChange={(e) => {
          const obj = e.target.object as THREE.Mesh;
          if (activeHandle === "roi") handleRoiMove(obj.position);
          else if (activeHandle) handleCornerMove(activeHandle, obj.position);
        }}
      />

      <OrbitControls enableZoom enablePan makeDefault />

      <mesh
        ref={roiMeshRef}
        position={center}
        name="roi"
        onClick={() => handleSetHandle("roi")}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial color="orange" />
      </mesh>

      <primitive object={groupRef.current} />

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
              <meshBasicMaterial color="yellow" />
            </mesh>
          );
        }
      )}
    </>
  );
};
