import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import captions from "../../runs/fpn-datenschutz/captions.json";
import { PixelBot, BotProp, BotHat } from "../components/PixelBot";

// FP-N "Datenschutzerklärung" (Pius 2026-10-19), v2-Stil wie AngebotOpus: split + five full-frame cream moments,
// our own PixelBot in every scene, follow + comment card at the end. Company names and services are invented/generic.
// Timings are anchored to the word timings of the tightened timeline (captions.json).

const FPS = 25;
const W = 1080;
const H = 1920;
const PH = 820;

type Cap = { text: string; startMs: number; endMs: number };
const CAPS = captions as Cap[];
const LAST_END = CAPS[CAPS.length - 1].endMs / 1000;
export const DS_END = LAST_END + 0.7;
export const DS_FRAMES = Math.round(DS_END * FPS);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const WORDS = CAPS.map((c) => ({ w: norm(c.text), s: c.startMs / 1000, e: c.endMs / 1000 }));
const at = (word: string, n = 0, end = false) => {
  const m = WORDS.filter((x) => x.w === word);
  const x = m[Math.min(n, m.length - 1)];
  if (!x) throw new Error(`anchor not found: ${word}#${n}`);
  return end ? x.e : x.s;
};
export const A = {
  kopiert: at("kopiert"), website: at("website"), dreimal: at("dreimal"), geaendert: at("geändert"),
  fehlt0: at("fehlt", 0), dienst0: at("dienst", 0), verbraucher: at("verbraucherverbände"), abmahnen: at("abmahnen"),
  claude0: at("claude", 0), luecken: at("lücken"), minuten: at("minuten"), ohne: at("ohne"), euro: at("euro"), anwalt: at("anwalt"),
  so: at("so"), schritt0: at("schritt", 0), rechtsklick: at("rechtsklick"), quelltext: at("seitenquelltext"), kopieren: at("kopieren"),
  listet: at("listet"), shop: at("shop"), newsletter: at("newsletter"), termin: at("terminkalender"),
  schritt1: at("schritt", 1), spaeter: at("später"), scanner: at("scanner"), liste: at("liste"), dazu: at("dazu"),
  jetzt: at("jetzt"), trick: at("trick"), schritt2: at("schritt", 2), alte: at("alte"), daneben: at("daneben"), markiert: at("markiert"),
  fehlt1: at("fehlt", 1), schreibt: at("schreibt"), abschnitt: at("abschnitt"),
  welche: at("welche"), wen: at("wen"), wozu: at("wozu"), lange: at("lange"),
  genauen: at("genauen"), prompts: at("prompts"), guide: at("guide"), komm: at("kommentiere"), erklaerung1: at("erklärung", 1), folg: at("folg"),
};

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

const PixelText: React.FC<{ text: string; size: number; color?: string; bg?: string; style?: React.CSSProperties }> = ({ text, size, color = "#FFF", bg = "#2C2420", style }) => (
  <div style={{ fontFamily: PIXEL, fontSize: size, color, background: bg, padding: `${size * 0.25}px ${size * 0.45}px`, border: `${Math.max(4, size * 0.09)}px solid ${C.gold}`, boxShadow: `0 ${size * 0.12}px 0 #6B4528`, whiteSpace: "nowrap", lineHeight: 1, ...style }}>{text}</div>
);
const Bot: React.FC<{ t: number; prop?: BotProp; hat?: BotHat; px?: number; x: number; y: number; a?: number; flip?: boolean; seed?: number; grey?: boolean }> = ({ t, prop = "none", hat = "none", px = 7, x, y, a = -1, flip, seed = 0, grey }) => {
  const st = a >= 0 ? popStyle(t, a, 26, 0.3) : {};
  const hop = Math.abs(Math.sin(t * 5 + seed)) * -8;
  return (
    <div style={{ position: "absolute", left: x, top: y, ...st }}>
      <div style={{ transform: `translateY(${hop}px)` }}><PixelBot px={px} t={t} prop={prop} hat={hat} flip={flip} seed={seed} grey={grey} /></div>
    </div>
  );
};

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



