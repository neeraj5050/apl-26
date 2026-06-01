import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongoose';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, guessedPlayer, wasCorrect, questionsAsked, confidence, actualPlayer, history, persona } = await req.json();

    // Try to persist feedback to MongoDB
    try {
      const db = await connectDB();
      if (db.connection.readyState === 1) {
        const Game = (await import('@/lib/db/models/Game')).default;
        
        if (sessionId) {
          await Game.findOneAndUpdate(
            { sessionId } as any, // eslint-disable-line
            {
              $set: {
                guessedCorrectly: wasCorrect,
                actualPlayer: actualPlayer || undefined,
                finalConfidence: confidence,
              },
            } as any, // eslint-disable-line
            { upsert: false }
          );
        } else {
          await Game.create({
            sessionId: `feedback_${Date.now()}`,
            guessedPlayer,
            guessedCorrectly: wasCorrect,
            actualPlayer: actualPlayer || undefined,
            questionsAsked,
            questionHistory: history || [],
            finalConfidence: confidence,
            persona: persona || 'neutral',
            duration: 0,
            target: guessedPlayer,
            targetType: 'player',
          } as any); // eslint-disable-line
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB not available for feedback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: wasCorrect
        ? `🎉 Aki guessed it right in ${questionsAsked} questions!`
        : '😅 Better luck next time! The answer was hidden well.',
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to log feedback' }, { status: 500 });
  }
}
