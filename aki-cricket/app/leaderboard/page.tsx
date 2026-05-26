'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NeonText } from '@/components/ui/NeonText';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'CricketFan99', wins: 42, avgQuestions: 8.2, streak: 12 },
  { rank: 2, name: 'IPLMaster', wins: 38, avgQuestions: 9.1, streak: 8 },
  { rank: 3, name: 'DhoniLover', wins: 35, avgQuestions: 7.5, streak: 6 },
  { rank: 4, name: 'ViratArmy', wins: 29, avgQuestions: 10.3, streak: 4 },
  { rank: 5, name: 'PaceBowlerFan', wins: 24, avgQuestions: 11.0, streak: 3 },
  { rank: 6, name: 'SpinWizard', wins: 20, avgQuestions: 9.8, streak: 2 },
  { rank: 7, name: 'AllRounderKing', wins: 18, avgQuestions: 12.1, streak: 1 },
  { rank: 8, name: 'FinisherMode', wins: 15, avgQuestions: 10.5, streak: 5 },
];

const HARDEST_PLAYERS = [
  { name: 'Jitesh Sharma', avgQuestions: 14.2 },
  { name: 'Venkatesh Iyer', avgQuestions: 13.8 },
  { name: 'Devdutt Padikkal', avgQuestions: 13.1 },
  { name: 'Abhishek Sharma', avgQuestions: 12.7 },
];

export default function LeaderboardPage() {
  const [leaderboard] = useState(MOCK_LEADERBOARD);
  const [hardestPlayers] = useState(HARDEST_PLAYERS);

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg grid-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link href="/" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">← Home</Link>
          <NeonText as="h1" color="gold" className="text-4xl font-bold tracking-wider mt-4">
            🏆 Leaderboard
          </NeonText>
          <p className="text-gray-500 text-sm mt-2">Top IPL mind readers</p>
        </div>

        <div className="glass-card overflow-hidden mb-8">
          <div className="grid grid-cols-5 gap-2 p-3 text-xs font-mono text-gray-500 border-b border-dark-border uppercase">
            <span>Rank</span><span className="col-span-1">Player</span><span>Wins</span><span>Avg Q</span><span>Streak</span>
          </div>
          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`grid grid-cols-5 gap-2 p-3 text-sm items-center border-b border-dark-border/30 hover:bg-white/5 transition-colors ${i < 3 ? 'bg-ipl-gold/5' : ''}`}
            >
              <span className="text-lg">{medalEmoji(entry.rank)}</span>
              <span className="font-game text-white truncate">{entry.name}</span>
              <span className="font-mono text-neon-green">{entry.wins}</span>
              <span className="font-mono text-ipl-cyan">{entry.avgQuestions}</span>
              <span className="font-mono text-ipl-gold">🔥{entry.streak}</span>
            </motion.div>
          ))}
        </div>

        <div className="glass-card p-4">
          <h3 className="text-ipl-purple font-bold text-sm uppercase tracking-wider mb-3">🧠 Hardest to Guess</h3>
          {hardestPlayers.map((p, i) => (
            <div key={i} className="flex justify-between py-2 text-sm border-b border-dark-border/20 last:border-0">
              <span className="text-gray-300">{p.name}</span>
              <span className="font-mono text-red-400">{p.avgQuestions} avg Qs</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/game" className="glow-btn glow-btn-cyan px-6 py-2 text-sm inline-block">Play Now →</Link>
        </div>
      </div>
    </div>
  );
}
