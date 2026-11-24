"use client";

import { useSoundStore } from "@/lib/sound-store";

type SoundName = "rustle" | "thud" | "flip";

const SOURCES: Record<SoundName, { src: string; volume: number }> = {
  rustle: { src: "/audio/paper-rustle.wav", volume: 0.5 },
  thud: { src: "/audio/stamp-thud.wav", volume: 0.85 },
  flip: { src: "/audio/paper-flip.wav", volume: 0.55 },
};

const elements = new Map<SoundName, HTMLAudioElement>();
let lastRustle = 0;

export function playSound(name: SoundName, opts?: { volume?: number }) {
  if (typeof window === "undefined") return;
  if (!useSoundStore.getState().enabled) return;

  // rate-limit rustle so hover storms don't stack noise
  if (name === "rustle") {
    const now = Date.now();
    if (now - lastRustle < 650) return;
    lastRustle = now;
  }

  const conf = SOURCES[name];
  let base = elements.get(name);
  if (!base) {
    base = new Audio(conf.src);
    base.preload = "auto";
    elements.set(name, base);
  }

  // clone so overlapping triggers play independently
  const node = base.cloneNode() as HTMLAudioElement;
  node.volume = opts?.volume ?? conf.volume;
  node.play().catch(() => {
    /* autoplay restrictions before first user gesture */
  });
}

export function isSoundEnabled() {
  return useSoundStore.getState().enabled;
}
