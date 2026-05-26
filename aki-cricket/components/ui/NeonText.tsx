'use client';
import { motion } from 'framer-motion';

interface NeonTextProps {
  children: React.ReactNode;
  color?: 'cyan' | 'gold' | 'green' | 'purple';
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

export function NeonText({ children, color = 'cyan', className = '', as: Tag = 'span' }: NeonTextProps) {
  const neonClass = color === 'gold' ? 'neon-text-gold' : 'neon-text';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tag className={`${neonClass} ${className}`}>
        {children}
      </Tag>
    </motion.div>
  );
}
