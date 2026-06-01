'use client';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { GlowButton } from '@/components/ui/GlowButton';
import { NeonText } from '@/components/ui/NeonText';

const StadiumScene = dynamic(
  () => import('@/components/three/StadiumScene'),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="relative w-screen h-screen bg-dark-bg overflow-hidden">
      {/* Three.js Background */}
      <div className="absolute inset-0 opacity-60">
        <Suspense fallback={null}>
          <StadiumScene confidence={30} persona="neutral" isGuessing={false} />
        </Suspense>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            🏏
          </motion.div>
          <NeonText as="h1" color="cyan" className="text-5xl md:text-7xl font-bold tracking-[0.2em] mb-2">
            AKI CRICKET
          </NeonText>
          <p className="text-gray-400 text-lg md:text-xl font-light tracking-wider">
            AI-Powered IPL Guessing Game
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-purple-300 text-center text-sm md:text-base mb-10 max-w-md italic"
        >
          &quot;Think of any IPL cricketer. I&apos;ll guess who it is in 20 questions.&quot;
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link href="/game">
            <GlowButton color="cyan" size="lg">
              ▶ Start Game
            </GlowButton>
          </Link>
          <Link href="/daily">
            <GlowButton color="gold" size="md">
              📅 Daily Challenge
            </GlowButton>
          </Link>
        </motion.div>

        {/* Bottom links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 flex gap-8"
        >
          <Link href="/leaderboard" className="text-gray-500 hover:text-ipl-cyan transition-colors text-sm tracking-wider uppercase">
            🏆 Leaderboard
          </Link>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 right-8 hidden md:flex gap-6 text-gray-600 text-xs font-mono"
        >
          <span>150+ Players</span>
          <span>•</span>
          <span>Powered by Grok AI</span>
          <span>•</span>
          <span>Three.js Visuals</span>
        </motion.div>
      </div>
    </div>
  );
}
