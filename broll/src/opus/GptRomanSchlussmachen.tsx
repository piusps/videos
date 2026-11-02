import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "./roman-words.json";

// @florentgpt Satire "Roman zum Schlussmachen" (13.10.). Stil wie GptOpusAustralien (zoom-test, von Henri freigegeben):
// heller Raster-Canvas, echte Chat-UI-Karten, Mono-Badges mit Zaehlern, Scan-Linie, ChatGPT-Gruen.
// Nur weiches Ease-out, kein spring/Bounce/Overshoot. Emojis nur als gerenderte Apple-Emoji-PNGs in der Chat-UI.

const MONO = "JBMono";
const DIR = "gpts-roman-schlussmachen";

const FPS = 25;
const SPEECH_END = 31.38; // Ende "Daumen." auf der gekuerzten Timeline
const END_HOLD = 1.0; // harter Schnitt auf "ok 👍", eine Sekunde stehen lassen
export const GRS_FRAMES = Math.round((SPEECH_END + END_HOLD) * FPS);
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

// ---------- Der Roman (vier Absaetze) ----------
type Seg = { s: string; mark?: number };
const ROMAN: Seg[][] = [
  [{ s: "Hey. Ich habe lange überlegt, wie ich dir das sagen soll. Unsere " }, { s: "gemeinsame Reise", mark: 1 }, { s: " war das Wertvollste, was ich je erleben durfte." }],
  [{ s: "Durch dich habe ich so viel über mich selbst gelernt", mark: 2 }, { s: ". Über Nähe, über Vertrauen und darüber, was ich wirklich brauche." }],
  [{ s: "Gleichzeitig spüre ich, dass wir uns in unterschiedliche Richtungen entwickeln. Das ist niemandes Schuld." }],
  [{ s: "Ich sehe dich. Ich verstehe dich.", mark: 3 }, { s: " Und ich wünsche dir von Herzen jemanden, der dir all das geben kann, was du verdienst." }],
];
const Roman: React.FC<{ marks: number[]; fs?: number; repeat?: number }> = ({ marks, fs = 31, repeat = 1 }) => (
  <>
    {Array.from({ length: repeat }).flatMap((_, r) =>
      ROMAN.map((p, i) => (
        <p key={`${r}-${i}`} style={{ margin: i === 0 && r === 0 ? 0 : `${fs * 0.7}px 0 0`, fontFamily: F.r, fontSize: fs, lineHeight: 1.38, color: C.ink }}>
          {p.map((sg, j) => {
            const m = sg.mark ? marks[sg.mark - 1] ?? 0 : 0;
            return (
              <span key={j} style={m > 0 ? { backgroundImage: `linear-gradient(${C.marker}, ${C.marker})`, backgroundRepeat: "no-repeat", backgroundSize: `${m * 100}% 100%`, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone", borderRadius: 4, padding: "0 2px" } : undefined}>{sg.s}</span>
            );
          })}
        </p>
      )),
    )}
  </>
);
const RomanBubble: React.FC<{ marks: number[]; scroll: number; height: number; time?: string; repeat?: number }> = ({ marks, scroll, height, time = "22:14", repeat = 1 }) => (
  <div style={{ position: "relative", margin: "0 0 0 28px", width: 760, height, background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 22, borderTopLeftRadius: 6, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 24, right: 24, top: 18 - scroll }}>
      <Roman marks={marks} repeat={repeat} />
    </div>
    <div style={{ position: "absolute", right: 16, bottom: 10, background: "rgba(255,255,255,0.9)", borderRadius: 8, padding: "2px 6px" }}>
      <span style={{ fontFamily: F.r, fontSize: 19, color: C.dim }}>{time}</span>
    </div>
  </div>
);
const JONAS = <Avatar letter="J" color="#8FA3B8" />;

// ---------- Szene A (0 - 4.75): drei Jahre "ok", dann klappt der Roman auf ----------
const OUT_MSGS = ["Bin gut angekommen!", "Kino am Freitag?", "Hab dich heute vermisst", "Mama fragt, ob du Sonntag kommst", "Ich hab die Wohnung!!", "Bist du sauer?", "Denkst du an morgen?", "Ich liebe dich", "Rufst du zurück?", "Wie war dein Tag?", "Soll ich was mitbringen?", "Gute Nacht"];
const IN_MSGS = ["ok", "ok", "👍", "ok", "k", "ok", "👍", "ok", "ok", "👍", "ok", "ok"];
type Row = { kind: "date" | "out" | "in"; text: string; y: number; h: number };
const HOOK_ROWS: Row[] = (() => {
  const rows: Row[] = [];
  let y = 18;
  const add = (kind: Row["kind"], text: string, h: number) => { rows.push({ kind, text, y, h }); y += h; };
  OUT_MSGS.forEach((m, i) => {
    if (i === 0) add("date", "MÄRZ 2023", 62);
    if (i === 4) add("date", "2024", 62);
    if (i === 8) add("date", "2025", 62);
    add("out", m, 76);
    add("in", IN_MSGS[i], 76);
  });
  return rows;
})();
const HOOK_END = HOOK_ROWS[HOOK_ROWS.length - 1].y + 76;
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const oks = Math.round(180 + 1104 * k(t, 0.05, 2.6, Easing.out(Easing.quad))); // Frame 0 = Cover, Zaehler laeuft schon
  const ROMAN_AT = 2.95;
  const viewH = 480;
  const scroll = interpolate(t, [0, 2.75], [0, HOOK_END - viewH + 40], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const open = k(t, ROMAN_AT + 0.1, 0.55, smooth); // Roman klappt auf
  const pushUp = open * (viewH - 30);
  const romanScroll = Math.max(0, t - (ROMAN_AT + 0.55)) * 260; // scrollt endlos
  const wordsN = Math.round(1247 * k(t, ROMAN_AT + 0.1, 1.6, Easing.out(Easing.quad)));
  const writing = t > 2.5 && t < ROMAN_AT + 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>
        <div><Badge label="3 JAHRE" value={`${fmt(oks)}× OK`} color={C.green} /></div>
        {t > ROMAN_AT ? <div style={inS(t, ROMAN_AT, 10)}><Badge label="NEU" value={`${fmt(wordsN)} WÖRTER`} color={C.red} /></div> : null}
      </div>
      <Chat t={t} from={-1} noAnim title="Jonas" sub={writing ? <span style={{ color: C.green }}>schreibt …</span> : "online"} avatar={JONAS}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -scroll - pushUp }}>
          {HOOK_ROWS.map((r, i) => (
            <div key={i} style={{ position: "absolute", left: 28, right: 28, top: r.y }}>
              {r.kind === "date" ? <DatePill text={r.text} /> : r.kind === "out" ? (
                <Bubble out time="" fs={30}>{r.text}</Bubble>
              ) : (
                <Bubble fs={30}>{r.text === "👍" ? <Emo code="1f44d" s={34} /> : r.text}</Bubble>
              )}
            </div>
          ))}
          <div style={{ position: "absolute", left: 0, top: HOOK_END + 10, opacity: k(t, ROMAN_AT + 0.05, 0.2) }}>
            <RomanBubble marks={[]} scroll={romanScroll} height={30 + open * (viewH + 600)} repeat={4} />
          </div>
        </div>
        {/* Scroll-Leiste rechts */}
        <div style={{ position: "absolute", right: 8, top: 14 + interpolate(t, [0, 4.75], [0, 360], clamp), width: 6, height: 70, borderRadius: 3, background: "rgba(0,0,0,0.18)" }} />
      </Chat>
    </>
  );
};

