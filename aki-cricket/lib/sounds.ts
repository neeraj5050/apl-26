'use client';

// Sound system — lazy-loaded to avoid SSR issues
// Sounds will play when real audio files are placed in /public/sounds/

let soundsInitialized = false;
let muted = false;

interface SoundMap {
  [key: string]: { play: () => void; stop: () => void; volume: (v: number) => void };
}

const soundInstances: SoundMap = {};

const SOUND_CONFIG = {
  question_pop:  { src: '/sounds/pop.mp3', volume: 0.5 },
  yes_click:     { src: '/sounds/yes.mp3', volume: 0.6 },
  no_click:      { src: '/sounds/no.mp3', volume: 0.6 },
  confidence_up: { src: '/sounds/level-up.mp3', volume: 0.4 },
  win_cheer:     { src: '/sounds/stadium-cheer.mp3', volume: 0.8 },
  ai_thinking:   { src: '/sounds/processing.mp3', volume: 0.3 },
};

async function initSounds() {
  if (soundsInitialized || typeof window === 'undefined') return;

  try {
    const { Howl } = await import('howler');
    for (const [key, config] of Object.entries(SOUND_CONFIG)) {
      try {
        soundInstances[key] = new Howl({
          src: [config.src],
          volume: config.volume,
          preload: false,
        });
      } catch {
        // Sound file doesn't exist yet — that's OK
      }
    }
    soundsInitialized = true;
  } catch {
    // Howler not available
  }
}

export function playSound(name: keyof typeof SOUND_CONFIG) {
  if (muted) return;
  initSounds().then(() => {
    soundInstances[name]?.play();
  });
}

export function stopSound(name: keyof typeof SOUND_CONFIG) {
  soundInstances[name]?.stop();
}

export function toggleMute(): boolean {
  muted = !muted;
  return muted;
}

export function isMuted(): boolean {
  return muted;
}
