import { useEffect, useRef, type FC } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { type IDxf, type IPolylineEntity } from "dxf-parser";

type ThreeSixtyModelProps = {
  dxf: IDxf | null;
};

export const ThreeSixtyModel: FC<ThreeSixtyModelProps> = ({ dxf }) => {
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groupRef = useRef(new THREE.Group());

  useEffect(() => {
    if (!dxf || !groupRef.current) return;

    const group = groupRef.current;
    group.clear();

    const meshGroup = new THREE.Group();

    for (const entity of dxf.entities) {
      switch (entity.type) {
        case "POLYLINE": {
          const e = entity as IPolylineEntity;

          const mesh = buildMeshFromPolyface(e);
          if (mesh) {
            meshGroup.add(mesh);
          }
          break;
        }
      }
    }

    group.add(meshGroup);

    console.log(meshGroup.children.length);
  }, [dxf]);

  return (
    <Canvas
      camera={{ position: [0, 0, 1000], fov: 60 }}
      onCreated={({ gl }) => {
        rendererRef.current = gl;
        gl.setClearColor("#eaeaea");
      }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 2, 2]} intensity={1.2} />
      <axesHelper args={[500]} />
      <OrbitControls enableZoom enablePan />
      <primitive object={groupRef.current} />
    </Canvas>
  );
};

type FaceVertex = {
  faceA?: number;
  faceB?: number;
  faceC?: number;
  faceD?: number;
  x: number;
  y: number;
  z: number;
};

const buildMeshFromPolyface = (entity: IPolylineEntity): THREE.Mesh | null => {
  if (entity.vertices.length === 0) {
    return null;
  }

  const withCoords: { x: number; y: number; z: number }[] = [];
  const faces: FaceVertex[] = [];

  for (const vertex of entity.vertices as FaceVertex[]) {
    if (vertex.x !== 0 || vertex.y !== 0 || vertex.z !== 0) {
      withCoords.push({ x: vertex.x, y: vertex.y, z: vertex.z ?? 0 });
    } else {
      faces.push(vertex);
    }
  }

  if (withCoords.length === 0 || faces.length === 0) {
    return null;
  }

  const positions = new Float32Array(withCoords.length * 3);

  for (let i = 0; i < withCoords.length; i++) {
    const v = withCoords[i];
    positions[i * 3 + 0] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }

  const indices: number[] = [];
  for (const face of faces) {
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

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.center();

  const size = new THREE.Vector3();
  geometry.boundingBox!.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = 800 / maxDim;
  geometry.scale(scale, scale, scale);

  const matertial = new THREE.MeshStandardMaterial({
    color: 0x66ccff,
    flatShading: true,
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geometry, matertial);
};
