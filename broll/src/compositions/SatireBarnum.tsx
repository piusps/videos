import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, serif, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// GPT-S @florentgpt "Das bin so ich" (Barnum-Effekt), 2026-10-10.
// Style = SatireKostenV2 (v3 split framing): light dopamine (4 flat white panels), real CC0 stock cutouts,
// Instrument Serif + Inter only, no emoji / clipart / glow. Punchline ("Und du ...") calm, no panel, one punch-in.
export type Framing = { ax: number; ay: number; s: number; tx: number; ty: number };
export type SatireBarnumProps = { src: string; seconds: number; words: Word[]; c: Record<string, number>; fr: Framing };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#10A37F";
const GREY = "#8A8A8A";
const LINE = "#E6E6E2";
const IMG = (f: string) => staticFile(`gpts-barnum/img/${f}`);

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

const Cutout: React.FC<{ img: string; w: number; name?: string; rot?: number }> = ({ img, w, name, rot = 0 }) => (
  <div style={{ position: "relative", width: w, transform: `rotate(${rot}deg)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.28))" }}>
    <Img src={IMG(img)} style={{ width: w, display: "block" }} />
    {name && <div style={{ position: "absolute", left: "50%", bottom: -18, transform: "translateX(-50%)", background: "#fff", borderRadius: 12, padding: "4px 16px", fontFamily: fonts.bold, fontSize: 28, color: INK, whiteSpace: "nowrap", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>{name}</div>}
  </div>
);

// Flat ChatGPT logo mark substitute: green dot + wordmark (no brand logo file).
const GptHead: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.bold, fontSize: size, color: INK }}>
    <div style={{ width: size * 1.2, height: size * 1.2, borderRadius: size, background: GREEN }} />
    ChatGPT
  </div>
);

// ChatGPT answer bubble whose text types itself between `start` and `end`.
const TypingAnswer: React.FC<{ text: string; start: number; end: number; size?: number; w: number }> = ({ text, start, end, size = 40, w }) => {
  const { t } = useSec();
  const n = Math.round(interpolate(t, [start, end], [0, text.length], clamp));
  const caret = t < end + 0.3 && Math.floor(t * 4) % 2 === 0;
  return (
    <div style={{ width: w, fontFamily: fonts.medium, fontSize: size, lineHeight: 1.3, color: INK }}>
      {text.slice(0, n)}
      <span style={{ display: "inline-block", width: size * 0.5, height: size * 0.5, borderRadius: size, background: INK, marginLeft: 6, opacity: caret ? 1 : 0 }} />
    </div>
  );
};

const ANSWER = "Nach außen wirkst du stark, aber innen machst du dir mehr Gedanken, als andere ahnen.";

// Mini screenshot of the ChatGPT answer (used in the group chat and the stack).
const MiniShot: React.FC<{ w: number; size?: number }> = ({ w, size = 24 }) => (
  <div style={{ width: w, background: "#fff", border: `2px solid ${LINE}`, borderRadius: 18, padding: "14px 18px" }}>
    <GptHead size={size * 0.85} />
    <div style={{ fontFamily: fonts.medium, fontSize: size, lineHeight: 1.3, color: INK, marginTop: 8 }}>
      Nach außen wirkst du <b>stark</b>, aber innen machst du dir mehr <b>Gedanken</b>, als andere ahnen.
    </div>
  </div>
);

// Flat blue tear drop (not an emoji): stands in for the "Heulsmileys".
const Tear: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s * 1.3} viewBox="0 0 20 26"><path d="M10 1 C 14 9, 18 13, 18 17.5 A 8 8 0 0 1 2 17.5 C 2 13, 6 9, 10 1 Z" fill="#4A90E2" /></svg>
);

const ChatHead: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, paddingBottom: 12, marginBottom: 14, borderBottom: "2px solid #EFEFEF" }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: "#F2C94C", display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 24, color: INK }}>M</div>
    <div>
      <div style={{ fontFamily: fonts.bold, fontSize: 28, color: INK }}>{title}</div>
      <div style={{ fontFamily: fonts.medium, fontSize: 22, color: GREY }}>{sub}</div>
    </div>
  </div>
);

const Msg: React.FC<{ at: number; name: string; color: string; text: string; t: number }> = ({ at, name, color, text, t }) => {
  const o = interpolate(t, [at - 0.06, at + 0.12], [0, 1], clamp);
  return (
    <div style={{ opacity: o, transform: `translateY(${(1 - o) * 14}px)`, marginBottom: 6 }}>
      <div style={{ display: "inline-block", background: "#F3F3F1", borderRadius: 18, borderBottomLeftRadius: 6, padding: "7px 16px" }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 19, color }}>{name}</div>
        <div style={{ fontFamily: fonts.semibold, fontSize: 29, color: INK }}>{text}</div>
      </div>
    </div>
  );
};

// Paar-Analyse result card (identical for both).
const PairCard: React.FC<{ w: number; who: string }> = ({ w, who }) => (
  <div style={{ width: w, background: "#fff", border: `2px solid ${LINE}`, borderRadius: 22, padding: "18px 22px", boxShadow: "0 10px 24px rgba(0,0,0,0.10)" }}>
    <div style={{ fontFamily: fonts.semibold, fontSize: 22, letterSpacing: 2, color: GREY }}>ANALYSE · {who}</div>
    <div style={{ fontFamily: fonts.medium, fontSize: 28, lineHeight: 1.3, color: INK, marginTop: 8 }}>Nach außen wirkst du stark, aber innen machst du dir mehr Gedanken, als andere ahnen.</div>
  </div>
);

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

export const SatireBarnum: React.FC<SatireBarnumProps> = ({ src, seconds, words, c, fr }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punchAt = c.Und - 0.05;
  const punch = t >= punchAt ? 1.12 : 1;

  const P1: Win = { from: c.Nach - 0.12, to: c.Nach + 2.5 };
  const P2: Win = { from: c.Barnum - 0.3, to: c.Barnum + 2.3 };
  const P3: Win = { from: c.vier - 0.12, to: c.vier + 1.95 };
  const P4: Win = { from: c.Neunzehn - 0.12, to: c.Neunzehn + 1.95 };
  const split = Math.max(...[P1, P2, P3, P4].map((w) => envelope(t, w)));
  const z = drift * punch;

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `translate(${(1 - split) * fr.ax * (1 - z) + split * fr.tx}px, ${(1 - split) * fr.ay * (1 - z) + split * fr.ty}px) scale(${(1 - split) * z + split * fr.s})`, transformOrigin: "0 0" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Ohne - 0.1} x={0} y={140} align="center" size={112} ink lines={[{ text: "Das bin" }, { text: "so ich.", italic: true }]} />
      <Sticker from={0} to={c.Ohne - 0.1} x={850} y={640} rotate={3}>
        <Cutout img="freundin.png" w={270} name="deine Freundin" />
      </Sticker>
      <Sticker from={c.ChatGPT - 0.08} to={c.Ohne - 0.1} x={330} y={560} rotate={-2}>
        <Card w={500} pad={20}>
          <GptHead size={26} />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}><Bubble me text="Wie bin ich wirklich?" size={30} /></div>
        </Card>
      </Sticker>

      {/* Ich kenn die Antwort. Ohne sie zu kennen. */}
      <SerifTitle from={c.Ohne - 0.1} to={P1.from} x={0} y={170} align="center" size={100} ink lines={[{ text: "Ich kenn die Antwort." }, { text: "Ohne sie zu kennen.", italic: true, at: c.Ohne - 0.1 }]} />

      {/* answer stays as a card after P1 until the group chat */}
      <Sticker from={P1.to - 0.05} to={c.Sie - 0.08} x={540} y={420} rotate={-1}>
        <Card w={820} pad={26}>
          <GptHead size={26} />
          <div style={{ fontFamily: fonts.medium, fontSize: 36, lineHeight: 1.3, color: INK, marginTop: 12 }}>{ANSWER}</div>
        </Card>
      </Sticker>

      {/* Screenshot in die Gruppe, drei Heulsmileys */}
      <Sticker from={c.Sie - 0.08} to={P2.from} x={540} y={400} rotate={-1}>
        <div style={{ position: "relative" }}>
          <Card w={760} pad={22}>
            <ChatHead title="Mädels" sub="4 Mitglieder" />
            <div style={{ opacity: fade(t, c.Screenshot), display: "inline-block", background: "#DCF8C6", borderRadius: 20, borderBottomRightRadius: 6, padding: 12, marginLeft: 120 }}>
              <MiniShot w={560} size={24} />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10, paddingRight: 6, minHeight: 44 }}>
                {[0, 1, 2].map((i) => {
                  const at = c.Heulsmileys + i * 0.12;
                  const s = spring({ frame: frame - at * fps, fps, config: { damping: 11, stiffness: 220, mass: 0.5 } });
                  return <div key={i} style={{ transform: `scale(${t >= at ? s : 0})` }}><Tear s={34} /></div>;
                })}
              </div>
            </div>
          </Card>
          <Draw at={c.Heulsmileys + 0.3} w={320} h={140} d={CIRCLE} style={{ left: 540, top: 330, transform: "scale(0.62,0.62)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* after the term tile: what it means */}
      <Sticker from={P2.to - 0.05} to={P3.from} x={540} y={450} rotate={-1}>
        <Card w={800} pad={26}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 36, color: INK }}>Sätze, die auf <span style={{ color: RED }}>jeden</span> passen,</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 36, color: INK, marginTop: 6, opacity: fade(t, P2.to + 0.2) }}>fühlen sich an wie <span style={{ color: GREEN }}>für dich</span> geschrieben.</div>
        </Card>
      </Sticker>

      {/* Viermal / Viermal */}
      <SerifTitle from={P3.to - 0.05} to={c.Alle - 0.08} x={0} y={170} align="center" size={100} ink lines={[{ text: "4× stark nach außen" }, { text: "4× Gedanken innen", italic: true, at: c.Viermal2 - 0.08 }]} />

      {/* Alle vier: krass, das bin so ich */}
      <Sticker from={c.Alle - 0.08} to={c.Paare - 0.1} x={540} y={340} rotate={-1}>
        <div style={{ position: "relative" }}>
          <Card w={720} pad={22}>
            <ChatHead title="Mädels" sub="heute, 21:14" />
            <Msg t={t} at={c.krass - 0.1} name="Lisa" color="#D9534F" text="krass, das bin so ich" />
            <Msg t={t} at={c.krass + 0.15} name="Sophie" color="#2F80ED" text="krass, das bin so ich" />
            <Msg t={t} at={c.krass + 0.4} name="Jana" color="#9B51E0" text="krass, das bin so ich" />
            <Msg t={t} at={c.krass + 0.65} name="Mia" color={GREEN} text="krass, das bin so ich" />
          </Card>
        </div>
      </Sticker>

      {/* Version für Paare */}
      <Sticker from={c.Paare - 0.1} to={P4.from} x={540} y={360} rotate={-2}>
        <Cutout img="paar.png" w={460} name="Version für Paare" />
      </Sticker>

      {/* Beide finden: typisch der andere */}
      <Sticker from={P4.to - 0.05} to={punchAt} x={540} y={360} rotate={0}>
        <div style={{ position: "relative", width: 900, height: 520 }}>
          <div style={{ position: "absolute", left: 250, top: 40 }}><Cutout img="paar.png" w={400} /></div>
          <div style={{ position: "absolute", left: 0, top: 0, opacity: fade(t, c.typisch - 0.1) }}><Bubble me text="So typisch er." size={36} /></div>
          <div style={{ position: "absolute", right: 0, top: 70, opacity: fade(t, c.typisch + 0.15) }}><Bubble me text="So typisch sie." size={36} /></div>
        </div>
      </Sticker>

      {/* Pointe: calm, uncovered, no panel */}
      <SerifTitle from={c.genickt - 0.15} to={seconds + 1} x={0} y={170} align="center" size={104} ink lines={[{ text: "Du hast" }, { text: "kurz genickt.", italic: true }]} />

      {/* ---------- dopamine panels (light) ---------- */}
      <Panel w={P1}>
        <div style={{ position: "absolute", top: 110, left: 110 }}><GptHead size={34} /></div>
        <div style={{ position: "absolute", top: 120, right: 110 }}><Label size={28}>Wie bin ich wirklich?</Label></div>
        <div style={{ position: "absolute", top: 210, left: 110 }}>
          <TypingAnswer text={ANSWER} start={P1.from + 0.2} end={P1.from + 2.1} size={58} w={860} />
        </div>
      </Panel>

      <Panel w={P2}>
        <div style={{ position: "absolute", top: 140, width: 1080, textAlign: "center" }}><Label style={{ opacity: fade(t, P2.from + 0.1) }}>In der Psychologie heißt das</Label></div>
        <div style={{ position: "absolute", top: 200, width: 1080, textAlign: "center", color: INK }}>
          <div style={{ fontFamily: serif, fontSize: 170, lineHeight: 1, letterSpacing: -2, opacity: fade(t, c.Barnum), transform: `translateY(${(1 - fade(t, c.Barnum)) * 16}px)` }}>Barnum-</div>
          <div style={{ fontFamily: serifItalic, fontSize: 170, lineHeight: 1.05, letterSpacing: -2, opacity: fade(t, c.Barnum + 0.3), transform: `translateY(${(1 - fade(t, c.Barnum + 0.3)) * 16}px)` }}>Effekt</div>
          <div style={{ width: interpolate(t, [c.Barnum + 0.35, c.Barnum + 0.8], [0, 380], { ...clamp, easing: ease }), height: 4, background: INK, margin: "18px auto 0", borderRadius: 2 }} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: GREY, marginTop: 22, opacity: fade(t, c.Barnum + 0.7) }}>passt auf jeden, fühlt sich an wie nur für dich</div>
        </div>
      </Panel>

      <Panel w={P3}>
        <div style={{ position: "absolute", top: 90, left: 110, display: "flex", alignItems: "baseline", gap: 18 }}>
          <div style={{ fontFamily: fonts.bold, fontSize: 170, color: INK, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {Math.min(4, 1 + Math.floor(interpolate(t, [P3.from + 0.15, P3.from + 1.05], [0, 3.999], clamp)))}
          </div>
          <Label size={40} color={INK}>Screenshots zurück</Label>
        </div>
        {[0, 1, 2, 3].map((i) => {
          const at = P3.from + 0.15 + i * 0.3;
          const s = spring({ frame: frame - at * fps, fps, config: { damping: 15, stiffness: 180, mass: 0.6 } });
          return (
            <div key={i} style={{ position: "absolute", left: 170 + i * 26, top: 270 + i * 58, opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - s) * -220}px) rotate(${[-3, 2, -1, 3][i] * s}deg)`, boxShadow: "0 10px 24px rgba(0,0,0,0.10)", borderRadius: 18 }}>
              <MiniShot w={700} size={26} />
            </div>
          );
        })}
      </Panel>

      <Panel w={P4}>
        <div style={{ position: "absolute", top: 100, width: 1080, textAlign: "center" }}>
          <Label size={34}>Neu</Label>
          <div style={{ fontFamily: serif, fontSize: 120, color: INK, lineHeight: 1.05 }}>Paar-Analyse <span style={{ fontFamily: fonts.bold, fontSize: 110, opacity: fade(t, c.Euro ?? c.Neunzehn + 0.4) }}>19 €</span></div>
        </div>
        {[0, 1].map((i) => {
          const at = P4.from + 0.4 + i * 0.3;
          const s = spring({ frame: frame - at * fps, fps, config: { damping: 15, stiffness: 180, mass: 0.6 } });
          return (
            <div key={i} style={{ position: "absolute", left: 60 + i * 500, top: 330, opacity: t >= at ? 1 : 0, transform: `translateY(${(1 - s) * 160}px) rotate(${(i ? 2 : -2) * s}deg)` }}>
              <PairCard w={460} who={i ? "SIE" : "ER"} />
            </div>
          );
        })}
        <div style={{ position: "absolute", top: 590, width: 1080, textAlign: "center", fontFamily: fonts.semibold, fontSize: 30, color: RED, opacity: fade(t, c.denselben ?? P4.from + 1.2) }}>identisch</div>
      </Panel>

      <Captions words={words} split={split} />
    </AbsoluteFill>
  );
};
