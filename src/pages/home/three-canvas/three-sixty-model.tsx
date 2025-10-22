import { useEffect, useRef, type FC } from "react";
import * as THREE from "three";
import { OrbitControls, TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { type IDxf, type IPolylineEntity } from "dxf-parser";
import { buildMeshFromPolyface } from "./build-mesh-from-polyface";

type ThreeSixtyModelProps = {
  dxf: IDxf | null;
};

export const ThreeSixtyModel: FC<ThreeSixtyModelProps> = ({ dxf }) => {
  const groupRef = useRef(new THREE.Group());
  const roiMeshRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<any>(null);
  const orbitRef = useRef<any>(null);
  const { camera } = useThree();

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

    if (transformRef.current && roiMeshRef.current) {
      transformRef.current.attach(roiMeshRef.current);
    }

    return () => transformRef.current?.detach();
  }, [dxf, camera]);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <axesHelper args={[500]} />

      <OrbitControls ref={orbitRef} enableZoom enablePan makeDefault />
      <TransformControls
        ref={transformRef}
        mode="translate"
        showZ={false}
        onMouseDown={() => (orbitRef.current.enabled = false)}
        onMouseUp={() => (orbitRef.current.enabled = true)}
      />

      <primitive object={groupRef.current} />

      <mesh ref={roiMeshRef}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="orange" />
      </mesh>
    </>
  );
};
