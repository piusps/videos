import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-gewerbemiete/captions.json";
import { PixelBot, BotProp, BotHat } from "../components/PixelBot";
import { GreenRoomPlate, LandlordPlate, OfficePlate, PlazaPlate, StorefrontPlate, PLAZA_DOOR, PLAZA_SHOP } from "../components/PixelTown";

// FP-N "Gewerbemiete" (Henri 2026-10-23), rebuilt 1:1 in the @opusjake B-roll style: off-white top panel (770 px)
// with wide pixel-world cards, anthracite mono caption pill on the seam, face below; some beats drop the face
// (cards only, or a fullscreen pixel town). Pixel plates are procedural SVG (PixelTown), mascot = our PixelBot.
// Times anchored to runs/fpn-gewerbemiete/captions.json (tightened timeline).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 770;
const SEAM = 762;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const MI_END = LAST_END + 0.7;
export const MI_FRAMES = Math.round(MI_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  anwalt: at("anwalt", 0), gewerbe: at("gewerbemietvertrags"), schnell: at("schnell"), fuenf: at("fünfhundert"), euro: at("euro"),
  claude: at("claude", 0), vorarbeit: at("vorarbeit"), zehn: at("zehn"), minuten: at("minuten"),
  s0: at("schritt", 0), laedst: at("lädst"), vertrag: at("vertrag"), pdf: at("pdf"), hoch: at("hoch"), und0: at("und", 0),
  markiert: at("markiert"), jede: at("jede", 0), klausel0: at("klausel", 0), geld: at("geld"), kosten: at("kosten"),
  zum: at("zum"), index: at("indexmiete"), ohne: at("ohne"), ober: at("obergrenze"), oder: at("oder"), neben: at("nebenkosten"),
  komplett: at("komplett"), umgelegt: at("umgelegt"), werden: at("werden"),
  s1: at("schritt", 1), erklaert: at("erklärt"), einfachem: at("einfachem"), deutsch: at("deutsch"), klausel1: at("klausel", 1),
  schlimm: at("schlimmsten"), fall: at("fall"), bedeutet: at("bedeutet"), mit: at("mit", 0), konkret: at("konkretem"), betrag: at("betrag"),
  und1: at("und", 1), jetzt: at("jetzt"), trick: at("trick"),
  s2: at("schritt", 2), schreibt: at("schreibt"), kritische: at("kritische"), klausel2: at("klausel", 2), gegen: at("gegenvorschlag"),
  vermieter: at("vermieter"), direkt: at("direkt"), schicken: at("schicken"),
  den: at("den", 2), anwalt1: at("anwalt", 1), letzten: at("letzten"), blick: at("blick"), nicht: at("nicht"), ganze: at("ganze"), arbeit: at("arbeit"),
  genauen: at("genauen"), prompts: at("prompts"), checkliste: at("checkliste"), klauseln: at("klauseln"), guide: at("guide"),
  komm: at("kommentiere"), miete: at("miete"), folg: at("folg"),
};

const C = {
  bg: "#F1EFEA", grid: "rgba(0,0,0,0.035)", ink: "#151515", dim: "#8A877F", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#E5484D", redSoft: "#FDE8E8",
  chip: "#141414", pill: "#2B2B2B", term: "#17161A", gold: "#F5C542", blue: "#3E8EF7",
};
const MONO = "JetBrains Mono";
const PIXEL = "Silkscreen";
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.03 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };
const eur = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";

const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?:]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];
const camera = (t: number, from: number, to: number) => {
  const s = SENT.filter((x) => x >= from && x < to);
  if (!s.length) s.push(from);
  const amt = Math.min(0.03, 0.075 / s.length);
  let sc = 1;
  s.forEach((a, i) => {
    const b = i + 1 < s.length ? s[i + 1] : to;
    sc += amt * interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  });
  return sc;
};

// ---------- building blocks ----------
const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: 16, boxShadow: shadow, ...style }}>{children}</div>
);
// the opusjake wide card: 900 x 440, holds one 180 x 88 pixel plate at 5 px per cell
const CARD = { x: 90, y: 255, w: 900, h: 440, cell: 5 };
const PixelCard: React.FC<{ plate: React.ReactNode; top?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ plate, top = CARD.y, style, children }) => (
  <div style={{ position: "absolute", left: CARD.x, top, width: CARD.w, height: CARD.h, borderRadius: 16, overflow: "hidden", boxShadow: shadow, ...style }}>
    {plate}
    {children}
  </div>
);
const LabelChip: React.FC<{ text: string; dot?: string; style?: React.CSSProperties; size?: number }> = ({ text, dot = C.orange, style, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: fonts.semibold, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Tag: React.FC<{ text: string; color: string; size?: number; style?: React.CSSProperties }> = ({ text, color, size = 18, style }) => (
  <span style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: color, padding: `${size * 0.33}px ${size * 0.55}px ${size * 0.33}px ${size * 0.66}px`, borderRadius: 8, whiteSpace: "nowrap", ...style }}>{text}</span>
);
const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.claude.d} fill={SIMPLE_ICONS.claude.hex} /></svg>
);
const Check: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
);
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", color, border: `${size * 0.09}px solid ${color}`, borderRadius: 12, padding: `${size * 0.08}px ${size * 0.3}px`, background: "rgba(255,255,255,0.92)", whiteSpace: "nowrap", zIndex: 5, ...style }}>{text}</div>;
};
const PixelText: React.FC<{ text: string; size: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, size, color = "#FFF", bg = "#2C2420", style }) => (
  <div style={{ fontFamily: PIXEL, fontSize: size, color, background: bg, padding: `${size * 0.25}px ${size * 0.45}px`, border: `${Math.max(4, size * 0.09)}px solid ${C.gold}`, boxShadow: `0 ${size * 0.12}px 0 #6B4528`, whiteSpace: "nowrap", lineHeight: 1, ...style }}>{text}</div>
);
// ribbon = the opusjake mono label that lands on a card (dark or coloured, slight tilt)
const Ribbon: React.FC<{ t: number; at: number; text: string; bg: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, bg, size = 40, rot = -3, style }) => {
  if (t < a) return null;
  const u = t - a;
  return (
    <div style={{ position: "absolute", zIndex: 8, ...style }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: bg, borderRadius: 12, padding: `${size * 0.26}px ${size * 0.5}px`, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,0.25)", transform: `rotate(${rot}deg) scale(${interpolate(u, [0, 0.16], [1.9, 1], { ...clamp, easing: Easing.out(Easing.cubic) })})`, opacity: k(t, a, 0.08) }}>{text}</div>
    </div>
  );
};
const Bot: React.FC<{ t: number; prop?: BotProp; hat?: BotHat; px?: number; x: number; y: number; a?: number; flip?: boolean; seed?: number; grey?: boolean; color?: string; hopAmp?: number; style?: React.CSSProperties }> = ({ t, prop = "none", hat = "none", px = 7, x, y, a = -1, flip, seed = 0, grey, color, hopAmp = 8, style }) => {
  const st = a >= 0 ? popStyle(t, a, 26, 0.3) : {};
  const hop = Math.abs(Math.sin(t * 5 + seed)) * -hopAmp;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ transform: `translateY(${hop}px)` }}><PixelBot px={px} t={t} prop={prop} hat={hat} flip={flip} seed={seed} grey={grey} color={color} /></div>
    </div>
  );
};
// a white pixel paper (invoice / letter) with a dark outline
const PixelPaper: React.FC<{ w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, style, children }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#FFFDF6", border: "6px solid #2C2420", boxShadow: "8px 8px 0 rgba(0,0,0,0.25)", boxSizing: "border-box", padding: "18px 20px", fontFamily: PIXEL, color: "#2C2420", ...style }}>{children}</div>
);

