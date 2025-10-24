import * as THREE from "three";
import type { IDxf, IPolylineEntity } from "dxf-parser";
import { buildMeshFromPolyface } from "@/pages/home/three-canvas/build-mesh-from-polyface";

export const buildModelFromDxf = (dxf: IDxf | null) => {
  if (!dxf) {
    return {
      meshGroup: null,
      bounds: null,
      size: null,
      center: null,
      meshes: [],
      roi: null,
    };
  }

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

  // compute bounds in world space
  const bounds = new THREE.Box3().setFromObject(meshGroup);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bounds.getSize(size);
  bounds.getCenter(center);

  // center the model at origin
  meshGroup.position.sub(center);

  // recompute bounds after centering
  const normalizedBounds = new THREE.Box3().setFromObject(meshGroup);
  const normalizedSize = new THREE.Vector3();
  normalizedBounds.getSize(normalizedSize);

  // ROI 30% margin
  const margin = 0.3;
  const roi = {
    minX: normalizedBounds.min.x + normalizedSize.x * margin,
    minY: normalizedBounds.min.y + normalizedSize.y * margin,
    maxX: normalizedBounds.max.x - normalizedSize.x * margin,
    maxY: normalizedBounds.max.y - normalizedSize.y * margin,
  };

  return {
    meshGroup,
    bounds: normalizedBounds,
    size: normalizedSize,
    center: new THREE.Vector3(0, 0, 0),
    meshes,
    roi,
  };
};
