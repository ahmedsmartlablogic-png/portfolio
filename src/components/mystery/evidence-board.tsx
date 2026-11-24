"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Gavel,
  GraduationCap,
  HeartPulse,
  Pill,
  Route,
  Shield,
  ShoppingCart,
  Store,
  Scale,
  Wrench,
  Car,
  type LucideIcon,
} from "lucide-react";
import { playSound } from "@/lib/sounds";

/* ------------------------------------------------------------------ */
/* data                                                                */
/* ------------------------------------------------------------------ */

type NodeKind = "suspect" | "employer" | "project" | "note";

interface BoardNode {
  id: string;
  kind: NodeKind;
  x: number; // percent from left (anchor = top-center pin)
  y: number; // percent from top
  rot: number;
  name: string;
  photo?: string;
  icon?: LucideIcon;
  stacks?: string[];
  dates?: string;
  location?: string;
  note?: string;
  tally?: string[];
}

const SUSPECT: BoardNode = {
  id: "suspect",
  kind: "suspect",
  x: 50,
  y: 3,
  rot: -1.5,
  name: "AHMED",
  photo: "/images/suspect.png",
};

const EMPLOYERS: BoardNode[] = [
  {
    id: "smart",
    kind: "employer",
    x: 24,
    y: 20,
    rot: -2,
    name: "Smart Logic Lab",
    dates: "Feb 2026 — Present",
    location: "Karachi",
    note: "Repair-shop platform + vehicle history, healthcare & more",
    tally: ["SmartRepair Desk", "VinReportsPro", "TeleVita", "+2 more"],
  },
  {
    id: "devop",
    kind: "employer",
    x: 76,
    y: 20,
    rot: 2,
    name: "Devop360",
    dates: "Jun 2025 — Feb 2026",
    location: "Karachi",
    note: "School systems, POS and seven client deliverables",
    tally: ["Yul-ai SMS", "Ultimate POS", "Skeddi", "+4 more"],
  },
  {
    id: "craft",
    kind: "employer",
    x: 24,
    y: 62,
    rot: 1.5,
    name: "Craft Solution",
    dates: "Dec 2020 — Apr 2022",
    location: "Karachi",
    note: "Back-office, legal, commerce and pharma builds",
    tally: ["Back Office Mgmt", "Lawyers Portal", "Shafi-Med", "+3 more"],
  },
  {
    id: "thiqatech",
    kind: "employer",
    x: 76,
    y: 62,
    rot: -1.5,
    name: "Thiqatech",
    dates: "May 2022 — Apr 2025",
    location: "Karachi · Remote",
    note: "10+ production applications delivered remotely",
    tally: ["Shaheen", "Auction Platform", "Alnozha", "+10 more"],
  },
];

const PROJECTS: BoardNode[] = [
  { id: "smartrepair", kind: "project", x: 7, y: 44, rot: -2.5, name: "SmartRepair Desk", icon: Wrench, stacks: ["React", "Electron"], note: "" },
  { id: "vinreports", kind: "project", x: 24, y: 44, rot: 2, name: "VinReportsPro", icon: Car, stacks: ["Next.js", "Node.js"], note: "" },
  { id: "televita", kind: "project", x: 7, y: 66, rot: 2, name: "TeleVita", icon: HeartPulse, stacks: ["Healthcare"], note: "" },
  { id: "yulai", kind: "project", x: 66, y: 40, rot: -1.5, name: "Yul-ai School Mgmt", icon: GraduationCap, stacks: ["React", "Laravel"], note: "" },
  { id: "pos", kind: "project", x: 93, y: 44, rot: 2.5, name: "Ultimate POS", icon: ShoppingCart, stacks: ["Laravel", "Vue.js"], note: "" },
  { id: "skeddi", kind: "project", x: 58, y: 62, rot: -2, name: "Skeddi", icon: Route, stacks: ["Scheduling"], note: "" },
  { id: "backoffice", kind: "project", x: 6, y: 84, rot: 2, name: "Back Office Mgmt", icon: Building2, stacks: ["Laravel", "Vue.js"], note: "" },
  { id: "lawyers", kind: "project", x: 24, y: 84, rot: -2, name: "Lawyers Portal", icon: Scale, stacks: ["Laravel"], note: "" },
  { id: "shafimed", kind: "project", x: 41, y: 84, rot: 2.5, name: "Shafi-Med", icon: Pill, stacks: ["CodeIgniter"], note: "" },
  { id: "shaheen", kind: "project", x: 58, y: 84, rot: -2.5, name: "Shaheen", icon: Shield, stacks: ["Angular"], note: "" },
  { id: "auction", kind: "project", x: 76, y: 84, rot: 1.5, name: "Auction Platform", icon: Gavel, stacks: ["Livewire"], note: "" },
  { id: "alnozha", kind: "project", x: 93, y: 84, rot: -2, name: "Alnozha Store", icon: Store, stacks: ["E-Commerce"], note: "" },
];

