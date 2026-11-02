import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "./suppe-words.json";

// @florentgpt Satire "Huehnersuppe-Agent" (13.10.). Gleicher Stil wie GptRomanSchlussmachen / GptOpusAustralien (zoom-test, von Henri freigegeben):
// heller Raster-Canvas, echte Chat-UI-Karten, Mono-Badges mit Zaehlern, Scan-Linie, ChatGPT-Gruen.
// Nur weiches Ease-out, kein spring/Bounce/Overshoot. Emojis nur als gerenderte Apple-Emoji-PNGs in der Chat-UI.

const MONO = "JBMono";
const DIR = "gpts-huehnersuppe-agent";

const FPS = 25;
const SPEECH_END = Math.round(((words as { endMs: number }[])[(words as unknown[]).length - 1].endMs / 1000 + 0.05) * 25) / 25; // Ende "Nudeln."
const END_HOLD = 1.0; // harter Schnitt auf den Chat, eine Sekunde stehen lassen
export const GHS_FRAMES = Math.round((SPEECH_END + END_HOLD) * FPS);
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
const Ticks: React.FC<{ color?: string; s?: number }> = ({ color = C.dim, s = 24 }) => (
  <svg width={s * 1.5} height={s} viewBox="0 0 24 16" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path d="M1 8.5l4 4L13 3.5" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.5 12.5L17 3.5" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Dots: React.FC<{ t: number; s?: number; c?: string }> = ({ t, s = 14, c = C.ink }) => (
  <span style={{ display: "inline-flex", gap: s * 0.6, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{ width: s, height: s, borderRadius: "50%", background: c, opacity: 0.25 + 0.6 * Math.abs(Math.sin((t - i * 0.15) * 5)) }} />
    ))}
  </span>
);

