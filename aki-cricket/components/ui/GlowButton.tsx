'use client';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'color'> {
  children: React.ReactNode;
  color?: 'cyan' | 'green' | 'red' | 'purple' | 'gold';
  size?: 'sm' | 'md' | 'lg';
}

export function GlowButton({ children, color = 'cyan', size = 'md', className = '', ...props }: GlowButtonProps) {
  const sizeMap = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-lg',
    lg: 'px-10 py-4 text-xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`glow-btn glow-btn-${color} ${sizeMap[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
