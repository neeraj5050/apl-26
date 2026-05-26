'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AvatarModelProps {
  persona: 'confident' | 'neutral' | 'panic' | 'hype' | 'surprised';
}

export function AvatarModel({ persona }: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);

  const personaConfig = useMemo(() => ({
    confident: { color: '#00E5FF', speed: 1, wobble: 0.02, eyeScale: 1 },
    neutral:   { color: '#9B30FF', speed: 0.5, wobble: 0.01, eyeScale: 1 },
    panic:     { color: '#FF4444', speed: 3, wobble: 0.08, eyeScale: 1.3 },
    hype:      { color: '#FFD700', speed: 2, wobble: 0.04, eyeScale: 1.1 },
    surprised: { color: '#00FF88', speed: 1.5, wobble: 0.05, eyeScale: 1.4 },
  }), []);

  const config = personaConfig[persona] || personaConfig.neutral;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * config.speed * 0.5) * config.wobble * 5;
    groupRef.current.rotation.z = Math.sin(t * config.speed * 0.3) * config.wobble * 2;
    groupRef.current.position.y = 1.5 + Math.sin(t * 0.8) * 0.1;

    if (eyeLeftRef.current && eyeRightRef.current) {
      const blink = Math.sin(t * 3) > 0.97 ? 0.1 : config.eyeScale;
      eyeLeftRef.current.scale.y = blink;
      eyeRightRef.current.scale.y = blink;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]}>
      {/* Head — icosahedron for geometric AI look */}
      <mesh>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.3}
          wireframe={persona === 'panic'}
          transparent
          opacity={0.9}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={config.color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Left eye */}
      <mesh ref={eyeLeftRef} position={[-0.25, 0.15, 0.65]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Right eye */}
      <mesh ref={eyeRightRef} position={[0.25, 0.15, 0.65]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Orbiting ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.02, 16, 100]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}
