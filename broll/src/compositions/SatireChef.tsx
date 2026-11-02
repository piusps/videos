import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, MailHead, Note, SerifTitle, serifItalic, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Satire reel "Dein Chef nach dem KI-Kurs" (ki-satire B-002, FP-S, 2026-10-02), satire edit style,
// first video in the seated look with the white wall (f4f3ac11…). The wall is bright, so titles and
// notes use dark ink; stickers stay above the head (head top ≈ y 750, face centre ≈ x 540, y 830).
// c = cue seconds on the tightened timeline, keyed by the spoken word.
export type SatireChefProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const GREY = "#8A8A8A";
const RED = "#E5484D";

const Typed: React.FC<{ text: string; from: number; dur: number; style?: React.CSSProperties }> = ({ text, from, dur, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <span style={style}>{text.slice(0, Math.round(text.length * p))}</span>;
};

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Person: React.FC<{ name: string; emoji: string; crossAt?: number; boss?: boolean }> = ({ name, emoji, crossAt, boss }) => (
  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 150 }}>
    <div style={{ width: 92, height: 92, borderRadius: 46, background: boss ? "#FFE7A3" : "#EEF1F6", display: "grid", placeItems: "center", fontSize: 54 }}>{emoji}</div>
    <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: INK, whiteSpace: "nowrap" }}>{name}</div>
    {crossAt !== undefined ? <Draw at={crossAt} w={110} h={110} d="M10 10 L100 100 M100 10 L10 100" style={{ left: 20, top: -4 }} /> : null}
  </div>
);

