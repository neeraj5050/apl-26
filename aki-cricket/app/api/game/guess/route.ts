import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { correct, guessedPlayer, questionsAsked, confidence, playerName } = await req.json();

    // Log the game result (in-memory for now, MongoDB later)
    const result = {
      id: `game_${Date.now()}`,
      playerName: playerName || 'Anonymous',
      guessedPlayer,
      correct,
      questionsAsked,
      confidence,
      timestamp: new Date().toISOString(),
    };

    console.log('Game result:', result);

    return NextResponse.json({
      success: true,
      result,
      message: correct
        ? `🎉 Aki guessed it right in ${questionsAsked} questions!`
        : `😅 Better luck next time! The answer was hidden well.`,
    });
  } catch (error) {
    console.error('Guess confirmation error:', error);
    return NextResponse.json({ error: 'Failed to log result' }, { status: 500 });
  }
}
