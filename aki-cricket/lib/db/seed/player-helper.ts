// Helper to create player objects concisely
const roleMap = { B: 'batsman', W: 'bowler', A: 'allrounder', K: 'wicketkeeper' } as const;

function b(bits: string) {
  const keys = [
    'isIndian','active','leftHanded','isOpener','isFinisher','isAnchor',
    'isFastBowler','isSpinner','isMediumPacer','isLeftArmBowler',
    'captainedTeam','isCaptain','hasWonIPL','hasOrangeCap','hasPurpleCap','isMVP','isIcon',
    'strikeRateAbove140','economyBelow8','has50s','has100s','hasFifer','isRetired','hasPlayedWorldCup'
  ];
  const obj: Record<string,boolean> = {};
  for (let i = 0; i < keys.length; i++) obj[keys[i]] = bits[i] === '1';
  return obj;
}

export function p(
  name: string, country: string, role: 'B'|'W'|'A'|'K', currentTeam: string,
  teams: string[], tier: 'legend'|'star'|'regular'|'fringe', ageGroup: 'u25'|'25-30'|'30-35'|'35+',
  bits: string, bowlStyle: 'fast'|'medium'|'spin'|'none', debutYear: number, tags: string[]
) {
  const fullRole = roleMap[role];
  const bools = b(bits);
  return {
    name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), type: 'player' as const,
    country, role: fullRole, currentTeam, teams, tier, ageGroup, bowlingStyle: bowlStyle, debutYear, tags,
    isBatsman: fullRole === 'batsman', isBowler: fullRole === 'bowler',
    isAllrounder: fullRole === 'allrounder', isWicketkeeper: fullRole === 'wicketkeeper',
    ...bools,
    guessedCorrectlyCount: 0, guessedWrongCount: 0, averageQuestionsToGuess: 0,
  };
}
