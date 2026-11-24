"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ChevronDown, FileText, Stamp } from "lucide-react";

const TYPED_LINES = [
  "SUBJECT: AHMED — ALIAS \u201CTHE FULL STACK\u201D",
  "SIX YEARS ACTIVE. FOUR FIELD OFFICES. 40+ BUILDS SHIPPED.",
  "WEAPONS: LARAVEL · REACT · NEXT.JS · NODE.JS · ELECTRON",
  "LAST SEEN: DEPLOYING TO PRODUCTION — KARACHI, PK.",
];

function useTypewriter(lines: string[]) {
  const [typed, setTyped] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let line = 0;
    let ch = 0;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      if (line >= lines.length) {
        setDone(true);
        return;
      }
      const text = lines[line];
      ch += 1;
      setCurrent(text.slice(0, ch));
      if (ch >= text.length) {
        setTyped((t) => [...t, text]);
        setCurrent("");
        line += 1;
        ch = 0;
        timer = setTimeout(tick, 480);
      } else {
        timer = setTimeout(tick, 20 + Math.random() * 30);
      }
    };
    timer = setTimeout(tick, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [lines]);

  return { typed, current, done };
}

export function DeskLampHero() {
  const { typed, current, done } = useTypewriter(TYPED_LINES);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lampX = useSpring(mx, { stiffness: 60, damping: 18 });
  const lampY = useSpring(my, { stiffness: 60, damping: 18 });

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 14);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 10);
  };

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen flex-col overflow-hidden bg-noir"
      aria-label="Case file introduction"
    >
      {/* ambient grain */}
      <div className="tex-grain pointer-events-none absolute inset-0 opacity-[0.18]" />
      {/* vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-[7]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 45% 42%, transparent 40%, rgba(4,3,1,0.75) 100%)",
        }}
      />

      {/* light cone — steady base */}
      <motion.div
        style={{ x: lampX, y: lampY }}
        className="pointer-events-none absolute right-[-6%] top-[10%] z-[6] h-[70%] w-[74%] sm:right-[0%]"
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-30 blur-md"
          style={{
            clipPath: "polygon(86% 0%, 100% 0%, 62% 100%, 0% 100%)",
            background:
              "linear-gradient(188deg, rgba(247,185,85,0.30) 0%, rgba(247,185,85,0.10) 52%, rgba(247,185,85,0) 80%)",
          }}
        />
        {/* flickering cone */}
        <div
          className="anim-flicker absolute inset-0 blur-md"
          style={{
            clipPath: "polygon(86% 0%, 100% 0%, 62% 100%, 0% 100%)",
            background:
              "linear-gradient(188deg, rgba(255,196,92,0.5) 0%, rgba(247,185,85,0.22) 50%, rgba(247,185,85,0) 78%)",
            mixBlendMode: "screen",
          }}
        />
        {/* pool of light on the desk */}
        <div
          className="anim-flicker absolute bottom-[2%] left-[4%] h-[16%] w-[52%] rounded-[100%] blur-xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,196,92,0.35) 0%, rgba(255,196,92,0) 70%)",
            mixBlendMode: "screen",
          }}
        />
        {/* dust motes */}
        {[12, 30, 48, 63].map((left, i) => (
          <span
            key={i}
            className="anim-drift absolute h-1 w-1 rounded-full bg-glow/70 blur-[1px]"
            style={{
              left: `${left}%`,
              top: `${24 + i * 9}%`,
              animationDelay: `${i * 1.3}s`,
              ["--drift-rot" as string]: "0deg",
            }}
          />
        ))}
      </motion.div>

      {/* desk lamp */}
      <motion.div
        style={{ x: lampX, y: lampY }}
        className="pointer-events-none absolute bottom-[30%] right-[3%] z-[8] w-[190px] sm:w-[240px] md:w-[300px]"
        aria-hidden
      >
        <svg viewBox="0 0 220 300" className="h-auto w-full drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]">
          <defs>
            <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5a4630" />
              <stop offset="0.5" stopColor="#8a7150" />
              <stop offset="1" stopColor="#3e2f1e" />
            </linearGradient>
            <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4e3d26" />
              <stop offset="1" stopColor="#241a0e" />
            </linearGradient>
            <radialGradient id="bulb" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#fff3d0" />
              <stop offset="0.55" stopColor="#f7b955" />
              <stop offset="1" stopColor="rgba(247,185,85,0)" />
            </radialGradient>
          </defs>
          {/* base */}
          <ellipse cx="152" cy="286" rx="46" ry="9" fill="#1a120a" />
          <path d="M118 284 L186 284 L176 268 L128 268 Z" fill="url(#metal)" />
          <circle cx="152" cy="268" r="7" fill="#2c2115" />
          {/* lower arm */}
          <line x1="152" y1="268" x2="112" y2="176" stroke="url(#metal)" strokeWidth="7" strokeLinecap="round" />
          <circle cx="112" cy="176" r="8" fill="#6b5636" stroke="#241a0e" strokeWidth="2" />
          {/* upper arm */}
          <line x1="112" y1="176" x2="86" y2="106" stroke="url(#metal)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="86" cy="106" r="7" fill="#6b5636" stroke="#241a0e" strokeWidth="2" />
          {/* shade pointing down-left */}
          <path d="M96 92 L58 62 L20 84 L74 122 Z" fill="url(#shade)" stroke="#120c06" strokeWidth="2" />
          <ellipse cx="39" cy="73" rx="24" ry="12" transform="rotate(28 39 73)" fill="#171008" opacity="0.9" />
          {/* bulb glow */}
          <circle className="anim-bulb" cx="40" cy="74" r="20" fill="url(#bulb)" />
          <circle cx="40" cy="74" r="6" fill="#ffe9b8" />
        </svg>
      </motion.div>

      {/* ---------- content ---------- */}
      <div className="relative z-[10] flex flex-1 flex-col items-center justify-center px-4 pb-[38vh] pt-24 text-center sm:pb-[36vh] md:pb-[34vh]">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 border border-brass/50 bg-black/40 px-3 py-1.5 font-casefile text-[11px] tracking-[0.3em] text-brass md:text-xs">
            <FileText className="h-3.5 w-3.5" aria-hidden />
            CASE FILE No. 026
          </span>
          <span className="stamp-distress inline-block -rotate-2 border-2 border-evidence/80 px-2.5 py-1 font-stamp text-[11px] font-semibold tracking-[0.22em] text-evidence md:text-xs">
            STRICTLY CONFIDENTIAL
          </span>
        </div>

        <h1 className="font-typewriter text-6xl leading-none text-paper-light drop-shadow-[0_0_28px_rgba(247,185,85,0.35)] sm:text-7xl md:text-8xl lg:text-9xl">
          AHMED
        </h1>
        <p className="mt-4 font-stamp text-sm tracking-[0.5em] text-glow/90 sm:text-base md:text-lg">
          FULL STACK DEVELOPER
        </p>

        <div className="mt-8 min-h-[104px] w-full max-w-2xl font-casefile text-left text-[12px] leading-relaxed text-paper/90 sm:text-sm md:text-[15px]">
          {typed.map((line) => (
            <p key={line} className="mb-1.5 text-glow/75">
              &gt; {line}
            </p>
          ))}
          {!done && (
            <p className="mb-1.5 text-glow/90">
              &gt; {current}
              <span className="anim-caret ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-glow/80" />
            </p>
          )}
          {done && (
            <p className="text-glow/90">
              &gt;{" "}
              <span className="anim-caret ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-glow/80" />
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#dossiers"
            data-magnify
            className="group inline-flex items-center gap-2 border border-brass/60 bg-paper px-6 py-3 font-stamp text-sm font-medium tracking-[0.18em] text-ink shadow-[0_4px_0_#7a5f33] transition-all hover:-translate-y-0.5 hover:bg-paper-light active:translate-y-0.5 active:shadow-none"
          >
            OPEN THE DOSSIERS
          </a>
          <a
            href="#join"
            data-magnify
            className="inline-flex items-center gap-2 border border-evidence-deep bg-evidence px-6 py-3 font-stamp text-sm font-semibold tracking-[0.18em] text-paper-light shadow-[0_4px_0_#5c1410] transition-all hover:-translate-y-0.5 hover:bg-evidence-deep active:translate-y-0.5 active:shadow-none"
          >
            <Stamp className="h-4 w-4" aria-hidden />
            JOIN THE GAME
          </a>
        </div>
      </div>

      {/* ---------- desk ---------- */}
      <div className="absolute bottom-0 left-0 z-[5] h-[36%] w-full" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #241a0e 0%, #1a1209 12%, #2a1d10 60%, #17100a 100%)",
            boxShadow: "inset 0 14px 24px rgba(0,0,0,0.55)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0) 5px, rgba(0,0,0,0) 88px, rgba(0,0,0,0.24) 96px)",
          }}
        />
        <div className="tex-grain absolute inset-0 opacity-25" />

        {/* case file folder */}
        <motion.div
          style={{ x: lampX, y: lampY }}
          className="tex-paper absolute bottom-[16%] left-[8%] h-[150px] w-[240px] -rotate-2 rounded-[3px] shadow-[0_18px_40px_rgba(0,0,0,0.65)] sm:h-[180px] sm:w-[300px] md:left-[12%] md:h-[210px] md:w-[360px]"
        >
          <div className="absolute -top-6 left-6 h-7 w-28 rounded-t-[3px] border border-black/10 bg-paper-dark" />
          <div className="absolute inset-0 p-4 font-casefile">
            <p className="text-[10px] tracking-[0.25em] text-ink-soft sm:text-[11px]">
              KARACHI INVESTIGATIVE BUREAU
            </p>
            <p className="mt-1 font-typewriter text-base text-ink sm:text-xl">
              CASE FILE No. 026
            </p>
            <p className="mt-0.5 text-[10px] text-ink-soft sm:text-xs">
              SUBJECT: AHMED — FULL STACK DEVELOPER
            </p>
            <div className="stamp-distress absolute right-4 top-1/2 -translate-y-1/2 rotate-6 border-[3px] border-evidence/75 px-3 py-1.5">
              <span className="font-stamp text-lg font-bold tracking-[0.14em] text-evidence/85 sm:text-2xl">
                CONFIDENTIAL
              </span>
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between border-t border-dashed border-ink-soft/40 pt-2 text-[9px] text-ink-soft sm:text-[10px]">
              <span>OPENED: 2020 · STILL ACTIVE</span>
              <span>EXHIBITS: 40+</span>
            </div>
          </div>
          {/* paperclip */}
          <svg viewBox="0 0 24 40" className="absolute -right-2 top-4 h-10 w-6 rotate-12">
            <path
              d="M6 4 v24 a4 4 0 0 0 8 0 V10 a6 6 0 0 0 -12 0 v20"
              fill="none"
              stroke="#9a8a68"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* polaroid */}
        <motion.div
          style={{ x: lampX, y: lampY }}
          className="absolute bottom-[14%] right-[10%] hidden w-[120px] rotate-3 rounded-[2px] bg-paper-light p-2 pb-5 shadow-[0_14px_30px_rgba(0,0,0,0.6)] sm:block md:w-[150px]"
        >
          <img
            src="/images/suspect.png"
            alt="Noir surveillance photograph of the suspect under a desk lamp"
            className="aspect-square w-full object-cover sepia-[0.35] contrast-[1.05]"
          />
          <p className="mt-1.5 text-center font-casefile text-[9px] tracking-[0.2em] text-ink sm:text-[10px]">
            EXHIBIT A — THE SUSPECT
          </p>
        </motion.div>

        {/* coffee ring */}
        <div className="absolute bottom-[10%] right-[36%] hidden h-16 w-16 rounded-full border-[3px] border-[#5e3d1c]/50 md:block" />
        <div className="absolute bottom-[12%] right-[38%] hidden h-10 w-10 rounded-full bg-[#5e3d1c]/20 md:block" />

        {/* loose paper */}
        <div className="absolute bottom-[6%] left-[42%] hidden h-16 w-24 rotate-[8deg] rounded-[2px] bg-paper-dark/90 shadow-lg md:block" />
        <div className="absolute bottom-[7%] left-[46%] hidden h-16 w-24 -rotate-[5deg] rounded-[2px] bg-paper/90 shadow-lg md:block" />
      </div>

      {/* scroll hint */}
      <a
        href="#dossiers"
        data-magnify
        className="absolute bottom-3 left-1/2 z-[11] flex -translate-x-1/2 flex-col items-center gap-0.5 text-brass/80 transition-colors hover:text-glow"
      >
        <span className="font-casefile text-[10px] tracking-[0.35em]">SCROLL FOR EVIDENCE</span>
        <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden />
      </a>
    </section>
  );
}
