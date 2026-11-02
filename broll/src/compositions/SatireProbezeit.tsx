import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Card, Note, SerifTitle, serifItalic, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Satire reel "Die KI in der Probezeit" (ki-satire B-014, FP-S, 2026-10-04), white-wall seated look:
// dark ink titles, stickers above the head (head top ≈ y 750). c = cue seconds on the tightened timeline.
// Engagement mechanism A3 (Markier-Pointe): the last line describes the under-challenged colleague.
export type SatireProbezeitProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#2E9E5B";

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

const Row: React.FC<{ on: boolean; icon: string; text: string; mark: string; color: string }> = ({ on, icon, text, mark, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 6px", opacity: on ? 1 : 0, transform: `translateY(${on ? 0 : 8}px)`, fontFamily: fonts.semibold, fontSize: 36, color: INK }}>
    <span style={{ fontSize: 44 }}>{icon}</span>
    <span style={{ flex: 1 }}>{text}</span>
    <span style={{ color, fontFamily: fonts.bold, fontSize: 40 }}>{mark}</span>
  </div>
);

export const SatireProbezeit: React.FC<SatireProbezeitProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Die - 0.05 ? 1.12 : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "50% 44%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.Seit - 0.05} x={0} y={170} align="center" size={118} ink lines={[{ text: "Die KI in deiner Firma" }, { text: "langweilt sich", italic: true }]} />
      <Sticker from={0} to={c.Seit - 0.05} x={540} y={500}>
        <div style={{ fontSize: 120 }}>🥱🤖</div>
      </Sticker>

      {/* Seit drei Monaten … einmal benutzt */}
      <Sticker from={c.Seit - 0.1} to={c.Geburtstagskarte - 0.05} x={540} y={430} rotate={-1.5}>
        <Card w={700} pad={26}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 80 }}>🪑</div>
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 38, color: INK }}>KI · Probezeit</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "#8A8A8A" }}>Tag 92 im Unternehmen</div>
            </div>
          </div>
          <div style={{ fontFamily: fonts.bold, fontSize: 44, color: RED, marginTop: 16, opacity: t >= c.Benutzt - 0.1 ? 1 : 0 }}>Genutzt: 1×</div>
        </Card>
      </Sticker>
      <Sticker from={c.Geburtstagskarte - 0.1} to={c.Dabei - 0.05} x={540} y={420} rotate={3}>
        <Card w={640} pad={30} style={{ textAlign: "center", background: "#FFF4E8", border: "6px double #E8A33D" }}>
          <div style={{ fontSize: 70 }}>🎂🎈🎉</div>
          <div style={{ fontFamily: serifItalic, fontSize: 64, color: INK }}>Alles Gute!</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: INK, opacity: t >= c.Chef - 0.1 ? 1 : 0 }}>Für den Chef 👔</div>
        </Card>
      </Sticker>

      {/* Was sie alles könnte */}
      <Sticker from={c.Dabei - 0.1} to={c.Aber - 0.05} x={540} y={470}>
        <Card w={720} pad={22}>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "#8A8A8A", letterSpacing: 1, margin: "0 0 6px 6px" }}>KANN SIE</div>
          <Row on={t >= c.Vertraege - 0.1} icon="📄" text="Verträge prüfen" mark="✓" color={GREEN} />
          <Row on={t >= c.Angebote - 0.1} icon="✍️" text="Angebote schreiben" mark="✓" color={GREEN} />
          <Row on={t >= c.Tabellen - 0.1} icon="📊" text="Tabellen auswerten" mark="✓" color={GREEN} />
        </Card>
      </Sticker>

      {/* Darf sie */}
      <Sticker from={c.Aber - 0.1} to={c.Datenschutz - 0.05} x={540} y={450} rotate={-1}>
        <Card w={720} pad={22}>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "#8A8A8A", letterSpacing: 1, margin: "0 0 6px 6px" }}>ZUGRIFF</div>
          <Row on icon="🔒" text="Alle Ordner" mark="✕" color={RED} />
          <Row on={t >= c.Nur - 0.1} icon="🍛" text="Speiseplan Kantine" mark="✓" color={GREEN} />
          <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "#8A8A8A", margin: "4px 0 0 68px", opacity: t >= c.Nur + 0.6 ? 1 : 0 }}>Mittwoch: Currywurst</div>
        </Card>
      </Sticker>

      {/* Datenschutz */}
      <Sticker from={c.Datenschutz - 0.1} to={c.jetzt - 0.05} x={540} y={430} rotate={-6}>
        <div style={{ padding: "18px 34px", border: `8px solid ${GREEN}`, borderRadius: 18, color: GREEN, fontFamily: fonts.bold, fontSize: 56, background: "rgba(255,255,255,0.92)" }}>
          DATENSCHUTZ GEPRÜFT {t >= c.zweimal - 0.05 ? "✓✓" : "✓"}
        </div>
      </Sticker>
      <Sticker from={c.sauber - 0.1} to={c.jetzt - 0.05} x={820} y={190} rotate={8}>
        <div style={{ fontSize: 110 }}>✨🧼</div>
      </Sticker>
      <Note from={c.angefasst - 0.05} to={c.jetzt - 0.05} x={150} y={600} text="nie was angefasst" color={INK} size={46} d="M40 10 C 60 40, 70 60, 90 95" />

      {/* Mitarbeitergespräch */}
      <SerifTitle from={c.jetzt} to={c.Ueber - 0.05} x={0} y={150} align="center" size={104} ink lines={[{ text: "Das" }, { text: "Mitarbeitergespräch", italic: true }]} />
      <Sticker from={c.Mitarbeitergespraech - 0.1} to={c.Ueber - 0.05} x={540} y={480}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={700} pad={24}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "#8A8A8A", letterSpacing: 1 }}>FEEDBACKBOGEN · KI</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 34, color: INK, marginTop: 12 }}>
              <span>Fachwissen</span><span style={{ color: GREEN }}>sehr gut</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 34, color: INK, marginTop: 10, opacity: t >= c.Eigeninitiative - 0.1 ? 1 : 0 }}>
              <span>Eigeninitiative</span><span style={{ color: RED }}>ausbaufähig</span>
            </div>
          </Card>
          <Draw at={c.Eigeninitiative + 0.3} w={360} h={110} d="M60 40 C 70 -10, 340 -10, 350 45 C 360 100, 70 110, 40 60 C 30 40, 70 20, 120 18" style={{ left: 340, top: 70 }} />
        </div>
      </Sticker>

      {/* Pointe */}
      <Sticker from={c.Ueber - 0.1} to={seconds + 1} x={540} y={470}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ padding: "12px 30px", borderRadius: 40, background: INK, color: "#fff", fontFamily: fonts.bold, fontSize: 46 }}>Überqualifiziert</div>
          <div style={{ padding: "12px 30px", borderRadius: 40, background: RED, color: "#fff", fontFamily: fonts.bold, fontSize: 46, opacity: t >= c.unterfordert - 0.1 ? 1 : 0 }}>Unterfordert</div>
        </div>
      </Sticker>
      <SerifTitle from={c.Die - 0.05} to={seconds + 1} x={0} y={150} align="center" size={96} ink lines={[{ text: "Passt bei euch" }, { text: "gut rein", italic: true }]} />

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
