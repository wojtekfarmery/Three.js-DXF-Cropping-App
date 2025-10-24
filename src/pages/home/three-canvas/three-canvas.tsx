import { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ThreeSixtyModel } from "./three-sixty-model";
import { useStore } from "@/store/use-store";

export const ThreeCanvas = () => {
  return (
    <Canvas gl={{ localClippingEnabled: true }}>
      <FitCamera />
      <ThreeSixtyModel />
    </Canvas>
  );
};

const FitCamera = () => {
  const { dxf } = useStore();
  const { camera, scene } = useThree();

  useEffect(() => {
    if (!dxf) {
      return;
    }

    const box = new THREE.Box3().setFromObject(scene);
    if (!box.isEmpty()) {
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = THREE.MathUtils.degToRad(
        (camera as THREE.PerspectiveCamera).fov
      );
      let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
      cameraZ *= 2.5;

      camera.position.set(center.x, center.y, center.z + cameraZ);
      camera.lookAt(center);
      camera.near = cameraZ / 100;
      camera.far = cameraZ * 100;
      camera.updateProjectionMatrix();
    }
  }, [dxf, camera, scene]);

  return null;
};
