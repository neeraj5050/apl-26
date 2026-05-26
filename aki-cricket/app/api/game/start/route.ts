import { NextResponse } from 'next/server';
import { selectBestQuestion } from '@/lib/engine/entropy';
import { getPersona, getPersonaMessage } from '@/lib/engine/persona';
import { getNextQuestion } from '@/lib/grok/client';
import { players } from '@/lib/db/seed/ipl-data';

export async function POST() {
  try {
    // Use in-memory seed data (works without MongoDB)
    const allCandidates = players;
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Select the first question using entropy
    const firstQuestion = selectBestQuestion(allCandidates, []);
    const persona = getPersona(5, 15);

    // Try to get Grok to rephrase
    const displayQuestion = await getNextQuestion({
      candidates: allCandidates.map(c => c.name),
      askedQuestions: [],
      suggestedQuestion: firstQuestion.text,
      persona,
      questionsLeft: 15,
    });

    return NextResponse.json({
      sessionId,
      question: {
        ...firstQuestion,
        display: displayQuestion,
      },
      totalCandidates: allCandidates.length,
      candidates: allCandidates.length,
      confidence: 5,
      persona,
      personaMessage: getPersonaMessage(persona),
      questionsLeft: 15,
      gameState: {
        candidates: allCandidates,
        totalCandidates: allCandidates.length,
        askedIds: [firstQuestion.id],
        history: [],
        questionsLeft: 15,
      },
    });
  } catch (error) {
    console.error('Game start error:', error);
    return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
  }
}
