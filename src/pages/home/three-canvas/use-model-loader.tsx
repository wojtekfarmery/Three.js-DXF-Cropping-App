import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Camera } from "@react-three/fiber";

type UseModelLoaderProps = {
  modelData: {
    meshGroup: THREE.Group | null;
    size: THREE.Vector3 | null;
    center: THREE.Vector3 | null;
  };
  camera: Camera;
};

export const useModelLoader = ({ modelData, camera }: UseModelLoaderProps) => {
  const groupRef = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    const { meshGroup, size, center } = modelData;
    const group = groupRef.current;

    group.clear();

    if (!meshGroup || !size || !center) return;

    group.add(meshGroup);

    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.5;

    camera.near = Math.max(maxDim / 1000, 0.1);
    camera.far = maxDim * 10;
    camera.updateProjectionMatrix();

    camera.position.set(center.x, center.y, distance);
    camera.lookAt(center);
  }, [modelData, camera]);

  return { groupRef };
};