// ---------- Hook (split): a small business website grows, the privacy policy stays copied ----------
const HookPills: React.FC<{ t: number }> = ({ t }) => {
  const m = k(t, 0.95, 0.35, Easing.inOut(Easing.cubic));
  const pill: React.CSSProperties = { background: "#111", color: "#FFF", fontFamily: fonts.bold, fontSize: 60, padding: "10px 26px", borderRadius: 16, whiteSpace: "nowrap", lineHeight: 1.15 };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 36, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
      <div style={{ ...pill, background: "#FFF", color: C.ink, boxShadow: shadow, position: "relative" }}>
        Anwalt 350 €
        <div style={{ position: "absolute", left: 20, right: 20, top: "52%", height: 7, background: C.red, borderRadius: 4, transform: `scaleX(${k(t, 0.45, 0.3)})`, transformOrigin: "0 50%" }} />
      </div>
      <div style={{ ...pill, marginTop: -6 }}>
        Claude{" "}
        <span style={{ position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", left: -8, right: -8, top: 6, bottom: 4, background: C.orange, borderRadius: 8, transform: `scaleX(${m})`, transformOrigin: "0% 50%" }} />
          <span style={{ position: "relative" }}>10 Minuten</span>
        </span>
      </div>
    </div>
  );
};
const WIDGETS = [
  { label: "Shop", c: "#3E8EF7", icon: "🛒" },
  { label: "Newsletter", c: C.green, icon: "✉" },
  { label: "Termine", c: C.red, icon: "📅" },
];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const grow = (i: number) => A.dreimal - 0.3 + i * 0.3;
  return (
    <>
      <Card style={{ left: 70, top: 250, width: 940, height: 500, overflow: "hidden" }}>
        <div style={{ height: 50, background: "#F6F5F1", borderBottom: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 8, padding: "0 18px" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />)}
          <div style={{ marginLeft: 12, flex: 1, height: 30, borderRadius: 8, background: "#FFF", border: `1.5px solid ${C.line}`, fontFamily: fonts.medium, fontSize: 18, color: "#6E6B65", display: "flex", alignItems: "center", padding: "0 12px" }}>malerbetrieb-mustermann.de</div>
        </div>
        <div style={{ padding: "24px 30px", display: "flex", gap: 22 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.bold, fontSize: 40, color: C.ink }}>Malerbetrieb Mustermann</div>
            {[0.9, 0.7, 0.8].map((w, j) => <div key={j} style={{ height: 12, width: `${w * 100}%`, background: "#E4E1DA", borderRadius: 6, marginTop: 16 }} />)}
          </div>
          <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 14 }}>
            {WIDGETS.map((w, i) => (t > grow(i) ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "#FFF", border: `3px solid ${w.c}`, borderRadius: 14, padding: "10px 14px", ...popStyle(t, grow(i), 18, 0.4) }}>
                <span style={{ fontSize: 30 }}>{w.icon}</span><span style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>{w.label}</span>
                <span style={{ marginLeft: "auto" }}><Tag text={`+${i + 1}`} color={w.c} size={16} /></span>
              </div>) : null))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 30, bottom: 22, right: 30, borderTop: `1.5px solid ${C.line}`, paddingTop: 14, display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: fonts.medium, fontSize: 24, color: C.dim }}>Impressum · <b style={{ color: C.ink }}>Datenschutz</b></span>
          {t > A.kopiert - 0.05 ? <Stamp t={t} at={A.kopiert - 0.05} text="KOPIERT 2019" size={40} rot={-6} style={{ left: 380, top: -6 }} /> : null}
        </div>
      </Card>
      <Bot t={t} prop="laptop" px={10} x={850} y={590} a={0} />
    </>
  );
};

