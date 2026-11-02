// Firma series engine — name-check story object (Folge 8 "Firmenname", 2026-10-28). Optional top-level `nameCheck` in episode.json.
// One 2D layer that carries a whole naming episode, all times are anchors (resolved with tl.at):
//   hook      = Frame 1: work-shirt chest with the embroidered name + note with the struck names + yellow status card (all filled in at t = 0)
//   recapCard = neutral (not green) card under the plan board in the recap (e.g. "Vorschlag 109 € · 5 Shirts"), optional patch on the product card
//   wall      = name wall (2 columns, up to 10 cards) with strike animation, reason label per strike, counter "x von 10 gestrichen", mini card, proof tile
//   winner    = survivors stay lit, the winner card flies onto the shirt chest, the name is embroidered, stamp
//   why       = shirt goes up, head pill, reason cards stack (each stays), optional stamp word per card
//   fields    = check fields under the shirt (yellow "?" / grey "NICHT GEPRÜFT")
//   next      = shirt with a dashed "Logo?" circle + question card
// Not set → nothing changes (other episodes untouched). Schema: episode-schema.md "nameCheck".
import React from "react";
import { staticFile, Img } from "remotion";
import { pixelFont } from "../PixelKit";
import { cl, ease, back, bump } from "../ShirtWorld3D";
import { INK } from "../ClaudeUI";
import { GOLD } from "./draw";
import type { Anchor } from "./schema";
import type { TL } from "./timeline";

export type NameCheckSpec = {
  name: string;
  hook: {
    note: { title: string; struck: string[]; count: number; total: number; label: string };
    status: string[];
    out: Anchor;
    beats?: { at: Anchor; what: "push" | "counter" | "stitch" | "status" | "note" | "q" }[];
    strong?: boolean; // optional (2026-10-29): stronger beats (counter re-counts, needle runs, card tips in), status card ≥ 60 px under the shirt, faster exit; default unchanged
    outDur?: number;  // optional exit duration in s (default 0.35)
  };
  recapCard?: { top: string; tag?: string; big: string; small: string; at: Anchor; bigAt?: Anchor; smallAt?: Anchor; out: Anchor };
  recapPatch?: { at: Anchor; pulse?: Anchor; out: Anchor };
  wall: {
    at: Anchor; title: string; sub?: string; label: string; // label = "von 10 gestrichen"
    cards: string[];
    hot?: string; // substring painted orange in highlighted cards ("kluft")
    strikes: { cards: number[]; at: Anchor; why: string; hlAt?: Anchor; markAt?: Anchor }[];
    pushAt?: Anchor;
    mini?: { big: string; small: string; at: Anchor };
    proof?: { src: string; at: Anchor; crop: [number, number, number, number]; label?: string }; // crop in image px
  };
  winner: { card: number; dimAt: Anchor; fly: Anchor; stamp: string; stampAt: Anchor };
  why: { at: Anchor; pill: string; pillAt: Anchor; cards: { icon: "crew5" | "searchLens" | "searchList"; lines: string[]; small?: string; at: Anchor; smallAt?: Anchor; hot?: string; hotAt?: Anchor; stampAt?: Anchor }[] };
  fields: { at: Anchor; pill: string; pillAt: Anchor; items: { label: string; status: string; tone: "yellow" | "grey"; at: Anchor; statusAt: Anchor; note?: string }[] };
  next: { at: Anchor; pill: string; pillAt: Anchor; lines: string[]; linesAt: Anchor; logoAt: Anchor; mark?: { word: string; at: Anchor }; cut?: boolean }; // cut: hard cut at `end` (no fade, shirt does not fly over the next shot)
  stage?: { why?: { y: number; s: number }; fields?: { y: number; s: number }; shirtOnTop?: boolean; stampTop?: number; stampFrom?: number; whyOutLead?: number }; // optional shirt placement overrides (2026-10-29)
  end: Anchor;
};

const OR = "#FF6B35", RED = "#D63A40", YEL = "#F5C542", CREAM = "#FFFDF8", GREY = "#D9D4CB";
const stroke = (px: number, col = "#0B1020") => ({ WebkitTextStroke: `${px}px ${col}`, paintOrder: "stroke fill" as const });
let mctx: CanvasRenderingContext2D | null = null;
const measure = (text: string, font: string) => {
  if (!mctx) mctx = document.createElement("canvas").getContext("2d")!;
  mctx.font = font;
  return mctx.measureText(text).width * 1.06; // conservative (web font may not be measured yet)
};
const fit = (lines: string[], weight: number, max: number, maxW: number) => Math.min(max, ...lines.map((l) => max * maxW / Math.max(1, measure(l, `${weight} ${max}px ${pixelFont}`))));

// ---------- resolve (once per timeline) ----------
const resolveNC = (tl: TL) => {
  const S = tl.ep.nameCheck as NameCheckSpec;
  const at = (a: Anchor) => tl.at(a);
  const o = (a: Anchor | undefined, fb: number) => (a === undefined ? fb : at(a));
  return {
    S,
    hook: { out: at(S.hook.out), beats: (S.hook.beats ?? []).map((b) => ({ ...b, at: at(b.at) })) },
    recapCard: S.recapCard ? { ...S.recapCard, at: at(S.recapCard.at), bigAt: o(S.recapCard.bigAt, at(S.recapCard.at)), smallAt: o(S.recapCard.smallAt, at(S.recapCard.at)), out: at(S.recapCard.out) } : undefined,
    recapPatch: S.recapPatch ? { at: at(S.recapPatch.at), pulse: o(S.recapPatch.pulse, -9), out: at(S.recapPatch.out) } : undefined,
    wall: {
      ...S.wall, at: at(S.wall.at), pushAt: o(S.wall.pushAt, 1e9),
      strikes: S.wall.strikes.map((s) => ({ ...s, at: at(s.at), hlAt: o(s.hlAt, at(s.at)), markAt: o(s.markAt, 1e9) })),
      mini: S.wall.mini ? { ...S.wall.mini, at: at(S.wall.mini.at) } : undefined,
      proof: S.wall.proof ? { ...S.wall.proof, at: at(S.wall.proof.at) } : undefined,
    },
    winner: { ...S.winner, dimAt: at(S.winner.dimAt), fly: at(S.winner.fly), stampAt: at(S.winner.stampAt) },
    why: { ...S.why, at: at(S.why.at), pillAt: at(S.why.pillAt), cards: S.why.cards.map((c) => ({ ...c, at: at(c.at), smallAt: o(c.smallAt, at(c.at)), hotAt: o(c.hotAt, 1e9), stampAt: o(c.stampAt, -1) })) },
    fields: { ...S.fields, at: at(S.fields.at), pillAt: at(S.fields.pillAt), items: S.fields.items.map((f) => ({ ...f, at: at(f.at), statusAt: at(f.statusAt) })) },
    next: { ...S.next, at: at(S.next.at), pillAt: at(S.next.pillAt), linesAt: at(S.next.linesAt), logoAt: at(S.next.logoAt), mark: S.next.mark ? { ...S.next.mark, at: at(S.next.mark.at) } : undefined },
    end: at(S.end),
  };
};
type NC = ReturnType<typeof resolveNC>;
const cache = new WeakMap<object, NC>();
const useNC = (tl: TL): NC | null => {
  if (!tl.ep.nameCheck) return null;
  let r = cache.get(tl);
  if (!r) { r = resolveNC(tl); cache.set(tl, r); }
  return r;
};

