import { NextResponse } from 'next/server';
import { selectBestQuestion } from '@/lib/engine/entropy';
import { getPersona, getPersonaMessage } from '@/lib/engine/persona';
import { rephraseQuestion } from '@/lib/grok/client';
import { players } from '@/lib/db/seed/ipl-data';

const MAX_QUESTIONS = 20;

export async function POST() {
  try {
    const allCandidates = players;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const firstQuestion = selectBestQuestion(allCandidates, []);
    const persona = getPersona(5, MAX_QUESTIONS);

    const displayQuestion = await rephraseQuestion(firstQuestion.text, persona);

    return NextResponse.json({
      sessionId,
      question: { ...firstQuestion, display: displayQuestion },
      totalCandidates: allCandidates.length,
      candidates: allCandidates.length,
      confidence: 5,
      persona,
      personaMessage: getPersonaMessage(persona),
      questionsLeft: MAX_QUESTIONS,
      gameState: {
        candidates: allCandidates,
        totalCandidates: allCandidates.length,
        askedIds: [firstQuestion.id],
        history: [],
        answeredQuestions: [],
        questionsLeft: MAX_QUESTIONS,
        dontKnowCount: 0,
      },
    });
  } catch (error) {
    console.error('Game start error:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}
