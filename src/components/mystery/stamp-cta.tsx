"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stamp as StampIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/lib/sounds";

/* ------------------------------------------------------------------ */
/* circular rubber-stamp seal                                          */
/* ------------------------------------------------------------------ */

function SealSvg({ idSuffix }: { idSuffix: string }) {
  return (
    <svg
      viewBox="0 0 220 220"
      className="h-full w-full text-evidence"
      aria-hidden
    >
      <defs>
        <path
          id={`seal-circle-${idSuffix}`}
          d="M110,110 m-83,0 a83,83 0 1,1 166,0 a83,83 0 1,1 -166,0"
        />
      </defs>
      <circle cx="110" cy="110" r="104" fill="none" stroke="currentColor" strokeWidth="5" />
      <circle cx="110" cy="110" r="97" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="110" cy="110" r="60" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <text
        fill="currentColor"
        fontFamily="var(--font-oswald), sans-serif"
        fontSize="15.5"
        fontWeight="600"
        letterSpacing="2.5"
      >
        <textPath href={`#seal-circle-${idSuffix}`} startOffset="0">
          JOIN THE GAME • CASE FILE No. 026 • JOIN THE GAME •
        </textPath>
      </text>
      {/* stars */}
      <g fill="currentColor">
        <path d="M110 40 l3.2 6.4 7 1-5 5 1.2 7-6.4-3.4-6.4 3.4 1.2-7-5-5 7-1z" />
        <path d="M110 166 l3.2 6.4 7 1-5 5 1.2 7-6.4-3.4-6.4 3.4 1.2-7-5-5 7-1z" />
      </g>
      <text
        x="110"
        y="104"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-oswald), sans-serif"
        fontSize="30"
        fontWeight="700"
        letterSpacing="1"
      >
        JOIN
      </text>
      <text
        x="110"
        y="130"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="var(--font-oswald), sans-serif"
        fontSize="27"
        fontWeight="700"
        letterSpacing="0.5"
      >
        THE GAME
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* join form dialog                                                    */
/* ------------------------------------------------------------------ */

interface FormState {
  name: string;
  email: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", message: "" };

function JoinDialog({
  open,
  onOpenChange,
  onFiled,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onFiled: (caseNumber: string) => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filedNumber, setFiledNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      // reset shortly after close animation
      const t = setTimeout(() => {
        setForm(EMPTY_FORM);
        setError(null);
        setFiledNumber(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const submit = async () => {
    setError(null);
    if (form.name.trim().length < 2) {
      setError("Every suspect needs a name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("That evidence channel (email) does not look valid.");
      return;
    }
    if (form.message.trim().length < 10) {
      setError("Give the detective at least a full sentence to work with.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/case-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        caseNumber?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.caseNumber) {
        setError(data.error ?? "The evidence locker is jammed. Try again.");
        return;
      }
      setFiledNumber(data.caseNumber);
      onFiled(data.caseNumber);
      playSound("rustle", { volume: 0.5 });
      toast({
        title: "TIP FILED",
        description: `Case number ${data.caseNumber} has been assigned. The detective will be in touch.`,
      });
    } catch {
      setError("Network static. Check the wire and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-brass/30 bg-popover font-casefile sm:max-w-md">
        {filedNumber ? (
          <div className="py-4 text-center">
            <div className="stamp-distress mx-auto w-fit -rotate-3 border-4 border-double border-evidence/70 px-5 py-2.5">
              <span className="font-stamp text-3xl font-bold tracking-[0.12em] text-evidence">
                FILED
              </span>
            </div>
            <p className="mt-5 font-typewriter text-xl text-paper-light">
              CASE No. {filedNumber}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your tip has been entered into evidence. The detective will
              contact you through the channel you provided.
            </p>
            <DialogFooter className="mt-6 justify-center">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-evidence text-paper-light hover:bg-evidence-deep"
              >
                SEAL THE FILE
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-typewriter text-xl text-paper-light">
                JOIN THE INVESTIGATION
              </DialogTitle>
              <DialogDescription>
                File a tip with the detective. Open a case, pitch a project, or
                just prove you read this far — Ahmed replies to every lead.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-1">
              <div className="space-y-1.5">
                <Label htmlFor="tip-name" className="text-[11px] tracking-[0.18em] text-brass">
                  ALIAS / NAME
                </Label>
                <Input
                  id="tip-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Inspector Khan, or your real name"
                  className="border-border bg-input text-foreground placeholder:text-muted-foreground/60"
                  maxLength={80}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tip-email" className="text-[11px] tracking-[0.18em] text-brass">
                  EVIDENCE CHANNEL (EMAIL)
                </Label>
                <Input
                  id="tip-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@agency.com"
                  className="border-border bg-input text-foreground placeholder:text-muted-foreground/60"
                  maxLength={160}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tip-message" className="text-[11px] tracking-[0.18em] text-brass">
                  YOUR STATEMENT
                </Label>
                <Textarea
                  id="tip-message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="What case should we solve together? Projects, roles, timelines…"
                  rows={4}
                  className="resize-none border-border bg-input text-foreground placeholder:text-muted-foreground/60"
                  maxLength={2000}
                />
              </div>
              {error && (
                <p className="border border-evidence/50 bg-evidence/10 px-3 py-2 text-[12px] text-evidence">
                  {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                onClick={submit}
                disabled={submitting}
                className="w-full bg-evidence text-paper-light hover:bg-evidence-deep"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    FILING…
                  </>
                ) : (
                  <>
                    <StampIcon className="mr-2 h-4 w-4" aria-hidden />
                    FILE THE TIP
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* section                                                             */
/* ------------------------------------------------------------------ */

export function StampCta() {
  const [pressed, setPressed] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [shake, setShake] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/case-tips")
      .then((r) => r.json())
      .then((d: { total?: number }) => setTotal(d.total ?? 0))
      .catch(() => setTotal(null));
  }, []);

  const press = () => {
    if (pressed) return;
    setPressed(true);
    playSound("thud", { volume: 0.9 });
    playSound("rustle", { volume: 0.55 });
    setShake(true);
    window.setTimeout(() => setShake(false), 520);
    window.setTimeout(() => {
      setStamped(true);
      setPressed(false);
    }, 240);
    window.setTimeout(() => setDialogOpen(true), 720);
  };

  return (
    <section
      id="join"
      className="relative overflow-hidden bg-noir-2 py-24 scroll-mt-16"
      aria-label="Join the game"
    >
      <div className="tex-grain pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
        <p className="font-casefile text-[11px] tracking-[0.4em] text-brass">
          SECTION 04 — FINAL VERDICT
        </p>
        <h2 className="mt-3 font-typewriter text-4xl text-paper-light sm:text-5xl">
          The Verdict Is In.
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-casefile text-sm text-muted-foreground">
          The evidence is overwhelming: six years, forty-plus builds, four field
          offices. One stamp stands between this case and your next deployment.
        </p>
        <p className="mt-2 font-stamp text-sm tracking-[0.3em] text-evidence">
          PRESS THE STAMP TO JOIN THE GAME
        </p>

        {/* desk paper */}
        <div
          className={`relative mx-auto mt-14 w-full max-w-xl bg-paper p-6 shadow-[0_26px_60px_rgba(0,0,0,0.6)] sm:p-8 ${
            shake ? "anim-paper-shake" : ""
          }`}
        >
          <div className="pointer-events-none absolute inset-3 border border-dashed border-ink/25" />
          <div className="relative text-left font-casefile text-ink">
            <p className="text-[10px] tracking-[0.3em] text-ink-soft">
              KARACHI INVESTIGATIVE BUREAU — FORM 026-J
            </p>
            <h3 className="mt-1 font-typewriter text-xl sm:text-2xl">
              APPLICATION FOR CASE FILE ACCESS
            </h3>
            <p className="mt-3 text-[12.5px] leading-relaxed text-ink/90 sm:text-[13.5px]">
              I, the undersigned visitor, hereby request permission to join the
              active investigation into <strong>AHMED — FULL STACK
              DEVELOPER</strong>. I understand that pressing the stamp below
              opens a direct channel to the suspect: {" "}
              <span className="text-evidence">ahmedbalochdev@gmail.com</span> ·
              +92 3000352475 · Gulistan-e-Johar Block 5, Karachi.
            </p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="border-b border-ink/60" />
                <p className="mt-1 text-[10px] tracking-[0.2em] text-ink-soft">
                  SIGNATURE OF RECRUIT
                </p>
              </div>
              <div className="w-28 shrink-0">
                <div className="border-b border-ink/60" />
                <p className="mt-1 text-[10px] tracking-[0.2em] text-ink-soft">
                  DATE: TODAY
                </p>
              </div>
            </div>
          </div>

          {/* ink imprint left behind after stamping */}
          {stamped && (
            <motion.div
              initial={{ opacity: 0, scale: 1.15, rotate: -10 }}
              animate={{ opacity: 0.8, scale: 1, rotate: -8 }}
              transition={{ duration: 0.25 }}
              className="stamp-distress pointer-events-none absolute left-1/2 top-[74%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 sm:h-48 sm:w-48"
            >
              <SealSvg idSuffix="imprint" />
            </motion.div>
          )}
          {stamped && (
            <p className="absolute bottom-2 right-4 font-casefile text-[10px] tracking-[0.2em] text-evidence">
              FILED — {new Date().toLocaleDateString("en-GB").toUpperCase()}
            </p>
          )}
        </div>

        {/* the stamp itself */}
        <div className="relative mt-[-24px] flex flex-col items-center sm:mt-[-30px]">
          <motion.button
            type="button"
            onClick={press}
            data-magnify
            aria-label="Press the stamp to join the game"
            animate={
              pressed
                ? { y: [0, 84, 0], scale: [1, 0.9, 1], rotate: [-3, -8, -3] }
                : { y: 0, scale: 1, rotate: -3 }
            }
            transition={
              pressed
                ? { duration: 0.45, times: [0, 0.4, 1], ease: "easeIn" }
                : { duration: 0.3 }
            }
            whileHover={{ scale: 1.04 }}
            className="stamp-distress relative z-10 h-[190px] w-[190px] drop-shadow-[0_16px_22px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-glow sm:h-[250px] sm:w-[250px]"
          >
            <div className="anim-stamp-idle h-full w-full">
              <SealSvg idSuffix="main" />
            </div>
          </motion.button>

          {/* wooden grip hint */}
          <div
            aria-hidden
            className="mt-[-6px] h-10 w-24 rounded-full sm:h-12 sm:w-28"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(74,52,24,0.9) 0%, rgba(46,32,16,0.85) 55%, rgba(46,32,16,0) 100%)",
              filter: "blur(2px)",
            }}
          />

          <p className="mt-2 flex items-center gap-2 font-casefile text-[11px] tracking-[0.25em] text-brass">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {total !== null
              ? `${total} ${total === 1 ? "RECRUIT HAS" : "RECRUITS HAVE"} ALREADY JOINED THE INVESTIGATION`
              : "COUNTING RECRUITS…"}
          </p>
        </div>

        {/* direct contact chips */}
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:ahmedbalochdev@gmail.com"
            data-magnify
            className="inline-flex w-full items-center justify-center gap-2 border border-brass/50 bg-paper/95 px-4 py-2.5 font-casefile text-[13px] text-ink shadow-[0_3px_0_#7a5f33] transition-all hover:-translate-y-0.5 hover:bg-paper-light sm:w-auto"
          >
            <Mail className="h-4 w-4 text-evidence" aria-hidden />
            ahmedbalochdev@gmail.com
          </a>
          <a
            href="tel:+923000352475"
            data-magnify
            className="inline-flex w-full items-center justify-center gap-2 border border-brass/50 bg-paper/95 px-4 py-2.5 font-casefile text-[13px] text-ink shadow-[0_3px_0_#7a5f33] transition-all hover:-translate-y-0.5 hover:bg-paper-light sm:w-auto"
          >
            <Phone className="h-4 w-4 text-evidence" aria-hidden />
            +92 3000352475
          </a>
          <span className="inline-flex w-full items-center justify-center gap-2 border border-brass/30 bg-transparent px-4 py-2.5 font-casefile text-[13px] text-muted-foreground sm:w-auto">
            <MapPin className="h-4 w-4 text-brass" aria-hidden />
            Gulistan-e-Johar Block 5, Karachi
          </span>
        </div>
      </div>

      <JoinDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onFiled={() => setTotal((t) => (t === null ? 1 : t + 1))}
      />
    </section>
  );
}
