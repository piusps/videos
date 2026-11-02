import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Effekt-Satire "Referenzpunkteffekt" (gpt-effekt-satire, GPT-S @florentgpt, 2026-10-08).
// Max, Lisa (Eis) und Sofia (Grill Royal). Copy of SatireRatchet, content swapped.
export type SatireReferenzpunktProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

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
const CIRCLE = "M 20 60 C 10 15, 120 0, 200 8 C 290 16, 320 60, 300 95 C 275 135, 90 140, 35 110 C 5 92, 15 55, 60 35";

const Photo: React.FC<{ img: string; w?: number; label?: string }> = ({ img, w = 330, label }) => (
  <div style={{ width: w, padding: 10, paddingBottom: label ? 8 : 10, background: "#fff", borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
    <Img src={staticFile(`gpts-effekt-referenzpunkt/img/${img}.png`)} style={{ width: w - 20, height: (w - 20) * 1.25, objectFit: "cover", borderRadius: 14, display: "block" }} />
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

export const SatireReferenzpunkt: React.FC<SatireReferenzpunktProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Max2 - 0.05 ? 1.12 : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "38% 48%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Lisa - 0.05} x={0} y={150} align="center" size={96} ink lines={[{ text: "Warum er beim" }, { text: "ersten Date" }, { text: "nur Eis zahlt", italic: true }]} />
      <Sticker from={0} to={c.Lisa - 0.05} x={860} y={880} rotate={4}>
        <Photo img="max" label="Max" />
      </Sticker>

      {/* Date 1: Lisa vs Sofia */}
      <Sticker from={c.Lisa - 0.05} to={c.zweiten - 0.05} x={540} y={330} rotate={-1}>
        <Card w={820} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 4, borderBottom: "2px solid #EFEFEF" }}>Max · zwei erste Dates, eine Woche</div>
          <Row at={c.Eis} e="🍦" text="Lisa" right="Eis essen" color={INK} />
          <Row at={c.Grill} e="🥩" text="Sofia" right="Grill Royal" color={RED} />
          <Row at={c.Champagner} e="🥂" text="Steak und Champagner" right="✓" color={RED} />
        </Card>
      </Sticker>
      <Sticker from={c.Lisa - 0.05} to={c.Sofia - 0.05} x={860} y={900} rotate={4}>
        <Photo img="lisa" label="Lisa" />
      </Sticker>
      <Sticker from={c.Sofia - 0.05} to={c.Steak - 0.05} x={860} y={900} rotate={-4}>
        <Photo img="sofia" label="Sofia" />
      </Sticker>
      <Sticker from={c.Steak - 0.05} to={c.zweiten - 0.05} x={860} y={900} rotate={3}>
        <Photo img="steak" label="Grill Royal" />
      </Sticker>

      {/* Date 2: selber Italiener */}
      <SerifTitle from={c.zweiten - 0.1} to={c.Oekonomen - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Date 2" }, { text: "derselbe Italiener", italic: true }]} />
      <Sticker from={c.Italiener - 0.05} to={c.Lisa2 - 0.05} x={860} y={900} rotate={-3}>
        <Photo img="italiener" label="Beide: Spaghetti" />
      </Sticker>
      <Sticker from={c.Lisa2 - 0.05} to={c.Sofia2 - 0.05} x={860} y={900} rotate={4}>
        <Photo img="lisa" label="Lisa" />
      </Sticker>
      <Sticker from={c.Lisa2 - 0.05} to={c.Sofia2 - 0.05} x={500} y={560} rotate={-2}>
        <Bubble text="Wie schön hier 😍" size={42} />
      </Sticker>
      <Sticker from={c.Sofia2 - 0.05} to={c.Oekonomen - 0.05} x={860} y={900} rotate={-4}>
        <Photo img="sofia2" label="Sofia" />
      </Sticker>
      <Sticker from={c.pleite - 0.05} to={c.Oekonomen - 0.05} x={500} y={560} rotate={2}>
        <Bubble text="Bist du pleite? 🤨" size={42} />
      </Sticker>

      {/* Referenzpunkteffekt */}
      <SerifTitle from={c.Referenz - 0.1} to={c.Unterschied - 0.15} x={0} y={110} align="center" size={104} ink lines={[{ text: "Referenzpunkt-" }, { text: "effekt", italic: true }]} />
      <Sticker from={c.Unterschied - 0.1} to={c.Genau - 0.05} x={540} y={330} rotate={-1}>
        <Card w={800} pad={22}>
          <Row at={c.Unterschied} e="🍦" text="Lisa: Eis → Italiener" right="besser" color={GREEN} />
          <Row at={c.Unterschied + 0.3} e="🥩" text="Sofia: Steak → Italiener" right="schlechter" color={RED} />
          <Row at={c.Anfang} e="📍" text="Zählt nur der Abstand zum Anfang" color={INK} />
        </Card>
      </Sticker>

      {/* KI-Projekte als Flop */}
      <SerifTitle from={c.Genau - 0.1} to={c.Firma - 0.05} x={0} y={150} align="center" size={96} ink lines={[{ text: "Deshalb gelten so viele" }, { text: "KI-Projekte als Flop", italic: true }]} />

      {/* Firma A */}
      <Sticker from={c.Firma - 0.1} to={c.nebenan - 0.05} x={540} y={330} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={820} pad={24}>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 4, borderBottom: "2px solid #EFEFEF" }}>🏢 Firma A · KI-Projekt</div>
            <Row at={c.Firma + 0.4} e="📣" text="Versprochen beim Start" right="−50 % Kosten" color={INK} />
            <Row at={c.Ende} e="📊" text="Gespart am Ende" right="−20 % Kosten" color={GREEN} />
          </Card>
          <Draw at={c.Fuenftel + 0.1} w={320} h={140} d={CIRCLE} style={{ left: 510, top: 112, transform: "scale(0.9,0.6)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>
      <Sticker from={c.Chef - 0.05} to={c.nebenan - 0.05} x={860} y={950} rotate={4}>
        <Photo img="chef" label="Chef: enttäuscht" />
      </Sticker>

      {/* Firma B */}
      <Sticker from={c.nebenan - 0.1} to={c.Max2 - 0.05} x={540} y={330} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={820} pad={24}>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 4, borderBottom: "2px solid #EFEFEF" }}>🏢 Firma nebenan · KI-Projekt</div>
            <Row at={c.nichts} e="🤐" text="Versprochen beim Start" right="nichts" color={INK} />
            <Row at={c.dasselbe} e="📊" text="Gespart am Ende" right="−20 % Kosten" color={GREEN} />
          </Card>
          <Draw at={c.Fuenftel2 + 0.1} w={320} h={140} d={CIRCLE} style={{ left: 528, top: 140, transform: "scale(0.9,0.6)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>
      <Sticker from={c.Sekt - 0.05} to={c.Max2 - 0.05} x={860} y={950} rotate={-4}>
        <Photo img="sekt" label="Dort: Sekt" />
      </Sticker>

      {/* Pointe */}
      <SerifTitle from={c.Max2 - 0.1} to={seconds + 1} x={0} y={150} align="center" size={100} ink lines={[{ text: "Max hat gelernt", at: c.Max2 - 0.1 }, { text: "Date 1 = Eis", italic: true, at: c.Erstes - 0.1 }]} />
      <Sticker from={c.Max2 - 0.05} to={c.Erstes - 0.05} x={860} y={880} rotate={-3}>
        <Photo img="max" label="Max" />
      </Sticker>
      <Sticker from={c.Erstes - 0.05} to={seconds + 1} x={860} y={900} rotate={4}>
        <Photo img="eis" label="Date 1, ab jetzt immer" />
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
