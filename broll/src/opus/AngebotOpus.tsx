import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-angebot/captions.json";
import { PixelBot, BotProp, BotHat } from "../components/PixelBot";

// FP-N "Angebot aus der Sprachnachricht" (Pius 2026-10-19), Arena-Opus-Stil (see ArenaOpus.tsx and
// video-post-production/references/fpn-opus-stil-2026-10-15.md): split from frame 0, cream grid panel on top,
// avatar below, Claude-orange caption pill on the seam, one full-frame pixel scene ("während die anderen noch
// zurückrufen") with our own painter sprite. All names, companies and prices are invented examples.
// Timings are anchored to the word timings of the tightened timeline (captions.json).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const AN_END = LAST_END + 0.7;
export const AN_FRAMES = Math.round(AN_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  abends: at("abends"), oder: at("oder"), dann: at("dann", 0), andere: at("andere"), tisch: at("tisch"),
  mit: at("mit", 0), raus: at("raus"), minuten: at("minuten"), sprach0: at("sprachnachricht", 0),
  so: at("so"), eins: at("eins"), projekt0: at("projekt", 0), preisliste: at("preisliste"), vorlage: at("vorlage"),
  schritt1: at("schritt", 1), kunde: at("kunde"), sprach1: at("sprachnachricht", 1), drei: at("drei", 0), zimmer: at("zimmer"),
  decke: at("decke"), altbau: at("altbau"), november: at("november"),
  text: at("text"), kopierst: at("kopierst"), positionen: at("positionen"), mengen: at("mengen"), preisen: at("preisen"),
  beste: at("beste"), flaeche: at("fläche"), fragt: at("fragt"), raten: at("raten"),
  schritt2: at("schritt", 2), pdf: at("pdf"), briefkopf: at("briefkopf"), frist: at("frist"),
  schickst: at("schickst"), anderen: at("anderen"), zurueck: at("zurückrufen"),
  anleitung: at("anleitung"), prompt: at("prompt"), guide: at("guide"),
  komm: at("kommentiere"), angebot3: at("angebot", 3), folg: at("folg"),
  termin: at("termin"), gehts: at("gehts"), einmal: at("einmal"), kunde1: at("kunde", 1), schickt: at("schickt"),
  anzeigen: at("anzeigen"), daraus: at("daraus"), streichen: at("streichen"), zwei0: at("zwei", 0),
  schritt0: at("schritt", 0), fehlt0: at("fehlt"),
};
const FULL = { from: A.schickst - 0.08, to: A.anleitung - 0.1 };