// ---------- Chat-Fenster (WhatsApp-hell) ----------
const Avatar: React.FC<{ letter?: string; emoji?: string; color?: string; s?: number }> = ({ letter, emoji, color = "#C9CFD6", s = 52 }) => (
  <span style={{ width: s, height: s, borderRadius: "50%", background: emoji ? C.greenSoft : color, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: F.b, fontSize: s * 0.46, flexShrink: 0 }}>
    {emoji ? <Emo code={emoji} s={s * 0.56} style={{ verticalAlign: "middle" }} /> : letter}
  </span>
);
const Chat: React.FC<{
  t: number; from: number; title: string; sub: React.ReactNode; avatar: React.ReactNode; style?: React.CSSProperties; input?: React.ReactNode; bodyH?: number; children: React.ReactNode; noAnim?: boolean;
}> = ({ t, from, title, sub, avatar, style, input, children, noAnim }) => (
  <Card style={{ left: 76, top: 190, width: 928, height: 572, overflow: "hidden", ...(noAnim ? {} : inS(t, from, 26)), ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, height: 92, padding: "0 28px", borderBottom: `1.5px solid ${C.line}`, background: "#FFF", position: "relative", zIndex: 3 }}>
      <span style={{ fontFamily: F.s, fontSize: 40, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
      {avatar}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontFamily: F.s, fontSize: 30, color: C.ink, lineHeight: 1.1 }}>{title}</span>
        <span style={{ fontFamily: F.r, fontSize: 21, color: C.dim, marginTop: 4 }}>{sub}</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 92, bottom: input ? 96 : 0, overflow: "hidden", background: "#FBFBFA" }}>{children}</div>
    {input ? (
      <div style={{ position: "absolute", left: 22, right: 22, bottom: 16, height: 66, borderRadius: 33, background: C.bubble, display: "flex", alignItems: "center", padding: "0 12px 0 28px", zIndex: 3 }}>
        <span style={{ fontFamily: F.r, fontSize: 28, color: C.ink, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{input}</span>
        <span style={{ width: 46, height: 46, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: F.b, fontSize: 26 }}>↑</span>
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

const VTOP = 280; // Split: Video nach unten (Schultern + Hand)
const FACE_Y = 900; // Gesichtsmitte im Quellvideo (Zoom-Ursprung)
const CAP_FULL = 1580; // Vollbild: Untertitel auf Brusthoehe
const CARD_TOP = 150;

// ---------- Zeitanker aus den Wort-Timestamps (gekuerzte Timeline) ----------
const WL = words as { text: string; startMs: number; endMs: number }[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const at = (w: string, n = 1) => {
  let c = 0;
  for (const x of WL) if (norm(x.text) === w && ++c === n) return x.startMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const endOf = (w: string, n = 1) => {
  let c = 0;
  for (const x of WL) if (norm(x.text) === w && ++c === n) return x.endMs / 1000;
  throw new Error(`Wort nicht gefunden: ${w} #${n}`);
};
const T = {
  suppe1: at("hühnersuppe", 1), ki: at("ki"), mitliest: at("mitliest"),
  guter: at("guter"), zumindest: at("zumindest"), suppe2: at("suppe", 1),
  agent1: at("agent", 1), mann: at("mann"), grad: at("grad"), testament: at("testament"),
  deshalb: at("deshalb"), stufen: at("stufen"), erkaeltet: at("erkältet"), besserung: at("besserung"), mehr1: at("mehr", 1),
  letzten1: at("letzten", 1), schaff1: at("schaff", 1), kueche1: at("küche", 1), lieferando: at("lieferando"), suppe3: at("hühnersuppe", 2), ingwer: at("ingwertee"),
  dazu: at("dazu"), studie: at("studie"), maenner: at("männer"), krankenhaus: at("krankenhaus"), ernst: at("ernst"),
  tobi3: at("tobi", 3), foto: at("foto"), bester: at("bester"),
  inzwischen: at("inzwischen"), krank: at("krank", 2), fussball: at("fußball"),
  letzten2: at("letzten", 2), anpfiff: at("anpfiff"), schaff2: at("schaff", 2), direkt: at("direkt"), gern: at("gern"), nudeln: at("nudeln"),
};
const E = (c: string, s: number, st?: React.CSSProperties) => <Emo code={c} s={s} style={st} />;
const AGENT = (
  <span style={{ width: 52, height: 52, borderRadius: "50%", background: C.green, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7.5" fill="none" stroke="#FFF" strokeWidth="2.2" /><circle cx="12" cy="12" r="2.4" fill="#FFF" /></svg>
  </span>
);
const NAMES = { max: "#D6336C", tobi: "#1098AD", jonas: "#7048E8", agent: C.green };
const Row: React.FC<{ y: number; t: number; a: number; children: React.ReactNode }> = ({ y, t, a, children }) =>
  t >= a - 0.02 ? <div style={{ position: "absolute", left: 28, right: 28, top: y, ...inS(t, a, 18) }}>{children}</div> : null;
const Scan: React.FC<{ t: number; from: number; period?: number; top?: number; h?: number; w?: number; left?: number; fadeAt?: number }> = ({ t, from, period = 1.6, top = 20, h = 400, w = 872, left = 28, fadeAt = 999 }) =>
  t > from ? <div style={{ position: "absolute", left, width: w, top: top + (((t - from) % period) / period) * h, height: 3, background: C.green, boxShadow: `0 0 18px ${C.green}`, opacity: 0.7 * k(t, from, 0.3) * (1 - k(t, fadeAt, 0.3)), zIndex: 2 }} /> : null;
const Tag: React.FC<{ text: string; color?: string; size?: number }> = ({ text, color = C.red, size = 22 }) => (
  <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.14em", color: "#FFF", background: color, borderRadius: 8, padding: "6px 10px 6px 12px", whiteSpace: "nowrap" }}>{text}</span>
);
const TopRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>{children}</div>
);

// ---------- Szene 1 (Hook): Gruppenchat "Die Jungs", der Agent liest mit und bestellt ----------
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const read = Math.round(1200 + 1217 * k(t, 0, 3.2, Easing.out(Easing.quad))); // Frame 0 = Cover, Zaehler laeuft schon
  const ORDER = Math.max(0.9, T.suppe1 - 0.1);
  return (
    <>
      <TopRow>
        <div><Badge label="AGENT LIEST MIT" value={fmt(read)} color={C.green} /></div>
        {t > T.ki - 0.1 ? <div style={inS(t, T.ki - 0.1, 10)}><Chip text="KI" size={28} /></div> : null}
      </TopRow>
      <Chat t={t} from={-1} noAnim title="Die Jungs" sub={t < ORDER ? <span style={{ color: C.green }}>Max schreibt …</span> : "Max, Tobi, Jonas, Agent, Du"} avatar={<Avatar emoji="26bd" />}>
        <Row y={20} t={t} a={-1}><Bubble name="Max" nameColor={NAMES.max} time="19:02" fs={30}>bin raus heute, lieg flach {E("1f927", 32)}</Bubble></Row>
        <Row y={128} t={t} a={0.35}><Bubble name="Jonas" nameColor={NAMES.jonas} time="19:03" fs={30}>gute Besserung digga</Bubble></Row>
        <Row y={236} t={t} a={ORDER}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            {AGENT}
            <div style={{ background: "#FFF", border: `2px solid ${C.green}`, borderRadius: 22, borderTopLeftRadius: 6, padding: "14px 22px", width: 600 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: F.s, fontSize: 22, color: C.green }}>Agent</span>
                <Mono s={17} c={C.green} w={800}>AUTOMATISCH</Mono>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
                {E("1f372", 54)}
                <div>
                  <div style={{ fontFamily: F.s, fontSize: 31, color: C.ink }}>Hühnersuppe bestellt</div>
                  <div style={{ fontFamily: F.r, fontSize: 24, color: C.dim, marginTop: 2 }}>an Max · Ankunft in 18 Min</div>
                </div>
              </div>
            </div>
          </div>
        </Row>
        <Scan t={t} from={0} period={1.4} h={420} fadeAt={T.guter} />
      </Chat>
    </>
  );
};

// ---------- Szene 2: "Ein guter Freund ist da" -> Liefer-Tracking ----------
const SceneLieferung: React.FC<{ t: number }> = ({ t }) => {
  const p = interpolate(t, [T.guter, T.zumindest + 0.6], [0.25, 0.92], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const min = Math.max(2, Math.round(18 - 16 * p));
  return (
    <>
      <TopRow>
        <div style={inS(t, T.guter, 10)}><Chip text="Lieferung" size={28} /></div>
        <div style={inS(t, T.guter + 0.15, 10)}><Badge label="ANKUNFT" value={`${min} MIN`} color={C.green} size={26} /></div>
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, padding: "28px 36px", ...inS(t, T.guter, 24) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Deine Bestellung ist unterwegs</span>
          <Mono s={20}>#4471</Mono>
        </div>
        <div style={{ borderTop: `2px solid ${C.line}`, margin: "18px 0 22px" }} />
        <div style={{ position: "relative", height: 14, background: C.line, borderRadius: 7 }}>
          <div style={{ width: `${p * 100}%`, height: "100%", background: C.green, borderRadius: 7 }} />
          <div style={{ position: "absolute", left: `calc(${p * 100}% - 20px)`, top: -13, width: 40, height: 40, borderRadius: "50%", background: "#FFF", border: `4px solid ${C.green}`, boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
          <Mono s={18}>RESTAURANT</Mono><Mono s={18} c={C.green} w={800}>UNTERWEGS</Mono><Mono s={18}>MAX</Mono>
        </div>
      </Card>
      <Card style={{ left: 76, top: 470, width: 928, padding: "22px 36px", ...inS(t, T.guter + 0.35, 18) }}>
        {[["1×", "Hühnersuppe, groß", "8,90 €"], ["Absender", "Du", ""]].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 64, borderBottom: i === 0 ? `1.5px solid ${C.line}` : "none" }}>
            <Mono s={22} style={{ width: 170 }}>{r[0]}</Mono>
            <span style={{ fontFamily: F.m, fontSize: 32, color: C.ink, flex: 1 }}>{r[1]}</span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.ink }}>{r[2]}</span>
          </div>
        ))}
        <div style={{ position: "absolute", right: 36, bottom: 30, ...inS(t, T.guter + 0.9, 0, 20) }}><Tag text="BESTELLT VOM AGENT" color={C.green} /></div>
      </Card>
    </>
  );
};

// ---------- Szene 3: Agent schaut genau hin, 38 Grad = Testament ----------
const SceneFieber: React.FC<{ t: number }> = ({ t }) => {
  const temp = 36.6 + 1.4 * k(t, T.mann, Math.max(0.4, T.grad - T.mann + 0.2), Easing.out(Easing.quad));
  return (
    <>
      <TopRow>
        <div style={inS(t, T.agent1, 10)}><Chip text="Agent · Symptom-Check" size={28} /></div>
        <div style={inS(t, T.mann - 0.1, 10)}><Badge label="FIEBER" value={`${temp.toFixed(1).replace(".", ",")} °C`} color={temp >= 37.95 ? C.red : C.green} size={26} /></div>
      </TopRow>
      <Chat t={t} from={T.agent1} title="Die Jungs" sub="Agent analysiert …" avatar={<Avatar emoji="26bd" />}>
        <Row y={22} t={t} a={T.agent1 + 0.15}><Bubble name="Tobi" nameColor={NAMES.tobi} time="21:14" fs={30}>hab 38 grad</Bubble></Row>
        <Row y={130} t={t} a={T.testament - 0.15}>
          <Bubble name="Tobi" nameColor={NAMES.tobi} time="21:15" fs={30} maxW={780}>falls ich's nicht schaffe: meine PS5 kriegt Jonas. die Schuhe Max.</Bubble>
        </Row>
        {t > T.testament + 0.05 ? (
          <div style={{ position: "absolute", left: 28, top: 290, ...inS(t, T.testament + 0.1, 12) }}><Tag text="TESTAMENT ERKANNT" size={24} /></div>
        ) : null}
        <Scan t={t} from={T.agent1 + 0.2} period={1.3} h={300} />
      </Chat>
    </>
  );
};

// ---------- Szene 4: zwei Stufen, Stufe 1 "gute Besserung. Mehr nicht." ----------
const Stage: React.FC<{ n: string; cond: string; act: string; on: number; color: string }> = ({ n, cond, act, on, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, height: 76, padding: "0 18px", borderRadius: 14, border: `3px solid ${on > 0 ? color : "transparent"}`, background: on > 0 ? (color === C.red ? C.redSoft : C.greenSoft) : "transparent" }}>
    <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.12em", color, width: 130 }}>{n}</span>
    <span style={{ fontFamily: F.m, fontSize: 28, color: C.ink, flex: 1 }}>{cond}</span>
    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: C.dim }}>→ {act}</span>
  </div>
);
const SceneStufen: React.FC<{ t: number }> = ({ t }) => {
  const s1 = k(t, T.erkaeltet, 0.3);
  return (
    <>
      <TopRow>
        <div style={inS(t, T.deshalb, 10)}><Chip text="Agent · Regeln" size={28} /></div>
        {t > T.mehr1 - 0.05 ? <div style={inS(t, T.mehr1 - 0.05, 10)}><Badge label="AKTION" value="KEINE" color={C.dim} size={26} /></div> : null}
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, padding: "18px 22px", ...inS(t, T.deshalb, 24) }}>
        <div style={inS(t, T.stufen - 0.1, 10)}><Stage n="STUFE 1" cond="„bin bisschen erkältet“" act="Text" on={s1} color={C.green} /></div>
        <div style={{ marginTop: 8, ...inS(t, T.stufen + 0.15, 10) }}><Stage n="STUFE 2" cond="kommt nicht bis zur Küche" act="Suppe" on={0} color={C.red} /></div>
      </Card>
      <Card style={{ left: 76, top: 420, width: 928, height: 330, overflow: "hidden", background: "#FBFBFA", ...inS(t, T.deshalb + 0.2, 20) }}>
        <Row y={24} t={t} a={T.erkaeltet - 0.25}><Bubble name="Jonas" nameColor={NAMES.jonas} time="08:41" fs={30}>bin bisschen erkältet {E("1f927", 32)}</Bubble></Row>
        <Row y={134} t={t} a={T.besserung - 0.2}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            {AGENT}
            <Bubble name="Agent" nameColor={C.green} time="08:41" fs={30}>gute Besserung</Bubble>
          </div>
        </Row>
      </Card>
    </>
  );
};

