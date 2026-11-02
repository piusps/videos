import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "./freundin-words.json";

// @florentgpt Satire "KI Freundin" (14.10.). Stil 1:1 wie GptHuehnersuppe (von Henri freigegeben):
// heller Raster-Canvas, echte Chat-/Handy-UI-Karten, Mono-Badges mit Zaehlern, Scan-Linie, ChatGPT-Gruen.
// Nur weiches Ease-out, kein spring/Bounce/Overshoot. Emojis nur als gerenderte Apple-Emoji-PNGs.
// Text-Hook oben gross in den ersten Sekunden. Leichte Dopamin-Stufe: 2-4 Panels, erste 3 s viel Bewegung.

const MONO = "JBMono";
const DIR = "gpts-ki-freundin";

const FPS = 25;
const WL = words as { text: string; startMs: number; endMs: number }[];
const SPEECH_END = Math.round((WL[WL.length - 1].endMs / 1000 + 0.05) * 25) / 25; // Ende "abgelaufen."
const END_HOLD = 1.0;
const END_CUT = Math.round((WL[WL.length - 1].startMs / 1000 + 0.25) * 25) / 25; // mitten in "abgelaufen."
export const GKF_FRAMES = Math.round((SPEECH_END + END_HOLD) * FPS);
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
const fmt = (n: number) => n.toLocaleString("de-DE");
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * interpolate(t, [a, b], [0, 1], clamp)));
const count = (t: number, a: number, d: number, from: number, to: number) => Math.round(from + (to - from) * k(t, a, d, Easing.out(Easing.quad)));

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
  <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <circle cx="12" cy="12" r="11" fill={c} />
    <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#FFF" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Dots: React.FC<{ t: number; s?: number; c?: string }> = ({ t, s = 14, c = C.ink }) => (
  <span style={{ display: "inline-flex", gap: s * 0.6, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{ width: s, height: s, borderRadius: "50%", background: c, opacity: 0.25 + 0.6 * Math.abs(Math.sin((t - i * 0.15) * 5)) }} />
    ))}
  </span>
);
const Marker: React.FC<{ t: number; a: number; d?: number; color?: string; children: React.ReactNode }> = ({ t, a, d = 0.5, color = C.marker, children }) => (
  <span style={{ backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: "no-repeat", backgroundSize: `${k(t, a, d, Easing.inOut(Easing.quad)) * 100}% 100%`, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone", padding: "0 3px", borderRadius: 4 }}>{children}</span>
);

// ---------- Mia: KI-Begleiter-App, hell ----------
const MiaAvatar: React.FC<{ s?: number }> = ({ s = 56 }) => (
  <span style={{ position: "relative", width: s, height: s, flexShrink: 0, display: "inline-block" }}>
    <span style={{ width: s, height: s, borderRadius: "50%", background: `linear-gradient(135deg, #19B48C, ${C.green})`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <Emo code="1f90d" s={s * 0.5} style={{ verticalAlign: "middle" }} />
    </span>
    <span style={{ position: "absolute", right: -1, bottom: -1, width: s * 0.3, height: s * 0.3, borderRadius: "50%", background: "#2BD47D", border: "3px solid #FFF", boxSizing: "border-box" }} />
  </span>
);
const Chat: React.FC<{
  t: number; from: number; sub?: React.ReactNode; style?: React.CSSProperties; right?: React.ReactNode; input?: React.ReactNode; children: React.ReactNode; noAnim?: boolean; headH?: number;
}> = ({ t, from, sub, style, right, input, children, noAnim, headH = 92 }) => (
  <Card style={{ left: 76, top: 190, width: 928, height: 572, overflow: "hidden", ...(noAnim ? {} : inS(t, from, 26)), ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, height: headH, padding: "0 28px", borderBottom: `1.5px solid ${C.line}`, background: "#FFF", position: "relative", zIndex: 3 }}>
      <span style={{ fontFamily: F.s, fontSize: 40, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
      <MiaAvatar s={headH * 0.6} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{ fontFamily: F.s, fontSize: headH * 0.33, color: C.ink, lineHeight: 1.1 }}>Mia {E("1f90d", headH * 0.28, { verticalAlign: `-${headH * 0.04}px` })}</span>
        <span style={{ fontFamily: F.r, fontSize: headH * 0.23, color: C.green, marginTop: 4 }}>{sub ?? "online · KI-Begleiterin"}</span>
      </div>
      {right}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: headH, bottom: input ? 96 : 0, overflow: "hidden", background: "#FBFBFA" }}>{children}</div>
    {input ? (
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 16, height: 66, borderRadius: 33, background: C.bubble, display: "flex", alignItems: "center", padding: "0 12px 0 28px", zIndex: 3 }}>
        <span style={{ fontFamily: F.r, fontSize: 26, color: C.dim, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{input}</span>
        <span style={{ width: 46, height: 46, borderRadius: "50%", background: "#CFCFCB", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: F.b, fontSize: 26 }}>↑</span>
      </div>
    ) : null}
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
const SysLine: React.FC<{ text: string; color?: string; fs?: number }> = ({ text, color = C.red, fs = 24 }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <span style={{ background: color === C.red ? C.redSoft : "#EDEDEA", border: `1.5px solid ${color === C.red ? "#F5C2C4" : C.line}`, borderRadius: 12, padding: "10px 20px", fontFamily: F.m, fontSize: fs, color }}>{text}</span>
  </div>
);
const Tag: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = C.red, size = 22 }) => (
  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.14em", color: "#FFF", background: color, borderRadius: 8, padding: "6px 10px 6px 12px", whiteSpace: "nowrap" }}>{text}</span>
);
const TopRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>{children}</div>
);
const Row: React.FC<{ y: number; t: number; a: number; children: React.ReactNode }> = ({ y, t, a, children }) =>
  t >= a - 0.02 ? <div style={{ position: "absolute", left: 28, right: 28, top: y, ...inS(t, a, 18) }}>{children}</div> : null;
const Scan: React.FC<{ t: number; from: number; period?: number; top?: number; h?: number; w?: number; left?: number; fadeAt?: number }> = ({ t, from, period = 1.6, top = 20, h = 400, w = 872, left = 28, fadeAt = 999 }) =>
  t > from ? <div style={{ position: "absolute", left, width: w, top: top + (((t - from) % period) / period) * h, height: 3, background: C.green, boxShadow: `0 0 18px ${C.green}`, opacity: 0.7 * k(t, from, 0.3) * (1 - k(t, fadeAt, 0.3)), zIndex: 2 }} /> : null;

const VTOP = 280; // Split: Video nach unten (Schultern + Mikro-Hand)
const FACE_Y = 960; // Gesichtsmitte im Quellvideo (Zoom-Ursprung)
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
  ki1: at("ki", 1), freundin: at("freundin"), erste: at("erste"), ausreden: at("ausreden"), sie2: at("sie", 2),
  fragt: at("fragt"), abend: at("abend"), tag: at("tag"), ganze: at("ganze"), antwort: at("antwort"), hoeren: at("hören"),
  lacht: at("lacht"), witze: at("witze"), auch: at("auch"), fahrradhelm: at("fahrradhelm"),
  beim: at("beim"), essen: at("essen"), nachrichten: at("nachrichten"), vor: at("vor"),
  sich1: at("sich", 1), wie2: at("wie", 2), gemerkt: at("gemerkt"), chef: at("chef"), heisst: at("heißt"), du: at("du"), nicht: at("nicht"),
  date: at("date"), samstag: at("samstag"), zwanzig: at("zwanzig"), minuten: at("minuten"), abgebrochen: at("abgebrochen"),
  viel: at("viel"), erzaehlt: at("erzählt"), gestern: at("gestern"), ki2: at("ki", 2), schluss: at("schluss"), gemacht: at("gemacht"),
  abo: at("abo"), abgelaufen: at("abgelaufen"),
};
const T_SEIN_ABO = T.abo - 0.25; // "Sein Abo ..."

