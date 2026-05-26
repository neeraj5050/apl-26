'use client';
import { useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { QuestionCard } from '@/components/game/QuestionCard';
import { AnswerButtons } from '@/components/game/AnswerButtons';
import { QuestionCounter } from '@/components/game/QuestionCounter';
import { ConfidenceMeter } from '@/components/game/ConfidenceMeter';
import { PersonaTag } from '@/components/game/PersonaTag';
import { GlowButton } from '@/components/ui/GlowButton';
import type { Persona } from '@/lib/engine/persona';

const StadiumScene = dynamic(
  () => import('@/components/three/StadiumScene'),
  { ssr: false }
);

interface GameState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  candidates: any[];
  totalCandidates: number;
  askedIds: string[];
  history: { q: string; a: string }[];
  questionsLeft: number;
}

type Phase = 'idle' | 'loading' | 'playing' | 'thinking' | 'guessing' | 'result';

export default function GamePage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [question, setQuestion] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questionNumber, setQuestionNumber] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(15);
  const [confidence, setConfidence] = useState(5);
  const [persona, setPersona] = useState<Persona>('neutral');
  const [personaMessage, setPersonaMessage] = useState('Think of any IPL player...');
  const [guess, setGuess] = useState('');
  const [guessMessage, setGuessMessage] = useState('');
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [showExplosion, setShowExplosion] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);

  const startGame = useCallback(async () => {
    setPhase('loading');
    try {
      const res = await fetch('/api/game/start', { method: 'POST' });
      const data = await res.json();
      setQuestion(data.question.display);
      setQuestionId(data.question.id);
      setQuestionNumber(1);
      setQuestionsLeft(data.questionsLeft);
      setConfidence(data.confidence);
      setPersona(data.persona);
      setPersonaMessage(data.personaMessage);
      setGameState(data.gameState);
      setPhase('playing');
    } catch {
      setPersonaMessage('Failed to start game. Try again!');
      setPhase('idle');
    }
  }, []);

  const handleAnswer = useCallback(async (answer: 'yes' | 'no' | 'maybe') => {
    if (!gameState) return;
    setPhase('thinking');

    try {
      const res = await fetch('/api/game/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, questionId, gameState }),
      });
      const data = await res.json();

      if (data.action === 'guess') {
        setGuess(data.topGuess);
        setGuessMessage(data.guessMessage);
        setConfidence(data.confidence);
        setPersona(data.persona);
        setPersonaMessage(data.personaMessage);
        setGameState(data.gameState);
        setPhase('guessing');
      } else {
        setQuestion(data.question.display);
        setQuestionId(data.question.id);
        setQuestionNumber(prev => prev + 1);
        setQuestionsLeft(data.questionsLeft);
        setConfidence(data.confidence);
        setPersona(data.persona);
        setPersonaMessage(data.personaMessage);
        setGameState(data.gameState);
        setPhase('playing');
      }
    } catch {
      setPersonaMessage('Something went wrong. Let me try again...');
      setPhase('playing');
    }
  }, [gameState, questionId]);

  const handleGuessResponse = useCallback(async (isCorrect: boolean) => {
    setCorrect(isCorrect);
    if (isCorrect) setShowExplosion(true);

    try {
      await fetch('/api/game/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correct: isCorrect,
          guessedPlayer: guess,
          questionsAsked: questionNumber,
          confidence,
        }),
      });
    } catch { /* ignore logging errors */ }

    setPhase('result');
    if (isCorrect) {
      setTimeout(() => setShowExplosion(false), 4000);
    }
  }, [guess, questionNumber, confidence]);

  const resetGame = useCallback(() => {
    setPhase('idle');
    setQuestion('');
    setQuestionNumber(0);
    setQuestionsLeft(15);
    setConfidence(5);
    setPersona('neutral');
    setPersonaMessage('Think of any IPL player...');
    setGuess('');
    setCorrect(null);
    setShowExplosion(false);
    setGameState(null);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-dark-bg overflow-hidden">
      {/* THREE.JS CANVAS */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <StadiumScene
            confidence={confidence}
            persona={persona}
            isGuessing={phase === 'guessing'}
            showExplosion={showExplosion}
          />
        </Suspense>
      </div>

      {/* UI OVERLAY */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-6 md:py-8 px-4">
        {/* IDLE STATE */}
        {phase === 'idle' && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <p className="text-5xl mb-4">🏏</p>
              <h1 className="neon-text text-4xl md:text-5xl font-bold tracking-wider mb-3">AKI CRICKET</h1>
              <p className="text-gray-400 text-lg">Think of any IPL player...</p>
              <p className="text-gray-600 text-sm mt-2">I&apos;ll guess who it is in 15 questions</p>
            </motion.div>
            <GlowButton color="cyan" size="lg" onClick={startGame}>
              ▶ I&apos;m Ready
            </GlowButton>
            <Link href="/" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">
              ← Back to Home
            </Link>
          </div>
        )}

        {/* LOADING STATE */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-4xl">
              🏏
            </motion.div>
            <p className="text-ipl-cyan font-mono text-sm animate-pulse">Warming up the AI brain...</p>
          </div>
        )}

        {/* PLAYING / THINKING STATE */}
        {(phase === 'playing' || phase === 'thinking') && (
          <>
            <QuestionCounter current={questionNumber} total={15} questionsLeft={questionsLeft} />
            <PersonaTag persona={persona} message={personaMessage} />

            <AnimatePresence mode="wait">
              <motion.div
                key={question}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="w-full max-w-lg"
              >
                <QuestionCard question={question} questionNumber={questionNumber} />
              </motion.div>
            </AnimatePresence>

            <ConfidenceMeter value={confidence} />

            {phase === 'thinking' ? (
              <div className="flex gap-4 w-full max-w-lg justify-center">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-ipl-cyan font-mono text-sm">
                  🤖 Aki is thinking...
                </motion.div>
              </div>
            ) : (
              <AnswerButtons onAnswer={handleAnswer} disabled={phase !== 'playing'} />
            )}
          </>
        )}

        {/* GUESSING STATE */}
        {phase === 'guessing' && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }} className="text-center">
              <p className="text-4xl mb-4">🎯</p>
              <p className="text-purple-300 text-lg italic mb-4">{guessMessage}</p>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="neon-text-gold text-3xl md:text-4xl font-bold mb-2">
                {guess}
              </motion.h2>
              <p className="text-gray-500 text-sm">Confidence: {confidence}%</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="flex gap-4">
              <GlowButton color="green" onClick={() => handleGuessResponse(true)}>✅ Correct!</GlowButton>
              <GlowButton color="red" onClick={() => handleGuessResponse(false)}>❌ Wrong</GlowButton>
            </motion.div>
          </div>
        )}

        {/* RESULT STATE */}
        {phase === 'result' && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }} className="text-center">
              <p className="text-6xl mb-4">{correct ? '🎉' : '😅'}</p>
              <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${correct ? 'neon-text' : 'text-red-400'}`}>
                {correct ? 'Aki Got It Right!' : 'You Stumped Aki!'}
              </h2>
              <p className="text-gray-400 mb-2">
                {correct ? `Guessed in ${questionNumber} questions` : `The answer was hidden well`}
              </p>
              <p className="text-gray-600 text-sm">Player: {guess}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex gap-4">
              <GlowButton color="cyan" onClick={resetGame}>🔄 Play Again</GlowButton>
              <Link href="/leaderboard"><GlowButton color="gold">🏆 Leaderboard</GlowButton></Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
