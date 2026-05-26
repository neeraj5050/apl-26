import OpenAI from 'openai';

const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY || 'dummy-key',
  baseURL: 'https://api.x.ai/v1',
});

const PERSONA_PROMPTS: Record<string, string> = {
  confident: "You are cockily confident. Be playful and slightly smug. Use cricket emojis.",
  neutral:   "You are focused and strategic. Be curious and methodical.",
  panic:     "You are running out of questions and getting nervous. Show it subtly.",
  hype:      "You just had a revelation. Be hyped and dramatic about it.",
  surprised: "You are surprised by the player's answer. Show genuine surprise.",
};

export async function getNextQuestion(params: {
  candidates: string[];
  askedQuestions: { q: string; a: string }[];
  suggestedQuestion: string;
  persona: string;
  questionsLeft: number;
}): Promise<string> {
  // Fallback if no API key
  if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'xai-your-api-key-here') {
    return params.suggestedQuestion;
  }

  try {
    const prompt = `You are Aki, an AI cricket expert playing an Akinator-style IPL guessing game.

Remaining possible players: ${params.candidates.slice(0, 10).join(', ')}${params.candidates.length > 10 ? ` ... and ${params.candidates.length - 10} more` : ''}

Questions asked so far:
${params.askedQuestions.map((q, i) => `${i + 1}. "${q.q}" → ${q.a}`).join('\n') || 'None yet'}

Questions remaining: ${params.questionsLeft}

Personality: ${PERSONA_PROMPTS[params.persona] || PERSONA_PROMPTS.neutral}

Your next strategic question should be about: "${params.suggestedQuestion}"

Rephrase that question naturally in your current personality.
One sentence only. Make it feel human and fun.
Return ONLY the question text, nothing else.`;

    const response = await grok.chat.completions.create({
      model: 'grok-4.3',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || params.suggestedQuestion;
  } catch (error) {
    console.error('Grok API error:', error);
    return params.suggestedQuestion;
  }
}

export async function getFinalGuess(params: {
  topCandidates: string[];
  questionsAsked: { q: string; a: string }[];
  persona: string;
}): Promise<string> {
  if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'xai-your-api-key-here') {
    return `I think you're thinking of... ${params.topCandidates[0]}! 🏏`;
  }

  try {
    const prompt = `You are Aki, making your final IPL guess.
Top candidates: ${params.topCandidates.join(', ')}
Based on all answers, your best guess is: ${params.topCandidates[0]}

Persona: ${params.persona === 'hype' ? 'Dramatic and confident reveal' : 'Nervous but committing to a guess'}

Write ONE dramatic reveal sentence. Include the player name.
Example: "I see it now... you were thinking of MS Dhoni! 🏏"
Return ONLY the reveal sentence.`;

    const response = await grok.chat.completions.create({
      model: 'grok-4.3',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 80,
    });

    return response.choices[0].message.content?.trim() || `My guess is ${params.topCandidates[0]}! 🏏`;
  } catch {
    return `I think you're thinking of... ${params.topCandidates[0]}! 🏏`;
  }
}