// ---------- claude.ai pieces (recreated light UI, real English labels) ----------
const CL = { page: "#FAF9F5", border: "#E3DFD5", text: "#1F1E1D", sub: "#77746C", send: "#C96442", bubble: "#F0EEE6", hover: "#F2EFE8" };
type PP = { x: number; y: number; at: number; click?: boolean };
const Pointer: React.FC<{ t: number; path: PP[]; size?: number }> = ({ t, path, size = 50 }) => {
  if (t < path[0].at - 0.25) return null;
  let x = path[0].x, y = path[0].y;
  for (let j = 1; j < path.length; j++) {
    const mv = Math.min(0.45, (path[j].at - path[j - 1].at) * 0.85);
    const q = interpolate(t, [path[j].at - mv, path[j].at - 0.03], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    if (q <= 0) break;
    x = path[j - 1].x + (path[j].x - path[j - 1].x) * q;
    y = path[j - 1].y + (path[j].y - path[j - 1].y) * q - Math.sin(q * Math.PI) * 26;
  }
  const hit = path.reduce((acc, p) => (p.click && t >= p.at && t - p.at < 0.45 ? p : acc), null as null | PP);
  const r = hit ? (t - hit.at) / 0.45 : 1;
  const dip = hit && r < 0.25 ? 0.84 : 1;
  const s = size / 36;
  return (
    <>
      {hit ? <div style={{ position: "absolute", left: hit.x - 34 * (0.3 + r), top: hit.y - 34 * (0.3 + r), width: 68 * (0.3 + r), height: 68 * (0.3 + r), borderRadius: "50%", border: `4px solid ${C.orange}`, background: "rgba(217,119,87,0.12)", opacity: 1 - r, zIndex: 60 }} /> : null}
      <svg width={28 * s} height={36 * s} viewBox="0 0 28 36" style={{ position: "absolute", left: x - 3 * s, top: y - 2 * s, zIndex: 61, opacity: k(t, path[0].at - 0.25, 0.15), transform: `scale(${dip})`, transformOrigin: "10% 5%", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))", overflow: "visible" }}>
        <path d="M3 2 L3 29 L10 22.5 L14.6 33 L19.2 31 L14.8 20.8 L24 20.8 Z" fill="#FFF" stroke="#111" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </>
  );
};
const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 26, color = CL.text, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const I = {
  plus: "M12 5v14M5 12h14",
  clip: "M20 11.5l-8.2 8.2a5 5 0 01-7.1-7.1l8.6-8.6a3.4 3.4 0 014.8 4.8l-8.6 8.6a1.7 1.7 0 01-2.4-2.4l7.9-7.9",
  cam: "M4 8h3l2-2.5h6L17 8h3v11H4zM12 16.5a3.3 3.3 0 100-6.6 3.3 3.3 0 000 6.6z",
  drive: "M8.5 3.5h7l6 10.5-3.5 6H6L2.5 14zM8.5 3.5L15 14.5M15.5 3.5L9 14.5M2.5 14h13",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.6 2.5 3.8 5.5 3.8 9s-1.2 6.5-3.8 9c-2.6-2.5-3.8-5.5-3.8-9S9.4 5.5 12 3z",
  up: "M12 19V6M6 11.5L12 5.5l6 6",
  chev: "M6 9l6 6 6-6",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
};
const SendBtn: React.FC<{ size?: number; on?: boolean }> = ({ size = 52, on = true }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: CL.send, opacity: on ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={I.up} size={size * 0.56} color="#FFF" sw={2.4} /></div>
);
const FileChip: React.FC<{ name: string; meta?: string; size?: number }> = ({ name, meta = "PDF", size = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 * size, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 12 * size, padding: `${8 * size}px ${16 * size}px ${8 * size}px ${8 * size}px` }}>
    <div style={{ width: 40 * size, height: 46 * size, borderRadius: 8 * size, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.doc} size={26 * size} color={C.orange} sw={2} /></div>
    <div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 21 * size, color: CL.text, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 14 * size, color: CL.sub, letterSpacing: "0.08em" }}>{meta}</div>
    </div>
  </div>
);
const Composer: React.FC<{ w: number; h: number; text: string; placeholder?: string; caret?: boolean; file?: React.ReactNode; plusOn?: boolean; sendOn?: boolean; fs?: number; style?: React.CSSProperties }> = ({ w, h, text, placeholder = "Wie kann ich dir heute helfen?", caret, file, plusOn, sendOn, fs = 28, style }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 26, boxShadow: "0 14px 34px rgba(20,20,20,0.07)", boxSizing: "border-box", padding: "20px 22px 18px 26px", display: "flex", flexDirection: "column", ...style }}>
    {file ? <div style={{ marginBottom: 12 }}>{file}</div> : null}
    <div style={{ fontFamily: fonts.medium, fontSize: fs, color: text ? CL.text : CL.sub, lineHeight: 1.3, flex: 1, overflow: "hidden" }}>
      {text || placeholder}
      {caret ? <span style={{ display: "inline-block", width: 3, height: fs * 1.05, background: C.orange, marginLeft: 3, verticalAlign: "middle" }} /> : null}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, border: `1.5px solid ${CL.border}`, background: plusOn ? CL.hover : "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.plus} size={26} /></div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>Opus 5.5 <Ico d={I.chev} size={18} color={CL.sub} /></div>
      <SendBtn on={sendOn} />
    </div>
  </div>
);
const ClaudeWin: React.FC<{ title: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ title, style, children }) => (
  <div style={{ position: "absolute", background: CL.page, borderRadius: 16, boxShadow: shadow, overflow: "hidden", border: `1px solid ${CL.border}`, ...style }}>
    <div style={{ height: 58, display: "flex", alignItems: "center", gap: 12, padding: "0 22px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
      <ClaudeMark size={28} />
      <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, whiteSpace: "nowrap" }}>{title}</span>
      <Ico d={I.chev} size={18} color={CL.sub} />
      <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 15, letterSpacing: "0.1em", color: CL.sub }}>CLAUDE.AI</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 58, bottom: 0 }}>{children}</div>
  </div>
);