// ---------- Szene B (4.75 - 7.95): Geburtstag, nur ein Herz ----------
const NOTIS = [
  { n: "Mama", m: "Alles, alles Liebe zu deinem Geburtstag, mein Schatz! Wir sind so stolz auf dich", tm: "07:12", at: 4.9 },
  { n: "Sophie", m: "HAPPY BIRTHDAY!!! Heute wird gefeiert, keine Widerrede", tm: "09:30", at: 5.2 },
  { n: "Oma Gisela", m: "Liebe Lena, ich wünsche dir Gesundheit und ganz viel Glück", tm: "11:05", at: 5.5 },
  { n: "Marie", m: "Du bist die Beste, ich hab dich so lieb, auf das nächste Jahr", tm: "16:48", at: 5.8 },
];
const NotiRow: React.FC<{ name: string; msg: React.ReactNode; tm: string; hl?: number; style?: React.CSSProperties }> = ({ name, msg, tm, hl = 0, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 22px", height: 104, boxSizing: "border-box", borderRadius: 18, background: "#FFF", border: `3px solid ${hl > 0 ? `rgba(229,72,77,${hl})` : "transparent"}`, boxShadow: "0 6px 16px rgba(20,20,20,0.07)", ...style }}>
    <span style={{ width: 58, height: 58, borderRadius: 14, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="34" height="34" viewBox="0 0 24 24"><path d="M4 18.5l1.2-3.6A8 8 0 1 1 8.6 18L4 18.5z" fill="none" stroke="#FFF" strokeWidth="2" strokeLinejoin="round" /></svg>
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: F.s, fontSize: 27, color: C.ink }}>{name}</span>
        <span style={{ fontFamily: F.r, fontSize: 21, color: C.dim }}>{tm}</span>
      </div>
      <div style={{ fontFamily: F.r, fontSize: 26, color: "#55554F", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 4 }}>{msg}</div>
    </div>
  </div>
);
const SceneGeburtstag: React.FC<{ t: number }> = ({ t }) => {
  const HEART = 6.4;
  const n = Math.round(23 * k(t, 4.85, 1.4, Easing.out(Easing.quad)));
  const shift = k(t, HEART, 0.4) * 0; // Liste bleibt stehen
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={inS(t, 4.75, 10)}><Chip text={<span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>14. März · dein Geburtstag <Emo code="1f382" s={30} /></span>} size={28} /></div>
        <div style={inS(t, 4.9, 10)}><Badge label="NACHRICHTEN" value={`${n}`} color={C.green} size={26} /></div>
      </div>
      <div style={{ position: "absolute", left: 76, top: 196, width: 928, transform: `translateY(${-shift}px)` }}>
        {NOTIS.map((x, i) => (
          <NotiRow key={i} name={x.n} msg={x.m} tm={x.tm} style={{ marginBottom: 14, opacity: HEART <= t ? 0.55 : 1, ...inS(t, x.at, 22) }} />
        ))}
      </div>
      {t >= HEART - 0.05 ? (
        <div style={{ position: "absolute", left: 76, top: 196 + 4 * 118, width: 928, ...inS(t, HEART, 22) }}>
          <NotiRow name="Jonas" msg={<Emo code="2764" s={32} style={{ verticalAlign: "-4px" }} />} tm="23:58" hl={k(t, 6.95, 0.3)} />
          <div style={{ position: "absolute", right: 24, top: 52, ...inS(t, 7.0, 0, 20) }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: "#FFF", background: C.red, borderRadius: 8, padding: "6px 10px 6px 12px" }}>OHNE TEXT</span>
          </div>
        </div>
      ) : null}
    </>
  );
};

