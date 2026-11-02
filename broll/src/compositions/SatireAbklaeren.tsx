import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Card, SerifTitle, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Gruender-Satire "aerztlich abklaeren" (GPT-S @florentgpt, 2026-10-09). Defensive Medizin, Chatbot-Edition.
// Copy of SatireAnker, content swapped. c = cue seconds on the tightened timeline.
export type SatireAbklaerenProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREY = "#8A8A8A";
const CIRCLE = "M 20 60 C 10 15, 120 0, 200 8 C 290 16, 320 60, 300 95 C 275 135, 90 140, 35 110 C 5 92, 15 55, 60 35";

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={w} height={h} viewBox="0 0 320 140" preserveAspectRatio="none" style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={p > 0 ? 6 : 0} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const useFade = (at: number) => {
  const { t } = useSec();
  return interpolate(t, [at - 0.08, at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const Row: React.FC<{ at: number; e: string; text: string; right?: string; color?: string }> = ({ at, e, text, right, color = INK }) => {
  const o = useFade(at);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "9px 4px", opacity: o, transform: `translateX(${(1 - o) * -16}px)`, fontFamily: fonts.semibold, fontSize: 36, color: INK }}>
      <span style={{ fontSize: 40 }}>{e}</span>
      <span style={{ flex: 1 }}>{text}</span>
      {right && <span style={{ color, fontFamily: fonts.bold, fontSize: 32 }}>{right}</span>}
    </div>
  );
};

const Head: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 4, borderBottom: "2px solid #EFEFEF" }}>{children}</div>
);

// Chat mockup: user sends a photo, the bot answer types in, last sentence circled.
const Chat: React.FC<{ head: string; photo: string; q: string; aAt: number; pre: string; circleAt: number }> = ({ head, photo, q, aAt, pre, circleAt }) => {
  const o = useFade(aAt);
  const ob = useFade(circleAt - 0.25);
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Card w={820} pad={24}>
        <Head>{head}</Head>
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, marginTop: 10 }}>
          <div style={{ width: 92, height: 92, borderRadius: 18, background: "#F3E3DA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54 }}>{photo}</div>
          <div style={{ background: "#F0F0F0", borderRadius: 22, padding: "14px 20px", fontFamily: fonts.medium, fontSize: 32, color: INK, maxWidth: 560 }}>{q}</div>
        </div>
        <div style={{ opacity: o, marginTop: 16, fontFamily: fonts.medium, fontSize: 32, color: INK, lineHeight: 1.3 }}>
          {pre} <span style={{ fontFamily: fonts.bold, opacity: ob, display: "block", marginTop: pre ? 6 : 0 }}>Bitte lass das ärztlich abklären.</span>
        </div>
      </Card>
      <Draw at={circleAt} d={CIRCLE} w={560} h={110} style={{ left: 10, bottom: 2 }} />
    </div>
  );
};

const Emoji: React.FC<{ e: string; label?: string }> = ({ e, label }) => (
  <div style={{ width: 230, padding: 14, background: "#fff", borderRadius: 26, boxShadow: "0 18px 44px rgba(0,0,0,0.3)", textAlign: "center" }}>
    <div style={{ fontSize: 120, lineHeight: 1.15 }}>{e}</div>
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 28, color: INK, paddingTop: 4 }}>{label}</div>}
  </div>
);

// Waiting room: 12 people pop in, the first one is the Kumpel.
const Wartezimmer: React.FC<{ at: number; elfAt: number; satzAt: number }> = ({ at, elfAt, satzAt }) => {
  const { t } = useSec();
  const people = ["🧑", "👩", "👨", "🧔", "👱‍♀️", "🧑‍🦱", "👩‍🦰", "👨‍🦲", "🧑‍🦰", "👩‍🦱", "👱", "🧓"];
  const so = useFade(satzAt);
  return (
    <Card w={820} pad={24}>
      <Head>🏥 Wartezimmer Hautarzt</Head>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginTop: 12 }}>
        {people.map((p, i) => {
          const s = i === 0 ? at : elfAt + (i - 1) * 0.06;
          const o = interpolate(t, [s - 0.05, s + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={i} style={{ fontSize: 66, textAlign: "center", opacity: o, transform: `scale(${0.6 + 0.4 * o})`, background: i === 0 ? "#FFF3D6" : "transparent", borderRadius: 16 }}>{p}</div>
          );
        })}
      </div>
      <div style={{ opacity: so, marginTop: 12, fontFamily: fonts.medium, fontSize: 30, color: GREY, textAlign: "center" }}>
        alle mit: <span style={{ color: INK, fontFamily: fonts.bold }}>„Bitte lass das ärztlich abklären.“</span>
      </div>
    </Card>
  );
};