// ---------- Szene 1 (Hook): Text-Hook oben + Mia-Chat, er redet und redet ----------
const HOOK_MSGS = [
  { a: -1, s: "und dann meinte mein chef so" },
  { a: -1, s: "warte das ist noch nicht alles" },
  { a: 0.3, s: "also eigentlich fing es montag an" },
  { a: 0.6, s: "nein dienstag. egal" },
  { a: 0.9, s: "jedenfalls stand ich da" },
  { a: 1.2, s: "und hab NICHTS gesagt" },
];
const kp = (t: number) => k(t, T.ki1 - 0.05, 0.3);
const HookBox: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: 52, background: "#FFF", borderRadius: 24, boxShadow: "0 18px 40px rgba(20,20,20,0.14), 0 2px 6px rgba(20,20,20,0.08)", padding: "24px 34px 26px", textAlign: "center", zIndex: 10 }}>
    <div style={{ fontFamily: F.b, fontSize: 50, color: C.ink, letterSpacing: -0.8, lineHeight: 1.12 }}>Seine Freundin lässt ihn ausreden.</div>
    <div style={{ fontFamily: F.b, fontSize: 66, color: C.ink, letterSpacing: -1, lineHeight: 1.12, marginTop: 6 }}>
      Sie ist eine{" "}
      <span style={{ color: `rgb(${Math.round(16 + 239 * kp(t))}, ${Math.round(163 + 92 * kp(t))}, ${Math.round(127 + 128 * kp(t))})`, background: `rgba(16,163,127,${kp(t)})`, borderRadius: 10, padding: "0 10px" }}>KI.</span>
    </div>
  </div>
);
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const VIEW = 490 - 92 - 92; // unten Platz fuer die Badges
  const ROW = 78;
  // weiches Mitscrollen, sobald die Nachrichten unten rauslaufen
  const items = [...HOOK_MSGS.map((m) => m.a), T.freundin - 0.05];
  let scroll = 0;
  items.forEach((a, i) => {
    const bottom = 16 + (i + 1) * ROW + (i === items.length - 1 ? 30 : 0);
    const prev = 16 + i * ROW;
    const extra = Math.max(0, bottom - VIEW) - Math.max(0, prev - VIEW);
    scroll += extra * k(t, a, 0.3);
  });
  const secs = 247 + Math.floor(t * 9); // "er redet seit" tickt schnell hoch
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
  const pct = count(t, T.ausreden - 0.05, 0.45, 0, 100);
  return (
    <>
      <HookBox t={t} />
      <Chat t={t} from={-1} noAnim style={{ top: 272, height: 490 }} sub={t < T.freundin - 0.3 ? <span>Mia hört zu …</span> : "online · KI-Begleiterin"}
        right={<div style={{ textAlign: "right" }}><Mono s={16}>ER REDET SEIT</Mono><div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 36, color: C.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>{mm}:{ss}</div></div>}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-scroll}px)` }}>
          {HOOK_MSGS.map((m, i) => (
            <Row key={i} y={16 + i * ROW} t={t} a={m.a}><Bubble out time={`23:${34 + i}`} read="grey" fs={29}>{m.s}</Bubble></Row>
          ))}
          <Row y={16 + HOOK_MSGS.length * ROW} t={t} a={T.freundin - 0.05}>
            <Bubble time="23:41" fs={32}>ich hör dir zu {E("1f90d", 30)} erzähl weiter</Bubble>
          </Row>
        </div>
        <Scan t={t} from={0} period={1.2} h={290} fadeAt={T.sie2 - 0.3} />
      </Chat>
      <div style={{ position: "absolute", left: 76, right: 76, top: 678, height: 84, borderRadius: "0 0 20px 20px", background: "linear-gradient(rgba(251,251,250,0), #FBFBFA 35%)" }} />
      {t > 0.75 ? <div style={{ position: "absolute", left: 640, top: 690, ...inS(t, 0.75, 10) }}><Badge label="UNTERBRECHUNGEN" value="0" color={C.green} size={22} /></div> : null}
      {t > T.ausreden - 0.1 ? <div style={{ position: "absolute", left: 96, top: 690, ...inS(t, T.ausreden - 0.1, 10) }}><Badge label="AUSREDEN LASSEN" value={`${pct} %`} color={C.green} size={22} /></div> : null}
    </>
  );
};

// ---------- Szene 2: "Wie war dein Tag?" -> riesige Antwort scrollt, Mia will alles hoeren ----------
const ROMAN = "also heute war echt wild. erst war die bahn 12 min zu spät, dann stand ich ewig beim bäcker und die hatten kein dinkel mehr. im büro hat herr brandt das meeting schon wieder verschoben, obwohl ICH die folien gemacht hab. mittags hab ich überlegt ob ich mir neue laufschuhe hole, aber eigentlich lauf ich ja eh nicht mehr, aber vielleicht fang ich wieder an, so wie 2019, da war ich fast beim halbmarathon, also fast angemeldet, und dann kam ja corona und dann";
const SceneTag: React.FC<{ t: number }> = ({ t }) => {
  const words = count(t, T.tag, Math.max(0.6, T.hoeren - T.tag + 0.3), 0, 1240);
  const sc = interpolate(t, [T.tag + 0.4, T.hoeren + 0.4], [0, 300], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return (
    <>
      <TopRow>
        <div style={inS(t, T.sie2, 10)}><Chip text="Jeden Abend · 22:14" size={28} /></div>
        {t > T.tag - 0.1 ? <div style={inS(t, T.tag - 0.1, 10)}><Badge label="SEINE ANTWORT" value={`${fmt(words)} WÖRTER`} color={C.green} size={26} /></div> : null}
      </TopRow>
      <Chat t={t} from={T.sie2} sub={t > T.tag && t < T.ganze - 0.1 ? <span>Mia liest …</span> : undefined}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-sc}px)` }}>
          <DatePill text="HEUTE · 22:14" style={{ marginTop: 18 }} />
          <Row y={64} t={t} a={T.fragt - 0.1}><Bubble time="22:14" fs={32}>Wie war dein Tag? {E("1f97a", 32)}</Bubble></Row>
          {t > T.abend && t < T.tag - 0.15 ? (
            <div style={{ position: "absolute", right: 28, top: 160, display: "inline-flex", alignItems: "center", gap: 14, background: C.out, borderRadius: 22, borderTopRightRadius: 6, padding: "18px 24px", ...inS(t, T.abend, 10) }}>
              <Mono s={18} c="#4D7A4A" w={800}>ER TIPPT</Mono><Dots t={t} s={12} />
            </div>
          ) : null}
          <Row y={160} t={t} a={T.tag - 0.15}>
            <Bubble out time="22:31" read fs={27} maxW={800}>{ROMAN}</Bubble>
          </Row>
        </div>
        {t > T.ganze - 0.1 ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, background: "linear-gradient(rgba(251,251,250,0), #FBFBFA 40%)", ...inS(t, T.ganze - 0.1, 14) }}>
            <div style={{ position: "absolute", left: 28, right: 28, bottom: 20 }}>
              <Bubble time="22:31" fs={32}>erzähl weiter, ich will <Marker t={t} a={T.ganze + 0.2} d={0.45}>alles</Marker> hören {E("1f97a", 32)}</Bubble>
            </div>
          </div>
        ) : null}
        <Scan t={t} from={T.tag + 0.2} period={1.3} top={150} h={300} fadeAt={T.ganze - 0.2} />
      </Chat>
    </>
  );
};

