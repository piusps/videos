import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile } from "remotion";
import { Bubble, Card, MailHead, SerifTitle, Sticker, useSec, Word } from "../components/SatireKit";
import { fonts } from "../theme";

// FP-S "Daten, geschützt vor uns" (B-013, @florent_preusser, trial slot 2026-10-21 19:30), seated white-wall look f4f3ac11.
// Style: video-satire-edit (speaker full frame, stickers above the head, serif titles, one-word captions as an
// orange Claude pill at chest height per Henri 2026-10-12), flat UI mockups only, no logos, no emoji.
// Mechanism A3 (Markier-Pointe): "Jürgen" is the colleague every company has.
// c = cue seconds from runs/fps-daten-geschuetzt/mkcues.py (tightened timeline).
export type SatireDatenGeschuetztProps = {
  src: string;
  seconds: number;
  words: Word[];
  c: Record<string, number>;
};

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#1F7A47";
const GREY = "#8A8A8A";
const LINE = "#E6E6E2";
const ORANGE = "#D97757";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], clamp);

const Stamp: React.FC<{ at: number; text: string; size?: number; rot?: number }> = ({ at, text, size = 56, rot = -9 }) => {
  const { t } = useSec();
  const f = fade(t, at);
  return (
    <div style={{ transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * f})`, opacity: f, border: `7px solid ${RED}`, borderRadius: 16, padding: "6px 24px", color: RED, fontFamily: fonts.bold, fontSize: size, letterSpacing: 2, background: "rgba(255,255,255,0.94)", whiteSpace: "nowrap" }}>{text}</div>
  );
};

// Flat padlock (no logo)
const Lock: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s * 1.15} viewBox="0 0 100 115">
    <path d="M28 50 V34 a22 22 0 0 1 44 0 V50" fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
    <rect x="12" y="48" width="76" height="62" rx="14" fill={INK} />
    <circle cx="50" cy="74" r="8" fill="#fff" />
    <rect x="46" y="76" width="8" height="18" rx="4" fill="#fff" />
  </svg>
);

// Generic spreadsheet file chip (green grid, no Microsoft logo)
const SheetIcon: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 40 40">
    <rect x="2" y="2" width="36" height="36" rx="7" fill={GREEN} />
    {[14, 22, 30].map((y) => <rect key={y} x="8" y={y - 1} width="24" height="2" fill="#fff" opacity={0.85} />)}
    <rect x="17" y="8" width="2" height="24" fill="#fff" opacity={0.85} />
    <rect x="8" y="8" width="24" height="3" fill="#fff" />
  </svg>
);

const FileChip: React.FC<{ name: string; size?: number }> = ({ name, size = 30 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 14, border: `2px solid ${LINE}`, borderRadius: 14, padding: "10px 16px", background: "#fff", fontFamily: fonts.semibold, fontSize: size, color: INK }}>
    <SheetIcon s={size * 1.4} />
    {name}
  </div>
);

// Mini spreadsheet: a few rows that fill in
const Sheet: React.FC<{ at: number }> = ({ at }) => {
  const { t } = useSec();
  const rows = [["Kunde", "Umsatz", "Telefon"], ["Müller GmbH", "48.200", "0171 …"], ["Becker & Söhne", "31.900", "0152 …"], ["Hansen Bau", "27.400", "0160 …"]];
  return (
    <div style={{ border: `2px solid ${LINE}`, borderRadius: 10, overflow: "hidden", marginTop: 14 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", background: i === 0 ? "#EEF5F0" : "#fff", borderTop: i ? `2px solid ${LINE}` : "none", opacity: i === 0 ? 1 : fade(t, at + i * 0.12) }}>
          {r.map((cell, j) => (
            <div key={j} style={{ flex: j === 0 ? 1.6 : 1, padding: "8px 12px", borderLeft: j ? `2px solid ${LINE}` : "none", fontFamily: i === 0 ? fonts.bold : fonts.semibold, fontSize: 24, color: i === 0 ? GREEN : INK }}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

// One-word captions as orange Claude pill at chest height (Henri 2026-10-12, @florent_preusser)
const Captions: React.FC<{ words: Word[] }> = ({ words }) => {
  const { t } = useSec();
  const ms = t * 1000;
  const cur = words.find((w, i) => ms >= w.startMs && ms < (words[i + 1]?.startMs ?? w.endMs + 400));
  if (!cur) return null;
  return (
    <div style={{ position: "absolute", top: 1920 * 0.78, width: 1080, display: "flex", justifyContent: "center" }}>
      <div style={{ background: ORANGE, color: "#fff", borderRadius: 18, padding: "8px 26px", fontFamily: fonts.bold, fontSize: 56, letterSpacing: -0.5, boxShadow: "0 6px 16px rgba(0,0,0,0.18)" }}>{cur.text}</div>
    </div>
  );
};

export const SatireDatenGeschuetzt: React.FC<SatireDatenGeschuetztProps> = ({ src, seconds, words, c }) => {
  const { t } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  // exactly one hard punch-in: re-entry before the punchline ("Keiner weiß …")
  const punch = t >= c.Keiner - 0.05 ? 1.12 : 1;
  const k = drift * punch;

  return (
    <AbsoluteFill style={{ background: "#F2F1EC" }}>
      <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "50% 44%" }}>
        {src ? <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} /> : <AbsoluteFill style={{ background: "#D9D7D2" }} />}
      </AbsoluteFill>

      {/* Hook = thumbnail (frame 0): serif title + padlock; "vor euch" stamp on the word */}
      <SerifTitle from={0} to={c.Kundenliste - 0.1} x={0} y={120} align="center" size={104} ink lines={[{ text: "Eure Daten sind" }, { text: "super geschützt.", italic: true }]} />
      <Sticker from={0} to={c.Kundenliste - 0.1} x={540} y={520} rotate={0}>
        <div style={{ position: "relative", display: "flex", justifyContent: "center", width: 520 }}>
          <Card w={220} pad={26} style={{ display: "flex", justifyContent: "center" }}><Lock s={150} /></Card>
          <div style={{ position: "absolute", left: 300, top: 70 }}><Stamp at={c.euch - 0.05} text="VOR EUCH" size={50} rot={8} /></div>
        </div>
      </Sticker>

      {/* Beat 1: Kundenliste.xlsx auf Jürgens Laptop, Jürgen im Urlaub */}
      <Sticker from={c.Kundenliste - 0.1} to={c.Urlaub - 0.1} x={540} y={430} rotate={-1}>
        <Card w={800} pad={24}>
          <FileChip name="Kundenliste_final_NEU2.xlsx" />
          <Sheet at={c.Kundenliste + 0.2} />
          <div style={{ marginTop: 14, fontFamily: fonts.semibold, fontSize: 28, color: GREY, opacity: fade(t, c.Laptop - 0.1) }}>gespeichert auf: <span style={{ color: INK, fontFamily: fonts.bold }}>Jürgens Laptop</span></div>
        </Card>
      </Sticker>
      <Sticker from={c.Urlaub - 0.1} to={c.Du - 0.1} x={540} y={440} rotate={1}>
        <Card w={800} pad={24}>
          <MailHead from="Jürgen" subject="Abwesenheitsnotiz" />
          <div style={{ fontFamily: fonts.semibold, fontSize: 32, color: INK, lineHeight: 1.35 }}>Ich bin im Urlaub und ab dem 4. wieder erreichbar.</div>
          <div style={{ fontFamily: fonts.semibold, fontSize: 26, color: GREY, marginTop: 10 }}>Die Kundenliste habe nur ich.</div>
        </Card>
      </Sticker>

      {/* Beat 2: IT-Dialog. Darf die KI drüberschauen? Nein. Datenschutz. */}
      <Sticker from={c.Du - 0.1} to={c.Juergen3 - 0.1} x={540} y={440} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={800} pad={24} style={{ background: "#F4F6F9" }}>
            <div style={{ paddingBottom: 10, marginBottom: 14, borderBottom: "2px solid #E3E7EC", fontFamily: fonts.bold, fontSize: 28, color: INK }}>Chat · IT-Support</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}><Bubble me text="Darf die KI mal über die Kundenliste schauen?" size={32} /></div>
            <div style={{ marginTop: 14, opacity: fade(t, c.Nein - 0.1) }}><Bubble text="Nein." size={40} /></div>
          </Card>
          <div style={{ position: "absolute", right: 30, bottom: -60 }}><Stamp at={c.Datenschutz - 0.05} text="DATENSCHUTZ" size={54} /></div>
        </div>
      </Sticker>

      {/* Beat 3: Jürgen schickt die Liste an seine private Mail. Für den Pool. */}
      <Sticker from={c.Juergen3 - 0.1} to={c.Keiner - 0.1} x={540} y={440} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={800} pad={24}>
            <MailHead from="juergen@firma.de" subject="Kundenliste (für den Pool)" />
            <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: GREY, marginBottom: 12, opacity: fade(t, c.private - 0.1) }}>
              An: <span style={{ color: RED, fontFamily: fonts.bold }}>juergen.privat@…</span>
            </div>
            <FileChip name="Kundenliste_final_NEU2.xlsx" size={28} />
          </Card>
          <div style={{ position: "absolute", right: 24, bottom: -64, transform: "rotate(-4deg)", opacity: fade(t, c.Pool - 0.1) }}>
            <div style={{ background: "#2BA3D9", color: "#fff", borderRadius: 14, padding: "8px 22px", fontFamily: fonts.bold, fontSize: 40, boxShadow: "0 8px 18px rgba(0,0,0,0.22)" }}>gesendet vom Pool</div>
          </div>
        </div>
      </Sticker>

      {/* Punchline: calm, no sticker over the face. Serif lines on the words. */}
      <SerifTitle from={c.Keiner - 0.1} to={seconds + 1} x={0} y={170} align="center" size={92} ink lines={[{ text: "Keiner weiß, wo", at: c.Keiner - 0.05 }, { text: "die Daten sind.", at: c.Keiner + 0.4 }]} />
      <SerifTitle from={c.Sicherer - 0.1} to={seconds + 1} x={0} y={450} align="center" size={104} ink lines={[{ text: "Sicherer geht's nicht.", italic: true, at: c.Sicherer - 0.05 }]} />

      <Captions words={words} />
    </AbsoluteFill>
  );
};