// ---------- Szene 5: Tobi kommt nicht mehr bis zur Kueche -> Stufe 2, Bestellung ----------
const SceneBestellung: React.FC<{ t: number }> = ({ t }) => {
  const total = (t >= T.ingwer ? 12.4 : t >= T.suppe3 ? 8.9 : 0).toFixed(2).replace(".", ",");
  const ordered = T.ingwer + 0.6;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.letzten1, 10)}><Chip text="Tobi" dot={NAMES.tobi} size={28} /></div>
        {t > T.kueche1 ? <div style={inS(t, T.kueche1, 10)}><Badge label="STUFE" value="2" color={C.red} size={26} /></div> : null}
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, padding: "20px 28px", background: "#FBFBFA", ...inS(t, T.letzten1, 24) }}>
        <DatePill text="LETZTEN MONAT · 18:52" />
        <div style={{ marginTop: 14 }}>
          {t < T.schaff1 - 0.3 ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: "18px 24px" }}>
              <span style={{ fontFamily: F.s, fontSize: 22, color: NAMES.tobi }}>Tobi</span><Dots t={t} s={12} />
            </div>
          ) : (
            <Bubble name="Tobi" nameColor={NAMES.tobi} time="18:52" fs={32} maxW={820}>{typed("ich schaff es nicht mehr bis zur Küche", t, T.schaff1 - 0.3, T.kueche1 + 0.1)}</Bubble>
          )}
        </div>
      </Card>
      {t > T.kueche1 - 0.05 && t < T.lieferando - 0.2 ? (
        <Card style={{ left: 76, top: 420, width: 928, padding: "16px 22px", ...inS(t, T.kueche1 - 0.05, 20) }}>
          <Stage n="STUFE 2" cond="kommt nicht bis zur Küche" act="Suppe" on={k(t, T.kueche1 + 0.1, 0.3)} color={C.red} />
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14 }}>{AGENT}<Mono s={22} c={C.green} w={800}>AGENT BESTELLT …</Mono><Dots t={t} s={12} c={C.green} /></div>
        </Card>
      ) : null}
      {t > T.lieferando - 0.2 ? (
        <Card style={{ left: 76, top: 360, width: 928, padding: "22px 36px", ...inS(t, T.lieferando - 0.2, 24) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Lieferdienst · Warenkorb</span>
            <Mono s={20}>AN: TOBI</Mono>
          </div>
          <div style={{ borderTop: `2px solid ${C.line}`, margin: "14px 0 4px" }} />
          {[{ n: "Hühnersuppe, groß", p: "8,90 €", a: T.suppe3 - 0.1, e: "1f372" }, { n: "Ingwertee", p: "3,50 €", a: T.ingwer - 0.1, e: "" }].map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 70, borderBottom: `1.5px solid ${C.line}`, ...inS(t, x.a, 0, 24) }}>
              <Mono s={22} style={{ width: 70 }}>1×</Mono>
              <span style={{ fontFamily: F.m, fontSize: 32, color: C.ink, flex: 1 }}>{x.n}</span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.ink }}>{x.p}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", height: 66 }}>
            <Mono s={20} style={{ flex: 1 }}>SUMME</Mono>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{total} €</span>
          </div>
          {t > ordered ? <div style={{ position: "absolute", right: 36, top: 22, ...inS(t, ordered, 0, 20) }}><Tag text="BESTELLT" color={C.green} /></div> : null}
        </Card>
      ) : null}
    </>
  );
};

