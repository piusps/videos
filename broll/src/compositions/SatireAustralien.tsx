import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, serif, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// GPT-S @florentgpt "Wie heißt das auf Deutsch" (Australien), 2026-10-12, slot 20:00.
// Style = SatireBarnum (v3 split framing): light dopamine (3 flat white panels), real CC0 stock photos,
// Instrument Serif + Inter only, no emoji / clipart / glow. Punchline calm, no panel, one punch-in.
// Subtitle rule (Henri 2026-10-12): fullscreen at chest/shoulder height (capY, measured from the face),
// in split exactly on the seam between panel and speaker.
export type Framing = { ax: number; ay: number; s: number; tx: number; ty: number };
export type SatireAustralienProps = { src: string; seconds: number; words: Word[]; c: Record<string, number>; fr: Framing; capY: number };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#10A37F";
const GREY = "#8A8A8A";
const LINE = "#E6E6E2";
const IMG = (f: string) => staticFile(`gpts-australien/img/${f}`);

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

const Panel: React.FC<{ w: Win; children: React.ReactNode }> = ({ w, children }) => {
  const { t } = useSec();
  const s = envelope(t, w);
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: PH, transform: `translateY(${-(1 - s) * PH}px)`, background: "#FFFFFF", boxShadow: "0 6px 0 rgba(0,0,0,0.04)", overflow: "hidden" }}>
      {children}
    </div>
  );
};

// Photo card with white border and an optional name tag.
const Photo: React.FC<{ img: string; w: number; h: number; name?: string; pos?: string }> = ({ img, w, h, name, pos = "50% 50%" }) => (
  <div style={{ position: "relative", width: w, height: h, background: "#fff", padding: 12, borderRadius: 26, boxShadow: "0 18px 44px rgba(0,0,0,0.28)" }}>
    <Img src={IMG(img)} style={{ width: w, height: h, objectFit: "cover", objectPosition: pos, borderRadius: 16, display: "block" }} />
    {name && <div style={{ position: "absolute", left: "50%", bottom: -20, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 18px", fontFamily: fonts.bold, fontSize: 30, color: INK, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>{name}</div>}
  </div>
);

const Cutout: React.FC<{ img: string; w: number; name?: string; rot?: number }> = ({ img, w, name, rot = 0 }) => (
  <div style={{ position: "relative", width: w, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.28))" }}>
    <Img src={IMG(img)} style={{ width: w, display: "block" }} />
    {name && <div style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>{name}</div>}
  </div>
);

const GptHead: React.FC<{ size?: number; right?: React.ReactNode }> = ({ size = 28, right }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: size, color: INK }}>
    <div style={{ width: size * 1.2, height: size * 1.2, borderRadius: size, background: GREEN }} />
    ChatGPT
    {right && <div style={{ marginLeft: "auto" }}>{right}</div>}
  </div>
);

const Chip: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = INK, size = 24 }) => (
  <div style={{ display: "inline-block", border: `2px solid ${LINE}`, borderRadius: 30, padding: "4px 16px", fontFamily: fonts.semibold, fontSize: size, color }}>{children}</div>
);

// Typing text between start and end.
const Typed: React.FC<{ text: string; start: number; end: number; style?: React.CSSProperties }> = ({ text, start, end, style }) => {
  const { t } = useSec();
  const n = Math.round(interpolate(t, [start, end], [0, text.length], clamp));
  return <div style={style}>{text.slice(0, n)}</div>;
};

// Flat phone mockup (rounded dark frame, white screen).
const Phone: React.FC<{ w: number; h: number; rot?: number; children: React.ReactNode }> = ({ w, h, rot = 0, children }) => (
  <div style={{ width: w, height: h, background: "#1B1B1B", borderRadius: 54, padding: 14, transform: `rotate(${rot}deg)`, boxShadow: "0 22px 50px rgba(0,0,0,0.30)" }}>
    <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 42, padding: "34px 26px", boxSizing: "border-box", overflow: "hidden" }}>{children}</div>
  </div>
);

