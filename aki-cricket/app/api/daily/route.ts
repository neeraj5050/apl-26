import { NextResponse } from 'next/server';
import { players } from '@/lib/db/seed/ipl-data';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((a, b) => a + parseInt(b), 0);
    const activePlayers = players.filter(p => (p as any).active);
    const dailyPlayer = activePlayers[seed % activePlayers.length];

    return NextResponse.json({
      date: today,
      hint: `Today's mystery player plays for ${dailyPlayer.currentTeam}`,
      entityType: dailyPlayer.type,
    });
  } catch (error) {
    console.error('Daily challenge error:', error);
    return NextResponse.json({ error: 'Failed to load daily challenge' }, { status: 500 });
  }
}
