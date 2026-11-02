import React from "react";
import { Easing, interpolate } from "remotion";
import { Logo } from "../components/PanelKit";
import { Backdrop, Bar, Check, Chip, clamp, count, bump, ez, G, GF, Glass, Glint, GreenReel, GreenScene, HW, Odometer, PdfScroll, PopWords, Ripple, Step, Ticks, TriggerPill, useSp, Word, FollowCard } from "../components/GptGreenKit";
import captionsJson from "../../runs/gpt-zinsen/captions.json";

// GPT-N "Zinsen aufs Ersparte" (runs/gpt-zinsen) in the 2026-10-15 look (GptGreenKit): reference reel for @florentgpt.
// All times in seconds on the tightened timeline; scene-internal times are relative to the scene start and come from
// the word timings in captions.json (noted next to each beat). Amounts are examples ("Beispiel"), no bank names.

const WORDS = captionsJson as Word[];
export const ZG_FRAMES = 911; // tightened.mp4 = 36.44 s @ 25 fps
const AVATAR = { src: "render-gpt-zinsen-tightened.mp4", focus: { x: 0.448, y: 0.641 }, scale: 1.08, faceAt: 0.57 }; // facefocus.py 2026-10-15

// ---------- 0 · Hook (frame 0 = thumbnail: headline already settled) ----------
const Hook: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = sp(-1);
  const c = count(t, 0.9, 2.4, 200); // "ChatGPT" 1.06 … "Bank" 2.52
  const land = bump(t, 2.4, 0.3);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <PopWords text="Dein Girokonto zahlt dir null." hi="null" at={-1} style={{ position: "absolute", left: 60, right: 200, top: 120, fontFamily: GF.tight, fontWeight: 900, fontSize: 104, lineHeight: 1.04, letterSpacing: -3.5, color: G.green }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 470, padding: "32px 40px 38px", transform: `scale(${(0.97 + 0.03 * card) * (1 + 0.03 * land)})` }}>
        <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.dim, marginBottom: 22 }}>Zinsen im Jahr auf 10.000 € · Beispiel</div>
        <Bar label="Girokonto" fill={0} muted t={t}><span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 70, color: G.dim, letterSpacing: -2, lineHeight: 1 }}>0 €</span></Bar>
        <div style={{ height: 30 }} />
        <Bar label="Tagesgeld" fill={0.82 * (c.v / 200)} t={t}>
          <div style={{ transform: `scale(${1 + 0.18 * land})`, transformOrigin: "100% 100%" }}><Odometer value={c.v} speed={c.speed} size={70} suffix="€" /></div>
        </Bar>
        <Glint t={t} at={2.45} />
      </Glass>
      <Ticks t={t} from={1.0} to={2.4} every={0.22} text="+ €" x={830} y={720} />
      <Ripple t={t} at={2.4} x={880} y={770} />
    </>
  );
};

// ---------- 1 · Girokonto: null Zinsen (5.4; Girokonten 0.03, null 1.43) ----------
const Giro: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const c = count(t, 0.1, 1.4, 0, 2.5);
  const shake = bump(t, 1.4, 0.4) * Math.sin(t * 80) * 14;
  const stamp = sp(1.5, 9, 260);
  const banks = [["Bank A", "0,00 %"], ["Bank B", "0,01 %"], ["Bank C", "0,00 %"]];
  return (
    <>
      <Backdrop t={t} variant={1} />
      <div style={{ position: "absolute", left: 60, top: 120, fontFamily: GF.inter, fontWeight: 600, fontSize: 36, color: G.dim, opacity: ez(t, 0, 0.2) }}>Zins auf dem Girokonto</div>
      <div style={{ position: "absolute", left: 50, top: 180, transform: `translateX(${shake}px) scale(${1 + 0.06 * bump(t, 1.4, 0.3)})`, transformOrigin: "0 50%" }}>
        <Odometer value={c.v} speed={c.speed} decimals={2} size={250} suffix="%" />
      </div>
      <Ripple t={t} at={1.4} x={330} y={310} r={320} />
      <div style={{ position: "absolute", left: 60, top: 470, fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: G.white, background: G.green, borderRadius: 18, padding: "10px 28px", letterSpacing: -1, transform: `scale(${2 - stamp}) rotate(-4deg)`, opacity: Math.min(1, stamp * 3), transformOrigin: "0 50%" }}>bei den meisten Banken</div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 640, display: "flex", gap: 18 }}>
        {banks.map(([n, v], i) => {
          const a = sp(0.35 + i * 0.12, 12, 230);
          return (
            <Glass key={n} style={{ flex: 1, padding: "20px 24px", transform: `translateY(${(1 - a) * 200}px)`, opacity: Math.min(1, a * 2) }}>
              <div style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.dim }}>{n}</div>
              <div style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 52, color: G.green, letterSpacing: -1.5 }}>{v}</div>
            </Glass>
          );
        })}
      </div>
    </>
  );
};