// ---------- Szene C (7.95 - 13.55): vier Absaetze, gruene Marker ----------
const SceneRoman: React.FC<{ t: number }> = ({ t }) => {
  const abs = 1 + Math.round(3 * k(t, 8.5, 0.9, Easing.out(Easing.quad)));
  const m1 = k(t, 9.55, 0.6, Easing.inOut(Easing.quad));
  const m2 = k(t, 11.45, 1.4, Easing.inOut(Easing.quad));
  // Scroll: erst Absatz 1 ("gemeinsame Reise"), dann Absatz 2 ("durch dich ... gelernt") in die Mitte
  const scroll = interpolate(t, [7.95, 9.3, 10.6, 11.4, 13.55], [0, 10, 30, 70, 105], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const scanY = ((t - 8.2) % 1.6) / 1.6;
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={inS(t, 7.95, 10)}><Chip text="Jonas" size={28} /></div>
        <div style={inS(t, 8.2, 10)}><Badge label="ABSÄTZE" value={`${abs}`} color={C.green} size={26} /></div>
        {t > 11.4 ? <div style={inS(t, 11.45, 10)}><Badge label="SELBSTERKENNTNIS" value="100 %" color={C.green} size={26} /></div> : null}
      </div>
      <Chat t={t} from={7.95} title="Jonas" sub="zuletzt online 22:14" avatar={JONAS}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 22 }}>
          <RomanBubble marks={[m1, m2]} scroll={scroll} height={450} />
        </div>
        {t > 8.2 ? (
          <div style={{ position: "absolute", left: 30, width: 764, top: 40 + scanY * 400, height: 3, background: C.green, boxShadow: `0 0 18px ${C.green}`, opacity: 0.75 * k(t, 8.2, 0.3) }} />
        ) : null}
      </Chat>
    </>
  );
};