const C = {
  bg: "#F3EFE6", grid: "rgba(0,0,0,0.045)", ink: "#151515", dim: "#8A877F", line: "#E7E4DD", card: "#FFFFFF",
  orange: "#D97757", orangeSoft: "#F8E1D7", green: "#1E9E57", greenSoft: "#E6F5EC", red: "#E5484D", redSoft: "#FDE8E8",
  chip: "#141414", term: "#17161A", gold: "#F5C542", wa: "#DCF8C6", waBg: "#ECE5DD",
};
const MONO = "JetBrains Mono";
const PIXEL = "Silkscreen";
const shadow = "0 22px 48px rgba(20,20,20,0.10), 0 3px 8px rgba(20,20,20,0.06)";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const k = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const pop = (t: number, a: number, d = 0.38) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.7)) });
const popStyle = (t: number, a: number, rise = 18, from = 0.7): React.CSSProperties => {
  const p = pop(t, a);
  return { opacity: k(t, a, 0.14), transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from + (1 - from) * p})` };
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(interpolate(t, [a, b], [0, s.length], clamp)));
const rnd = (i: number, salt = 1) => { const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return x - Math.floor(x); };
const shakeAt = (t: number, a: number, amp = 5) => { const r = t - a; return r > 0.03 && r < 0.4 ? Math.sin(r * 90) * amp * (1 - r / 0.4) : 0; };
const eur = (n: number) => n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

const SENT = [0, ...CAPS.flatMap((c, i) => (i > 0 && /[.!?:]$/.test(CAPS[i - 1].text) ? [c.startMs / 1000] : []))];
const camera = (t: number, from: number, to: number) => {
  const s = SENT.filter((x) => x >= from && x < to);
  if (!s.length) s.push(from);
  const amt = Math.min(0.03, 0.075 / s.length);
  let sc = 1;
  s.forEach((a, i) => {
    const b = i + 1 < s.length ? s[i + 1] : to;
    sc += amt * interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  });
  return sc;
};

// ---------- building blocks ----------
const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: C.card, borderRadius: 18, boxShadow: shadow, ...style }}>{children}</div>
);
const LabelChip: React.FC<{ text: string; dot?: string; style?: React.CSSProperties; size?: number }> = ({ text, dot = C.orange, style, size = 28 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.chip, color: "#FFF", fontFamily: fonts.semibold, fontSize: size, padding: `${size * 0.36}px ${size * 0.8}px ${size * 0.36}px ${size * 0.6}px`, borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap", ...style }}>
    <span style={{ width: size * 0.48, height: size * 0.48, borderRadius: "50%", background: dot }} />
    {text}
  </div>
);
const Tag: React.FC<{ text: string; color: string; size?: number; style?: React.CSSProperties }> = ({ text, color, size = 18, style }) => (
  <span style={{ display: "inline-block", fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.12em", color: "#FFF", background: color, padding: `${size * 0.33}px ${size * 0.55}px ${size * 0.33}px ${size * 0.66}px`, borderRadius: 8, whiteSpace: "nowrap", ...style }}>{text}</span>
);
const ClaudeMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.claude.d} fill={SIMPLE_ICONS.claude.hex} /></svg>
);
const Check: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - p)} /></svg>
);
const Cross: React.FC<{ size: number; color?: string; p?: number }> = ({ size, color = "#FFF", p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - p)} /></svg>
);
const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, at: a, text, color = C.red, size = 64, rot = -8, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.16], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <div style={{ position: "absolute", transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p, fontFamily: MONO, fontWeight: 800, fontSize: size, letterSpacing: "0.08em", color, border: `${size * 0.09}px solid ${color}`, borderRadius: 12, padding: `${size * 0.08}px ${size * 0.3}px`, background: "rgba(255,255,255,0.88)", whiteSpace: "nowrap", ...style }}>{text}</div>;
};
const PdfIcon: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div style={{ width: size * 0.85, height: size, borderRadius: 6, background: C.red, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: size * 0.3, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: size * 0.12, boxSizing: "border-box", flexShrink: 0 }}>PDF</div>
);
const Wave: React.FC<{ t: number; playing: number; bars?: number; color?: string; w?: number }> = ({ t, playing, bars = 26, color = "#4A8C3A", w = 300 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4, height: 44, width: w }}>
    {Array.from({ length: bars }, (_, i) => {
      const base = 0.25 + 0.75 * rnd(i, 9);
      const done = i / bars < playing;
      return <div key={i} style={{ flex: 1, height: `${base * 100 * (done ? 0.8 + 0.2 * Math.sin(t * 14 + i) : 1)}%`, borderRadius: 3, background: done ? color : "rgba(0,0,0,0.22)" }} />;
    })}
  </div>
);
const Voice: React.FC<{ t: number; a: number; dur: string; w?: number; playFor?: number }> = ({ t, a, dur, w = 520, playFor = 3 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", borderRadius: "22px 22px 22px 6px", padding: "16px 22px", width: w, boxShadow: "0 6px 14px rgba(0,0,0,0.08)" }}>
    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#4A8C3A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width={22} height={22} viewBox="0 0 24 24"><path d={t > a ? "M7 5h4v14H7zM13 5h4v14h-4z" : "M8 5l11 7-11 7z"} fill="#FFF" /></svg>
    </div>
    <Wave t={t} playing={interpolate(t, [a, a + playFor], [0, 1], clamp)} w={w - 170} />
    <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>{dur}</div>
  </div>
);

// ---------- our own pixel painter (13 x 16), not any brand mascot ----------
const PAINTER = [
  "....CCCCC....",
  "...CCCCCCC...",
  "..CCCCCCCCCb.",
  "...SSSSSSS...",
  "...SESSSES...",
  "...SSSSSSS...",
  "....SMMMS....",
  "..OOOOOOOOO.R",
  ".OOOWOOOOWOOR",
  ".SOOWOOOOWOSR",
  "..OOOOOOOOO.H",
  "..OOOOOOOOO.H",
  "...OOO.OOO...",
  "...OOO.OOO...",
  "...BBB.BBB...",
  "..BBBB.BBBB..",
];
const Painter: React.FC<{ px: number; color?: string; grey?: boolean; flip?: boolean; style?: React.CSSProperties }> = ({ px, color = C.orange, grey, flip, style }) => {
  const pal: Record<string, string> = grey
    ? { C: "#8E8981", b: "#6E6A63", S: "#CFCBC4", E: "#4A4640", M: "#A8A39A", O: "#A8A39A", W: "#CFCBC4", R: "#8E8981", H: "#6E6A63", B: "#4A4640" }
    : { C: color, b: "#2C2420", S: "#F1C9A5", E: "#2C2420", M: "#C98F6E", O: color, W: "#FFFFFF", R: "#EEF3F7", H: "#7A4B26", B: "#2C2420" };
  return (
    <svg width={13 * px} height={PAINTER.length * px} viewBox={`0 0 13 ${PAINTER.length}`} shapeRendering="crispEdges" style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      {PAINTER.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={pal[ch]} />)))}
    </svg>
  );
};

// ---------- Scene 0: hook (0 - Mit Claude) ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.95, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 60, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow }}>Sprachnachricht rein</div>
      <div style={{ ...pill, marginTop: -6 }}>
        Angebot raus in{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>2 Minuten</span>
        </span>
      </div>
    </div>
  );
};
const ROWS = ["Wände streichen, Wohnzimmer", "Decke streichen, Wohnzimmer", "Wände streichen, Flur", "Abdecken und Abkleben", "Spachteln Altbau"];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const evening = 1 - k(t, A.dann - 0.1, 0.35);
  const hh = 21, mm = 40 + Math.floor(interpolate(t, [0, A.dann], [0, 7], clamp));
  return (
    <>
      {evening > 0 ? (
        <Card style={{ left: 90, top: 270, width: 900, height: 470, overflow: "hidden", opacity: evening, transform: `scale(${0.85 + 0.15 * evening})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 30px", borderBottom: `1.5px solid ${C.line}`, background: "#F6F5F1" }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>Rechnungsprogramm · Angebot neu</div>
            <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#FFF", background: C.chip, borderRadius: 10, padding: "4px 14px" }}>{hh}:{String(mm).padStart(2, "0")}</div>
          </div>
          <div style={{ padding: "14px 30px" }}>
            {ROWS.map((r, i) => {
              const a = 0.08 + i * 0.32;
              const cur = t >= a && (i === ROWS.length - 1 || t < 0.08 + (i + 1) * 0.32);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 66, borderBottom: `1px solid ${C.line}`, opacity: t > a - 0.05 ? 1 : 0.25 }}>
                  <span style={{ fontFamily: MONO, fontSize: 22, color: C.dim, width: 40 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: fonts.medium, fontSize: 30, color: C.ink, flex: 1 }}>{typed(r, t, a, a + 0.28)}{cur ? <span style={{ color: C.orange }}>▌</span> : null}</span>
                  <span style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>{t > a + 0.28 ? "… m²" : ""}</span>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", right: 30, bottom: 18, fontFamily: MONO, fontSize: 22, color: C.dim }}>Position {Math.min(ROWS.length, 1 + Math.floor(t / 0.32))} von 23</div>
          {t > A.oder - 0.05 ? <Stamp t={t} at={A.oder - 0.05} text="ABENDS?" size={56} rot={-7} style={{ left: 520, top: 300 }} /> : null}
        </Card>
      ) : null}
      {t > A.dann - 0.1 ? (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", ...popStyle(t, A.dann - 0.1, 10, 0.8) }}>
            <LabelChip text="Beim Kunden auf dem Tisch" dot={C.red} size={30} />
          </div>
          {[{ n: "Malerbetrieb Kraus", time: "14:12", x: 100, r: -5, a: A.dann + 0.05 }, { n: "Farbwerk Süd", time: "15:03", x: 560, r: 4, a: A.dann + 0.35 }].map((o, i) => (
            <Card key={i} style={{ left: o.x, top: 370, width: 420, height: 360, padding: 26, boxSizing: "border-box", transform: `rotate(${o.r}deg) ${popStyle(t, o.a, 40, 0.6).transform}`, opacity: k(t, o.a, 0.14) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><PdfIcon size={44} /><div style={{ fontFamily: fonts.semibold, fontSize: 26, color: C.ink }}>Angebot</div></div>
              <div style={{ marginTop: 14, fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>{o.n}</div>
              {[0.9, 0.7, 0.8, 0.5].map((w, j) => <div key={j} style={{ height: 12, width: `${w * 100}%`, background: "#E4E1DA", borderRadius: 6, marginTop: 16 }} />)}
              <div style={{ position: "absolute", left: 26, bottom: 22 }}><Tag text={`EINGEGANGEN ${o.time}`} color={C.ink} size={18} /></div>
            </Card>
          ))}
          {t > A.tisch ? <Stamp t={t} at={A.tisch} text="DEINS? FEHLT." size={52} rot={-6} style={{ left: 290, top: 560 }} /> : null}
        </>
      ) : null}
    </>
  );
};

// ---------- Scene 1: voice message in, offer out in two minutes ----------
const SceneTwoMin: React.FC<{ t: number }> = ({ t }) => {
  const sec = interpolate(t, [A.raus, A.minuten + 0.6], [0, 120], clamp);
  const out = t > A.minuten + 0.5;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 70, width: 940, height: 690, borderRadius: 28, background: C.waBg, boxShadow: shadow, overflow: "hidden" }}>
        <div style={{ height: 86, background: "#075E54", display: "flex", alignItems: "center", gap: 16, padding: "0 28px" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#B9CFC9" }} />
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: "#FFF" }}>Frau Becker · Altbau</div>
        </div>
        <div style={{ position: "absolute", left: 30, top: 120, ...popStyle(t, A.mit - 0.05, 20, 0.7) }}><Voice t={t} a={A.sprach0} dur="0:38" /></div>
        {t > A.minuten - 0.2 ? (
          <div style={{ position: "absolute", right: 30, top: 300, display: "flex", alignItems: "center", gap: 16, background: C.wa, borderRadius: "22px 22px 6px 22px", padding: "18px 22px", boxShadow: "0 6px 14px rgba(0,0,0,0.08)", ...popStyle(t, A.minuten - 0.2, 24, 0.6) }}>
            <PdfIcon size={60} />
            <div>
              <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>Angebot_2026-114.pdf</div>
              <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>2 Seiten · 148 KB</div>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 22, color: "#34B7F1", marginLeft: 8 }}>✓✓</span>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#FFF", borderRadius: 999, padding: "14px 30px", boxShadow: shadow, ...popStyle(t, A.raus - 0.05, 12, 0.7) }}>
            <span style={{ fontFamily: MONO, fontSize: 24, color: C.dim }}>STOPPUHR</span>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 56, color: out ? C.green : C.ink, fontVariantNumeric: "tabular-nums" }}>{Math.floor(sec / 60)}:{String(Math.floor(sec % 60)).padStart(2, "0")}</span>
            {out ? <span style={{ width: 46, height: 46, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={34} p={k(t, A.minuten + 0.5, 0.3)} /></span> : null}
          </div>
        </div>
      </div>
    </>
  );
};