// ---------- full: a consumer association brings the warning letter ----------
const FullAbmahnung: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", ...popStyle(t, A.fehlt0 - 0.05, 12, 0.6) }}><PixelText text="1 DIENST FEHLT" size={60} /></div>
    <div style={{ position: "absolute", left: 140, top: 290, width: 800, height: 460, background: "#FFF", borderRadius: 10, boxShadow: "0 30px 70px rgba(0,0,0,0.18)", padding: 40, boxSizing: "border-box", ...popStyle(t, A.fehlt0 + 0.25, 60, 0.6), transform: `${popStyle(t, A.fehlt0 + 0.25, 60, 0.6).transform} rotate(-3deg) translateX(${shakeAt(t, A.abmahnen, 10)}px)` }}>
      <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>VERBRAUCHERVERBAND · EINSCHREIBEN</div>
      <div style={{ marginTop: 18, fontFamily: fonts.bold, fontSize: 44, color: C.ink }}>Abmahnung</div>
      <div style={{ marginTop: 10, fontFamily: fonts.medium, fontSize: 28, color: "#3C3A36" }}>wegen unvollständiger Datenschutzerklärung</div>
      {[0.9, 0.8, 0.6].map((w, j) => <div key={j} style={{ height: 12, width: `${w * 100}%`, background: "#E4E1DA", borderRadius: 6, marginTop: 18 }} />)}
      {t > A.abmahnen ? <Stamp t={t} at={A.abmahnen} text="FRIST 14 TAGE" size={46} rot={-8} style={{ right: 30, bottom: 30 }} /> : null}
    </div>
    <Bot t={t} prop="pdf" hat="cap" grey px={14} x={80} y={1060} a={A.fehlt0 + 0.1} seed={2} />
    <div style={{ position: "absolute", left: 600, top: 1100, ...popStyle(t, A.abmahnen + 0.1, 20, 0.4) }}><PixelBot px={16} t={t} prop="question" /></div>
  </>
);

// ---------- split: lawyer vs Claude, gap counter ----------
const SceneVergleich: React.FC<{ t: number }> = ({ t }) => {
  const gaps = Math.round(interpolate(t, [A.luecken, A.minuten + 0.3], [0, 3], clamp));
  const sec = interpolate(t, [A.claude0, A.minuten + 0.5], [0, 600], clamp);
  return (
    <>
      <Card style={{ left: 70, top: 60, width: 440, height: 300, padding: 28, boxSizing: "border-box", ...popStyle(t, A.claude0 - 0.05, 20, 0.7) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><ClaudeMark size={40} /><div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink }}>Claude</div></div>
        <div style={{ marginTop: 24, fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.green, fontVariantNumeric: "tabular-nums" }}>{Math.floor(sec / 60)}:{String(Math.floor(sec % 60)).padStart(2, "0")}</div>
        <div style={{ marginTop: 10 }}><Tag text={`${gaps} LÜCKEN GEFUNDEN`} color={gaps ? C.red : C.dim} size={22} /></div>
      </Card>
      <Card style={{ left: 570, top: 60, width: 440, height: 300, padding: 28, boxSizing: "border-box", ...popStyle(t, A.ohne - 0.1, 20, 0.7) }}>
        <div style={{ fontFamily: fonts.bold, fontSize: 34, color: C.ink }}>Anwalt</div>
        <div style={{ position: "relative", marginTop: 24, fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.red, display: "inline-block" }}>
          350 €
          <div style={{ position: "absolute", left: -8, right: -8, top: "50%", height: 8, background: C.red, borderRadius: 4, transform: `scaleX(${k(t, A.anwalt, 0.3)})`, transformOrigin: "0 50%" }} />
        </div>
        <div style={{ marginTop: 10, fontFamily: fonts.medium, fontSize: 22, color: C.dim }}>für eine neue Erklärung, netto</div>
      </Card>
      <Bot t={t} prop="magnifier" px={13} x={120} y={430} a={A.luecken - 0.1} />
      {Array.from({ length: 3 }, (_, i) => (t > A.luecken + i * 0.3 ? <div key={i} style={{ position: "absolute", left: 470 + i * 170, top: 470, ...popStyle(t, A.luecken + i * 0.3, 20, 0.4) }}><Tag text="LÜCKE" color={C.red} size={28} /></div> : null))}
    </>
  );
};

