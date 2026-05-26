'use client';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function WinExplosion({ active }: { active: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const count = 200;
  const [initialized, setInitialized] = useState(false);

  const positions = useRef(new Float32Array(count * 3));
  const velocities = useRef(new Float32Array(count * 3));
  const colors = useRef(new Float32Array(count * 3));

  useEffect(() => {
    if (!active) { setInitialized(false); return; }
    const goldColors = [
      [1, 0.84, 0],    // gold
      [1, 0.55, 0],    // orange
      [0, 0.9, 1],     // cyan
      [0.6, 0.2, 1],   // purple
      [0, 1, 0.53],    // green
    ];
    for (let i = 0; i < count; i++) {
      positions.current[i * 3] = 0;
      positions.current[i * 3 + 1] = -1.5;
      positions.current[i * 3 + 2] = 0;
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.3) * Math.PI;
      const speed = 0.02 + Math.random() * 0.08;
      velocities.current[i * 3]     = Math.cos(angle) * Math.cos(elevation) * speed;
      velocities.current[i * 3 + 1] = Math.sin(elevation) * speed + 0.02;
      velocities.current[i * 3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed;
      const c = goldColors[Math.floor(Math.random() * goldColors.length)];
      colors.current[i * 3] = c[0];
      colors.current[i * 3 + 1] = c[1];
      colors.current[i * 3 + 2] = c[2];
    }
    setInitialized(true);
  }, [active]);

  useFrame(() => {
    if (!active || !ref.current || !initialized) return;
    const pos = positions.current;
    const vel = velocities.current;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1] - 0.001;
      pos[i * 3 + 2] += vel[i * 3 + 2];
    }
    const geom = ref.current.geometry;
    (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors.current, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} transparent opacity={0.9} vertexColors sizeAttenuation />
    </points>
  );
}