// ---------- Szene 6: die Studie, Tobi fuehlt sich ernst genommen ----------
const SceneStudie: React.FC<{ t: number }> = ({ t }) => (
  <>
    <TopRow>
      <div style={inS(t, T.dazu, 10)}><Chip text="Agent → Tobi" size={28} /></div>
      {t > T.ernst - 0.1 ? <div style={inS(t, T.ernst - 0.1, 10)}><Badge label="ERNST GENOMMEN" value="100 %" color={C.green} size={26} /></div> : null}
    </TopRow>
    <Card style={{ left: 76, top: 196, width: 928, padding: "26px 34px", ...inS(t, T.dazu + 0.05, 24) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono s={20} c={C.green} w={800}>STUDIE · BMJ · 2017</Mono>
        <Mono s={18}>PDF · 6 SEITEN</Mono>
      </div>
      <div style={{ fontFamily: F.b, fontSize: 40, color: C.ink, letterSpacing: -0.6, lineHeight: 1.15, marginTop: 12 }}>The science behind „man flu“</div>
      <div style={{ borderTop: `2px solid ${C.line}`, margin: "18px 0 14px" }} />
      <div style={{ fontFamily: F.r, fontSize: 29, color: C.ink, lineHeight: 1.35 }}>
        <span style={{ backgroundImage: `linear-gradient(${C.marker}, ${C.marker})`, backgroundRepeat: "no-repeat", backgroundSize: `${k(t, T.maenner, Math.max(0.6, T.krankenhaus - T.maenner + 0.4), Easing.inOut(Easing.quad)) * 100}% 100%`, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone", padding: "0 2px" }}>
          Männer mit Grippe wurden häufiger ins Krankenhaus eingewiesen als Frauen.
        </span>
      </div>
    </Card>
    {t > T.ernst - 0.35 ? (
      <Card style={{ left: 76, top: 560, width: 928, padding: "18px 26px", background: "#FBFBFA", ...inS(t, T.ernst - 0.35, 18) }}>
        <Bubble name="Tobi" nameColor={NAMES.tobi} time="19:20" fs={30} maxW={840}>endlich nimmt mich mal jemand ernst {E("1f64f", 32)}</Bubble>
      </Card>
    ) : null}
  </>
);

// ---------- Szene 7: Foto von der Suppe in der Gruppe, "bester Freund der Welt" ----------
const SceneFoto: React.FC<{ t: number }> = ({ t }) => {
  const hearts = t >= T.bester + 0.5 ? Math.min(3, 1 + Math.floor((t - T.bester - 0.5) / 0.3)) : 0;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.tobi3, 10)}><Chip text="Die Jungs" size={28} /></div>
        {t > T.bester ? <div style={inS(t, T.bester, 10)}><Badge label="BESTER FREUND" value="DU" color={C.green} size={26} /></div> : null}
      </TopRow>
      <Chat t={t} from={T.tobi3} title="Die Jungs" sub="Max, Tobi, Jonas, Agent, Du" avatar={<Avatar emoji="26bd" />}>
        <Row y={20} t={t} a={T.foto - 0.1}>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: 8, width: 520 }}>
              <div style={{ fontFamily: F.s, fontSize: 22, color: NAMES.tobi, margin: "4px 10px 8px" }}>Tobi</div>
              {/* Foto-Vorschau wie im Chat vor dem Laden: unscharfe Farbflaeche, kein Stockfoto */}
              <div style={{ position: "relative", height: 260, borderRadius: 16, overflow: "hidden", background: "radial-gradient(circle at 48% 52%, #F2D27A 0%, #E7B54F 28%, #C98A3A 52%, #8A6A4E 74%, #5E5148 100%)" }}>
                <div style={{ position: "absolute", inset: 0, backdropFilter: "blur(8px)" }} />
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 84, height: 84, borderRadius: "50%", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="36" height="36" viewBox="0 0 24 24"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="#FFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ position: "absolute", left: 14, bottom: 12, background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "3px 10px" }}><Mono s={16} c="#FFF">FOTO · 1,8 MB</Mono></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", margin: "10px 10px 4px" }}>
                <span style={{ fontFamily: F.r, fontSize: 30, color: C.ink, opacity: k(t, T.bester - 0.1, 0.3) }}>{typed("bester Freund der Welt", t, T.bester - 0.1, T.bester + 0.9)}</span>
                <span style={{ fontFamily: F.r, fontSize: 19, color: C.dim }}>19:41</span>
              </div>
            </div>
          </div>
        </Row>
        {hearts > 0 ? (
          <div style={{ position: "absolute", left: 50, top: 410, display: "inline-flex", alignItems: "center", gap: 8, background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 999, padding: "6px 14px", ...inS(t, T.bester + 0.5, 8) }}>
            {E("2764", 26)}<span style={{ fontFamily: F.m, fontSize: 24, color: C.ink }}>{hearts}</span>
          </div>
        ) : null}
      </Chat>
    </>
  );
};