// Translation screen: source (small, grey) -> target (big, ink).
const Translate: React.FC<{ from: string; to: string; src: string; dst: string; start: number; end: number; size?: number }> = ({ from, to, src, dst, start, end, size = 40 }) => (
  <div>
    <GptHead size={24} />
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 18 }}>
      <Chip size={22} color={GREY}>{from}</Chip>
      <div style={{ fontFamily: fonts.bold, fontSize: 24, color: GREY }}>→</div>
      <Chip size={22}>{to}</Chip>
    </div>
    <div style={{ fontFamily: fonts.medium, fontSize: size * 0.62, color: GREY, marginTop: 22, lineHeight: 1.3 }}>{src}</div>
    <div style={{ height: 2, background: LINE, margin: "18px 0" }} />
    <Typed text={dst} start={start} end={end} style={{ fontFamily: fonts.semibold, fontSize: size, color: INK, lineHeight: 1.25 }} />
  </div>
);

const Captions: React.FC<{ words: Word[]; split: number; capY: number }> = ({ words, split, capY }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  const inPanel = split > 0.5;
  // split: centred exactly on the seam (y = PH); fullscreen: chest/shoulder height (capY).
  const size = 54;
  const top = inPanel ? PH - size * 0.62 : capY;
  return (
    <div
      style={{
        position: "absolute", top, width: 1080, textAlign: "center", fontFamily: fonts.bold, fontSize: size, lineHeight: 1.15, letterSpacing: -0.5,
        color: inPanel ? INK : "#fff",
        WebkitTextStroke: inPanel ? "10px #fff" : undefined, paintOrder: "stroke fill",
        textShadow: inPanel ? "0 3px 10px rgba(0,0,0,0.18)" : "0 2px 4px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)",
        opacity: split > 0.05 && split < 0.95 ? 0 : 1,
      }}
    >
      {cur.text}
    </div>
  );
};

