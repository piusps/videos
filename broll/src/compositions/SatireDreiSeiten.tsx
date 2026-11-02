import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Card, SerifTitle, Sticker, useSec, Word, serif, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// GPT-S @florentgpt "Drei Seiten" (Zettel im Treppenhaus), 2026-10-12.
// Base = SatireBarnum (v3 split framing). Light dopamine: 4 flat white panels (Zettel -> 12 Stichpunkte -> Ordner -> Kinderwagen),
// real CC0 photos (stairwell, ring binder, pram cutout), Instrument Serif + Inter only, no emoji / clipart / glow.
// Captions (Henri 2026-10-12): fullscreen at chest/shoulder height (capY), in split exactly on the panel/avatar seam.
// Punchline "Alle lesen." calm, no panel, one punch-in.
export type Framing = { ax: number; ay: number; s: number; tx: number; ty: number };
export type SatireDreiSeitenProps = { src: string; seconds: number; words: Word[]; c: Record<string, number>; fr: Framing; capY: number };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#10A37F";
const GREY = "#8A8A8A";
const LINE = "#E6E6E2";
const PAPER = "#FBFAF6";
const IMG = (f: string) => staticFile(`gpts-drei-seiten/img/${f}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], clamp);
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const PH = 800;
const IN = 0.24;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }));

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], clamp);
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};
const CIRCLE = "M 20 60 C 10 15, 120 0, 200 8 C 290 16, 320 60, 300 95 C 275 135, 90 140, 35 110 C 5 92, 15 55, 60 35";

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = GREY, size = 34, style }) => (
  <div style={{ fontFamily: fonts.semibold, fontSize: size, color, ...style }}>{children}</div>
);

const Panel: React.FC<{ w: Win; children: React.ReactNode; bg?: string }> = ({ w, children, bg = "#FFFFFF" }) => {
  const { t } = useSec();
  const s = envelope(t, w);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `translateY(${-(1 - s) * PH}px)`, background: bg, boxShadow: "0 6px 0 rgba(0,0,0,0.04)", overflow: "hidden" }}>
      {children}
    </div>
  );
};

const GptHead: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: size, color: INK }}>
    <div style={{ width: size * 1.2, height: size * 1.2, borderRadius: size, background: GREEN }} />
    ChatGPT
  </div>
);

const Typing: React.FC<{ text: string; start: number; end: number; size?: number; w: number; font?: string }> = ({ text, start, end, size = 40, w, font = fonts.medium }) => {
  const { t } = useSec();
  const n = Math.round(interpolate(t, [start, end], [0, text.length], clamp));
  return <div style={{ width: w, fontFamily: font, fontSize: size, lineHeight: 1.3, color: INK }}>{text.slice(0, n)}</div>;
};

// A sheet of paper with a pin (flat, no clipart).
const Sheet: React.FC<{ w: number; h?: number; children?: React.ReactNode; rot?: number; pin?: boolean; style?: React.CSSProperties }> = ({ w, h, children, rot = 0, pin, style }) => (
  <div style={{ position: "relative", width: w, height: h, background: PAPER, borderRadius: 6, padding: "34px 36px", boxSizing: "border-box", transform: `rotate(${rot}deg)`, boxShadow: "0 14px 30px rgba(0,0,0,0.22)", ...style }}>
    {pin && <div style={{ position: "absolute", top: 12, left: "50%", width: 22, height: 22, marginLeft: -11, borderRadius: 11, background: RED, boxShadow: "0 3px 4px rgba(0,0,0,0.3)" }} />}
    {children}
  </div>
);

const Lines: React.FC<{ n: number; w: number; gap?: number }> = ({ n, w, gap = 22 }) => (
  <div>{Array.from({ length: n }).map((_, i) => <div key={i} style={{ height: 8, width: i % 4 === 3 ? w * 0.6 : w, background: "#D9D7D0", borderRadius: 4, marginBottom: gap }} />)}</div>
);

const BULLETS = [
  "Gemeinsame Verantwortung", "Fluchtwege im Brandfall", "Rücksicht auf Allergiker", "Barrierefreiheit im Flur",
  "Hausordnung § 4 Abs. 2", "Wertschätzender Umgang", "Ästhetik des Eingangs", "Reinigungsplan Erdgeschoss",
  "Lärmschutz ab 22 Uhr", "Gemeinsame Lösungsfindung", "Feedback-Kultur im Haus", "Nächste Schritte",
];

const Captions: React.FC<{ words: Word[]; split: number; capY: number }> = ({ words, split, capY }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  const inPanel = split > 0.5;
  // split: centred exactly on the seam (y = PH); ink text with a white halo reads on white panel and on video.
  const fs = 54;
  return (
    <div style={{ position: "absolute", top: inPanel ? PH - fs * 0.62 : capY - fs * 0.62, width: 1080, textAlign: "center", fontFamily: fonts.bold, fontSize: fs, lineHeight: 1.2, color: inPanel ? INK : "#fff", letterSpacing: -0.5, textShadow: inPanel ? "0 0 3px #fff, 0 0 6px #fff, 0 0 10px #fff, 0 0 16px rgba(255,255,255,0.9)" : "0 2px 4px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)", opacity: split > 0.05 && split < 0.95 ? 0 : 1 }}>
      {cur.text}
    </div>
  );
};

export const SatireDreiSeiten: React.FC<SatireDreiSeitenProps> = ({ src, seconds, words, c, fr, capY }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.Alle - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;

  const P1: Win = { from: c.Seine - 0.12, to: c.Seine + 2.4 };
  const P2: Win = { from: c.Darunter - 0.12, to: Math.max(c.Darunter + 2.3, c.zwölf + 1.6) };
  const P3: Win = { from: c.Im - 0.12, to: c.Der2 + 0.15 };
  const P4: Win = { from: c.Der2 - 0.12, to: Math.min(c.Der2 + 2.4, c.Zum - 0.05) };
  // P3 -> P4 back to back: one continuous split, P4 slides in over P3 (speaker framing stays put).
  const split = Math.max(...[P1, P2, { from: P3.from, to: P4.to }].map((w) => envelope(t, w)));
  const z = drift * punch;

  const pop = (at: number) => spring({ frame: frame - at * fps, fps, config: { damping: 15, stiffness: 180, mass: 0.6 } });

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * fr.ax * (1 - z) + split * fr.tx}px, ${(1 - split) * fr.ay * (1 - z) + split * fr.ty}px) scale(${(1 - split) * z + split * fr.s})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail (frame 0) */}
      <SerifTitle from={0} to={P1.from} x={0} y={120} align="center" size={100} ink lines={[{ text: "Der Zettel im Treppenhaus" }, { text: "hat jetzt Stichpunkte.", italic: true }]} />
      <Sticker from={0} to={P1.from} x={830} y={560} rotate={4}>
        <Sheet w={300} pin>
          <div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK, marginTop: 10 }}>An alle!</div>
          <div style={{ marginTop: 16 }}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}><div style={{ width: 10, height: 10, borderRadius: 5, background: INK }} /><div style={{ height: 8, width: 180, background: "#D9D7D0", borderRadius: 4 }} /></div>)}
          </div>
        </Sheet>
      </Sticker>

      {/* Herr Krüger + Kinderwagen */}
      <Sticker from={P1.to - 0.05} to={c.Früher - 0.08} x={540} y={360} rotate={-1}>
        <div style={{ position: "relative", width: 900, height: 480 }}>
          <div style={{ position: "absolute", left: 40, top: 40 }}>
            <Card w={420} pad={24}>
              <Label size={22} style={{ letterSpacing: 2 }}>3. OG LINKS</Label>
              <div style={{ fontFamily: serif, fontSize: 76, color: INK, lineHeight: 1 }}>Herr Krüger</div>
            </Card>
          </div>
          <div style={{ position: "absolute", left: 520, top: 30, opacity: fade(t, c.Kinderwagen - 0.05), transform: `scale(${0.85 + 0.15 * fade(t, c.Kinderwagen - 0.05)})` }}>
            <div style={{ filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.28))" }}><Img src={IMG("pram.png")} style={{ width: 330, display: "block" }} /></div>
            <div style={{ position: "absolute", left: "50%", bottom: -14, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>im Flur</div>
          </div>
        </div>
      </Sticker>

      {/* Früher: one line */}
      <Sticker from={c.Früher - 0.08} to={c.Jetzt - 0.08} x={540} y={380} rotate={-3}>
        <div style={{ position: "relative" }}>
          <Sheet w={560} pin>
            <Label size={24} style={{ marginTop: 8 }}>Früher</Label>
            <div style={{ fontFamily: fonts.bold, fontSize: 54, color: INK, lineHeight: 1.1, marginTop: 6 }}>Flur ist kein Abstellraum.</div>
          </Sheet>
        </div>
      </Sticker>

      {/* Jetzt: ChatGPT schreibt */}
      <Sticker from={c.Jetzt - 0.08} to={c.Darunter - 0.12} x={540} y={350} rotate={-1}>
        <Card w={860} pad={30}>
          <GptHead size={28} />
          <div style={{ marginTop: 18, minHeight: 200 }}>
            <Typing text="Liebe Nachbarschaft, ein harmonisches Miteinander liegt uns allen am Herzen." start={c.Liebe - 0.1} end={c.Darunter - 0.5} size={44} w={800} />
          </div>
        </Card>
      </Sticker>

      {/* Familie antwortet, auch mit ChatGPT */}
      <Sticker from={P2.to - 0.05} to={c.Herr2 - 0.08} x={540} y={360} rotate={1}>
        <div style={{ position: "relative" }}>
          <Card w={860} pad={30}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK }}>Antwort · Familie, EG</div>
              <div style={{ opacity: fade(t, c.Auch - 0.05) }}><GptHead size={24} /></div>
            </div>
            <div style={{ marginTop: 18, minHeight: 130 }}>
              <Typing text="Mit Dank für die wertschätzende Kommunikation." start={c.Dank - 0.25} end={c.Herr2 - 0.5} size={46} w={800} />
            </div>
          </Card>
          <Draw at={c.Auch + 0.25} w={320} h={140} d={CIRCLE} style={{ left: 600, top: 4, transform: "scale(0.78,0.62)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* Krüger antwortet auf die Antwort: DE / EN / UK */}
      <Sticker from={c.Herr2 - 0.08} to={P3.from} x={540} y={370} rotate={-1}>
        <div style={{ position: "relative", width: 900, height: 560 }}>
          {[
            { at: c.Deutsch, txt: "Liebe Nachbarschaft,", tag: "DE" },
            { at: c.Englisch, txt: "Dear neighbours,", tag: "EN" },
            { at: c.Ukrainisch, txt: "Шановні сусіди,", tag: "UK" },
          ].map((s, i) => {
            const p = pop(s.at - 0.1);
            return (
              <div key={i} style={{ position: "absolute", left: 40 + i * 150, top: 20 + i * 120, opacity: t >= s.at - 0.1 ? 1 : 0, transform: `translateY(${(1 - p) * 60}px) rotate(${[-3, 1, 3][i]}deg)` }}>
                <Sheet w={520} h={250}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: fonts.bold, fontSize: 36, color: INK }}>{s.txt}</div>
                    <Label size={22}>{s.tag}</Label>
                  </div>
                  <div style={{ marginTop: 22 }}><Lines n={4} w={440} gap={18} /></div>
                </Sheet>
              </div>
            );
          })}
          <div style={{ position: "absolute", right: 20, top: 430, fontFamily: serifItalic, fontSize: 70, color: RED, opacity: fade(t, c.Für - 0.05) }}>Für alle.</div>
        </div>
      </Sticker>

      {/* Zum Wegräumen hat keiner mehr Zeit */}
      <SerifTitle from={P4.to - 0.05} to={c.Alle - 0.1} x={0} y={170} align="center" size={100} ink lines={[{ text: "Zum Wegräumen" }, { text: "hat keiner Zeit.", italic: true, at: P4.to + 0.4 }]} />

      {/* Pointe: calm, uncovered, no panel */}
      <SerifTitle from={c.Alle - 0.1} to={seconds + 1} x={0} y={180} align="center" size={124} ink lines={[{ text: "Alle lesen.", italic: true }]} />

      {/* ---------- dopamine panels (light) ---------- */}
      {/* P1: stairwell board, one note becomes three pages */}
      <Panel w={P1}>
        <Img src={IMG("stairs.jpg")} style={{ position: "absolute", left: 0, top: -260, width: 1080, filter: "saturate(0.8)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, background: "rgba(255,255,255,0.18)" }} />
        {[0, 1, 2].map((i) => {
          const at = c.drei - 0.15 + i * 0.22;
          const p = i === 0 ? 1 : pop(at);
          const show = i === 0 || t >= at;
          return (
            <div key={i} style={{ position: "absolute", left: 470 + i * 60, top: 100 + i * 40, opacity: show ? 1 : 0, transform: `translateX(${(1 - p) * 140}px) rotate(${[-4, 1, 5][i] * p}deg)` }}>
              <Sheet w={400} h={520} pin={i === 0}>
                <div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK, marginTop: 10 }}>{i === 0 ? "An alle Bewohner" : ""}</div>
                <div style={{ marginTop: 20 }}><Lines n={i === 0 ? 11 : 13} w={320} gap={20} /></div>
                <div style={{ position: "absolute", right: 22, bottom: 16, fontFamily: fonts.semibold, fontSize: 22, color: GREY }}>Seite {i + 1}/3</div>
              </Sheet>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 60, top: 300, fontFamily: serif, fontSize: 170, color: INK, lineHeight: 1, opacity: fade(t, c.drei), textShadow: "0 0 30px rgba(255,255,255,0.9)" }}>3<span style={{ fontFamily: serifItalic, fontSize: 80 }}> Seiten</span></div>
      </Panel>

      {/* P2: counter to 12 Stichpunkte */}
      <Panel w={P2}>
        {(() => {
          const n = Math.min(12, Math.max(1, Math.ceil(interpolate(t, [c.zwölf - 0.2, c.zwölf + 0.9], [0, 12], clamp))));
          return (
            <>
              <div style={{ position: "absolute", top: 90, left: 90, display: "flex", alignItems: "baseline", gap: 18 }}>
                <div style={{ fontFamily: fonts.bold, fontSize: 190, color: INK, lineHeight: 1, fontVariantNumeric: "tabular-nums", width: 230 }}>{t < c.zwölf - 0.2 ? 1 : n}</div>
                <div style={{ fontFamily: serifItalic, fontSize: 80, color: INK }}>Stichpunkte</div>
              </div>
              <div style={{ position: "absolute", left: 90, top: 330, width: 900, display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 30, rowGap: 14 }}>
                {BULLETS.map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", opacity: i < (t < c.zwölf - 0.2 ? 1 : n) ? 1 : 0, fontFamily: fonts.medium, fontSize: 30, color: INK }}>
                    <div style={{ width: 12, height: 12, borderRadius: 6, background: INK, flex: "none" }} />{b}
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </Panel>

      {/* P3: a binder in the stairwell */}
      <Panel w={P3}>
        <Img src={IMG("binder.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, objectFit: "cover", transform: `scale(${1 + 0.05 * interpolate(t, [P3.from, P3.to], [0, 1], clamp)})` }} />
        <div style={{ position: "absolute", left: 70, top: 70, background: "#fff", borderRadius: 18, padding: "18px 30px", boxShadow: "0 10px 24px rgba(0,0,0,0.15)", opacity: fade(t, c.Ordner - 0.05) }}>
          <Label size={24} style={{ letterSpacing: 2 }}>TREPPENHAUS · ORDNER 1</Label>
          <div style={{ fontFamily: serif, fontSize: 84, color: INK, lineHeight: 1 }}>Korrespondenz <span style={{ fontFamily: serifItalic }}>Flur</span></div>
        </div>
      </Panel>

      {/* P4: the pram, still there (calm) */}
      <Panel w={P4}>
        <Img src={IMG("stairs.jpg")} style={{ position: "absolute", left: 0, top: -260, width: 1080, filter: "saturate(0.8)" }} />
        <div style={{ position: "absolute", left: 340, top: 230, filter: "drop-shadow(0 18px 24px rgba(0,0,0,0.35))" }}><Img src={IMG("pram.png")} style={{ width: 420, display: "block" }} /></div>
        <div style={{ position: "absolute", left: 70, top: 70, background: "#fff", borderRadius: 18, padding: "14px 26px", boxShadow: "0 10px 24px rgba(0,0,0,0.15)", fontFamily: fonts.semibold, fontSize: 34, color: INK, opacity: fade(t, c.Der2 + 0.6) }}>steht immer noch da</div>
      </Panel>

      <Captions words={words} split={split} capY={capY} />
    </AbsoluteFill>
  );
};
