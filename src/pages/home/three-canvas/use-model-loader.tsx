import type { IDxf, IPolylineEntity } from "dxf-parser";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { buildMeshFromPolyface } from "./build-mesh-from-polyface";
import type { Camera } from "@react-three/fiber";

type UseModelLoaderProps = {
  dxf: IDxf | null;

  setRoi: (roi: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }) => void;
  camera: Camera;
};

export const useModelLoader = ({
  dxf,

  setRoi,
  camera,
}: UseModelLoaderProps) => {
  const groupRef = useRef(new THREE.Group());
  const roiMeshRef = useRef<THREE.Mesh>(null);
  const [modelMeshes, setModelMeshes] = useState<THREE.Mesh[]>([]);
  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (!dxf || !groupRef.current) return;

    const group = groupRef.current;
    group.clear();

    const meshGroup = new THREE.Group();
    const meshes: THREE.Mesh[] = [];

    for (const entity of dxf.entities) {
      if (entity.type === "POLYLINE") {
        const mesh = buildMeshFromPolyface(entity as IPolylineEntity);
        if (mesh) {
          meshes.push(mesh);
          meshGroup.add(mesh);
        }
      }
    }

    setModelMeshes(meshes);
    group.add(meshGroup);

    const box = new THREE.Box3().setFromObject(meshGroup);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    setModelSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    camera.near = maxDim / 1000;
    camera.far = maxDim * 10;
    camera.updateProjectionMatrix();

    const distance = maxDim * 1.5;
    camera.position.set(center.x, center.y, distance);
    camera.lookAt(center);

    const margin = 0.3;
    setRoi({
      minX: box.min.x + size.x * margin,
      minY: box.min.y + size.y * margin,
      maxX: box.max.x - size.x * margin,
      maxY: box.max.y - size.y * margin,
    });

    if (roiMeshRef.current) {
      roiMeshRef.current.position.set(center.x, center.y, 0);
      roiMeshRef.current.scale.set(size.x * 0.3, size.y * 0.3, 1);
    }
  }, [dxf, camera, setRoi]);

  return { modelMeshes, modelSize, groupRef, roiMeshRef };
};
