import { legendsAndStars } from './players-legends-stars';
import { regularsAndFringe } from './players-regulars';

// Re-export the helper for any seed scripts that need it
export { p } from './player-helper';

// Combined player database — 150+ players
export const players = [...legendsAndStars, ...regularsAndFringe];
