"use client";

import { useEffect } from "react";
import { Volume2, VolumeX, FolderOpen } from "lucide-react";
import { useSoundStore } from "@/lib/sound-store";
import { playSound } from "@/lib/sounds";

export function CaseHeader() {
  const enabled = useSoundStore((s) => s.enabled);
  const toggle = useSoundStore((s) => s.toggle);
  const hydrate = useSoundStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brass/25 bg-noir/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <a href="#top" data-magnify className="flex min-w-0 items-center gap-3">
          <span className="stamp-distress inline-block -rotate-2 border-2 border-evidence px-2 py-0.5">
            <span className="font-stamp text-[10px] font-bold tracking-[0.16em] text-evidence">
              CASE No. 026
            </span>
          </span>
          <span className="truncate font-typewriter text-sm text-paper-light sm:text-base">
            AHMED
          </span>
          <span className="hidden font-casefile text-[11px] tracking-[0.22em] text-brass md:inline">
            · FULL STACK DEVELOPER
          </span>
        </a>

        <nav
          aria-label="Case navigation"
          className="flex items-center gap-1 font-casefile text-[11px] tracking-[0.2em] sm:gap-2"
        >
          <a
            href="#dossiers"
            data-magnify
            className="hidden px-2.5 py-1.5 text-paper/80 transition-colors hover:text-glow sm:inline-block"
          >
            DOSSIERS
          </a>
          <a
            href="#evidence"
            data-magnify
            className="hidden px-2.5 py-1.5 text-paper/80 transition-colors hover:text-glow sm:inline-block"
          >
            EVIDENCE
          </a>
          <a
            href="#join"
            data-magnify
            className="inline-flex items-center gap-1.5 border border-evidence bg-evidence px-3 py-1.5 font-stamp text-[11px] font-semibold tracking-[0.14em] text-paper-light transition-colors hover:bg-evidence-deep"
          >
            <FolderOpen className="h-3.5 w-3.5" aria-hidden />
            JOIN THE GAME
          </a>
          <button
            type="button"
            onClick={() => {
              const next = !enabled;
              toggle();
              if (next) {
                // user gesture unlocks the audio context
                playSound("flip", { volume: 0.4 });
              }
            }}
            data-magnify
            aria-pressed={enabled}
            aria-label={enabled ? "Mute case file sounds" : "Unmute case file sounds"}
            title={enabled ? "Mute sounds" : "Unmute sounds"}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center border border-brass/40 text-brass transition-colors hover:border-glow hover:text-glow"
          >
            {enabled ? (
              <Volume2 className="h-4 w-4" aria-hidden />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function CaseFooter() {
  return (
    <footer className="mt-auto border-t border-brass/25 bg-noir">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:flex-row sm:px-6">
        <p className="font-casefile text-[11px] tracking-[0.18em] text-muted-foreground">
          © 2026 AHMED — FULL STACK DEVELOPER · CASE FILE No. 026 · KARACHI, PK
        </p>
        <p className="font-casefile text-[11px] tracking-[0.18em] text-brass">
          THIS FILE IS SEALED. NEW EVIDENCE:{" "}
          <a
            href="mailto:ahmedbalochdev@gmail.com"
            data-magnify
            className="underline decoration-evidence/60 underline-offset-4 transition-colors hover:text-glow"
          >
            AHMEDBALOCHDEV@GMAIL.COM
          </a>
        </p>
      </div>
    </footer>
  );
}
