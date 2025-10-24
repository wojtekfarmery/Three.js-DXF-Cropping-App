import { useEffect } from "react";
import * as THREE from "three";

type ModelCropProps = {
  meshes: THREE.Mesh[];
  isCropped: boolean;
  roi: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null;
};

export const useModelCrop = ({ meshes, isCropped, roi }: ModelCropProps) => {
  useEffect(() => {
    if (!meshes.length || !roi) {
      return;
    }

    if (!isCropped) {
      meshes.forEach((mesh) => {
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

    meshes.forEach((mesh) => {
      if (!Array.isArray(mesh.material)) {
        mesh.material.clippingPlanes = planes;
        mesh.material.clipShadows = true;
        mesh.material.needsUpdate = true;
      }
    });
  }, [roi, isCropped, meshes]);
};