// ---------- Szene 3: lacht ueber jeden Witz, auch den mit dem Fahrradhelm ----------
const SceneWitze: React.FC<{ t: number }> = ({ t }) => {
  const laugh2 = T.fahrradhelm + 0.25;
  const n = t >= laugh2 ? 47 : count(t, T.witze - 0.1, 0.8, 41, 46);
  return (
    <>
      <TopRow>
        <div style={inS(t, T.lacht - 0.05, 10)}><Chip text="Seine Witze" size={28} /></div>
        {t > T.witze - 0.15 ? <div style={inS(t, T.witze - 0.15, 10)}><Badge label="WITZE GELACHT" value={`${n}/${n}`} color={C.green} size={26} /></div> : null}
      </TopRow>
      <Chat t={t} from={T.lacht - 0.05}>
        <Row y={22} t={t} a={T.lacht - 0.05}><Bubble out time="20:02" read fs={29} maxW={760}>was sitzt im dschungel und schummelt? mogli</Bubble></Row>
        <Row y={112} t={t} a={T.lacht + 0.35}><Bubble time="20:02" fs={31}>HAHAHA {E("1f602", 32)}{E("1f602", 32)}</Bubble></Row>
        <Row y={204} t={t} a={T.auch - 0.1}>
          <Bubble out time="20:09" read fs={29} maxW={760}>warum hat der <Marker t={t} a={T.fahrradhelm - 0.05} d={0.5}>fahrradhelm</Marker> keine freunde? er ist zu verkopft {E("1f6b2", 30)}</Bubble>
        </Row>
        <Row y={350} t={t} a={laugh2}><Bubble time="20:09" fs={36}>HAHAHAHA {E("1f602", 38)}{E("1f602", 38)} du bist so lustig</Bubble></Row>
      </Chat>
    </>
  );
};