const NOTE: BoardNode = {
  id: "note",
  kind: "note",
  x: 50,
  y: 44,
  rot: -1,
  name: "CROSS-REFERENCE",
  note: "40+ builds shipped · 5 hosting platforms · zero unsolved bugs",
};

const LINKS: { from: string; to: string }[] = [
  { from: "suspect", to: "smart" },
  { from: "suspect", to: "devop" },
  { from: "suspect", to: "craft" },
  { from: "suspect", to: "thiqatech" },
  { from: "smart", to: "smartrepair" },
  { from: "smart", to: "vinreports" },
  { from: "smart", to: "televita" },
  { from: "devop", to: "yulai" },
  { from: "devop", to: "pos" },
  { from: "devop", to: "skeddi" },
  { from: "craft", to: "backoffice" },
  { from: "craft", to: "lawyers" },
  { from: "craft", to: "shafimed" },
  { from: "thiqatech", to: "shaheen" },
  { from: "thiqatech", to: "auction" },
  { from: "thiqatech", to: "alnozha" },
];

const ALL_NODES = [SUSPECT, ...EMPLOYERS, ...PROJECTS, NOTE];
const nodeById = (id: string) => ALL_NODES.find((n) => n.id === id)!;

/* ------------------------------------------------------------------ */
/* pins + cards                                                        */
/* ------------------------------------------------------------------ */

