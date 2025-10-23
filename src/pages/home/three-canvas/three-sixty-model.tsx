import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { useStore } from "@/store/use-store";
import { RoiOverlay } from "./roi-overlay";
import { useModelLoader } from "./use-model-loader";
import { useModelCrop } from "./use-model-crop";

export const ThreeSixtyModel = () => {
  const { dxf, isCropped, roi, setRoi } = useStore();

  const { camera } = useThree();

  const { modelMeshes, modelSize, groupRef, roiMeshRef } = useModelLoader({
    dxf,
    camera,
    setRoi,
  });
  useModelCrop({ modelMeshes, isCropped, roi });

  const roiOverlayVisible = Boolean(dxf);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <axesHelper args={[500]} />

      <OrbitControls enableZoom enablePan makeDefault />

      <primitive object={groupRef.current} />
      <RoiOverlay
        modelSize={modelSize}
        visible={roiOverlayVisible}
        roi={roi}
        setRoi={setRoi}
        meshRef={roiMeshRef}
      />
    </>
  );
};