// ============ scenes (split scenes draw in panel coords 1080 x 770, page/full scenes in frame coords) ============

// 1 · hook: the lawyer at his desk, the contract lands
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const c = CARD.cell;
  const paper = k(t, A.gewerbe - 0.1, 0.35, Easing.out(Easing.back(1.4)));
  return (
    <>
      <PixelCard plate={<OfficePlate cell={c} />}>
        <div style={{ position: "absolute", left: 90 * c - 40, top: 38 * c - 72, width: 160, height: 74, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 4, top: 4 }}><PixelBot px={6} t={t} hat="glasses" prop="pen" /></div>
        </div>
        <div style={{ position: "absolute", left: 90 * c - 120 + (1 - paper) * 360, top: 44 * c - 10 - (1 - paper) * 200, transform: `rotate(${-6 + paper * 4}deg)`, opacity: k(t, A.gewerbe - 0.1, 0.1) }}>
          <PixelPaper w={150} h={60} style={{ padding: "8px 10px", fontSize: 13, lineHeight: 1.2 }}>MIETVERTRAG<div style={{ height: 6, marginTop: 6, background: "#C9C2B4", width: "80%" }} /></PixelPaper>
        </div>
        <div style={{ position: "absolute", left: 90 * c + 70, top: 28, ...popStyle(t, A.anwalt, 12, 0.6) }}><PixelText text="ANWALT" size={30} /></div>
      </PixelCard>
    </>
  );
};
// frame 0 hook lines (visible without animation at t=0)
const HookLines: React.FC<{ t: number }> = ({ t }) => {
  const out = k(t, A.schnell - 0.2, 0.2);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 1 - out, zIndex: 9 }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, letterSpacing: "0.1em", color: "#FFF", background: C.pill, borderRadius: 14, padding: "12px 30px" }}>MIETVERTRAG PRÜFEN</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: MONO, fontWeight: 800, fontSize: 46, letterSpacing: "0.08em" }}>
        <span style={{ position: "relative", color: C.red, background: "#FFF", borderRadius: 12, padding: "6px 20px", boxShadow: shadow }}>500 €<span style={{ position: "absolute", left: 10, right: 10, top: "52%", height: 6, background: C.red, transform: "rotate(-8deg)" }} /></span>
        <span style={{ color: C.ink }}>→</span>
        <span style={{ color: "#FFF", background: C.orange, borderRadius: 12, padding: "6px 20px" }}>10 MINUTEN</span>
      </div>
    </div>
  );
};

// 2 · the invoice counts up to 500 €
const SceneRechnung: React.FC<{ t: number }> = ({ t }) => {
  const v = interpolate(t, [A.schnell + 0.15, A.fuenf + 0.45], [0, 500], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sh = shakeAt(t, A.euro, 7);
  return (
    <PixelCard plate={<GreenRoomPlate cell={CARD.cell} />}>
      <Bot t={t} x={110} y={238} px={8} hat="glasses" prop="letter" seed={1} />
      <PixelPaper w={360} h={380} style={{ left: 270, top: 30, ...popStyle(t, A.schnell, 30, 0.6) }}>
        <div style={{ fontSize: 34, lineHeight: 1 }}>RECHNUNG</div>
        <div style={{ fontSize: 17, color: "#8A877F", marginTop: 10 }}>KANZLEI · MIETRECHT</div>
        <div style={{ height: 4, background: "#2C2420", margin: "16px 0" }} />
        <div style={{ fontSize: 19, display: "flex", justifyContent: "space-between" }}><span>PRÜFUNG</span><span>1×</span></div>
        <div style={{ fontSize: 15, color: "#8A877F", marginTop: 6 }}>GEWERBEMIETVERTRAG</div>
        <div style={{ height: 10, background: "#E8E2D4", marginTop: 18, width: "85%" }} />
        <div style={{ height: 10, background: "#E8E2D4", marginTop: 10, width: "60%" }} />
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 22, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 20 }}>SUMME</span>
          <span style={{ fontSize: 58, color: C.red, fontVariantNumeric: "tabular-nums" }}>{eur(v)}</span>
        </div>
      </PixelPaper>
      <Stamp t={t} at={A.euro} text="FÄLLIG" size={44} rot={-12} style={{ left: 470, top: 40 }} />
      <Bot t={t} x={700 + sh} y={238} px={8} prop="question" seed={3} hopAmp={t > A.euro ? 14 : 6} />
    </PixelCard>
  );
};

