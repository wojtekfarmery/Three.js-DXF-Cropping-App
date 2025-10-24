import * as THREE from "three";
import { type IPolylineEntity } from "dxf-parser";

type FaceVertex = {
  faceA?: number;
  faceB?: number;
  faceC?: number;
  faceD?: number;
  x: number;
  y: number;
  z: number;
};

export const buildMeshFromPolyface = (entity: IPolylineEntity): THREE.Mesh => {
  if (entity.vertices.length === 0) {
    throw new Error("Polyface entity has no vertices.");
  }

  const vertexList: { x: number; y: number; z: number }[] = [];
  const faceList: FaceVertex[] = [];

  for (const vertex of entity.vertices as FaceVertex[]) {
    if (vertex.x !== 0 || vertex.y !== 0 || vertex.z !== 0) {
      vertexList.push({ x: vertex.x, y: vertex.y, z: vertex.z ?? 0 });
    } else {
      faceList.push(vertex);
    }
  }

  if (vertexList.length === 0) {
    throw new Error("Polyface entity contains no valid vertex data.");
  }

  if (faceList.length === 0) {
    throw new Error("Polyface entity contains no valid faces.");
  }

  const positions = new Float32Array(vertexList.length * 3);

  for (let i = 0; i < vertexList.length; i++) {
    const v = vertexList[i];
    positions[i * 3 + 0] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }

  const indices: number[] = [];
  for (const face of faceList) {
    const ids = [face.faceA, face.faceB, face.faceC, face.faceD]
      .filter((n): n is number => typeof n === "number" && n !== 0)
      .map((n) => Math.abs(n) - 1);

    if (ids.length >= 3) {
      indices.push(ids[0], ids[1], ids[2]);
    }
    if (ids.length === 4) {
      indices.push(ids[0], ids[2], ids[3]);
    }
  }

  const geometry = createGeometryFromPositions(positions, indices);

  const material = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    flatShading: true,
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geometry, material);
};

const TARGET_SIZE = 800;

const createGeometryFromPositions = (
  positions: Float32Array,
  indices: number[]
) => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.center();

  const size = new THREE.Vector3();
  geometry.boundingBox!.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = TARGET_SIZE / maxDim;
  geometry.scale(scale, scale, scale);
  return geometry;
};