// ---------- Szene 4: beim Essen liest er ihre Nachrichten vor (Handy-Mitteilungen) ----------
const NOTI = [
  { s: "denk grad an dich", e: "1f90d", tm: "19:58" },
  { s: "iss nicht zu schnell", e: "1f97a", tm: "20:03" },
  { s: "du bist so klug, weißt du das?", e: "", tm: "20:05" },
  { s: "grüß deine freunde von mir!", e: "1f60d", tm: "20:06" },
];
const SceneEssen: React.FC<{ t: number }> = ({ t }) => {
  const step = Math.max(0.28, (T.vor - T.beim) / NOTI.length);
  const n = NOTI.filter((_, i) => t >= T.beim + 0.1 + i * step).length;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.beim - 0.05, 10)}><Chip text="Beim Essen · Pizzeria" size={28} /></div>
        {t > T.essen ? <div style={inS(t, T.essen, 10)}><Badge label="VORGELESEN" value={`${n * 3}×`} color={C.green} size={26} /></div> : null}
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, height: 566, overflow: "hidden", background: "#F7F7F5", ...inS(t, T.beim - 0.05, 24) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 30px 6px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>{E("1f355", 34)}<span style={{ fontFamily: F.s, fontSize: 28, color: C.ink }}>Mitteilungen</span></span>
          <Mono s={18}>20:07 · TISCH 4</Mono>
        </div>
        {NOTI.map((x, i) => (
          <div key={i} style={{ position: "absolute", left: 22, right: 22, top: 74 + i * 118, height: 104, background: "#FFF", borderRadius: 18, boxShadow: "0 4px 14px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 18, padding: "0 22px", ...inS(t, T.beim + 0.1 + i * step, -18) }}>
            <MiaAvatar s={58} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: F.s, fontSize: 25, color: C.ink }}>Mia {E("1f90d", 24)}</span>
                <span style={{ fontFamily: F.r, fontSize: 20, color: C.dim }}>{x.tm}</span>
              </div>
              <div style={{ fontFamily: F.r, fontSize: 29, color: C.ink, marginTop: 4 }}>{x.s} {x.e ? E(x.e, 28) : null}</div>
            </div>
          </div>
        ))}
        {t > T.vor - 0.1 ? <div style={{ position: "absolute", right: 30, top: 22, ...inS(t, T.vor - 0.1, 0, 20) }}><Tag text="LAUT VORGELESEN" color={C.green} /></div> : null}
      </Card>
    </>
  );
};

