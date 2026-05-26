import { NextResponse } from 'next/server';

// In-memory leaderboard for now (MongoDB integration later)
const leaderboardData = [
  { rank: 1, name: "CricketFan2024", wins: 42, avgQuestions: 8.3, streak: 12 },
  { rank: 2, name: "IPLGuru", wins: 38, avgQuestions: 9.1, streak: 8 },
  { rank: 3, name: "ThalaForever", wins: 35, avgQuestions: 7.5, streak: 15 },
  { rank: 4, name: "BumrahFan", wins: 31, avgQuestions: 10.2, streak: 5 },
  { rank: 5, name: "KingKohli18", wins: 28, avgQuestions: 8.8, streak: 7 },
  { rank: 6, name: "MSDian07", wins: 25, avgQuestions: 9.5, streak: 4 },
  { rank: 7, name: "CricketNerd", wins: 22, avgQuestions: 11.0, streak: 3 },
  { rank: 8, name: "StumpMaster", wins: 20, avgQuestions: 8.0, streak: 6 },
  { rank: 9, name: "SixerKing", wins: 18, avgQuestions: 12.1, streak: 2 },
  { rank: 10, name: "SpinWizard", wins: 15, avgQuestions: 9.7, streak: 1 },
];

export async function GET() {
  return NextResponse.json({
    leaderboard: leaderboardData,
    hardestPlayers: [
      { name: "Jitesh Sharma", avgQuestions: 14.2 },
      { name: "Venkatesh Iyer", avgQuestions: 13.8 },
      { name: "Devdutt Padikkal", avgQuestions: 13.1 },
    ],
  });
}
