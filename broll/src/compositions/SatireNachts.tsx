import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, serifItalic, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Satire reel "Die Firma schreibt dir nachts" (ki-satire B-026, FP-S, 2026-10-03), white-wall seated
// look: dark ink titles, stickers above the head (head top ≈ y 750). c = cue seconds on the tightened timeline.
// Fact behind the joke: heise.de, "Arbeitslos wegen KI? Laut einer Studie holen Unternehmen ihre
// Mitarbeiter zurück" (Visier-Analyse), shown as a small source card.
export type SatireNachtsProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Notification: React.FC<{ lines: { text: string; at: number }[] }> = ({ lines }) => {
  const { t } = useSec();
  return (
    <div style={{ width: 800, padding: "26px 30px", borderRadius: 34, background: "rgba(245,245,247,0.96)", boxShadow: "0 18px 44px rgba(0,0,0,0.28)", fontFamily: fonts.medium, color: "#1C1C1C" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "#2F80ED", display: "grid", placeItems: "center", fontSize: 32 }}>💼</div>
        <div style={{ fontFamily: fonts.bold, fontSize: 32, flex: 1 }}>Deine Ex-Firma</div>
        <div style={{ fontSize: 26, color: "#8A8A8A" }}>02:00</div>
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{ fontSize: 36, lineHeight: 1.35, opacity: t >= l.at ? 1 : 0, transform: `translateY(${t >= l.at ? 0 : 8}px)` }}>{l.text}</div>
      ))}
    </div>
  );
};

export const SatireNachts: React.FC<SatireNachtsProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Aber - 0.05 ? 1.12 : 1;
  const listItems: { at: number; e: string; text: string }[] = [
    { at: c.redet, e: "🗣", text: "redet viel" },
    { at: c.erfindet, e: "🤥", text: "erfindet Sachen" },
    { at: c.kennt, e: "🤷", text: "kennt keinen einzigen Kunden" },
  ];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "50% 44%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.nachts - 0.05} x={0} y={170} align="center" size={112} ink lines={[{ text: "Deine Firma hat dich" }, { text: "für eine KI verlassen", italic: true }]} />
      <Sticker from={c.KI1 - 0.05} to={c.nachts - 0.05} x={540} y={480}>
        <div style={{ fontSize: 120 }}>💔🤖</div>
      </Sticker>

      {/* 2 Uhr nachts */}
      <Sticker from={c.nachts - 0.05} to={c.Hey - 0.05} x={540} y={420}>
        <div style={{ textAlign: "center", padding: "26px 60px", borderRadius: 40, background: "#111", color: "#fff", boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
          <div style={{ fontFamily: fonts.medium, fontSize: 30, opacity: 0.7 }}>Samstag</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 150, lineHeight: 1, letterSpacing: -4 }}>2:00</div>
        </div>
      </Sticker>
      <Sticker from={c.Hey - 0.1} to={c.Die - 0.05} x={540} y={420} rotate={-1.5}>
        <Notification lines={[{ text: "Hey. Bist du noch wach? 👀", at: c.Hey - 0.1 }, { text: "Wie geht's dir so? 🥺", at: c.Wie - 0.1 }]} />
      </Sticker>

      {/* Was mit der KI schiefging */}
      <SerifTitle from={c.Die - 0.05} to={c.jetzt - 0.05} x={0} y={150} align="center" size={96} ink lines={[{ text: "Die KI" }, { text: "war doch nicht so toll", italic: true }]} />
      <Sticker from={c.redet - 0.1} to={c.jetzt - 0.05} x={540} y={520}>
        <Card w={720} pad={22}>
          {listItems.map((it) => (
            <div key={it.text} style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 6px", opacity: t >= it.at - 0.1 ? 1 : 0.0, fontFamily: fonts.semibold, fontSize: 36, color: INK }}>
              <span style={{ fontSize: 44 }}>{it.e}</span>
              <span style={{ flex: 1 }}>{it.text}</span>
              <span style={{ color: RED, fontFamily: fonts.bold, fontSize: 40 }}>✕</span>
            </div>
          ))}
        </Card>
      </Sticker>

      {/* Und jetzt kommt's: das passiert wirklich */}
      <Sticker from={c.passiert - 0.1} to={c.Mein - 0.05} x={540} y={430} rotate={1.5}>
        <Card w={760} pad={26}>
          <div style={{ fontFamily: fonts.medium, fontSize: 24, color: "#8A8A8A", letterSpacing: 1 }}>NEWS · QUELLE: HEISE.DE</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 40, lineHeight: 1.2, marginTop: 8, color: INK }}>Arbeitslos wegen KI? Firmen holen ihre Leute zurück.</div>
        </Card>
      </Sticker>
      <Sticker from={c.Firmen - 0.05} to={c.Mein - 0.05} x={880} y={190} rotate={10}>
        <div style={{ fontSize: 120 }}>🔙</div>
      </Sticker>

      {/* Mein Rat */}
      <SerifTitle from={c.Mein - 0.05} to={seconds + 1} x={0} y={150} align="center" size={110} ink lines={[{ text: "Mein Rat:" }, { text: "Geh ran.", italic: true, at: c.Geh - 0.05 }]} />
      <Sticker from={c.Aber - 0.1} to={seconds + 1} x={540} y={500}>
        <div style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
          <Bubble text="Gerne. Für 20 % mehr. 💸" me size={50} />
          <Draw at={c.zwanzig} w={700} h={150} d="M40 70 C 40 0, 690 -5, 700 62 C 710 140, 50 150, 22 82 C 12 50, 80 18, 160 14" style={{ left: -50, top: -32 }} />
        </div>
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