// ---------- Szene 8: Tobi wird auffaellig oft krank. Immer, wenn Fussball laeuft ----------
const SICK = [
  { d: "DI 30.09.", g: "Champions League · 21:00" },
  { d: "SA 04.10.", g: "Bundesliga · 18:30" },
  { d: "DI 07.10.", g: "Länderspiel · 20:45" },
  { d: "SA 11.10.", g: "Bundesliga · 15:30" },
];
const SceneMuster: React.FC<{ t: number }> = ({ t }) => {
  const step = Math.max(0.22, (T.fussball - T.inzwischen - 0.2) / SICK.length);
  const n = SICK.filter((_, i) => t >= T.inzwischen + 0.15 + i * step).length;
  const showGame = t >= T.fussball - 0.1;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.inzwischen, 10)}><Badge label="TOBI KRANK" value={`${n}×`} color={C.red} size={26} /></div>
        {showGame ? <div style={inS(t, T.fussball - 0.1, 10)}><Badge label="FUSSBALL" value={`${n}/${n}`} color={C.green} size={26} /></div> : null}
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, padding: "16px 34px", ...inS(t, T.inzwischen, 24) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 50 }}>
          <span style={{ fontFamily: F.s, fontSize: 30, color: C.ink }}>Agent · Krankmeldungen Tobi</span>
          <Mono s={18}>LETZTE 2 WOCHEN</Mono>
        </div>
        {SICK.map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 108, borderTop: `1.5px solid ${C.line}`, ...inS(t, T.inzwischen + 0.15 + i * step, 0, 24) }}>
            <Mono s={22} style={{ width: 170 }}>{x.d}</Mono>
            <span style={{ fontFamily: F.m, fontSize: 30, color: C.ink, width: 250 }}>„Küche“</span>
            <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, opacity: k(t, T.fussball - 0.1 + i * 0.08, 0.3) }}>
              {E("26bd", 30)}<span style={{ fontFamily: F.r, fontSize: 26, color: C.ink }}>{x.g}</span>
            </span>
          </div>
        ))}
      </Card>
      {showGame ? <Scan t={t} from={T.fussball} period={1.2} top={250} h={430} left={76} w={928} /> : null}
    </>
  );
};

