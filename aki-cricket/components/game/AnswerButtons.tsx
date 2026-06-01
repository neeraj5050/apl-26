'use client';
import { motion } from 'framer-motion';
import type { Answer } from '@/lib/engine/entropy';

interface AnswerButtonsProps {
  onAnswer: (answer: Answer) => void;
  disabled: boolean;
}

export function AnswerButtons({ onAnswer, disabled }: AnswerButtonsProps) {
  const buttons = [
    { label: 'Yes', value: 'yes' as const, className: 'glow-btn glow-btn-green' },
    { label: 'No', value: 'no' as const, className: 'glow-btn glow-btn-red' },
    { label: 'Maybe', value: 'maybe' as const, className: 'glow-btn glow-btn-purple' },
    { label: "Don't Know", value: 'dont_know' as const, className: 'glow-btn glow-btn-gold' },
  ];

  return (
    <div className="flex flex-wrap gap-3 md:gap-4 w-full max-w-lg justify-center">
      {buttons.map((btn, i) => (
        <motion.button
          key={btn.value}
          whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
          whileTap={disabled ? {} : { scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
          onClick={() => !disabled && onAnswer(btn.value)}
          disabled={disabled}
          className={`${btn.className} flex-1 min-w-[70px] py-4 text-sm md:text-lg ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {btn.label}
        </motion.button>
      ))}
    </div>
  );
}