// ---------- 2 · Tagesgeld (9.8; Tagesgeldkonto 0.49, zwei 3.31, dauerhaft 4.12, Neukunden 5.12) ----------
const Tagesgeld: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const c = count(t, 0.8, 3.5, 2);
  const land = bump(t, 3.5, 0.3);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <PopWords text="Tagesgeld statt Girokonto" at={0.1} style={{ position: "absolute", left: 60, right: 60, top: 120, fontFamily: GF.tight, fontWeight: 900, fontSize: 76, color: G.green, letterSpacing: -2.5 }} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 270, padding: "32px 40px 38px", transform: `translateY(${(1 - sp(0.45, 14, 170)) * 520}px) scale(${1 + 0.03 * land})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.dim, marginBottom: 22 }}><span>Zinsen aufs Ersparte</span><span>bei einigen Anbietern</span></div>
        <Bar label="Girokonto" fill={0} muted t={t}><span style={{ fontFamily: GF.tight, fontWeight: 900, fontSize: 70, color: G.dim, letterSpacing: -2, lineHeight: 1 }}>0 %</span></Bar>
        <div style={{ height: 30 }} />
        <Bar label="Tagesgeld" fill={0.4 * c.v} t={t}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, transform: `scale(${1 + 0.18 * land})`, transformOrigin: "100% 100%" }}>
            <span style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 40, color: G.green, marginBottom: 6 }}>über</span>
            <Odometer value={c.v} speed={c.speed} decimals={1} size={70} suffix="%" />
          </div>
        </Bar>
        <Glint t={t} at={3.55} />
      </Glass>
      <Ticks t={t} from={1.0} to={3.5} every={0.35} text="+ %" x={840} y={560} />
      <Ripple t={t} at={3.5} x={880} y={610} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 790, display: "flex", gap: 20 }}>
        <Chip text="dauerhaft" t={t} at={4.0} />
        <Chip text="nicht nur Neukunden" t={t} at={4.85} />
      </div>
    </>
  );
};

// ---------- 3 · Rechnung (15.4; zehntausend 0.18, Euro 1.02, zweihundert 1.74, Jahr 2.45, fürs 2.84) ----------
const Rechnung: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const c = count(t, 1.45, 2.4, 200);
  const land = bump(t, 2.4, 0.3);
  const eq = ez(t, 1.2, 1.5);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, fontFamily: GF.tight, fontWeight: 800, fontSize: 50, color: G.green }}>
        <Glass style={{ borderRadius: 999, padding: "8px 30px", transform: `scale(${sp(0.15, 11, 260)})` }}>10.000 €</Glass>
        <span style={{ transform: `scale(${sp(0.7, 10, 260)})` }}>×</span>
        <span style={{ background: G.green, color: G.white, borderRadius: 999, padding: "10px 32px", transform: `scale(${sp(0.85, 10, 260)})` }}>2 %</span>
      </div>
      <div style={{ position: "absolute", left: 340, width: 400 * eq, top: 238, height: 8, borderRadius: 4, background: G.green }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", transform: `scale(${(0.9 + 0.1 * sp(1.2, 12, 220)) * (1 + 0.12 * land)})`, opacity: ez(t, 1.2, 1.35) }}>
        <Odometer value={c.v} speed={c.speed} size={300} suffix="€" />
      </div>
      <Ticks t={t} from={1.5} to={2.4} every={0.12} text="+ €" x={540} y={330} />
      <Ripple t={t} at={2.4} x={540} y={440} r={420} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 630, textAlign: "center", fontFamily: GF.inter, fontWeight: 600, fontSize: 36, color: G.dim, opacity: ez(t, 2.45, 2.75) }}>rund pro Jahr · Beispiel</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", overflow: "hidden", background: G.green, color: G.white, fontFamily: GF.tight, fontWeight: 900, fontSize: 66, letterSpacing: -1.5, borderRadius: 22, padding: "12px 40px", transform: `scale(${2.2 - 1.2 * sp(2.84, 9, 260)}) rotate(-3deg)`, opacity: Math.min(1, sp(2.84, 9, 260) * 3), boxShadow: "0 18px 40px rgba(11,61,44,0.35)" }}>
          fürs Nichtstun
          <Glint t={t} at={3.1} />
        </div>
      </div>
    </>
  );
};

// ---------- ChatGPT composer (glass) ----------
const Composer: React.FC<{ t: number; typed: string; placeholder?: boolean; web: number; send?: number; plusPress?: number }> = ({ t, typed, placeholder, web, send = 0, plusPress = 0 }) => (
  <>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
      <Logo name="openai" size={44} tile={false} />
      <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 30, color: G.ink, flex: 1 }}>ChatGPT</span>
    </div>
    <div style={{ fontFamily: GF.inter, fontWeight: 500, fontSize: 40, lineHeight: 1.32, color: placeholder ? "#8A9A94" : G.ink, minHeight: 110 }}>{placeholder ? "Frag irgendwas" : typed}<span style={{ color: G.green, opacity: Math.floor(t * 3) % 2 }}>|</span></div>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, border: "2px solid rgba(11,61,44,0.2)", background: plusPress ? `rgba(11,61,44,${0.12 * plusPress})` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.inter, fontSize: 42, color: G.ink, transform: `scale(${1 - 0.12 * plusPress})` }}>+</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: G.green, color: G.white, borderRadius: 32, padding: "10px 22px 10px 12px", fontFamily: GF.inter, fontWeight: 600, fontSize: 30, transform: `scale(${web})`, opacity: Math.min(1, web * 2), transformOrigin: "0 50%" }}>
        <Check size={40} inverted p={web} />Websuche
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ width: 64, height: 64, borderRadius: 32, background: typed && !placeholder ? G.green : "#C7D3CE", color: G.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: GF.tight, fontWeight: 900, fontSize: 34, transform: `scale(${1 + 0.25 * send})` }}>↑</div>
    </div>
  </>
);

// ---------- 4 · Erstens: ChatGPT öffnen, Websuche an (19.7; ChatGPT 0.69, Websuche 1.89) ----------
const Websuche: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const card = sp(0.55, 13, 190);
  const menu = t > 1.35 && t < 2.15 ? sp(1.35, 12, 260) : 0;
  const web = sp(1.95, 10, 260);
  const press = bump(t, 1.25, 0.25);
  return (
    <>
      <Backdrop t={t} variant={1} />
      <Step n={1} text="ChatGPT öffnen" at={0} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 300, padding: "28px 32px", transform: `translateY(${(1 - card) * 500}px) scale(${0.9 + 0.1 * card})` }}>
        <Composer t={t} typed="" placeholder web={web} plusPress={press} />
        <Glint t={t} at={2.0} />
      </Glass>
      <Ripple t={t} at={1.25} x={124} y={548} r={120} />
      {menu > 0.01 ? (
        <Glass style={{ position: "absolute", left: 80, top: 620, width: 440, padding: "12px 14px", transform: `scale(${menu})`, transformOrigin: "10% 0%", zIndex: 30 }}>
          {["Fotos & Dateien", "Websuche", "Bild erstellen"].map((x) => {
            const on = x === "Websuche" && t > 1.6;
            return <div key={x} style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 32, color: on ? G.white : G.ink, padding: "12px 16px", borderRadius: 16, background: on ? G.green : "transparent" }}>{x}</div>;
          })}
        </Glass>
      ) : null}
      <div style={{ position: "absolute", left: 60, top: 760, opacity: ez(t, 2.0, 2.2) }}><Chip text="Websuche an" t={t} at={2.0} /></div>
    </>
  );
};

// ---------- 5 · Zweitens: Prompt (22.35; such 1.1, höchsten 2.51, bleibt 4.26, Einlagensicherung 4.94) ----------
const Q = "Such mir Tagesgeldkonten mit dem höchsten Zins, der auch nach der Aktion bleibt, und mit Einlagensicherung.";
const Prompt: React.FC<{ t: number }> = ({ t }) => {
  const typed = Q.slice(0, Math.floor(Q.length * interpolate(t, [1.1, 5.25], [0, 1], { ...clamp, easing: Easing.linear })));
  const send = bump(t, 5.35, 0.3);
  return (
    <>
      <Backdrop t={t} variant={2} />
      <Step n={2} text="Prompt schreiben" at={0} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 260, padding: "28px 32px" }}>
        <Composer t={t} typed={typed} web={1} send={send} />
        <Glint t={t} at={5.4} />
      </Glass>
      <Ripple t={t} at={5.35} x={950} y={560} r={150} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 740, display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Chip text="höchster Zins" t={t} at={2.6} />
        <Chip text="bleibt nach der Aktion" t={t} at={4.3} />
        <Chip text="Einlagensicherung" t={t} at={5.2} />
      </div>
    </>
  );
};

// ---------- 6 · Drittens: die drei besten + bei der Bank prüfen (28.1; drei 1.03, Link 1.69, prüf 2.3, Bank 3.63) ----------
const Drei: React.FC<{ t: number }> = ({ t }) => {
  const sp = useSp();
  const rows = [["Tagesgeld A", 2.4], ["Tagesgeld B", 2.3], ["Tagesgeld C", 2.2]] as const;
  const bank = sp(3.45, 9, 260);
  return (
    <>
      <Backdrop t={t} variant={0} />
      <Step n={3} text={t < 2.25 ? "Die drei besten" : "Bei der Bank prüfen"} at={t < 2.25 ? 0 : 2.25} />
      <Glass style={{ position: "absolute", left: 60, right: 60, top: 250, padding: "18px 34px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <Logo name="openai" size={40} tile={false} />
          <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 28, color: G.dim, flex: 1 }}>Top 3 · dauerhafter Zins</span>
          <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 24, color: G.dim, border: "1.5px solid rgba(11,61,44,0.2)", borderRadius: 999, padding: "4px 14px" }}>Beispiel</span>
        </div>
        {rows.map(([name, rate], i) => {
          const at = 0.95 + i * 0.16;
          const a = sp(at, 12, 230);
          const c = count(t, at + 0.05, at + 0.7, rate);
          const link = sp(1.69 + i * 0.12, 10, 260);
          const ok = t > 2.35 + i * 0.25;
          return (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: i ? "2px solid rgba(11,61,44,0.1)" : "none", transform: `translateX(${(1 - a) * 700}px)`, opacity: Math.min(1, a * 2) }}>
              <div style={{ width: 62, height: 62, borderRadius: 18, background: i === 0 ? G.green : G.tint, color: i === 0 ? G.white : G.green, fontFamily: GF.tight, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <span style={{ fontFamily: GF.tight, fontWeight: 800, fontSize: 40, color: G.ink, flex: 1, letterSpacing: -0.5 }}>{name}</span>
              <Odometer value={c.v} speed={c.speed} decimals={1} size={44} suffix="%" />
              <span style={{ fontFamily: GF.inter, fontWeight: 600, fontSize: 26, color: G.green, background: G.tint, borderRadius: 999, padding: "8px 18px", transform: `scale(${link})` }}>Link</span>
              <div style={{ width: 56 }}>{ok ? <Check size={56} p={ez(t, 2.35 + i * 0.25, 2.65 + i * 0.25)} /> : null}</div>
            </div>
          );
        })}
      </Glass>
      <Ripple t={t} at={2.35} x={950} y={400} r={140} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", overflow: "hidden", background: G.green, color: G.white, fontFamily: GF.tight, fontWeight: 900, fontSize: 50, borderRadius: 22, padding: "14px 36px", transform: `scale(${2 - bank}) rotate(-2deg)`, opacity: Math.min(1, bank * 3), boxShadow: "0 18px 40px rgba(11,61,44,0.35)" }}>
          Zins direkt bei der Bank prüfen
          <Glint t={t} at={3.8} />
        </div>
      </div>
    </>
  );
};

const SCENES: GreenScene[] = [
  { start: 0, end: 4.7, El: Hook },
  { start: 5.4, end: 7.6, El: Giro },
  { start: 9.8, end: 15.4, El: Tagesgeld },
  { start: 15.4, end: 19.0, El: Rechnung, joinPrev: true },
  { start: 19.7, end: 22.35, El: Websuche },
  { start: 22.35, end: 28.1, El: Prompt, joinPrev: true },
  { start: 28.1, end: 32.1, El: Drei, joinPrev: true },
];

// ---------- CTA (full frame): guide scroll on "Anleitung … Prompt", then follow + comment ----------
const PAGES = [1, 2, 3].map((n) => `zs-guide/p${n}.png`); // green guide since 2026-10-15 (3 pages)
const GUIDE_IN = 32.42; // "Anleitung" 32.57
const GUIDE_OUT = 34.25; // before "folg" 34.42
const FOLG = 34.42, ZINSEN = 35.16;

export const GptZinsenGreen: React.FC = () => (
  <GreenReel
    avatar={AVATAR}
    scenes={SCENES}
    words={WORDS}
    overlay={(t) => (
      <>
        <PdfScroll t={t} pages={PAGES} title="Zinsen – Anleitung.pdf" inAt={GUIDE_IN} outAt={GUIDE_OUT} />
        <TriggerPill t={t} at={FOLG - 0.05} word="Zinsen" top={360} />
        <FollowCard t={t} followAt={FOLG} wordAt={ZINSEN} word="Zinsen" />
        <Ripple t={t} at={ZINSEN} x={HW / 2} y={680} r={260} />
      </>
    )}
  />
);
