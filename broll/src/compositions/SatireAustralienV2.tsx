import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { useSec, Word } from "../components/SatireKit";

// GPT-S @florentgpt "Wie heißt das auf Deutsch" (Australien) v2, 2026-10-12 (Henri: "B-Rolls wie Stock, Schrift mega hässlich").
// GPT-Satire Look v2 (pending Henri): typography IS the visual. Anton (punch words, numbers, stamps) + DM Serif Display
// (elegant contrast, quotes, titles) + JetBrains Mono (tiny UI details only). Fonts bundled locally in public/fonts/gpts.
// Palette: cream canvas with a faint grid, ink black, one accent (electric blue). Own UI recreations (order slip,
// phone translation screen, voice memo), stamps that slam, slot counter, per-letter/per-word masked reveals.
// Max one photo cut-out (the waiter). Punchline calm, no panel, one punch-in.
export type Framing = { ax: number; ay: number; s: number; tx: number; ty: number };
export type SatireAustralienV2Props = { src: string; seconds: number; words: Word[]; c: Record<string, number>; fr: Framing; capY: number };

const CREAM = "#F3EDE2";
const INK = "#121212";
const BLUE = "#2340FF";
const MUTE = "#8C8577";
const RULE = "#D8CFBF";
const ANTON = "GPTS Anton";
const SERIF = "GPTS Serif";
const MONO = "GPTS Mono";

const FONT_FILES: [string, string, string, string][] = [
  [ANTON, "Anton-Regular.ttf", "normal", "400"],
  [SERIF, "DMSerifDisplay-Regular.ttf", "normal", "400"],
  [SERIF, "DMSerifDisplay-Italic.ttf", "italic", "400"],
  [MONO, "JetBrainsMono-VF.ttf", "normal", "100 900"],
];
const useLocalFonts = () => {
  const [h] = useState(() => delayRender("gpts fonts"));
  useEffect(() => {
    Promise.all(
      FONT_FILES.map(([fam, file, style, weight]) =>
        new FontFace(fam, `url(${staticFile(`fonts/gpts/${file}`)})`, { style, weight }).load().then((f) => (document.fonts as unknown as { add: (x: FontFace) => void }).add(f)),
      ),
    ).then(() => continueRender(h)).catch((e) => { console.error(e); continueRender(h); });
  }, [h]);
};

const IMG = (f: string) => staticFile(`gpts-australien/img/${f}`);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const PH = 800;
const IN = 0.24;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }));

// spring from second `at`
const useSp = () => {
  const { frame, fps } = useSec();
  return (at: number, damping = 14, stiffness = 180, mass = 0.6) => (frame < at * fps ? 0 : spring({ frame: frame - at * fps, fps, config: { damping, stiffness, mass } }));
};
const bump = (t: number, at: number, d: number) => (t < at || t > at + d ? 0 : Math.sin(((t - at) / d) * Math.PI));

// ---------- kinetic type primitives ----------

