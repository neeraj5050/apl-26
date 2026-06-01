import { NextRequest, NextResponse } from 'next/server';
import { filterCandidates, selectBestQuestion, calculateConfidence, rankCandidates } from '@/lib/engine/entropy';
import { rephraseQuestion, generateGuessNarration } from '@/lib/grok/client';
import { getPersona, getPersonaMessage } from '@/lib/engine/persona';
import { QUESTION_BANK } from '@/lib/engine/questions';

const MAX_QUESTIONS = 20;
const MAX_DONT_KNOW = 5;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answer, questionId, gameState } = body;

    const currentQuestion = QUESTION_BANK.find(q => q.id === questionId);
    if (!currentQuestion) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    // Track dont_know count
    const newDontKnowCount = (gameState.dontKnowCount || 0) + (answer === 'dont_know' ? 1 : 0);

    // dont_know doesn't cost a question (up to MAX_DONT_KNOW free passes)
    const costsFreePass = answer === 'dont_know' && newDontKnowCount <= MAX_DONT_KNOW;
    const questionsLeft = costsFreePass ? gameState.questionsLeft : gameState.questionsLeft - 1;

    // 1. Filter candidates
    const newCandidates = filterCandidates(gameState.candidates, currentQuestion, answer);

    // 2. Update history
    const newHistory = [...gameState.history, { questionId: currentQuestion.id, q: currentQuestion.text, a: answer }];
    const newAskedIds = [...gameState.askedIds, currentQuestion.id];
    const newAnsweredQuestions = [...(gameState.answeredQuestions || []), { questionId: currentQuestion.id, answer }];

    // 3. Rank candidates
    const rankedCandidates = rankCandidates(newCandidates, newAnsweredQuestions);

    // 4. Calculate confidence
    const confidence = calculateConfidence(rankedCandidates.length, gameState.totalCandidates);

    // 5. Should we guess?
    const questionsAsked = MAX_QUESTIONS - questionsLeft;
    const shouldGuess =
      questionsLeft <= 0 ||
      (rankedCandidates.length <= 1 && questionsAsked >= 7) ||
      (rankedCandidates.length <= 2 && questionsAsked >= 10) ||
      (rankedCandidates.length <= 3 && questionsAsked >= 14);

    if (shouldGuess) {
      const topGuess = rankedCandidates[0]?.name || 'Unknown Player';
      const guessConfidence = rankedCandidates.length <= 1 ? 99 : rankedCandidates.length <= 2 ? 88 : 75;
      const persona = guessConfidence >= 80 ? 'hype' : 'panic';

      const guessMessage = await generateGuessNarration(topGuess, guessConfidence, persona, newHistory.length);

      return NextResponse.json({
        action: 'guess',
        topGuess,
        topCandidates: rankedCandidates.slice(0, 3).map(c => c.name),
        confidence: guessConfidence,
        guessMessage,
        persona,
        personaMessage: getPersonaMessage(persona as 'hype' | 'panic'),
        questionsAsked: newHistory.length,
        candidatesRemaining: rankedCandidates.length,
        gameState: { ...gameState, candidates: rankedCandidates, askedIds: newAskedIds, history: newHistory, answeredQuestions: newAnsweredQuestions, questionsLeft, dontKnowCount: newDontKnowCount },
      });
    }

    // 6. Pick next question
    const bestQ = selectBestQuestion(rankedCandidates, newAskedIds, newAnsweredQuestions);
    const persona = getPersona(confidence, questionsLeft);
    const naturalQuestion = await rephraseQuestion(bestQ.text, persona);

    return NextResponse.json({
      action: 'continue',
      question: { ...bestQ, display: naturalQuestion },
      candidates: rankedCandidates.length,
      confidence,
      persona,
      personaMessage: getPersonaMessage(persona),
      questionsLeft,
      candidatesRemaining: rankedCandidates.length,
      gameState: { ...gameState, candidates: rankedCandidates, askedIds: newAskedIds, history: newHistory, answeredQuestions: newAnsweredQuestions, questionsLeft, dontKnowCount: newDontKnowCount },
    });
  } catch (error) {
    console.error('Answer error:', error);
    return NextResponse.json({ error: 'Failed to process answer' }, { status: 500 });
  }
}