// ---------- split: step 1, right click, page source, Claude's service table ----------
const SRC = ['<script src="shop-system.js">', '<link href="fonts.cdn.example">', '<iframe src="termine.example">', '<script src="newsletter.example">', '<script src="analytics.example">'];
const SERVICES = [
  { n: "Shop-System", d: "Bestellungen, Zahlungsdaten", eu: "unklar" },
  { n: "Newsletter-Tool", d: "E-Mail-Adresse", eu: "ja" },
  { n: "Terminbuchung", d: "Name, Telefon", eu: "ja" },
  { n: "Schriftarten", d: "IP-Adresse", eu: "nein" },
];
const SceneQuelltext: React.FC<{ t: number }> = ({ t }) => {
  const showTable = t > A.listet - 0.1;
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 50, ...popStyle(t, A.schritt0 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 1 · Quelltext an Claude" dot={C.orange} size={30} /></div>
      {!showTable ? (
        <>
          <div style={{ position: "absolute", left: 120, top: 160, width: 420, background: "#FFF", borderRadius: 12, boxShadow: shadow, padding: "10px 0", ...popStyle(t, A.rechtsklick - 0.05, 14, 0.7) }}>
            {["Zurück", "Neu laden", "Speichern unter …", "Seitenquelltext anzeigen", "Untersuchen"].map((m, i) => (
              <div key={i} style={{ padding: "12px 22px", fontFamily: fonts.medium, fontSize: 26, color: i === 3 ? "#FFF" : C.ink, background: i === 3 && t > A.quelltext - 0.1 ? "#3E8EF7" : "transparent" }}>{m}</div>
            ))}
          </div>
          {t > A.quelltext + 0.3 ? (
            <div style={{ position: "absolute", left: 470, top: 220, width: 540, height: 520, borderRadius: 16, background: C.term, boxShadow: "0 30px 60px rgba(0,0,0,0.3)", padding: "20px 22px", boxSizing: "border-box", ...popStyle(t, A.quelltext + 0.3, 20, 0.8) }}>
              {SRC.map((l, i) => (
                <div key={i} style={{ fontFamily: MONO, fontSize: 21, lineHeight: 2.0, color: t > A.kopieren + i * 0.1 ? "#FFE58A" : "rgba(236,233,226,0.75)", background: t > A.kopieren + i * 0.1 ? "rgba(217,119,87,0.25)" : "transparent", whiteSpace: "nowrap", overflow: "hidden" }}>{l}</div>
              ))}
              {t > A.kopieren ? <div style={{ position: "absolute", right: 18, bottom: 18, ...popStyle(t, A.kopieren, 10, 0.6) }}><Tag text="KOPIERT ✓" color={C.green} size={20} /></div> : null}
            </div>
          ) : null}
        </>
      ) : (
        <Card style={{ left: 70, top: 140, width: 940, height: 620, overflow: "hidden", ...popStyle(t, A.listet - 0.1, 20, 0.85) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 26px", borderBottom: `1.5px solid ${C.line}` }}><ClaudeMark size={34} /><div style={{ fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}>Dienste auf deiner Seite</div><div style={{ marginLeft: "auto" }}><Tag text="BEISPIEL" color={C.dim} size={16} /></div></div>
          <div style={{ padding: "8px 26px" }}>
            <div style={{ display: "flex", fontFamily: MONO, fontSize: 17, color: C.dim, padding: "10px 0", borderBottom: `1.5px solid ${C.line}` }}><span style={{ flex: 1 }}>DIENST</span><span style={{ width: 340 }}>DATEN</span><span style={{ width: 120 }}>EU?</span></div>
            {SERVICES.map((r, i) => (t > A.listet + i * 0.25 ? (
              <div key={i} style={{ display: "flex", alignItems: "center", height: 92, borderBottom: `1px solid ${C.line}`, fontFamily: fonts.medium, fontSize: 28, color: C.ink, ...popStyle(t, A.listet + i * 0.25, 12, 0.9) }}>
                <span style={{ flex: 1, fontFamily: fonts.semibold }}>{r.n}</span><span style={{ width: 340, color: "#3C3A36" }}>{r.d}</span>
                <span style={{ width: 120 }}><Tag text={r.eu.toUpperCase()} color={r.eu === "ja" ? C.green : r.eu === "nein" ? C.red : C.dim} size={16} /></span>
              </div>) : null))}
          </div>
        </Card>
      )}
      <Bot t={t} prop="copy" px={11} x={830} y={30} a={A.rechtsklick} />
    </>
  );
};

// ---------- full: shop, newsletter, calendar as three tiles ----------
const TRIO: { label: string; prop: BotProp; a: () => number; c: string }[] = [
  { label: "SHOP", prop: "laptop", a: () => A.shop, c: "#3E8EF7" },
  { label: "NEWSLETTER", prop: "megaphone", a: () => A.newsletter, c: C.green },
  { label: "TERMINE", prop: "calendar", a: () => A.termin, c: C.red },
];
const FullTrio: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", ...popStyle(t, A.shop - 0.1, 10, 0.7) }}><LabelChip text="Jeder schickt Daten weiter" dot={C.red} size={36} /></div>
    {TRIO.map((f, i) => (
      <div key={i} style={{ position: "absolute", left: 50 + (i % 2) * 500 + (i === 2 ? 250 : 0), top: i < 2 ? 260 : 920, width: 480, height: 560, ...popStyle(t, f.a() - 0.08, 50, 0.4) }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 22, boxShadow: shadow, border: `5px solid ${f.c}` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center" }}><PixelBot px={15} t={t} prop={f.prop} seed={i} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center" }}><Tag text={f.label} color={f.c} size={38} /></div>
      </div>
    ))}
  </>
);