// ---------- work-shirt chest (SVG 960 × 620) with embroidered name ----------
const CW = 960, CH = 620;
export const Chest: React.FC<{ id: string; name: string; stitch: number; shine?: number; logo?: number; t: number; html?: boolean; needle?: number; glow?: number; nameMax?: number }> = ({ id, name, stitch, shine = -1, logo = 0, t, html, needle = -1, glow = 0, nameMax }) => {
  if (html) return <ChestHtml id={id} name={name} stitch={stitch} logo={logo} t={t} needle={needle} glow={glow} shine={shine} nameMax={nameMax} />;
  const fs = fit([name], 900, 120, 800);
  const ny = 330;
  const edge = CW * 0.08 + (CW * 0.84) * stitch; // needle position while embroidering
  return (
    <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}-fab`} cx="30%" cy="18%" r="95%">
          <stop offset="0" stopColor="#4A5466" /><stop offset="0.55" stopColor="#323A49" /><stop offset="1" stopColor="#1F2531" />
        </radialGradient>
        <pattern id={`${id}-knit`} width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8 L8 0" stroke="rgba(255,255,255,.05)" strokeWidth="2" /></pattern>
        <linearGradient id={`${id}-thr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF4D8" /><stop offset="0.5" stopColor="#F6C870" /><stop offset="1" stopColor="#D9962A" /></linearGradient>
        <pattern id={`${id}-sat`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(62)"><rect width="7" height="7" fill="none" /><path d="M0 0 L0 7" stroke="rgba(120,72,10,.33)" strokeWidth="2.2" /></pattern>
        <clipPath id={`${id}-cut`}><rect x="0" y="0" width={edge} height={CH} /></clipPath>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.85" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}-tm`}><text x={CW / 2} y={ny + fs * 0.36} textAnchor="middle" fontFamily={pixelFont} fontWeight={900} fontSize={fs} fill="#fff">{name}</text></mask>
      </defs>
      {/* shirt body */}
      <path d="M 0 620 L 0 178 C 70 140 180 96 300 54 C 335 42 356 36 372 32 C 400 92 440 120 480 120 C 520 120 560 92 588 32 C 604 36 625 42 660 54 C 780 96 890 140 960 178 L 960 620 Z" fill={`url(#${id}-fab)`} stroke="#0B1020" strokeWidth="8" strokeLinejoin="round" />
      <path d="M 0 620 L 0 178 C 70 140 180 96 300 54 C 335 42 356 36 372 32 C 400 92 440 120 480 120 C 520 120 560 92 588 32 C 604 36 625 42 660 54 C 780 96 890 140 960 178 L 960 620 Z" fill={`url(#${id}-knit)`} />
      {/* inside of the back neck + rib collar */}
      <path d="M372 32 C 420 6 540 6 588 32 C 560 92 520 120 480 120 C 440 120 400 92 372 32 Z" fill="#161B24" />
      <path d="M372 32 C 400 92 440 120 480 120 C 520 120 560 92 588 32" fill="none" stroke="#454F61" strokeWidth="24" strokeLinecap="round" />
      <path d="M372 32 C 400 92 440 120 480 120 C 520 120 560 92 588 32" fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="24" strokeDasharray="2 6" strokeLinecap="butt" />
      {/* sleeve seams + folds */}
      <path d="M170 98 C 128 260 116 430 118 620" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="3" strokeDasharray="10 8" />
      <path d="M790 98 C 832 260 844 430 842 620" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="3" strokeDasharray="10 8" />
      <path d="M250 560 C 330 520 420 540 470 600" fill="none" stroke="rgba(0,0,0,.22)" strokeWidth="14" strokeLinecap="round" />
      <path d="M640 600 C 690 548 770 540 820 560" fill="none" stroke="rgba(0,0,0,.18)" strokeWidth="12" strokeLinecap="round" />
      {/* embroidery */}
      <g clipPath={`url(#${id}-cut)`}>
        <text x={CW / 2} y={ny + fs * 0.36 + 5} textAnchor="middle" fontFamily={pixelFont} fontWeight={900} fontSize={fs} fill="rgba(0,0,0,.55)">{name}</text>
        <text x={CW / 2} y={ny + fs * 0.36} textAnchor="middle" fontFamily={pixelFont} fontWeight={900} fontSize={fs} fill={`url(#${id}-thr)`} stroke="#5A3A0A" strokeWidth="3" paintOrder="stroke fill">{name}</text>
        <text x={CW / 2} y={ny + fs * 0.36} textAnchor="middle" fontFamily={pixelFont} fontWeight={900} fontSize={fs} fill={`url(#${id}-sat)`}>{name}</text>
      </g>
      {shine >= 0 && shine <= 1 && (
        <g mask={`url(#${id}-tm)`}><rect x={-260 + shine * (CW + 260)} y={ny - fs} width="260" height={fs * 2} fill={`url(#${id}-shine)`} transform={`skewX(-20)`} /></g>
      )}
      {stitch > 0.001 && stitch < 0.999 && (
        <g transform={`translate(${edge} ${ny - 6 + 26 * Math.sin(t * 40)})`}>
          <circle r="34" fill="rgba(255,214,120,.35)" />
          <path d="M0 -70 L0 30" stroke="#E8ECF2" strokeWidth="7" strokeLinecap="round" />
          <circle r="8" fill="#FFF4D8" />
        </g>
      )}
      {/* dashed logo circle (left chest of the wearer = right side of the image) */}
      {logo > 0.001 && (
        <g transform={`translate(770 160) scale(${1.45 * Math.min(1.1, logo)})`}>
          <circle r="78" fill="rgba(255,255,255,.08)" stroke="#FFFFFF" strokeWidth="6" strokeDasharray="16 11" strokeDashoffset={-t * 30} />
          <text y="15" textAnchor="middle" fontFamily={pixelFont} fontWeight={800} fontSize="44" fill="#FFFFFF">Logo?</text>
        </g>
      )}
    </svg>
  );
};