// 3 · receipt: every line of the lawyer's prep work gets struck, Claude does it in 10 minutes
const PREP = [
  { l: "Vertrag lesen", v: 150 },
  { l: "Klauseln markieren", v: 120 },
  { l: "Risiken erklären", v: 130 },
  { l: "Gegenvorschläge", v: 100 },
];
const strikeAt = (i: number) => A.vorarbeit - 0.1 + i * ((A.zehn - A.vorarbeit + 0.05) / PREP.length);
const SceneVorarbeit: React.FC<{ t: number }> = ({ t }) => {
  const left = PREP.reduce((s, p, i) => s + (t > strikeAt(i) + 0.15 ? 0 : p.v), 0);
  const cur = Math.min(PREP.length - 1, PREP.findIndex((_, i) => t < strikeAt(i) + 0.15) < 0 ? PREP.length - 1 : PREP.findIndex((_, i) => t < strikeAt(i) + 0.15));
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 120, display: "flex", alignItems: "center", gap: 14, ...popStyle(t, A.claude - 0.05, 10, 0.8) }}>
        <ClaudeMark size={44} />
        <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, letterSpacing: "0.12em", color: C.ink }}>MACHT DIE VORARBEIT</span>
      </div>
      <Card style={{ left: 90, top: 200, width: 620, height: 500, padding: "28px 34px", boxSizing: "border-box", ...popStyle(t, A.claude, 20, 0.9) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>ANWALT · VORARBEIT</div>
        <div style={{ borderTop: `3px dashed ${C.line}`, margin: "16px 0 6px" }} />
        {PREP.map((p, i) => {
          const s = k(t, strikeAt(i), 0.2);
          return (
            <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", height: 66, fontFamily: MONO, fontSize: 28, fontWeight: 700, color: s > 0.5 ? C.dim : C.ink }}>
              <span>{p.l}</span><span>{p.v} €</span>
              <div style={{ position: "absolute", left: -6, top: "50%", height: 5, width: `${(s * 104).toFixed(1)}%`, background: C.red, borderRadius: 3 }} />
              {s > 0.9 ? <span style={{ position: "absolute", right: -16, top: 10, transform: "translateX(100%)", ...popStyle(t, strikeAt(i) + 0.15, 6, 0.6) }}><Tag text="CLAUDE" color={C.orange} size={16} /></span> : null}
            </div>
          );
        })}
        <div style={{ borderTop: `3px dashed ${C.line}`, margin: "10px 0 12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: MONO, fontWeight: 800 }}>
          <span style={{ fontSize: 26, letterSpacing: "0.14em" }}>TOTAL</span>
          <span style={{ fontSize: 56, color: left === 0 ? C.green : C.ink, fontVariantNumeric: "tabular-nums" }}>{eur(left)}</span>
        </div>
      </Card>
      <Bot t={t} x={740} y={232 + cur * 66} px={7} prop="pen" seed={2} a={A.claude + 0.1} />
      <div style={{ position: "absolute", left: 760, top: 560, ...popStyle(t, A.zehn - 0.05, 16, 0.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.green, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 36, letterSpacing: "0.1em", borderRadius: 14, padding: "14px 22px", boxShadow: "0 14px 30px rgba(30,158,87,0.35)" }}>
          <PixelBot px={3} t={t} prop="stopwatch" />10 MIN
        </div>
      </div>
    </>
  );
};

// 4 · Schritt 1: real claude.ai click path, + → Add files or photos → PDF chip
const MENU = [
  { d: I.clip, label: "Add files or photos" },
  { d: I.cam, label: "Take a screenshot" },
  { d: I.drive, label: "Add from Google Drive" },
];
const OX = 50, OY = 150;
const SceneUpload: React.FC<{ t: number }> = ({ t }) => {
  const plusClick = A.laedst + 0.05, itemClick = A.vertrag + 0.15, fileAt = A.pdf;
  const menu = t > plusClick && t < itemClick + 0.12;
  const menuP = k(t, plusClick, 0.18);
  const ask = "Markiere jede Klausel, die mich Geld kosten kann.";
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 62, ...popStyle(t, A.s0 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · Vertrag hochladen" size={30} /></div>
      <ClaudeWin title="Neuer Chat" style={{ left: OX, top: OY, width: 980, height: 560, ...popStyle(t, A.s0 + 0.02, 20, 0.9) }}>
        <Composer w={860} h={220} text={t > fileAt + 0.15 ? typed(ask, t, fileAt + 0.2, A.markiert + 0.2) : ""} caret={t > fileAt && Math.floor(t * 3) % 2 === 0} plusOn={menu} sendOn={t > fileAt + 0.2}
          file={t > fileAt ? <div style={popStyle(t, fileAt, 10, 0.7)}><FileChip name="Mietvertrag_Ladenlokal.pdf" meta="PDF · 14 SEITEN" size={0.9} /></div> : null}
          fs={26} style={{ left: 60, top: 250 }} />
        {menu ? (
          <div style={{ position: "absolute", left: 60, top: 18, width: 470, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 18, boxShadow: "0 22px 46px rgba(20,20,20,0.14)", padding: 8, opacity: menuP, transform: `translateY(${(1 - menuP) * 14}px)` }}>
            {MENU.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 62, padding: "0 16px", borderRadius: 12, background: i === 0 && t > itemClick - 0.3 ? CL.hover : "transparent" }}>
                <Ico d={m.d} size={26} /><span style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.text }}>{m.label}</span>
              </div>
            ))}
            <div style={{ height: 1, background: CL.border, margin: "6px 10px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 16, height: 62, padding: "0 16px" }}>
              <Ico d={I.globe} size={26} /><span style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.text, flex: 1 }}>Web search</span>
              <span style={{ width: 50, height: 28, borderRadius: 14, background: C.orange, position: "relative" }}><span style={{ position: "absolute", right: 3, top: 3, width: 22, height: 22, borderRadius: "50%", background: "#FFF" }} /></span>
            </div>
          </div>
        ) : null}
      </ClaudeWin>
      <Pointer t={t} path={[
        { x: 760, y: 700, at: A.s0 + 0.15 },
        { x: OX + 60 + 26 + 24, y: OY + 58 + 250 + 220 - 18 - 24, at: plusClick, click: true },
        { x: OX + 60 + 160, y: OY + 58 + 18 + 8 + 31, at: itemClick, click: true },
        { x: 820, y: 640, at: fileAt + 0.4 },
      ]} />
    </>
  );
};

