'use client';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
}

export function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  return (
    <motion.div
      className="glass-card p-6 md:p-8"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ipl-cyan/20 text-ipl-cyan text-sm font-mono font-bold">
          {questionNumber}
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-ipl-cyan/30 to-transparent" />
      </div>
      <p className="text-white text-lg md:text-xl font-game leading-relaxed">
        {question}
      </p>
    </motion.div>
  );
}