// ---------- Scene 2: step 1, the project with price list + old offer ----------
const FileRow: React.FC<{ t: number; a: number; name: string; meta: string; kind: "xls" | "pdf" | "img" }> = ({ t, a, name, meta, kind }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `1.5px solid ${C.line}`, borderRadius: 14, padding: "16px 20px", ...popStyle(t, a, 24, 0.6) }}>
    {kind === "pdf" ? <PdfIcon size={48} /> : <div style={{ width: 41, height: 48, borderRadius: 6, background: kind === "xls" ? "#1E7145" : C.orange, color: "#FFF", fontFamily: MONO, fontWeight: 800, fontSize: 13, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 6, boxSizing: "border-box" }}>{kind === "xls" ? "XLS" : "PNG"}</div>}
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 19, color: C.dim }}>{meta}</div>
    </div>
    <Check size={34} color={C.green} p={k(t, a + 0.3, 0.3)} />
  </div>
);
const SceneProjekt: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 50, ...popStyle(t, A.so - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · einmal einrichten" dot={C.orange} size={30} /></div>
    <Card style={{ left: 70, top: 150, width: 940, height: 620, padding: "26px 32px", boxSizing: "border-box", ...popStyle(t, A.eins - 0.05, 20, 0.85) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <ClaudeMark size={40} />
        <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.ink }}>{t > A.projekt0 ? "Angebote" : "Neues Projekt"}</div>
        <div style={{ marginLeft: "auto" }}><Tag text="PROJEKT" color={C.orange} size={20} /></div>
      </div>
      <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 20, color: C.dim }}>Project knowledge</div>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
        {t > A.preisliste - 0.1 ? <FileRow t={t} a={A.preisliste - 0.1} name="Preisliste_2026.xlsx" meta="148 Leistungen · Einheit · Preis netto" kind="xls" /> : null}
        {t > A.vorlage - 0.25 ? <FileRow t={t} a={A.vorlage - 0.25} name="Angebot_Muster_Vorlage.pdf" meta="Briefkopf · Aufbau · Zahlungsbedingungen" kind="pdf" /> : null}
        {t > A.vorlage + 0.25 ? <FileRow t={t} a={A.vorlage + 0.25} name="Logo.png" meta="für den Briefkopf" kind="img" /> : null}
      </div>
    </Card>
  </>
);

