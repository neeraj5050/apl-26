'use client';

import { useState, useCallback } from 'react';
import { players } from '@/lib/db/seed/ipl-data';
import { selectBestQuestion, filterCandidates, calculateConfidence, rankCandidates } from '@/lib/engine/entropy';
import { getPersona, getPersonaMessage } from '@/lib/engine/persona';
import { QUESTION_BANK } from '@/lib/engine/questions';
import type { Persona } from '@/lib/engine/persona';
type PlayerCandidate = Record<string, any>; // eslint-disable-line

interface GameState {
  candidates: PlayerCandidate[];
  totalCandidates: number;
  askedIds: string[];
  history: { q: string; a: string }[];
  answeredQuestions: { questionId: string; answer: string }[];
  questionsLeft: number;
}

type Phase = 'idle' | 'loading' | 'playing' | 'thinking' | 'guessing' | 'result';

interface UseGameReturn {
  phase: Phase;
  question: string;
  questionNumber: number;
  questionsLeft: number;
  confidence: number;
  persona: Persona;
  personaMessage: string;
  guess: string;
  guessMessage: string;
  correct: boolean | null;
  showExplosion: boolean;
  startGame: () => void;
  handleAnswer: (answer: 'yes' | 'no' | 'maybe') => void;
  handleGuessResponse: (isCorrect: boolean) => void;
  resetGame: () => void;
}

export function useGame(): UseGameReturn {
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

  const startGame = useCallback(() => {
    setPhase('loading');

    // Small delay for dramatic effect
    setTimeout(() => {
      const allCandidates = players;
      const firstQuestion = selectBestQuestion(allCandidates, []);
      const p = getPersona(5, 15);

      setQuestion(firstQuestion.text);
      setQuestionId(firstQuestion.id);
      setQuestionNumber(1);
      setQuestionsLeft(15);
      setConfidence(5);
      setPersona(p);
      setPersonaMessage(getPersonaMessage(p));
      setGameState({
        candidates: allCandidates,
        totalCandidates: allCandidates.length,
        askedIds: [firstQuestion.id],
        history: [],
        answeredQuestions: [],
        questionsLeft: 15,
      });
      setPhase('playing');
    }, 800);
  }, []);

  const handleAnswer = useCallback((answer: 'yes' | 'no' | 'maybe') => {
    if (!gameState) return;
    setPhase('thinking');

    // Small delay to simulate thinking
    setTimeout(() => {
      const currentQuestion = QUESTION_BANK.find(q => q.id === questionId);
      if (!currentQuestion) {
        setPhase('playing');
        return;
      }

      // 1. Filter candidates
      const newCandidates = filterCandidates(
        gameState.candidates,
        currentQuestion,
        answer
      );

      // 2. Calculate confidence
      const newConfidence = calculateConfidence(newCandidates.length, gameState.totalCandidates);
      const newQuestionsLeft = gameState.questionsLeft - 1;

      // Update history
      const newHistory = [
        ...gameState.history,
        { q: currentQuestion.text, a: answer },
      ];
      const newAskedIds = [...gameState.askedIds, currentQuestion.id];
      const newAnsweredQuestions = [
        ...gameState.answeredQuestions,
        { questionId: currentQuestion.id, answer },
      ];

      // 3. Rank candidates
      const rankedCandidates = rankCandidates(newCandidates, newAnsweredQuestions);

      // 4. Should we guess?
      const questionsAsked = 15 - newQuestionsLeft;
      const minQuestionsReached = questionsAsked >= 7;
      const shouldGuess =
        newQuestionsLeft <= 0 ||
        (rankedCandidates.length <= 1 && minQuestionsReached) ||
        (rankedCandidates.length <= 2 && questionsAsked >= 10) ||
        (rankedCandidates.length <= 3 && questionsAsked >= 13);

      if (shouldGuess) {
        const topGuess = rankedCandidates[0]?.name || 'Unknown Player';
        const guessConf = rankedCandidates.length <= 1 ? 99 : rankedCandidates.length <= 2 ? 88 : 75;
        const p = guessConf >= 80 ? 'hype' as Persona : 'panic' as Persona;

        setGuess(topGuess);
        setGuessMessage(getRevealMessage(topGuess, p));
        setConfidence(guessConf);
        setPersona(p);
        setPersonaMessage(getPersonaMessage(p));
        setGameState({
          ...gameState,
          candidates: rankedCandidates,
          askedIds: newAskedIds,
          history: newHistory,
          answeredQuestions: newAnsweredQuestions,
          questionsLeft: newQuestionsLeft,
        });
        setPhase('guessing');
        return;
      }

      // 5. Pick next question
      const bestQ = selectBestQuestion(rankedCandidates, newAskedIds, newAnsweredQuestions);
      const p = getPersona(newConfidence, newQuestionsLeft);

      setQuestion(bestQ.text);
      setQuestionId(bestQ.id);
      setQuestionNumber(prev => prev + 1);
      setQuestionsLeft(newQuestionsLeft);
      setConfidence(newConfidence);
      setPersona(p);
      setPersonaMessage(getPersonaMessage(p));
      setGameState({
        ...gameState,
        candidates: rankedCandidates,
        askedIds: newAskedIds,
        history: newHistory,
        answeredQuestions: newAnsweredQuestions,
        questionsLeft: newQuestionsLeft,
      });
      setPhase('playing');
    }, 600 + Math.random() * 800); // Random delay 0.6-1.4s for realism
  }, [gameState, questionId]);

  const handleGuessResponse = useCallback((isCorrect: boolean) => {
    setCorrect(isCorrect);
    if (isCorrect) setShowExplosion(true);
    setPhase('result');
    if (isCorrect) {
      setTimeout(() => setShowExplosion(false), 4000);
    }
  }, []);

  const resetGame = useCallback(() => {
    setPhase('idle');
    setQuestion('');
    setQuestionId('');
    setQuestionNumber(0);
    setQuestionsLeft(15);
    setConfidence(5);
    setPersona('neutral');
    setPersonaMessage('Think of any IPL player...');
    setGuess('');
    setGuessMessage('');
    setCorrect(null);
    setShowExplosion(false);
    setGameState(null);
  }, []);

  return {
    phase, question, questionNumber, questionsLeft, confidence,
    persona, personaMessage, guess, guessMessage, correct, showExplosion,
    startGame, handleAnswer, handleGuessResponse, resetGame,
  };
}

function getRevealMessage(playerName: string, persona: string): string {
  const reveals = {
    hype: [
      `I KNEW IT! It's ${playerName}! 🏏🔥`,
      `Boom! You're thinking of ${playerName}! Am I right? 💥`,
      `The answer is clear as day — ${playerName}! 🎯`,
      `My circuits are buzzing — it's ${playerName}! ⚡`,
    ],
    panic: [
      `I'm going with my gut... ${playerName}? 😰`,
      `This is a tough one... but is it ${playerName}? 🤔`,
      `I'll take a shot — ${playerName}? 🎲`,
      `Not fully sure, but... ${playerName}? 😬`,
    ],
  };
  const pool = reveals[persona as keyof typeof reveals] || reveals.hype;
  return pool[Math.floor(Math.random() * pool.length)];
}
