import { QUESTION_BANK, Question } from './questions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlayerCandidate = Record<string, any>;

export function matchesQuestion(candidate: PlayerCandidate, question: Question): boolean {
  const attr = question.attribute;
  const value = candidate[attr];
  const expected = question.expectedTrue;

  // Handle negation (e.g., "!India" means country !== India)
  if (expected.startsWith('!')) {
    const negated = expected.slice(1);
    if (Array.isArray(value)) return !value.includes(negated);
    return String(value) !== negated;
  }

  // Handle array attributes (e.g., teams)
  if (Array.isArray(value)) {
    return value.includes(expected);
  }

  // Handle boolean and string comparison
  return String(value) === expected;
}

export function selectBestQuestion(
  candidates: PlayerCandidate[],
  askedIds: string[]
): Question {
  const remaining = QUESTION_BANK.filter(q => !askedIds.includes(q.id));

  if (remaining.length === 0) {
    return QUESTION_BANK[0]; // fallback
  }

  let bestQuestion = remaining[0];
  let bestEntropy = -1;

  for (const question of remaining) {
    const yesCount = candidates.filter(c => matchesQuestion(c, question)).length;
    const total = candidates.length;

    if (total === 0) continue;

    const pYes = yesCount / total;
    const pNo = 1 - pYes;

    // Calculate Shannon entropy
    let entropy = 0;
    if (pYes > 0 && pYes < 1) {
      entropy = -pYes * Math.log2(pYes) - pNo * Math.log2(pNo);
    }

    // Higher entropy = better question (closer to 50/50 split)
    if (entropy > bestEntropy) {
      bestEntropy = entropy;
      bestQuestion = question;
    }
  }

  return bestQuestion;
}

export function filterCandidates(
  candidates: PlayerCandidate[],
  question: Question,
  answer: 'yes' | 'no' | 'maybe'
): PlayerCandidate[] {
  if (answer === 'maybe') return candidates;

  return candidates.filter(c => {
    const matches = matchesQuestion(c, question);
    return answer === 'yes' ? matches : !matches;
  });
}

export function calculateConfidence(
  remaining: number,
  total: number
): number {
  if (remaining <= 1) return 99;
  if (remaining <= 2) return 90;
  if (remaining <= 3) return 80;
  const ratio = 1 - remaining / total;
  return Math.min(99, Math.max(5, Math.round(ratio * 100 + 10)));
}