// ---------- Szene D/E (13.55 - 22.55): Gruppenchat, Lea fliegt raus ----------
type GMsg = { at: number; h: number; el: (t: number) => React.ReactNode };
const NAMES = { sophie: "#D6336C", marie: "#7048E8", jule: "#E8590C", lea: "#1098AD" };
const G_MSGS: GMsg[] = [
  {
    at: 13.65, h: 262, el: () => (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ background: C.out, borderRadius: 22, borderTopRightRadius: 6, padding: "12px 20px 14px", width: 600 }}>
          <div style={{ fontFamily: F.r, fontSize: 21, color: C.dim, fontStyle: "italic", marginBottom: 6 }}>↪ Weitergeleitet</div>
          <div style={{ borderLeft: `5px solid ${C.green}`, background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: "8px 14px" }}>
            <div style={{ fontFamily: F.s, fontSize: 22, color: C.green }}>Jonas</div>
            <div style={{ fontFamily: F.r, fontSize: 25, color: C.ink, lineHeight: 1.3, height: 98, overflow: "hidden" }}>Hey. Ich habe lange überlegt, wie ich dir das sagen soll. Unsere gemeinsame Reise war das Wertvollste, was ich je …</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontFamily: F.s, fontSize: 22, color: C.green }}>Mehr anzeigen · 4 Absätze</span>
            <span style={{ fontFamily: F.r, fontSize: 19, color: C.dim }}>22:31</span>
          </div>
        </div>
      </div>
    ),
  },
  { at: 16.1, h: 108, el: () => <Bubble name="Sophie" nameColor={NAMES.sophie} time="22:32" fs={30}>so reif <Emo code="1f62d" s={32} /></Bubble> },
  { at: 16.85, h: 108, el: () => <Bubble name="Marie" nameColor={NAMES.marie} time="22:32" fs={30}>er ist so gewachsen <Emo code="1f979" s={32} /></Bubble> },
  { at: 17.4, h: 108, el: () => <Bubble name="Jule" nameColor={NAMES.jule} time="22:33" fs={30}>so reif war er noch nie</Bubble> },
  {
    at: 19.9, h: 108, el: (t) => (
      <Bubble name="Lea" nameColor={NAMES.lea} time="22:35" fs={30} style={{ opacity: 1 - 0.5 * k(t, 21.4, 0.4) }}>das klingt nach ChatGPT</Bubble>
    ),
  },
  {
    at: 21.35, h: 70, el: () => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span style={{ background: "#FFF3D6", borderRadius: 10, padding: "8px 18px", fontFamily: F.m, fontSize: 24, color: "#6B5A2E" }}>Du hast Lea entfernt</span>
      </div>
    ),
  },
];
const SceneGruppe: React.FC<{ t: number }> = ({ t }) => {
  const viewH = 470;
  let y = 20;
  const placed = G_MSGS.map((m) => { const r = { ...m, y }; y += m.h + 14; return r; });
  // Scroll so, dass die neueste sichtbare Nachricht unten steht
  const scroll = placed.reduce((acc, m) => acc + Math.max(0, m.y + m.h + 20 - viewH - acc) * k(t, m.at, 0.4), 0);
  const agree = (t >= 16.1 ? 1 : 0) + (t >= 16.85 ? 1 : 0) + (t >= 17.4 ? 1 : 0);
  const members = t >= 21.35 ? 4 : 5;
  const leaTyping = t > 18.85 && t < 19.9;
  const othersTyping = t > 15.4 && t < 16.1;
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={inS(t, 13.55, 10)}><Chip text="Gruppenchat" size={28} /></div>
        {t < 18.6 ? (
          <div style={inS(t, 13.75, 10)}><Badge label="FINDEN ES REIF" value={`${agree}/4`} color={C.green} size={26} /></div>
        ) : (
          <div style={inS(t, 18.6, 10)}><Badge label="MITGLIEDER" value={`${members}`} color={members === 4 ? C.red : C.green} size={26} /></div>
        )}
      </div>
      <Chat t={t} from={13.55} title="Mädels" sub={leaTyping ? <span style={{ color: C.green }}>Lea schreibt …</span> : othersTyping ? <span style={{ color: C.green }}>Sophie schreibt …</span> : t >= 21.35 ? "Sophie, Marie, Jule, Du" : "Sophie, Marie, Jule, Lea, Du"} avatar={<Avatar emoji="1f4ac" />}>
        <div style={{ position: "absolute", left: 28, right: 28, top: -scroll }}>
          {placed.map((m, i) => (t >= m.at - 0.02 ? (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: m.y, ...inS(t, m.at, 18) }}>{m.el(t)}</div>
          ) : null))}
        </div>
      </Chat>
      {t > 21.35 ? (
        <div style={{ position: "absolute", right: 76, top: 96, ...inS(t, 21.45, 12) }}>
          <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, letterSpacing: "0.12em", color: "#FFF", background: C.red, borderRadius: 12, padding: "14px 20px 14px 24px", display: "inline-block" }}>ENTFERNT</span>
        </div>
      ) : null}
    </>
  );
};