// ---------- Scene 3: step 2, the customer's voice message, transcript with highlighted facts ----------
const FACTS: { w: string; label: string; a: () => number }[] = [
  { w: "Drei Zimmer streichen,", label: "3 ZIMMER", a: () => A.drei },
  { w: "Decke mit,", label: "DECKE", a: () => A.decke },
  { w: "Altbau,", label: "ALTBAU", a: () => A.altbau },
  { w: "Start im November.", label: "NOVEMBER", a: () => A.november },
];
const SceneVoice: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 50, ...popStyle(t, A.schritt1 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 2 · Kunde spricht drauf" dot={C.green} size={30} /></div>
    <div style={{ position: "absolute", left: 70, top: 150, width: 940, height: 620, borderRadius: 28, background: C.waBg, boxShadow: shadow, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 30, top: 30, ...popStyle(t, A.schritt1 + 0.15, 20, 0.7) }}><Voice t={t} a={A.kunde1} dur="0:41" playFor={A.november - A.kunde1 + 0.6} /></div>
      <div style={{ position: "absolute", left: 30, top: 150, width: 640, background: "#FFF", borderRadius: "6px 22px 22px 22px", padding: "20px 24px", boxShadow: "0 6px 14px rgba(0,0,0,0.08)", ...popStyle(t, A.drei - 0.2, 12, 0.8) }}>
        <div style={{ fontFamily: MONO, fontSize: 18, color: C.dim, marginBottom: 8 }}>TRANSKRIPT</div>
        <div style={{ fontFamily: fonts.medium, fontSize: 34, lineHeight: 1.4, color: C.ink }}>
          {FACTS.map((f, i) => (
            <span key={i} style={{ opacity: t > f.a() - 0.05 ? 1 : 0.15, background: t > f.a() + 0.2 ? C.orangeSoft : "transparent", borderRadius: 6, padding: "0 4px", marginRight: 6 }}>{f.w}</span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: 30, top: 160, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-end" }}>
        {FACTS.map((f, i) => (t > f.a() + 0.15 ? <div key={i} style={popStyle(t, f.a() + 0.15, 14, 0.5)}><Tag text={f.label} color={i === 2 ? C.red : C.orange} size={24} /></div> : null))}
      </div>
    </div>
  </>
);

// ---------- Scene 4: text into Claude, positions with quantities and your prices ----------
const POS = [
  { p: "Wände streichen, 3 Zimmer", m: 142, u: "m²", e: 6.9 },
  { p: "Decke streichen", m: 48, u: "m²", e: 7.4 },
  { p: "Spachteln Altbau", m: 12, u: "Std", e: 52 },
  { p: "Abdecken und Abkleben", m: 1, u: "psch", e: 180 },
];
const ScenePositionen: React.FC<{ t: number }> = ({ t }) => {
  const fly = k(t, A.kopierst - 0.05, 0.45, Easing.inOut(Easing.cubic));
  return (
    <>
      <Card style={{ left: 70, top: 50, width: 940, height: 720, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 28px", borderBottom: `1.5px solid ${C.line}` }}>
          <ClaudeMark size={36} /><div style={{ fontFamily: fonts.semibold, fontSize: 30, color: C.ink }}>Angebote · Neuer Chat</div>
          <div style={{ marginLeft: "auto" }}><Tag text="PROJEKT" color={C.orange} size={18} /></div>
        </div>
        <div style={{ position: "absolute", right: 28, top: interpolate(fly, [0, 1], [520, 96]), width: 560, background: C.orangeSoft, borderRadius: "18px 6px 18px 18px", padding: "12px 18px", fontFamily: fonts.medium, fontSize: 23, color: C.ink, opacity: k(t, A.text - 0.15, 0.2), transform: `rotate(${(1 - fly) * -4}deg)`, zIndex: 2 }}>
          „Drei Zimmer streichen, Decke mit, Altbau, Start im November …“
        </div>
        {t > A.positionen - 0.1 ? (
          <div style={{ padding: "110px 28px 0" }}>
            <div style={{ display: "flex", fontFamily: MONO, fontSize: 18, color: C.dim, paddingBottom: 10, borderBottom: `1.5px solid ${C.line}` }}>
              <span style={{ flex: 1 }}>POSITION</span><span style={{ width: 150, textAlign: "right" }}>MENGE</span><span style={{ width: 150, textAlign: "right" }}>EP</span><span style={{ width: 190, textAlign: "right" }}>GESAMT</span>
            </div>
            {POS.map((r, i) => {
              const a = A.positionen + i * 0.3;
              const showM = t > A.mengen + i * 0.12, showP = t > A.preisen + i * 0.12;
              return t > a - 0.05 ? (
                <div key={i} style={{ display: "flex", alignItems: "center", height: 84, borderBottom: `1px solid ${C.line}`, fontFamily: fonts.medium, fontSize: 28, color: C.ink, ...popStyle(t, a - 0.05, 12, 0.9) }}>
                  <span style={{ flex: 1 }}><span style={{ fontFamily: MONO, fontSize: 20, color: C.dim, marginRight: 12 }}>{i + 1}.</span>{r.p}</span>
                  <span style={{ width: 150, textAlign: "right", fontFamily: MONO, color: showM ? C.ink : "transparent", background: showM && t < A.mengen + 0.6 ? C.orangeSoft : "transparent", borderRadius: 6 }}>{r.m} {r.u}</span>
                  <span style={{ width: 150, textAlign: "right", fontFamily: MONO, color: showP ? C.ink : "transparent", background: showP && t < A.preisen + 0.6 ? C.greenSoft : "transparent", borderRadius: 6 }}>{eur(r.e)}</span>
                  <span style={{ width: 190, textAlign: "right", fontFamily: MONO, fontWeight: 800, color: showP ? C.ink : "transparent" }}>{eur(r.m * r.e)}</span>
                </div>
              ) : null;
            })}
            {t > A.preisen + 0.4 ? <div style={{ marginTop: 18, display: "flex", gap: 12, ...popStyle(t, A.preisen + 0.4, 10, 0.7) }}><Tag text="PREISE AUS DEINER LISTE" color={C.green} size={20} /><Tag text="BEISPIEL" color={C.dim} size={20} /></div> : null}
          </div>
        ) : null}
      </Card>
    </>
  );
};

// ---------- Scene 5: missing area -> Claude asks instead of guessing ----------
const SceneFrage: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center", ...popStyle(t, A.beste - 0.1, 10, 0.7) }}><LabelChip text="Und das Beste" dot={C.gold} size={34} /></div>
    <Card style={{ left: 90, top: 170, width: 420, height: 300, padding: 28, boxSizing: "border-box", border: `4px solid ${C.red}`, ...popStyle(t, A.flaeche + 0.15, 20, 0.6) }}>
      <div style={{ fontFamily: MONO, fontSize: 20, color: C.red, letterSpacing: "0.12em" }}>RATEN</div>
      <div style={{ marginTop: 12, fontFamily: fonts.bold, fontSize: 34, color: C.ink, position: "relative" }}>
        Zimmer 3: <span style={{ fontFamily: MONO }}>„ca. 20 m²“</span>
        <div style={{ position: "absolute", left: -6, right: -6, top: "50%", height: 6, background: C.red, transform: `scaleX(${k(t, A.raten + 0.1, 0.3)})`, transformOrigin: "0 50%", borderRadius: 3 }} />
      </div>
      <div style={{ position: "absolute", right: 22, bottom: 22, width: 60, height: 60, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}><Cross size={44} p={k(t, A.raten + 0.1, 0.3)} /></div>
    </Card>
    <Card style={{ left: 540, top: 170, width: 450, height: 600, overflow: "hidden", border: `4px solid ${C.green}`, ...popStyle(t, A.beste + 0.15, 20, 0.6) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", borderBottom: `1.5px solid ${C.line}` }}><ClaudeMark size={32} /><div style={{ fontFamily: fonts.semibold, fontSize: 26, color: C.ink }}>Claude</div></div>
      <div style={{ padding: 22 }}>
        <div style={{ background: "#F1EFEA", borderRadius: "6px 18px 18px 18px", padding: "16px 18px", fontFamily: fonts.medium, fontSize: 28, color: C.ink, lineHeight: 1.35 }}>
          {typed("Kurze Frage, bevor ich das Angebot erstelle: Wie groß ist das dritte Zimmer in m²?", t, A.flaeche - 0.1, A.raten + 0.2)}
        </div>
        {t > A.raten + 0.4 ? <div style={{ marginTop: 20, marginLeft: 80, background: C.orangeSoft, borderRadius: "18px 6px 18px 18px", padding: "14px 18px", fontFamily: fonts.medium, fontSize: 28, color: C.ink, ...popStyle(t, A.raten + 0.4, 10, 0.7) }}>18 m²</div> : null}
      </div>
      <div style={{ position: "absolute", left: 22, bottom: 22 }}><Tag text="NACHFRAGEN STATT RATEN" color={C.green} size={20} /></div>
    </Card>
  </>
);

// ---------- Scene 6: step 3, the finished PDF with letterhead and deadline ----------
const ScenePdf: React.FC<{ t: number }> = ({ t }) => {
  const sum = POS.reduce((s, r) => s + r.m * r.e, 0);
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 50, ...popStyle(t, A.schritt2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · fertiges Angebot" dot={C.green} size={30} /></div>
      <div style={{ position: "absolute", left: 160, top: 140, width: 760, height: 660, background: "#FFF", borderRadius: 8, boxShadow: "0 30px 70px rgba(0,0,0,0.18)", padding: "34px 44px", boxSizing: "border-box", ...popStyle(t, A.schritt2 + 0.15, 30, 0.85) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: k(t, A.schritt2 + 0.3, 0.25), borderBottom: `3px solid ${C.orange}`, paddingBottom: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 12, background: C.orange, color: "#FFF", fontFamily: fonts.bold, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>M</div>
          <div><div style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>Malerbetrieb Mustermann</div><div style={{ fontFamily: MONO, fontSize: 16, color: C.dim }}>Musterstraße 12 · 12345 Musterstadt</div></div>
          <div style={{ marginLeft: "auto", textAlign: "right", fontFamily: MONO, fontSize: 18, color: C.dim }}>Angebot 2026-114<br />19.10.2026</div>
        </div>
        <div style={{ marginTop: 18, fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>Frau Becker · Malerarbeiten Altbau</div>
        {POS.map((r, i) => (
          <div key={i} style={{ display: "flex", fontFamily: fonts.medium, fontSize: 22, color: C.ink, padding: "10px 0", borderBottom: `1px solid ${C.line}`, opacity: k(t, A.schritt2 + 0.6 + i * 0.18, 0.2) }}>
            <span style={{ flex: 1 }}>{i + 1}. {r.p}</span><span style={{ fontFamily: MONO }}>{eur(r.m * r.e)}</span>
          </div>
        ))}
        <div style={{ display: "flex", marginTop: 14, fontFamily: fonts.bold, fontSize: 26, color: C.ink, opacity: k(t, A.pdf, 0.2) }}>
          <span style={{ flex: 1 }}>Gesamt brutto (inkl. 19 % USt.)</span><span style={{ fontFamily: MONO }}>{eur(sum * 1.19)}</span>
        </div>
        {t > A.briefkopf - 0.05 ? <div style={{ position: "absolute", left: 34, bottom: 30, ...popStyle(t, A.briefkopf - 0.05, 10, 0.5) }}><Tag text="DEIN BRIEFKOPF" color={C.orange} size={22} /></div> : null}
        {t > A.frist - 0.05 ? <div style={{ position: "absolute", right: 34, bottom: 30, ...popStyle(t, A.frist - 0.05, 10, 0.5) }}><Tag text="GÜLTIG BIS 18.11.2026" color={C.red} size={22} /></div> : null}
      </div>
    </>
  );
};

// ---------- full frame: pixel street, our painter sends first, the others are still calling back ----------
const Street: React.FC<{ t: number }> = ({ t }) => {
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < 300; i++) {
    const x = Math.floor(rnd(i, 3) * 216), y = 230 + Math.floor(rnd(i, 4) * 150);
    stars.push(<rect key={i} x={x} y={y} width={1} height={1} fill={rnd(i, 5) > 0.5 ? "#7FB069" : "#9CC985"} />);
  }
  return (
    <svg width={W} height={H} viewBox="0 0 216 384" shapeRendering="crispEdges" style={{ position: "absolute", inset: 0 }}>
      <rect x={0} y={0} width={216} height={230} fill="#BFE3F2" />
      <rect x={0} y={150} width={216} height={80} fill="#D6EEF7" />
      {[20, 90, 160].map((x, i) => <g key={i}><rect x={x + Math.sin(t * 0.5 + i) * 3} y={30 + i * 9} width={24} height={6} fill="#FFF" /><rect x={x + 4 + Math.sin(t * 0.5 + i) * 3} y={26 + i * 9} width={14} height={4} fill="#FFF" /></g>)}
      {/* customer house */}
      <rect x={120} y={130} width={80} height={100} fill="#F2E3C9" />
      <polygon points="114,132 160,96 206,132" fill="#C8553D" />
      <rect x={150} y={190} width={18} height={40} fill="#7A4B26" />
      <rect x={128} y={150} width={16} height={16} fill="#8FC1E3" /><rect x={176} y={150} width={16} height={16} fill="#8FC1E3" />
      {/* mailbox */}
      <rect x={104} y={200} width={4} height={30} fill="#5A4636" />
      <rect x={96} y={190} width={20} height={12} fill="#3E6FB0" />
      <rect x={0} y={230} width={216} height={154} fill="#8CC07A" />
      {stars}
      <rect x={0} y={262} width={216} height={30} fill="#9A9A9A" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 20 + 4} y={276} width={10} height={2} fill="#FFF" />)}
    </svg>
  );
};
const PixelText: React.FC<{ text: string; size: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, size, color = "#FFF", bg = "#2C2420", style }) => (
  <div style={{ fontFamily: PIXEL, fontSize: size, color, background: bg, padding: `${size * 0.25}px ${size * 0.45}px`, border: `${Math.max(4, size * 0.09)}px solid ${C.gold}`, boxShadow: `0 ${size * 0.12}px 0 #6B4528`, whiteSpace: "nowrap", lineHeight: 1, ...style }}>{text}</div>
);
const SceneFull: React.FC<{ t: number }> = ({ t }) => {
  const u = t - FULL.from;
  const plane = k(t, FULL.from + 0.15, 0.85, Easing.inOut(Easing.cubic));
  const px = interpolate(plane, [0, 1], [250, 520]), py = interpolate(plane, [0, 1], [1080, 940]) - Math.sin(plane * Math.PI) * 220;
  const hit = t > FULL.from + 1.0;
  const flag = hit ? k(t, FULL.from + 1.0, 0.2) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * k(t, FULL.from, 2.2, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 60%" }}>
        <Street t={t} />
        {/* mailbox flag */}
        <div style={{ position: "absolute", left: 572, top: 920, width: 16, height: 60, background: C.red, transformOrigin: "50% 100%", transform: `rotate(${-90 + 90 * flag}deg)` }} />
        {/* our painter */}
        <div style={{ position: "absolute", left: 150, top: 1050, transform: `translateY(${Math.abs(Math.sin(u * 8)) * -10}px)` }}><Painter px={9} /></div>
        {/* paper plane with the offer */}
        {!hit ? (
          <div style={{ position: "absolute", left: px, top: py, transform: `rotate(${interpolate(plane, [0, 0.5, 1], [-20, 0, 25])}deg)` }}>
            <svg width={90} height={60} viewBox="0 0 30 20" shapeRendering="crispEdges"><polygon points="0,10 30,0 22,20 14,13" fill="#FFF" stroke="#2C2420" strokeWidth={0.8} /></svg>
          </div>
        ) : null}
        {/* competitors on the phone */}
        {[{ x: 640, y: 1330 }, { x: 860, y: 1360 }].map((c, i) => (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.y }}>
            <Painter px={7} grey flip />
            <div style={{ position: "absolute", left: -40, top: -78, fontFamily: PIXEL, fontSize: 24, color: "#2C2420", background: "#FFF", border: "4px solid #2C2420", padding: "6px 10px", whiteSpace: "nowrap" }}>{["RÜCKRUF", "RÜCKRUF ."][i]}{".".repeat(1 + (Math.floor(u * 3 + i) % 3))}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", ...popStyle(t, FULL.from + 1.0, 12, 0.5) }}>
        <PixelText text="ANGEBOT ZUGESTELLT" size={50} color="#2C2420" bg={C.gold} style={{ transform: `translateX(${shakeAt(t, FULL.from + 1.0, 6)}px)` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", ...popStyle(t, A.anderen - 0.05, 10, 0.6) }}>
        <PixelText text="PLATZ 1" size={40} />
      </div>
    </AbsoluteFill>
  );
};


// ================= v2 (Pius 2026-10-19: mehr Claude-Stil, mehr Dopamin, Vorlage @opusjake) =================
// Our own pixel bot appears in every scene with a changing prop, five full-frame cream moments without the avatar,
// pixel night scene as the hook, and a follow + comment card at the end instead of the full-frame pill.

const Bot: React.FC<{ t: number; prop?: BotProp; hat?: BotHat; px?: number; x: number; y: number; a?: number; flip?: boolean; seed?: number; grey?: boolean }> = ({ t, prop = "none", hat = "none", px = 7, x, y, a = -1, flip, seed = 0, grey }) => {
  const st = a >= 0 ? popStyle(t, a, 26, 0.3) : {};
  const hop = Math.abs(Math.sin(t * 5 + seed)) * -8;
  return (
    <div style={{ position: "absolute", left: x, top: y, ...st }}>
      <div style={{ transform: `translateY(${hop}px)` }}><PixelBot px={px} t={t} prop={prop} hat={hat} flip={flip} seed={seed} grey={grey} /></div>
    </div>
  );
};

// ---------- v2 hook: pixel night scene, our bot typing offers at the desk ----------
const NightHook: React.FC<{ t: number }> = ({ t }) => {
  const mm = 40 + Math.floor(interpolate(t, [0, A.dann], [0, 8], clamp));
  const papers = Math.floor(interpolate(t, [0.3, A.dann], [1, 7], clamp));
  return (
    <>
      <svg width={W} height={PH} viewBox="0 0 216 164" shapeRendering="crispEdges" style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={0} width={216} height={164} fill="#2B2F4A" />
        {Array.from({ length: 40 }, (_, i) => <rect key={i} x={Math.floor(rnd(i, 2) * 216)} y={Math.floor(rnd(i, 3) * 70)} width={1} height={1} fill={Math.sin(t * 6 + i) > 0.3 ? "#FFF6C2" : "#5A6390"} />)}
        <rect x={168} y={14} width={14} height={14} fill="#FFF6C2" /><rect x={172} y={12} width={10} height={2} fill="#FFF6C2" /><rect x={174} y={14} width={8} height={8} fill="#2B2F4A" />
        <rect x={0} y={112} width={216} height={52} fill="#3B3346" />
        <rect x={20} y={108} width={176} height={6} fill="#7A4B26" />
        <rect x={150} y={60} width={26} height={30} fill="#FFE58A" opacity={0.18 + 0.05 * Math.sin(t * 3)} />
        <rect x={158} y={84} width={2} height={24} fill="#5A6270" /><rect x={152} y={82} width={14} height={4} fill="#5A6270" />
      </svg>
      <div style={{ position: "absolute", right: 46, top: 230, ...popStyle(t, 0.0, 10, 0.9) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, color: "#FFE58A", background: "#141414", border: "5px solid #FFE58A", borderRadius: 12, padding: "4px 18px", fontVariantNumeric: "tabular-nums" }}>21:{String(mm).padStart(2, "0")}</div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 330 }}>
        <PixelBot px={15} t={t} prop="laptop" />
      </div>
      {Array.from({ length: papers }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: 470 + i * 10, top: 520 - i * 14, width: 120, height: 150, background: "#FFF", border: "3px solid #2C2420", transform: `rotate(${(rnd(i, 4) - 0.5) * 14}deg)`, ...popStyle(t, 0.3 + i * 0.28, 12, 0.6) }}>
          {[0.8, 0.6, 0.7].map((w, j) => <div key={j} style={{ margin: "14px 12px 0", height: 8, width: `${w * 80}%`, background: "#C9C5BC" }} />)}
        </div>
      ))}
      <div style={{ position: "absolute", left: 300, top: 300, fontFamily: PIXEL, fontSize: 40, color: "#FFF6C2", opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 2)) }}>z z Z</div>
      {t > A.oder - 0.05 ? <Stamp t={t} at={A.oder - 0.05} text="ABENDS?" size={70} rot={-8} style={{ left: 330, top: 470 }} /> : null}
    </>
  );
};

// ---------- v2 full: the customer's table, two competitor offers already there ----------
const FullTisch: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", ...popStyle(t, A.dann - 0.05, 12, 0.6) }}><PixelText text="BEIM KUNDEN" size={58} /></div>
    <Card style={{ left: 90, top: 300, width: 900, height: 420, padding: 30, boxSizing: "border-box", ...popStyle(t, A.dann, 20, 0.8) }}>
      <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>TISCH · FRAU BECKER</div>
      {[{ n: "Malerbetrieb Kraus", x: 30, r: -6, a: A.zwei0 - 0.1 }, { n: "Farbwerk Süd", x: 470, r: 5, a: A.andere }].map((o, i) => (
        <div key={i} style={{ position: "absolute", left: o.x, top: 80, width: 380, height: 300, background: "#FFF", border: `3px solid ${C.line}`, borderRadius: 14, boxShadow: shadow, padding: 22, boxSizing: "border-box", transform: `rotate(${o.r}deg) ${popStyle(t, o.a, 80, 0.5).transform}`, opacity: k(t, o.a, 0.12) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><PdfIcon size={44} /><div style={{ fontFamily: fonts.bold, fontSize: 30, color: C.ink }}>{o.n}</div></div>
          {[0.9, 0.7, 0.8].map((w, j) => <div key={j} style={{ height: 12, width: `${w * 100}%`, background: "#E4E1DA", borderRadius: 6, marginTop: 18 }} />)}
          <div style={{ position: "absolute", left: 22, bottom: 20 }}><Tag text={`ANGEBOT ${i + 1}`} color={C.ink} size={20} /></div>
        </div>
      ))}
    </Card>
    <Bot t={t} prop="pdf" hat="helmet" grey px={14} x={60} y={980} a={A.zwei0 - 0.2} seed={1} />
    <Bot t={t} prop="pdf" hat="cap" grey px={14} x={720} y={1010} a={A.andere - 0.1} seed={2} flip />
    <div style={{ position: "absolute", left: 400, top: 1160, ...popStyle(t, A.tisch - 0.05, 20, 0.4) }}>
      <PixelBot px={16} t={t} prop="question" />
    </div>
    {t > A.tisch ? <Stamp t={t} at={A.tisch} text="DEINS FEHLT." size={68} rot={-7} style={{ left: 250, top: 1350 }} /> : null}
  </>
);

// ---------- v2 full: "So geht's" with three bots holding 1 2 3 ----------
const FullSoGehts: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", ...popStyle(t, A.so - 0.1, 14, 0.4) }}><PixelText text="SO GEHT'S" size={96} color="#2C2420" bg={C.gold} /></div>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: 90 + i * 320, top: 1060, ...popStyle(t, A.so - 0.1 + i * 0.07, 40, 0.3) }}>
        <div style={{ position: "absolute", top: -110, fontFamily: PIXEL, fontSize: 90, color: "#FFF", background: C.orange, border: "6px solid #2C2420", width: 120, textAlign: "center", left: 50 }}>{i + 1}</div>
        <PixelBot px={17} t={t} seed={i} hat={(["helmet", "cap", "crown"] as BotHat[])[i]} />
      </div>
    ))}
  </>
);