// ---------- split: step 2, scanner finds what loads later, list flies to Claude ----------
const LATER = ["maps.example", "video.example", "fonts.cdn.example", "chat-widget.example", "pixel.example"];
const SceneScanner: React.FC<{ t: number }> = ({ t }) => {
  const fly = k(t, A.dazu - 0.2, 0.45, Easing.inOut(Easing.cubic));
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 50, ...popStyle(t, A.schritt1 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 2 · kostenloser Scanner" dot={C.green} size={30} /></div>
      <Card style={{ left: 70, top: 150, width: 560, height: 610, overflow: "hidden", transform: `translateX(${fly * 120}px) scale(${1 - fly * 0.25})`, opacity: 1 - fly * 0.6, ...{} }}>
        <div style={{ padding: "18px 24px", borderBottom: `1.5px solid ${C.line}`, fontFamily: fonts.semibold, fontSize: 26, color: C.ink }}>Scanner · nachgeladen</div>
        <div style={{ position: "absolute", left: 30, top: 90, width: 200, height: 200 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `4px solid ${C.green}`, opacity: 0.4 }} />
          <div style={{ position: "absolute", left: 96, top: 0, width: 8, height: 100, background: C.green, transformOrigin: "50% 100%", transform: `rotate(${t * 300}deg)` }} />
        </div>
        <div style={{ position: "absolute", left: 250, top: 90, right: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          {LATER.map((d, i) => (t > A.spaeter + i * 0.22 ? <div key={i} style={{ fontFamily: MONO, fontSize: 20, color: C.ink, background: C.orangeSoft, borderRadius: 8, padding: "8px 12px", ...popStyle(t, A.spaeter + i * 0.22, 10, 0.7) }}>{d}</div> : null))}
        </div>
        <div style={{ position: "absolute", left: 24, bottom: 20 }}><Tag text={`${Math.min(LATER.length, Math.max(0, Math.floor((t - A.spaeter) / 0.22) + 1))} NACHGELADEN`} color={C.ink} size={20} /></div>
      </Card>
      {t > A.liste - 0.1 ? (
        <Card style={{ left: 680, top: 260, width: 330, height: 300, padding: 22, boxSizing: "border-box", ...popStyle(t, A.liste - 0.1, 20, 0.7) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={30} /><div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>Claude</div></div>
          <div style={{ marginTop: 18, fontFamily: fonts.medium, fontSize: 24, color: C.ink }}>+ {LATER.length} Dienste ergänzt</div>
          <div style={{ marginTop: 12 }}><Tag text="NACHGELADEN" color={C.orange} size={18} /></div>
        </Card>
      ) : null}
      <Bot t={t} prop="magnifier" px={11} x={820} y={40} a={A.scanner - 0.1} />
    </>
  );
};

// ---------- full: the trick ----------
const FullTrick: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", ...popStyle(t, A.jetzt - 0.2, 14, 0.3) }}>
      <PixelText text="JETZT DER TRICK" size={78} color="#2C2420" bg={C.gold} style={{ transform: `rotate(-3deg) translateX(${shakeAt(t, A.trick, 8)}px)` }} />
    </div>
    <div style={{ position: "absolute", left: 300, top: 980, ...popStyle(t, A.jetzt - 0.25, 40, 0.3) }}><PixelBot px={20} t={t} prop="megaphone" hat="crown" /></div>
    {Array.from({ length: 10 }, (_, i) => {
      const a = A.jetzt - 0.2 + i * 0.05;
      return t > a ? <div key={i} style={{ position: "absolute", left: 540 + Math.cos(i * 0.63) * (200 + 300 * k(t, a, 0.6)), top: 1150 + Math.sin(i * 0.63) * (200 + 300 * k(t, a, 0.6)), width: 22, height: 22, background: i % 2 ? C.gold : C.orange, transform: "rotate(45deg)", opacity: 1 - k(t, a + 0.4, 0.3) }} /> : null;
    })}
  </>
);

// ---------- split: step 3, old policy vs table, FEHLT markers, new section typed ----------
const OLD = ["Hosting", "Kontaktformular", "Schriftarten"];
const MISSING = ["Shop-System", "Newsletter-Tool", "Terminbuchung"];
const SceneAbgleich: React.FC<{ t: number }> = ({ t }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 50, ...popStyle(t, A.schritt2 - 0.05, 10, 0.8) }}><LabelChip text="Schritt 3 · Abgleich" dot={C.orange} size={30} /></div>
    <Card style={{ left: 70, top: 140, width: 440, height: 620, padding: 26, boxSizing: "border-box", ...popStyle(t, A.schritt2 + 0.15, 20, 0.8) }}>
      <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>ALTE ERKLÄRUNG</div>
      {OLD.map((o, i) => <div key={i} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.semibold, fontSize: 28, color: C.ink }}><Check size={30} color={C.green} />{o}</div>)}
      {MISSING.map((o, i) => (t > A.markiert + i * 0.18 ? <div key={i} style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.semibold, fontSize: 28, color: C.red, ...popStyle(t, A.markiert + i * 0.18, 10, 0.7) }}><Cross size={30} color={C.red} />{o}<Tag text="FEHLT" color={C.red} size={16} /></div> : null))}
    </Card>
    <Card style={{ left: 540, top: 140, width: 470, height: 620, padding: 26, boxSizing: "border-box", border: `4px solid ${C.green}`, ...popStyle(t, A.schreibt - 0.1, 20, 0.8) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClaudeMark size={30} /><div style={{ fontFamily: fonts.semibold, fontSize: 24, color: C.ink }}>Neuer Abschnitt</div></div>
      <div style={{ marginTop: 16, fontFamily: fonts.bold, fontSize: 28, color: C.ink }}>Newsletter-Tool</div>
      <div style={{ marginTop: 10, fontFamily: fonts.medium, fontSize: 23, lineHeight: 1.45, color: "#3C3A36" }}>
        {typed("Wir nutzen ein Newsletter-Tool, um dir E-Mails zu schicken. Dabei wird deine E-Mail-Adresse an den Anbieter übermittelt, Rechtsgrundlage ist deine Einwilligung …", t, A.schreibt, A.abschnitt + 0.9)}
      </div>
      <div style={{ position: "absolute", left: 26, bottom: 22 }}><Tag text="ENTWURF" color={C.dim} size={16} /></div>
    </Card>
    <Bot t={t} prop="stamp" px={11} x={850} y={40} a={A.markiert - 0.1} />
  </>
);

// ---------- full: which data, to whom, why, how long ----------
const FOUR: { label: string; prop: BotProp; a: () => number; c: string }[] = [
  { label: "WELCHE DATEN", prop: "folder", a: () => A.welche, c: C.orange },
  { label: "AN WEN", prop: "plane", a: () => A.wen, c: "#3E8EF7" },
  { label: "WOZU", prop: "question", a: () => A.wozu, c: C.green },
  { label: "WIE LANGE", prop: "stopwatch", a: () => A.lange, c: C.red },
];
const FullVier: React.FC<{ t: number }> = ({ t }) => (
  <>
    {FOUR.map((f, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      return (
        <div key={i} style={{ position: "absolute", left: 70 + col * 480, top: row === 0 ? 180 : 920, width: 460, height: 520, ...popStyle(t, f.a() - 0.1, 50, 0.4) }}>
          <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 22, boxShadow: shadow, border: `5px solid ${f.c}` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 50, display: "flex", justifyContent: "center" }}><PixelBot px={14} t={t} prop={f.prop} seed={i} /></div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center" }}><Tag text={f.label} color={f.c} size={34} /></div>
        </div>
      );
    })}
  </>
);