export const SatireAbklaeren: React.FC<SatireAbklaerenProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Kumpel3 - 0.05 ? 1.12 : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "38% 48%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Egal - 0.05} x={0} y={150} align="center" size={104} ink lines={[{ text: "Bitte ärztlich" }, { text: "abklären", italic: true }]} />
      <Sticker from={c.Kumpel - 0.05} to={c.Egal - 0.05} x={860} y={900} rotate={4}>
        <Emoji e="🤳" label="dein Kumpel" />
      </Sticker>

      {/* Antwort endet immer gleich */}
      <Sticker from={c.Egal - 0.1} to={c.Aerzte - 0.05} x={540} y={380} rotate={-1}>
        <Chat head="ChatGPT" photo="🔴" q="Was ist das an meinem Kinn?" aAt={c.fotografiert} pre="Das sieht nach einem harmlosen Pickel aus." circleAt={c.Bitte + 0.15} />
      </Sticker>

      {/* Defensive Medizin */}
      <SerifTitle from={c.Aerzte - 0.1} to={c.Keiner - 0.05} x={0} y={130} align="center" size={110} ink lines={[{ text: "Defensive Medizin" }, { text: "lieber einmal zu viel", italic: true, at: c.Wer - 0.1 }]} />

      {/* Angst vor Aerger */}
      <Sticker from={c.Keiner - 0.1} to={c.Also - 0.05} x={540} y={380} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={780} pad={24}>
            <Head>Angst vor Ärger</Head>
            <Row at={c.Keiner} e="👨‍⚕️" text="Ärzte" right="hoch" />
            <Row at={c.Chatbot - 0.05} e="🤖" text="Chatbot" right="maximal" color={RED} />
          </Card>
          <Draw at={c.Chatbot + 0.3} d={CIRCLE} w={250} h={110} style={{ left: 530, top: 140 }} />
        </div>
      </Sticker>

      {/* Mueckenstich beim Hautarzt */}
      <Sticker from={c.Mueckenstich - 0.05} to={c.Neben - 0.05} x={860} y={900} rotate={-4}>
        <Emoji e="🦟" label="Mückenstich" />
      </Sticker>
      <Sticker from={c.Hautarzt - 0.1} to={c.Deshalb - 0.05} x={540} y={380} rotate={-1}>
        <Wartezimmer at={c.Hautarzt} elfAt={c.elf - 0.05} satzAt={c.Satz - 0.1} />
      </Sticker>

      {/* Termin im Maerz */}
      <Sticker from={c.Deshalb - 0.1} to={c.Praxen - 0.05} x={540} y={380} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={26} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1 }}>📅 HAUTARZT · ONLINE-BUCHUNG</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 32, color: INK, marginTop: 10 }}>Nächster freier Termin:</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 76, color: INK, letterSpacing: -2, marginTop: 2, opacity: interpolate(t, [c.Maerz - 0.08, c.Maerz + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>März</div>
          </Card>
          <Draw at={c.Maerz + 0.15} d={CIRCLE} w={300} h={120} style={{ left: 230, top: 125 }} />
        </div>
      </Sticker>

      {/* Vorsortier-Bot */}
      <Sticker from={c.Praxen - 0.1} to={c.Kumpel3 - 0.05} x={540} y={380} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={26} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, letterSpacing: 1 }}>NEU · FÜR PRAXEN</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 44, color: INK, marginTop: 8, opacity: useFade(c.verkauf) }}>🤖 Vorsortier-Bot</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 76, color: INK, letterSpacing: -2, marginTop: 4, opacity: useFade(c.Zwei) }}>2 € <span style={{ fontFamily: fonts.medium, fontSize: 34, letterSpacing: 0 }}>pro Anfrage</span></div>
          </Card>
          <Draw at={c.Zwei + 0.25} d={CIRCLE} w={200} h={110} style={{ left: 185, top: 118 }} />
        </div>
      </Sticker>

      {/* Pointe */}
      <SerifTitle from={c.Kumpel3 - 0.1} to={c.Antwort - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Der Test", at: c.Kumpel3 - 0.1 }, { text: "mit dem Pickel", italic: true, at: c.getestet - 0.3 }]} />
      <Sticker from={c.Kumpel3 - 0.05} to={seconds + 1} x={860} y={900} rotate={-3}>
        <Emoji e="🤳" label="dein Kumpel" />
      </Sticker>
      <Sticker from={c.Antwort - 0.1} to={seconds + 1} x={540} y={380} rotate={1}>
        <Chat head="🤖 Vorsortier-Bot · 2 €" photo="🔴" q="Was ist das an meinem Kinn?" aAt={c.Bitte3 - 0.1} pre="" circleAt={c.Bitte3 + 0.15} />
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
