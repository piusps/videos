import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import words from "./words.json";

// Stil-Vorschau @florentgpt (Henri 13.10.): Richtung B, orientiert am FP-System (KontoauszugOpus): heller Raster-Canvas,
// echte UI-Karten, Mono-Pille auf der Naht. GPT-Unterschied: ChatGPT-Gruen statt Claude-Orange, ChatGPT-Fenster statt Claude.
// Keine Federn, kein Overshoot, kein Bounce: nur weiches Ease-out (fade + kurzer Weg). Nur 0-9,5 s als Vorschau.

const MONO = "JBMono";

const FPS = 25;
export const GOA_FRAMES = Math.round(9.5 * FPS);
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
  red: "#E5484D",
  redSoft: "#FDECEC",
  chip: "#141414",
  bubble: "#F1F1F1",
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
const k = (t: number, a: number, d = 0.35, e = ease) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
/** Weiches Einblenden: Fade + kurzer Weg, kein Overshoot. */
const inS = (t: number, a: number, dy = 16, dx = 0, d = 0.38): React.CSSProperties => {
  const p = k(t, a, d);
  return { opacity: k(t, a, d * 0.6), transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px)` };
};
const outS = (t: number, a: number, dx = -60, d = 0.32): React.CSSProperties => {
  const p = k(t, a, d, Easing.bezier(0.7, 0, 0.84, 0));
  return { opacity: 1 - p, transform: `translateX(${p * dx}px)` };
};

const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: 20, boxShadow: shadow, ...style }}>{children}</div>
);
const Chip: React.FC<{ text: string; dot?: string; size?: number }> = ({ text, dot = C.green, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: F.s, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>
    <span style={{ width: size * 0.46, height: size * 0.46, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Mono: React.FC<{ s: number; c?: string; w?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ s, c = C.dim, w = 700, style, children }) => (
  <span style={{ fontFamily: MONO, fontWeight: w, fontSize: s, letterSpacing: "0.14em", color: c, ...style }}>{children}</span>
);
const Badge: React.FC<{ label: string; value: string; color: string; size?: number }> = ({ label, value, color, size = 34 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.6, background: "#FFF", border: `3px solid ${color}`, borderRadius: 14, padding: `${size * 0.4}px ${size * 0.7}px`, boxShadow: shadow, fontFamily: MONO, whiteSpace: "nowrap" }}>
    <span style={{ fontSize: size * 0.7, fontWeight: 800, letterSpacing: "0.14em", color }}>{label}</span>
    <span style={{ fontSize: size * 1.3, fontWeight: 800, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{value}</span>
  </div>
);
const Caret: React.FC<{ t: number; h?: number }> = ({ t, h = 34 }) => (
  <span style={{ display: "inline-block", width: 3, height: h, background: C.ink, marginLeft: 3, verticalAlign: "middle", opacity: Math.floor(t * 2.2) % 2 === 0 ? 1 : 0 }} />
);
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * interpolate(t, [a, b], [0, 1], clamp)));

// ---------- Szene A (0 - 4.32): Reise-Karte + Tageszaehler, dann Wortschatz-Karte, die verfaellt ----------
const VOCAB = [
  { w: "Gabel", at: 2.55 },
  { w: "Löffel", at: 2.85 },
  { w: "Kühlschrank", at: 3.15 },
  { w: "Steckdose", at: 3.45 },
];
const SceneReise: React.FC<{ t: number }> = ({ t }) => {
  const days = Math.round(365 * k(t, 0.25, 1.9, Easing.out(Easing.quad)));
  const swap = 2.3;
  const dePct = Math.round(100 - 88 * k(t, 2.5, 1.5, Easing.inOut(Easing.cubic)));
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 92 }}>
        <div style={{ fontFamily: F.b, fontSize: 60, color: C.ink, letterSpacing: -0.8, lineHeight: 1.06, ...inS(t, 0, 10) }}>Ein Jahr Australien</div>
        <div style={{ fontFamily: F.b, fontSize: 60, color: C.green, letterSpacing: -0.8, lineHeight: 1.06, ...inS(t, 0.12, 10) }}>= Deutsch verlernt</div>
      </div>
      {/* Reise-Karte */}
      <div style={{ ...outS(t, swap, -90) }}>
        <Card style={{ left: 76, top: 290, width: 928, padding: "28px 36px", ...inS(t, 0.05, 24) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Work &amp; Travel · Kumpel</span>
            <Mono s={20}>BORDKARTE</Mono>
          </div>
          <div style={{ borderTop: `2px solid ${C.line}`, margin: "18px 0 6px" }} />
          {[
            { d: "01.09.25", r: "FRA → SYD", s: "HINFLUG", at: 0.2 },
            { d: "01.09.26", r: "SYD → FRA", s: "RÜCKFLUG", at: 0.5 },
          ].map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", height: 74, borderBottom: i === 0 ? `1.5px solid ${C.line}` : "none", ...inS(t, x.at, 0, 24) }}>
              <Mono s={22} style={{ width: 160 }}>{x.d}</Mono>
              <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 38, color: C.ink, flex: 1, letterSpacing: "0.04em" }}>{x.r}</span>
              <Mono s={20} c={i === 1 ? C.green : C.dim} w={800}>{x.s}</Mono>
            </div>
          ))}
        </Card>
        <div style={{ position: "absolute", left: 76, top: 590, ...inS(t, 0.3, 14) }}>
          <Badge label="IN AUSTRALIEN" value={`${days} TAGE`} color={C.green} />
        </div>
        <div style={{ position: "absolute", right: 76, top: 610, ...inS(t, 1.42, 14) }}>
          <Chip text="Sydney" dot={C.green} size={28} />
        </div>
      </div>
      {/* Wortschatz-Karte */}
      <div style={{ position: "absolute", inset: 0, opacity: k(t, swap + 0.05, 0.3) }}>
        <Card style={{ left: 76, top: 290, width: 600, padding: "26px 32px", ...inS(t, swap + 0.05, 0, 80) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: F.s, fontSize: 30, color: C.ink }}>Wortschatz · Deutsch</span>
          </div>
          <div style={{ borderTop: `2px solid ${C.line}`, margin: "16px 0 4px" }} />
          {VOCAB.map((v, i) => {
            const s = k(t, v.at, 0.25);
            return (
              <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", height: 66, borderBottom: i < VOCAB.length - 1 ? `1.5px solid ${C.line}` : "none" }}>
                <span style={{ fontFamily: F.m, fontSize: 34, color: s > 0.5 ? "#B9B9B4" : C.ink }}>{v.w}</span>
                <div style={{ position: "absolute", left: -6, top: 33, height: 4, width: (v.w.length * 19 + 14) * s, background: C.red, borderRadius: 2 }} />
                <span style={{ marginLeft: "auto", opacity: s }}><Mono s={18} c={C.red} w={800}>VERGESSEN</Mono></span>
              </div>
            );
          })}
        </Card>
        {/* Scan-Linie */}
        {t > 2.45 && t < 3.8 ? (
          <div style={{ position: "absolute", left: 60, width: 632, top: 370 + interpolate(t, [2.45, 3.7], [0, 264], { ...clamp, easing: Easing.inOut(Easing.sin) }), height: 3, background: C.green, boxShadow: `0 0 18px ${C.green}`, opacity: 0.85 }} />
        ) : null}
        <Card style={{ left: 712, top: 290, width: 292, padding: "24px 26px", ...inS(t, swap + 0.2, 0, 60) }}>
          <Mono s={18}>DEUTSCH</Mono>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: dePct < 50 ? C.red : C.ink, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{dePct} %</div>
          <div style={{ height: 12, background: C.line, borderRadius: 6, marginTop: 12, overflow: "hidden" }}>
            <div style={{ width: `${dePct}%`, height: "100%", background: dePct < 50 ? C.red : C.green, borderRadius: 6 }} />
          </div>
        </Card>
        <div style={{ position: "absolute", left: 712, top: 540, ...inS(t, 3.87, 12) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, letterSpacing: "0.12em", color: "#FFF", background: C.red, borderRadius: 12, padding: "14px 20px 14px 24px" }}>VERLERNT</div>
        </div>
      </div>
    </>
  );
};

// ---------- Szene B (4.32 - 6.84): ChatGPT-Fenster, er tippt die Frage ----------
const Q = "Wie heißt das nochmal auf Deutsch?";
const HIST = ["Was heißt nochmal „fridge“?", "Wie sagt man „plug“ auf Deutsch?"];
const ChatWindow: React.FC<{ t: number; from: number; children: React.ReactNode; input?: React.ReactNode; history?: boolean }> = ({ t, from, children, input, history }) => (
  <Card style={{ left: 76, top: 200, width: 928, height: 560, overflow: "hidden", ...inS(t, from, 26) }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 76, padding: "0 30px", borderBottom: `1.5px solid ${C.line}` }}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF5F57" }} />
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#FEBC2E" }} />
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#28C840" }} />
      <span style={{ fontFamily: F.s, fontSize: 28, color: C.ink, marginLeft: 22 }}>ChatGPT</span>
      <span style={{ marginLeft: "auto" }}><Mono s={18}>NEUER CHAT</Mono></span>
    </div>
    <div style={{ position: "relative", padding: "26px 30px", height: 370 }}>
      {history ? HIST.map((q, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, ...inS(t, from + 0.15 + i * 0.25, 10) }}>
          <div style={{ background: C.bubble, borderRadius: 26, padding: "14px 24px", fontFamily: F.m, fontSize: 30, color: "#9A9A96" }}>{q}</div>
        </div>
      )) : null}
      {children}
    </div>
    <div style={{ position: "absolute", left: 24, right: 24, bottom: 22, height: 72, borderRadius: 36, background: C.bubble, display: "flex", alignItems: "center", padding: "0 14px 0 30px" }}>
      <span style={{ fontFamily: F.r, fontSize: 28, color: C.ink, flex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>{input}</span>
      <span style={{ width: 50, height: 50, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontFamily: F.b, fontSize: 28 }}>↑</span>
    </div>
  </Card>
);
const SceneChat: React.FC<{ t: number }> = ({ t }) => {
  const asked = Math.round(14 * k(t, 4.42, 0.9, Easing.out(Easing.quad)));
  const sent = 6.3;
  const typing = t < sent ? typed(Q, t, 5.1, 6.2) : "";
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 96, display: "flex", gap: 16, alignItems: "center" }}>
        <div style={inS(t, 4.32, 10)}><Chip text="Kumpel" size={28} /></div>
        <div style={inS(t, 4.42, 10)}><Badge label="HEUTE GEFRAGT" value={`${asked}×`} color={C.green} size={26} /></div>
      </div>
      <ChatWindow t={t} from={4.32} history input={t < sent ? (typing ? <>{typing}<Caret t={t} h={30} /></> : <span style={{ color: C.dim }}>Frag alles</span>) : <span style={{ color: C.dim }}>Frag alles</span>}>
        {t >= sent ? (
          <div style={{ display: "flex", justifyContent: "flex-end", ...inS(t, sent, 14) }}>
            <div style={{ background: C.bubble, borderRadius: 26, padding: "18px 26px", fontFamily: F.m, fontSize: 34, color: C.ink, maxWidth: 700 }}>{Q}</div>
          </div>
        ) : null}
        {t >= sent + 0.25 ? (
          <div style={{ display: "flex", gap: 10, marginTop: 34, ...inS(t, sent + 0.25, 8) }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: C.ink, opacity: 0.25 + 0.75 * Math.abs(Math.sin((t - i * 0.15) * 5)) }} />
            ))}
          </div>
        ) : null}
      </ChatWindow>
    </>
  );
};

// ---------- Szene C (6.84 - 8.28): Antwort kommt, "fork" -> die Gabel, Niveau A1 ----------
const SceneGabel: React.FC<{ t: number }> = ({ t }) => {
  const ans = "Du meinst wahrscheinlich „fork“. Auf Deutsch:";
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 96, display: "flex", gap: 16 }}>
        <Chip text="Kumpel" size={28} />
      </div>
      <ChatWindow t={t} from={-1} input={<span style={{ color: C.dim }}>Frag alles</span>}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: C.bubble, borderRadius: 26, padding: "18px 26px", fontFamily: F.m, fontSize: 34, color: C.ink, maxWidth: 700 }}>{Q}</div>
        </div>
        <div style={{ fontFamily: F.r, fontSize: 34, color: C.ink, marginTop: 30, lineHeight: 1.3 }}>{typed(ans, t, 6.9, 7.55)}{t < 7.6 ? <Caret t={t} /> : null}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 22, ...inS(t, 7.66, 12) }}>
          <div style={{ fontFamily: F.b, fontSize: 64, color: C.ink, letterSpacing: -1, background: C.greenSoft, borderRadius: 14, padding: "4px 20px" }}>die Gabel</div>
          <Mono s={20} c={C.green} w={800}>SUBSTANTIV</Mono>
        </div>
      </ChatWindow>
      <div style={{ position: "absolute", right: 76, top: 92, ...inS(t, 7.95, 12) }}>
        <Badge label="NIVEAU" value="A1" color={C.red} size={26} />
      </div>
    </>
  );
};

// ---------- Szene D (8.28 - 9.5): Urlaub, er bestellt fuer alle ----------
const SceneBestellung: React.FC<{ t: number }> = ({ t }) => {
  const line = "4× Aperol Spritz, please";
  return (
    <>
      <div style={{ position: "absolute", left: 76, top: 96, display: "flex", gap: 16 }}>
        <div style={inS(t, 8.3, 10)}><Chip text="Urlaub" dot="#F5A524" size={28} /></div>
        <div style={inS(t, 8.5, 10)}><Chip text="Tisch 4" dot={C.green} size={28} /></div>
      </div>
      <Card style={{ left: 76, top: 220, width: 928, padding: "28px 36px", ...inS(t, 8.28, 24) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: F.s, fontSize: 32, color: C.ink }}>Bestellung</span>
          <Mono s={20}>BESTELLT FÜR ALLE</Mono>
        </div>
        <div style={{ borderTop: `2px solid ${C.line}`, margin: "18px 0 18px" }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 42, color: C.ink, minHeight: 60 }}>{typed(line, t, 9.0, 9.45)}{t > 8.9 ? <Caret t={t} h={40} /> : null}</div>
      </Card>
      <Card style={{ left: 76, top: 470, width: 560, padding: "22px 30px", ...inS(t, 8.6, 18) }}>
        <Mono s={18}>KELLNER</Mono>
        <div style={{ fontFamily: F.s, fontSize: 36, color: C.ink, marginTop: 6 }}>„Prego, ditemi.“</div>
        <div style={{ marginTop: 10 }}><Mono s={18} c={C.green} w={800}>SPRICHT ITALIENISCH</Mono></div>
      </Card>
      <div style={{ position: "absolute", left: 670, top: 520, ...inS(t, 9.43, 12) }}>
        <Badge label="SPRACHE" value="ENGLISCH" color={C.red} size={28} />
      </div>
    </>
  );
};

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: 4.32, origin: "50% 50%", El: SceneReise },
  { from: 4.32, to: 6.84, origin: "50% 60%", El: SceneChat },
  { from: 6.84, to: 8.28, origin: "50% 60%", El: SceneGabel },
  { from: 8.28, to: 99, origin: "50% 45%", El: SceneBestellung },
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
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const SeamCaption: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
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
      <div style={{ transform: "translateY(-50%)", opacity: k(t, c.start - 0.04, 0.08), background: C.green, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: fs, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(10,80,60,0.28)" }}>
        <div style={{ position: "relative", display: "flex", gap: gapW }}>
          <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10 }} />
          {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block" }}>{w.w}</span>)}
        </div>
      </div>
    </div>
  );
};

// ---------- Layout-Test (Henri 13.10.): Wechsel Split <-> Vollbild, Zooms auf den Avatar rein und raus ----------
const FULL_A = 6.84, FULL_B = 8.28; // "Bei Woertern wie Gabel." im Vollbild
const smooth = Easing.bezier(0.65, 0, 0.35, 1);
/** 0 = Split, 1 = Vollbild-Avatar */
const fullAmt = (t: number) => Math.min(
  interpolate(t, [FULL_A - 0.3, FULL_A + 0.05], [0, 1], { ...clamp, easing: smooth }),
  interpolate(t, [FULL_B - 0.15, FULL_B + 0.2], [1, 0], { ...clamp, easing: smooth }),
);
/** Avatar-Zoom: langsame Fahrt, Punch-in auf Pointenwoertern, weich wieder raus. */
const avatarZoom = (t: number) => {
  const drift = 0.05 * interpolate(t, [0, 3.8], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const punch1 = 0.16 * Math.min(k(t, 3.87, 0.3), 1 - k(t, 4.32, 0.45, smooth)); // "verlernt."
  const back1 = t >= 4.32 ? -drift * k(t, 4.32, 0.45, smooth) : 0;
  const punch2 = 0.24 * Math.min(k(t, 7.62, 0.35), 1 - k(t, FULL_B - 0.15, 0.4, smooth)); // "Gabel."
  const drift2 = 0.05 * interpolate(t, [FULL_B + 0.2, 9.5], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return 1 + drift + back1 + punch1 + punch2 + drift2;
};

export const GptOpusAustralien: React.FC = () => {
  useFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const cam = 1 + 0.03 * interpolate(t, [scene.from, Math.min(scene.to, 9.5)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const dx = Math.sin(t * 0.6) * 5, dy = Math.cos(t * 0.45) * 4;
  const f = fullAmt(t);
  const seam = PH * (1 - f);
  // Split: Video 280 px nach unten (Schultern + Mikro-Hand). Vollbild: Video bei 0, Gesicht mittig.
  const vTop = 280 * (1 - f);
  const z = avatarZoom(t);
  const FACE_Y = 900; // Gesichtsmitte im Quellvideo (Zoom-Ursprung)
  const capTop = PH + (1500 - PH) * f; // Vollbild: Brusthoehe
  const El = scene.El;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: vTop, width: W, height: H, transform: `scale(${z})`, transformOrigin: `50% ${FACE_Y}px` }}>
        <OffthreadVideo src={staticFile("avatar.mp4")} style={{ width: "100%", height: "100%" }} />
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
      {/* Vollbild-Moment: kleine Karte ueber dem Kopf, nie ueber dem Gesicht */}
      {f > 0.01 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: f * k(t, 7.66, 0.3), transform: `translateY(${(1 - k(t, 7.66, 0.35)) * 14}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,0.96)", borderRadius: 20, padding: "16px 26px", boxShadow: shadow }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.14em", color: C.dim }}>FORK =</span>
            <span style={{ fontFamily: F.b, fontSize: 48, color: C.ink, letterSpacing: -0.8 }}>die Gabel</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 22, letterSpacing: "0.14em", color: "#FFF", background: C.red, borderRadius: 8, padding: "6px 10px 6px 12px" }}>A1</span>
          </div>
        </div>
      ) : null}
      <SeamCaption t={t} top={capTop} />
    </AbsoluteFill>
  );
};
