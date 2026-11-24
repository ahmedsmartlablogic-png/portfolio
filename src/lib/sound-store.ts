"use client";

import { create } from "zustand";

interface SoundStore {
  enabled: boolean;
  hydrated: boolean;
  setEnabled: (v: boolean) => void;
  toggle: () => void;
  hydrate: () => void;
}

export const useSoundStore = create<SoundStore>((set, get) => ({
  enabled: true,
  hydrated: false,
  setEnabled: (v) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mystery-sound", v ? "1" : "0");
      } catch {
        /* private mode */
      }
    }
    set({ enabled: v });
  },
  toggle: () => get().setEnabled(!get().enabled),
  hydrate: () => {
    if (typeof window === "undefined") return;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("mystery-sound");
    } catch {
      /* private mode */
    }
    set({ enabled: stored === null ? true : stored === "1", hydrated: true });
  },
}));