// ---------- Szene F (22.55 - 26.55): 23:47, derselbe Roman, jeden Abend ----------
const SceneAbend: React.FC<{ t: number }> = ({ t }) => {
  const reads = 1 + Math.round(13 * k(t, 22.9, 1.5, Easing.out(Easing.quad)));
  const m3 = k(t, 25.8, 0.55, Easing.inOut(Easing.quad));
  const scroll = interpolate(t, [22.55, 25.6], [170, 420], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const scanY = ((t - 22.7) % 1.8) / 1.8;
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={inS(t, 22.55, 10)}><Badge label="UHRZEIT" value="23:47" color={C.green} size={26} /></div>
        <div style={inS(t, 22.75, 10)}><Badge label="GELESEN" value={`${reads}×`} color={C.green} size={26} /></div>
      </div>
      <Chat t={t} from={22.55} title="Jonas" sub="zuletzt online vor 6 Tagen" avatar={JONAS}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 22 }}>
          <RomanBubble marks={[1, 1, m3]} scroll={scroll} height={450} />
        </div>
        <div style={{ position: "absolute", left: 30, width: 764, top: 40 + scanY * 400, height: 3, background: C.green, boxShadow: `0 0 18px ${C.green}`, opacity: 0.7 * (1 - k(t, 25.7, 0.3)) }} />
      </Chat>
    </>
  );
};

// ---------- Szene G (26.55 - 29.6): Tag 14, "Koennen wir nochmal reden?" ----------
const ASK = "Können wir nochmal reden?";
const SceneFrage: React.FC<{ t: number }> = ({ t }) => {
  const day = 1 + Math.round(13 * k(t, 26.6, 0.7, Easing.out(Easing.quad)));
  const SENT = 28.75;
  const typing = typed(ASK, t, 27.3, 28.5);
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 92, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={inS(t, 26.55, 10)}><Badge label="TAG" value={`${day}`} color={C.green} size={26} /></div>
        <div style={inS(t, 26.7, 10)}><Chip text="Jonas" size={28} /></div>
      </div>
      <Chat t={t} from={26.55} title="Jonas" sub={t > 29.25 ? <span style={{ color: C.green }}>schreibt …</span> : "zuletzt online vor 14 Tagen"} avatar={JONAS}
        input={t < SENT ? (typing ? <>{typing}<Caret t={t} h={30} /></> : <span style={{ color: C.dim }}>Nachricht</span>) : <span style={{ color: C.dim }}>Nachricht</span>}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 18 - (t >= SENT ? 90 * k(t, SENT, 0.35) : 0) }}>
          <div style={{ opacity: 0.55 }}><RomanBubble marks={[1, 1, 1]} scroll={360} height={250} /></div>
          <DatePill text="HEUTE" style={{ marginTop: 18 }} />
          {t >= SENT ? (
            <div style={{ marginTop: 16, padding: "0 28px", ...inS(t, SENT, 16) }}>
              <Bubble out time="23:52" read={t > 29.05 ? true : "grey"} fs={32}>{ASK}</Bubble>
            </div>
          ) : null}
        </div>
      </Chat>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: 4.75, origin: "50% 55%", El: SceneHook },
  { from: 4.75, to: 7.95, origin: "50% 60%", El: SceneGeburtstag },
  { from: 7.95, to: 13.55, origin: "50% 55%", El: SceneRoman },
  { from: 13.55, to: 22.55, origin: "50% 60%", El: SceneGruppe },
  { from: 22.55, to: 26.55, origin: "50% 55%", El: SceneAbend },
  { from: 26.55, to: 99, origin: "50% 60%", El: SceneFrage },
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
const FULL: [number, number][] = [[6.85, 7.95], [29.6, 99]]; // "Ohne Text." und das Ende "ok. Und einen Daumen."
/** 0 = Split, 1 = Vollbild-Avatar */
const fullAmt = (t: number) => Math.max(...FULL.map(([a, b]) => Math.min(
  interpolate(t, [a - 0.3, a + 0.05], [0, 1], { ...clamp, easing: smooth }),
  interpolate(t, [b - 0.15, b + 0.2], [1, 0], { ...clamp, easing: smooth }),
)));
const punch = (t: number, a: number, rel: number, amt: number, dIn = 0.3, dOut = 0.45) => amt * Math.min(k(t, a, dIn), 1 - k(t, rel, dOut, smooth));
/** Langsame Fahrt in der Hook, weicher Punch-in auf Pointenwoertern, danach weich wieder raus. */
const avatarZoom = (t: number) => {
  const drift = 0.06 * interpolate(t, [0, 4.1], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) }) * (1 - k(t, 4.75, 0.45, smooth));
  return 1 + drift
    + punch(t, 4.18, 4.75, 0.1) // "Roman."
    + punch(t, 7.0, 7.85, 0.2) // "Ohne Text."
    + punch(t, 21.37, 22.45, 0.1) // "Lea fliegt"
    + punch(t, 25.85, 26.5, 0.12) // "versteht dich."
    + 0.04 * interpolate(t, [29.6, 30.0], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) })
    + punch(t, 30.05, 99, 0.12) // "ok."
    + punch(t, 30.93, 99, 0.08); // "Daumen."
};