// Per-letter masked reveal (each glyph rises out of its own mask with a spring + tiny rotation).
const Letters: React.FC<{ text: string; at: number; stagger?: number; font?: string; size: number; color?: string; italic?: boolean; spacing?: number; still?: boolean }> = ({ text, at, stagger = 0.035, font = ANTON, size, color = INK, italic, spacing = 0, still }) => {
  const sp = useSp();
  return (
    <div style={{ display: "flex", fontFamily: font, fontStyle: italic ? "italic" : "normal", fontSize: size, lineHeight: 1.0, color, letterSpacing: spacing, whiteSpace: "pre" }}>
      {text.split("").map((ch, i) => {
        const p = still ? 1 : sp(at + i * stagger, 13, 210, 0.55);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.06, marginBottom: -size * 0.06 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%) rotate(${(1 - p) * 8}deg)` }}>{ch}</span>
          </span>
        );
      })}
    </div>
  );
};

// Per-word masked reveal (slide up), words can carry their own colour/italic.
type W2 = { w: string; color?: string; italic?: boolean; at?: number };
const Words: React.FC<{ words: W2[]; at: number; stagger?: number; font?: string; size: number; color?: string; justify?: "center" | "flex-start"; maxW?: number; still?: boolean }> = ({ words, at, stagger = 0.08, font = SERIF, size, color = INK, justify = "center", maxW = 980, still }) => {
  const sp = useSp();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: justify, columnGap: size * 0.24, maxWidth: maxW, width: justify === "center" ? maxW : undefined, fontFamily: font, fontSize: size, lineHeight: 1.04, color }}>
      {words.map((x, i) => {
        const p = still ? 1 : sp(x.at ?? at + i * stagger, 15, 170, 0.6);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.08 }}>
            <span style={{ display: "inline-block", fontStyle: x.italic ? "italic" : "normal", color: x.color ?? color, transform: `translateY(${(1 - p) * 110}%)`, opacity: Math.min(1, p * 2) }}>{x.w}</span>
          </span>
        );
      })}
    </div>
  );
};

// Slot-style counter: each digit is a masked reel that spins and locks left to right with an overshoot.
const Slot: React.FC<{ value: number; at: number; dur: number; size: number; color?: string }> = ({ value, at, dur, size, color = BLUE }) => {
  const { t } = useSec();
  const s = String(value);
  const n = s.length;
  const H = size * 1.0;
  return (
    <div style={{ display: "flex", fontFamily: ANTON, fontSize: size, color, lineHeight: 1 }}>
      {s.split("").map((d, i) => {
        const lock = at + dur * (0.5 + (0.5 * i) / Math.max(1, n - 1));
        const tgt = Number(d) + 30; // three full turns
        let pos: number;
        if (t < at) pos = 0;
        else if (t < lock) pos = interpolate(t, [at, lock], [0, tgt], { easing: Easing.out(Easing.cubic) });
        else pos = tgt + 0.18 * Math.sin(Math.min(1, (t - lock) / 0.3) * Math.PI) * Math.exp(-(t - lock) * 5);
        const blur = t > at && t < lock ? Math.min(6, (lock - t) * 14) : 0;
        return (
          <div key={i} style={{ height: H, overflow: "hidden", position: "relative", width: size * 0.5 }}>
            <div style={{ transform: `translateY(${-pos * H}px)`, filter: `blur(${blur * 0.0}px)` }}>
              {Array.from({ length: 41 }).map((_, k) => (
                <div key={k} style={{ height: H, display: "flex", alignItems: "center", justifyContent: "center", filter: `blur(${blur}px)` }}>{k % 10}</div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Rubber stamp that slams in (scale 1.7 -> 1 with overshoot, quick fade-in, slight rotation).
const Stamp: React.FC<{ text: string; at: number; rot?: number; size?: number; color?: string; fill?: boolean }> = ({ text, at, rot = -6, size = 64, color = BLUE, fill }) => {
  const { t } = useSec();
  const sp = useSp();
  if (t < at) return null;
  const p = sp(at, 11, 260, 0.5);
  return (
    <div style={{ transform: `rotate(${rot}deg) scale(${1.7 - 0.7 * p})`, opacity: Math.min(1, p * 3), display: "inline-block", border: `${Math.round(size * 0.09)}px solid ${color}`, borderRadius: size * 0.18, padding: `${size * 0.08}px ${size * 0.28}px ${size * 0.02}px`, fontFamily: ANTON, fontSize: size, lineHeight: 1.1, color: fill ? CREAM : color, background: fill ? color : "transparent", letterSpacing: 1, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
};

// Small round count badge.
const Badge: React.FC<{ text: string; at: number; size?: number }> = ({ text, at, size = 92 }) => {
  const sp = useSp();
  const p = sp(at, 10, 240, 0.5);
  return (
    <div style={{ width: size, height: size, borderRadius: size, background: BLUE, color: CREAM, display: "grid", placeItems: "center", fontFamily: ANTON, fontSize: size * 0.44, transform: `scale(${p})` }}>{text}</div>
  );
};

const Mono: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 24, color = MUTE, style }) => (
  <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: size, letterSpacing: 2, textTransform: "uppercase", color, ...style }}>{children}</div>
);

// Accent line that wipes in.
const Wipe: React.FC<{ at: number; w: number; h?: number; color?: string; dur?: number; style?: React.CSSProperties }> = ({ at, w, h = 10, color = BLUE, dur = 0.3, style }) => {
  const { t } = useSec();
  return <div style={{ width: interpolate(t, [at, at + dur], [0, w], { ...clamp, easing: ease }), height: h, background: color, borderRadius: h, ...style }} />;
};

const Typed: React.FC<{ text: string; start: number; end: number; style?: React.CSSProperties }> = ({ text, start, end, style }) => {
  const { t } = useSec();
  const n = Math.round(interpolate(t, [start, end], [0, text.length], clamp));
  const caret = t < end + 0.4 && Math.floor(t * 4) % 2 === 0;
  return <div style={style}>{text.slice(0, n)}<span style={{ display: "inline-block", width: 4, height: "0.9em", background: BLUE, marginLeft: 4, verticalAlign: "-0.1em", opacity: caret ? 1 : 0 }} /></div>;
};

const GRID: React.CSSProperties = {
  backgroundColor: CREAM,
  backgroundImage: `linear-gradient(rgba(18,18,18,0.055) 2px, transparent 2px), linear-gradient(90deg, rgba(18,18,18,0.055) 2px, transparent 2px)`,
  backgroundSize: "60px 60px",
  backgroundPosition: "-1px -1px",
};

// Flat sticker card for fullscreen moments (cream, ink border, hard offset shadow; no glow).
const Tile: React.FC<{ w: number; children: React.ReactNode; pad?: number; style?: React.CSSProperties }> = ({ w, children, pad = 30, style }) => (
  <div style={{ width: w, padding: pad, boxSizing: "border-box", ...GRID, border: `4px solid ${INK}`, borderRadius: 28, boxShadow: `10px 12px 0 ${INK}`, ...style }}>{children}</div>
);

// Pop-in wrapper for fullscreen stickers (spring scale + slide, fade out).
const Pop: React.FC<{ from: number; to: number; x: number; y: number; rot?: number; children: React.ReactNode }> = ({ from, to, x, y, rot = 0, children }) => {
  const { t } = useSec();
  const sp = useSp();
  if (t < from || t > to + 0.2) return null;
  const p = from <= 0 ? 1 : sp(from, 13, 200, 0.6);
  const o = interpolate(t, [to, to + 0.18], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) translateY(${(1 - p) * 60}px) scale(${0.8 + 0.2 * p}) rotate(${rot * p}deg)`, opacity: Math.min(1, p * 2) * o }}>{children}</div>
  );
};

