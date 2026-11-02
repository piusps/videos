import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, WordCaptions } from "../components/SatireKit";
import { fonts } from "../theme";

// Satire reel "Fünf Tische" (gpt-gruender-satire, GPT-S @florentgpt, 2026-10-06). Cap-backwards selfie
// look 57ae6dc3 on a light grey wall: dark ink titles, stickers in the top third (cap top ≈ y 600).
// c = cue seconds on the tightened timeline.
export type SatireTischeProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

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

const Booking: React.FC<{ name: string; e: string; at: number; strike?: number; tag?: string }> = ({ name, e, at, strike, tag }) => {
  const { t } = useSec();
  const o = interpolate(t, [at - 0.08, at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = strike !== undefined ? interpolate(t, [strike, strike + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "9px 4px", opacity: o * (1 - 0.45 * s), transform: `translateX(${(1 - o) * -16}px)`, fontFamily: fonts.semibold, fontSize: 34, color: INK }}>
      <span style={{ fontSize: 40 }}>{e}</span>
      <span style={{ flex: 1 }}>{name}</span>
      {tag && <span style={{ fontFamily: fonts.medium, fontSize: 24, color: "#8A8A8A" }}>{tag}</span>}
      <span style={{ color: GREEN, fontFamily: fonts.bold, fontSize: 30 }}>Sa 19:00 ✓</span>
      <div style={{ position: "absolute", left: 0, top: "50%", height: 5, width: `${s * 100}%`, background: RED, borderRadius: 3 }} />
    </div>
  );
};

const Photo: React.FC<{ img: string; w?: number; label?: string }> = ({ img, w = 330, label }) => (
  <div style={{ width: w, padding: 10, paddingBottom: label ? 8 : 10, background: "#fff", borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
    <Img src={staticFile(`gpts-fuenf-tische/img/${img}.png`)} style={{ width: w - 20, height: (w - 20) * 1.25, objectFit: "cover", borderRadius: 14, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: 28, color: INK, padding: "8px 4px 2px" }}>{label}</div>}
  </div>
);

export const SatireTische: React.FC<SatireTischeProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.bevor - 0.05 ? 1.12 : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "38% 48%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail */}
      <SerifTitle from={0} to={c.fuenf - 0.05} x={0} y={150} align="center" size={96} ink lines={[{ text: "Ich bin schuld," }, { text: "dass du samstags" }, { text: "keinen Tisch kriegst", italic: true }]} />
      <Sticker from={c.eine - 0.05} to={c.fuenf - 0.05} x={860} y={860} rotate={5}>
        <Photo img="her1" label="sie, Sa 19:00" />
      </Sticker>

      {/* Ihre KI reserviert fünf */}
      <Sticker from={c.fuenf - 0.1} to={c.Option - 0.05} x={540} y={330} rotate={-1}>
        <Card w={860} pad={24}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 10, marginBottom: 6, borderBottom: "2px solid #EFEFEF" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#111", color: "#fff", display: "grid", placeItems: "center", fontSize: 24 }}>🤖</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, flex: 1 }}>Ihre KI · Reservierungen</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, color: RED }}>5</div>
          </div>
          <Booking name="Italiener" e="🍝" at={c.Italiener} />
          <Booking name="Koreaner" e="🥢" at={c.Koreaner} />
          <Booking name="Weinbar" e="🍷" at={c.Weinbar} />
          <Booking name="Grieche" e="🫒" at={c.Griechen} tag="Tisch 1" />
          <Booking name="Grieche" e="🫒" at={c.Griechen + 0.35} tag="Tisch 2" />
        </Card>
      </Sticker>

      <Sticker from={c.Italiener - 0.05} to={c.Koreaner - 0.05} x={870} y={880} rotate={4}>
        <Photo img="italiener" label="Italiener" />
      </Sticker>
      <Sticker from={c.Koreaner - 0.05} to={c.Weinbar - 0.05} x={870} y={880} rotate={-3}>
        <Photo img="koreaner" label="Koreaner" />
      </Sticker>
      <Sticker from={c.Weinbar - 0.05} to={c.Griechen - 0.05} x={870} y={880} rotate={5}>
        <Photo img="weinbar" label="Weinbar" />
      </Sticker>
      <Sticker from={c.Griechen - 0.05} to={c.Option - 0.05} x={870} y={880} rotate={-4}>
        <Photo img="grieche" label="Grieche ×2" />
      </Sticker>

      {/* Kostenlose Option */}
      <SerifTitle from={c.Option - 0.1} to={c.sieben - 0.05} x={0} y={150} align="center" size={112} ink lines={[{ text: "Kostenlose" }, { text: "Option", italic: true }]} />
      <Sticker from={c.zahlst - 0.05} to={c.sieben - 0.05} x={540} y={470}>
        <Card w={520} pad={20} style={{ textAlign: "center" }}>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "#8A8A8A" }}>Preis fürs Absagen</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 84, color: GREEN, letterSpacing: -2 }}>0,00 €</div>
        </Card>
      </Sticker>

      {/* Um sieben entscheidet sie sich */}
      <Sticker from={c.sieben - 0.1} to={c.Italiener2 - 0.05} x={540} y={330} rotate={-1}>
        <Card w={860} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 6 }}>Samstag 19:00</div>
          <Booking name="Italiener" e="🍝" at={0} strike={c.Vier} />
          <Booking name="Koreaner" e="🥢" at={0} />
          <Booking name="Weinbar" e="🍷" at={0} strike={c.Vier + 0.12} />
          <Booking name="Grieche" e="🫒" at={0} tag="Tisch 1" strike={c.Vier + 0.24} />
          <Booking name="Grieche" e="🫒" at={0} tag="Tisch 2" strike={c.Vier + 0.36} />
        </Card>
      </Sticker>
      <Sticker from={c.sieben - 0.05} to={c.Vier - 0.05} x={860} y={880} rotate={4}>
        <Photo img="her2" />
      </Sticker>
      <Sticker from={c.spontan - 0.05} to={c.Vier - 0.05} x={820} y={1130} rotate={3}>
        <Bubble text="Lass Koreaner 😋" me size={40} />
      </Sticker>
      <Sticker from={c.leer - 0.05} to={c.Italiener2 - 0.05} x={760} y={700} rotate={3}>
        <div style={{ fontSize: 80, whiteSpace: "nowrap" }}>🪑🪑🪑🪑</div>
      </Sticker>

      {/* Anzahlung */}
      <Sticker from={c.Italiener2 - 0.1} to={c.gebaut - 0.05} x={540} y={400} rotate={1.5}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={720} pad={26}>
            <div style={{ fontFamily: fonts.medium, fontSize: 24, color: "#8A8A8A", letterSpacing: 1 }}>DA LUIGI · RESERVIERUNG</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, lineHeight: 1.2, marginTop: 8, color: INK }}>Anzahlung pro Person</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 96, color: INK, letterSpacing: -3 }}>20,00 €</div>
          </Card>
          <Draw at={c.zwanzig} w={400} h={130} d="M30 65 C 30 5, 380 0, 390 55 C 400 125, 50 130, 18 78 C 6 50, 60 24, 130 20" style={{ left: 0, top: 128 }} />
        </div>
      </Sticker>

      {/* Hab ich gebaut */}
      <SerifTitle from={c.gebaut - 0.1} to={c.bevor - 0.05} x={0} y={150} align="center" size={108} ink lines={[{ text: "Die KI dahinter?" }, { text: "Hab ich gebaut.", italic: true }]} />
      <Sticker from={c.Gratis - 0.05} to={c.bevor - 0.05} x={540} y={480} rotate={-3}>
        <div style={{ position: "relative", display: "inline-block", padding: "18px 40px", borderRadius: 999, background: "#111", color: "#fff", fontFamily: fonts.bold, fontSize: 48, boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
          Gratis-Abo 🙃
        </div>
      </Sticker>

      {/* Ertappt */}
      <Sticker from={c.drei - 0.1} to={seconds + 1} x={540} y={360} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={26}>
            <div style={{ fontFamily: fonts.medium, fontSize: 24, color: "#8A8A8A", letterSpacing: 1 }}>GRIECHE · TISCH 3 · SA 19:00</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, marginTop: 8, color: INK }}>2 Personen</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 40, color: INK }}>Begleitung: <span style={{ fontFamily: fonts.bold }}>du</span></div>
          </Card>
          <Draw at={c.Begleitung} w={200} h={110} d="M20 50 C 20 0, 180 -5, 185 45 C 190 100, 30 105, 12 60" style={{ left: 200, top: 110 }} />
        </div>
      </Sticker>
      <Sticker from={c.Gefragt - 0.05} to={seconds + 1} x={540} y={620}>
        <div style={{ fontFamily: fonts.bold, fontSize: 40, color: RED, background: "#fff", padding: "10px 26px", borderRadius: 14, boxShadow: "0 12px 30px rgba(0,0,0,0.2)" }}>gefragt: ✕ nein</div>
      </Sticker>

      <Sticker from={c.Gefragt - 0.05} to={seconds + 1} x={870} y={900} rotate={5}>
        <Photo img="her1" w={280} />
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
