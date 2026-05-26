import { NextRequest, NextResponse } from 'next/server';
import { filterCandidates, selectBestQuestion, calculateConfidence } from '@/lib/engine/entropy';
import { getNextQuestion, getFinalGuess } from '@/lib/grok/client';
import { getPersona, getPersonaMessage } from '@/lib/engine/persona';
import { QUESTION_BANK } from '@/lib/engine/questions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answer, questionId, gameState } = body;

    // Find the current question from bank
    const currentQuestion = QUESTION_BANK.find(q => q.id === questionId);
    if (!currentQuestion) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    // 1. Filter candidates based on answer
    const newCandidates = filterCandidates(
      gameState.candidates,
      currentQuestion,
      answer
    );

    // 2. Calculate confidence
    const confidence = calculateConfidence(newCandidates.length, gameState.totalCandidates);
    const questionsLeft = gameState.questionsLeft - 1;

    // Update history
    const newHistory = [
      ...gameState.history,
      { q: currentQuestion.text, a: answer },
    ];
    const newAskedIds = [...gameState.askedIds, currentQuestion.id];

    // 3. Should we guess now?
    if (newCandidates.length <= 1 || questionsLeft <= 0 || confidence >= 95) {
      const topGuess = newCandidates[0]?.name || 'Unknown Player';
      const topCandidates = newCandidates.slice(0, 3).map(c => c.name);
      const persona = confidence >= 80 ? 'hype' : 'panic';

      const guessMessage = await getFinalGuess({
        topCandidates: topCandidates.length > 0 ? topCandidates : [topGuess],
        questionsAsked: newHistory,
        persona,
      });

      return NextResponse.json({
        action: 'guess',
        topGuess,
        topCandidates,
        confidence,
        guessMessage,
        persona,
        personaMessage: getPersonaMessage(persona as 'hype' | 'panic'),
        questionsAsked: newHistory.length,
        gameState: {
          ...gameState,
          candidates: newCandidates,
          askedIds: newAskedIds,
          history: newHistory,
          questionsLeft,
        },
      });
    }

    // 4. Pick the best next question
    const bestQ = selectBestQuestion(newCandidates, newAskedIds);
    const persona = getPersona(confidence, questionsLeft);

    // 5. Grok rephrases the question
    const naturalQuestion = await getNextQuestion({
      candidates: newCandidates.map(c => c.name),
      askedQuestions: newHistory,
      suggestedQuestion: bestQ.text,
      persona,
      questionsLeft,
    });

    return NextResponse.json({
      action: 'continue',
      question: { ...bestQ, display: naturalQuestion },
      candidates: newCandidates.length,
      confidence,
      persona,
      personaMessage: getPersonaMessage(persona),
      questionsLeft,
      gameState: {
        ...gameState,
        candidates: newCandidates,
        askedIds: newAskedIds,
        history: newHistory,
        questionsLeft,
      },
    });
  } catch (error) {
    console.error('Answer error:', error);
    return NextResponse.json({ error: 'Failed to process answer' }, { status: 500 });
  }
}