// Phone translation screen (own UI, not a real app screenshot).
const PhoneScreen: React.FC<{ w: number; h: number; pair: string; src: string; dst: string; start: number; end: number; strike?: number; dstSize?: number }> = ({ w, h, pair, src, dst, start, end, strike, dstSize = 46 }) => {
  const { t } = useSec();
  return (
    <div style={{ width: w, height: h, background: INK, borderRadius: 60, padding: 14, boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%", background: CREAM, borderRadius: 48, padding: "40px 30px", boxSizing: "border-box", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: BLUE }} />
          <Mono size={22} color={INK}>ChatGPT</Mono>
          <Mono size={20} style={{ marginLeft: "auto", border: `2px solid ${RULE}`, borderRadius: 20, padding: "2px 12px" }}>{pair}</Mono>
        </div>
        <div style={{ position: "relative", marginTop: 34, display: "inline-block" }}>
          <div style={{ fontFamily: MONO, fontSize: 24, color: MUTE, lineHeight: 1.35 }}>{src}</div>
          {strike !== undefined && <div style={{ position: "absolute", left: -4, top: "48%", height: 5, borderRadius: 3, background: BLUE, width: `${interpolate(t, [strike, strike + 0.3], [0, 104], clamp)}%` }} />}
        </div>
        <div style={{ height: 2, background: RULE, margin: "24px 0" }} />
        <Typed text={dst} start={start} end={end} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: dstSize, color: INK, lineHeight: 1.12 }} />
      </div>
    </div>
  );
};