// ---------- v2 full: the four facts from the voice message as a 2x2 grid of bots ----------
const FACT_TILES: { label: string; prop: BotProp; a: () => number; c: string }[] = [
  { label: "3 ZIMMER", prop: "roller", a: () => A.drei, c: C.orange },
  { label: "DECKE", prop: "ladder", a: () => A.decke, c: "#3E8EF7" },
  { label: "ALTBAU", prop: "brick", a: () => A.altbau, c: C.red },
  { label: "NOVEMBER", prop: "calendar", a: () => A.november, c: C.green },
];
const FullFakten: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", ...popStyle(t, A.drei - 0.1, 10, 0.7) }}><LabelChip text="Claude hört raus" dot={C.orange} size={36} /></div>
    {FACT_TILES.map((f, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const a = f.a() - 0.08;
      return (
        <div key={i} style={{ position: "absolute", left: 70 + col * 480, top: row === 0 ? 230 : 920, width: 460, height: 500, ...popStyle(t, a, 50, 0.4) }}>
          <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 22, boxShadow: shadow, border: `5px solid ${f.c}` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}><PixelBot px={14} t={t} prop={f.prop} seed={i} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center" }}><Tag text={f.label} color={f.c} size={38} /></div>
        </div>
      );
    })}
  </>
);