// ---------- Szene 9: Donnerstag, zehn Minuten vor Anpfiff ----------
const KICKOFF_AT = 20 * 60 + 45;
const SceneDonnerstag: React.FC<{ t: number }> = ({ t }) => {
  const left = Math.max(0, 600 - Math.max(0, t - T.anpfiff));
  const mm = String(Math.floor(left / 60)).padStart(2, "0"), ss = String(Math.floor(left % 60)).padStart(2, "0");
  const tm = `${Math.floor((KICKOFF_AT - 10) / 60)}:${String((KICKOFF_AT - 10) % 60).padStart(2, "0")}`;
  return (
    <>
      <TopRow>
        <div style={inS(t, T.letzten2, 10)}><Chip text="Donnerstag" size={28} /></div>
        {t > T.schaff2 - 0.1 ? <div style={inS(t, T.schaff2 - 0.1, 10)}><Badge label="TOBI KRANK" value="5×" color={C.red} size={26} /></div> : null}
      </TopRow>
      <Card style={{ left: 76, top: 196, width: 928, height: 170, padding: "0 34px", display: "flex", alignItems: "center", gap: 26, ...inS(t, T.letzten2, 24) }}>
        {E("26bd", 70)}
        <div style={{ flex: 1 }}>
          <Mono s={20} c={C.red} w={800}>TOPSPIEL · HEUTE</Mono>
          <div style={{ fontFamily: F.s, fontSize: 34, color: C.ink, marginTop: 6 }}>Anpfiff 20:45</div>
        </div>
        <div style={{ textAlign: "right", opacity: k(t, T.anpfiff - 0.1, 0.3) }}>
          <Mono s={18}>ANPFIFF IN</Mono>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.red, fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>{mm}:{ss}</div>
        </div>
      </Card>
      <Card style={{ left: 76, top: 392, width: 928, height: 360, overflow: "hidden", background: "#FBFBFA", ...inS(t, T.letzten2 + 0.2, 24) }}>
        
        <div style={{ position: "absolute", left: 28, right: 28, top: 70, ...inS(t, T.letzten2 + 0.35, 14) }}>
          <Bubble name="Max" nameColor={NAMES.max} time="20:31" fs={30}>wer kommt zum Spiel? bin ab halb da</Bubble>
        </div>
        <div style={{ position: "absolute", left: 28, right: 28, top: 180 }}>
          {t < T.schaff2 - 0.2 ? (
            t > T.anpfiff ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, padding: "18px 24px", ...inS(t, T.anpfiff, 10) }}>
                <span style={{ fontFamily: F.s, fontSize: 22, color: NAMES.tobi }}>Tobi</span><Dots t={t} s={12} />
              </div>
            ) : null
          ) : (
            <div style={inS(t, T.schaff2 - 0.2, 16)}><Bubble name="Tobi" nameColor={NAMES.tobi} time={tm} fs={34} maxW={820}>ich schaff es nicht mehr bis zur Küche</Bubble></div>
          )}
        </div>
        {t > T.schaff2 + 0.6 ? (
          <div style={{ position: "absolute", left: 28, top: 300, display: "flex", alignItems: "center", gap: 14, ...inS(t, T.schaff2 + 0.6, 10) }}>{AGENT}<Mono s={22} c={C.green} w={800}>STUFE 2 · AGENT BESTELLT …</Mono></div>
        ) : null}
      </Card>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: T.guter - 0.05, origin: "50% 55%", El: SceneHook },
  { from: T.guter - 0.05, to: T.agent1 - 0.05, origin: "50% 50%", El: SceneLieferung },
  { from: T.agent1 - 0.05, to: T.deshalb - 0.05, origin: "50% 55%", El: SceneFieber },
  { from: T.deshalb - 0.05, to: T.letzten1 - 0.05, origin: "50% 55%", El: SceneStufen },
  { from: T.letzten1 - 0.05, to: T.dazu - 0.05, origin: "50% 50%", El: SceneBestellung },
  { from: T.dazu - 0.05, to: T.tobi3 - 0.05, origin: "50% 50%", El: SceneStudie },
  { from: T.tobi3 - 0.05, to: T.inzwischen - 0.05, origin: "50% 55%", El: SceneFoto },
  { from: T.inzwischen - 0.05, to: T.letzten2 - 0.05, origin: "50% 50%", El: SceneMuster },
  { from: T.letzten2 - 0.05, to: 999, origin: "50% 55%", El: SceneDonnerstag },
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
const FULL: [number, number][] = [[T.zumindest - 0.05, T.agent1 - 0.05], [T.direkt - 0.1, 999]]; // "Zumindest seine Suppe." und das Ende
/** 0 = Split, 1 = Vollbild-Avatar */
const fullAmt = (t: number) => Math.max(...FULL.map(([a, b]) => Math.min(
  interpolate(t, [a - 0.3, a + 0.05], [0, 1], { ...clamp, easing: smooth }),
  interpolate(t, [b - 0.15, b + 0.2], [1, 0], { ...clamp, easing: smooth }),
)));
const punch = (t: number, a: number, rel: number, amt: number, dIn = 0.3, dOut = 0.45) => amt * Math.min(k(t, a, dIn), 1 - k(t, rel, dOut, smooth));
/** Langsame Fahrt in der Hook, weicher Punch-in auf Pointenwoertern, danach weich wieder raus. */
const avatarZoom = (t: number) => {
  const drift = 0.06 * interpolate(t, [0, T.guter - 0.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }) * (1 - k(t, T.guter - 0.05, 0.45, smooth));
  return 1 + drift
    + punch(t, T.suppe2 - 0.05, T.agent1 - 0.1, 0.2) // "Zumindest seine Suppe."
    + punch(t, T.testament - 0.05, T.deshalb - 0.1, 0.1) // "Testament."
    + punch(t, T.mehr1 - 0.05, T.letzten1 - 0.1, 0.1) // "Mehr nicht."
    + punch(t, T.ernst - 0.05, T.tobi3 - 0.1, 0.1) // "ernst genommen"
    + punch(t, T.fussball - 0.05, T.letzten2 - 0.1, 0.12) // "Fussball laeuft."
    + 0.04 * interpolate(t, [T.direkt - 0.1, T.direkt + 0.4], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) })
    + punch(t, T.nudeln - 0.05, 999, 0.16); // "extra Nudeln."
};

