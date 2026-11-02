import React from "react";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile } from "remotion";
import { Bubble, Card, SerifTitle, Sticker, useSec, Word, WordCaptions, serifItalic } from "../components/SatireKit";
import { fonts } from "../theme";

// Effekt-Satire "Fluch des Gewinners" (gpt-effekt-satire, GPT-S @florentgpt, Slot 2026-10-09 14:00).
// Lisa, Sofia, Lea wollen alle Tom (Segelboot am Wannsee). Copy of SatireReferenzpunkt, content swapped.
// Icons (Daumen, Herz, Boot, Padelschlaeger, Investoren) are drawn SVG, no emojis.
export type SatireFluchProps = { src: string; seconds: number; words: Word[]; c: Record<string, number> };

const INK = "#161616";
const RED = "#E5484D";
const GREEN = "#1FA45A";
const GREY = "#8A8A8A";

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

const fade = (t: number, at: number) => interpolate(t, [at - 0.05, at + 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const Photo: React.FC<{ img: string; w?: number; label?: string }> = ({ img, w = 330, label }) => (
  <div style={{ width: w, padding: 10, paddingBottom: label ? 8 : 10, background: "#fff", borderRadius: 22, boxShadow: "0 18px 44px rgba(0,0,0,0.3)" }}>
    <Img src={staticFile(`gpts-effekt-fluch-des-gewinners/img/${img}.png`)} style={{ width: w - 20, height: (w - 20) * 1.25, objectFit: "cover", borderRadius: 14, display: "block" }} />
    {label && <div style={{ fontFamily: fonts.bold, fontSize: w < 260 ? 24 : 28, color: INK, padding: "8px 4px 2px" }}>{label}</div>}
  </div>
);

// ---------- drawn icons ----------
const Boat: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 200 160">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE3FF" /><stop offset="1" stopColor="#EAF6FF" /></linearGradient>
    </defs>
    <rect x="0" y="0" width="200" height="160" rx="14" fill="url(#sky)" />
    <circle cx="160" cy="30" r="14" fill="#FFD25A" />
    <path d="M0 108 C 30 98, 60 104, 90 100 S 160 96, 200 104 L200 160 L0 160 Z" fill="#3B8ED8" />
    <path d="M0 104 L 40 94 L 70 100 L 0 112 Z" fill="#5BAA62" />
    <line x1="100" y1="20" x2="100" y2="104" stroke="#5A4632" strokeWidth="4" />
    <path d="M104 24 L 150 98 L 104 98 Z" fill="#fff" stroke="#D8D8D8" strokeWidth="2" />
    <path d="M96 34 L 58 98 L 96 98 Z" fill="#F7F7F7" stroke="#D8D8D8" strokeWidth="2" />
    <path d="M52 104 L 156 104 L 142 122 L 66 122 Z" fill="#8B5A2B" />
    <path d="M20 134 q 12 -8 24 0 t 24 0 M110 140 q 12 -8 24 0 t 24 0" stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
  </svg>
);

const Racket: React.FC<{ w: number; bow?: boolean }> = ({ w, bow }) => {
  const holes: React.ReactNode[] = [];
  for (let r = 0; r < 6; r++) for (let k = 0; k < 5; k++) {
    const x = 62 + k * 19 + (r % 2 ? 9 : 0);
    const y = 46 + r * 19;
    if ((x - 100) ** 2 / 46 ** 2 + (y - 95) ** 2 / 62 ** 2 < 0.85) holes.push(<circle key={`${r}-${k}`} cx={x} cy={y} r="4.5" fill="#1C2A3A" opacity="0.55" />);
  }
  return (
    <svg width={w} height={w * 1.4} viewBox="0 0 200 280">
      <path d="M100 18 C 160 18, 168 70, 162 110 C 156 150, 132 178, 112 186 L 112 200 L 88 200 L 88 186 C 68 178, 44 150, 38 110 C 32 70, 40 18, 100 18 Z" fill="#1F6FEB" stroke="#0D3F8C" strokeWidth="5" />
      <path d="M100 30 C 150 30, 154 72, 150 108 C 145 142, 124 166, 100 172 C 76 166, 55 142, 50 108 C 46 72, 50 30, 100 30 Z" fill="#E9F1FF" />
      {holes}
      <rect x="86" y="196" width="28" height="74" rx="9" fill="#222" />
      <path d="M86 214 L114 206 M86 232 L114 224 M86 250 L114 242" stroke="#555" strokeWidth="3" />
      {bow && (
        <g>
          <path d="M100 200 C 60 170, 40 215, 100 205 C 160 215, 140 170, 100 200 Z" fill={RED} stroke="#A32025" strokeWidth="3" />
          <path d="M96 206 L 78 252 M104 206 L 122 252" stroke={RED} strokeWidth="9" strokeLinecap="round" />
          <circle cx="100" cy="202" r="9" fill="#A32025" />
        </g>
      )}
    </svg>
  );
};

const Person: React.FC<{ s: number; color?: string }> = ({ s, color = "#C9D3DE" }) => (
  <svg width={s} height={s} viewBox="0 0 60 60">
    <circle cx="30" cy="20" r="11" fill={color} />
    <path d="M8 56 C 8 38, 52 38, 52 56 Z" fill={color} />
  </svg>
);

// Thumb pointing sideways ("ganz nett").
const ThumbSide: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 60 60">
    <rect x="8" y="22" width="26" height="26" rx="8" fill="#F2C94C" stroke="#B8902A" strokeWidth="2.5" />
    <path d="M14 30 H 30 M14 37 H 30 M14 43 H 28" stroke="#B8902A" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 22 C 36 17, 44 17, 50 19 C 57 21, 57 33, 50 33 L 32 33 Z" fill="#F2C94C" stroke="#B8902A" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

const Heart: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 60 60">
    <path d="M30 52 C 10 38, 4 28, 6 18 C 8 8, 22 4, 30 16 C 38 4, 52 8, 54 18 C 56 28, 50 38, 30 52 Z" fill={RED} stroke="#A32025" strokeWidth="2.5" />
  </svg>
);

