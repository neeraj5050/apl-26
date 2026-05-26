'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function ConfidenceOrb({ confidence, isGuessing }: { confidence: number; isGuessing: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const hue = confidence > 80 ? 0.3 : confidence > 50 ? 0.08 : 0.6;
  const color = new THREE.Color().setHSL(hue, 1, 0.5);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    const pulse = isGuessing ? 4 : 1.5;
    const scale = 1 + Math.sin(state.clock.elapsedTime * pulse) * 0.05;
    meshRef.current.scale.setScalar(scale * (0.8 + confidence / 500));
  });

  return (
    <Sphere ref={meshRef} args={[1.2, 64, 64]} position={[0, -1.5, 0]}>
      <MeshDistortMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4 + confidence / 200}
        distort={0.3 + confidence / 300}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    </Sphere>
  );
}