// HTML variant (2026-10-29): the name is ONE html text layer (no layered SVG gradient/pattern text, which the
// long Chrome render rasterised twice at different sizes → doubled + clipped name). No clip once stitching is done.
const ChestHtml: React.FC<{ id: string; name: string; stitch: number; logo: number; t: number; needle: number; glow: number; shine: number; nameMax?: number }> = ({ id, name, stitch, logo, t, needle, glow, shine, nameMax = 112 }) => {
  const fs = Math.min(nameMax, fit([name], 900, nameMax, 780));
  const ny = 330;
  const edge = CW * 0.08 + (CW * 0.84) * stitch;
  const nx = needle >= 0 && needle <= 1 ? CW * 0.1 + CW * 0.8 * needle : stitch > 0.001 && stitch < 0.999 ? edge : -1;
  const sh = shine >= 0 && shine <= 1 ? Math.sin(shine * Math.PI) : 0;
  const g = Math.max(glow, sh);
  return (
    <div style={{ position: "relative", width: CW, height: CH }}>
      <Chest id={id} name="" stitch={0} logo={logo} t={t} />
      <div style={{ position: "absolute", left: 0, top: 0, height: CH, width: stitch >= 0.999 ? CW : edge, overflow: stitch >= 0.999 ? "visible" : "hidden" }}>
        <div style={{ position: "absolute", left: 0, width: CW, top: ny - fs * 0.62, textAlign: "center", fontFamily: pixelFont, fontWeight: 900, fontSize: fs, lineHeight: 1, whiteSpace: "nowrap", color: g > 0.02 ? `rgb(255,${Math.round(214 + 30 * g)},${Math.round(120 + 100 * g)})` : "#F6C870",
          WebkitTextStroke: "3px #5A3A0A", paintOrder: "stroke fill", textShadow: `0 5px 0 rgba(0,0,0,.55)${g > 0.02 ? `, 0 0 ${40 * g}px rgba(255,214,120,${0.9 * g})` : ""}` }}>{name}</div>
      </div>
      {nx >= 0 && (
        <svg width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <g transform={`translate(${nx} ${ny - 6 + 26 * Math.sin(t * 40)})`}>
            <circle r="40" fill="rgba(255,214,120,.4)" />
            <path d="M0 -84 L0 34" stroke="#E8ECF2" strokeWidth="9" strokeLinecap="round" />
            <circle r="10" fill="#FFF4D8" />
          </g>
        </svg>
      )}
    </div>
  );
};