// 5 · page (no face): the bot reads the contract with a magnifier, then every clause gets a role card + verdict
const CLAUSES = [
  { p: "§3", l: "Mietzins", prop: "calc" as BotProp, hat: "none" as BotHat, bad: false },
  { p: "§4", l: "Indexmiete", prop: "ladder" as BotProp, hat: "none" as BotHat, bad: true },
  { p: "§5", l: "Kaution", prop: "key" as BotProp, hat: "none" as BotHat, bad: false },
  { p: "§6", l: "Laufzeit", prop: "calendar" as BotProp, hat: "none" as BotHat, bad: false },
  { p: "§7", l: "Nebenkosten", prop: "folder" as BotProp, hat: "none" as BotHat, bad: true },
  { p: "§12", l: "Rückbau", prop: "brick" as BotProp, hat: "helmet" as BotHat, bad: true },
];
const readAt = (i: number) => A.markiert + i * ((A.klausel0 + 0.6 - A.markiert) / CLAUSES.length);
const cardAt = (i: number) => A.jede - 0.05 + i * 0.16;
const verdictAt = (i: number) => A.geld - 0.1 + i * 0.07;
const SceneMarkiert: React.FC<{ t: number }> = ({ t }) => {
  const DOC = { x: 190, y: 110, w: 700, h: 560 };
  const rowH = (DOC.h - 90) / CLAUSES.length;
  const ri = Math.max(0, Math.min(CLAUSES.length - 1, Math.floor(interpolate(t, [readAt(0), readAt(CLAUSES.length)], [0, CLAUSES.length], clamp))));
  const by = interpolate(t, [readAt(0), readAt(CLAUSES.length)], [0, CLAUSES.length - 1], clamp);
  return (
    <>
      <Card style={{ left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h, padding: "26px 34px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>GEWERBEMIETVERTRAG · LADENLOKAL</div>
        <div style={{ marginTop: 18 }}>
          {CLAUSES.map((c, i) => {
            const h = t > readAt(i) + 0.1 ? k(t, readAt(i) + 0.1, 0.2) : 0;
            const col = c.bad ? C.red : C.green;
            return (
              <div key={i} style={{ position: "relative", height: rowH, display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ position: "absolute", inset: "6px -12px", borderRadius: 10, background: c.bad ? C.redSoft : C.greenSoft, opacity: h }} />
                <span style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: h > 0.5 ? col : C.ink, width: 70 }}>{c.p}</span>
                <div style={{ position: "relative", flex: 1 }}>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>{c.l}</div>
                  <div style={{ height: 8, borderRadius: 4, background: C.line, marginTop: 8, width: `${70 + (i % 3) * 10}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      <Bot t={t} x={DOC.x + DOC.w - 40} y={DOC.y + 70 + by * rowH - 10} px={7} prop="magnifier" flip seed={4} a={A.und0} />
      {CLAUSES.map((c, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = 90 + col * 470, y = 830 + row * 280;
        const v = t > verdictAt(i);
        return (
          <Card key={i} style={{ left: x, top: y, width: 430, height: 250, overflow: "visible", ...popStyle(t, cardAt(i), 22, 0.75), border: v ? `4px solid ${c.bad ? C.red : C.green}` : "4px solid transparent", boxSizing: "border-box" }}>
            <div style={{ position: "absolute", left: 24, top: 22, fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.ink }}>{c.p}</div>
            <div style={{ position: "absolute", left: 24, top: 64, fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>{c.l}</div>
            <Bot t={t} x={250} y={98} px={8} prop={c.prop} hat={c.hat} seed={i} grey={v && !c.bad} hopAmp={v && c.bad ? 12 : 5} />
            {v ? (c.bad
              ? <Stamp t={t} at={verdictAt(i)} text="TEUER" size={40} rot={-10} style={{ left: 22, top: 160 }} />
              : <div style={{ position: "absolute", left: 24, top: 170, display: "flex", alignItems: "center", gap: 10, ...popStyle(t, verdictAt(i), 8, 0.6) }}>
                  <span style={{ width: 40, height: 40, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={30} p={k(t, verdictAt(i) + 0.05, 0.2)} /></span>
                  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.green }}>OK</span>
                </div>) : null}
          </Card>
        );
      })}
    </>
  );
};

// 6 · §4 Indexmiete: the rent on the shop sign climbs every year, no cap
const SceneIndex: React.FC<{ t: number }> = ({ t }) => {
  const c = CARD.cell;
  const yr = interpolate(t, [A.index + 0.1, A.oder - 0.05], [0, 10], clamp);
  const year = 2026 + Math.floor(yr);
  const rent = 2400 * Math.pow(1.04, Math.floor(yr));
  const bump = yr % 1 < 0.25 && yr > 0.5 ? 1 - (yr % 1) / 0.25 : 0;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.zum, 10, 0.8) }}><Tag text="§4 INDEXMIETE" color={C.ink} size={34} /></div>
      <div style={{ position: "absolute", right: 90, top: 118, ...popStyle(t, A.index, 10, 0.6) }}><PixelText text={String(year)} size={44} /></div>
      <PixelCard plate={<StorefrontPlate cell={c} open={1} />}>
        <div style={{ position: "absolute", left: 58 * c, top: 10 * c, width: 64 * c, height: 10 * c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PIXEL, fontSize: 30, color: t > A.index ? C.gold : "#F3E9D2", transform: `scale(${1 + bump * 0.12})` }}>
          {t > A.index ? `MIETE ${eur(rent)}` : "LADENLOKAL"}
        </div>
        <Bot t={t} x={84 * c} y={72 * c - 78} px={6} prop="question" seed={6} style={{ transform: `translateX(${shakeAt(t, A.ober, 6)}px)` }} />
        {/* rising arrow over the shop */}
        {t > A.index ? (
          <svg width={240} height={200} viewBox="0 0 24 20" shapeRendering="crispEdges" style={{ position: "absolute", left: 640, top: 140, opacity: k(t, A.index, 0.2), transform: `translateY(${-yr * 6}px)` }}>
            {[[0, 16], [3, 13], [6, 10], [9, 7], [12, 4]].map(([x, y], i) => <rect key={i} x={x} y={y} width={4} height={4} fill={C.red} />)}
            <rect x={14} y={0} width={8} height={2} fill={C.red} /><rect x={20} y={0} width={2} height={8} fill={C.red} />
          </svg>
        ) : null}
      </PixelCard>
      <Ribbon t={t} at={A.ober} text="OHNE OBERGRENZE" bg={C.red} size={46} rot={-4} style={{ left: 200, top: 420 }} />
    </>
  );
};

// 7 · §7 Nebenkosten: the landlord throws every bill at the tenant
const BILLS = ["VERWALTUNG", "DACH & FACH", "VERSICHERUNG", "GRUNDSTEUER"];
const billAt = (i: number) => A.neben + 0.1 + i * ((A.umgelegt - A.neben - 0.1) / BILLS.length);
const SceneNeben: React.FC<{ t: number }> = ({ t }) => {
  const c = CARD.cell;
  const from = { x: 90 * c + 30, y: 34 * c }, to = { x: 700, y: 250 };
  const hits = BILLS.filter((_, i) => t > billAt(i) + 0.35).length;
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.oder, 10, 0.8) }}><Tag text="§7 NEBENKOSTEN" color={C.ink} size={34} /></div>
      <PixelCard plate={<LandlordPlate cell={c} />}>
        <Bot t={t} x={90 * c - 42} y={62 * c - 91} px={7} hat="tophat" prop="letter" seed={7} hopAmp={4} />
        <Bot t={t} x={720} y={86 * c - 98} px={7} flip seed={8} hopAmp={hits ? 3 : 8} style={{ transform: `translateX(${BILLS.reduce((s, _, i) => s + shakeAt(t, billAt(i) + 0.35, 6), 0)}px)` }} />
        {BILLS.map((b, i) => {
          const a = billAt(i);
          if (t < a) return null;
          const q = interpolate(t, [a, a + 0.35], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const x = from.x + (to.x - from.x) * q, y = from.y + (to.y - 30 * i - from.y) * q - Math.sin(q * Math.PI) * 140;
          return (
            <div key={i} style={{ position: "absolute", left: x - 80, top: y - 60, transform: `rotate(${(1 - q) * 200 + (i % 2 ? 6 : -5)}deg)`, zIndex: 6 }}>
              <PixelPaper w={170} h={64} style={{ padding: "6px 8px", fontSize: 15, lineHeight: 1.25, borderWidth: 4 }}>
                <div>{b}</div><div style={{ color: C.red, fontSize: 18 }}>{eur([480, 260, 140, 80][i])}</div>
              </PixelPaper>
            </div>
          );
        })}
      </PixelCard>
      <Ribbon t={t} at={A.umgelegt} text="ALLES AUF DICH" bg={C.red} size={46} rot={-3} style={{ left: 150, top: 440 }} />
      <div style={{ position: "absolute", right: 90, top: 122, ...popStyle(t, A.werden, 10, 0.6) }}><PixelText text="+960 €/JAHR" size={36} color={C.gold} /></div>
    </>
  );
};

// 8 · page (no face): Schritt 2, the bot explains in plain German on top, terminal with worst-case euros below
const WORST = [
  { p: "§4", l: "Indexmiete ohne Deckel", v: 18400, at: () => A.schlimm },
  { p: "§7", l: "Nebenkosten unbegrenzt", v: 9600, at: () => A.fall },
  { p: "§12", l: "Rückbau komplett", v: 12000, at: () => A.bedeutet + 0.1 },
];
const SceneKlartext: React.FC<{ t: number }> = ({ t }) => {
  const c = CARD.cell;
  const say = "§4 heißt: Deine Miete steigt jedes Jahr mit. Ohne Grenze.";
  const total = interpolate(t, [A.konkret - 0.05, A.betrag + 0.3], [0, 40000], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", left: 90, top: 40, ...popStyle(t, A.s1 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 2 · Klartext + Betrag" size={30} /></div>
      <PixelCard top={130} plate={<StorefrontPlate cell={c} />}>
        <Bot t={t} x={120 * c} y={74 * c - 104} px={8} prop="magnifier" seed={9} />
        <div style={{ position: "absolute", left: 40, top: 150, width: 520, background: "#FFF", border: "5px solid #2C2420", borderRadius: 14, padding: "16px 22px", boxShadow: "6px 6px 0 rgba(0,0,0,0.2)", ...popStyle(t, A.erklaert - 0.05, 12, 0.7) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, lineHeight: 1.25, color: C.ink, minHeight: 114 }}>{typed(say, t, A.erklaert + 0.05, A.klausel1)}</div>
          <div style={{ position: "absolute", right: -26, bottom: 30, width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "26px solid #2C2420" }} />
        </div>
        <div style={{ position: "absolute", left: 40, top: 40, ...popStyle(t, A.einfachem - 0.05, 8, 0.6) }}><Tag text="EINFACHES DEUTSCH" color={C.green} size={22} /></div>
      </PixelCard>
      <div style={{ position: "absolute", left: 90, top: 840, width: 900, height: 620, background: C.term, borderRadius: 16, boxShadow: "0 30px 60px rgba(0,0,0,0.25)", overflow: "hidden", ...popStyle(t, A.klausel1 - 0.1, 30, 0.9) }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", gap: 10, padding: "0 22px", background: "#232228" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((col) => <span key={col} style={{ width: 16, height: 16, borderRadius: "50%", background: col }} />)}
          <span style={{ marginLeft: 16, fontFamily: MONO, fontSize: 20, color: "#9A978F", letterSpacing: "0.08em" }}>worst-case · mietvertrag.pdf</span>
        </div>
        <div style={{ padding: "26px 34px", fontFamily: MONO, fontSize: 28, color: "#E9E6DF" }}>
          <div style={{ color: C.orange }}>{typed("> was kostet mich das im schlimmsten Fall?", t, A.klausel1, A.schlimm - 0.05)}</div>
          <div style={{ height: 20 }} />
          {WORST.map((w, i) => (t > w.at() - 0.05 ? (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 62, ...popStyle(t, w.at() - 0.05, 6, 0.9) }}>
              <span style={{ width: 80, color: C.gold, fontWeight: 800 }}>{w.p}</span>
              <span style={{ flex: 1 }}>{w.l}</span>
              <span style={{ color: "#FF7A7E", fontWeight: 800 }}>+{eur(w.v)}</span>
            </div>
          ) : null))}
          {t > A.mit - 0.05 ? <div style={{ color: "#9A978F", fontSize: 22, marginTop: 10, ...popStyle(t, A.mit - 0.05, 6, 0.9) }}>Annahme: 2.400 €/Monat · 10 Jahre Laufzeit</div> : null}
          <div style={{ borderTop: "2px dashed #3A3940", margin: "22px 0 18px" }} />
          {t > A.konkret - 0.1 ? (
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", ...popStyle(t, A.konkret - 0.1, 8, 0.8) }}>
              <span style={{ fontWeight: 800, letterSpacing: "0.14em", fontSize: 30 }}>WORST CASE</span>
              <span style={{ fontWeight: 800, fontSize: 72, color: C.red, fontVariantNumeric: "tabular-nums" }}>{eur(total)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

// 9+10 · fullscreen pixel town: the trick, then the counter-proposals fly as letters to the landlord's door
const CELL = 5;
const PROPOSALS = [
  { p: "§4", old: "Indexmiete", neu: "max. 3 % pro Jahr", at: () => A.kritische },
  { p: "§7", old: "Nebenkosten", neu: "abschließende Liste", at: () => A.klausel2 },
  { p: "§12", old: "Rückbau", neu: "nur eigene Einbauten", at: () => A.gegen },
];
const letterAt = (i: number) => A.vermieter - 0.1 + i * 0.18;
const FullTown: React.FC<{ t: number }> = ({ t }) => {
  const shop = { x: PLAZA_SHOP.x * CELL, y: PLAZA_SHOP.y * CELL + 30 };
  const door = { x: PLAZA_DOOR.x * CELL, y: PLAZA_DOOR.y * CELL };
  const z = 1 + 0.04 * k(t, A.und1, A.s2 - A.und1, Easing.inOut(Easing.sin));
  const trick = t < A.s2 - 0.05;
  return (
    <AbsoluteFill style={{ background: "#A9DCF0", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 30%" }}>
        <PlazaPlate cell={CELL} t={t} />
        <Bot t={t} x={shop.x - 42} y={shop.y - 91} px={7} prop={t > A.schreibt ? "pen" : "none"} seed={11} />
        <Bot t={t} x={door.x - 50} y={door.y - 104 + 6} px={8} hat="tophat" flip seed={12} hopAmp={t > letterAt(2) + 0.5 ? 10 : 3} />
        {[0, 1, 2].map((i) => {
          const a = letterAt(i);
          if (t < a || t > a + 0.75) return null;
          const q = interpolate(t, [a, a + 0.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          return (
            <div key={i} style={{ position: "absolute", left: shop.x + (door.x - shop.x) * q - 40, top: shop.y - 80 + (door.y - 60 - shop.y + 80) * q - Math.sin(q * Math.PI) * 220, opacity: 1 - k(t, a + 0.6, 0.15), transform: `rotate(${q * 360}deg)`, zIndex: 7 }}>
              <svg width={80} height={60} viewBox="0 0 8 6" shapeRendering="crispEdges"><rect width={8} height={6} fill="#2C2420" /><rect x={1} y={1} width={6} height={4} fill="#FFF" /><rect x={1} y={1} width={1} height={1} fill="#2C2420" /><rect x={6} y={1} width={1} height={1} fill="#2C2420" /><rect x={2} y={2} width={1} height={1} fill="#2C2420" /><rect x={5} y={2} width={1} height={1} fill="#2C2420" /><rect x={3} y={3} width={2} height={1} fill="#2C2420" /><rect x={5} y={4} width={1} height={1} fill="#E5484D" /></svg>
            </div>
          );
        })}
        {t > A.schicken ? <div style={{ position: "absolute", left: door.x - 190, top: door.y - 200, ...popStyle(t, A.schicken, 12, 0.6) }}><Tag text="✓ GESENDET" color={C.green} size={30} /></div> : null}
      </div>
      {trick ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", zIndex: 30 }}>
          {t > A.jetzt - 0.05 ? <PixelText text="JETZT DER TRICK" size={84} style={{ transform: `scale(${interpolate(t - A.jetzt + 0.05, [0, 0.16], [2.2, 1], clamp)}) rotate(-3deg)` }} /> : null}
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: 90, top: 40, ...popStyle(t, A.s2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · Gegenvorschläge" size={30} /></div>
          <Card style={{ left: 90, top: 860, width: 900, height: 560, padding: "30px 36px", boxSizing: "border-box", ...popStyle(t, A.schreibt - 0.1, 30, 0.9) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ClaudeMark size={36} />
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: "0.14em", color: C.ink }}>GEGENVORSCHLÄGE AN DEN VERMIETER</span>
            </div>
            <div style={{ borderTop: `3px dashed ${C.line}`, margin: "20px 0 10px" }} />
            {PROPOSALS.map((p, i) => (t > p.at() - 0.08 ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 100, borderBottom: i < 2 ? `1px solid ${C.line}` : "none", ...popStyle(t, p.at() - 0.08, 8, 0.85) }}>
                <span style={{ width: 44, height: 44, borderRadius: 10, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={32} p={k(t, p.at() + 0.05, 0.22)} /></span>
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.red, width: 76 }}>{p.p}</span>
                <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.dim, textDecoration: "line-through", textDecorationColor: C.red, textDecorationThickness: 3, width: 200 }}>{p.old}</span>
                <span style={{ fontFamily: MONO, fontSize: 28, color: C.ink }}>→</span>
                <span style={{ fontFamily: fonts.bold, fontSize: 30, color: C.green, whiteSpace: "nowrap" }}>{p.neu}</span>
              </div>
            ) : null))}
            {t > A.direkt - 0.05 ? (
              <div style={{ position: "absolute", left: 36, right: 36, bottom: 28, display: "flex", alignItems: "center", gap: 14, ...popStyle(t, A.direkt - 0.05, 8, 0.85) }}>
                <FileChip name="Antwort_an_Vermieter.docx" meta="FERTIG ZUM SENDEN" size={0.95} />
              </div>
            ) : null}
          </Card>
        </>
      )}
    </AbsoluteFill>
  );
};

// 12 · the lawyer only does the last look
const JOBS = [
  { l: "Vertrag lesen", at: () => A.nicht },
  { l: "Klauseln finden", at: () => A.nicht + 0.18 },
  { l: "Beträge rechnen", at: () => A.ganze },
  { l: "Gegenvorschläge", at: () => A.arbeit },
];
const SceneBlick: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 90, top: 130, ...popStyle(t, A.anwalt1 + 0.5, 10, 0.8) }}><Tag text="WER MACHT WAS?" color={C.ink} size={34} /></div>
    <Card style={{ left: 90, top: 215, width: 640, height: 480, padding: "22px 32px", boxSizing: "border-box" }}>
      {JOBS.map((j, i) => {
        const s = k(t, j.at(), 0.18);
        return (
          <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", height: 76, borderBottom: `1px solid ${C.line}` }}>
            <span style={{ fontFamily: fonts.semibold, fontSize: 32, color: s > 0.5 ? C.dim : C.ink }}>{j.l}</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: s > 0.5 ? "#FFF" : C.dim, background: s > 0.5 ? C.orange : C.line, borderRadius: 8, padding: "6px 12px" }}>{s > 0.5 ? "CLAUDE" : "ANWALT"}</span>
            <div style={{ position: "absolute", left: -6, top: "50%", height: 5, width: `${(s * 62).toFixed(1)}%`, background: C.red, borderRadius: 3 }} />
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 84, marginTop: 6, borderRadius: 12, padding: "0 14px", background: t > A.letzten ? C.greenSoft : "transparent", border: `3px solid ${t > A.letzten ? C.green : "transparent"}`, ...(t > A.letzten ? popStyle(t, A.letzten, 0, 0.9) : {}) }}>
        <span style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink }}>Letzter Blick</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", color: "#FFF", background: C.green, borderRadius: 8, padding: "6px 12px" }}>ANWALT</span>
      </div>
    </Card>
    <Bot t={t} x={770} y={380} px={11} hat="glasses" prop="magnifier" seed={13} hopAmp={4} />
  </>
);

// 13 · page (no face): the guide (real page) on top, the prompt typed into claude.ai below
const PROMPT = "Du bist ein erfahrener Berater für Gewerbemietverträge. Prüfe den Vertrag im Anhang Klausel für Klausel …";
const SceneGuide: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 120, top: 100, width: 430, height: 608, transform: `rotate(-3deg) translateY(${(1 - k(t, A.genauen - 0.1, 0.35)) * 500}px)`, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.22)" }}>
      <Img src={staticFile("fpn-gewerbemiete-opus/p2.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
    </div>
    <div style={{ position: "absolute", left: 610, top: 170, display: "flex", flexDirection: "column", gap: 26 }}>
      {[{ s: "✓ 3 PROMPTS", a: A.prompts, c: C.orange }, { s: "✓ CHECKLISTE", a: A.checkliste, c: C.ink }, { s: "✓ ALLE KLAUSELN", a: A.klauseln, c: C.green }].map((x, i) => (
        t > x.a - 0.08 ? <div key={i} style={popStyle(t, x.a - 0.08, 10, 0.6)}><Tag text={x.s} color={x.c} size={30} /></div> : <div key={i} style={{ height: 50 }} />
      ))}
      {t > A.guide - 0.1 ? <div style={{ ...popStyle(t, A.guide - 0.1, 12, 0.6), marginTop: 20 }}><PixelText text="GUIDE" size={50} /></div> : null}
    </div>
    <ClaudeWin title="Mietvertrag prüfen" style={{ left: 90, top: 840, width: 900, height: 520, ...popStyle(t, A.prompts - 0.15, 30, 0.9) }}>
      <Composer w={800} h={400} fs={30} text={typed(PROMPT, t, A.prompts, A.guide)} caret={Math.floor(t * 3) % 2 === 0} sendOn
        file={<FileChip name="Mietvertrag_Ladenlokal.pdf" meta="PDF · 14 SEITEN" size={0.9} />} style={{ left: 50, top: 30 }} />
    </ClaudeWin>
  </>
);

// 14 · end: comment + follow card
const SceneEnd: React.FC<{ t: number }> = ({ t }) => {
  const followed = t > A.folg + 0.25;
  return (
    <>
      <Bot t={t} x={470} y={92} px={10} prop="letter" seed={14} a={A.komm - 0.1} />
      <Card style={{ left: 90, top: 255, width: 900, height: 440, padding: "40px 46px", boxSizing: "border-box", ...popStyle(t, A.komm - 0.12, 26, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 120 }}>
          <span style={{ width: 62, height: 62, borderRadius: "50%", background: C.ink, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>1</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Kommentiere</span>
          <span style={{ marginLeft: "auto", minWidth: 250, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 54, letterSpacing: "0.12em", color: "#FFF", background: C.orange, borderRadius: 14, padding: "10px 24px", boxShadow: "0 12px 26px rgba(217,119,87,0.35)" }}>{typed("MIETE", t, A.miete - 0.08, A.miete + 0.25) || " "}</span>
        </div>
        <div style={{ height: 1, background: C.line, margin: "14px 0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 22, height: 120, ...popStyle(t, A.folg - 0.3, 10, 0.85) }}>
          <span style={{ width: 62, height: 62, borderRadius: "50%", background: C.ink, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>2</span>
          <span style={{ fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Folgen</span>
          <span style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.dim }}>@florent_preusser</span>
          <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: "#FFF", background: followed ? C.green : C.blue, borderRadius: 999, padding: "12px 26px", transform: `scale(${1 + 0.1 * Math.max(0, 1 - Math.abs(t - A.folg - 0.25) / 0.15)})` }}>{followed ? "Gefolgt ✓" : "Folgen"}</span>
        </div>
        <div style={{ position: "absolute", left: 46, bottom: 30, fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.1em", color: C.dim }}>ICH SCHICK DIR DEN GUIDE PER DM</div>
      </Card>
    </>
  );
};

type Kind = "split" | "page" | "full" | "face";
type Scene = { from: number; to: number; kind: Kind; El: React.FC<{ t: number }>; origin?: string };
const None: React.FC<{ t: number }> = () => null;
const SCENES: Scene[] = [
  { from: 0, to: A.schnell - 0.05, kind: "split", El: SceneHook },
  { from: A.schnell - 0.05, to: A.claude - 0.05, kind: "split", El: SceneRechnung },
  { from: A.claude - 0.05, to: A.s0 - 0.05, kind: "split", El: SceneVorarbeit },
  { from: A.s0 - 0.05, to: A.und0, kind: "split", El: SceneUpload },
  { from: A.und0, to: A.zum - 0.05, kind: "page", El: SceneMarkiert },
  { from: A.zum - 0.05, to: A.oder - 0.05, kind: "split", El: SceneIndex },
  { from: A.oder - 0.05, to: A.s1 - 0.05, kind: "split", El: SceneNeben },
  { from: A.s1 - 0.05, to: A.und1, kind: "page", El: SceneKlartext },
  { from: A.und1, to: A.den - 0.05, kind: "full", El: FullTown },
  { from: A.den - 0.05, to: A.den + 0.62, kind: "face", El: None },
  { from: A.den + 0.62, to: A.genauen - 0.15, kind: "split", El: SceneBlick },
  { from: A.genauen - 0.15, to: A.komm - 0.1, kind: "page", El: SceneGuide },
  { from: A.komm - 0.1, to: 999, kind: "split", El: SceneEnd },
];

// ---------- captions: anthracite mono pill on the seam, 1-3 words, pop-in, no active-word box ----------
const chunks = (() => {
  const out: { start: number; end: number; text: string }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, text: cur.map((c) => c.text.replace(/[.,!?:]/g, "")).join(" ").toUpperCase() });
    cur = [];
  };
  for (const c of CAPS) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 18) || (cur.length && len > 21)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const SeamCaption: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.18);
  const fs = c.text.length > 18 ? 32 : 36;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.8 + 0.2 * p})`, opacity: k(t, c.start - 0.04, 0.06), background: C.pill, borderRadius: 14, padding: "14px 22px 14px 28px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,0.22)" }}>{c.text}</div>
    </div>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.5, scale: 1.0 };
const SPLIT_SRC_TOP = 560;
export const MieteOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = camera(t, scene.from, scene.to);
  const dx = Math.sin(t * 0.6) * 5, dy = Math.cos(t * 0.45) * 4;
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const face = scene.kind === "face";
  const vTop = face ? 0 : Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s));
  const avPush = face ? 1.06 + 0.03 * k(t, scene.from, 0.6) : 1 + 0.03 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avPush})`, transformOrigin: face ? "50% 40%" : "50% 30%" }}>
        <OffthreadVideo src={staticFile("fpn-gewerbemiete-opus/tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.kind === "full" ? <El t={t} /> : null}
      {scene.kind === "page" ? (
        <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px)` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 40%" }}><El t={t} /></div>
        </AbsoluteFill>
      ) : null}
      {scene.kind === "split" ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px)` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 50%" }}><El t={t} /></div>
          {t < A.schnell ? <HookLines t={t} /> : null}
        </div>
      ) : null}
      <SeamCaption t={t} y={face ? 1560 : SEAM} />
    </AbsoluteFill>
  );
};
