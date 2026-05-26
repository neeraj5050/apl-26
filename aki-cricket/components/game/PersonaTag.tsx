'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { getPersonaEmoji } from '@/lib/engine/persona';
import type { Persona } from '@/lib/engine/persona';

interface PersonaTagProps {
  persona: Persona;
  message: string;
}

export function PersonaTag({ persona, message }: PersonaTagProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={persona + message}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <span className="text-2xl mb-1 block">{getPersonaEmoji(persona)}</span>
        <p className="text-purple-300 text-sm italic max-w-md mx-auto">
          {message}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