export const SatireChef: React.FC<SatireChefProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  // One hard punch-in right before the punchline ("Sie will lieber ihn").
  const punch = t >= c.Sie - 0.05 ? 1.12 : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "50% 44%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail, visible from frame 0 */}
      <SerifTitle from={0} to={c.Nachmittag - 0.05} x={0} y={170} align="center" size={128} ink lines={[{ text: "Dein Chef" }, { text: "nach dem KI-Kurs", italic: true }]} />
      <Sticker from={0} to={c.Nachmittag - 0.05} x={540} y={470}>
        <div style={{ padding: "10px 26px", borderRadius: 40, background: INK, color: "#fff", fontFamily: fonts.bold, fontSize: 34, letterSpacing: 1 }}>TEIL 1</div>
      </Sticker>

      {/* "Einen Nachmittag lang." → the certificate */}
      <Sticker from={c.Nachmittag - 0.15} to={c.Seitdem1 - 0.05} x={540} y={400} rotate={-3}>
        <Card w={700} pad={30} style={{ textAlign: "center", border: "6px double #C9A227" }}>
          <div style={{ fontSize: 64 }}>🎓</div>
          <div style={{ fontFamily: serifItalic, fontSize: 58, color: INK }}>Zertifikat</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, marginTop: 4 }}>Zertifizierter KI-Experte</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: GREY, marginTop: 10 }}>Dauer: 4 Stunden (inkl. Mittagspause)</div>
        </Card>
      </Sticker>

      {/* "Seitdem ist alles anders." → new job title */}
      <Sticker from={c.Seitdem1 - 0.05} to={c.R2 - 0.05} x={540} y={420} rotate={2}>
        <Card w={720} pad={26}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: "#FFE7A3", display: "grid", placeItems: "center", fontSize: 46 }}>👔</div>
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 34 }}>Thomas (Chef)</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: "#0A66C2" }}>Chief AI Visionary 🚀</div>
            </div>
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 24, color: GREY, marginTop: 14 }}>seit gestern, 16:30 Uhr</div>
        </Card>
      </Sticker>

      {/* Runde 1: die Mails */}
      <SerifTitle from={c.R2} to={c.Mail - 0.25} x={0} y={170} align="center" size={110} ink lines={[{ text: "1." }, { text: "Die Mails", italic: true }]} />
      <Sticker from={c.Mail - 0.2} to={c.R3 - 0.05} x={540} y={420} rotate={-1.5}>
        <Card w={760}>
          <MailHead from="Thomas (Chef)" subject="Abmahnung" />
          <div style={{ fontSize: 34, lineHeight: 1.4 }}>
            <Typed text="Gerne! 😊" from={c.gerne - 0.05} dur={0.4} style={{ fontFamily: fonts.bold, background: "#FFF1B8", borderRadius: 6 }} />
            <br />
            <Typed text="Hiermit mahnen wir Sie ab." from={c.Abmahnung - 0.1} dur={0.5} />
          </div>
        </Card>
      </Sticker>
      <Note from={c.Abmahnung + 0.25} to={c.R3 - 0.05} x={740} y={150} text="sehr gerne sogar" color={INK} size={48} d="M60 10 C 40 50, 30 70, 20 110" />

      {/* Runde 2: die Meetings */}
      <SerifTitle from={c.R3} to={c.Meeting - 0.25} x={0} y={170} align="center" size={110} ink lines={[{ text: "2." }, { text: "Die Meetings", italic: true }]} />
      <Sticker from={c.Meeting - 0.2} to={c.Keiner - 0.05} x={540} y={420}>
        <div style={{ width: 760, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
          <Card w={360} pad={18} style={{ fontFamily: fonts.bold, fontSize: 28 }}>📅 Weekly · Mo 9:00</Card>
          <Bubble text="Da setzen wir einen Agenten drauf." size={40} />
        </div>
      </Sticker>
      <Sticker from={c.Agenten - 0.05} to={c.Keiner - 0.05} x={880} y={200} rotate={10}>
        <div style={{ fontSize: 140 }}>🕵️</div>
      </Sticker>
      <Sticker from={c.Keiner - 0.05} to={c.Er - 0.05} x={540} y={400}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 110, lineHeight: 1 }}>🤷‍♀️🤷🤷‍♂️</div>
          <div style={{ fontFamily: serifItalic, fontSize: 56, color: INK, marginTop: 8 }}>das Team</div>
        </div>
      </Sticker>
      <Sticker from={c.Er - 0.05} to={c.R4 - 0.05} x={540} y={400}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 150, lineHeight: 1 }}>🤷‍♂️</div>
          <div style={{ fontFamily: serifItalic, fontSize: 56, color: INK, marginTop: 8 }}>Thomas</div>
        </div>
      </Sticker>

      {/* Runde 3: die Strategie */}
      <SerifTitle from={c.R4} to={c.alle - 0.25} x={0} y={170} align="center" size={110} ink lines={[{ text: "3." }, { text: "Die Strategie", italic: true }]} />
      <Sticker from={c.alle - 0.2} to={c.Ich - 0.05} x={540} y={420}>
        <Card w={800} pad={26}>
          <div style={{ fontFamily: fonts.bold, fontSize: 30, marginBottom: 16 }}>Organigramm 2027</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Person name="Anna" emoji="👩‍💼" crossAt={c.ersetzen - 0.1} />
            <Person name="Jens" emoji="🧑‍💻" crossAt={c.ersetzen + 0.05} />
            <Person name="Mehmet" emoji="👨‍🔧" crossAt={c.ersetzen + 0.2} />
            <Person name="Thomas" emoji="👔" boss />
          </div>
        </Card>
      </Sticker>

      {/* "Ich hab die KI gefragt. Sie will lieber ihn." */}
      <Sticker from={c.Ich - 0.05} to={c.Schreibt + 0.85} x={540} y={420}>
        <div style={{ width: 800, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ alignSelf: "flex-end" }}><Bubble text="Wen sollen wir durch KI ersetzen?" me size={36} /></div>
          {t >= c.Sie - 0.1 ? (
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: "#D97757", display: "grid", placeItems: "center", color: "#fff", fontFamily: fonts.bold, fontSize: 30 }}>✳</div>
              <Bubble text={"Ihn. 👔".slice(0, t >= c.ihn - 0.05 ? 7 : 0) || "…"} size={56} />
            </div>
          ) : null}
        </div>
      </Sticker>

      {/* CTA */}
      <SerifTitle from={c.Schreibt + 0.9} to={seconds + 1} x={0} y={170} align="center" size={96} ink lines={[{ text: "Was macht euer Chef" }, { text: "seit dem Kurs?", italic: true }]} />
      <Sticker from={c.Anonym - 0.05} to={seconds + 1} x={540} y={470}>
        <div style={{ padding: "12px 28px", borderRadius: 40, background: "#fff", fontFamily: fonts.bold, fontSize: 36, color: INK, boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}>🕶 anonym</div>
      </Sticker>
      <Sticker from={c.liest - 0.05} to={seconds + 1} x={820} y={600} rotate={-8}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 96, lineHeight: 1 }}>👀</div>
          <div style={{ fontFamily: serifItalic, fontSize: 44, color: INK, whiteSpace: "nowrap" }}>Thomas liest mit</div>
        </div>
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
