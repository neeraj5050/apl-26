'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { NeonText } from '@/components/ui/NeonText';

interface LeaderboardEntry {
  rank: number;
  name: string;
  wins: number;
  avgQuestions: number;
  streak: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [hardestPlayers, setHardestPlayers] = useState<{ name: string; avgQuestions: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(data => {
        setLeaderboard(data.leaderboard);
        setHardestPlayers(data.hardestPlayers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const medalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg grid-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">← Home</Link>
          <NeonText as="h1" color="gold" className="text-4xl font-bold tracking-wider mt-4">
            🏆 Leaderboard
          </NeonText>
          <p className="text-gray-500 text-sm mt-2">Top IPL mind readers</p>
        </div>

        {loading ? (
          <div className="text-center text-ipl-cyan animate-pulse">Loading...</div>
        ) : (
          <>
            {/* Main leaderboard */}
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

            {/* Hardest players */}
            <div className="glass-card p-4">
              <h3 className="text-ipl-purple font-bold text-sm uppercase tracking-wider mb-3">🧠 Hardest to Guess</h3>
              {hardestPlayers.map((p, i) => (
                <div key={i} className="flex justify-between py-2 text-sm border-b border-dark-border/20 last:border-0">
                  <span className="text-gray-300">{p.name}</span>
                  <span className="font-mono text-red-400">{p.avgQuestions} avg Qs</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="text-center mt-8">
          <Link href="/game" className="glow-btn glow-btn-cyan px-6 py-2 text-sm inline-block">Play Now →</Link>
        </div>
      </div>
    </div>
  );
}