const Check: React.FC<{ s: number; color?: string }> = ({ s, color = GREEN }) => (
  <svg width={s} height={s} viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill={color} /><path d="M11 21 L 17 27 L 29 14" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Row: React.FC<{ at: number; icon?: React.ReactNode; text: string; right?: string; color?: string; strike?: number; size?: number }> = ({ at, icon, text, right, color = GREEN, strike, size = 36 }) => {
  const { t } = useSec();
  const o = interpolate(t, [at - 0.08, at + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s = strike !== undefined ? interpolate(t, [strike, strike + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, padding: "9px 4px", opacity: o, transform: `translateX(${(1 - o) * -16}px)`, fontFamily: fonts.semibold, fontSize: size, color: INK }}>
      {icon}
      <span style={{ flex: 1, opacity: 1 - 0.5 * s }}>{text}</span>
      {right && <span style={{ color, fontFamily: fonts.bold, fontSize: size - 4 }}>{right}</span>}
      <div style={{ position: "absolute", left: 0, top: "50%", height: 5, width: `${s * 62}%`, background: RED, borderRadius: 3 }} />
    </div>
  );
};

// Ten investors: nine thumbs sideways, one heart.
const Investors: React.FC<{ c: Record<string, number> }> = ({ c }) => {
  const { t } = useSec();
  const heartOn = fade(t, c.Einer + 0.1);
  const win = fade(t, c.Genau2);
  return (
    <Card w={900} pad={26}>
      <div style={{ fontFamily: fonts.bold, fontSize: 30, paddingBottom: 10, marginBottom: 12, borderBottom: "2px solid #EFEFEF" }}>Zehn Investoren · ein KI-Startup</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", rowGap: 14 }}>
        {Array.from({ length: 10 }).map((_, i) => {
          const pop = fade(t, c.Zehn + i * 0.07);
          const thumb = fade(t, c.Neun + i * 0.06);
          const isOne = i === 9;
          return (
            <div key={i} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", opacity: pop * (isOne ? 1 : 1 - 0.35 * win), transform: `scale(${0.7 + 0.3 * pop + (isOne ? 0.12 * win : 0)})` }}>
              <div style={{ borderRadius: 50, padding: 4, background: isOne && win > 0 ? `rgba(229,72,77,${0.15 * win})` : "transparent", boxShadow: isOne ? `0 0 0 ${5 * win}px ${RED}` : "none" }}>
                <Person s={74} color={isOne && heartOn > 0.5 ? "#F3B7B9" : "#C9D3DE"} />
              </div>
              <div style={{ height: 62, marginTop: 4, position: "relative", width: 62 }}>
                {!isOne && <div style={{ opacity: thumb, position: "absolute" }}><ThumbSide s={62} /></div>}
                {isOne && <div style={{ opacity: heartOn, transform: `scale(${0.5 + 0.5 * heartOn})`, position: "absolute" }}><Heart s={62} /></div>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 28, marginTop: 14, color: GREY }}>
        <span style={{ opacity: fade(t, c.Neun) }}>9 × „ganz nett“</span>
        <span style={{ opacity: heartOn, color: RED }}>1 × „das nächste ChatGPT“</span>
      </div>
    </Card>
  );
};

export const SatireFluch: React.FC<SatireFluchProps> = ({ src, seconds, words, c }) => {
  const { t, frame, fps } = useSec();
  const drift = 1 + 0.025 * (t / seconds);
  const punch = t >= c.Schlaeger - 0.05 ? 1.12 : 1;
  const racketPunch = t >= c.Schlaeger - 0.05 ? 1 + 0.18 * spring({ frame: frame - (c.Schlaeger - 0.05) * fps, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } }) : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${drift * punch})`, transformOrigin: "38% 48%" }}>
        <OffthreadVideo src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
      </AbsoluteFill>

      {/* Hook = thumbnail; Lisa, Sofia, Lea pile up on their names */}
      <SerifTitle from={0} to={c.Tom - 0.05} x={0} y={150} align="center" size={104} ink lines={[{ text: "Lisa hat gewonnen." }, { text: "Leider.", italic: true }]} />
      <Sticker from={0} to={c.Tom - 0.05} x={850} y={900} rotate={0}>
        <div style={{ position: "relative", width: 260, height: 330 }}>
          {([["sofia", "Sofia", c.Sofia, -8, -40, -190], ["lea", "Lea", c.Lea, 7, 30, 170], ["lisa", "Lisa", -1, 2, 0, 0]] as [string, string, number, number, number, number][]).map(([img, label, at, rot, dx, dy]) => (
            <div key={img} style={{ position: "absolute", left: 20 + dx, top: dy, opacity: at < 0 ? 1 : fade(t, at), transform: `rotate(${rot}deg) scale(${at < 0 ? 1 : 0.8 + 0.2 * fade(t, at)})` }}>
              <Photo img={img} label={label} w={220} />
            </div>
          ))}
        </div>
      </Sticker>

      {/* Tom: Profil-Karte mit Segelboot am Wannsee */}
      <Sticker from={c.Tom - 0.05} to={c.Lisa2 - 0.05} x={540} y={320} rotate={-1}>
        <Card w={560} pad={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 96, height: 96, borderRadius: 48, background: "#EEF2F6", display: "grid", placeItems: "center" }}><Person s={78} color="#9FB0C2" /></div>
            <div>
              <div style={{ fontFamily: fonts.bold, fontSize: 44, color: INK }}>Tom, 29</div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: GREY, opacity: fade(t, c.Segelboot) }}>Segelboot · Wannsee</div>
            </div>
          </div>
          <div style={{ marginTop: 16, opacity: fade(t, c.Segelboot), borderRadius: 14, overflow: "hidden" }}><Boat w={520} /></div>
        </Card>
      </Sticker>

      {/* Lisa gewinnt */}
      <SerifTitle from={c.Lisa2 - 0.1} to={c.Nach - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Am meisten gekämpft" }, { text: "Lisa kriegt Tom", italic: true, at: c.gekriegt - 0.1 }]} />
      <Sticker from={c.Lisa2 - 0.05} to={c.Nach - 0.05} x={860} y={900} rotate={4}>
        <div style={{ position: "relative" }}>
          <Photo img="lisa" label="Lisa" />
          <div style={{ position: "absolute", right: -18, top: -18, opacity: fade(t, c.gekriegt), transform: `scale(${0.6 + 0.4 * fade(t, c.gekriegt)})` }}><Check s={82} /></div>
        </div>
      </Sticker>

      {/* Nach drei Wochen */}
      <Sticker from={c.Nach - 0.1} to={c.Oekonomen - 0.05} x={540} y={350} rotate={-1}>
        <Card w={840} pad={24}>
          <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 4, borderBottom: "2px solid #EFEFEF" }}>Tom · nach drei Wochen</div>
          <Row at={c.Boot} icon={<div style={{ width: 54, borderRadius: 8, overflow: "hidden" }}><Boat w={54} /></div>} text="Segelboot" right="gehört seinem Vater" color={RED} />
          <Row at={c.Padel} icon={<Racket w={36} />} text="Gesprächsthemen" right="nur Padel" color={RED} />
        </Card>
      </Sticker>
      <Sticker from={c.Padel - 0.05} to={c.Oekonomen - 0.05} x={560} y={565} rotate={-2}>
        <div style={{ whiteSpace: "nowrap" }}><Bubble text="Spielst du eigentlich Padel?" size={38} /></div>
      </Sticker>

      {/* Fluch des Gewinners: genau beim Wort */}
      <SerifTitle from={c.Fluch - 0.08} to={c.KI - 0.1} x={0} y={120} align="center" size={112} ink lines={[{ text: "Fluch des" }, { text: "Gewinners", italic: true }]} />
      <Sticker from={c.viele - 0.1} to={c.KI - 0.1} x={540} y={470} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={820} pad={22}>
            <Row at={c.viele} text="Viele wollen dasselbe" right="" />
            <Row at={c.gewinnt} text="Es gewinnt, wer es" right="am meisten überschätzt" color={RED} size={33} />
          </Card>
          <Draw at={c.ueberschaetzt + 0.05} w={320} h={140} d={CIRCLE} style={{ left: 388, top: 74, transform: "scale(1.38,0.62)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* KI-Startups */}
      <SerifTitle from={c.KI - 0.1} to={c.Zehn - 0.05} x={0} y={150} align="center" size={100} ink lines={[{ text: "Bei KI-Startups" }, { text: "genau dasselbe", italic: true }]} />

      {/* Zehn Investoren */}
      <Sticker from={c.Zehn - 0.1} to={c.Er - 0.05} x={540} y={350} rotate={0}>
        <Investors c={c} />
      </Sticker>

      {/* 50 Millionen */}
      <Sticker from={c.Er - 0.1} to={c.Zwei - 0.05} x={540} y={350} rotate={-1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={760} pad={26}>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 10, borderBottom: "2px solid #EFEFEF", display: "flex", alignItems: "center", gap: 12 }}><Heart s={34} /> Der eine Investor zahlt</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 92, color: INK, textAlign: "center", letterSpacing: -2, opacity: fade(t, c.fuenfzig) }}>50 Mio. €</div>
          </Card>
          <Draw at={c.Millionen} w={320} h={140} d={CIRCLE} style={{ left: 150, top: 78, transform: "scale(1.45,0.95)", transformOrigin: "0 0" }} />
        </div>
      </Sticker>

      {/* ChatGPT baut es ein */}
      <Sticker from={c.Zwei - 0.1} to={c.Sofia2 - 0.05} x={540} y={360} rotate={1}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Card w={820} pad={24}>
            <div style={{ fontFamily: fonts.bold, fontSize: 28, paddingBottom: 8, marginBottom: 8, borderBottom: "2px solid #EFEFEF", color: GREY }}>Zwei Monate später</div>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, color: INK, opacity: fade(t, c.ChatGPT2) }}>Neu in ChatGPT</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 34, color: "#3A3A3A", marginTop: 6, opacity: fade(t, c.Funktion) }}>Dieselbe Funktion. Einfach eingebaut.</div>
          </Card>
          <div style={{ position: "absolute", right: -26, bottom: -44, transform: `rotate(-9deg) scale(${1.6 - 0.6 * fade(t, c.Kostenlos)})`, opacity: fade(t, c.Kostenlos), border: `6px solid ${RED}`, borderRadius: 14, padding: "6px 22px", color: RED, fontFamily: fonts.bold, fontSize: 48, letterSpacing: 2, background: "rgba(255,255,255,0.92)" }}>KOSTENLOS</div>
        </div>
      </Sticker>

      {/* Pointe: Sofia und Lea gratulieren */}
      <SerifTitle from={c.Sofia2 - 0.1} to={seconds + 1} x={0} y={150} align="center" size={100} ink lines={[{ text: "Herzlichen" }, { text: "Glückwunsch, Lisa", italic: true, at: c.gratuliert - 0.1 }]} />
      <Sticker from={c.Sofia2 - 0.05} to={c.Schlaeger - 0.05} x={850} y={900} rotate={-3}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ opacity: fade(t, c.Sofia2) }}><Photo img="sofia" label="Sofia" w={210} /></div>
          <div style={{ opacity: fade(t, c.Lea2) }}><Photo img="lea" label="Lea" w={210} /></div>
        </div>
      </Sticker>
      <Sticker from={c.Schlaeger - 0.05} to={seconds + 1} x={850} y={920} rotate={8}>
        <div style={{ transform: `scale(${racketPunch})` }}>
          <Card w={300} pad={16} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Racket w={220} bow />
            <div style={{ fontFamily: fonts.bold, fontSize: 28, color: INK, marginTop: 6 }}>Padelschläger</div>
            <div style={{ fontFamily: serifItalic, fontSize: 30, color: RED }}>von Sofia & Lea</div>
          </Card>
        </div>
      </Sticker>

      <WordCaptions words={words} y={0.8} />
    </AbsoluteFill>
  );
};
