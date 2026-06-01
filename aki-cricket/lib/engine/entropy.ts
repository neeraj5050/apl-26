import { QUESTION_BANK, Question } from './questions';

export type PlayerCandidate = Record<string, any>; // eslint-disable-line
export type Answer = 'yes' | 'no' | 'maybe' | 'dont_know';

/**
 * Check if a candidate matches a question's expected answer.
 * Handles boolean attributes, string comparisons, and array lookups.
 */
export function matchesQuestion(candidate: PlayerCandidate, question: Question): boolean {
  const value = candidate[question.attribute];
  if (value === undefined || value === null) return false;

  // String comparison (country, currentTeam, ageGroup, tier)
  if (question.expectedValue) {
    if (Array.isArray(value)) {
      return value.some(v => v === question.expectedValue);
    }
    return String(value) === question.expectedValue;
  }

  // Boolean attribute
  if (typeof value === 'boolean') return value;
  return String(value) === 'true';
}

/**
 * Get invalidated question IDs based on answered questions
 */
function getInvalidatedIds(
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
 * Shannon entropy for a binary split. Max = 1.0 at 50/50.
 */
function shannonEntropy(pYes: number): number {
  if (pYes <= 0 || pYes >= 1) return 0;
  const pNo = 1 - pYes;
  return -pYes * Math.log2(pYes) - pNo * Math.log2(pNo);
}

/**
 * Category priority weights — questions from certain categories
 * are slightly boosted early game to create a natural flow.
 */
const CATEGORY_PRIORITY: Record<string, number> = {
  role: 1.15,
  country: 1.10,
  batting: 1.05,
  bowling: 1.05,
  career: 1.0,
  team: 0.95,
  profile: 1.0,
};

/**
 * Select the best question using Shannon entropy (information gain).
 * Skips asked and invalidated questions.
 * Applies category priority weights for better question flow.
 */
export function selectBestQuestion(
  candidates: PlayerCandidate[],
  askedIds: string[],
  answeredQuestions?: { questionId: string; answer: string }[]
): Question {
  const invalidated = answeredQuestions
    ? getInvalidatedIds(answeredQuestions)
    : new Set<string>();

  const remaining = QUESTION_BANK.filter(
    q => !askedIds.includes(q.id) && !invalidated.has(q.id)
  );

  if (remaining.length === 0) {
    const anyRemaining = QUESTION_BANK.filter(q => !askedIds.includes(q.id));
    return anyRemaining[0] || QUESTION_BANK[0];
  }

  let bestQuestion = remaining[0];
  let bestScore = -1;

  // Apply diminishing category boosts as more questions are asked
  const boostDecay = Math.max(0.3, 1 - askedIds.length * 0.06);

  for (const question of remaining) {
    const yesCount = candidates.filter(c => matchesQuestion(c, question)).length;
    const total = candidates.length;
    if (total === 0) continue;
    if (yesCount === 0 || yesCount === total) continue;

    const entropy = shannonEntropy(yesCount / total);
    const catWeight = 1 + (((CATEGORY_PRIORITY[question.category] || 1) - 1) * boostDecay);
    const score = entropy * catWeight;

    if (score > bestScore) {
      bestScore = score;
      bestQuestion = question;
    }
  }

  return bestQuestion;
}

/**
 * Score a single player against the full answer history.
 * Weighted scoring:
 *   yes match    = +1.0
 *   no match     = +1.0
 *   maybe match  = +0.5 (weighted uncertainty)
 *   maybe miss   = +0.3 (soft penalty)
 *   dont_know    = +0.0 (skip entirely, neutral)
 *   contradiction = -2.0 (hard penalty)
 */
export function scorePlayer(
  candidate: PlayerCandidate,
  answerHistory: { questionId: string; answer: string }[]
): number {
  if (answerHistory.length === 0) return 0.5;

  let score = 0;
  let maxScore = 0;

  for (const entry of answerHistory) {
    const question = QUESTION_BANK.find(q => q.id === entry.questionId);
    if (!question) continue;

    const matches = matchesQuestion(candidate, question);

    // dont_know contributes nothing — fully neutral
    if (entry.answer === 'dont_know') continue;

    maxScore += 1;

    if (entry.answer === 'yes') {
      score += matches ? 1.0 : -2.0;
    } else if (entry.answer === 'no') {
      score += matches ? -2.0 : 1.0;
    } else if (entry.answer === 'maybe') {
      // Weighted maybe: slight positive if matches, slight positive if not
      score += matches ? 0.5 : 0.3;
    }
  }

  return maxScore > 0 ? Math.max(0, score / maxScore) : 0.5;
}

/**
 * Filter candidates based on a single answer.
 * "maybe" keeps all but slightly deprioritizes non-matches.
 * "dont_know" keeps all candidates unchanged.
 */
export function filterCandidates(
  candidates: PlayerCandidate[],
  question: Question,
  answer: Answer
): PlayerCandidate[] {
  if (answer === 'dont_know') return candidates;

  // For "maybe", keep all candidates (ranking handles the soft signal)
  if (answer === 'maybe') return candidates;

  const filtered = candidates.filter(c => {
    const matches = matchesQuestion(c, question);
    return answer === 'yes' ? matches : !matches;
  });

  // Safety: never filter to zero — keep at least 5
  if (filtered.length === 0) {
    return candidates.slice(0, Math.min(5, candidates.length));
  }
  return filtered;
}

/**
 * Rank candidates by match score against all answer history (best first).
 */
export function rankCandidates(
  candidates: PlayerCandidate[],
  answerHistory: { questionId: string; answer: string }[]
): PlayerCandidate[] {
  if (answerHistory.length === 0) return candidates;

  const scored = candidates
    .map(candidate => ({ candidate, score: scorePlayer(candidate, answerHistory) }))
    .sort((a, b) => b.score - a.score);

  // Hard cutoff: only keep above 30% score, minimum 5
  const threshold = 0.3;
  const filtered = scored.filter(s => s.score >= threshold);
  const result = filtered.length >= 5 ? filtered : scored.slice(0, Math.max(5, filtered.length));

  return result.map(s => s.candidate);
}

/**
 * Calculate confidence percentage with dramatic curve.
 */
export function calculateConfidence(remaining: number, total: number): number {
  if (remaining <= 1) return 99;
  if (remaining <= 2) return 88;
  if (remaining <= 3) return 75;
  if (remaining <= 5) return 62;
  if (remaining <= 8) return 48;
  if (remaining <= 12) return 35;
  if (remaining <= 20) return 25;
  const ratio = 1 - remaining / total;
  return Math.min(50, Math.max(5, Math.round(ratio * 60 + 5)));
}
