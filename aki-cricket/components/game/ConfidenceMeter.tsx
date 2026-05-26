'use client';
import { motion } from 'framer-motion';

interface ConfidenceMeterProps {
  value: number;
}

export function ConfidenceMeter({ value }: ConfidenceMeterProps) {
  const getColor = () => {
    if (value >= 80) return 'from-neon-green to-ipl-gold';
    if (value >= 50) return 'from-ipl-cyan to-ipl-purple';
    return 'from-ipl-purple to-ipl-blue';
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-mono text-gray-400">AI Confidence</span>
        <span className={`text-xs font-mono font-bold ${value >= 80 ? 'text-neon-green' : value >= 50 ? 'text-ipl-cyan' : 'text-ipl-purple'}`}>
          {value}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-dark-card border border-dark-border overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ boxShadow: value >= 80 ? '0 0 12px rgba(0,255,136,0.5)' : '0 0 8px rgba(0,229,255,0.3)' }}
        />
      </div>
    </div>
  );
}
