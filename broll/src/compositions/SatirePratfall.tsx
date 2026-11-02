import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, Note, SerifTitle, Sticker, useSec, Word, serif, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// GPT-S @florentgpt "Restaurnat" (Pratfall-Effekt), 2026-10-10. Built on SatireKostenV2 (v3 split framing).
// Light dopamine: 4 flat white split panels (dating bubble 2.5 s, term tile 2.5 s, typo counter 2 s, subscription
// toggle 1.5 s). Real CC0 photos only, two fonts (Instrument Serif + Inter), no emoji/clipart/glow/gradients.
// "Restaurnat" is intentionally misspelled everywhere. The punchline (Gestern → end) stays calm and uncovered.
export type SatirePratfallProps = {
  src: string;
  seconds: number;
  words: Word[];
  c: Record<string, number>;
  frame?: { s: number; ty: number }; // split reframing (measured with facefocus.py)
};

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#10A37F";
const GREY = "#8A8A8A";
const LINE = "#E6E6E2";
const IMG = (f: string) => staticFile(`gpts-effekt-pratfall/img/${f}`);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], clamp);
const ease = Easing.bezier(0.22, 1, 0.36, 1);

const PH = 800;
const IN = 0.24;
type Win = { from: number; to: number };
const envelope = (t: number, w: Win) =>
  Math.min(interpolate(t, [w.from, w.from + IN], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.to - IN, w.to], [1, 0], { ...clamp, easing: Easing.in(Easing.cubic) }));
// panels closer than 0.6 s share one split (no speaker bounce in between)
const merge = (ws: Win[]) => {
  const out: Win[] = [];
  for (const w of ws) {
    const last = out[out.length - 1];
    if (last && w.from - last.to < 0.6) last.to = Math.max(last.to, w.to);
    else out.push({ ...w });
  }
  return out;
};

