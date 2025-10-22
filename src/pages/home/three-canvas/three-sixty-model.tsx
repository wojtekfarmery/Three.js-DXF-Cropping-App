import { useEffect, useRef, type FC } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { type IDxf, type IPolylineEntity } from "dxf-parser";
import { buildMeshFromPolyface } from "./build-mesh-from-polyface";

type ThreeSixtyModelProps = {
  dxf: IDxf | null;
};

export const ThreeSixtyModel: FC<ThreeSixtyModelProps> = ({ dxf }) => {
  const groupRef = useRef(new THREE.Group());

  useEffect(() => {
    if (!dxf || !groupRef.current) return;

    const group = groupRef.current;
    group.clear();

    const meshGroup = new THREE.Group();

    for (const entity of dxf.entities) {
      switch (entity.type) {
        case "POLYLINE": {
          const e = entity as IPolylineEntity;

          const mesh = buildMeshFromPolyface(e);
          if (mesh) {
            meshGroup.add(mesh);
          }
          break;
        }
      }
    }

    group.add(meshGroup);

    console.log(meshGroup.children.length);
  }, [dxf]);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <axesHelper args={[500]} />
      <OrbitControls enableZoom enablePan />
      <primitive object={groupRef.current} />
    </>
  );
};
