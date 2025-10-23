import { useEffect } from "react";
import * as THREE from "three";

type ModelCropProps = {
  modelMeshes: THREE.Mesh[];
  isCropped: boolean;
  roi: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
};

export const useModelCrop = ({
  modelMeshes,
  isCropped,
  roi,
}: ModelCropProps) => {
  useEffect(() => {
    if (!modelMeshes.length) return;

    if (!isCropped) {
      modelMeshes.forEach((mesh) => {
        if (!Array.isArray(mesh.material)) {
          mesh.material.clippingPlanes = null;
          mesh.material.needsUpdate = true;
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

    modelMeshes.forEach((mesh) => {
      if (!Array.isArray(mesh.material)) {
        mesh.material.clippingPlanes = planes;
        mesh.material.clipShadows = true;
        mesh.material.needsUpdate = true;
      }
    });
  }, [roi, isCropped, modelMeshes]);
};