// ---------- end: guide chips while the PDF scrolls, then follow + comment card ----------
const SceneEnd: React.FC<{ t: number }> = ({ t }) => {
  if (t < A.komm - 0.12) {
    return (
      <>
        <div style={{ position: "absolute", left: 70, top: 60, display: "flex", flexDirection: "column", gap: 22 }}>
          {t > A.genauen - 0.05 ? <div style={popStyle(t, A.genauen - 0.05, 10, 0.6)}><Tag text="✓ 3 PROMPTS" color={C.orange} size={30} /></div> : null}
          {t > A.prompts - 0.05 ? <div style={popStyle(t, A.prompts - 0.05, 10, 0.6)}><Tag text="✓ KOSTENLOSER SCANNER" color={C.ink} size={30} /></div> : null}
          {t > A.guide - 0.1 ? <div style={popStyle(t, A.guide - 0.1, 10, 0.6)}><Tag text="✓ PRÜFLISTE" color={C.green} size={30} /></div> : null}
        </div>
        <Bot t={t} prop="pdf" px={12} x={720} y={420} a={A.genauen - 0.1} />
      </>
    );
  }
  const followed = t > A.folg + 0.25;
  const typedWord = typed("ERKLÄRUNG", t, A.erklaerung1 - 0.1, A.erklaerung1 + 0.35);
  return (
    <>
      <Card style={{ left: 120, top: 180, width: 840, height: 420, padding: "34px 40px", boxSizing: "border-box", ...popStyle(t, A.komm - 0.12, 30, 0.7) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.red, color: "#FFF", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(135deg,#3E8EF7,#9B5DE5)" }} />
          <div><div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink }}>Folgen</div><div style={{ fontFamily: MONO, fontSize: 22, color: C.dim }}>@florent_preusser</div></div>
          <div style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 30, color: followed ? C.ink : "#FFF", background: followed ? "#EFEDE8" : "#3E8EF7", borderRadius: 14, padding: "14px 28px" }}>{followed ? "Gefolgt" : "Folgen"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 50 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.red, color: "#FFF", fontFamily: fonts.bold, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 38, color: C.ink }}>Kommentieren</div>
          <div style={{ marginLeft: "auto", width: 380, height: 76, borderRadius: 14, border: `4px solid ${typedWord ? C.red : C.line}`, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: MONO, fontWeight: 800, fontSize: 36, color: C.ink, letterSpacing: "0.06em" }}>
            {typedWord || <span style={{ fontFamily: fonts.medium, fontSize: 26, color: C.dim, letterSpacing: 0 }}>Kommentar …</span>}<span style={{ opacity: Math.floor(t * 4) % 2 ? 1 : 0 }}>|</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 26, fontFamily: fonts.medium, fontSize: 24, color: C.dim }}>➤ Ich schick dir die Prompts per DM</div>
      </Card>
      <Bot t={t} prop="megaphone" px={9} x={820} y={620} a={A.komm} />
    </>
  );
};