// ---------- Ende: harter Schnitt auf "ok 👍" ----------
const EndCard: React.FC<{ t: number }> = ({ t }) => {
  const cam = 1 + 0.015 * (t - SPEECH_END);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: "50% 50%" }}>
        <Card style={{ left: 76, top: 420, width: 928, height: 1040, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, height: 104, padding: "0 30px", borderBottom: `1.5px solid ${C.line}` }}>
            <span style={{ fontFamily: F.s, fontSize: 44, color: C.green, marginRight: 4, marginTop: -4 }}>‹</span>
            <Avatar letter="J" color="#8FA3B8" s={60} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: F.s, fontSize: 34, color: C.ink }}>Jonas</span>
              <span style={{ fontFamily: F.r, fontSize: 23, color: C.dim, marginTop: 4 }}>online</span>
            </div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 104, bottom: 0, background: "#FBFBFA", padding: "0 34px" }}>
            <DatePill text="HEUTE" style={{ marginTop: 34 }} />
            <div style={{ marginTop: 60 }}><Bubble time="23:58" fs={72} maxW={800}>ok</Bubble></div>
            <div style={{ marginTop: 26, marginLeft: 8 }}><Emo code="1f44d" s={230} style={{ verticalAlign: "top" }} /></div>
            <div style={{ marginLeft: 12, marginTop: 6 }}><span style={{ fontFamily: F.r, fontSize: 24, color: C.dim }}>23:58</span></div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const GptRomanSchlussmachen: React.FC = () => {
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
  // Split: Video 280 px nach unten (Schultern + Hand). Vollbild: Video bei 0, Gesicht mittig.
  const vTop = 280 * (1 - f);
  const z = avatarZoom(t);
  const FACE_Y = 900; // Gesichtsmitte im Quellvideo (Zoom-Ursprung)
  const capTop = PH + (1580 - PH) * f; // Vollbild: Brusthoehe
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
      {/* Vollbild-Moment "Ohne Text.": kleine Karte ueber dem Kopf, nie ueber dem Gesicht */}
      {f > 0.01 && t < 10 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: f * k(t, 6.9, 0.3), transform: `translateY(${(1 - k(t, 6.9, 0.35)) * 14}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: "16px 26px", boxShadow: shadow }}>
            <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Jonas</span>
            <Emo code="2764" s={44} style={{ verticalAlign: "middle" }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: "0.14em", color: C.dim }}>23:58</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: "#FFF", background: C.red, borderRadius: 8, padding: "6px 10px 6px 12px" }}>0 WÖRTER</span>
          </div>
        </div>
      ) : null}
      <SeamCaption t={t} top={capTop} />
    </AbsoluteFill>
  );
};