export const SatireAustralien: React.FC<SatireAustralienProps> = ({ src, seconds, words, c, fr, capY }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.hatte - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;

  const P1: Win = { from: c.seitdem - 0.1, to: c.verlernt + 0.4 };
  const P2: Win = { from: c.Gabel - 0.35, to: c.Gabel + 1.9 };
  const P3: Win = { from: c.Handy - 0.12, to: c.Handy + 2.88 };
  const split = Math.max(...[P1, P2, P3].map((w) => envelope(t, w)));
  const z = drift * punch;

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * fr.ax * (1 - z) + split * fr.tx}px, ${(1 - split) * fr.ay * (1 - z) + split * fr.ty}px) scale(${(1 - split) * z + split * fr.s})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail (frame 0) */}
      <SerifTitle from={0} to={P1.from + 0.1} x={0} y={120} align="center" size={108} ink lines={[{ text: "Ein Jahr Australien." }, { text: "Und dann kam das Handy.", italic: true }]} />
      <Sticker from={0} to={P1.from + 0.1} x={760} y={480} rotate={3}>
        <Photo img="bondi.jpg" w={430} h={250} name="ein Jahr Sydney" />
      </Sticker>

      {/* Deutsch verlernt: profile card */}
      <Sticker from={P1.to - 0.05} to={c.wie - 0.1} x={540} y={430} rotate={-1}>
        <Card w={760} pad={28}>
          <Label size={24} style={{ letterSpacing: 2 }}>SPRACHEN</Label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14 }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: INK }}>Englisch</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 28, color: GREY }}>1 Jahr Australien</div>
          </div>
          <div style={{ height: 2, background: LINE, margin: "16px 0" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 40, color: INK }}>Deutsch</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 28, color: GREY, }}>Muttersprache</div>
            <div style={{ position: "absolute", left: -6, top: 26, height: 5, borderRadius: 3, background: RED, width: interpolate(t, [P1.to + 0.1, P1.to + 0.4], [0, 720], clamp) }} />
          </div>
        </Card>
      </Sticker>

      {/* Wie heißt das nochmal auf Deutsch */}
      <SerifTitle from={c.wie - 0.1} to={P2.from + 0.1} x={0} y={160} align="center" size={100} ink lines={[{ text: "„Wie heißt das" }, { text: "nochmal auf Deutsch?“", italic: true }]} />

      {/* Im Urlaub bestellt er für alle, auf Englisch */}
      <Sticker from={P2.to - 0.05} to={c.Dafuer - 0.08} x={540} y={420} rotate={-1}>
        <div style={{ position: "relative", width: 860, height: 360 }}>
          <div style={{ position: "absolute", left: 40, top: 0, opacity: fade(t, c.bestellt - 0.1) }}><Bubble text="Okay guys, I’ll order for everyone." size={36} /></div>
          <div style={{ position: "absolute", right: 30, top: 120, opacity: fade(t, c.selbstverstaendlich - 0.1) }}><Bubble me text="Four Spritz, please!" size={40} /></div>
          <div style={{ position: "absolute", left: 120, top: 250, fontFamily: serifItalic, fontSize: 64, color: INK, opacity: fade(t, c.Englisch - 0.05) }}>selbstverständlich auf Englisch</div>
        </div>
      </Sticker>

      {/* Dafür war er ein Jahr weg */}
      <SerifTitle from={c.Dafuer - 0.08} to={c.Apulien - 0.1} x={0} y={170} align="center" size={104} ink lines={[{ text: "Dafür war er" }, { text: "ein Jahr weg.", italic: true, at: c.Jahr2 - 0.05 }]} />

      {/* Apulien */}
      <Sticker from={c.Apulien - 0.1} to={P3.from + 0.1} x={540} y={450} rotate={2}>
        <Photo img="apulien.jpg" w={560} h={330} name="Apulien" />
      </Sticker>

      {/* Er diktiert lauter, auf Englisch */}
      <Sticker from={P3.to - 0.05} to={c.Handy2 - 0.08} x={540} y={420} rotate={1}>
        <Card w={780} pad={30}>
          <GptHead size={24} right={<div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.semibold, fontSize: 22, color: RED }}><div style={{ width: 16, height: 16, borderRadius: 8, background: RED, opacity: Math.floor(t * 3) % 2 ? 1 : 0.35 }} />Aufnahme</div>} />
          <div style={{ display: "flex", gap: 6, alignItems: "center", height: 90, marginTop: 14 }}>
            {Array.from({ length: 34 }).map((_, i) => {
              const loud = t >= c.lauter ? 1.9 : 1;
              const h = Math.min(86, (14 + 22 * Math.abs(Math.sin(i * 1.7 + t * 9))) * loud);
              return <div key={i} style={{ width: 12, height: h, borderRadius: 6, background: INK, opacity: t >= c.diktiert ? 1 : 0.25 }} />;
            })}
          </div>
          <div style={{ fontFamily: fonts.bold, fontSize: t >= c.lauter ? 58 : 42, color: INK, marginTop: 16, opacity: fade(t, c.Bestellung - 0.05) }}>FOUR SPRITZ. PLEASE.</div>
          <div style={{ marginTop: 14, opacity: fade(t, c.Englisch2 - 0.05) }}><Chip size={22} color={RED}>Englisch</Chip></div>
        </Card>
      </Sticker>

      {/* Das Handy übersetzt es trotzdem */}
      <Sticker from={c.Handy2 - 0.08} to={c.sagt2 - 0.08} x={540} y={420} rotate={-1}>
        <div style={{ position: "relative" }}>
          <Card w={780} pad={30}>
            <Translate from="Englisch" to="Italienisch" src="FOUR SPRITZ. PLEASE." dst="Quattro Spritz, per favore." start={c.Handy2 + 0.1} end={c.Handy2 + 0.8} size={48} />
          </Card>
          <Draw at={c.trotzdem} w={320} h={140} d={CIRCLE} style={{ left: 300, top: 58, transform: "scale(1.15,0.7)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* Er sagt dem Kellner: das hätte ich auch gekonnt */}
      <Sticker from={c.sagt2 - 0.08} to={punchAt} x={540} y={430} rotate={0}>
        <div style={{ position: "relative", width: 900, height: 560 }}>
          <div style={{ position: "absolute", right: 40, top: 20 }}><Cutout img="waiter.png" w={250} name="der Kellner" /></div>
          <div style={{ position: "absolute", left: 20, top: 120, opacity: fade(t, c.gekonnt - 0.4) }}><Bubble me text="Das hätte ich auch gekonnt." size={40} /></div>
          <div style={{ position: "absolute", left: 60, top: 300, fontFamily: serifItalic, fontSize: 62, color: RED, opacity: fade(t, c.kein - 0.05) }}>kann kein Englisch</div>
          <svg width={240} height={120} style={{ position: "absolute", left: 470, top: 300, overflow: "visible", opacity: fade(t, c.kein - 0.05) }}>
            <path d="M 0 60 C 70 70, 140 50, 200 -40" fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - interpolate(t, [c.kein, c.kein + 0.35], [0, 1], clamp)} />
          </svg>
        </div>
      </Sticker>

      {/* Pointe: calm, uncovered, no panel */}
      <SerifTitle from={c.schlechtem - 0.1} to={seconds + 1} x={0} y={160} align="center" size={104} ink lines={[{ text: "Nur Freunde" }, { text: "mit schlechtem.", italic: true }]} />

      {/* ---------- dopamine panels (light) ---------- */}
      <Panel w={P1}>
        <div style={{ position: "absolute", left: 70, top: 80, width: 940, height: 470, borderRadius: 24, overflow: "hidden" }}>
          <Img src={IMG("opera.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${interpolate(t, [P1.from, P1.to], [1.04, 1.12], clamp)})` }} />
        </div>
        <div style={{ position: "absolute", left: 70, top: 580, display: "flex", alignItems: "baseline", gap: 22 }}>
          <div style={{ fontFamily: serif, fontSize: 120, color: INK, lineHeight: 1 }}>
            {Math.min(365, Math.round(interpolate(t, [P1.from + 0.2, P1.from + 1.4], [1, 365], { ...clamp, easing: ease })))}
          </div>
          <div style={{ fontFamily: serifItalic, fontSize: 64, color: INK }}>Tage Australien</div>
        </div>
      </Panel>

      <Panel w={P2}>
        <div style={{ position: "absolute", top: 70, width: 1080, textAlign: "center" }}><Label size={36} style={{ opacity: fade(t, P2.from + 0.1) }}>„Wie heißt das nochmal?“</Label></div>
        <div style={{ position: "absolute", left: 90, top: 170, width: 900, height: 420, overflow: "hidden" }}>
          <Img src={IMG("fork.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${interpolate(t, [P2.from, P2.to], [30, -20], clamp)}px)` }} />
        </div>
        <div style={{ position: "absolute", top: 600, width: 1080, textAlign: "center", fontFamily: serif, fontSize: 140, color: INK, lineHeight: 1, opacity: fade(t, c.Gabel), transform: `translateY(${(1 - fade(t, c.Gabel)) * 16}px)` }}>Gabel.</div>
      </Panel>

      <Panel w={P3}>
        <div style={{ position: "absolute", left: 50, top: 60, width: 980, height: 680, borderRadius: 24, overflow: "hidden" }}>
          <Img src={IMG("table.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "40% 50%" }} />
        </div>
        <div style={{ position: "absolute", right: 70, top: 150, opacity: fade(t, P3.from + 0.3) }}><Cutout img="waiter.png" w={290} name="Cameriere" /></div>
        {(() => {
          const s = spring({ frame: frame - (P3.from + 0.25) * fps, fps, config: { damping: 15, stiffness: 160, mass: 0.7 } });
          return (
            <div style={{ position: "absolute", left: 130, top: 170, transform: `translateX(${(1 - s) * -420}px)` }}>
              <Phone w={380} h={560} rot={8}>
                <Translate from="Deutsch" to="Italienisch" src="Für alle bitte vier Spritz." dst="Per tutti quattro Spritz, per favore." start={c.ChatGPT} end={c.ChatGPT + 1.1} size={36} />
              </Phone>
            </div>
          );
        })()}
      </Panel>

      <Captions words={words} split={split} capY={capY} />
    </AbsoluteFill>
  );
};
