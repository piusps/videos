import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import { PixelBot, BotProp, BotHat } from "../components/PixelBot";

// Shared kit for the opusjake-style FP-N reels (first built for MieteOpus, 2026-10-23): off-white 770 px top panel,
// wide 900 x 440 pixel-world cards, anthracite mono caption pill on the seam, face below, plus "page" (cards only),
// "full" (fullscreen pixel world) and "face" beats. A reel file only defines its anchors and scenes and renders OpusMaster.

export const FPS = 25;
export const W = 1080;
export const H = 1920;
export const PH = 770;
export const SEAM = 762;
export type Cap = { text: string; startMs: number; endMs: number };
export const C = {
  bg: "#F1EFEA", grid: "rgba(0,0,0,0.035)", ink: "#151515", dim: "#8A877F", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#E5484D", redSoft: "#FDE8E8",
  chip: "#141414", pill: "#2B2B2B", term: "#17161A", gold: "#F5C542", blue: "#3E8EF7",
};
export const MONO = "JetBrains Mono";
export const PIXEL = "Silkscreen";
export const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
export const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
export const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
export const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
export const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.03 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };
export const eur = (n: number) => Math.round(n).toLocaleString("de-DE") + " €";


// ---------- building blocks ----------
export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: 16, boxShadow: shadow, ...style }}>{children}</div>
);
// the opusjake wide card: 900 x 440, holds one 180 x 88 pixel plate at 5 px per cell
export const CARD = { x: 90, y: 255, w: 900, h: 440, cell: 5 };
export const PixelCard: React.FC<{ plate: React.ReactNode; top?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ plate, top = CARD.y, style, children }) => (
  <div style={{ position: "absolute", left: CARD.x, top, width: CARD.w, height: CARD.h, borderRadius: 16, overflow: "hidden", boxShadow: shadow, ...style }}>
    {plate}
    {children}
  </div>
);
export const LabelChip: React.FC<{ text: string; dot?: string; style?: React.CSSProperties; size?: number }> = ({ text, dot = C.orange, style, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: fonts.semibold, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
export const Tag: React.FC<{ text: string; color: string; size?: number; style?: React.CSSProperties }> = ({ text, color, size = 18, style }) => (
  <span style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: color, padding: `${size * 0.33}px ${size * 0.55}px ${size * 0.33}px ${size * 0.66}px`, borderRadius: 8, whiteSpace: "nowrap", ...style }}>{text}</span>
);
export const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.claude.d} fill={SIMPLE_ICONS.claude.hex} /></svg>
);
export const Check: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
);
export const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", color, border: `${size * 0.09}px solid ${color}`, borderRadius: 12, padding: `${size * 0.08}px ${size * 0.3}px`, background: "rgba(255,255,255,0.92)", whiteSpace: "nowrap", zIndex: 5, ...style }}>{text}</div>;
};
export const PixelText: React.FC<{ text: string; size: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, size, color = "#FFF", bg = "#2C2420", style }) => (
  <div style={{ fontFamily: PIXEL, fontSize: size, color, background: bg, padding: `${size * 0.25}px ${size * 0.45}px`, border: `${Math.max(4, size * 0.09)}px solid ${C.gold}`, boxShadow: `0 ${size * 0.12}px 0 #6B4528`, whiteSpace: "nowrap", lineHeight: 1, ...style }}>{text}</div>
);
// ribbon = the opusjake mono label that lands on a card (dark or coloured, slight tilt)
export const Ribbon: React.FC<{ t: number; at: number; text: string; bg: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, bg, size = 40, rot = -3, style }) => {
  if (t < a) return null;
  const u = t - a;
  return (
    <div style={{ position: "absolute", zIndex: 8, ...style }}>
      <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: bg, borderRadius: 12, padding: `${size * 0.26}px ${size * 0.5}px`, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,0.25)", transform: `rotate(${rot}deg) scale(${interpolate(u, [0, 0.16], [1.9, 1], { ...clamp, easing: Easing.out(Easing.cubic) })})`, opacity: k(t, a, 0.08) }}>{text}</div>
    </div>
  );
};
export const Bot: React.FC<{ t: number; prop?: BotProp; hat?: BotHat; px?: number; x: number; y: number; a?: number; flip?: boolean; seed?: number; grey?: boolean; color?: string; hopAmp?: number; style?: React.CSSProperties }> = ({ t, prop = "none", hat = "none", px = 7, x, y, a = -1, flip, seed = 0, grey, color, hopAmp = 8, style }) => {
  const st = a >= 0 ? popStyle(t, a, 26, 0.3) : {};
  const hop = Math.abs(Math.sin(t * 5 + seed)) * -hopAmp;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ transform: `translateY(${hop}px)` }}><PixelBot px={px} t={t} prop={prop} hat={hat} flip={flip} seed={seed} grey={grey} color={color} /></div>
    </div>
  );
};
// a white pixel paper (invoice / letter) with a dark outline
export const PixelPaper: React.FC<{ w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, style, children }) => (
  <div style={{ position: "absolute", width: w, height: h, background: "#FFFDF6", border: "6px solid #2C2420", boxShadow: "8px 8px 0 rgba(0,0,0,0.25)", boxSizing: "border-box", padding: "18px 20px", fontFamily: PIXEL, color: "#2C2420", ...style }}>{children}</div>
);

