'use client';
import { Canvas } from '@react-three/fiber';
import { Stars, Float, Environment } from '@react-three/drei';
import { ConfidenceOrb } from './ConfidenceOrb';
import { AvatarModel } from './AvatarModel';
import { ParticleField } from './ParticleField';
import { WinExplosion } from './WinExplosion';

interface StadiumSceneProps {
  confidence: number;
  persona: 'confident' | 'neutral' | 'panic' | 'hype' | 'surprised';
  isGuessing: boolean;
  showExplosion?: boolean;
}

export default function StadiumScene({ confidence, persona, isGuessing, showExplosion = false }: StadiumSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 2]}
      style={{ background: '#050510' }}
    >
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 5, 25]} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#4444ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff4400" />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#00E5FF" />

      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0.5} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <AvatarModel persona={persona} />
      </Float>

      <ConfidenceOrb confidence={confidence} isGuessing={isGuessing} />
      <ParticleField confidence={confidence} />
      <WinExplosion active={showExplosion} />

      <Environment preset="night" />
    </Canvas>
  );
}
