import { QUESTION_BANK, Question } from './questions';

export type PlayerCandidate = Record<string, any>; // eslint-disable-line

/**
 * Check if a candidate matches a question's expected answer
 */
export function matchesQuestion(candidate: PlayerCandidate, question: Question): boolean {
  const attr = question.attribute;
  const value = candidate[attr];
  const expected = question.expectedTrue;

  // Handle undefined values — treat as "no"
  if (value === undefined || value === null) return false;

  // Handle negation (e.g., "!India")
  if (expected.startsWith('!')) {
    const negated = expected.slice(1);
    if (Array.isArray(value)) return !value.includes(negated);
    return String(value) !== negated;
  }

  // Handle array attributes (e.g., teams)
  if (Array.isArray(value)) {
    // Also check partial matches for team name variations
    // e.g., "Delhi Capitals" should match if player has "Delhi Daredevils" too
    return value.some(v => {
      if (v === expected) return true;
      // Handle Delhi Capitals / Delhi Daredevils equivalence
      if (expected === 'Delhi Capitals' && v === 'Delhi Daredevils') return true;
      if (expected === 'Delhi Daredevils' && v === 'Delhi Capitals') return true;
      return false;
    });
  }

  // Handle boolean and string comparison
  return String(value) === expected;
}

/**
 * Get invalidated question IDs based on answered questions
 */
function getInvalidatedIds(
  askedIds: string[],
  answeredQuestions: { questionId: string; answer: string }[]
): Set<string> {
  const invalidated = new Set<string>();
  
  for (const answered of answeredQuestions) {
    const question = QUESTION_BANK.find(q => q.id === answered.questionId);
    if (!question?.invalidates) continue;
    
    if (answered.answer === question.invalidates.answer) {
      question.invalidates.questionIds.forEach(id => invalidated.add(id));
    }
  }
  
  return invalidated;
}

/**
 * Select the best question using Shannon entropy (information gain).
 * Skips questions that have been asked OR invalidated by previous answers.
 */
export function selectBestQuestion(
  candidates: PlayerCandidate[],
  askedIds: string[],
  answeredQuestions?: { questionId: string; answer: string }[]
): Question {
  // Get invalidated questions from previous answers
  const invalidated = answeredQuestions 
    ? getInvalidatedIds(askedIds, answeredQuestions)
    : new Set<string>();
  
  // Filter out asked AND invalidated questions
  const remaining = QUESTION_BANK.filter(
    q => !askedIds.includes(q.id) && !invalidated.has(q.id)
  );

  if (remaining.length === 0) {
    // All questions exhausted, return any unasked question
    const anyRemaining = QUESTION_BANK.filter(q => !askedIds.includes(q.id));
    return anyRemaining[0] || QUESTION_BANK[0];
  }

  let bestQuestion = remaining[0];
  let bestEntropy = -1;

  for (const question of remaining) {
    const yesCount = candidates.filter(c => matchesQuestion(c, question)).length;
    const total = candidates.length;

    if (total === 0) continue;

    // Skip questions that give no information (all yes or all no)
    if (yesCount === 0 || yesCount === total) continue;

    const pYes = yesCount / total;
    const pNo = 1 - pYes;

    // Shannon entropy: maximum at 50/50 split = 1.0
    const entropy = -pYes * Math.log2(pYes) - pNo * Math.log2(pNo);

    if (entropy > bestEntropy) {
      bestEntropy = entropy;
      bestQuestion = question;
    }
  }

  return bestQuestion;
}

/**
 * Filter candidates based on the player's answer.
 * "maybe" keeps all candidates (no filtering).
 */
export function filterCandidates(
  candidates: PlayerCandidate[],
  question: Question,
  answer: 'yes' | 'no' | 'maybe'
): PlayerCandidate[] {
  if (answer === 'maybe') return candidates;

  const filtered = candidates.filter(c => {
    const matches = matchesQuestion(c, question);
    return answer === 'yes' ? matches : !matches;
  });

  // Safety: never filter to zero candidates — keep at least top 3
  if (filtered.length === 0) {
    return candidates.slice(0, Math.min(3, candidates.length));
  }

  return filtered;
}

/**
 * Calculate confidence percentage based on remaining candidates.
 * Curve is designed to build gradually for a dramatic experience.
 */
export function calculateConfidence(
  remaining: number,
  total: number
): number {
  if (remaining <= 1) return 99;
  if (remaining <= 2) return 88;
  if (remaining <= 3) return 75;
  if (remaining <= 5) return 62;
  if (remaining <= 8) return 48;
  if (remaining <= 12) return 35;
  // Gradual curve
  const ratio = 1 - remaining / total;
  return Math.min(50, Math.max(5, Math.round(ratio * 60 + 5)));
}

/**
 * Score each remaining candidate by how well they match the answer history.
 * Returns candidates sorted by match score (best first).
 */
export function rankCandidates(
  candidates: PlayerCandidate[],
  answerHistory: { questionId: string; answer: string }[]
): PlayerCandidate[] {
  if (answerHistory.length === 0) return candidates;

  const scored = candidates.map(candidate => {
    let score = 0;
    for (const entry of answerHistory) {
      const question = QUESTION_BANK.find(q => q.id === entry.questionId);
      if (!question) continue;
      
      const matches = matchesQuestion(candidate, question);
      if ((entry.answer === 'yes' && matches) || (entry.answer === 'no' && !matches)) {
        score += 1; // correct match
      } else if (entry.answer !== 'maybe') {
        score -= 2; // contradiction penalized more heavily
      }
    }
    return { candidate, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.candidate);
}