// ---------- small icons ----------
const Icon: React.FC<{ kind: string; size: number }> = ({ kind, size }) => {
  if (kind === "crew5") return (
    <svg width={size} height={size} viewBox="0 0 60 40">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${6 + i * 12} ${i % 2 ? 3 : 0})`}>
          <path d="M-4.2 7 a4.2 4.2 0 0 1 8.4 0 Z" fill={OR} stroke={INK} strokeWidth="1.3" />
          <circle cy="10" r="3.4" fill="#F2C9A0" stroke={INK} strokeWidth="1.3" />
          <path d="M-5 30 V19 a5 5 0 0 1 10 0 V30 Z" fill="#3B4456" stroke={INK} strokeWidth="1.3" />
        </g>
      ))}
    </svg>
  );
  if (kind === "searchLens") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.9" strokeLinecap="round"><circle cx="10" cy="10" r="6.5" fill="#FFF6E8" /><path d="M15 15 L21.5 21.5" strokeWidth="3" /><path d="M7.6 7.6 L12.4 12.4 M12.4 7.6 L7.6 12.4" stroke={RED} strokeWidth="2.2" /></svg>
  );
  if (kind === "shop") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.7" strokeLinejoin="round"><path d="M3 9 L4.5 4 H19.5 L21 9 Z" fill={OR} /><path d="M4 9 V20 H20 V9" fill="#FFF6E8" /><rect x="9.5" y="13" width="5" height="7" fill="#3B4456" /></svg>
  );
  return ( // searchList
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="3" width="15" height="18" rx="2" fill="#FFF6E8" />{[7, 10.5, 14, 17.5].map((y) => <path key={y} d={`M6 ${y} H15`} stroke="rgba(30,26,22,.45)" />)}<circle cx="16" cy="15" r="4.2" fill="#FFF6E8" /><path d="M19 18 L22 21" strokeWidth="2.6" /></svg>
  );
};
const Pill: React.FC<{ text: string; k: number; top: number; bg?: string; rot?: number }> = ({ text, k, top, bg = OR, rot = -2 }) => {
  if (k <= 0.001) return null;
  const fs = fit([text], 800, 76, 900);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", transform: `scale(${Math.min(1.1, k)}) rotate(${rot}deg)` }}>
      <div style={{ display: "inline-block", padding: "8px 36px 14px", borderRadius: 24, background: bg, border: "8px solid #0B1020", boxShadow: "0 9px 0 rgba(0,0,0,.5)", fontFamily: pixelFont, fontWeight: 800, fontSize: fs, color: "#fff", whiteSpace: "nowrap", ...stroke(8) }}>{text}</div>
    </div>
  );
};
const hotSplit = (s: string, hot: string | undefined, col: string, on: boolean) => {
  if (!hot || !on) return s;
  const i = s.toLowerCase().indexOf(hot.toLowerCase());
  if (i < 0) return s;
  return <>{s.slice(0, i)}<span style={{ color: col }}>{s.slice(i, i + hot.length)}</span>{s.slice(i + hot.length)}</>;
};

// ---------- hook ----------
// strong variant (hook.strong, 2026-10-29): every beat is a clearly visible event on the object; status card ≥ 60 px text
const HookStrong: React.FC<{ N: NC; t: number; cover: boolean }> = ({ N, t, cover }) => {
  const S = N.S, H = N.hook;
  const out = cover ? 0 : ease((t - H.out) / (S.hook.outDur ?? 0.35));
  if (out >= 0.999) return null;
  const last = (w: string) => (cover ? undefined : H.beats.filter((b) => b.what === w && t >= b.at).pop());
  const beat = (w: string, d = 0.3) => (cover ? 0 : H.beats.reduce((m, b) => (b.what === w ? Math.max(m, bump(t, b.at + 0.06, d)) : m), 0));
  const zoom = cover ? 1 : 1 + H.beats.filter((b) => b.what === "push").reduce((z, b) => z + 0.025 * ease((t - b.at) / 0.25) + 0.06 * bump(t, b.at + 0.12, 0.28), 0);
  // stitch: needle runs once across the finished name (0.5 s) + gold glow
  const stB = last("stitch"); const stU = stB ? (t - stB.at) / 0.5 : -1;
  const needle = stU >= 0 && stU <= 1 ? stU : -1;
  const glow = stB ? bump(t, stB.at + 0.25, 0.35) : 0;
  // counter: re-counts 0 → count in 0.35 s, big
  const cB = last("counter"); const cU = cB ? cl((t - cB.at) / 0.35) : 1;
  const cnt = cU < 1 ? Math.floor(S.hook.note.count * cU) : S.hook.note.count;
  const bC = beat("counter", 0.4), bS = beat("status", 0.35), bN = beat("note", 0.35), bQ = beat("q", 0.35);
  const reStrike = last("note");
  const fl = (k: number) => (cover ? 0 : Math.sin(t * 2 + k) * 4);
  const note = S.hook.note;
  const sfs = Math.max(60, Math.min(64, fit(S.hook.status, 800, 64, 610)));
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 52%" }}>
      {/* shirt chest */}
      <div style={{ position: "absolute", left: -40, top: 470, width: CW, height: CH, transform: `translateY(${out * 1500 + fl(0)}px) scale(0.98)`, transformOrigin: "50% 0%", filter: "drop-shadow(0 18px 0 rgba(0,0,0,.45)) drop-shadow(0 30px 50px rgba(0,0,0,.5))" }}>
        <Chest id="nch" name={S.name} stitch={1} t={t} html needle={needle} glow={glow} nameMax={84} />
      </div>
      {/* note with struck names (narrower, right) */}
      <div style={{ position: "absolute", left: 792, top: 690, width: 262, transform: `translate(${out * 700}px, ${fl(1)}px) rotate(${4 + 5 * Math.sin(bN * 3)}deg) scale(${1 + 0.1 * bN})`, transformOrigin: "50% 0%", filter: "drop-shadow(0 12px 0 rgba(0,0,0,.45))" }}>
        <div style={{ position: "absolute", left: 70, top: -22, width: 120, height: 44, background: "rgba(245,197,66,.85)", transform: "rotate(-4deg)", zIndex: 2 }} />
        <div style={{ background: "#FBF7EE", border: `7px solid ${INK}`, borderRadius: 18, padding: "18px 16px 14px" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 30, letterSpacing: 2, color: RED }}>{note.title}</div>
          {note.struck.map((n, i) => {
            const k = reStrike ? ease((t - reStrike.at - 0.07 * i) / 0.14) : 1;
            const nfs = Math.min(40, fit([n], 800, 40, 212));
            return (
              <div key={i} style={{ position: "relative", fontFamily: pixelFont, fontWeight: 800, fontSize: nfs, lineHeight: 1.14, color: "rgba(30,26,22,.62)", whiteSpace: "nowrap" }}>
                {n}
                <div style={{ position: "absolute", left: -6, top: "52%", height: 8, width: `${(measure(n, `800 ${nfs}px ${pixelFont}`) / 1.06 + 12) * k}px`, background: RED, borderRadius: 4, transform: `rotate(${i % 2 ? -2 : 2}deg)` }} />
              </div>
            );
          })}
          <div style={{ marginTop: 32, display: "inline-flex", alignItems: "baseline", gap: 8, padding: "4px 12px 10px", borderRadius: 16, background: INK, transform: `scale(${1 + 0.45 * bC})`, transformOrigin: "0% 50%" }}>
            <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 64, color: bC > 0.05 ? YEL : OR, lineHeight: 1, minWidth: 34, display: "inline-block", textAlign: "center" }}>{cnt}</span>
            <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 26, color: "#fff", whiteSpace: "pre-line", lineHeight: 1.05 }}>{`von ${note.total}\n${note.label}`}</span>
          </div>
        </div>
      </div>
      {/* yellow status card (under the shirt, left) — tips in on its beats */}
      <div style={{ position: "absolute", left: 44, top: 1176, transform: `translate(${-out * 900}px, ${fl(2)}px) rotate(${-3 + 7 * bS}deg) scale(${1 + 0.12 * bS})`, transformOrigin: "0% 50%", filter: `drop-shadow(0 10px 0 rgba(0,0,0,.45))${bS > 0.05 ? ` drop-shadow(0 0 ${34 * bS}px rgba(245,197,66,.95))` : ""}` }}>
        <div style={{ background: YEL, border: `7px solid ${INK}`, borderRadius: 22, padding: "12px 26px 16px 26px" }}>
          {S.hook.status.map((x, i) => <div key={i} style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: sfs, color: INK, lineHeight: 1.12, whiteSpace: "nowrap" }}>{x}</div>)}
        </div>
        <div style={{ position: "absolute", left: -30, top: -50, width: 80, height: 80, borderRadius: 40, background: INK, border: `5px solid ${YEL}`, color: YEL, fontFamily: pixelFont, fontWeight: 800, fontSize: 58, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.6 * bQ}) rotate(${14 * Math.sin(bQ * 6)}deg)` }}>?</div>
      </div>
    </div>
  );
};
const HookScene: React.FC<{ N: NC; t: number; cover: boolean }> = ({ N, t, cover }) => {
  if (N.S.hook.strong) return <HookStrong N={N} t={t} cover={cover} />;
  const S = N.S, H = N.hook;
  const out = cover ? 0 : ease((t - H.out) / 0.35);
  if (out >= 0.999) return null;
  const beat = (w: string) => (cover ? 0 : H.beats.reduce((m, b) => (b.what === w ? Math.max(m, bump(t, b.at + 0.05, 0.3)) : m), 0));
  const zoom = cover ? 1 : 1 + H.beats.filter((b) => b.what === "push").reduce((z, b) => z + 0.04 * ease((t - b.at) / 0.25) + 0.05 * bump(t, b.at + 0.1, 0.25), 0);
  const shineB = H.beats.filter((b) => b.what === "stitch").find((b) => t >= b.at && t < b.at + 0.55);
  const shine = shineB && !cover ? (t - shineB.at) / 0.55 : -1;
  const reStrike = H.beats.filter((b) => b.what === "note" && t >= b.at).pop();
  const bC = beat("counter"), bS = beat("status"), bN = beat("note"), bQ = beat("q");
  const fl = (s: number) => (cover ? 0 : Math.sin(t * 2 + s) * 4);
  const note = S.hook.note;
  const qOn = true;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 58%" }}>
      {/* shirt chest */}
      <div style={{ position: "absolute", left: 60, top: 500, width: CW, height: CH, transform: `translateY(${out * 1500 + fl(0)}px) scale(0.98)`, transformOrigin: "50% 0%", filter: "drop-shadow(0 18px 0 rgba(0,0,0,.45)) drop-shadow(0 30px 50px rgba(0,0,0,.5))" }}>
        <Chest id="nch" name={S.name} stitch={1} shine={shine} t={t} />
      </div>
      {/* note with struck names */}
      <div style={{ position: "absolute", left: 684, top: 905, width: 356, transform: `translate(${out * 700}px, ${fl(1)}px) rotate(${4 + 2 * Math.sin(bN * 3)}deg) scale(${1 + 0.06 * bN})`, transformOrigin: "50% 0%", filter: "drop-shadow(0 12px 0 rgba(0,0,0,.45))" }}>
        <div style={{ position: "absolute", left: 130, top: -22, width: 140, height: 44, background: "rgba(245,197,66,.85)", transform: "rotate(-4deg)", zIndex: 2 }} />
        <div style={{ background: "#FBF7EE", border: `7px solid ${INK}`, borderRadius: 18, padding: "22px 26px 18px" }}>
          <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 34, letterSpacing: 2, color: RED }}>{note.title}</div>
          {note.struck.map((n, i) => {
            const k = reStrike && !cover ? ease((t - reStrike.at - 0.04 * i) / 0.18) : 1;
            return (
              <div key={i} style={{ position: "relative", fontFamily: pixelFont, fontWeight: 800, fontSize: 46, lineHeight: 1.12, color: "rgba(30,26,22,.62)", whiteSpace: "nowrap" }}>
                {n}
                <div style={{ position: "absolute", left: -6, top: "52%", height: 8, width: `${(measure(n, `800 46px ${pixelFont}`) / 1.06 + 12) * k}px`, background: RED, borderRadius: 4, transform: `rotate(${i % 2 ? -2 : 2}deg)` }} />
              </div>
            );
          })}
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "baseline", gap: 10, padding: "4px 18px 10px", borderRadius: 16, background: INK, transform: `scale(${1 + 0.5 * bC})`, transformOrigin: "0% 50%" }}>
            <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 64, color: bC > 0.05 ? YEL : OR, lineHeight: 1 }}>{note.count}</span>
            <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 36, color: "#fff" }}>von {note.total} {note.label}</span>
          </div>
        </div>
      </div>
      {/* yellow status card */}
      <div style={{ position: "absolute", left: 46, top: 1092, width: 624, transform: `translate(${-out * 700}px, ${fl(2)}px) rotate(${-3 + 3 * bS}deg) scale(${1 + 0.16 * bS})`, transformOrigin: "0% 50%", filter: `drop-shadow(0 10px 0 rgba(0,0,0,.45))${bS > 0.05 ? ` drop-shadow(0 0 ${30 * bS}px rgba(245,197,66,.9))` : ""}` }}>
        <div style={{ background: YEL, border: `7px solid ${INK}`, borderRadius: 22, padding: "14px 20px 16px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            {S.hook.status.map((s, i) => <div key={i} style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit(S.hook.status, 800, 50, 470), color: INK, lineHeight: 1.14, whiteSpace: "nowrap" }}>{s}</div>)}
          </div>
          {qOn && <div style={{ width: 78, height: 78, borderRadius: 39, background: INK, color: YEL, fontFamily: pixelFont, fontWeight: 800, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.5 * bQ}) rotate(${12 * Math.sin(bQ * 6)}deg)` }}>?</div>}
        </div>
      </div>
    </div>
  );
};

// ---------- recap: neutral card + logo patch ----------
const RecapNote: React.FC<{ N: NC; t: number }> = ({ N, t }) => {
  const R = N.recapCard!;
  const k = back(cl((t - R.at) / 0.4));
  const out = ease((t - R.out - 0.05) / 0.45);
  if (k <= 0.001 || out >= 0.999) return null;
  const pB = bump(t, R.bigAt + 0.08, 0.3), pS = bump(t, R.smallAt + 0.08, 0.3);
  return (
    <div style={{ position: "absolute", left: 704, top: 1040, width: 340, transform: `translate(${out * 80}px, ${out * 140}px) rotate(${3 + (1 - Math.min(1, k)) * 12}deg) scale(${Math.max(0.001, Math.min(1.08, k)) * (1 - 0.25 * out)})`, opacity: 1 - out }}>
      <div style={{ background: CREAM, border: `8px solid ${INK}`, borderRadius: 30, boxShadow: "0 12px 0 rgba(0,0,0,.5)", padding: "12px 16px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit([R.top], 800, 32, 290), whiteSpace: "nowrap", letterSpacing: 1, color: OR }}>{R.top}</div>
        {R.tag && <div style={{ marginTop: 4, padding: "2px 16px 6px", borderRadius: 12, border: `5px solid ${OR}`, color: OR, fontFamily: pixelFont, fontWeight: 800, fontSize: 34, transform: "rotate(-3deg)" }}>{R.tag}</div>}
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit([R.big], 800, 96, 290), color: INK, lineHeight: 1, marginTop: 6, whiteSpace: "nowrap", opacity: t >= R.bigAt - 0.05 ? 1 : 0.15, transform: `scale(${1 + 0.25 * pB})` }}>{R.big}</div>
        <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit([R.small], 800, 44, 290), whiteSpace: "nowrap", color: INK, lineHeight: 1.05, opacity: t >= R.smallAt - 0.05 ? 1 : 0.15, transform: `scale(${1 + 0.25 * pS})` }}>{R.small}</div>
      </div>
    </div>
  );
};
const RecapPatch: React.FC<{ N: NC; t: number }> = ({ N, t }) => {
  const P = N.recapPatch!;
  const k = back(cl((t - P.at) / 0.35));
  const out = cl((t - P.out) / 0.2);
  if (k <= 0.001 || out >= 0.999) return null;
  const p = bump(t, P.pulse + 0.06, 0.3);
  // sits on the shirt of the recap product card (RecapOverlay: card x 40, shirt glyph 180 px, dot at ≈ 146/1150)
  return (
    <div style={{ position: "absolute", left: 146 - 46, top: 1146 - 46, width: 92, height: 92, transform: `scale(${Math.max(0.001, Math.min(1.1, k)) * (1 + 0.35 * p)}) rotate(${-8 + 20 * (1 - Math.min(1, k))}deg)`, opacity: 1 - out }}>
      <svg width="92" height="92" viewBox="0 0 92 92"><circle cx="46" cy="46" r="40" fill="#323A49" stroke={INK} strokeWidth="6" /><circle cx="46" cy="46" r="31" fill="none" stroke="#F6C870" strokeWidth="3" strokeDasharray="5 4" /><text x="46" y="55" textAnchor="middle" fontFamily={pixelFont} fontWeight={900} fontSize="26" fill="#F6C870">LOGO</text></svg>
    </div>
  );
};

// ---------- name wall + winner flight ----------
const GX = [55, 555], GY0 = 362, CWD = 470, CHT = 136, GSTEP = 156;
const WallScene: React.FC<{ N: NC; t: number }> = ({ N, t }) => {
  const W = N.wall, Wn = N.winner;
  const kIn = ease((t - W.at) / 0.3);
  const fade = ease((t - Wn.fly) / 0.35);
  if (fade >= 0.999 && t > Wn.fly + 0.6) return null;
  const struckAt = (i: number) => { const s = W.strikes.find((x) => x.cards.includes(i)); return s ? s : undefined; };
  const count = W.strikes.reduce((n, s) => n + (t >= s.at ? s.cards.length : 0), 0);
  const lastStrike = W.strikes.filter((s) => t >= s.at).pop();
  const cBump = lastStrike ? bump(t, lastStrike.at + 0.12, 0.3) : 0;
  const hlS = W.strikes.find((s) => s.cards.length > 1);
  const push = hlS ? ease((t - W.pushAt) / 0.35) * (1 - ease((t - hlS.at - 0.35) / 0.4)) : 0;
  const dim = ease((t - Wn.dimAt) / 0.3);
  const fly = ease((t - Wn.fly) / 0.35);
  const miniK = W.mini ? back(cl((t - W.mini.at) / 0.35)) : 0;
  const prK = W.proof ? back(cl((t - W.proof.at) / 0.35)) : 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: 1 - fade }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.1 * push})`, transformOrigin: "50% 26%" }}>
          {/* board */}
          <div style={{ position: "absolute", left: 28, top: 212, width: 1024, height: 1090, borderRadius: 46, background: "linear-gradient(180deg, #1D2B52 0%, #111A33 100%)", border: `12px solid ${GOLD}`, boxShadow: "0 18px 0 rgba(0,0,0,.45), 0 30px 60px rgba(0,0,0,.5)", opacity: kIn, transform: `scale(${0.96 + 0.04 * kIn})` }} />
          {/* header: title + counter */}
          <div style={{ position: "absolute", left: 66, top: 236, opacity: kIn }}>
            <div style={{ fontFamily: pixelFont, fontWeight: 900, fontSize: 58, color: "#fff", lineHeight: 1 }}>{W.title}</div>
            {W.sub && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: GOLD, marginTop: 6 }}>{W.sub}</div>}
          </div>
          <div style={{ position: "absolute", right: 66, top: 228, display: "flex", alignItems: "baseline", gap: 10, padding: "4px 22px 12px", borderRadius: 20, background: "#0B1020", border: `6px solid ${cBump > 0.05 ? OR : GOLD}`, transform: `scale(${(0.8 + 0.2 * kIn) * (1 + 0.3 * cBump)})`, transformOrigin: "100% 50%", opacity: kIn }}>
            <span style={{ fontFamily: pixelFont, fontWeight: 900, fontSize: 92, color: count > 0 ? OR : "#fff", lineHeight: 1, minWidth: 56, textAlign: "center" }}>{count}</span>
            <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: "#fff", whiteSpace: "pre-line", lineHeight: 1 }}>{W.label.replace(" ", "\n")}</span>
          </div>
          {/* cards */}
          {W.cards.map((name, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const k = ease((t - W.at - 0.05 - i * 0.04) / 0.32);
            const s = struckAt(i);
            const sk = s ? ease((t - s.at) / 0.2) : 0;
            const hl = s && s.cards.length > 1 ? ease((t - s.hlAt) / 0.25) : 0;
            const mk = s && s.cards.length > 1 ? ease((t - s.markAt) / 0.25) : 0;
            const isWin = i === Wn.card;
            const survivor = !s;
            const dimK = s ? dim : 0;
            const glow = survivor ? dim : 0;
            const nfs = fit([name], 800, 58, CWD - 120);
            let x = GX[col], y = GY0 + row * GSTEP, sc = 1, rot = (i % 3 - 1) * 0.8;
            if (isWin && fly > 0) { // winner card flies to the chest
              x = x + (540 - CWD / 2 - x) * fly; y = y + (760 - y) * fly; sc = 1 + 0.5 * fly; rot = rot * (1 - fly);
            }
            const wOp = isWin ? 1 - ease((t - Wn.fly - 0.3) / 0.25) : 1;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, width: CWD, height: CHT, opacity: Math.min(k, 1 - 0.68 * dimK) * (isWin ? wOp / Math.max(0.001, 1 - fade) * (1 - fade) + (isWin ? fade * wOp : 0) : 1), transform: `translateX(${(1 - k) * -260}px) rotate(${rot}deg) scale(${sc * (1 + 0.05 * bump(t, s ? s.at + 0.05 : -9, 0.25))})`, zIndex: isWin ? 5 : 1 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: sk > 0.5 ? "#F1E4E2" : CREAM, border: `7px solid ${hl > 0.05 && sk < 0.5 ? OR : survivor && glow > 0.05 ? GOLD : INK}`, boxShadow: `0 9px 0 rgba(0,0,0,.45)${hl > 0.05 && sk < 0.5 ? `, 0 0 ${34 * hl}px rgba(255,107,53,.85)` : ""}${glow > 0.05 ? `, 0 0 ${40 * glow}px rgba(232,182,76,.8)` : ""}` }} />
                <div style={{ position: "absolute", left: 22, top: s ? 14 : 0, bottom: s ? undefined : 0, display: "flex", alignItems: "center", height: s ? 64 : undefined }}>
                  <span style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: nfs, color: sk > 0.5 ? "rgba(30,26,22,.5)" : INK, whiteSpace: "nowrap", position: "relative" }}>
                    {hotSplit(name, W.hot, OR, hl > 0.05 && sk < 0.5)}
                    {mk > 0 && sk < 0.5 && W.hot && <span style={{ position: "absolute", left: 0, right: 0, bottom: -6, height: 7, background: OR, borderRadius: 4, transform: `scaleX(${mk})`, transformOrigin: "0 50%" }} />}
                    {sk > 0 && <span style={{ position: "absolute", left: -8, top: "48%", height: 9, width: `calc(${sk * 100}% + 16px)`, background: RED, borderRadius: 5, transform: `rotate(${i % 2 ? -3 : 2}deg)` }} />}
                  </span>
                </div>
                {s && sk > 0 && <div style={{ position: "absolute", left: 22, top: 82, fontFamily: pixelFont, fontWeight: 800, fontSize: fit([s.why], 800, 34, CWD - 46), color: RED, whiteSpace: "nowrap", opacity: sk }}>{s.why}</div>}
                <div style={{ position: "absolute", right: 16, top: 12, fontFamily: pixelFont, fontWeight: 800, fontSize: 28, color: "rgba(30,26,22,.35)" }}>{i + 1}</div>
              </div>
            );
          })}
          {/* mini card + proof tile */}
          {W.mini && miniK > 0.001 && (
            <div style={{ position: "absolute", left: 52, top: 1150, width: 560, transform: `scale(${Math.min(1.08, miniK)}) rotate(-2deg)`, transformOrigin: "30% 50%" }}>
              <div style={{ background: CREAM, border: `7px solid ${INK}`, borderRadius: 24, boxShadow: "0 9px 0 rgba(0,0,0,.45)", padding: "10px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <Icon kind="shop" size={92} />
                <div>
                  <div style={{ fontFamily: pixelFont, fontWeight: 900, fontSize: 52, color: OR, lineHeight: 1 }}>{W.mini.big}</div>
                  <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit([W.mini.small], 800, 32, 400), color: INK, marginTop: 4, whiteSpace: "nowrap" }}>{W.mini.small}</div>
                </div>
              </div>
            </div>
          )}
          {W.proof && prK > 0.001 && (() => {
            const [cx, cy, cw, ch] = W.proof.crop;
            const TW = 400, TH = Math.round(TW * ch / cw);
            return (
              <div style={{ position: "absolute", left: 636, top: 1146, width: TW, transform: `scale(${Math.min(1.08, prK)}) rotate(2.5deg)`, transformOrigin: "60% 50%" }}>
                <div style={{ width: TW, height: TH, overflow: "hidden", borderRadius: 14, border: `6px solid ${INK}`, boxShadow: "0 8px 0 rgba(0,0,0,.45)", position: "relative", background: "#1F1F1E" }}>
                  <Img src={staticFile(W.proof.src)} style={{ position: "absolute", left: -cx * TW / cw, top: -cy * TH / ch, width: 1180 * TW / cw }} />
                  <div style={{ position: "absolute", inset: 0, border: `5px solid ${OR}`, borderRadius: 10 }} />
                </div>
                {W.proof.label && <div style={{ position: "absolute", left: 14, top: -24, padding: "0 12px 4px", borderRadius: 10, background: INK, color: "#fff", fontFamily: pixelFont, fontWeight: 800, fontSize: 26 }}>{W.proof.label}</div>}
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
};

// ---------- shirt stage (winner → why → fields → next) ----------
type Place = { y: number; s: number };
const stagePlace = (N: NC, t: number): Place & { o: number } => {
  const keys: [number, Place][] = [
    [N.winner.fly, { y: 790, s: 1 }],
    [N.why.at, N.S.stage?.why ?? { y: 345, s: 0.5 }],
    [N.fields.at, N.S.stage?.fields ?? { y: 370, s: 0.58 }],
    [N.next.at, { y: 650, s: 0.8 }],
    [N.end, { y: -600, s: 0.6 }],
  ];
  if (t < keys[0][0]) return { y: 2000, s: 0.9, o: 0 };
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (t >= keys[k][0]) i = k;
  const [a, to] = keys[i];
  const from = i > 0 ? keys[i - 1][1] : { y: 1700, s: 0.9 };
  const f = i === 0 ? back(cl((t - a) / 0.45)) : ease((t - a) / 0.45);
  return { y: from.y + (to.y - from.y) * f, s: from.s + (to.s - from.s) * Math.min(1, f), o: 1 };
};
const Stage: React.FC<{ N: NC; t: number }> = ({ N, t }) => {
  const S = N.S, Wn = N.winner, Y = N.why, F = N.fields, X = N.next;
  const p = stagePlace(N, t);
  const cut = !!X.cut;
  if (p.o <= 0 || t > N.end + 0.5 || (cut && t >= N.end)) return null;
  const G = N.S.stage ?? {};
  const stitch = ease((t - Wn.fly - 0.3) / 0.6);
  const stK = cl((t - Wn.stampAt) / 0.16);
  const logo = back(cl((t - X.logoAt) / 0.4));
  const fl = Math.sin(t * 1.7) * 4;
  // why cards
  const whyOut = G.whyOutLead ? ease((t - F.pillAt + G.whyOutLead) / 0.25) : ease((t - F.pillAt) / 0.35); // whyOutLead (optional): why cards are gone before the next pill pops (no pill over pill)
  const fieldsOut = ease((t - X.at) / 0.35);
  const nextOut = cut ? (t >= N.end ? 1 : 0) : ease((t - N.end) / 0.3);
  const shirtEl = (
      <div style={{ position: "absolute", left: 540 - CW / 2, top: p.y - CH / 2 + fl, width: CW, height: CH, transform: `scale(${p.s})`, transformOrigin: "50% 50%", filter: "drop-shadow(0 18px 0 rgba(0,0,0,.45)) drop-shadow(0 30px 50px rgba(0,0,0,.5))" }}>
        <Chest id="ncs" name={S.name} stitch={stitch} logo={logo} t={t} html={!!N.S.stage} />
        {stK > 0 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: G.stampTop ?? 452, textAlign: "center", transform: `rotate(-6deg) scale(${(G.stampFrom ?? 2.2) - ((G.stampFrom ?? 2.2) - 1) * ease(stK)})`, opacity: Math.min(1, stK * 3) }}>
            <div style={{ display: "inline-block", padding: "6px 30px 12px", borderRadius: 18, border: `9px solid ${OR}`, background: "rgba(255,253,248,.96)", color: OR, fontFamily: pixelFont, fontWeight: 800, fontSize: 70, lineHeight: 1, letterSpacing: 3, boxShadow: "0 8px 0 rgba(0,0,0,.35)" }}>{Wn.stamp}</div>
          </div>
        )}
      </div>
  );
  return (
    <>
      {/* bursts on the landing */}
      {t > Wn.fly + 0.25 && t < Wn.fly + 1.4 && Array.from({ length: 18 }, (_, i) => {
        const u = (t - Wn.fly - 0.25) / 1.15, a = (i / 18) * Math.PI * 2 + i;
        const r = 120 + 520 * ease(u);
        return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * r - 9, top: 790 + Math.sin(a) * r * 0.8 - 9, width: 18, height: 18, borderRadius: i % 3 ? 4 : 9, background: [OR, GOLD, "#fff", "#2FBF71"][i % 4], opacity: 1 - u, transform: `rotate(${i * 40 + u * 200}deg)` }} />;
      })}
      {!G.shirtOnTop && shirtEl}
      {/* WHY */}
      {t >= Y.at && whyOut < 0.999 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - whyOut, transform: `translateY(${whyOut * 120}px)` }}>
          <Pill text={Y.pill} k={back(cl((t - Y.pillAt + 0.05) / 0.4))} top={530} />
          {Y.cards.map((c, i) => {
            const k = back(cl((t - c.at + 0.08) / 0.4));
            if (k <= 0.001) return null;
            const newest = !Y.cards[i + 1] || t < Y.cards[i + 1].at - 0.08;
            const smallK = t >= c.smallAt - 0.05 ? 1 : 0;
            const hotOn = t >= c.hotAt;
            const stamped = c.stampAt >= 0;
            const stK2 = stamped ? cl((t - c.stampAt) / 0.16) : 1;
            const big = fit(c.lines, 800, 64, 700);
            return (
              <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 650 + i * 212, height: 192, transform: `translateX(${(1 - Math.min(1, k)) * (i % 2 ? 340 : -340)}px) scale(${Math.max(0.001, Math.min(1.06, k)) * (1 + 0.05 * bump(t, c.at + 0.15, 0.3))}) rotate(${(i - 1) * 0.9}deg)` }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 32, background: CREAM, border: `8px solid ${newest ? OR : INK}`, boxShadow: `0 11px 0 rgba(0,0,0,.5)${newest ? ", 0 0 30px rgba(255,107,53,.45)" : ""}` }} />
                <div style={{ position: "absolute", left: 22, top: 26, width: 140, height: 140, borderRadius: 26, background: "#F1ECE2", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon kind={c.icon} size={c.icon === "crew5" ? 134 : 112} /></div>
                <div style={{ position: "absolute", left: 186, right: 90, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {stamped && stK2 <= 0 && c.small && <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit([c.small], 800, 52, 680), color: INK, whiteSpace: "nowrap" }}>{c.small}</div>}
                  {stK2 > 0 && c.lines.map((ln, j) => (
                    <div key={j} style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: big, lineHeight: 1.06, color: stamped ? OR : INK, whiteSpace: "nowrap", transform: stamped ? `scale(${2 - ease(stK2)}) rotate(${-3 * (1 - ease(stK2))}deg)` : undefined, transformOrigin: "0% 50%" }}>
                      {hotSplit(ln, c.hot, OR, hotOn)}
                    </div>
                  ))}
                  {c.small && (!stamped || stK2 > 0) && <div style={{ fontFamily: pixelFont, fontWeight: 700, fontSize: fit([c.small], 700, 40, 680), color: "#4E4840", marginTop: 6, whiteSpace: "nowrap", opacity: smallK, transform: `scale(${1 + 0.15 * bump(t, c.smallAt + 0.06, 0.3)})`, transformOrigin: "0% 50%" }}>{c.small}</div>}
                </div>
                <div style={{ position: "absolute", right: 22, top: 62, width: 60, height: 60, borderRadius: 30, background: OR, border: `5px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: pixelFont, fontWeight: 800, fontSize: 34, color: "#fff" }}>{i + 1}</div>
              </div>
            );
          })}
        </div>
      )}
      {/* FIELDS */}
      {t >= F.pillAt - 0.1 && fieldsOut < 0.999 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - fieldsOut }}>
          <Pill text={F.pill} k={back(cl((t - F.pillAt + 0.05) / 0.4))} top={576} bg={YEL} />
          {F.items.map((f, i) => {
            const k = back(cl((t - f.at + 0.06) / 0.38));
            if (k <= 0.001) return null;
            const sk = cl((t - f.statusAt) / 0.16);
            const yel = f.tone === "yellow";
            return (
              <div key={i} style={{ position: "absolute", left: 50, right: 50, top: 700 + i * 196, height: 172, transform: `translateY(${(1 - Math.min(1, k)) * 60}px) scale(${Math.max(0.001, Math.min(1.05, k))})`, opacity: Math.min(1, k * 2) }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: yel ? CREAM : GREY, border: `8px solid ${INK}`, boxShadow: "0 10px 0 rgba(0,0,0,.5)" }} />
                <div style={{ position: "absolute", left: 30, top: 0, bottom: 0, width: 560, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: fit([f.label], 800, 60, 450), color: yel ? INK : "rgba(30,26,22,.62)", whiteSpace: "nowrap" }}>{f.label}</div>
                  {f.note && <div style={{ fontFamily: pixelFont, fontWeight: 700, fontSize: 32, color: "#6E675E", opacity: sk, marginTop: 4, whiteSpace: "nowrap" }}>{f.note}</div>}
                </div>
                {yel ? (
                  <div style={{ position: "absolute", right: 24, top: 22, bottom: 22, width: 360, borderRadius: 22, background: YEL, border: `6px solid ${INK}`, display: "flex", alignItems: "center", gap: 10, padding: "0 14px" }}>
                    <div style={{ width: 84, height: 84, borderRadius: 42, background: INK, color: YEL, fontFamily: pixelFont, fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.4 * bump(t, f.at + 0.15, 0.3)})`, flexShrink: 0 }}>?</div>
                    <div style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: 40, lineHeight: 1.02, color: INK, opacity: sk, transform: `scale(${1 + 0.2 * bump(t, f.statusAt + 0.06, 0.3)})`, whiteSpace: "pre-line" }}>{f.status.replace(" ", "\n")}</div>
                  </div>
                ) : sk > 0 ? (
                  <div style={{ position: "absolute", right: 30, top: 34, transform: `rotate(-7deg) scale(${2.2 - 1.2 * ease(sk)})`, opacity: Math.min(1, sk * 3) }}>
                    <div style={{ padding: "6px 20px 10px", borderRadius: 14, border: `7px solid ${INK}`, background: "rgba(255,255,255,.9)", color: INK, fontFamily: pixelFont, fontWeight: 800, fontSize: 40, lineHeight: 1, whiteSpace: "nowrap", letterSpacing: 1 }}>{f.status.toUpperCase()}</div>
                  </div>
                ) : (
                  <div style={{ position: "absolute", right: 30, top: 44, fontFamily: pixelFont, fontWeight: 800, fontSize: 70, color: "rgba(30,26,22,.25)" }}>?</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* NEXT */}
      {t >= X.at && nextOut < 0.999 && (() => {
        const lk = back(cl((t - X.linesAt + 0.05) / 0.4));
        const mk = X.mark ? ease((t - X.mark.at) / 0.25) : 0;
        const qfs = fit(X.lines, 800, 64, 880);
        return (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - nextOut }}>
            <Pill text={X.pill} k={back(cl((t - X.pillAt + 0.05) / 0.4))} top={232} />
            {lk > 0.001 && (
              <div style={{ position: "absolute", left: 50, right: 50, top: 990, transform: `scale(${Math.min(1.06, lk)}) rotate(-1deg)`, transformOrigin: "50% 0%" }}>
                <div style={{ background: CREAM, border: `8px solid ${INK}`, borderRadius: 32, boxShadow: "0 11px 0 rgba(0,0,0,.5)", padding: "22px 30px 26px", textAlign: "center" }}>
                  {X.lines.map((ln, j) => (
                    <div key={j} style={{ fontFamily: pixelFont, fontWeight: 800, fontSize: qfs, lineHeight: 1.12, color: INK, whiteSpace: "nowrap" }}>
                      {X.mark && ln.includes(X.mark.word) ? (() => {
                        const i0 = ln.indexOf(X.mark!.word);
                        return <>{ln.slice(0, i0)}<span style={{ position: "relative", display: "inline-block" }}><span style={{ position: "absolute", left: -6, right: -6, top: "12%", bottom: "4%", background: `rgba(255,107,53,${0.9 * mk})`, borderRadius: 10, transform: `scaleX(${mk})`, transformOrigin: "0 50%" }} /><span style={{ position: "relative", color: mk > 0.5 ? "#fff" : INK }}>{X.mark!.word}</span></span>{ln.slice(i0 + X.mark!.word.length)}</>;
                      })() : ln}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
      {G.shirtOnTop && shirtEl}
    </>
  );
};

export const NameCheckLayer: React.FC<{ tl: TL; t: number; cover: boolean; part?: "hook" | "rest" }> = ({ tl, t: t0, cover, part }) => {
  const N = useNC(tl);
  if (!N) return null;
  const t = cover ? Math.min(t0, N.hook.out - 0.3) : t0;
  return (
    <>
      {part !== "rest" && t < N.hook.out + 0.4 && <HookScene N={N} t={t} cover={cover} />}
      {part !== "hook" && <>
      {!cover && N.recapCard && t >= N.recapCard.at - 0.05 && t < N.recapCard.out + 0.6 && <RecapNote N={N} t={t} />}
      {!cover && N.recapPatch && t >= N.recapPatch.at - 0.05 && t < N.recapPatch.out + 0.3 && <RecapPatch N={N} t={t} />}
      {!cover && t >= N.wall.at - 0.05 && t < N.winner.fly + 0.7 && <WallScene N={N} t={t} />}
      {!cover && t >= N.winner.fly - 0.05 && t < N.end + 0.5 && <Stage N={N} t={t} />}
      </>}
    </>
  );
};
