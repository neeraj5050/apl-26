'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NeonText } from '@/components/ui/NeonText';
import { GlowButton } from '@/components/ui/GlowButton';

export default function DailyPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const hints = [
    { hint: 'This player is known for staying calm under pressure', entityType: 'Player' },
    { hint: 'A foreign player who changed the game for his franchise', entityType: 'Player' },
    { hint: 'This youngster has taken IPL by storm recently', entityType: 'Player' },
    { hint: 'A captain who led from the front in multiple seasons', entityType: 'Player' },
    { hint: 'This bowler has the most feared yorker in IPL', entityType: 'Player' },
  ];

  // Use date to deterministically pick a daily hint
  const dayIndex = new Date().getDate() % hints.length;
  const daily = { date: today, ...hints[dayIndex] };

  return (
    <div className="min-h-screen bg-dark-bg grid-bg flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <Link href="/" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">← Home</Link>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <p className="text-5xl mb-4">📅</p>
          <NeonText as="h1" color="gold" className="text-3xl md:text-4xl font-bold tracking-wider mb-2">
            Daily Challenge
          </NeonText>
          <p className="text-gray-500 text-sm mb-8">Same player for everyone. Can you stump Aki?</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="glass-card p-6 mb-6">
            <p className="text-gray-500 text-xs font-mono mb-2">{daily.date}</p>
            <p className="text-ipl-gold text-lg font-game mb-1">Today&apos;s Hint:</p>
            <p className="text-white text-xl font-bold">{daily.hint}</p>
            <p className="text-gray-600 text-xs mt-2 uppercase tracking-wider">Type: {daily.entityType}</p>
          </div>
          <Link href="/game">
            <GlowButton color="gold" size="lg">🎯 Play Today&apos;s Challenge</GlowButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
