import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "./papa-words.json";

// @florentgpt Satire "Papa hat Screenshots" (14.10.). Stil 1:1 wie GptHuehnersuppe (von Henri freigegeben):
// heller Raster-Canvas, echte Chat-/ChatGPT-UI-Karten, Mono-Badges mit Zaehlern, Scan-Linie, ChatGPT-Gruen.
// Neu heute: leichte Dopamin-Stufe (2-4 Panels gleichzeitig), erste 3 s viel Bewegung mit grossem Text-Hook.
// Nur weiches Ease-out, kein spring/Bounce/Overshoot. Emojis nur als gerenderte Apple-Emoji-PNGs.

const MONO = "JBMono";
const DIR = "gpts-papa-screenshots";

const FPS = 25;
const WL = words as { text: string; startMs: number; endMs: number }[];
const SPEECH_END = Math.round((WL[WL.length - 1].endMs / 1000 + 0.05) * 25) / 25; // Ende "Ohne Text."
const END_HOLD = 1.0; // harter Schnitt auf den Chat, eine Sekunde stehen lassen
export const PAPA_FRAMES = Math.round((SPEECH_END + END_HOLD) * FPS);
const W = 1080;
const H = 1920;
const PH = 820;

const C = {
  bg: "#F4F4F2",
  grid: "rgba(0,0,0,0.045)",
  ink: "#151515",
  dim: "#8C8C88",
  line: "#E8E8E4",
  card: "#FFFFFF",
  green: "#10A37F",
  greenSoft: "#E3F4EE",
  marker: "rgba(16,163,127,0.28)",
  red: "#E5484D",
  redSoft: "#FDECEC",
  chip: "#141414",
  bubble: "#F1F1F1",
  out: "#D9FDD3",
  tickBlue: "#34B7F1",
};
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";
const F = { r: "Inter-Regular", m: "Inter-Medium", s: "Inter-SemiBold", b: "Inter-Bold" };

