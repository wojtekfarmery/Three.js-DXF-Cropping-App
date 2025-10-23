import type { IEntity, IPolylineEntity } from "dxf-parser";
import * as THREE from "three";

export const computeBounds = (
  entities: IEntity[] | undefined
): THREE.Box3 | null => {
  const box = new THREE.Box3();
  let initialized = false;

  if (!entities) {
    return null;
  }

  for (const entity of entities) {
    const points: { x: number; y: number; z?: number }[] = [];

    if (entity.type === "POLYLINE") {
      const poly = entity as IPolylineEntity;
      if (poly.vertices?.length) {
        points.push(...poly.vertices);
      }
    }

    for (const point of points) {
      const vector = new THREE.Vector3(point.x, point.y, point.z ?? 0);
      if (!initialized) {
        box.min.copy(vector);
        box.max.copy(vector);
        initialized = true;
      } else {
        box.expandByPoint(vector);
      }
    }
  }

  return initialized ? box : null;
};
