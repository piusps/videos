import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Effekt-Satire "Nudeln mit Pesto" (gpt-effekt-satire, GPT-S @florentgpt, 2026-10-07). Ratchet Effect,
// erklärt an Max und Lea. Same look and sticker zones as SatireTische (cap-backwards selfie, grey wall).
// c = cue seconds on the tightened timeline.
export type SatireRatchetProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#1FA45A";

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Photo: React.FC<{ img: string; w?: number; label?: string }> = ({ img, w = 330, label }) => (
  <div style={{ width: w, padding: 10, paddingBottom: label ? 8 : 10, background: "#fff", borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
    <Img src={staticFile(`gpts-nudeln-mit-pesto/img/${img}.png`)} style={{ width: w - 20, height: (w - 20) * 1.25, objectFit: "cover", borderRadius: 14, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 28, color: INK, padding: "8px 4px 2px" }}>{label}</div>}
  </div>
);

const Row: React.FC<{ at: number; e: string; text: string; right?: string; color?: string; strike?: number }> = ({ at, e, text, right, color = GREEN, strike }) => {
  const { t } = useSec();
  const o = interpolate(t, [at - 0.08, at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = strike !== undefined ? interpolate(t, [strike, strike + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "9px 4px", opacity: o * (1 - 0.45 * s), transform: `translateX(${(1 - o) * -16}px)`, fontFamily: fonts.semibold, fontSize: 36, color: INK }}>
      <span style={{ fontSize: 40 }}>{e}</span>
      <span style={{ flex: 1 }}>{text}</span>
      {right && <span style={{ color, fontFamily: fonts.bold, fontSize: 32 }}>{right}</span>}
      <div style={{ position: "absolute", left: 0, top: "50%", height: 5, width: `${s * 100}%`, background: RED, borderRadius: 3 }} />
    </div>
  );
};

export const SatireRatchet: React.FC<SatireRatchetProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.schlauer - 0.05 ? 1.12 : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "38% 48%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Pasta - 0.05} x={0} y={150} align="center" size={96} ink lines={[{ text: "Warum er beim" }, { text: "ersten Date" }, { text: "zu gut gekocht hat", italic: true }]} />
      <Sticker from={0} to={c.Lea - 0.05} x={860} y={880} rotate={4}>
        <Photo img="max" label="Max" />
      </Sticker>
      <Sticker from={c.Lea - 0.05} to={c.Pasta - 0.05} x={860} y={880} rotate={-4}>
        <Photo img="lea" label="Lea" />
      </Sticker>

      {/* Drei Gänge, Kerzen */}
      <Sticker from={c.Pasta - 0.1} to={c.zwei - 0.05} x={540} y={330} rotate={-1}>
        <Card w={820} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 4, borderBottom: "2px solid #EFEFEF" }}>Date 1 · Menü von Max</div>
          <Row at={c.Pasta} e="🍝" text="Frische Pasta" right="selbst gemacht" />
          <Row at={c.Gaenge} e="🍽️" text="Drei Gänge" right="✓" />
          <Row at={c.Kerzen} e="🕯️" text="Kerzen" right="✓" />
        </Card>
      </Sticker>
      <Sticker from={c.Pasta - 0.05} to={c.zwei - 0.05} x={860} y={900} rotate={4}>
        <Photo img="dinner" />
      </Sticker>

      {/* Zwei Jahre später */}
      <SerifTitle from={c.zwei - 0.1} to={c.Pesto - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Zwei Jahre" }, { text: "später", italic: true }]} />
      <Sticker from={c.Freitag - 0.05} to={c.Pesto - 0.05} x={860} y={880} rotate={-3}>
        <Photo img="lea2" label="Lea, jeden Freitag" />
      </Sticker>
      <Sticker from={c.Freitag - 0.05} to={c.Pesto - 0.05} x={500} y={520} rotate={-2}>
        <Bubble text="Was kochst du heute? 😍" size={42} />
      </Sticker>

      {/* Nudeln mit Pesto */}
      <Sticker from={c.Pesto - 0.1} to={c.Ratchet - 0.1} x={540} y={420} rotate={2}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={640} pad={26} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "#8A8A8A", letterSpacing: 1 }}>WAS MAX WIRKLICH KANN</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 64, color: INK, letterSpacing: -2, marginTop: 6 }}>Nudeln mit Pesto</div>
          </Card>
          <Draw at={c.Pesto + 0.1} w={560} h={40} d="M10 22 C 150 6, 380 34, 550 12" style={{ left: 40, top: 122 }} />
        </div>
      </Sticker>
      <Sticker from={c.Pesto - 0.05} to={c.Ratchet - 0.1} x={860} y={960} rotate={-4}>
        <Photo img="pesto" w={300} />
      </Sticker>

      {/* Ratchet Effect */}
      <SerifTitle from={c.Ratchet - 0.1} to={c.Firma - 0.05} x={0} y={110} align="center" size={112} ink lines={[{ text: "Ratchet" }, { text: "Effect", italic: true }]} />
      <Sticker from={c.Standard - 0.05} to={c.Firma - 0.05} x={540} y={600} rotate={-1}>
        <Card w={760} pad={22}>
          <Row at={c.Standard} e="🍝" text="Einmal drei Gänge" right="Date 1" color={INK} />
          <Row at={c.Standard + 0.3} e="🔒" text="Ab jetzt jeden Freitag" right="Standard" color={RED} />
          <Row at={c.immer} e="♾️" text="Zurück geht nicht" right="für immer" color={RED} />
        </Card>
      </Sticker>

      {/* Deine Firma */}
      <SerifTitle from={c.Firma - 0.1} to={c.Dienstag - 0.05} x={0} y={150} align="center" size={96} ink lines={[{ text: "Deshalb wird deine Firma" }, { text: "mit KI nicht schneller", italic: true }]} />
      <Sticker from={c.Kollege - 0.05} to={c.weiss - 0.05} x={860} y={880} rotate={4}>
        <Photo img="kollege" label="dein Kollege" />
      </Sticker>
      <Sticker from={c.Dienstag - 0.1} to={c.weiss - 0.05} x={540} y={330} rotate={-1}>
        <Card w={820} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 4, borderBottom: "2px solid #EFEFEF" }}>📅 Diese Woche</div>
          <Row at={c.Dienstag} e="🤖" text="Fertig mit ChatGPT" right="Di 11:00" color={GREEN} />
          <Row at={c.vier} e="📤" text="Abgabe an den Chef" right="Fr 16:00" color={RED} />
        </Card>
      </Sticker>

      {/* Wer einmal Dienstag abgibt */}
      <Sticker from={c.weiss - 0.1} to={c.schlauer - 0.05} x={540} y={360} rotate={1}>
        <Card w={800} pad={24}>
          <Row at={c.weiss + 0.2} e="📤" text="Einmal Dienstag abgegeben" right="Di" color={INK} />
          <Row at={c.immer2} e="🔒" text="Ab jetzt immer Dienstag" right="Standard" color={RED} />
        </Card>
      </Sticker>

      {/* Pointe */}
      <SerifTitle from={c.schlauer - 0.1} to={seconds + 1} x={0} y={150} align="center" size={100} ink lines={[{ text: "Schlauer als Max", at: c.schlauer - 0.1 }, { text: "Pesto ab Date 1", italic: true, at: c.Pesto2 - 0.1 }]} />
      <Sticker from={c.schlauer - 0.05} to={c.Pesto2 - 0.05} x={860} y={880} rotate={-3}>
        <Photo img="kollege" label="dein Kollege" />
      </Sticker>
      <Sticker from={c.Pesto2 - 0.05} to={seconds + 1} x={860} y={900} rotate={4}>
        <Photo img="pesto" label="Date 1" />
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