// hand-drawn red squiggle under a word
const Squiggle: React.FC<{ at: number; w: number; style?: React.CSSProperties }> = ({ at, w, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.4], [0, 1], clamp);
  const n = Math.max(4, Math.round(w / 26));
  let d = "M 0 8";
  for (let i = 0; i < n; i++) d += ` Q ${(i + 0.5) * (w / n)} ${i % 2 ? 16 : 0}, ${(i + 1) * (w / n)} 8`;
  return (
    <svg width={w} height={18} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={4.5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// Flat counter: one digit rolling to `value` (integer steps), no glow.
const Count: React.FC<{ value: number; size: number; color?: string }> = ({ value, size, color = INK }) => {
  const H = size * 1.08;
  return (
    <div style={{ height: H, overflow: "hidden", width: size * 0.62, fontFamily: fonts.bold, fontSize: size, color, lineHeight: `${H}px`, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>
      <div style={{ transform: `translateY(${-value * H}px)` }}>
        {Array.from({ length: 10 }).map((_, j) => (
          <div key={j} style={{ height: H }}>{j}</div>
        ))}
      </div>
    </div>
  );
};

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

const PhotoCard: React.FC<{ src: string; w: number; h: number; label?: string }> = ({ src, w, h, label }) => (
  <div style={{ width: w, padding: 10, background: "#fff", borderRadius: 24, boxShadow: "0 18px 44px rgba(0,0,0,0.28)" }}>
    <Img src={src} style={{ width: w - 20, height: h, objectFit: "cover", borderRadius: 16, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 30, color: INK, padding: "10px 6px 2px" }}>{label}</div>}
  </div>
);

const Cutout: React.FC<{ img: string; w: number; name?: string; rot?: number }> = ({ img, w, name, rot = 0 }) => (
  <div style={{ position: "relative", width: w, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.28))" }}>
    <Img src={IMG(img)} style={{ width: w, display: "block" }} />
    {name && <div style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK, boxShadow: "0 4px 10px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}>{name}</div>}
  </div>
);

const Check: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={GREEN} /><path d="M11 21 L 17 27 L 29 14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Stamp: React.FC<{ at: number; text: string; size?: number; rot?: number }> = ({ at, text, size = 56, rot = -9 }) => {
  const { t } = useSec();
  const f = fade(t, at);
  return (
    <div style={{ transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * f})`, opacity: f, border: `7px solid ${RED}`, borderRadius: 16, padding: "6px 24px", color: RED, fontFamily: fonts.bold, fontSize: size, letterSpacing: 2, background: "rgba(255,255,255,0.92)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

const Toggle: React.FC<{ on: number; w?: number }> = ({ on, w = 132 }) => {
  const h = w * 0.56;
  return (
    <div style={{ width: w, height: h, borderRadius: h / 2, background: interpolateColor(on), position: "relative" }}>
      <div style={{ position: "absolute", left: 6 + on * (w - h), top: 6, width: h - 12, height: h - 12, borderRadius: (h - 12) / 2, background: "#fff", boxShadow: "0 2px 6px rgba(0,0,0,0.25)" }} />
    </div>
  );
};
const interpolateColor = (p: number) => {
  const a = [0xd9, 0xd9, 0xd9];
  const b = [0x10, 0xa3, 0x7f];
  const m = a.map((v, i) => Math.round(v + (b[i] - v) * p));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
};

// Dating-app chat bubble (generic, no brand): dark ink bubble, right aligned.
const DateBubble: React.FC<{ text: React.ReactNode; me?: boolean; size?: number }> = ({ text, me = true, size = 46 }) => (
  <div style={{ display: "inline-block", padding: "22px 32px", borderRadius: 34, borderBottomRightRadius: me ? 8 : 34, borderBottomLeftRadius: me ? 34 : 8, background: me ? INK : "#F0F0EE", color: me ? "#fff" : INK, fontFamily: fonts.semibold, fontSize: size, lineHeight: 1.25 }}>{text}</div>
);

// Sentence whose letters swap with a little jump, one swap per `at` (proportional font, chars swap at the jump apex).
const TypoLine: React.FC<{ base: string; swaps: { i: number; at: number }[]; size: number }> = ({ base, swaps, size }) => {
  const { t } = useSec();
  const chars = base.split("");
  const jump: number[] = chars.map(() => 0);
  const red: boolean[] = chars.map(() => false);
  for (const s of swaps) {
    const p = interpolate(t, [s.at, s.at + 0.3], [0, 1], clamp);
    if (p <= 0) continue;
    if (p >= 0.5) [chars[s.i], chars[s.i + 1]] = [chars[s.i + 1], chars[s.i]];
    const j = Math.sin(Math.PI * p);
    jump[s.i] = -j * size * 0.5;
    jump[s.i + 1] = -j * size * 0.25;
    red[s.i] = red[s.i + 1] = true;
  }
  return (
    <div style={{ display: "flex", fontFamily: fonts.bold, fontSize: size, color: INK, whiteSpace: "pre" }}>
      {chars.map((ch, i) => (
        <span key={i} style={{ display: "inline-block", transform: `translateY(${jump[i]}px)`, color: red[i] ? RED : INK }}>{ch}</span>
      ))}
    </div>
  );
};

const Captions: React.FC<{ words: Word[]; split: number }> = ({ words, split }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  const inPanel = split > 0.5;
  return (
    <div style={{ position: "absolute", top: inPanel ? PH - 104 : 1920 * 0.8, width: 1080, textAlign: "center", fontFamily: fonts.bold, fontSize: 54, color: inPanel ? INK : "#fff", letterSpacing: -0.5, textShadow: inPanel ? "none" : "0 2px 4px rgba(0,0,0,0.55), 0 0 18px rgba(0,0,0,0.35)", opacity: split > 0.05 && split < 0.95 ? 0 : 1 }}>
      {cur.text}
    </div>
  );
};

export const SatirePratfall: React.FC<SatirePratfallProps> = ({ src, seconds, words, c, frame: fr }) => {
  const { t, frame, fps } = useSec();
  const SPLIT_S = fr?.s ?? 1.35;
  const SPLIT_TY = fr?.ty ?? 1166 - 1.35 * 826;
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.Gestern - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;

  // panels (light dopamine)
  const P2: Win = { from: c.Pratfall - 0.3, to: Math.max(c.Pratfall + 2.2, Math.min(c.sympathischerEnd + 0.15, c.Pratfall + 3.4)) };
  // P1 runs until P2 has slid in on top (no speaker bounce between the two)
  const P1: Win = { from: c.wollen - 0.2, to: P2.from - (c.wollen - 0.2) < 3.2 ? P2.from + IN : Math.max(c.wollen + 2.3, c.RestaurnatEnd + 0.35) };
  const P3: Win = { from: c.Drei - 0.12, to: Math.max(c.Drei + 1.9, c.verteiltEnd + 0.1) };
  const P4: Win = { from: c.Neun - 0.12, to: Math.max(c.Neun + 1.4, c.MonatEnd + 0.15) };
  const merged = merge([P1, P2, P3, P4]);
  const split = Math.max(...merged.map((w) => envelope(t, w)));

  // 3 swaps inside "Hast du am Freitag Zeit?" → "Hast du am Fretiag Ziet?" … spread across "Drei pro Nachricht"
  const base = "Hast du Freitag Zeit?";
  const sw = [
    { i: 1, at: P3.from + 0.35 },
    { i: 11, at: P3.from + 0.75 },
    { i: 17, at: P3.from + 1.15 },
  ];
  const typos = sw.filter((s) => t >= s.at + 0.14).length;

  const S = (w: Win) => w; // readability

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * 410.4 * (1 - drift * punch)}px, ${(1 - split) * 921.6 * (1 - drift * punch) + split * SPLIT_TY}px) scale(${(1 - split) * drift * punch + split * SPLIT_S})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Kumpel - 0.1} x={0} y={170} align="center" size={108} ink lines={[{ text: "Rechtschreibfehler" }, { text: "im Abo.", italic: true }]} />
      <Sticker from={0} to={c.Kumpel - 0.1} x={540} y={500} rotate={-2}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={640} pad={22}>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK }}>
              Hast du <span style={{ position: "relative", display: "inline-block" }}>Fretiag<Squiggle at={0.15} w={150} style={{ left: 0, top: 50 }} /></span> Zeit?
            </div>
          </Card>
        </div>
      </Sticker>

      {/* Dein Kumpel hat ein Abo */}
      <Sticker from={c.Kumpel - 0.08} to={c.Frueher - 0.08} x={845} y={830} rotate={0}>
        <Cutout img="max.png" w={260} name="dein Kumpel" rot={4} />
      </Sticker>
      <Sticker from={c.Abo - 0.08} to={c.Frueher - 0.08} x={420} y={520} rotate={-2}>
        <Card w={520} pad={22}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Check s={56} />
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 36, color: INK }}>Abo aktiv</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREY }}>Rechtschreibfehler</div>
            </div>
          </div>
        </Card>
      </Sticker>

      {/* Früher: ChatGPT glattziehen */}
      <Sticker from={c.Frueher - 0.08} to={c.Deshalb - 0.08} x={540} y={470} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={820} pad={24} style={{ background: "#F7F7F5" }}>
            <div style={{ paddingBottom: 10, marginBottom: 14, borderBottom: "2px solid #E6E6E2", fontFamily: fonts.bold, fontSize: 28, color: INK }}>ChatGPT</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}><Bubble me text="Mach das bitte fehlerfrei." size={30} /></div>
            <div style={{ marginTop: 16, opacity: fade(t, c.glattziehen) }}>
              <Bubble text="Hättest du am Freitag Zeit?" size={32} />
            </div>
          </Card>
          <div style={{ position: "absolute", right: 30, bottom: -60 }}><Stamp at={c.verdaechtig} text="VERDÄCHTIG" size={50} /></div>
        </div>
      </Sticker>
      <SerifTitle from={c.fehlerfrei - 0.1} to={c.Deshalb - 0.08} x={0} y={110} align="center" size={100} ink lines={[{ text: "fehlerfrei", italic: true }]} />

      {/* Deshalb schreibt er jetzt … */}
      <Sticker from={c.Deshalb - 0.06} to={P1.from + 0.1} x={845} y={830} rotate={0}>
        <Cutout img="max.png" w={250} name="dein Kumpel" rot={-3} />
      </Sticker>
      <Sticker from={c.Deshalb - 0.02} to={P1.from + 0.1} x={400} y={520} rotate={-3}>
        <PhotoCard src={IMG("dinner.jpg")} w={460} h={280} />
      </Sticker>

      {/* Psychologen nennen das … (gap between P1 and P2, only if not merged) */}

      {/* Dein Kumpel patzt nicht mal mehr selbst. Dafür hat er ja mich. Meine App … */}
      <Sticker from={P2.to - 0.05} to={c.Meine - 0.08} x={845} y={830} rotate={0}>
        <Cutout img="max.png" w={250} name="dein Kumpel" rot={3} />
      </Sticker>
      <Note from={P2.to + 0.1} to={c.Meine - 0.08} x={560} y={420} text="patzt nicht selbst" color={INK} size={52} d="M 160 10 C 200 60, 230 120, 250 200" />
      <Sticker from={c.Meine - 0.08} to={P3.from} x={540} y={500} rotate={-1}>
        <Card w={700} pad={26}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 96, height: 96, borderRadius: 24, background: INK, color: "#fff", display: "grid", placeItems: "center", fontFamily: serifItalic, fontSize: 64 }}>a</div>
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK }}>Meine App</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: GREY }}>baut die Fehler für dich ein</div>
            </div>
          </div>
        </Card>
      </Sticker>

      {/* Premium: Sprachnachricht mit Verhaspler */}
      <Sticker from={P4.to - 0.05} to={punchAt} x={540} y={480} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={26}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 12, marginBottom: 16, borderBottom: "2px solid #EFEFEF" }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 36, color: INK }}>Premium</span>
              <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: GREY }}>nächsten Monat</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: fade(t, c.Sprachnachricht - 0.1) }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: INK, display: "grid", placeItems: "center" }}>
                <svg width="26" height="30" viewBox="0 0 26 30"><path d="M3 2 L 24 15 L 3 28 Z" fill="#fff" /></svg>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, height: 70 }}>
                {Array.from({ length: 26 }).map((_, i) => {
                  const hh = 16 + Math.abs(Math.sin(i * 1.7) * 44);
                  const bad = i >= 13 && i <= 16;
                  return <div key={i} style={{ width: 9, height: hh, borderRadius: 5, background: bad && t >= c.verhaspelt ? RED : "#BDBDB8" }} />;
                })}
              </div>
              <span style={{ fontFamily: fonts.semibold, fontSize: 28, color: GREY }}>0:07</span>
            </div>
          </Card>
          <div style={{ position: "absolute", left: 380, top: 196, opacity: fade(t, c.verhaspelt), fontFamily: serifItalic, fontSize: 46, color: RED, whiteSpace: "nowrap" }}>„äh, ich mein …“</div>
        </div>
      </Sticker>

      {/* Pointe: calm, uncovered. Match + her reply */}
      <Sticker from={c.Match - 0.08} to={seconds + 1} x={850} y={860} rotate={0}>
        <Cutout img="lea.png" w={270} name="Match" rot={3} />
      </Sticker>
      <Sticker from={c.Sie - 0.05} to={seconds + 1} x={470} y={430} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={26}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREY, marginBottom: 14 }}>{t < c.Gerne - 0.05 ? "schreibt …" : "gerade eben"}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <DateBubble size={34} text={<>wollen wir mal in ein Restaurnat</>} />
            </div>
            <div style={{ opacity: fade(t, c.Gerne - 0.05), transform: `translateY(${(1 - fade(t, c.Gerne - 0.05)) * 12}px)` }}>
              <DateBubble me={false} size={40} text={<>Gerne, welches <span style={{ position: "relative", display: "inline-block" }}>Restaurnat?<Squiggle at={c.Restaurnat2 + 0.15} w={220} style={{ left: 0, top: 48 }} /></span></>} />
            </div>
          </Card>
        </div>
      </Sticker>

      {/* ---------- dopamine panels (light) ---------- */}
      <Panel w={S(P1)}>
        <div style={{ position: "absolute", top: 110, width: 1080, textAlign: "center" }}><Label>Seine Nachricht, ab jetzt</Label></div>
        <div style={{ position: "absolute", left: 90, top: 190, width: 900, display: "flex", alignItems: "center", gap: 20, paddingBottom: 22, borderBottom: `2px solid ${LINE}` }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, overflow: "hidden", background: "#eee" }}><Img src={IMG("lea.png")} style={{ width: 84, height: 84, objectFit: "cover" }} /></div>
          <div>
            <div style={{ fontFamily: fonts.bold, fontSize: 36, color: INK }}>Neues Match</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREY }}>Dating-App · gerade online</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 90, top: 380, opacity: fade(t, c.wollen - 0.05), transform: `translateY(${(1 - fade(t, c.wollen - 0.05)) * 20}px)` }}>
          <DateBubble size={50} text={<>wollen wir mal in ein <span style={{ position: "relative", display: "inline-block" }}>Restaurnat<Squiggle at={c.Restaurnat + 0.2} w={268} style={{ left: 0, top: 62 }} /></span></>} />
        </div>
      </Panel>

      <Panel w={S(P2)}>
        <div style={{ position: "absolute", top: 120, width: 1080, textAlign: "center" }}><Label style={{ opacity: fade(t, P2.from + 0.05) }}>Psychologen nennen das</Label></div>
        <div style={{ position: "absolute", top: 180, width: 1080, textAlign: "center", color: INK }}>
          <div style={{ fontFamily: serif, fontSize: 158, lineHeight: 1, letterSpacing: -2, opacity: fade(t, c.Pratfall), transform: `translateY(${(1 - fade(t, c.Pratfall)) * 16}px)` }}>Pratfall-</div>
          <div style={{ fontFamily: serifItalic, fontSize: 158, lineHeight: 1.05, letterSpacing: -2, opacity: fade(t, c.Pratfall + 0.3), transform: `translateY(${(1 - fade(t, c.Pratfall + 0.3)) * 16}px)` }}>Effekt</div>
          <div style={{ width: interpolate(t, [c.Pratfall + 0.35, c.Pratfall + 0.8], [0, 360], { ...clamp, easing: ease }), height: 4, background: INK, margin: "18px auto 0", borderRadius: 2 }} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 38, color: INK, marginTop: 26 }}>
            <span style={{ opacity: fade(t, Math.min(c.kompetent, P2.from + 0.9)) }}>kompetent</span>
            <span style={{ opacity: fade(t, Math.min(c.patzt, P2.from + 1.3)) }}> + <span style={{ color: RED }}>kleiner Patzer</span></span>
            <span style={{ opacity: fade(t, Math.min(c.sympathischer, P2.from + 1.7)) }}> = <span style={{ color: GREEN }}>sympathischer</span></span>
          </div>
        </div>
      </Panel>

      <Panel w={S(P3)}>
        <div style={{ position: "absolute", top: 110, width: 1080, textAlign: "center" }}><Label>Tippfehler pro Nachricht</Label></div>
        <div style={{ position: "absolute", top: 170, width: 1080, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18 }}>
          <Count value={typos} size={200} color={typos ? RED : INK} />
        </div>
        <div style={{ position: "absolute", top: 450, width: 1080, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#F4F4F2", borderRadius: 28, padding: "18px 30px" }}>
            <TypoLine base={base} swaps={sw} size={56} />
          </div>
        </div>
        <div style={{ position: "absolute", top: 590, width: 1080, textAlign: "center", opacity: fade(t, Math.min(c.zufaellig, P3.from + 1.3)) }}><Label size={32}>zufällig verteilt</Label></div>
      </Panel>

      <Panel w={S(P4)}>
        <div style={{ position: "absolute", left: 140, top: 140, width: 800, background: "#fff", border: `2px solid ${LINE}`, borderRadius: 32, padding: "36px 44px", boxShadow: "0 14px 34px rgba(0,0,0,0.10)" }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: GREY }}>Abo</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 4 }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 150, color: INK, letterSpacing: -4, lineHeight: 1 }}>9 €</span>
            <span style={{ fontFamily: fonts.semibold, fontSize: 48, color: INK }}>/Monat</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 34, paddingTop: 28, borderTop: `2px solid ${LINE}` }}>
            <span style={{ fontFamily: fonts.bold, fontSize: 44, color: INK }}>Fehler an</span>
            <Toggle on={interpolate(t, [P4.from + 0.45, P4.from + 0.7], [0, 1], { ...clamp, easing: ease })} />
          </div>
        </div>
      </Panel>

      <Captions words={words} split={split} />
      {/* frame/fps reserved for spring-based extras */}
      <div style={{ display: "none" }}>{spring({ frame, fps }) > 2 ? "" : ""}</div>
    </AbsoluteFill>
  );
};
