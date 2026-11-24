// Generates noir paper/stamp sound effects as 16-bit mono WAV files.
// Usage: node scripts/gen-audio.mjs
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const SR = 44100;
const OUT_DIR = join(process.cwd(), "public", "audio");

function toWav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  return buf;
}

function noise(len) {
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) out[i] = Math.random() * 2 - 1;
  return out;
}

function lowpass(x, cutoff) {
  const out = new Float32Array(x.length);
  const dt = 1 / SR;
  const rc = 1 / (2 * Math.PI * cutoff);
  const a = rc / (rc + dt);
  let y = 0;
  for (let i = 0; i < x.length; i++) {
    y += a * (x[i] - y);
    out[i] = y;
  }
  return out;
}

function highpass(x, cutoff) {
  const lp = lowpass(x, cutoff);
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) out[i] = x[i] - lp[i];
  return out;
}

function normalize(x, peak) {
  let max = 0;
  for (let i = 0; i < x.length; i++) max = Math.max(max, Math.abs(x[i]));
  if (max === 0) return x;
  const g = peak / max;
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) out[i] = x[i] * g;
  return out;
}

function fadeEdges(x, ms = 4) {
  const n = Math.floor((ms / 1000) * SR);
  const out = Float32Array.from(x);
  for (let i = 0; i < n && i < out.length; i++) {
    out[i] *= i / n;
    out[out.length - 1 - i] *= i / n;
  }
  return out;
}

// ---------- paper rustle: clusters of crisp filtered-noise bursts ----------
function makeRustle() {
  const dur = 1.0;
  const len = Math.floor(SR * dur);
  const src = noise(len);
  const env = new Float32Array(len);

  const bursts = [
    [0.03, 0.13, 1.0],
    [0.14, 0.09, 0.7],
    [0.26, 0.18, 1.0],
    [0.48, 0.1, 0.75],
    [0.6, 0.22, 1.0],
    [0.86, 0.12, 0.8],
  ];
  for (const [start, d, amp] of bursts) {
    const s0 = Math.floor(start * SR);
    const blen = Math.floor(d * SR);
    const attack = Math.floor(0.008 * SR);
    for (let i = 0; i < blen && s0 + i < len; i++) {
      let e;
      if (i < attack) e = i / attack;
      else e = Math.exp(-(i - attack) / (SR * 0.045));
      env[s0 + i] += e * amp;
    }
  }
  // scattered paper crackles
  for (let c = 0; c < 90; c++) {
    const p = Math.floor(Math.random() * len);
    const plen = Math.floor(SR * 0.004);
    const a = 0.25 + Math.random() * 0.5;
    for (let i = 0; i < plen && p + i < len; i++) {
      env[p + i] += Math.exp(-i / (SR * 0.0012)) * a;
    }
  }
  let out = new Float32Array(len);
  for (let i = 0; i < len; i++) out[i] = src[i] * env[i];
  out = highpass(out, 1000);
  out = lowpass(out, 6500);
  return fadeEdges(normalize(out, 0.55));
}

// ---------- stamp thud: low body + tight mechanical click ----------
function makeThud() {
  const dur = 0.42;
  const len = Math.floor(SR * dur);
  const out = new Float32Array(len);

  // body: sine sweep 120 -> 46 Hz
  let phase = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const f = 46 + 74 * Math.exp(-t * 26);
    phase += (2 * Math.PI * f) / SR;
    const env = Math.exp(-t * 20);
    out[i] += Math.sin(phase) * env * 0.9;
  }
  // desk knock transient (lowpassed noise)
  const knock = lowpass(noise(len), 420);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    out[i] += knock[i] * Math.exp(-t * 55) * 1.4;
  }
  // slight handle slap (highpassed, very short)
  const slap = highpass(noise(len), 1800);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    out[i] += slap[i] * Math.exp(-t * 120) * 0.35;
  }
  return fadeEdges(normalize(out, 0.9), 2);
}

// ---------- paper flip: swish with sweeping filter ----------
function makeFlip() {
  const dur = 0.55;
  const len = Math.floor(SR * dur);
  const src = noise(len);
  const out = new Float32Array(len);
  const dt = 1 / SR;
  let y = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const p = t / dur;
    // sweep cutoff up then down (swish)
    const cutoff = 420 + 2600 * Math.sin(Math.PI * p) ** 1.6;
    const rc = 1 / (2 * Math.PI * cutoff);
    const a = rc / (rc + dt);
    y += a * (src[i] - y);
    const env = Math.sin(Math.PI * Math.min(1, p)) ** 1.2;
    out[i] = y * env;
  }
  return fadeEdges(normalize(out, 0.5));
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "paper-rustle.wav"), toWav(makeRustle()));
writeFileSync(join(OUT_DIR, "stamp-thud.wav"), toWav(makeThud()));
writeFileSync(join(OUT_DIR, "paper-flip.wav"), toWav(makeFlip()));
console.log("audio assets written to public/audio");