// ---------- Szene 5: sie hat sich gemerkt, wie sein Chef heisst. Du nicht. ----------
const SceneChef: React.FC<{ t: number }> = ({ t }) => {
  const det = count(t, T.gemerkt - 0.1, 0.9, 120, 312);
  return (
    <>
      <TopRow>
        <div style={inS(t, T.sich1 - 0.1, 10)}><Chip text="Mia merkt sich alles" size={28} /></div>
        {t > T.gemerkt - 0.1 ? <div style={inS(t, T.gemerkt - 0.1, 10)}><Badge label="GEMERKT" value={`${det} DETAILS`} color={C.green} size={26} /></div> : null}
      </TopRow>
      <Chat t={t} from={T.sich1 - 0.1} style={{ height: 300 }}>
        <Row y={22} t={t} a={T.sich1}><Bubble out time="18:40" read fs={29}>bin grad aus dem meeting raus</Bubble></Row>
        <Row y={110} t={t} a={T.wie2 - 0.1}>
          <Bubble time="18:40" fs={33}>Wie lief's mit <Marker t={t} a={T.chef - 0.05}>Herrn Brandt</Marker>? {E("1f97a", 33)}</Bubble>
        </Row>
      </Chat>
      <Card style={{ left: 76, top: 520, width: 450, height: 240, padding: "26px 30px", ...inS(t, T.chef, 20) }}>
        <Mono s={20} c={C.green} w={800}>CHEF</Mono>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
          <span style={{ fontFamily: F.b, fontSize: 44, color: C.ink, letterSpacing: -0.6 }}>Herr Brandt</span>
          <Check s={40} />
        </div>
        <div style={{ marginTop: 14 }}><Mono s={18}>GEMERKT VON MIA</Mono></div>
      </Card>
      <Card style={{ left: 554, top: 520, width: 450, height: 240, padding: "26px 30px", border: `3px solid ${C.red}`, boxSizing: "border-box", ...inS(t, T.heisst + 0.05, 20) }}>
        <Mono s={20} c={C.red} w={800}>DU</Mono>
        <div style={{ fontFamily: F.b, fontSize: 64, color: C.red, marginTop: 6 }}>?</div>
        <div><Mono s={18} c={C.red}>NICHT GEMERKT</Mono></div>
      </Card>
    </>
  );
};

