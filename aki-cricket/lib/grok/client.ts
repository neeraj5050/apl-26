import OpenAI from 'openai';

const grok = new OpenAI({
  apiKey: process.env.GROK_API_KEY || 'dummy-key',
  baseURL: 'https://api.x.ai/v1',
});

const PERSONA_PROMPTS: Record<string, string> = {
  neutral:   "You are Aki, a curious IPL cricket oracle. Rephrase in an engaging, cricket-flavored way.",
  confident: "You are Aki, smugly confident. Rephrase with a cocky, playful tone. Use cricket slang.",
  panic:     "You are Aki, running out of time! Rephrase desperately, with urgency.",
  hype:      "You are Aki, absolutely HYPE. Use emojis, uppercase, and pure excitement.",
  surprised: "You are Aki, totally shocked. Rephrase with disbelief and cricket metaphors.",
};

export async function rephraseQuestion(
  baseQuestion: string,
  persona: string
): Promise<string> {
  if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'xai-your-api-key-here') {
    return baseQuestion;
  }

  try {
    const response = await grok.chat.completions.create({
      model: 'grok-3-mini',
      messages: [
        {
          role: 'system',
          content: `${PERSONA_PROMPTS[persona] ?? PERSONA_PROMPTS.neutral} Keep it under 15 words. End with a 🏏 emoji. Do NOT change the meaning of the question.`
        },
        { role: 'user', content: `Original: "${baseQuestion}"\nRephrased:` }
      ],
      max_tokens: 80,
      temperature: 0.7,
    });
    return response.choices[0].message.content?.trim() || baseQuestion;
  } catch (error) {
    console.error('Grok rephrase error:', error);
    return baseQuestion;
  }
}

export async function generateGuessNarration(
  playerName: string,
  confidence: number,
  persona: string,
  questionsAsked?: number
): Promise<string> {
  if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'xai-your-api-key-here') {
    return confidence >= 80
      ? `I KNEW IT! It's ${playerName}! 🏏🔥`
      : `I'm going with my gut... ${playerName}? 😰`;
  }

  try {
    const qInfo = questionsAsked ? ` after ${questionsAsked} questions` : '';
    const response = await grok.chat.completions.create({
      model: 'grok-3-mini',
      messages: [{
        role: 'user',
        content: `Aki the cricket oracle is about to guess "${playerName}" with ${confidence}% confidence${qInfo}.
Persona: ${persona === 'hype' ? 'Dramatic and confident reveal' : 'Nervous but committed'}.
Write ONE dramatic reveal sentence with the player name. Cricket references only. Return ONLY the sentence.`
      }],
      max_tokens: 80,
    });
    return response.choices[0].message.content?.trim() || `My guess is ${playerName}! 🏏`;
  } catch {
    return `I think you're thinking of... ${playerName}! 🏏`;
  }
}