// ---------- claude.ai pieces (recreated light UI, real English labels) ----------
export const CL = { page: "#FAF9F5", border: "#E3DFD5", text: "#1F1E1D", sub: "#77746C", send: "#C96442", bubble: "#F0EEE6", hover: "#F2EFE8" };
export type PP = { x: number; y: number; at: number; click?: boolean };
export const Pointer: React.FC<{ t: number; path: PP[]; size?: number }> = ({ t, path, size = 50 }) => {
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
export const Ico: React.FC<{ d: string; size?: number; color?: string; sw?: number }> = ({ d, size = 26, color = CL.text, sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>
);
export const I = {
  plus: "M12 5v14M5 12h14",
  clip: "M20 11.5l-8.2 8.2a5 5 0 01-7.1-7.1l8.6-8.6a3.4 3.4 0 014.8 4.8l-8.6 8.6a1.7 1.7 0 01-2.4-2.4l7.9-7.9",
  cam: "M4 8h3l2-2.5h6L17 8h3v11H4zM12 16.5a3.3 3.3 0 100-6.6 3.3 3.3 0 000 6.6z",
  drive: "M8.5 3.5h7l6 10.5-3.5 6H6L2.5 14zM8.5 3.5L15 14.5M15.5 3.5L9 14.5M2.5 14h13",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.6 2.5 3.8 5.5 3.8 9s-1.2 6.5-3.8 9c-2.6-2.5-3.8-5.5-3.8-9S9.4 5.5 12 3z",
  up: "M12 19V6M6 11.5L12 5.5l6 6",
  chev: "M6 9l6 6 6-6",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
};
export const SendBtn: React.FC<{ size?: number; on?: boolean }> = ({ size = 52, on = true }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: CL.send, opacity: on ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={I.up} size={size * 0.56} color="#FFF" sw={2.4} /></div>
);
export const FileChip: React.FC<{ name: string; meta?: string; size?: number }> = ({ name, meta = "PDF", size = 1 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12 * size, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 12 * size, padding: `${8 * size}px ${16 * size}px ${8 * size}px ${8 * size}px` }}>
    <div style={{ width: 40 * size, height: 46 * size, borderRadius: 8 * size, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I.doc} size={26 * size} color={C.orange} sw={2} /></div>
    <div>
      <div style={{ fontFamily: fonts.semibold, fontSize: 21 * size, color: CL.text, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 14 * size, color: CL.sub, letterSpacing: "0.08em" }}>{meta}</div>
    </div>
  </div>
);
export const Composer: React.FC<{ w: number; h: number; text: string; placeholder?: string; caret?: boolean; file?: React.ReactNode; plusOn?: boolean; sendOn?: boolean; fs?: number; style?: React.CSSProperties }> = ({ w, h, text, placeholder = "Wie kann ich dir heute helfen?", caret, file, plusOn, sendOn, fs = 28, style }) => (
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
export const ClaudeWin: React.FC<{ title: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ title, style, children }) => (
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

// ---------- timeline from captions.json (tightened) ----------
export const makeTimeline = (caps: Cap[]) => {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  const words = caps.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
  const at = (word: string, n = 0, end = false) => {
    const m = words.filter((x) => x.w === word);
    const x = m[Math.min(n, m.length - 1)];
    if (!x) throw new Error(`anchor not found: ${word}#${n}`);
    return end ? x.e : x.s;
  };
  const sent = [0, ...caps.flatMap((c, i) => (i > 0 && /[.!?:]$/.test(caps[i - 1].text) ? [c.startMs / 1000] : []))];
  const camera = (t: number, from: number, to: number) => {
    const s = sent.filter((x) => x >= from && x < to);
    if (!s.length) s.push(from);
    const amt = Math.min(0.03, 0.075 / s.length);
    let sc = 1;
    s.forEach((a, i) => {
      const b = i + 1 < s.length ? s[i + 1] : to;
      sc += amt * interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
    });
    return sc;
  };
  const end = caps[caps.length - 1].endMs / 1000 + 0.7;
  return { at, camera, end, frames: Math.round(end * FPS) };
};

// ---------- captions: anthracite mono pill on the seam, 1-3 words, pop-in, no active-word box ----------
export const makeChunks = (caps: Cap[]) => {
  const out: { start: number; end: number; text: string }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, text: cur.map((c) => c.text.replace(/[.,!?:]/g, "")).join(" ").toUpperCase() });
    cur = [];
  };
  for (const c of caps) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 18) || (cur.length && len > 21)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
};
export const SeamCaption: React.FC<{ t: number; y: number; chunks: ReturnType<typeof makeChunks> }> = ({ t, y, chunks }) => {
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

// ---------- pixel sprites + small pixel props ----------
export const Sprite: React.FC<{ rows: string[]; pal: Record<string, string>; px: number; style?: React.CSSProperties }> = ({ rows, pal, px, style }) => (
  <svg width={rows[0].length * px} height={rows.length * px} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" style={{ display: "block", ...style }}>
    {rows.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={pal[ch]} />)))}
  </svg>
);
export const LETTER = { rows: ["KKKKKKKK", "KWKWWKWK", "KWWKKWWK", "KWWWWWWK", "KWWWWRWK", "KKKKKKKK"], pal: { K: "#2C2420", W: "#FFFFFF", R: "#E5484D" } };