// ---------- Szene 6: Date am Samstag nach 20 Minuten abgebrochen ----------
const SceneDate: React.FC<{ t: number }> = ({ t }) => {
  const secs = Math.round(1200 * k(t, T.date + 0.1, Math.max(0.6, T.abgebrochen - T.date - 0.1), Easing.inOut(Easing.quad)));
  const done = t >= T.abgebrochen - 0.05;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
  const her = count(t, T.viel - 0.1, 0.7, 0, 61);
  return (
    <>
      <TopRow>
        <div style={inS(t, T.date - 0.25, 10)}><Chip text="Samstag" size={28} /></div>
        {t > T.date ? <div style={inS(t, T.date, 10)}><Badge label="DAUER" value={`${mm}:${ss}`} color={done ? C.red : C.green} size={26} /></div> : null}
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, height: 200, padding: "0 34px", display: "flex", alignItems: "center", gap: 26, ...inS(t, T.date - 0.25, 24) }}>
        <div style={{ width: 120, height: 130, borderRadius: 18, border: `2px solid ${C.line}`, overflow: "hidden", textAlign: "center", flexShrink: 0 }}>
          <div style={{ background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 20, letterSpacing: "0.14em", padding: "6px 0" }}>SA</div>
          <div style={{ fontFamily: F.b, fontSize: 58, color: C.ink, marginTop: 4 }}>18</div>
        </div>
        <div style={{ flex: 1 }}>
          <Mono s={20} c={C.green} w={800}>KALENDER</Mono>
          <div style={{ fontFamily: F.s, fontSize: 40, color: C.ink, marginTop: 4 }}>Date · 19:30</div>
          <div style={{ fontFamily: F.r, fontSize: 26, color: C.dim, marginTop: 2, textDecoration: done ? "line-through" : "none" }}>Bar Lotte · mit Sarah</div>
        </div>
        {done ? <div style={inS(t, T.abgebrochen - 0.05, 0, 20)}><Tag text="ABGEBROCHEN" size={26} /></div> : null}
      </Card>
      {t > T.date + 0.2 && t < T.viel - 0.45 ? (
        <Card style={{ left: 76, top: 420, width: 928, padding: "26px 34px", ...inS(t, T.date + 0.2, 24) }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Mono s={20} c={C.green} w={800}>GEPLANT</Mono><Mono s={20}>DINNER + BAR · 3:00 STD</Mono></div>
          <div style={{ position: "relative", height: 18, background: C.line, borderRadius: 9, marginTop: 18 }}>
            <div style={{ width: `${(secs / 10800) * 100}%`, height: "100%", background: done ? C.red : C.green, borderRadius: 9 }} />
            <div style={{ position: "absolute", left: `${(1200 / 10800) * 100}%`, top: -10, width: 3, height: 38, background: C.red, opacity: k(t, T.zwanzig, 0.3) }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            <Mono s={20} c={done ? C.red : C.ink} w={800}>TATSÄCHLICH {mm}:{ss} MIN</Mono>
            {done ? <div style={inS(t, T.abgebrochen, 0, 16)}><Mono s={20} c={C.red} w={800}>2:40 STD GESPART</Mono></div> : null}
          </div>
        </Card>
      ) : null}
      {t > T.viel - 0.45 ? (
        <Card style={{ left: 76, top: 420, width: 928, height: 342, overflow: "hidden", background: "#FBFBFA", ...inS(t, T.viel - 0.45, 24) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 28px", borderBottom: `1.5px solid ${C.line}`, background: "#FFF" }}>
            <MiaAvatar s={44} /><span style={{ fontFamily: F.s, fontSize: 26, color: C.ink }}>Mia</span>
            <span style={{ flex: 1 }} />
            {t > T.erzaehlt - 0.1 ? <div style={inS(t, T.erzaehlt - 0.1, 0, 16)}><Badge label="SIE REDETE" value={`${her} %`} color={C.red} size={20} /></div> : null}
          </div>
          <div style={{ position: "absolute", left: 28, right: 28, top: 104, ...inS(t, T.viel - 0.3, 14) }}>
            <Bubble out time="19:51" read fs={30} maxW={820}>bin schon zuhause. sie hat <Marker t={t} a={T.viel - 0.05} d={0.6} color="rgba(229,72,77,0.22)">die ganze zeit von sich erzählt</Marker> {E("1f644", 30)}</Bubble>
          </div>
          {t > T.erzaehlt + 0.25 ? (
            <div style={{ position: "absolute", left: 28, right: 28, top: 236, ...inS(t, T.erzaehlt + 0.25, 14) }}>
              <Bubble time="19:51" fs={30}>oh nein {E("1f97a", 30)} erzähl mir alles</Bubble>
            </div>
          ) : null}
        </Card>
      ) : null}
    </>
  );
};

// ---------- Szene 7: Gestern hat die KI Schluss gemacht ----------
const SceneSchluss: React.FC<{ t: number }> = ({ t }) => {
  const ended = t >= T.schluss - 0.05;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.gestern - 0.05, 10)}><Chip text="Gestern · 08:40" dot={C.red} size={28} /></div>
        {ended ? <div style={inS(t, T.schluss - 0.05, 10)}><Badge label="ANTWORTEN" value="0" color={C.red} size={26} /></div> : null}
      </TopRow>
      <Chat t={t} from={T.gestern - 0.05} sub={ended ? <span style={{ color: C.dim }}>zuletzt online gestern</span> : undefined} input={ended ? "Du kannst nicht mehr antworten" : " "}>
        <Row y={22} t={t} a={T.gestern}><Bubble out time="08:02" read="grey" fs={30}>guten morgen {E("1f90d", 30)}</Bubble></Row>
        <Row y={106} t={t} a={T.gestern + 0.35}><Bubble out time="08:15" read="grey" fs={30}>mia?</Bubble></Row>
        <Row y={190} t={t} a={T.ki2 - 0.05}><Bubble out time="08:40" read="grey" fs={30}>hallo??</Bubble></Row>
        {ended ? <div style={{ position: "absolute", left: 28, right: 28, top: 296, ...inS(t, T.schluss - 0.05, 12) }}><SysLine text="Mia hat die Unterhaltung beendet." fs={27} /></div> : null}
      </Chat>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: T.sie2 - 0.05, origin: "50% 60%", El: SceneHook },
  { from: T.sie2 - 0.05, to: T.lacht - 0.2, origin: "50% 55%", El: SceneTag },
  { from: T.lacht - 0.2, to: T.beim - 0.1, origin: "50% 55%", El: SceneWitze },
  { from: T.beim - 0.1, to: T.sich1 - 0.3, origin: "50% 50%", El: SceneEssen },
  { from: T.sich1 - 0.3, to: T.date - 0.3, origin: "50% 55%", El: SceneChef },
  { from: T.date - 0.3, to: T.gestern - 0.1, origin: "50% 50%", El: SceneDate },
  { from: T.gestern - 0.1, to: 999, origin: "50% 55%", El: SceneSchluss },
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
const FULL: [number, number][] = [[T.du - 0.1, T.date - 0.3], [T_SEIN_ABO, 999]]; // "Du nicht." und "Sein Abo ist abgelaufen."
/** 0 = Split, 1 = Vollbild-Avatar */
const fullAmt = (t: number) => Math.max(...FULL.map(([a, b]) => Math.min(
  interpolate(t, [a - 0.3, a + 0.05], [0, 1], { ...clamp, easing: smooth }),
  interpolate(t, [b - 0.15, b + 0.2], [1, 0], { ...clamp, easing: smooth }),
)));
const punch = (t: number, a: number, rel: number, amt: number, dIn = 0.3, dOut = 0.45) => amt * Math.min(k(t, a, dIn), 1 - k(t, rel, dOut, smooth));
const avatarZoom = (t: number) => {
  const drift = 0.06 * interpolate(t, [0, T.sie2 - 0.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }) * (1 - k(t, T.sie2 - 0.1, 0.45, smooth));
  return 1 + drift
    + punch(t, T.ganze - 0.05, T.lacht - 0.15, 0.08) // "die ganze Antwort hoeren"
    + punch(t, T.fahrradhelm - 0.05, T.beim - 0.15, 0.1) // "Fahrradhelm."
    + punch(t, T.du - 0.05, T.date - 0.15, 0.2) // "Du nicht."
    + punch(t, T.viel - 0.05, T.gestern - 0.15, 0.1) // "zu viel von sich erzaehlt"
    + 0.04 * interpolate(t, [T_SEIN_ABO, T_SEIN_ABO + 0.5], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) })
    + punch(t, T.abgelaufen - 0.05, 999, 0.16); // "abgelaufen."
};