const useFonts = () => {
  const [h] = useState(() => delayRender("inter"));
  useEffect(() => {
    Promise.all(
      [["JBMono", "JetBrainsMono-Medium.ttf", "500"], ["JBMono", "JetBrainsMono-Bold.ttf", "700"], ["JBMono", "JetBrainsMono-ExtraBold.ttf", "800"], ["Inter-Regular", "Inter-Regular.ttf"], ["Inter-Medium", "Inter-Medium.ttf"], ["Inter-SemiBold", "Inter-SemiBold.ttf"], ["Inter-Bold", "Inter-Bold.ttf"]].map(([n, f, w]) =>
        new FontFace(n, `url(${staticFile(`fonts/${f}`)})`, w ? { weight: w } : {}).load().then((ff) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(ff)),
      ),
    ).then(() => continueRender(h)).catch(() => continueRender(h));
  }, [h]);
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const smooth = Easing.bezier(0.65, 0, 0.35, 1);
const k = (t: number, a: number, d = 0.35, e = ease) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
/** Weiches Einblenden: Fade + kurzer Weg, kein Overshoot. */
const inS = (t: number, a: number, dy = 16, dx = 0, d = 0.38): React.CSSProperties => {
  const p = k(t, a, d);
  return { opacity: k(t, a, d * 0.6), transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px)` };
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * interpolate(t, [a, b], [0, 1], clamp)));

const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: 20, boxShadow: shadow, ...style }}>{children}</div>
);
const Chip: React.FC<{ text: React.ReactNode; dot?: string; size?: number }> = ({ text, dot = C.green, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: F.s, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>
    <span style={{ width: size * 0.46, height: size * 0.46, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Mono: React.FC<{ s: number; c?: string; w?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = C.dim, w = 700, style, children }) => (
  <span style={{ fontFamily: MONO, fontWeight: w, fontSize: s, letterSpacing: "0.14em", color: c, ...style }}>{children}</span>
);
const Badge: React.FC<{ label: string; value: string; color: string; size?: number }> = ({ label, value, color, size = 30 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.6, background: "#FFF", border: `3px solid ${color}`, borderRadius: 14, padding: `${size * 0.4}px ${size * 0.7}px`, boxShadow: shadow, fontFamily: MONO, whiteSpace: "nowrap" }}>
    <span style={{ fontSize: size * 0.7, fontWeight: 800, letterSpacing: "0.14em", color }}>{label}</span>
    <span style={{ fontSize: size * 1.3, fontWeight: 800, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{value}</span>
  </div>
);
const Caret: React.FC<{ t: number; h?: number }> = ({ t, h = 34 }) => (
  <span style={{ display: "inline-block", width: 3, height: h, background: C.ink, marginLeft: 3, verticalAlign: "middle", opacity: Math.floor(t * 2.2) % 2 === 0 ? 1 : 0 }} />
);
const Emo: React.FC<{ code: string; s: number; style?: React.CSSProperties }> = ({ code, s, style }) => (
  <Img src={staticFile(`${DIR}/emoji/${code}.png`)} style={{ height: s, width: "auto", display: "inline-block", verticalAlign: `-${s * 0.18}px`, ...style }} />
);
const E = (c: string, s: number, st?: React.CSSProperties) => <Emo code={c} s={s} style={st} />;
const Ticks: React.FC<{ color?: string; s?: number }> = ({ color = C.dim, s = 24 }) => (
  <svg width={s * 1.5} height={s} viewBox="0 0 24 16" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M1 8.5l4 4L13 3.5" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 12.5L17 3.5" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Check: React.FC<{ s?: number; c?: string }> = ({ s = 30, c = C.green }) => (
  <span style={{ width: s, height: s, borderRadius: "50%", background: c, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#FFF" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" /></svg>
  </span>
);
const Dots: React.FC<{ t: number; s?: number; c?: string }> = ({ t, s = 14, c = C.ink }) => (
  <span style={{ display: "inline-flex", gap: s * 0.6, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{ width: s, height: s, borderRadius: "50%", background: c, opacity: 0.25 + 0.6 * Math.abs(Math.sin((t - i * 0.15) * 5)) }} />
    ))}
  </span>
);
/** Gruener Textmarker, laeuft von links nach rechts. */
const Mark: React.FC<{ p: number; c?: string; children: React.ReactNode }> = ({ p, c = C.marker, children }) => (
  <span style={{ backgroundImage: `linear-gradient(${c}, ${c})`, backgroundRepeat: "no-repeat", backgroundSize: `${p * 100}% 100%`, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone", padding: "0 3px" }}>{children}</span>
);
const Tag: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = C.red, size = 22 }) => (
  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.14em", color: "#FFF", background: color, borderRadius: 8, padding: "6px 10px 6px 12px", whiteSpace: "nowrap" }}>{text}</span>
);
/** ChatGPT-Logo-Kreis (neutral, wie der Agent-Punkt bei Huehnersuppe). */
const GptDot: React.FC<{ s?: number }> = ({ s = 52 }) => (
  <span style={{ width: s, height: s, borderRadius: "50%", background: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={s * 0.58} height={s * 0.58} viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5" fill="none" stroke="#FFF" strokeWidth="2.2" /><circle cx="12" cy="12" r="2.4" fill="#FFF" /></svg>
  </span>
);

// ---------- Chat-Fenster (WhatsApp-hell) ----------
const Avatar: React.FC<{ letter?: string; emoji?: string; color?: string; s?: number }> = ({ letter, emoji, color = "#C9CFD6", s = 52 }) => (
  <span style={{ width: s, height: s, borderRadius: "50%", background: emoji ? C.greenSoft : color, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: F.b, fontSize: s * 0.46, flexShrink: 0 }}>
    {emoji ? <Emo code={emoji} s={s * 0.56} style={{ verticalAlign: "middle" }} /> : letter}
  </span>
);
const Chat: React.FC<{
  t: number; from: number; title: string; sub: React.ReactNode; avatar: React.ReactNode; style?: React.CSSProperties; children: React.ReactNode; noAnim?: boolean;
}> = ({ t, from, title, sub, avatar, style, children, noAnim }) => (
  <Card style={{ left: 76, top: 190, width: 928, height: 572, overflow: "hidden", ...(noAnim ? {} : inS(t, from, 26)), ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, height: 92, padding: "0 28px", borderBottom: `1.5px solid ${C.line}`, background: "#FFF", position: "relative", zIndex: 3 }}>
      <span style={{ fontFamily: F.s, fontSize: 40, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
      {avatar}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: F.s, fontSize: 30, color: C.ink, lineHeight: 1.1 }}>{title}</span>
        <span style={{ fontFamily: F.r, fontSize: 21, color: C.dim, marginTop: 4 }}>{sub}</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 92, bottom: 0, overflow: "hidden", background: "#FBFBFA" }}>{children}</div>
  </Card>
);
const Bubble: React.FC<{ out?: boolean; time?: string; read?: boolean | "grey"; name?: string; nameColor?: string; fs?: number; maxW?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ out, time, read, name, nameColor, fs = 32, maxW = 640, style, children }) => (
  <div style={{ display: "flex", justifyContent: out ? "flex-end" : "flex-start", ...style }}>
    <div style={{ background: out ? C.out : "#FFF", border: out ? "none" : `1.5px solid ${C.line}`, borderRadius: 22, borderTopRightRadius: out ? 6 : 22, borderTopLeftRadius: out ? 22 : 6, padding: "12px 20px 10px", maxWidth: maxW, boxShadow: "0 1px 1px rgba(0,0,0,0.05)" }}>
      {name ? <div style={{ fontFamily: F.s, fontSize: 22, color: nameColor, marginBottom: 2 }}>{name}</div> : null}
      <span style={{ fontFamily: F.r, fontSize: fs, color: C.ink, lineHeight: 1.3 }}>{children}</span>
      {time ? (
        <span style={{ float: "right", marginLeft: 16, marginTop: fs * 0.55, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: F.r, fontSize: 19, color: C.dim }}>{time}</span>
          {out && read ? <Ticks color={read === true ? C.tickBlue : C.dim} s={18} /> : null}
        </span>
      ) : null}
    </div>
  </div>
);
const DatePill: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{ display: "flex", justifyContent: "center", ...style }}>
    <span style={{ background: "#EDEDEA", borderRadius: 10, padding: "6px 16px" }}><Mono s={18} c="#77776F">{text}</Mono></span>
  </div>
);

/** Screenshot eines ChatGPT-Chats als Bild-Nachricht: Statusleiste + Logo-Zeile + Inhalt. */
const Shot: React.FC<{ w: number; clock?: string; children: React.ReactNode; style?: React.CSSProperties; scale?: number }> = ({ w, clock = "21:47", children, style, scale = 1 }) => (
  <div style={{ width: w, background: "#FFF", border: `2px solid ${C.line}`, borderRadius: 16 * scale, overflow: "hidden", ...style }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 36 * scale, padding: `0 ${16 * scale}px`, background: "#FAFAF8" }}>
      <span style={{ fontFamily: F.s, fontSize: 18 * scale, color: C.ink }}>{clock}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 * scale }}>
        <span style={{ width: 26 * scale, height: 12 * scale, border: `2px solid ${C.ink}`, borderRadius: 4 * scale, padding: 1, boxSizing: "border-box" }}><span style={{ display: "block", width: "40%", height: "100%", background: C.red, borderRadius: 1 }} /></span>
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 * scale, padding: `${8 * scale}px ${16 * scale}px`, borderBottom: `1.5px solid ${C.line}` }}>
      <GptDot s={28 * scale} />
      <span style={{ fontFamily: F.s, fontSize: 20 * scale, color: C.ink }}>ChatGPT</span>
    </div>
    <div style={{ padding: `${12 * scale}px ${18 * scale}px ${14 * scale}px` }}>{children}</div>
  </div>
);

const VTOP = 280; // Split: Video nach unten (Schultern + Hand), gleicher Look wie Huehnersuppe
const FACE_Y = 900; // Zoom-Ursprung im Quellvideo
const CAP_FULL = 1580; // Vollbild: Untertitel auf Brusthoehe
const CARD_TOP = 150;

// ---------- Zeitanker aus den Wort-Timestamps ----------
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WL) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const T = {
  vater: at("vater"), chatgpt1: at("chatgpt", 1), entdeckt: at("entdeckt"), seitdem: at("seitdem"), keine: at("keine"), diskussion: at("diskussion"), mehr: at("mehr"),
  frueher: at("früher"), lauter: at("lauter"), geredet: at("geredet"),
  jetzt: at("jetzt"), tippt: at("tippt"), hab: at("hab"), recht1: at("recht", 1), chatgpt2: at("chatgpt", 2), schreibt: at("schreibt"), das1: at("das", 1), guter: at("guter"), punkt: at("punkt"),
  er2: at("er", 4), liest: at("liest"), laut: at("laut"), mit1: at("mit", 1), brille: at("brille"),
  dirSchickt: at("dir", 2), schickt: at("schickt"), shot1: at("screenshot", 1), welche: at("welche"), jobs: at("jobs"), zehn: at("zehn"), gibt: at("gibt", 1),
  deiner: at("deiner"), nicht: at("nicht"), dabei: at("dabei"),
  deine: at("deine"), mutter: at("mutter"), antwortet: at("antwortet"), shot2: at("screenshot", 2), ihr: at("ihr", 1), chatgpt3: at("chatgpt", 3), auch: at("auch"), recht2: at("recht", 2),
  gestern: at("gestern"), gefragt: at("gefragt"), kinder: at("kinder"), eltern: at("eltern"), anrufen: at("anrufen"), sollten: at("sollten"),
  den: at("den"), shot3: at("screenshot", 3), geschickt: at("geschickt"), ohne: at("ohne"), text: at("text"),
};
const NAMES = { papa: "#1098AD", mama: "#D6336C" };
const Row: React.FC<{ y: number; t: number; a: number; children: React.ReactNode }> = ({ y, t, a, children }) =>
  t >= a - 0.02 ? <div style={{ position: "absolute", left: 28, right: 28, top: y, ...inS(t, a, 18) }}>{children}</div> : null;
const Scan: React.FC<{ t: number; from: number; period?: number; top?: number; h?: number; w?: number; left?: number; fadeAt?: number }> = ({ t, from, period = 1.6, top = 20, h = 400, w = 872, left = 28, fadeAt = 999 }) =>
  t > from ? <div style={{ position: "absolute", left, width: w, top: top + (((t - from) % period) / period) * h, height: 3, background: C.green, boxShadow: `0 0 18px ${C.green}`, opacity: 0.7 * k(t, from, 0.3) * (1 - k(t, fadeAt, 0.3)), zIndex: 2 }} /> : null;
const TopRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>{children}</div>
);

// ---------- Szene 1 (Hook): grosser Text-Hook + Familien-Chat, Papa gewinnt per Screenshot ----------
type Msg = { a: number; h: number; el: React.ReactNode };
const HOOK_BODY = 318;
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const won = Math.round(12 + 35 * k(t, 0, T.mehr + 0.2, Easing.out(Easing.quad))); // Frame 0 = Cover, Zaehler laeuft schon
  const MSGS: Msg[] = [
    { a: -1, h: 96, el: <Bubble name="Papa" nameColor={NAMES.papa} time="21:39" fs={29}>Tomaten sind Gemüse.</Bubble> },
    { a: -1, h: 84, el: <Bubble out time="21:40" read fs={29}>Papa, das stimmt so einfach nicht</Bubble> },
    { a: 0.3, h: 96, el: <Bubble name="Papa" nameColor={NAMES.papa} time="21:41" fs={29}>Moment.</Bubble> },
    {
      a: T.chatgpt1 - 0.1, h: 182, el: (
        <div style={{ background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: 8, width: 470 }}>
          <div style={{ fontFamily: F.s, fontSize: 21, color: NAMES.papa, margin: "2px 10px 6px" }}>Papa</div>
          <Shot w={452} clock="21:41" scale={0.8} style={{ border: `1.5px solid ${C.line}` }}>
            <span style={{ fontFamily: F.r, fontSize: 26, color: C.ink }}><Mark p={k(t, T.entdeckt, 0.5)}>Du hast völlig recht.</Mark></span>
          </Shot>
        </div>
      ),
    },
    { a: T.seitdem - 0.05, h: 96, el: <Bubble name="Mama" nameColor={NAMES.mama} time="21:42" fs={29}>er fragt jetzt immer ChatGPT</Bubble> },
    { a: T.keine - 0.05, h: 84, el: <Bubble out time="21:42" read fs={29}>ok</Bubble> },
    { a: T.mehr - 0.05, h: 70, el: <div style={{ display: "flex", justifyContent: "center" }}><span style={{ background: C.greenSoft, borderRadius: 10, padding: "8px 18px" }}><Mono s={20} c={C.green} w={800}>PAPA HAT DIE DISKUSSION GEWONNEN</Mono></span></div> },
  ];
  let y = 16;
  const ys = MSGS.map((m) => { const yy = y; y += m.h; return yy; });
  // Weicher Auto-Scroll: Ziel = Unterkante der letzten sichtbaren Nachricht
  const off = MSGS.reduce((acc, m, i) => {
    const need = Math.max(0, ys[i] + m.h + 12 - HOOK_BODY);
    return Math.max(acc, need * k(t, m.a, 0.35));
  }, 0);
  const words3 = [{ w: "Papa" }, { w: "hat" }, { w: "ChatGPT." }];
  return (
    <>
      <TopRow>
        <div><Badge label="DISKUSSIONEN GEWONNEN" value={String(won)} color={C.green} /></div>
        {t > T.vater - 0.05 ? <div style={inS(t, T.vater - 0.05, 10)}><Chip text="Papa" dot={NAMES.papa} size={28} /></div> : null}
      </TopRow>
      {/* grosser Text-Hook, ab Frame 0 lesbar (Cover) */}
      <Card style={{ left: 76, top: 186, width: 928, height: 140, display: "flex", alignItems: "center", padding: "0 36px", gap: 22 }}>
        <GptDot s={70} />
        <div style={{ fontFamily: F.b, fontSize: 76, color: C.ink, letterSpacing: -1.5, whiteSpace: "nowrap" }}>
          {words3.map((x, i) => (
            <span key={i} style={{ marginRight: 20 }}>{i === 2 ? <Mark p={0.15 + 0.85 * k(t, 0.1, T.entdeckt - 0.1, Easing.inOut(Easing.quad))}>{x.w}</Mark> : x.w}</span>
          ))}
        </div>
      </Card>
      <Card style={{ left: 76, top: 350, width: 928, height: 410, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, height: 92, padding: "0 28px", borderBottom: `1.5px solid ${C.line}`, background: "#FFF", position: "relative", zIndex: 3 }}>
          <span style={{ fontFamily: F.s, fontSize: 40, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
          <Avatar emoji="1f3e0" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: F.s, fontSize: 30, color: C.ink, lineHeight: 1.1 }}>Familie {E("1f3e0", 28)}</span>
            <span style={{ fontFamily: F.r, fontSize: 21, color: t > 0.15 && t < T.chatgpt1 - 0.1 ? C.green : C.dim, marginTop: 4 }}>{t > 0.15 && t < T.chatgpt1 - 0.1 ? "Papa schreibt …" : "Mama, Papa, Du"}</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 92, bottom: 0, overflow: "hidden", background: "#FBFBFA" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -off }}>
            {MSGS.map((m, i) => <Row key={i} y={ys[i]} t={t} a={m.a}>{m.el}</Row>)}
          </div>
          <Scan t={t} from={0} period={1.3} h={HOOK_BODY - 30} top={10} fadeAt={T.frueher - 0.3} />
        </div>
      </Card>
    </>
  );
};

// ---------- Szene 2: Frueher lauter reden (durchgestrichen) ----------
const SceneFrueher: React.FC<{ t: number }> = ({ t }) => {
  const db = Math.round(62 + 32 * k(t, T.frueher, Math.max(0.5, T.geredet - T.frueher), Easing.out(Easing.quad)));
  const strike = k(t, T.geredet + 0.05, 0.35);
  return (
    <>
      <TopRow>
        <div style={inS(t, T.frueher, 10)}><Chip text="Papas Methode" size={28} /></div>
        <div style={inS(t, T.frueher + 0.15, 10)}><Badge label="LAUTSTÄRKE" value={`${db} dB`} color={db >= 90 ? C.red : C.dim} size={26} /></div>
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, height: 270, padding: "26px 36px", boxSizing: "border-box", ...inS(t, T.frueher, 24) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Mono s={22} c={C.dim} w={800}>FRÜHER</Mono>
          {strike > 0 ? <span style={{ opacity: strike }}><Tag text="VERALTET" /></span> : null}
        </div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 12 }}>
          <span style={{ fontFamily: F.b, fontSize: 72, color: strike > 0.5 ? C.dim : C.ink, letterSpacing: -1 }}>Einfach lauter reden</span>
          <div style={{ position: "absolute", left: -6, top: "54%", height: 7, width: `${strike * 104}%`, background: C.red, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 50, marginTop: 14 }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const amp = (0.25 + 0.75 * k(t, T.frueher + i * 0.02, 0.4)) * (0.35 + 0.65 * Math.abs(Math.sin(t * 7 + i * 1.3))) * (1 - 0.7 * strike);
            return <span key={i} style={{ width: 18, height: 6 + 44 * amp, borderRadius: 4, background: i > 22 ? C.red : C.dim, opacity: 0.8 }} />;
          })}
        </div>
      </Card>
      {t > T.geredet + 0.25 ? (
        <Card style={{ left: 76, top: 490, width: 928, height: 150, padding: "0 36px", display: "flex", alignItems: "center", gap: 24, boxSizing: "border-box", ...inS(t, T.geredet + 0.25, 20) }}>
          <Mono s={22} c={C.green} w={800}>JETZT</Mono>
          <GptDot s={64} />
          <span style={{ fontFamily: F.s, fontSize: 44, color: C.ink }}>ChatGPT fragen</span>
          <span style={{ marginLeft: "auto" }}><Dots t={t} s={14} c={C.green} /></span>
        </Card>
      ) : null}
    </>
  );
};

// ---------- ChatGPT-Fenster ----------
const GptWin: React.FC<{ t: number; from: number; input: React.ReactNode; placeholder?: boolean; children: React.ReactNode; date?: string }> = ({ t, from, input, placeholder, children, date }) => (
  <Card style={{ left: 76, top: 190, width: 928, height: 572, overflow: "hidden", ...inS(t, from, 26) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: 88, padding: "0 30px", borderBottom: `1.5px solid ${C.line}` }}>
      <GptDot s={46} />
      <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>ChatGPT</span>
      <span style={{ fontFamily: F.r, fontSize: 26, color: C.dim }}>⌄</span>
      {date ? <span style={{ marginLeft: "auto" }}><Mono s={18}>{date}</Mono></span> : <span style={{ marginLeft: "auto" }}><Mono s={18}>PAPAS ACCOUNT</Mono></span>}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 88, bottom: 100, overflow: "hidden" }}>{children}</div>
    <div style={{ position: "absolute", left: 24, right: 24, bottom: 18, height: 70, borderRadius: 35, border: `1.5px solid ${C.line}`, background: "#FFF", display: "flex", alignItems: "center", padding: "0 12px 0 30px", boxShadow: "0 4px 14px rgba(0,0,0,0.05)" }}>
      <span style={{ fontFamily: F.r, fontSize: 29, color: placeholder ? C.dim : C.ink, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{input}</span>
      <span style={{ width: 48, height: 48, borderRadius: "50%", background: placeholder ? "#D5D5D2" : C.ink, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: F.b, fontSize: 26 }}>↑</span>
    </div>
  </Card>
);
const UserMsg: React.FC<{ fs?: number; children: React.ReactNode }> = ({ fs = 32, children }) => (
  <div style={{ display: "flex", justifyContent: "flex-end" }}>
    <div style={{ background: C.bubble, borderRadius: 28, padding: "14px 26px", maxWidth: 700, fontFamily: F.r, fontSize: fs, color: C.ink, lineHeight: 1.3 }}>{children}</div>
  </div>
);
const BotMsg: React.FC<{ fs?: number; children: React.ReactNode }> = ({ fs = 36, children }) => (
  <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
    <GptDot s={46} />
    <div style={{ fontFamily: F.r, fontSize: fs, color: C.ink, lineHeight: 1.35, marginTop: 2, maxWidth: 760 }}>{children}</div>
  </div>
);

// ---------- Szene 3: Papa tippt "hab ich recht?" -> "sehr guter Punkt" ----------
const SceneRecht: React.FC<{ t: number }> = ({ t }) => {
  const Q = "hab ich recht?";
  const sendAt = T.recht1 + 0.35;
  const ans = "Das ist ein sehr guter Punkt.";
  const pct = Math.round(100 * k(t, T.das1, Math.max(0.4, T.punkt - T.das1 + 0.2), Easing.out(Easing.quad)));
  return (
    <>
      <TopRow>
        <div style={inS(t, T.jetzt, 10)}><Chip text="Papa tippt" dot={NAMES.papa} size={28} /></div>
        {t > T.chatgpt2 - 0.1 ? <div style={inS(t, T.chatgpt2 - 0.1, 10)}><Badge label="PAPA HAT RECHT" value={`${pct} %`} color={C.green} size={26} /></div> : null}
      </TopRow>
      <GptWin t={t} from={T.jetzt - 0.05} placeholder={t < T.tippt - 0.1 || t >= sendAt} input={t < T.tippt - 0.1 || t >= sendAt ? "Frag irgendwas" : <>{typed(Q, t, T.tippt - 0.05, T.recht1 + 0.2)}<Caret t={t} h={32} /></>}>
        {t >= sendAt ? <div style={{ position: "absolute", left: 30, right: 30, top: 28, ...inS(t, sendAt, 16) }}><UserMsg>{Q}</UserMsg></div> : null}
        {t >= sendAt + 0.15 ? (
          <div style={{ position: "absolute", left: 30, right: 30, top: 140, ...inS(t, sendAt + 0.15, 14) }}>
            {t < T.das1 - 0.1 ? (
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}><GptDot s={46} /><Dots t={t} s={14} /></div>
            ) : (
              <BotMsg fs={42}>
                <Mark p={k(t, T.guter, 0.6, Easing.inOut(Easing.quad))}>{typed(ans, t, T.das1 - 0.1, T.punkt + 0.15)}</Mark>
              </BotMsg>
            )}
          </div>
        ) : null}
        {t > T.punkt + 0.1 ? (
          <div style={{ position: "absolute", left: 94, top: 300, display: "flex", gap: 14, alignItems: "center", ...inS(t, T.punkt + 0.1, 10) }}>
            <Tag text="ZUSTIMMUNG" color={C.green} /><Mono s={20}>OHNE RÜCKFRAGE</Mono>
          </div>
        ) : null}
        <Scan t={t} from={T.das1} period={1.2} top={120} h={260} left={30} w={868} />
      </GptWin>
    </>
  );
};

// ---------- Szene 4: Er liest es dir laut vor (Split), danach Vollbild "Mit Brille." ----------
const SceneVorlesen: React.FC<{ t: number }> = ({ t }) => (
  <>
    <TopRow>
      <div style={inS(t, T.er2 - 0.12, 10)}><Chip text="Papa liest vor" dot={NAMES.papa} size={28} /></div>
      <div style={inS(t, T.laut - 0.1, 10)}><Badge label="LAUTSTÄRKE" value="94 dB" color={C.red} size={26} /></div>
    </TopRow>
    <Card style={{ left: 76, top: 196, width: 928, padding: "30px 40px", ...inS(t, T.er2 - 0.12, 24) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}><GptDot s={40} /><Mono s={20} c={C.green} w={800}>CHATGPT · ANTWORT</Mono></div>
      <div style={{ fontFamily: F.b, fontSize: 56, color: C.ink, letterSpacing: -1, lineHeight: 1.15, marginTop: 16 }}>„Das ist ein sehr <Mark p={1}>guter Punkt.</Mark>“</div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24 }}>
        <span style={{ width: 60, height: 60, borderRadius: "50%", background: C.ink, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="30" height="30" viewBox="0 0 24 24"><path d="M4 9.5h4l5-4v13l-5-4H4z" fill="#FFF" /><path d="M16 8.5c1.6 1.8 1.6 5.2 0 7M18.6 6c3 3.2 3 8.8 0 12" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" /></svg>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, height: 50 }}>
          {Array.from({ length: 34 }).map((_, i) => <span key={i} style={{ width: 12, height: 8 + 40 * Math.abs(Math.sin(t * 8 + i * 0.9)) * k(t, T.liest, 0.3), borderRadius: 3, background: C.green }} />)}
        </div>
        <Mono s={20} c={C.ink} w={800}>LAUT VORGELESEN</Mono>
      </div>
    </Card>
  </>
);

// ---------- Szene 5: Screenshot "Jobs in 10 Jahren", deiner fehlt ----------
const JOBS = ["Pflegekraft", "Elektriker", "Ärztin / Arzt", "Klempner", "Erzieherin"];
const SceneJobs: React.FC<{ t: number }> = ({ t }) => {
  const step = Math.max(0.2, (T.gibt - T.welche) / JOBS.length);
  const miss = T.deiner - 0.05;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.dirSchickt, 10)}><Chip text="Papa · Screenshot" dot={NAMES.papa} size={28} /></div>
        {t > miss ? <div style={inS(t, miss, 10)}><Badge label="DEIN JOB" value="FEHLT" color={C.red} size={26} /></div> : null}
      </TopRow>
      <Chat t={t} from={T.dirSchickt - 0.05} title="Papa" sub="online" avatar={<Avatar letter="P" color={NAMES.papa} />}>
        <Row y={16} t={t} a={T.shot1 - 0.15}>
          <div style={{ background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: 8, width: 700 }}>
            <Shot w={684} clock="07:12" scale={0.9} style={{ border: `1.5px solid ${C.line}` }}>
              <div style={{ fontFamily: F.s, fontSize: 28, color: C.ink, marginBottom: 4 }}>Jobs, die es in 10 Jahren noch gibt:</div>
              {JOBS.map((j, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 40, ...inS(t, T.welche + i * step, 0, 18, 0.3) }}>
                  <Check s={28} /><span style={{ fontFamily: F.r, fontSize: 28, color: C.ink }}>{j}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 14, height: 50, marginTop: 4, borderRadius: 10, padding: "0 10px", marginLeft: -10, border: `2.5px dashed ${t > miss ? C.red : "transparent"}`, background: t > miss ? C.redSoft : "transparent", opacity: k(t, miss, 0.3) }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: C.red, color: "#FFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: F.b, fontSize: 20 }}>✕</span>
                <span style={{ fontFamily: F.m, fontSize: 28, color: C.red, textDecoration: "line-through" }}>Social Media Manager</span>
                <span style={{ marginLeft: "auto" }}><Tag text="FEHLT" size={20} /></span>
              </div>
            </Shot>
            <div style={{ textAlign: "right", margin: "6px 10px 0" }}><span style={{ fontFamily: F.r, fontSize: 19, color: C.dim }}>07:12</span></div>
          </div>
        </Row>
        <Scan t={t} from={T.welche} period={1.2} top={110} h={300} fadeAt={T.dabei} />
      </Chat>
    </>
  );
};

// ---------- Szene 6: Mama antwortet mit eigenem Screenshot -> beide recht ----------
const MiniShot: React.FC<{ name: string; color: string; time: string; text: string; p: number }> = ({ name, color, time, text, p }) => (
  <div style={{ background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: 8, width: 560 }}>
    <div style={{ fontFamily: F.s, fontSize: 21, color, margin: "2px 10px 6px" }}>{name}</div>
    <Shot w={542} clock={time} scale={0.8} style={{ border: `1.5px solid ${C.line}` }}>
      <span style={{ fontFamily: F.r, fontSize: 28, color: C.ink }}><Mark p={p}>{text}</Mark></span>
    </Shot>
  </div>
);
const SceneMama: React.FC<{ t: number }> = ({ t }) => {
  const both = t >= T.recht2 - 0.05 ? 2 : 1;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.deine, 10)}><Chip text="Familie" size={28} /></div>
        {t > T.mutter ? <div style={inS(t, T.mutter, 10)}><Badge label="BEIDE RECHT" value={`${both}/2`} color={both === 2 ? C.green : C.dim} size={26} /></div> : null}
      </TopRow>
      <Chat t={t} from={T.deine - 0.05} title="Familie" sub="Mama, Papa, Du" avatar={<Avatar emoji="1f3e0" />}>
        <Row y={16} t={t} a={T.deine}><MiniShot name="Papa" color={NAMES.papa} time="21:41" text="Das ist ein sehr guter Punkt." p={1} /></Row>
        <Row y={232} t={t} a={T.shot2 - 0.15}>
          <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: 260 }}>
            <MiniShot name="Mama" color={NAMES.mama} time="21:43" text="Du hast völlig recht." p={k(t, T.auch, Math.max(0.4, T.recht2 - T.auch + 0.2), Easing.inOut(Easing.quad))} />
          </div>
        </Row>
        {t > T.recht2 ? <div style={{ position: "absolute", right: 40, top: 400, ...inS(t, T.recht2, 10) }}><Tag text="AUCH RECHT" color={C.green} /></div> : null}
      </Chat>
    </>
  );
};

// ---------- Szene 7: Gestern: "Wie oft sollten Kinder ihre Eltern anrufen?" ----------
const SceneAnrufen: React.FC<{ t: number }> = ({ t }) => {
  const Q = "Wie oft sollten Kinder ihre Eltern anrufen?";
  const sendAt = T.sollten + 0.2;
  const A = "Mindestens einmal pro Woche.";
  const days = Math.round(23 * k(t, T.kinder, Math.max(0.5, T.anrufen - T.kinder + 0.3), Easing.out(Easing.quad)));
  return (
    <>
      <TopRow>
        <div style={inS(t, T.gestern, 10)}><Chip text="Gestern · 23:12" dot={NAMES.papa} size={28} /></div>
        {t > T.kinder - 0.1 ? <div style={inS(t, T.kinder - 0.1, 10)}><Badge label="DEIN LETZTER ANRUF" value={`VOR ${days} TAGEN`} color={C.red} size={26} /></div> : null}
      </TopRow>
      <GptWin t={t} from={T.gestern - 0.05} date="GESTERN" placeholder={t < T.gefragt - 0.1 || t >= sendAt} input={t < T.gefragt - 0.1 || t >= sendAt ? "Frag irgendwas" : <>{typed(Q, t, T.gefragt - 0.05, T.sollten + 0.1)}<Caret t={t} h={32} /></>}>
        {t >= sendAt ? <div style={{ position: "absolute", left: 30, right: 30, top: 28, ...inS(t, sendAt, 16) }}><UserMsg fs={31}>{Q}</UserMsg></div> : null}
        {t >= sendAt + 0.15 ? (
          <div style={{ position: "absolute", left: 30, right: 30, top: 170, ...inS(t, sendAt + 0.15, 14) }}>
            <BotMsg fs={42}><Mark p={k(t, sendAt + 0.4, 0.5, Easing.inOut(Easing.quad))}>{typed(A, t, sendAt + 0.15, sendAt + 0.55)}</Mark></BotMsg>
          </div>
        ) : null}
        <Scan t={t} from={T.gefragt} period={1.3} top={20} h={340} left={30} w={868} />
      </GptWin>
    </>
  );
};

// ---------- Szene 8: Den Screenshot hat er dir geschickt ----------
const AnswerShot: React.FC<{ scale?: number; w: number }> = ({ scale = 0.9, w }) => (
  <Shot w={w} clock="23:12" scale={scale} style={{ border: `1.5px solid ${C.line}` }}>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10 * scale }}>
      <span style={{ background: C.bubble, borderRadius: 22 * scale, padding: `${8 * scale}px ${16 * scale}px`, fontFamily: F.r, fontSize: 24 * scale, color: C.ink }}>Wie oft sollten Kinder ihre Eltern anrufen?</span>
    </div>
    <span style={{ fontFamily: F.m, fontSize: 32 * scale, color: C.ink }}><Mark p={1}>Mindestens einmal pro Woche.</Mark></span>
  </Shot>
);
const SceneGeschickt: React.FC<{ t: number }> = ({ t }) => (
  <>
    <TopRow>
      <div style={inS(t, T.shot3 - 0.2, 10)}><Chip text="Papa hat ein Bild gesendet" dot={NAMES.papa} size={28} /></div>
    </TopRow>
    <Chat t={t} from={T.shot3 - 0.25} title="Papa" sub="zuletzt online 23:13" avatar={<Avatar letter="P" color={NAMES.papa} />}>
      <DatePill text="GESTERN" style={{ marginTop: 20 }} />
      <Row y={80} t={t} a={T.geschickt - 0.1}>
        <div style={{ background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: 8, width: 680 }}>
          <AnswerShot w={664} />
          <div style={{ textAlign: "right", margin: "6px 10px 0" }}><span style={{ fontFamily: F.r, fontSize: 19, color: C.dim }}>23:13</span></div>
        </div>
      </Row>
    </Chat>
  </>
);

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: T.frueher - 0.05, origin: "50% 55%", El: SceneHook },
  { from: T.frueher - 0.05, to: T.jetzt - 0.05, origin: "50% 45%", El: SceneFrueher },
  { from: T.jetzt - 0.05, to: T.er2 - 0.05, origin: "50% 55%", El: SceneRecht },
  { from: T.er2 - 0.05, to: T.dirSchickt - 0.05, origin: "50% 50%", El: SceneVorlesen },
  { from: T.dirSchickt - 0.05, to: T.deine - 0.05, origin: "50% 50%", El: SceneJobs },
  { from: T.deine - 0.05, to: T.gestern - 0.05, origin: "50% 55%", El: SceneMama },
  { from: T.gestern - 0.05, to: T.geschickt - 0.3, origin: "50% 50%", El: SceneAnrufen },
  { from: T.geschickt - 0.3, to: 999, origin: "50% 50%", El: SceneGeschickt },
];

// ---------- Untertitel: Mono-Pille auf der Naht, GPT-Gruen, aktives Wort in Schwarz ----------
type Cap = { text: string; startMs: number; endMs: number };
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of words as Cap[]) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : Math.min(c.end + 0.5, SPEECH_END) }));
})();
const SeamCaption: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const c = t < chunks[0].start ? chunks[0] : chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const fs = 46, cw = fs * 0.74, gapW = fs * 0.5;
  const xs: number[] = []; let acc = 0;
  c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
  const ws = c.words.map((w) => w.w.length * cw - fs * 0.14);
  let i = c.words.findIndex((w, j) => j + 1 >= c.words.length || t < c.words[j + 1].s - 0.03);
  if (i < 0) i = c.words.length - 1;
  const prev = Math.max(0, i - 1);
  const q = i === 0 ? 1 : interpolate(t, [c.words[i].s - 0.03, c.words[i].s + 0.05], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const px = xs[prev] + (xs[i] - xs[prev]) * q, pw = ws[prev] + (ws[i] - ws[prev]) * q;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: "translateY(-50%)", opacity: c === chunks[0] ? 1 : k(t, c.start - 0.04, 0.08), background: C.green, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(10,80,60,0.28)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10 }} />
          {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block" }}>{w.w}</span>)}
        </div>
      </div>
    </div>
  );
};

// ---------- Layout: Split <-> Vollbild, Avatar-Zoom ----------
const FULL: [number, number][] = [[T.mit1 - 0.15, T.dirSchickt - 0.05], [T.ohne - 0.05, 999]]; // "Mit Brille." und "Ohne Text."
/** 0 = Split, 1 = Vollbild-Avatar */
const fullAmt = (t: number) => Math.max(...FULL.map(([a, b]) => Math.min(
  interpolate(t, [a - 0.3, a + 0.05], [0, 1], { ...clamp, easing: smooth }),
  interpolate(t, [b - 0.15, b + 0.2], [1, 0], { ...clamp, easing: smooth }),
)));
const punch = (t: number, a: number, rel: number, amt: number, dIn = 0.3, dOut = 0.45) => amt * Math.min(k(t, a, dIn), 1 - k(t, rel, dOut, smooth));
/** Langsame Fahrt in der Hook, weicher Punch-in auf Pointenwoertern, danach weich wieder raus. */
const avatarZoom = (t: number) => {
  const drift = 0.06 * interpolate(t, [0, T.frueher - 0.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }) * (1 - k(t, T.frueher - 0.05, 0.45, smooth));
  return 1 + drift
    + punch(t, T.guter - 0.05, T.er2 - 0.1, 0.08) // "sehr guter Punkt."
    + punch(t, T.brille - 0.05, T.dirSchickt - 0.1, 0.2) // "Mit Brille."
    + punch(t, T.nicht - 0.05, T.deine - 0.1, 0.12) // "Deiner ist nicht dabei."
    + punch(t, T.auch - 0.05, T.gestern - 0.1, 0.08) // "auch recht."
    + punch(t, T.ohne - 0.05, 999, 0.16); // "Ohne Text."
};

// ---------- Ende: harter Schnitt auf den Chat, Papa schickt nur den Screenshot ----------
const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const cam = 1 + 0.015 * (t - SPEECH_END);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 76, top: 300 }}><Badge label="TEXT" value="0 ZEICHEN" color={C.red} /></div>
        <Card style={{ left: 76, top: 420, width: 928, height: 720, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, height: 104, padding: "0 30px", borderBottom: `1.5px solid ${C.line}` }}>
            <span style={{ fontFamily: F.s, fontSize: 44, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
            <Avatar letter="P" color={NAMES.papa} s={60} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: F.s, fontSize: 34, color: C.ink }}>Papa</span>
              <span style={{ fontFamily: F.r, fontSize: 23, color: C.dim, marginTop: 4 }}>zuletzt online 23:13</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 104, bottom: 0, background: "#FBFBFA", padding: "0 34px" }}>
            <DatePill text="GESTERN" style={{ marginTop: 34 }} />
            <div style={{ marginTop: 40 }}>
              <div style={{ background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: 10, width: 800 }}>
                <AnswerShot w={780} scale={1.1} />
                <div style={{ textAlign: "right", margin: "8px 12px 2px" }}><span style={{ fontFamily: F.r, fontSize: 22, color: C.dim }}>23:13</span></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const GptPapaScreenshots: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t >= SPEECH_END) return <EndCard t={t} />;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = 1 + 0.03 * interpolate(t, [scene.from, Math.min(scene.to, SPEECH_END)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const dx = Math.sin(t * 0.6) * 5, dy = Math.cos(t * 0.45) * 4;
  const f = fullAmt(t);
  const seam = PH * (1 - f);
  const vTop = VTOP * (1 - f);
  const z = avatarZoom(t);
  const capTop = PH + (CAP_FULL - PH) * f;
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: vTop, width: W, height: H, transform: `scale(${z})`, transformOrigin: `50% ${FACE_Y}px` }}>
        <OffthreadVideo src={staticFile(`${DIR}/avatar.mp4`)} style={{ width: "100%", height: "100%" }} />
      </div>
      {seam > 0.5 ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: seam, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", left: 0, top: seam - PH, width: W, height: PH }}>
            <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px)` }} />
            <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
              <El t={t} />
            </div>
          </div>
        </div>
      ) : null}
      {/* Vollbild-Moment "Mit Brille.": kleine Karte ueber dem Kopf, nie ueber dem Gesicht */}
      {f > 0.01 && t < T.dirSchickt + 0.5 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: CARD_TOP, display: "flex", justifyContent: "center", opacity: f * k(t, T.mit1 - 0.05, 0.3), transform: `translateY(${(1 - k(t, T.mit1 - 0.05, 0.35)) * 14}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: "16px 26px", boxShadow: shadow }}>
            {E("1f453", 34)}
            <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Lesebrille</span>
            <Tag text="AUFGESETZT" color={C.green} />
          </div>
        </div>
      ) : null}
      {/* hide the caption while it travels between seam and chest height, so it never crosses the face */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, opacity: f <= 0.001 || f >= 0.999 ? 1 : f < 0.12 ? 1 - f / 0.12 : f > 0.88 ? (f - 0.88) / 0.12 : 0 }}>
        <SeamCaption t={t} top={capTop} />
      </div>
    </AbsoluteFill>
  );
};