const Panel: React.FC<{ w: Win; children: React.ReactNode }> = ({ w, children }) => {
  const { t } = useSec();
  const s = envelope(t, w);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `translateY(${-(1 - s) * PH}px)`, ...GRID, overflow: "hidden" }}>
      {children}
    </div>
  );
};

const Captions: React.FC<{ words: Word[]; split: number; capY: number }> = ({ words, split, capY }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  const inPanel = split > 0.5;
  const size = 66;
  // split: centred exactly on the seam (y = PH); fullscreen: chest/shoulder height (capY).
  const top = inPanel ? PH - size * 0.58 : capY;
  return (
    <div style={{
      position: "absolute", top, width: 1080, textAlign: "center", fontFamily: ANTON, fontSize: size, lineHeight: 1.1, letterSpacing: 0.5,
      color: inPanel ? INK : "#fff", WebkitTextStroke: inPanel ? `12px ${CREAM}` : undefined, paintOrder: "stroke fill",
      textShadow: inPanel ? "none" : "0 2px 4px rgba(0,0,0,0.5), 0 0 16px rgba(0,0,0,0.3)",
      opacity: split > 0.05 && split < 0.95 ? 0 : 1,
    }}>{cur.text}</div>
  );
};

export const SatireAustralienV2: React.FC<SatireAustralienV2Props> = ({ src, seconds, words, c, fr, capY }) => {
  useLocalFonts();
  const { t } = useSec();
  const sp = useSp();
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.hatte - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;

  const P1: Win = { from: c.seitdem - 0.1, to: c.verlernt + 0.45 };
  const P2: Win = { from: c.Gabel - 0.35, to: c.Gabel + 1.95 };
  const P3: Win = { from: c.Handy - 0.12, to: c.Handy + 2.88 };
  const P4: Win = { from: c.diktiert - 0.5, to: c.Englisch2 + 0.55 };
  const split = Math.max(...[P1, P2, P3, P4].map((w) => envelope(t, w)));
  const z = drift * punch;
  const loud = t >= c.lauter ? 1 : 0;
  const shake = bump(t, c.lauter, 0.35) * Math.sin(t * 90) * 6;

  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * fr.ax * (1 - z) + split * fr.tx}px, ${(1 - split) * fr.ay * (1 - z) + split * fr.ty}px) scale(${(1 - split) * z + split * fr.s})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* ---------- Hook = thumbnail, fully visible on frame 0 ---------- */}
      <Pop from={0} to={P1.from + 0.1} x={540} y={330}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Letters text="EIN JAHR" at={0} size={150} still />
          <Letters text="AUSTRALIEN." at={0} size={150} color={BLUE} still />
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 76, color: INK, marginTop: 10, whiteSpace: "nowrap", textShadow: "0 0 30px rgba(243,237,226,0.8)" }}>Und dann kam das Handy.</div>
        </div>
      </Pop>

      {/* Wie heißt das nochmal auf Deutsch? */}
      <Pop from={P1.to - 0.05} to={P2.from + 0.1} x={540} y={330}>
        <div style={{ width: 1000, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Mono size={26} color={INK} style={{ opacity: 0.7 }}>er sagt bis heute</Mono>
          <div style={{ height: 14 }} />
          <Words at={c.wie - 0.05} stagger={0.1} size={104} words={[{ w: "„Wie" }, { w: "heißt" }, { w: "das" }, { w: "nochmal" }, { w: "auf" }, { w: "Deutsch?“", italic: true, color: BLUE, at: c.Deutsch2 ?? c.wie + 1.0 }]} />
        </div>
      </Pop>

      {/* Im Urlaub bestellt er für alle: order slip */}
      <Pop from={P2.to - 0.05} to={c.Dafuer - 0.08} x={540} y={380} rot={-2}>
        <div style={{ position: "relative" }}>
          <Tile w={760} pad={34}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><Mono size={22} color={INK}>Tisch 4 · Bestellung</Mono><Mono size={22}>21:14</Mono></div>
            <div style={{ height: 3, background: INK, margin: "16px 0 20px" }} />
            <Words at={c.bestellt - 0.05} stagger={0.07} size={66} justify="flex-start" maxW={700} words={[{ w: "Four" }, { w: "Spritz," }, { w: "please." }, { w: "For", italic: true, color: BLUE }, { w: "everyone.", italic: true, color: BLUE }]} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}><Mono size={20}>bestellt von: dein Kumpel</Mono><Mono size={20}>1 Jahr Sydney</Mono></div>
          </Tile>
          <div style={{ position: "absolute", right: -30, top: -40 }}><Badge text="×4" at={c.bestellt + 0.3} /></div>
          <div style={{ position: "absolute", left: 210, top: 250 }}><Stamp text="SELBSTVERSTÄNDLICH AUF ENGLISCH" at={c.selbstverstaendlich - 0.05} size={46} rot={-5} fill /></div>
        </div>
      </Pop>

      {/* Dafür war er ein Jahr weg */}
      <Pop from={c.Dafuer - 0.08} to={c.Apulien - 0.1} x={540} y={300}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Words at={c.Dafuer} stagger={0.08} size={112} words={[{ w: "Dafür" }, { w: "war" }, { w: "er" }]} />
          <Words at={c.Jahr2 - 0.15} stagger={0.08} size={112} words={[{ w: "ein", italic: true }, { w: "Jahr", italic: true, color: BLUE }, { w: "weg.", italic: true }]} />
        </div>
      </Pop>

      {/* Apulien */}
      <Pop from={c.Apulien - 0.1} to={P3.from + 0.1} x={540} y={320}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: INK }}>diesmal in</div>
          <Letters text="APULIEN" at={c.Apulien - 0.05} stagger={0.045} size={190} color={BLUE} spacing={4} />
          <Mono size={24} color={INK} style={{ opacity: 0.75, marginTop: 6 }}>40.99° N · 17.22° E · Polignano</Mono>
        </div>
      </Pop>

      {/* Das Handy übersetzt es trotzdem */}
      <Pop from={P4.to - 0.05} to={c.sagt2 - 0.08} x={540} y={400} rot={-3}>
        <div style={{ position: "relative" }}>
          <Tile w={800} pad={34}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><Mono size={22} color={INK}>ChatGPT · Übersetzung</Mono><Mono size={22}>EN → IT</Mono></div>
            <div style={{ position: "relative", display: "inline-block", marginTop: 20 }}>
              <div style={{ fontFamily: ANTON, fontSize: 64, color: MUTE }}>FOUR SPRITZ. PLEASE.</div>
              <div style={{ position: "absolute", left: -6, top: "46%", height: 8, borderRadius: 4, background: BLUE, width: `${interpolate(t, [c.Handy2 + 0.2, c.Handy2 + 0.5], [0, 104], clamp)}%` }} />
            </div>
            <Typed text="Quattro Spritz, per favore." start={c.Handy2 + 0.5} end={c.Handy2 + 1.2} style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 70, color: INK, marginTop: 8 }} />
          </Tile>
          <div style={{ position: "absolute", right: -20, top: -46 }}><Stamp text="TROTZDEM" at={c.trotzdem} size={60} rot={7} /></div>
        </div>
      </Pop>

      {/* Er sagt dem Kellner: das hätte ich auch gekonnt. Der Kellner kann kein Englisch. */}
      <Pop from={c.sagt2 - 0.08} to={punchAt} x={540} y={420}>
        <div style={{ position: "relative", width: 1000, height: 600 }}>
          <div style={{ position: "absolute", right: 40, top: 0, filter: "drop-shadow(8px 10px 0 rgba(18,18,18,0.9))" }}>
            <Img src={IMG("waiter.png")} style={{ width: 240, display: "block" }} />
          </div>
          <div style={{ position: "absolute", right: 30, top: 470 }}><Mono size={22} color={INK} style={{ background: CREAM, border: `3px solid ${INK}`, borderRadius: 12, padding: "4px 12px" }}>der Kellner</Mono></div>
          <div style={{ position: "absolute", left: 10, top: 60, width: 660 }}>
            <Words at={c.das2 ?? c.gekonnt - 0.6} stagger={0.08} size={84} justify="flex-start" maxW={660} words={[{ w: "„Das" }, { w: "hätte" }, { w: "ich" }, { w: "auch" }, { w: "gekonnt.“", italic: true, color: BLUE }]} />
          </div>
          <div style={{ position: "absolute", left: 60, top: 380 }}><Stamp text="KANN KEIN ENGLISCH" at={c.kein - 0.05} size={64} rot={-7} /></div>
        </div>
      </Pop>

      {/* Pointe: calm, uncovered, no panel */}
      <Pop from={c.schlechtem - 0.1} to={seconds + 1} x={540} y={300}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Words at={c.schlechtem - 0.1} stagger={0.09} size={116} words={[{ w: "Nur" }, { w: "Freunde" }]} />
          <Words at={c.schlechtem + 0.1} stagger={0.09} size={116} words={[{ w: "mit", italic: true }, { w: "schlechtem.", italic: true, color: BLUE }]} />
        </div>
      </Pop>

      {/* ---------- dopamine panels: typography is the visual ---------- */}
      <Panel w={P1}>
        <div style={{ position: "absolute", left: 80, top: 70, display: "flex", alignItems: "center", gap: 16 }}>
          <Mono size={24} color={INK}>Aufenthalt · Sydney, NSW</Mono>
        </div>
        <div style={{ position: "absolute", left: 60, top: 120, transform: `scale(${1 + 0.06 * bump(t, P1.from + 1.25, 0.4)})`, transformOrigin: "left center" }}>
          <Slot value={365} at={P1.from + 0.15} dur={1.0} size={380} />
        </div>
        <div style={{ position: "absolute", left: 640, top: 160 }}>
          <Letters text="TAGE" at={P1.from + 0.35} size={190} />
          <div style={{ marginTop: 6 }}><Words at={P1.from + 0.7} size={74} justify="flex-start" words={[{ w: "in", italic: true }, { w: "Australien.", italic: true }]} /></div>
        </div>
        <Wipe at={P1.from + 0.9} w={920} h={6} color={INK} style={{ position: "absolute", left: 80, top: 545 }} />
        <div style={{ position: "absolute", left: 300, top: 590 }}><Stamp text="DEUTSCH VERLERNT" at={c.verlernt - 0.05} size={86} rot={-5} fill /></div>
      </Panel>

      <Panel w={P2}>
        <div style={{ position: "absolute", left: 80, top: 70, display: "flex", width: 920, justifyContent: "space-between" }}>
          <Mono size={24} color={INK}>Wort gesucht</Mono><Mono size={24}>Suche läuft …</Mono>
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 140, display: "flex", justifyContent: "center" }}>
          <Letters text="GABEL." at={c.Gabel - 0.12} stagger={0.05} size={330} spacing={6} />
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 500, display: "flex", justifyContent: "center" }}><Wipe at={c.Gabel + 0.25} w={640} h={10} /></div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 540 }}>
          <Words at={c.Gabel + 0.35} size={58} words={[{ w: "die." }, { w: "Substantiv,", italic: true }, { w: "feminin.", italic: true }]} />
        </div>
        <div style={{ position: "absolute", right: 70, top: 640 }}><Stamp text="SEIT DER 1. KLASSE BEKANNT" at={c.Gabel + 0.95} size={40} rot={4} /></div>
      </Panel>

      <Panel w={P3}>
        {(() => {
          const s = sp(P3.from + 0.15, 15, 150, 0.7);
          return (
            <div style={{ position: "absolute", left: 70, top: 70, transform: `translateY(${(1 - s) * 500}px) rotate(${-5 + 2 * s}deg)` }}>
              <PhoneScreen w={420} h={700} pair="DE → IT" src="Für alle bitte vier Spritz und die Burrata." dst="Per tutti quattro Spritz e la burrata, per favore." start={c.ChatGPT + 0.1} end={c.ChatGPT + 1.3} dstSize={44} />
            </div>
          );
        })()}
        <div style={{ position: "absolute", left: 560, top: 110 }}>
          <Mono size={22} color={INK} style={{ opacity: fadeIn(t, P3.from + 0.3) }}>die Freundin hält hin</Mono>
          <div style={{ height: 16 }} />
          <Letters text="CHATGPT" at={c.ChatGPT - 0.05} size={130} stagger={0.03} />
          <Letters text="ÜBERSETZT" at={c.ChatGPT + 0.2} size={130} stagger={0.03} color={BLUE} />
          <Letters text="ALLES." at={c.alles ?? c.ChatGPT + 0.9} size={130} stagger={0.04} />
        </div>
        <div style={{ position: "absolute", left: 580, top: 640 }}><Stamp text="AUF ITALIENISCH" at={c.Italienisch - 0.05} size={58} rot={-4} fill /></div>
      </Panel>

      <Panel w={P4}>
        <div style={{ position: "absolute", left: 80, top: 60, width: 920, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: BLUE, opacity: Math.floor(t * 3) % 2 ? 1 : 0.35 }} />
          <Mono size={24} color={INK}>Sprachaufnahme · er diktiert</Mono>
          <Mono size={24} style={{ marginLeft: "auto" }}>{`0:0${Math.min(9, Math.max(0, Math.floor(t - P4.from)))}`}</Mono>
        </div>
        <div style={{ position: "absolute", left: 80, top: 110, display: "flex", gap: 7, alignItems: "center", height: 90 }}>
          {Array.from({ length: 46 }).map((_, i) => {
            const h = Math.min(88, (10 + 26 * Math.abs(Math.sin(i * 1.3 + t * 11))) * (loud ? 1.9 : 1));
            return <div key={i} style={{ width: 13, height: h, borderRadius: 7, background: loud ? BLUE : INK }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 1080, top: 235, display: "flex", flexDirection: "column", alignItems: "center", transform: `translateX(${shake}px) scale(${1 + 0.16 * loud * sp(c.lauter, 10, 260, 0.5)})` }}>
          <div style={{ display: "flex", gap: 30 }}>
            <Letters text="FOUR" at={c.Bestellung - 0.1} size={176} stagger={0.03} />
            <Letters text="SPRITZ," at={c.Bestellung + 0.12} size={176} stagger={0.03} color={BLUE} />
          </div>
          <Letters text="PLEASE." at={c.Bestellung + 0.35} size={176} stagger={0.03} />
        </div>
        <div style={{ position: "absolute", right: 90, top: 660 }}><Stamp text="LAUTER" at={c.lauter} size={52} rot={6} /></div>
        <div style={{ position: "absolute", left: 80, top: 660 }}><Stamp text="UND AUF ENGLISCH" at={c.Englisch2 - 0.1} size={52} rot={-4} fill /></div>
      </Panel>

      <Captions words={words} split={split} capY={capY} />
    </AbsoluteFill>
  );
};

const fadeIn = (t: number, at: number) => interpolate(t, [at, at + 0.2], [0, 1], clamp);
