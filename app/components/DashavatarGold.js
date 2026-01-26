'use client';

import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';

function DashavatarModel() {
  const geometry = useLoader(STLLoader, '/models/Dashavatar.stl');

  geometry.computeVertexNormals();
  geometry.center();

  const box = new THREE.Box3().setFromBufferAttribute(
    geometry.attributes.position
  );
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 2 / maxDim;

  return (
    <mesh
  geometry={geometry}
  scale={[scale * 1.75, scale * 1.75, scale * 1.75]} // 👈 taller
  rotation={[-Math.PI / 2, 0, 0]}
>
      <meshStandardMaterial
        color="#d4af37"
        metalness={0.9}
        roughness={0.25}
      />
    </mesh>
  );
}

export default function DashavatarGold() {
  return (
    <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 5]} intensity={3} />
      <pointLight position={[-5, 5, -5]} intensity={1.5} />

      <DashavatarModel />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.6} />
    </Canvas>
  );
}