// ---------- Ende: harter Schnitt auf den Chat mit "gern mit extra Nudeln" ----------
const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const cam = 1 + 0.015 * (t - SPEECH_END);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 76, top: 300 }}><Badge label="ANPFIFF IN" value="10:00" color={C.red} /></div>
        <Card style={{ left: 76, top: 420, width: 928, height: 1000, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, height: 104, padding: "0 30px", borderBottom: `1.5px solid ${C.line}` }}>
            <span style={{ fontFamily: F.s, fontSize: 44, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
            <Avatar emoji="26bd" s={60} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: F.s, fontSize: 34, color: C.ink }}>Die Jungs</span>
              <span style={{ fontFamily: F.r, fontSize: 23, color: C.dim, marginTop: 4 }}>Max, Tobi, Jonas, Agent, Du</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 104, bottom: 0, background: "#FBFBFA", padding: "0 34px" }}>
            <DatePill text="DONNERSTAG" style={{ marginTop: 34 }} />
            <div style={{ marginTop: 40 }}><Bubble name="Tobi" nameColor={NAMES.tobi} time="20:35" fs={46} maxW={820}>ich schaff es nicht mehr bis zur Küche</Bubble></div>
            <div style={{ marginTop: 22 }}><Bubble name="Tobi" nameColor={NAMES.tobi} time="20:35" fs={60} maxW={820}>gern mit extra Nudeln {E("1f35c", 64)}</Bubble></div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const GptHuehnersuppe: React.FC = () => {
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
      {/* Vollbild-Moment "Zumindest seine Suppe.": kleine Karte ueber dem Kopf, nie ueber dem Gesicht */}
      {f > 0.01 && t < T.agent1 + 0.5 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: CARD_TOP, display: "flex", justifyContent: "center", opacity: f * k(t, T.suppe2 - 0.1, 0.3), transform: `translateY(${(1 - k(t, T.suppe2 - 0.1, 0.35)) * 14}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: "16px 26px", boxShadow: shadow }}>
            {E("1f372", 52)}
            <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Hühnersuppe</span>
            <Tag text="ZUGESTELLT" color={C.green} />
          </div>
        </div>
      ) : null}
      <SeamCaption t={t} top={capTop} />
    </AbsoluteFill>
  );
};