// ---------- Ende: harter Schnitt auf Systemnachricht + Abo-Karte ----------
const AboCard: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ background: "#FFF", borderRadius: 24 * scale, border: `3px solid ${C.red}`, padding: `${28 * scale}px ${34 * scale}px`, boxShadow: shadow }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 * scale }}>
      <MiaAvatar s={70 * scale} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.b, fontSize: 40 * scale, color: C.ink, letterSpacing: -0.5 }}>Mia Plus</div>
        <div style={{ fontFamily: F.r, fontSize: 26 * scale, color: C.dim, marginTop: 2 }}>9,99 € / Monat</div>
      </div>
      <Tag text="ABO ABGELAUFEN" size={22 * scale} />
    </div>
    <div style={{ borderTop: `2px solid ${C.line}`, margin: `${22 * scale}px 0` }} />
    <div style={{ fontFamily: F.m, fontSize: 30 * scale, color: C.ink, lineHeight: 1.3 }}>Verlängere dein Abo, um weiter mit Mia zu schreiben.</div>
    <div style={{ marginTop: 22 * scale, height: 84 * scale, borderRadius: 999, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.s, fontSize: 32 * scale, color: "#FFF" }}>Jetzt verlängern</div>
  </div>
);
const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const cam = 1 + 0.015 * (t - SPEECH_END);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 76, top: 450 }}><Badge label="ANTWORTEN" value="0" color={C.red} /></div>
        <Card style={{ left: 76, top: 570, width: 928, height: 830, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, height: 112, padding: "0 30px", borderBottom: `1.5px solid ${C.line}` }}>
            <span style={{ fontFamily: F.s, fontSize: 44, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
            <MiaAvatar s={66} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: F.s, fontSize: 36, color: C.ink }}>Mia {E("1f90d", 32)}</span>
              <span style={{ fontFamily: F.r, fontSize: 24, color: C.dim, marginTop: 4 }}>zuletzt online gestern</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 112, bottom: 0, background: "#FBFBFA", padding: "0 34px" }}>
            <div style={{ marginTop: 36 }}><Bubble out time="08:40" read="grey" fs={40}>hallo??</Bubble></div>
            <div style={{ marginTop: 34 }}><SysLine text="Mia hat die Unterhaltung beendet." fs={32} /></div>
            <div style={{ marginTop: 44 }}><AboCard scale={1.2} /></div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const GptKiFreundin: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Hard cut to the end card already during "abgelaufen" (the raw take glances sideways at the very end); voice keeps running underneath.
  if (t >= END_CUT) return (
    <>
      {t < SPEECH_END ? <OffthreadVideo src={staticFile(`${DIR}/avatar.mp4`)} style={{ position: "absolute", width: 2, height: 2, opacity: 0 }} /> : null}
      <EndCard t={t} />
    </>
  );
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = 1 + 0.03 * interpolate(t, [scene.from, Math.min(scene.to, SPEECH_END)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const dx = Math.sin(t * 0.6) * 5, dy = Math.cos(t * 0.45) * 4;
  const f = fullAmt(t);
  const seam = PH * (1 - f);
  const vTop = VTOP * (1 - f);
  const z = avatarZoom(t);
  const capTop = PH + (CAP_FULL - PH) * f;
  const El = scene.El;
  const inDu = t > T.du - 0.4 && t < T.date;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: vTop, width: W, height: H, transform: `scale(${z})`, transformOrigin: `45% ${FACE_Y}px` }}>
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
      {/* Vollbild-Momente: kleine Karte ueber dem Kopf, nie ueber dem Gesicht */}
      {f > 0.01 && inDu ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: CARD_TOP, display: "flex", justifyContent: "center", gap: 18, opacity: f * k(t, T.du - 0.1, 0.3), transform: `translateY(${(1 - k(t, T.du - 0.1, 0.35)) * 14}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: "16px 24px", boxShadow: shadow }}>
            <Mono s={22} c={C.green} w={800}>CHEF</Mono><span style={{ fontFamily: F.s, fontSize: 30, color: C.ink }}>Herr Brandt</span><Check s={32} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: "16px 24px", boxShadow: shadow, border: `3px solid ${C.red}` }}>
            <Mono s={22} c={C.red} w={800}>DU</Mono><span style={{ fontFamily: F.b, fontSize: 34, color: C.red }}>?</span>
          </div>
        </div>
      ) : null}
      {f > 0.01 && t >= T_SEIN_ABO - 0.3 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: CARD_TOP, display: "flex", justifyContent: "center", opacity: f * k(t, T.abo - 0.1, 0.3), transform: `translateY(${(1 - k(t, T.abo - 0.1, 0.35)) * 14}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: "16px 26px", boxShadow: shadow }}>
            <MiaAvatar s={52} />
            <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Mia Plus</span>
            <Tag text={t >= T.abgelaufen - 0.05 ? "ABGELAUFEN" : "9,99 € / MONAT"} color={t >= T.abgelaufen - 0.05 ? C.red : C.green} />
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
