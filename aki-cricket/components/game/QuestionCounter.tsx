'use client';

interface QuestionCounterProps {
  current: number;
  total: number;
  questionsLeft: number;
}

export function QuestionCounter({ current, total, questionsLeft }: QuestionCounterProps) {
  return (
    <div className="flex justify-between w-full max-w-lg items-center">
      <span className="text-ipl-cyan font-mono text-sm tracking-wide">
        Q {current}/{total}
      </span>
      <span className="text-white font-bold text-xl tracking-[0.3em] font-game">
        🏏 AKI
      </span>
      <span className={`font-mono text-sm tracking-wide ${questionsLeft <= 3 ? 'text-red-400 animate-pulse' : 'text-ipl-cyan'}`}>
        {questionsLeft} left
      </span>
    </div>
  );
}
