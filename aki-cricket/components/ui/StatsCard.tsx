'use client';
import { motion } from 'framer-motion';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export function StatsCard({ label, value, icon, color = 'ipl-cyan' }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      className="glass-card p-4 text-center"
    >
      {icon && <span className="text-2xl mb-2 block">{icon}</span>}
      <p className={`text-2xl font-bold font-mono text-${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}
