import * as THREE from "three";
import { type IDxf } from "dxf-parser";

export type Roi = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export type ModelData = {
  bounds: THREE.Box3 | null;
  modelSize: THREE.Vector3 | null;
  center: THREE.Vector3 | null;
  meshes: THREE.Mesh[];
  meshGroup: THREE.Group | null;
};

export type MetaData = {
  entities: number;
};

export type DxfModel = IDxf | null;
