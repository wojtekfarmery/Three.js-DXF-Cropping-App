import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { type IPolylineEntity } from "dxf-parser";
import { buildMeshFromPolyface } from "./build-mesh-from-polyface";
import { useStore } from "@/store/use-store";
import { RoiOverlay } from "./roi-overlay";

export const ThreeSixtyModel = () => {
  const { dxf, isCropped, roi, setRoi } = useStore();

  const groupRef = useRef(new THREE.Group());
  const roiMeshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const [modelSize, setModelSize] = useState<THREE.Vector3 | null>(null);
  const [modelMeshes, setModelMeshes] = useState<THREE.Mesh[]>([]);

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

  useEffect(() => {
    if (!modelMeshes.length) return;

    if (!isCropped) {
      modelMeshes.forEach((material) => {
        if (!Array.isArray(material.material)) {
          material.material.clippingPlanes = [];
          material.material.needsUpdate = true;
        }
      });
      return;
    }

    const planes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), -roi.minX),
      new THREE.Plane(new THREE.Vector3(-1, 0, 0), roi.maxX),
      new THREE.Plane(new THREE.Vector3(0, 1, 0), -roi.minY),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), roi.maxY),
    ];

    modelMeshes.forEach((material) => {
      if (!Array.isArray(material.material)) {
        material.material.clippingPlanes = planes;
        material.material.clipShadows = true;
        material.material.needsUpdate = true;
      }
    });
  }, [roi, isCropped, modelMeshes]);

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <axesHelper args={[500]} />

      <OrbitControls enableZoom enablePan makeDefault />

      <primitive object={groupRef.current} />
      <RoiOverlay modelSize={modelSize} />
    </>
  );
};