function Pin({ hot }: { hot: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute -top-2 left-1/2 z-20 h-4 w-4 -translate-x-1/2 rounded-full border border-black/50 shadow-[0_3px_6px_rgba(0,0,0,0.55)] transition-transform duration-200 ${
        hot ? "scale-125" : ""
      }`}
      style={{
        background:
          "radial-gradient(circle at 34% 30%, #e05a4e 0%, #a62b23 45%, #6d1710 100%)",
      }}
    />
  );
}

function SuspectCard({ hot }: { hot: boolean }) {
  return (
    <div
      className={`w-60 rounded-[3px] bg-paper-light p-2.5 pb-3 shadow-[0_16px_36px_rgba(0,0,0,0.6)] transition-transform duration-200 ${
        hot ? "-translate-y-1.5 rotate-0 scale-[1.02]" : ""
      }`}
    >
      <div className="relative overflow-hidden border border-black/20">
        <img
          src="/images/suspect.png"
          alt="Noir mugshot of the suspect, AHMED"
          className="aspect-square w-full object-cover sepia-[0.3] contrast-[1.06]"
        />
        <div className="stamp-distress absolute bottom-2 right-2 rotate-[-6deg] border-2 border-evidence/80 px-2 py-0.5 bg-black/20">
          <span className="font-stamp text-[11px] font-bold tracking-[0.2em] text-evidence">
            WANTED
          </span>
        </div>
      </div>
      <p className="mt-2 font-typewriter text-lg leading-none text-ink">
        THE SUSPECT — AHMED
      </p>
      <p className="mt-1 text-center font-casefile text-[10px] tracking-[0.24em] text-ink-soft">
        FULL STACK DEVELOPER · 6 YRS
      </p>
    </div>
  );
}

function EmployerCard({ node, hot }: { node: BoardNode; hot: boolean }) {
  return (
    <div
      className={`tex-paper w-48 rounded-[3px] border border-ink/30 p-3 shadow-[0_14px_30px_rgba(0,0,0,0.55)] transition-transform duration-200 ${
        hot ? "-translate-y-1.5 rotate-0 scale-[1.02]" : ""
      }`}
    >
      <p className="font-casefile text-[8px] tracking-[0.28em] text-ink-soft">
        FIELD OFFICE
      </p>
      <p className="mt-0.5 font-typewriter text-[15px] leading-tight text-ink">
        {node.name}
      </p>
      <p className="mt-1 font-casefile text-[10px] text-evidence">{node.dates}</p>
      <p className="font-casefile text-[10px] text-ink-soft">{node.location}</p>
      <div className="my-2 border-t border-dashed border-ink/30" />
      <p className="min-h-[30px] font-casefile text-[10px] leading-snug text-ink/90">
        {node.note}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {node.tally?.map((t) => (
          <span
            key={t}
            className="border border-ink/25 bg-paper-dark/60 px-1.5 py-0.5 font-casefile text-[8.5px] text-ink"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ node, hot }: { node: BoardNode; hot: boolean }) {
  const Icon = node.icon!;
  return (
    <div
      className={`w-40 rounded-[2px] bg-paper-light p-1.5 pb-2 shadow-[0_12px_26px_rgba(0,0,0,0.5)] transition-transform duration-200 ${
        hot ? "-translate-y-1.5 rotate-0 scale-[1.04]" : ""
      }`}
    >
      <div
        className="relative flex h-20 items-center justify-center overflow-hidden border border-black/25"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, #3f2f16 0%, #221809 70%)",
        }}
      >
        <Icon className="h-9 w-9 text-glow/80" aria-hidden />
        <div className="tex-grain absolute inset-0 opacity-25" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(255,220,150,0.05) 0 1px, transparent 1px 4px)",
          }}
        />
      </div>
      <p className="mt-1.5 truncate px-0.5 font-casefile text-[11px] font-bold text-ink">
        {node.name}
      </p>
      <p className="px-0.5 font-casefile text-[8.5px] tracking-wide text-ink-soft">
        {node.stacks?.join(" · ")}
      </p>
    </div>
  );
}

function NoteCard({ hot }: { hot: boolean }) {
  return (
    <div
      className={`w-56 border border-brass/40 bg-[#efe4c4] px-4 py-3 text-center shadow-[0_10px_22px_rgba(0,0,0,0.45)] transition-transform duration-200 ${
        hot ? "-translate-y-1.5 rotate-0" : ""
      }`}
    >
      <p className="font-stamp text-[11px] font-semibold tracking-[0.3em] text-evidence">
        CROSS-REFERENCE
      </p>
      <p className="mt-1 font-casefile text-[11px] leading-snug text-ink">
        40+ builds shipped · 5 hosting platforms · zero unsolved bugs
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* board                                                               */
/* ------------------------------------------------------------------ */

export function EvidenceBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const px = (node: BoardNode) => ({
    x: (node.x / 100) * size.w,
    y: (node.y / 100) * size.h + 6, // anchor at pin center
  });

  const isLinkHot = (from: string, to: string) =>
    hoverId !== null && (from === hoverId || to === hoverId);

  return (
    <section
      id="evidence"
      className="relative bg-noir py-24 scroll-mt-16"
      aria-label="Red string evidence board"
    >
      <div className="tex-grain pointer-events-none absolute inset-0 opacity-[0.1]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="font-casefile text-[11px] tracking-[0.4em] text-brass">
            SECTION 03 — RED STRING ANALYSIS
          </p>
          <h2 className="mt-3 font-typewriter text-4xl text-paper-light sm:text-5xl">
            The Evidence Board
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-casefile text-sm text-muted-foreground">
            Four field offices. Twelve confirmed builds. One suspect at the
            center of it all. Hover any card to trace its connections.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 font-casefile text-[11px]">
            <span className="inline-flex items-center gap-2 border border-evidence/40 bg-evidence/10 px-3 py-1 text-evidence">
              <span className="h-2.5 w-2.5 rounded-full bg-evidence" aria-hidden />
              RED STRING = CONFIRMED LINK
            </span>
            <span className="inline-flex items-center gap-2 border border-brass/40 bg-brass/10 px-3 py-1 text-brass">
              <span className="h-2.5 w-2.5 rounded-full bg-brass" aria-hidden />
              POLAROID = SHIPPED BUILD
            </span>
            <span className="inline-flex items-center gap-2 border border-paper/30 bg-paper/10 px-3 py-1 text-paper/80">
              <span className="h-2.5 w-2.5 rounded-full bg-paper" aria-hidden />
              FOLDER = FIELD OFFICE
            </span>
          </div>
        </div>

        {/* ---------- desktop board ---------- */}
        <div className="hidden lg:block">
          <div
            className="rounded-md p-3 shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
            style={{
              background:
                "linear-gradient(135deg, #4a3018 0%, #2e1d0d 30%, #3c2814 60%, #241505 100%)",
            }}
          >
            <div
              ref={boardRef}
              className="tex-cork relative h-[1040px] w-full overflow-hidden rounded-sm"
            >
              {/* strings */}
              <svg
                className="absolute inset-0 z-[1]"
                width={size.w}
                height={size.h}
                aria-hidden
              >
                {size.w > 0 &&
                  LINKS.map(({ from, to }) => {
                    const a = px(nodeById(from));
                    const b = px(nodeById(to));
                    const mx = (a.x + b.x) / 2;
                    const my = (a.y + b.y) / 2;
                    const dist = Math.hypot(b.x - a.x, b.y - a.y);
                    const sag = Math.min(70, dist * 0.16);
                    const hot = isLinkHot(from, to);
                    const dim = hoverId !== null && !hot;
                    return (
                      <path
                        key={`${from}-${to}`}
                        d={`M ${a.x} ${a.y} Q ${mx} ${my + sag} ${b.x} ${b.y}`}
                        fill="none"
                        stroke={hot ? "#d8453a" : "#a62b23"}
                        strokeWidth={hot ? 3.5 : 2}
                        strokeLinecap="round"
                        opacity={dim ? 0.14 : hot ? 1 : 0.65}
                        className="transition-all duration-300"
                        style={hot ? { filter: "drop-shadow(0 0 5px rgba(216,69,58,0.7))" } : undefined}
                      />
                    );
                  })}
              </svg>

              {/* nodes */}
              {ALL_NODES.map((node) => {
                const hot = hoverId === node.id;
                return (
                  <div
                    key={node.id}
                    className="absolute z-10"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: `translateX(-50%) rotate(${node.rot}deg)`,
                    }}
                    onMouseEnter={() => {
                      setHoverId(node.id);
                      if (node.kind !== "note") playSound("rustle", { volume: 0.22 });
                    }}
                    onMouseLeave={() => setHoverId(null)}
                  >
                    <div className="relative" data-magnify>
                      <Pin hot={hot} />
                      {node.kind === "suspect" && <SuspectCard hot={hot} />}
                      {node.kind === "employer" && (
                        <EmployerCard node={node} hot={hot} />
                      )}
                      {node.kind === "project" && (
                        <ProjectCard node={node} hot={hot} />
                      )}
                      {node.kind === "note" && <NoteCard hot={hot} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------- mobile stacked board ---------- */}
        <div className="space-y-10 lg:hidden">
          <div className="mx-auto w-full max-w-xs" data-magnify>
            <div className="relative">
              <Pin hot={false} />
              <SuspectCard hot={false} />
            </div>
          </div>
          {EMPLOYERS.map((emp) => (
            <div key={emp.id}>
              <div className="mx-auto w-fit" data-magnify>
                <div className="relative">
                  <Pin hot={false} />
                  <EmployerCard node={emp} hot={false} />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 justify-items-center gap-5">
                {PROJECTS.filter(
                  (p) => LINKS.some((l) => l.from === emp.id && l.to === p.id)
                ).map((p) => (
                  <div key={p.id} className="relative" data-magnify>
                    <Pin hot={false} />
                    <ProjectCard node={p} hot={false} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="mx-auto w-fit" data-magnify>
            <NoteCard hot={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
