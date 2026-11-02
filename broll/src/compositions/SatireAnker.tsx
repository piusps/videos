import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Gruender-Satire "achtundsechzigtausend" (GPT-S @florentgpt, 2026-10-08). Anker-Effekt beim Gehalt.
// Copy of SatireReferenzpunkt, content swapped. c = cue seconds on the tightened timeline.
export type SatireAnkerProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#1FA45A";
const CIRCLE = "M 20 60 C 10 15, 120 0, 200 8 C 290 16, 320 60, 300 95 C 275 135, 90 140, 35 110 C 5 92, 15 55, 60 35";

const Draw: React.FC<{ at: number; d: string; w: number; h: number; style?: React.CSSProperties }> = ({ at, d, w, h, style }) => {
  const { t } = useSec();
  const p = interpolate(t, [at, at + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={w} height={h} viewBox="0 0 320 140" preserveAspectRatio="none" style={{ position: "absolute", overflow: "visible", ...style }}>
      <path d={d} fill="none" stroke={RED} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const Photo: React.FC<{ img: string; w?: number; label?: string }> = ({ img, w = 330, label }) => (
  <div style={{ width: w, padding: 10, paddingBottom: label ? 8 : 10, background: "#fff", borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
    <Img src={staticFile(`gpts-achtundsechzigtausend/img/${img}.png`)} style={{ width: w - 20, height: (w - 20) * 1.25, objectFit: "cover", borderRadius: 14, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 28, color: INK, padding: "8px 4px 2px" }}>{label}</div>}
  </div>
);

const Row: React.FC<{ at: number; e: string; text: string; right?: string; color?: string }> = ({ at, e, text, right, color = GREEN }) => {
  const { t } = useSec();
  const o = interpolate(t, [at - 0.08, at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
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

const Chat: React.FC<{ q: string; aAt: number; a: string }> = ({ q, aAt, a }) => {
  const { t } = useSec();
  const o = interpolate(t, [aAt - 0.08, aAt + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Card w={820} pad={24}>
      <Head>ChatGPT</Head>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <div style={{ background: "#F0F0F0", borderRadius: 22, padding: "14px 20px", fontFamily: fonts.medium, fontSize: 32, color: INK, maxWidth: 620 }}>{q}</div>
      </div>
      <div style={{ opacity: o, marginTop: 16, fontFamily: fonts.medium, fontSize: 32, color: INK }}>
        Im Schnitt etwa <span style={{ fontFamily: fonts.bold, fontSize: 44 }}>{a}</span> brutto im Jahr.
      </div>
    </Card>
  );
};

export const SatireAnker: React.FC<SatireAnkerProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Kollege3 - 0.05 ? 1.12 : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "38% 48%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.gefragt - 0.05} x={0} y={150} align="center" size={96} ink lines={[{ text: "Dein Kollege und" }, { text: "die Zahl von ChatGPT", italic: true }]} />
      <Sticker from={c.Kollege - 0.05} to={c.Psychologen - 0.05} x={860} y={900} rotate={4}>
        <Photo img="kollege" label="dein Kollege" />
      </Sticker>

      {/* Frage an ChatGPT */}
      <Sticker from={c.gefragt - 0.1} to={c.Psychologen - 0.05} x={540} y={360} rotate={-1}>
        <Chat q="Was verdient man mit meinem Job in Köln?" aAt={c.achtund} a="68.000 €" />
      </Sticker>

      {/* Anker */}
      <SerifTitle from={c.Psychologen - 0.1} to={c.Bloed - 0.05} x={0} y={130} align="center" size={110} ink lines={[{ text: "Der Anker" }, { text: "die erste Zahl gewinnt", italic: true, at: c.erste - 0.1 }]} />

      {/* Chef fragt dasselbe */}
      <Sticker from={c.Chef - 0.05} to={c.Gespraech - 0.05} x={860} y={900} rotate={-4}>
        <Photo img="chef" label="sein Chef" />
      </Sticker>
      <Sticker from={c.dieselbe - 0.1} to={c.Gespraech - 0.05} x={540} y={360} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={800} pad={24}>
            <Head>Selbe Frage, selbe KI</Head>
            <Row at={c.dieselbe} e="🙋" text="Dein Kollege" right="68.000 €" color={INK} />
            <Row at={c.Gleiche} e="👔" text="Sein Chef" right="68.000 €" color={INK} />
          </Card>
          <Draw at={c.Gleiche + 0.25} d={CIRCLE} w={250} h={150} style={{ left: 560, top: 50 }} />
        </div>
      </Sticker>

      {/* Gespraech */}
      <Sticker from={c.Gespraech - 0.1} to={c.Seitdem - 0.05} x={540} y={360} rotate={-1}>
        <Card w={800} pad={24}>
          <Head>📅 Gehaltsgespräch</Head>
          <Row at={c.vier} e="⏱️" text="Dauer" right="4 Minuten" color={INK} />
          <Row at={c.erleichtert} e="😮‍💨" text="Beide" right="erleichtert" color={GREEN} />
        </Card>
      </Sticker>

      {/* Koeln */}
      <SerifTitle from={c.Seitdem - 0.1} to={c.verkauf - 0.05} x={0} y={130} align="center" size={100} ink lines={[{ text: "Ganz Köln" }, { text: "68.000 €", italic: true, at: c.achtund2 - 0.1 }]} />
      <Sticker from={c.besser - 0.1} to={c.verkauf - 0.05} x={540} y={520} rotate={-1}>
        <Card w={760} pad={22}>
          <Row at={c.besser - 0.05} e="🙂" text="Durchschnitt" right="68.000 €" color={INK} />
          <Row at={c.besser + 0.25} e="🚀" text="Die Besseren" right="68.000 €" color={RED} />
        </Card>
      </Sticker>

      {/* Chef-Version */}
      <Sticker from={c.verkauf - 0.1} to={c.Kollege3 - 0.05} x={540} y={360} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={26} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "#8A8A8A", letterSpacing: 1 }}>NEU · VERSION FÜR CHEFS</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 32, color: INK, marginTop: 10 }}>Erste Zahl im Raum:</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 76, color: INK, letterSpacing: -2, marginTop: 2 }}>60.000 €</div>
          </Card>
          <Draw at={c.sechzig + 0.15} d={CIRCLE} w={380} h={130} style={{ left: 190, top: 120 }} />
        </div>
      </Sticker>

      {/* Pointe */}
      <SerifTitle from={c.Kollege3 - 0.1} to={seconds + 1} x={0} y={150} align="center" size={100} ink lines={[{ text: "Er hat sie auch", at: c.Kollege3 - 0.1 }, { text: "Teamleiter seit Montag", italic: true, at: c.Montag - 0.1 }]} />
      <Sticker from={c.Kollege3 - 0.05} to={seconds + 1} x={860} y={900} rotate={-3}>
        <Photo img="kollege" label={t >= c.Montag - 0.05 ? "Teamleiter" : "dein Kollege"} />
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