// ---------- v2 full: "Und das Beste" ----------
const FullBeste: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", ...popStyle(t, A.beste - 0.3, 14, 0.3) }}>
      <PixelText text="UND DAS BESTE" size={80} color="#2C2420" bg={C.gold} style={{ transform: `rotate(-3deg) translateX(${shakeAt(t, A.beste - 0.1, 8)}px)` }} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 980, ...popStyle(t, A.beste - 0.35, 40, 0.3) }}><PixelBot px={20} t={t} prop="megaphone" hat="crown" /></div>
    {Array.from({ length: 10 }, (_, i) => {
      const a = A.beste - 0.3 + i * 0.05;
      return t > a ? <div key={i} style={{ position: "absolute", left: 540 + Math.cos(i * 0.63) * (200 + 300 * k(t, a, 0.6)), top: 1150 + Math.sin(i * 0.63) * (200 + 300 * k(t, a, 0.6)), width: 22, height: 22, background: i % 2 ? C.gold : C.orange, transform: "rotate(45deg)", opacity: 1 - k(t, a + 0.4, 0.3) }} /> : null;
    })}
  </>
);

// ---------- v2 full: pixel street with our bot sending first, grey bots still calling back ----------
const FullStreet: React.FC<{ t: number }> = ({ t }) => {
  const from = A.schickst - 0.08;
  const u = t - from;
  const plane = k(t, from + 0.15, 0.85, Easing.inOut(Easing.cubic));
  const px = interpolate(plane, [0, 1], [300, 520]), py = interpolate(plane, [0, 1], [1080, 940]) - Math.sin(plane * Math.PI) * 220;
  const hit = t > from + 1.0;
  const flag = hit ? k(t, from + 1.0, 0.2) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.04 * k(t, from, 2.2, Easing.inOut(Easing.sin))})`, transformOrigin: "50% 60%" }}>
        <Street t={t} />
        <div style={{ position: "absolute", left: 572, top: 920, width: 16, height: 60, background: C.red, transformOrigin: "50% 100%", transform: `rotate(${-90 + 90 * flag}deg)` }} />
        <div style={{ position: "absolute", left: 120, top: 1110 }}><PixelBot px={11} t={t} prop="plane" /></div>
        {!hit ? (
          <div style={{ position: "absolute", left: px, top: py, transform: `rotate(${interpolate(plane, [0, 0.5, 1], [-20, 0, 25])}deg)` }}>
            <svg width={90} height={60} viewBox="0 0 30 20" shapeRendering="crispEdges"><polygon points="0,10 30,0 22,20 14,13" fill="#FFF" stroke="#2C2420" strokeWidth={0.8} /></svg>
          </div>
        ) : null}
        {[{ x: 640, y: 1360 }, { x: 860, y: 1390 }].map((c, i) => (
          <div key={i} style={{ position: "absolute", left: c.x, top: c.y }}>
            <PixelBot px={8} t={t} prop="phone" grey seed={i + 3} hat={i ? "cap" : "helmet"} />
            <div style={{ position: "absolute", left: -40, top: -70, fontFamily: PIXEL, fontSize: 24, color: "#2C2420", background: "#FFF", border: "4px solid #2C2420", padding: "6px 10px", whiteSpace: "nowrap" }}>RÜCKRUF{".".repeat(1 + (Math.floor(u * 3 + i) % 3))}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", ...popStyle(t, from + 1.0, 12, 0.5) }}>
        <PixelText text="ANGEBOT ZUGESTELLT" size={50} color="#2C2420" bg={C.gold} style={{ transform: `translateX(${shakeAt(t, from + 1.0, 6)}px)` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", ...popStyle(t, A.anderen - 0.05, 10, 0.6) }}><PixelText text="PLATZ 1" size={40} /></div>
    </AbsoluteFill>
  );
};

// ---------- v2 end: guide chips while the PDF scrolls, then follow + comment card ----------
const SceneGuideEnd: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.komm - 0.12) {
    return (
      <>
        <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
          {t > A.anleitung - 0.05 ? <div style={popStyle(t, A.anleitung - 0.05, 10, 0.6)}><Tag text="✓ ANLEITUNG" color={C.orange} size={30} /></div> : null}
          {t > A.prompt - 0.05 ? <div style={popStyle(t, A.prompt - 0.05, 10, 0.6)}><Tag text="✓ PROMPT ZUM KOPIEREN" color={C.ink} size={30} /></div> : null}
          {t > A.guide - 0.1 ? <div style={popStyle(t, A.guide - 0.1, 10, 0.6)}><Tag text="✓ 6 SEITEN GUIDE" color={C.green} size={30} /></div> : null}
        </div>
        <Bot t={t} prop="pdf" px={12} x={720} y={420} a={A.anleitung - 0.1} />
      </>
    );
  }
  const followed = t > A.folg + 0.25;
  const typedWord = typed("ANGEBOT", t, A.angebot3 - 0.1, A.angebot3 + 0.3);
  return (
    <>
      <Card style={{ left: 120, top: 180, width: 840, height: 420, padding: "34px 40px", boxSizing: "border-box", ...popStyle(t, A.komm - 0.12, 30, 0.7) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.red, color: "#FFF", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg,#3E8EF7,#9B5DE5)" }} />
          <div><div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink }}>Folgen</div><div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>@florent_preusser</div></div>
          <div style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: followed ? C.ink : "#FFF", background: followed ? "#EFEDE8" : "#3E8EF7", borderRadius: 14, padding: "14px 28px", transform: `scale(${1 - 0.08 * (t > A.folg + 0.15 && t < A.folg + 0.3 ? 1 : 0)})` }}>{followed ? "Gefolgt" : "Folgen"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.red, color: "#FFF", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink }}>Kommentieren</div>
          <div style={{ marginLeft: "auto", width: 360, height: 76, borderRadius: 14, border: `4px solid ${typedWord ? C.red : C.line}`, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.ink, letterSpacing: "0.08em" }}>
            {typedWord || <span style={{ fontFamily: fonts.medium, fontSize: 26, color: C.dim, letterSpacing: 0 }}>Kommentar …</span>}<span style={{ opacity: Math.floor(t * 4) % 2 ? 1 : 0 }}>|</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 26, fontFamily: fonts.medium, fontSize: 24, color: C.dim }}>➤ Ich schick dir die Anleitung per DM</div>
      </Card>
      <Bot t={t} prop="megaphone" px={9} x={820} y={620} a={A.komm} />
    </>
  );
};

type SceneV2 = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean; bot?: { prop: BotProp; hat?: BotHat; x: number; y: number; px?: number; a?: number } };
const SCENES_V2: SceneV2[] = [
  { from: 0, to: A.dann - 0.05, origin: "50% 50%", El: NightHook },
  { from: A.dann - 0.05, to: A.mit - 0.05, origin: "50% 40%", El: FullTisch, full: true },
  { from: A.mit - 0.05, to: A.so - 0.1, origin: "50% 45%", El: SceneTwoMin, bot: { prop: "stopwatch", x: 760, y: 470, px: 13, a: A.raus - 0.1 } },
  { from: A.so - 0.1, to: A.schritt0 - 0.05, origin: "50% 40%", El: FullSoGehts, full: true },
  { from: A.schritt0 - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneProjekt, bot: { prop: "folder", x: 760, y: 560, px: 12, a: A.einmal - 0.1 } },
  { from: A.schritt1 - 0.05, to: A.drei - 0.12, origin: "50% 50%", El: SceneVoice, bot: { prop: "headphones", x: 790, y: 520, px: 13, a: A.schickt } },
  { from: A.drei - 0.12, to: A.text - 0.6, origin: "50% 50%", El: FullFakten, full: true },
  { from: A.text - 0.6, to: A.beste - 0.4, origin: "50% 45%", El: ScenePositionen, bot: { prop: "calc", x: 800, y: 560, px: 12, a: A.daraus } },
  { from: A.beste - 0.4, to: A.fehlt0, origin: "50% 50%", El: FullBeste, full: true },
  { from: A.fehlt0, to: A.schritt2 - 0.05, origin: "50% 50%", El: SceneFrage, bot: { prop: "magnifier", x: 380, y: 540, px: 11, a: A.fragt - 0.1 } },
  { from: A.schritt2 - 0.05, to: A.schickst - 0.08, origin: "50% 45%", El: ScenePdf, bot: { prop: "stamp", x: 10, y: 520, px: 12, a: A.frist - 0.3 } },
  { from: A.schickst - 0.08, to: A.anleitung - 0.1, origin: "50% 50%", El: FullStreet, full: true },
  { from: A.anleitung - 0.1, to: 999, origin: "50% 45%", El: SceneGuideEnd },
];

type Scene = { from: number; to: number; origin: string; El: React.FC<{ t: number }> };
const SCENES: Scene[] = [
  { from: 0, to: A.mit - 0.05, origin: "50% 50%", El: SceneHook },
  { from: A.mit - 0.05, to: A.so - 0.05, origin: "50% 45%", El: SceneTwoMin },
  { from: A.so - 0.05, to: A.schritt1 - 0.05, origin: "50% 45%", El: SceneProjekt },
  { from: A.schritt1 - 0.05, to: A.text - 0.2, origin: "50% 50%", El: SceneVoice },
  { from: A.text - 0.2, to: A.beste - 0.1, origin: "50% 45%", El: ScenePositionen },
  { from: A.beste - 0.1, to: A.schritt2 - 0.05, origin: "50% 50%", El: SceneFrage },
  { from: A.schritt2 - 0.05, to: 999, origin: "50% 45%", El: ScenePdf },
];

// ---------- captions: orange pill on the seam, active word in a black pill ----------
const chunks = (() => {
  const out: { start: number; end: number; words: { w: string; s: number }[] }[] = [];
  let cur: Cap[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => ({ w: c.text.replace(/[.,!?:]/g, "").toUpperCase(), s: c.startMs / 1000 })) });
    cur = [];
  };
  for (const c of CAPS) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 20) || (cur.length && len > 22)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
})();
const SeamCaption: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.16);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.08), background: C.orange, borderRadius: 16, padding: "16px 22px 16px 30px", fontFamily: MONO, fontWeight: 700, fontSize: 46, letterSpacing: "0.14em", color: "#FFF", whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(120,50,25,0.30)" }}>
        {(() => {
          const cw = 46 * 0.74, gapW = 46 * 0.5;
          const xs: number[] = []; let acc = 0;
          c.words.forEach((w) => { xs.push(acc); acc += w.w.length * cw + gapW; });
          const ws = c.words.map((w) => w.w.length * cw - 46 * 0.14);
          let i = c.words.findIndex((w, j) => j + 1 >= c.words.length || t < c.words[j + 1].s - 0.03);
          if (i < 0) i = c.words.length - 1;
          const prev = Math.max(0, i - 1);
          const q = i === 0 ? 1 : interpolate(t, [c.words[i].s - 0.03, c.words[i].s + 0.05], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
          const px = xs[prev] + (xs[i] - xs[prev]) * q, pw = ws[prev] + (ws[i] - ws[prev]) * q;
          return (
            <div style={{ position: "relative", display: "flex", gap: gapW }}>
              <div style={{ position: "absolute", left: px - 12, top: -4, width: pw + 24, bottom: -4, background: "#111111", borderRadius: 10, boxShadow: "0 4px 10px rgba(0,0,0,0.22)" }} />
              {c.words.map((w, j) => <span key={j} style={{ position: "relative", display: "inline-block", color: "#FFFFFF" }}>{w.w}</span>)}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

// ---------- guide scroll (real PDF pages) ----------
const PAGES = [1, 2, 3, 4, 5, 6].map((n) => staticFile(`angebot-guide/p${n}.png`));
const PDF = { left: 120, top: 560, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 842) / 595), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.anleitung - 0.1;
export const PDF_OUT = A.komm - 0.32;
const SCROLL_A = PDF_IN + 0.3, SCROLL_B = PDF_OUT - 0.1;
const SAMPLES = 8, SHUTTER = 0.6 / FPS;
const scrollY = (t: number) => interpolate(t, [SCROLL_A, SCROLL_B], [0, (PAGES.length - 1) * PITCH], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const PdfScroll: React.FC<{ t: number }> = ({ t }) => {
  if (t < PDF_IN || t > PDF_OUT + 0.32) return null;
  const inY = interpolate(t, [PDF_IN, PDF_IN + 0.3], [PDF.h + 700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const outY = interpolate(t, [PDF_OUT, PDF_OUT + 0.3], [0, PDF.h + 700], { ...clamp, easing: Easing.in(Easing.cubic) });
  const y = scrollY(t);
  const page = Math.min(PAGES.length, Math.max(1, Math.floor((y + (PDF.h - PDF.bar) / 2) / PITCH) + 1));
  const tilt = interpolate(t, [PDF_IN, PDF_IN + 0.3], [-4, 0], clamp) + interpolate(t, [PDF_OUT, PDF_OUT + 0.3], [0, 4], clamp);
  return (
    <div style={{ position: "absolute", left: PDF.left, top: PDF.top, width: PDF.w, height: PDF.h, borderRadius: 26, overflow: "hidden", background: "#E9E7E1", boxShadow: "0 40px 90px rgba(0,0,0,0.45), 0 6px 16px rgba(0,0,0,0.25)", transform: `translateY(${inY + outY}px) rotate(${tilt}deg)`, zIndex: 40 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: PDF.bar, background: C.chip, display: "flex", alignItems: "center", padding: "0 26px", gap: 14, zIndex: 2 }}>
        <PdfIcon size={40} />
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Angebot – Guidebook.pdf</div>
        <div style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 800, fontSize: 26, color: "#FFF", background: C.orange, borderRadius: 10, padding: "6px 14px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{page} / {PAGES.length}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PDF.bar, bottom: 0, overflow: "hidden" }}>
        {Array.from({ length: SAMPLES }, (_, j) => {
          const yy = scrollY(t - (j / (SAMPLES - 1)) * SHUTTER);
          return (
            <div key={j} style={{ position: "absolute", left: (PDF.w - PDF.pw) / 2, top: 22 - yy, opacity: 1 / (j + 1) }}>
              {PAGES.map((src, i) => <Img key={i} src={src} style={{ position: "absolute", left: 0, top: i * PITCH, width: PDF.pw, height: PDF.ph, borderRadius: 6, boxShadow: "0 8px 22px rgba(0,0,0,0.18)" }} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- master ----------
const FOCUS = { x: 0.51, y: 0.597, scale: 1.0 };
const CTA = A.komm - 0.12;
const SPLIT_SRC_TOP = 430;
const CHEST_Y = 1540;
export const AngebotOpus: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scene = SCENES_V2.find((s) => t >= s.from && t < s.to) ?? SCENES_V2[SCENES_V2.length - 1];
  const cam = camera(t, scene.from, scene.to);
  const dx = Math.sin(t * 0.6) * 6, dy = Math.cos(t * 0.45) * 5;
  const s = FOCUS.scale, vw = W * s, vh = H * s;
  const vLeft = Math.min(0, Math.max(W - vw, W / 2 - FOCUS.x * vw));
  const vTop = Math.min(PH, Math.max(H - vh, PH - SPLIT_SRC_TOP * s));
  const avPush = 1 + 0.035 * Math.abs(Math.sin((t - scene.from) * 0.9));
  const El = scene.El;
  const fullHeight = scene.full ? H : PH;
  const isStreet = El === FullStreet;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avPush})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile("render-fpn-angebot-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {isStreet ? <FullStreet t={t} /> : (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: fullHeight, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
          <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
          <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
            <El t={t} />
            {scene.bot ? <Bot t={t} prop={scene.bot.prop} hat={scene.bot.hat} px={scene.bot.px ?? 8} x={scene.bot.x} y={scene.bot.y} a={scene.bot.a ?? scene.from + 0.2} /> : null}
          </div>
          {t < A.mit - 0.05 && !scene.full ? <HookPills t={t} /> : null}
        </div>
      )}
      <PdfScroll t={t} />
      <SeamCaption t={t} y={PH} />
    </AbsoluteFill>
  );
};
