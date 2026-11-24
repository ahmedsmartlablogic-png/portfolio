"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import {
  Award,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Pin,
  ShieldCheck,
} from "lucide-react";
import { playSound } from "@/lib/sounds";

/* ------------------------------------------------------------------ */
/* dossier card shell                                                  */
/* ------------------------------------------------------------------ */

interface DossierCardProps {
  index: number;
  title: string;
  tagline: string;
  className?: string;
  heightClass?: string;
  children: ReactNode;
}

function DossierCard({
  index,
  title,
  tagline,
  className = "",
  heightClass = "h-[540px]",
  children,
}: DossierCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const autoDone = useRef(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!inView || autoDone.current) return;
    autoDone.current = true;
    const t = setTimeout(() => {
      setOpen(true);
    }, 350 + index * 220);
    return () => clearTimeout(t);
  }, [inView, index]);

  const flipped = open;

  const toggle = () => {
    playSound("flip");
    setOpen((v) => !v);
  };

  return (
    <div
      ref={ref}
      className={`group ${className}`}
      style={{ perspective: "1800px" }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Dossier ${String(index + 1).padStart(2, "0")} — ${title}. ${
          flipped ? "Open. Click to close." : "Closed. Click or hover to open."
        }`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        onMouseEnter={() => playSound("rustle", { volume: 0.28 })}
        className={`relative w-full select-none ${heightClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-brass`}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.9, ease: [0.18, 0.72, 0.28, 1] }}
        >
          {/* FRONT — sealed cover */}
          <div
            className="tex-paper absolute inset-0 flex flex-col rounded-[4px] border border-ink/30 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.55)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-casefile text-[10px] tracking-[0.3em] text-ink-soft">
                  KARACHI INVESTIGATIVE BUREAU
                </p>
                <p className="mt-1 font-typewriter text-lg text-ink">
                  DOSSIER {String(index + 1).padStart(2, "0")}
                </p>
              </div>
              <div className="rounded-t-[3px] border border-ink/25 bg-paper-dark px-3 py-1 font-stamp text-[10px] tracking-[0.18em] text-ink-soft">
                FILE {String(index + 1).padStart(2, "0")}
              </div>
            </div>

            {/* fingerprint watermark */}
            <svg
              viewBox="0 0 64 72"
              aria-hidden
              className="pointer-events-none absolute right-6 top-16 h-28 w-24 text-ink/15"
            >
              <path
                d="M32 12c-11 0-20 9-20 20 0 8 2 14 6 20M32 20c-7 0-13 6-13 13 0 6 1 11 4 16M32 28c-3 0-6 3-6 6 0 4 1 8 3 12M32 12c11 0 20 9 20 20 0 8-2 14-6 20M32 20c7 0 13 6 13 13 0 6-1 11-4 16M32 28c3 0 6 3 6 6 0 4-1 8-3 12M32 36v14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>

            <div className="mt-10 flex flex-1 flex-col items-center justify-center">
              <div className="stamp-distress -rotate-3 border-4 border-double border-evidence/70 px-4 py-2">
                <span className="font-stamp text-2xl font-bold tracking-[0.12em] text-evidence/80">
                  CONFIDENTIAL
                </span>
              </div>
              <h3 className="mt-8 font-typewriter text-2xl text-ink sm:text-3xl">
                {title}
              </h3>
              <p className="mt-2 max-w-[26ch] text-center font-casefile text-xs leading-relaxed text-ink-soft">
                {tagline}
              </p>
            </div>

            {/* string-and-button closure */}
            <svg
              viewBox="0 0 64 24"
              aria-hidden
              className="mx-auto mb-3 h-6 w-16 text-ink/70"
            >
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="52" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 12 C 26 2, 38 2, 52 12 M12 12 C 26 22, 38 22, 52 12" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <p className="text-center font-casefile text-[10px] tracking-[0.4em] text-evidence/70">
              TOP SECRET — EYES ONLY
            </p>
          </div>

          {/* BACK — the revealed file */}
          <div
            className="tex-paper absolute inset-0 flex flex-col rounded-[4px] border border-ink/30 shadow-[0_18px_44px_rgba(0,0,0,0.55)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="flex items-center justify-between border-b border-dashed border-ink/30 px-5 py-3.5">
              <h3 className="font-typewriter text-lg text-ink">
                {String(index + 1).padStart(2, "0")} — {title}
              </h3>
              <span className="hidden items-center gap-1 font-casefile text-[10px] tracking-[0.2em] text-ink-soft sm:inline-flex">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
                VERIFIED
              </span>
            </div>
            <div className="paper-scroll flex-1 overflow-y-auto px-5 py-4 font-casefile text-[13px] leading-relaxed text-ink">
              {children}
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-ink/30 px-5 py-2.5 font-casefile text-[10px] tracking-[0.18em] text-ink-soft">
              <span>SIGNED: DET. M.</span>
              <span>CLICK TO RE-SEAL</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* small typed helpers                                                 */
/* ------------------------------------------------------------------ */

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-ink/30 bg-paper-dark/50 px-2.5 py-1 text-[11px] text-ink shadow-[1px_1px_0_rgba(0,0,0,0.12)]">
      {children}
    </span>
  );
}

function DossierRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-ink/10 pb-2 last:border-none">
      <span className="text-evidence">{icon}</span>
      <span className="w-24 shrink-0 text-[10px] tracking-[0.16em] text-ink-soft">
        {label}
      </span>
      <span className="min-w-0 break-words text-[12px] text-ink">{value}</span>
    </div>
  );
}

function FieldEntry({
  org,
  role,
  dates,
  location,
  bullets,
  stacks,
}: {
  org: string;
  role: string;
  dates: string;
  location: string;
  bullets: string[];
  stacks: string[];
}) {
  return (
    <article className="relative border-l-2 border-evidence/50 pl-4">
      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-paper bg-evidence shadow" />
      <h4 className="font-typewriter text-base leading-snug text-ink">{org}</h4>
      <p className="mt-0.5 text-[11px] tracking-[0.12em] text-ink-soft">
        {role} · {dates} · {location}
      </p>
      <ul className="mt-2 space-y-1.5">
        {bullets.map((b) => (
          <li key={b.slice(0, 24)} className="flex gap-2 text-[12px] leading-relaxed text-ink/90">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-evidence/70" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {stacks.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* section                                                             */
/* ------------------------------------------------------------------ */

export function DossierSection() {
  return (
    <section
      id="dossiers"
      className="relative bg-noir-2 py-24 scroll-mt-16"
      aria-label="Investigation dossiers"
    >
      <div className="tex-grain pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 text-center">
          <p className="font-casefile text-[11px] tracking-[0.4em] text-brass">
            SECTION 02 — EVIDENCE ARCHIVE
          </p>
          <h2 className="mt-3 font-typewriter text-4xl text-paper-light sm:text-5xl">
            The Dossiers
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-casefile text-sm text-muted-foreground">
            Five sealed files were recovered from the suspect&apos;s desk. Hover
            to hear the paper breathe; click to break the seal.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {/* 01 — THE SUSPECT */}
          <DossierCard
            index={0}
            title="THE SUSPECT"
            tagline="One developer. Six years of unsolved deployments."
            className="md:col-span-1 lg:col-span-2"
          >
            <p className="text-[12.5px] text-ink/90">
              Full Stack Developer with <strong>nearly 6 years</strong> of
              experience building and deploying web and desktop applications
              end to end. Known to manage multiple client jobs in parallel —
              from requirement analysis straight through to deployment.
            </p>
            <div className="mt-4 space-y-2.5">
              <DossierRow
                icon={<Mail className="h-4 w-4" aria-hidden />}
                label="MAIL DROP"
                value="ahmedbalochdev@gmail.com"
              />
              <DossierRow
                icon={<Phone className="h-4 w-4" aria-hidden />}
                label="HOTLINE"
                value="+92 3000352475"
              />
              <DossierRow
                icon={<MapPin className="h-4 w-4" aria-hidden />}
                label="LAST SEEN"
                value="Gulistan-e-Johar Block 5, Karachi"
              />
            </div>
            <div className="mt-4 border border-dashed border-evidence/40 bg-evidence/5 p-3">
              <p className="font-casefile text-[10px] tracking-[0.22em] text-evidence">
                DANGER ASSESSMENT
              </p>
              <p className="mt-1 text-[12px] text-ink">
                Extremely productive. Leaves behind clean deployments, zero
                outstanding bugs, and satisfied clients. Approach with a job
                offer.
              </p>
            </div>
          </DossierCard>

          {/* 02 — MODUS OPERANDI */}
          <DossierCard
            index={1}
            title="MODUS OPERANDI"
            tagline="The weapons recovered at every crime scene he ships from."
            className="md:col-span-1 lg:col-span-4"
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <p className="font-stamp text-xs font-semibold tracking-[0.24em] text-evidence">
                  EXPERT WEAPONS
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {["Laravel (PHP)", "MySQL", "React"].map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-stamp text-xs font-semibold tracking-[0.24em] text-ink">
                  WORKING KNOWLEDGE
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {["Next.js", "Node.js", "Electron", "Vue.js", "Angular", "PostgreSQL"].map(
                    (s) => (
                      <Chip key={s}>{s}</Chip>
                    )
                  )}
                </div>
              </div>
              <div>
                <p className="font-stamp text-xs font-semibold tracking-[0.24em] text-ink">
                  TOOLS &amp; TRADES
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {[
                    "JavaScript",
                    "HTML5",
                    "CSS3",
                    "Media Queries",
                    "Tailwind CSS",
                    "Bootstrap",
                    "jQuery",
                    "Livewire",
                    "Yii2",
                    "CodeIgniter",
                    "REST APIs",
                    "Git",
                  ].map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-5 border-t border-dashed border-ink/25 pt-3 text-[12px] italic text-ink-soft">
              &ldquo;He builds the whole machine himself — front to back, PHP to
              Electron — then he puts it live on your hosting and hands you the
              keys.&rdquo; — witness statement, client feedback log
            </p>
          </DossierCard>

          {/* 03 — FIELD RECORD */}
          <DossierCard
            index={2}
            title="FIELD RECORD"
            tagline="Four field offices. An unbroken chain of shipped applications."
            className="md:col-span-2 lg:col-span-4"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FieldEntry
                org="Smart Logic Lab"
                role="Full Stack Developer"
                dates="Feb 2026 — Present"
                location="Karachi"
                bullets={[
                  "Building SmartRepair Desk — repair-shop management platform with responsive website + cross-platform desktop app: billing, inventory, technician workflow, reporting.",
                  "Shipped VinReportsPro (VIN decoding), Phone Looker, IQ Test, SmartGraveyard and TeleVita.",
                  "Deploys and maintains live client projects on Hostinger & VPS — SSL, DNS, email; coordinated timelines across parallel projects.",
                ]}
                stacks={["React", "Next.js", "Node.js", "Electron"]}
              />
              <FieldEntry
                org="Devop360"
                role="Full Stack Developer"
                dates="Jun 2025 — Feb 2026"
                location="Karachi"
                bullets={[
                  "Built the Yul-ai School Management System frontend; delivered Transport Management, Ultimate POS, Health Care, Outlook Management, Skeddi, Print Prima and Qreeting.",
                  "Managed staging & production on cPanel and Hostinger.",
                  "Ran client requirement sessions and demos.",
                ]}
                stacks={["React", "Laravel", "Vue.js", "Livewire"]}
              />
              <FieldEntry
                org="Thiqatech"
                role="Full Stack Developer (Remote)"
                dates="May 2022 — Apr 2025"
                location="Karachi"
                bullets={[
                  "Delivered 10+ production apps: Shaheen, Archive System, Auction Platform, Avatar Coaching, Farah App, Jim App, Laundry Management, Mishwar, Paris Boutique, Rent App, Tmphone, Vegetable App, Alnozha E-Commerce.",
                  "Managed end-to-end launches on GoDaddy, Hostinger and SiteGround: hosting setup, domain + SSL, database migrations, scheduled backups.",
                ]}
                stacks={["Laravel", "Livewire", "Angular", "Vue.js", "PostgreSQL"]}
              />
              <FieldEntry
                org="Craft Solution"
                role="Full Stack Developer"
                dates="Dec 2020 — Apr 2022"
                location="Karachi"
                bullets={[
                  "Developed Back Office Management System, Bookstore, Lawyers Portal, Theater Website, Dry-Fruits (Angular) and Shafi-Med (CodeIgniter).",
                  "Deployed and maintained client sites via cPanel and PuTTY (SSH), including post-launch support.",
                ]}
                stacks={["Laravel", "PHP", "Vue.js"]}
              />
            </div>
          </DossierCard>

          {/* 04 — CREDENTIALS */}
          <DossierCard
            index={3}
            title="CREDENTIALS"
            tagline="Certified, educated, and quietly dangerous with a codebase."
            className="md:col-span-1 lg:col-span-2"
          >
            <div className="flex items-start gap-3">
              <GraduationCap className="mt-0.5 h-5 w-5 text-evidence" aria-hidden />
              <div>
                <h4 className="font-typewriter text-base text-ink">Education</h4>
                <ul className="mt-2 space-y-2.5 text-[12.5px]">
                  <li>
                    <p className="font-bold text-ink">Diploma ACCP Prime</p>
                    <p className="text-ink-soft">Aptech Uni. Road Centre · 2022</p>
                  </li>
                  <li>
                    <p className="font-bold text-ink">Intermediate in Commerce</p>
                    <p className="text-ink-soft">Govt. Degree Boys College · 2020</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3 border-t border-dashed border-ink/25 pt-4">
              <Award className="mt-0.5 h-5 w-5 text-evidence" aria-hidden />
              <div>
                <h4 className="font-typewriter text-base text-ink">Certifications</h4>
                <ul className="mt-2 space-y-1.5 text-[12.5px] text-ink">
                  {["CPISM — Aptech", "DISM — Aptech", "HDSC I — Aptech", "HDSC II — Aptech"].map(
                    (c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-evidence/70" />
                        {c}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div className="stamp-distress mt-5 inline-block -rotate-2 border-2 border-evidence/60 px-3 py-1">
              <span className="font-stamp text-xs font-semibold tracking-[0.2em] text-evidence/80">
                AUTHENTIC
              </span>
            </div>
          </DossierCard>

          {/* 05 — ESCAPE ROUTES */}
          <DossierCard
            index={4}
            title="ESCAPE ROUTES"
            tagline="No build goes live without this man knowing the way out."
            className="md:col-span-2 lg:col-span-6"
            heightClass="h-[430px] sm:h-[400px]"
          >
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="flex items-center gap-2">
                  <Pin className="h-4 w-4 text-evidence" aria-hidden />
                  <h4 className="font-typewriter text-base text-ink">
                    Deployment &amp; Hosting — Known Routes
                  </h4>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "cPanel · WHM",
                    "Hostinger",
                    "GoDaddy",
                    "SiteGround",
                    "VPS",
                    "Domain, SSL & DNS Setup",
                    "Backups & Site Migration",
                  ].map((r) => (
                    <Chip key={r}>{r}</Chip>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-ink-soft">
                  Sightings confirm live client projects pushed to Hostinger and
                  VPS — SSL, DNS and email configured at the scene.
                </p>
              </div>
              <div className="lg:border-l lg:border-dashed lg:border-ink/25 lg:pl-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-evidence" aria-hidden />
                  <h4 className="font-typewriter text-base text-ink">
                    Other Known Strengths
                  </h4>
                </div>
                <ul className="mt-3 space-y-2 text-[12.5px] text-ink">
                  {["Project Management", "Client Communication", "Requirement Analysis"].map(
                    (s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-evidence/70" />
                        {s}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </DossierCard>
        </div>
      </div>
    </section>
  );
}
