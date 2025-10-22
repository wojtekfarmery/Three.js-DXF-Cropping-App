import { useEffect, type FC } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { type IDxf } from "dxf-parser";
import { ThreeSixtyModel } from "./three-sixty-model";

type ThreeCanvasProps = {
  dxf: IDxf | null;
};

export const ThreeCanvas: FC<ThreeCanvasProps> = ({ dxf }) => {
  return (
    <Canvas>
      <FitCamera dxf={dxf} />
      <ThreeSixtyModel dxf={dxf} />
    </Canvas>
  );
};

const FitCamera = ({ dxf }: { dxf: IDxf | null }) => {
  const { camera, scene } = useThree();

  useEffect(() => {
    if (!dxf) return;

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
