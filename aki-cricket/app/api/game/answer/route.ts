import { NextRequest, NextResponse } from 'next/server';
import { filterCandidates, selectBestQuestion, calculateConfidence, rankCandidates } from '@/lib/engine/entropy';
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

    // Update history (both formats for compatibility)
    const newHistory = [
      ...gameState.history,
      { q: currentQuestion.text, a: answer },
    ];
    const newAskedIds = [...gameState.askedIds, currentQuestion.id];
    
    // Track answered questions with their IDs for invalidation
    const newAnsweredQuestions = [
      ...(gameState.answeredQuestions || []),
      { questionId: currentQuestion.id, answer },
    ];

    // 3. Rank candidates by how well they match all answers so far
    const rankedCandidates = rankCandidates(newCandidates, newAnsweredQuestions);

    // 4. Should we guess now?
    const questionsAsked = 15 - questionsLeft;
    const minQuestionsReached = questionsAsked >= 7;
    const shouldGuess =
      questionsLeft <= 0 || // out of questions — must guess
      (rankedCandidates.length <= 1 && minQuestionsReached) || // only 1 left AND enough questions
      (rankedCandidates.length <= 2 && questionsAsked >= 10) || // 2 left with many questions
      (rankedCandidates.length <= 3 && questionsAsked >= 13); // 3 left near end

    if (shouldGuess) {
      // Use RANKED candidates — best match first
      const topGuess = rankedCandidates[0]?.name || 'Unknown Player';
      const topCandidates = rankedCandidates.slice(0, 3).map(c => c.name);
      const guessConfidence = rankedCandidates.length <= 1 ? 99 : rankedCandidates.length <= 2 ? 88 : 75;
      const persona = guessConfidence >= 80 ? 'hype' : 'panic';

      const guessMessage = await getFinalGuess({
        topCandidates: topCandidates.length > 0 ? topCandidates : [topGuess],
        questionsAsked: newHistory,
        persona,
      });

      return NextResponse.json({
        action: 'guess',
        topGuess,
        topCandidates,
        confidence: guessConfidence,
        guessMessage,
        persona,
        personaMessage: getPersonaMessage(persona as 'hype' | 'panic'),
        questionsAsked: newHistory.length,
        gameState: {
          ...gameState,
          candidates: rankedCandidates,
          askedIds: newAskedIds,
          history: newHistory,
          answeredQuestions: newAnsweredQuestions,
          questionsLeft,
        },
      });
    }

    // 5. Pick the best next question (with invalidation awareness)
    const bestQ = selectBestQuestion(rankedCandidates, newAskedIds, newAnsweredQuestions);
    const persona = getPersona(confidence, questionsLeft);

    // 6. Grok rephrases the question
    const naturalQuestion = await getNextQuestion({
      candidates: rankedCandidates.slice(0, 10).map(c => c.name),
      askedQuestions: newHistory,
      suggestedQuestion: bestQ.text,
      persona,
      questionsLeft,
    });

    return NextResponse.json({
      action: 'continue',
      question: { ...bestQ, display: naturalQuestion },
      candidates: rankedCandidates.length,
      confidence,
      persona,
      personaMessage: getPersonaMessage(persona),
      questionsLeft,
      gameState: {
        ...gameState,
        candidates: rankedCandidates,
        askedIds: newAskedIds,
        history: newHistory,
        answeredQuestions: newAnsweredQuestions,
        questionsLeft,
      },
    });
  } catch (error) {
    console.error('Answer error:', error);
    return NextResponse.json({ error: 'Failed to process answer' }, { status: 500 });
  }
}
