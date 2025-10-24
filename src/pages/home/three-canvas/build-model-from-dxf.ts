import * as THREE from "three";
import type { IDxf, IPolylineEntity } from "dxf-parser";
import { buildMeshFromPolyface } from "@/pages/home/three-canvas/build-mesh-from-polyface";

export const buildModelFromDxf = (dxf: IDxf) => {
  if (!dxf) {
    throw new Error("No DXF data provided.");
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

  const { bounds, modelSize, center } = normalizeModel(meshGroup);

  const margin = 0.3;
  const roi = {
    minX: bounds.min.x + modelSize.x * margin,
    minY: bounds.min.y + modelSize.y * margin,
    maxX: bounds.max.x - modelSize.x * margin,
    maxY: bounds.max.y - modelSize.y * margin,
  };

  return {
    meshGroup,
    bounds,
    modelSize,
    center,
    meshes,
    roi,
  };
};

export const normalizeModel = (group: THREE.Group) => {
  const bounds = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bounds.getSize(size);
  bounds.getCenter(center);

  group.position.sub(center);

  const normalizedBounds = new THREE.Box3().setFromObject(group);
  const normalizedSize = new THREE.Vector3();
  normalizedBounds.getSize(normalizedSize);

  return {
    bounds: normalizedBounds,
    modelSize: normalizedSize,
    center: new THREE.Vector3(0, 0, 0),
  };
};
