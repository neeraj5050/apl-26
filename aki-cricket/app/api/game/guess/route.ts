import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, correct, guessedPlayer, questionsAsked, confidence, playerName, history, persona } = await req.json();

    // Try to persist to MongoDB if available
    try {
      const db = await connectDB();
      if (db.connection.readyState === 1) {
        const Game = (await import('@/lib/db/models/Game')).default;
        await Game.create({
          sessionId: sessionId || `game_${Date.now()}`,
          playerName: playerName || 'Anonymous',
          guessedPlayer,
          guessedCorrectly: correct,
          questionsAsked,
          questionHistory: history || [],
          finalConfidence: confidence,
          persona: persona || 'neutral',
          duration: 0,
          target: guessedPlayer,
          targetType: 'player',
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      }
    } catch (dbErr) {
      console.warn('MongoDB not available, skipping persistence:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: correct
        ? `🎉 Aki guessed it right in ${questionsAsked} questions!`
        : `😅 Better luck next time! The answer was hidden well.`,
    });
  } catch (error) {
    console.error('Guess confirmation error:', error);
    return NextResponse.json({ error: 'Failed to log result' }, { status: 500 });
  }
}
