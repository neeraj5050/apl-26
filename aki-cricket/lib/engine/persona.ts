export type Persona = 'neutral' | 'confident' | 'panic' | 'hype' | 'surprised';

export function getPersona(confidence: number, questionsLeft: number): Persona {
  if (questionsLeft <= 2)  return 'panic';
  if (confidence >= 85)    return 'hype';
  if (confidence >= 65)    return 'confident';
  if (confidence >= 40)    return 'neutral';
  return 'neutral';
}

export const PERSONA_MESSAGES: Record<Persona, string[]> = {
  neutral: [
    "Interesting... let me think. 🤔",
    "Hmm, narrowing it down...",
    "Processing the clues... 🏏",
    "Let me analyze this further...",
    "Good answer. I'm working on it.",
  ],
  confident: [
    "Oh this is getting too easy 😏",
    "I already have a feeling...",
    "Classic choice 😎",
    "I'm getting closer, I can feel it!",
    "Your player can't hide much longer...",
  ],
  panic: [
    "Wait... this could still be multiple... 😰",
    "Give me a moment... 🤔",
    "Hmm, this is trickier than I thought...",
    "Running out of time... need to focus!",
    "Okay, deep breath. Let me think... 💭",
  ],
  hype: [
    "NO WAY. I think I've got it! 🔥",
    "WAIT. I SEE IT NOW. 👁️",
    "It's coming to me... this has to be...",
    "I can almost taste the answer! 🏆",
    "OH. OH. I know this one! 🎯",
  ],
  surprised: [
    "Okay you're good at this... 👏",
    "Didn't see that coming!",
    "Bold pick! Respect. 🫡",
    "That's an unusual combo of answers...",
    "You're keeping me on my toes!",
  ],
};

export function getPersonaMessage(persona: Persona): string {
  const msgs = PERSONA_MESSAGES[persona];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

export function getPersonaEmoji(persona: Persona): string {
  const emojiMap: Record<Persona, string> = {
    neutral:   '🤖',
    confident: '😎',
    panic:     '😰',
    hype:      '🔥',
    surprised: '😮',
  };
  return emojiMap[persona];
}