// ---------- master: video + panel/page/full/face per scene + seam caption ----------
export type Kind = "split" | "page" | "full" | "face";
export type OpusScene = { from: number; to: number; kind: Kind; El: React.FC<{ t: number }> };
export const OpusMaster: React.FC<{ src: string; scenes: OpusScene[]; caps: Cap[]; overlay?: React.FC<{ t: number }>; splitSrcTop?: number; focusX?: number }> = ({ src, scenes, caps, overlay: Overlay, splitSrcTop = 560, focusX = 0.5 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { camera } = React.useMemo(() => makeTimeline(caps), [caps]);
  const chunks = React.useMemo(() => makeChunks(caps), [caps]);
  const scene = scenes.find((s) => t >= s.from && t < s.to) ?? scenes[scenes.length - 1];
  const cam = camera(t, scene.from, scene.to);
  const dx = Math.sin(t * 0.6) * 5, dy = Math.cos(t * 0.45) * 4;
  const vLeft = Math.min(0, Math.max(0, W / 2 - focusX * W));
  const face = scene.kind === "face";
  const vTop = face ? 0 : Math.min(PH, Math.max(0, PH - splitSrcTop));
  const avPush = face ? 1.06 + 0.03 * k(t, scene.from, 0.6) : 1 + 0.03 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const El = scene.El;
  const grid = (
    <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px)` }} />
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: W, height: H, transform: `scale(${avPush})`, transformOrigin: face ? "50% 40%" : "50% 30%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: "100%", height: "100%" }} />
      </div>
      {scene.kind === "full" ? <El t={t} /> : null}
      {scene.kind === "page" ? (
        <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
          {grid}
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 40%" }}><El t={t} /></div>
        </AbsoluteFill>
      ) : null}
      {scene.kind === "split" ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          {grid}
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 50%" }}><El t={t} /></div>
          {Overlay ? <Overlay t={t} /> : null}
        </div>
      ) : null}
      <SeamCaption t={t} y={face ? 1560 : SEAM} chunks={chunks} />
    </AbsoluteFill>
  );
};