type SceneV2 = { from: number; to: number; origin: string; El: React.FC<{ t: number }>; full?: boolean };
const SCENES_V2: SceneV2[] = [
  { from: 0, to: A.fehlt0 - 0.05, origin: "50% 50%", El: SceneHook },
  { from: A.fehlt0 - 0.05, to: A.claude0 - 0.05, origin: "50% 40%", El: FullAbmahnung, full: true },
  { from: A.claude0 - 0.05, to: A.so - 0.1, origin: "50% 45%", El: SceneVergleich },
  { from: A.so - 0.1, to: A.schritt0 - 0.05, origin: "50% 40%", El: FullSoGehts, full: true },
  { from: A.schritt0 - 0.05, to: A.shop - 0.12, origin: "50% 45%", El: SceneQuelltext },
  { from: A.shop - 0.12, to: A.schritt1 - 0.05, origin: "50% 50%", El: FullTrio, full: true },
  { from: A.schritt1 - 0.05, to: A.jetzt - 0.25, origin: "50% 45%", El: SceneScanner },
  { from: A.jetzt - 0.25, to: A.schritt2 - 0.05, origin: "50% 50%", El: FullTrick, full: true },
  { from: A.schritt2 - 0.05, to: A.welche - 0.12, origin: "50% 45%", El: SceneAbgleich },
  { from: A.welche - 0.12, to: A.genauen - 0.1, origin: "50% 50%", El: FullVier, full: true },
  { from: A.genauen - 0.1, to: 999, origin: "50% 45%", El: SceneEnd },
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
const PAGES = [1, 2, 3, 4, 5, 6].map((n) => staticFile(`datenschutz-guide/p${n}.png`));
const PDF = { left: 120, top: 560, w: 840, h: 1220, bar: 76, pw: 780, ph: Math.round((780 * 842) / 595), gap: 26 };
const PITCH = PDF.ph + PDF.gap;
export const PDF_IN = A.genauen - 0.1;
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
        <div style={{ fontFamily: fonts.semibold, fontSize: 27, color: "#FFF", whiteSpace: "nowrap" }}>Datenschutz – Guidebook.pdf</div>
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
const SPLIT_SRC_TOP = 430;
export const DatenschutzOpus: React.FC = () => {
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
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left: vLeft, top: vTop, width: vw, height: vh, transform: `scale(${avPush})`, transformOrigin: "50% 40%" }}>
        <OffthreadVideo src={staticFile("render-fpn-datenschutz-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: scene.full ? H : PH, overflow: "hidden", background: C.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }}>
        <div style={{ position: "absolute", inset: -60, backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`, backgroundSize: "28px 28px", transform: `translate(${dx * 0.4}px, ${dy * 0.4}px) scale(${1 + (cam - 1) * 0.4})` }} />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: scene.origin }}>
          <El t={t} />
        </div>
        {t < A.fehlt0 - 0.05 ? <HookPills t={t} /> : null}
      </div>
      <PdfScroll t={t} />
      <SeamCaption t={t} y={PH} />
    </AbsoluteFill>
  );
};

