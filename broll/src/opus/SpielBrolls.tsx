import React from "react";
import { Easing, interpolate, OffthreadVideo, staticFile } from "remotion";
import { fonts } from "../theme";
import { PK, paperShadow, Sheen } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage } from "./DuetBrolls";
import { Win, Beispiel, I2, TopTag, Composer } from "./KontoBrolls";
import { HolzmannMark } from "./ErklaerfilmBrolls";

// FP-N "Marken-Spiel" (2026-10-30) - split-panel scenes (1080 x 820), pure functions of (t, dur, at); SpielOpus anchors
// `at` to captions.json word times and wraps every scene in a <Sequence>, so the gameplay video starts with the scene.
// The game "Ziegel-Fang" is real: runs/fpn-spiel/game/index.html, built by Claude in this run, recorded in headless
// Chrome (public/fpn-spiel/gameplay.mp4, 1080x1920, start screen 0-1.2 s, play 1.2-46.2 s, end card + code 46.2-50.2 s).
// "Holzmann Dachtechnik" and "Bäckerei Sommer" are invented example firms (BEISPIEL).

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);
const FPS = 25;
export const GAME = staticFile("fpn-spiel/gameplay.mp4");
export const G_END = 46.2; // end card starts, code pops ~0.9 s later
const H_TILE = "#C2532F", H_SLATE = "#1E2830", H_ORANGE = "#E8693A";

// ---------- phone with real gameplay ----------
export const Phone: React.FC<{ w: number; g0: number; style?: React.CSSProperties; glow?: number; children?: React.ReactNode }> = ({ w, g0, style, glow = 0, children }) => {
  const h = (w * 16) / 9, b = w * 0.035;
  return (
    <div style={{ position: "absolute", width: w + 2 * b, height: h + 2 * b, borderRadius: w * 0.13, background: "linear-gradient(150deg, #2B2B2E, #0E0E10)", padding: b, boxSizing: "border-box", boxShadow: `0 40px 80px -24px rgba(60,30,10,0.55), 0 0 0 ${glow * 8}px rgba(217,119,87,${0.35 * glow})`, ...style }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.1, overflow: "hidden", background: "#F6EFE6" }}>
        <OffthreadVideo src={GAME} startFrom={Math.max(0, Math.round(g0 * FPS))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", left: "50%", top: w * 0.025, width: w * 0.28, height: w * 0.075, marginLeft: -w * 0.14, borderRadius: 999, background: "#0E0E10" }} />
        {children}
      </div>
    </div>
  );
};

// ---------- tiny drawn product cards (no real product photos) ----------
const TileGlyph: React.FC<{ s: number; c?: string }> = ({ s, c = H_TILE }) => (
  <svg width={s} height={s * 1.4} viewBox="0 0 40 56"><path d="M2 2 H38 V36 A18 18 0 0 1 2 36 Z" fill={c} stroke="rgba(60,20,8,.35)" strokeWidth={2} /><rect x={6} y={5} width={4} height={30} fill="rgba(255,255,255,.3)" /></svg>
);
const PRODUCTS = [
  { n: "Biberschwanz", s: "Tonziegel", g: <TileGlyph s={46} /> },
  { n: "Dachfenster", s: "Einbau", g: <svg width={56} height={56} viewBox="0 0 56 56"><rect x={6} y={8} width={44} height={40} rx={4} fill="#BFD4E0" stroke={H_SLATE} strokeWidth={4} /><path d="M28 8V48M6 28H50" stroke={H_SLATE} strokeWidth={4} /></svg> },
  { n: "Dachrinne", s: "Reinigung", g: <svg width={56} height={56} viewBox="0 0 56 56"><path d="M4 18 H52 V26 A10 10 0 0 1 42 36 H14 A10 10 0 0 1 4 26 Z" fill="#9AA7B0" /><path d="M40 36 V54" stroke="#9AA7B0" strokeWidth={8} /></svg> },
];
const Swatch: React.FC<{ c: string; hex: string; p: number }> = ({ c, hex, p }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${0.4 + 0.6 * p})`, opacity: p > 0 ? 1 : 0 }}>
    <div style={{ width: 66, height: 66, borderRadius: 18, background: c, boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.12)" }} />
    <Mono text={hex} size={14} color={PK.ink} />
  </div>
);

// ================= 0. HOOK: real game on frame 0 | Agentur-Angebot 8.000 € | Claude 1 Std | Logo, Farben, Produkte =================
export const HookSpiel: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const acht = m("acht", 0.15), claude = m("claude", 0.42), stunde = m("stunde", 0.55), logo = m("logo", 0.7), farben = m("farben", 0.8), produkte = m("produkte", 0.92);
  const offer = 1 - k(t, logo - 0.25, 0.3, ez); // visible from frame 0 (thumbnail), pulses on "achttausend"
  const offerPulse = t > acht - 0.06 && t < acht + 0.2 ? 1 - Math.abs(t - acht - 0.07) / 0.13 : 0;
  const strike = k(t, claude, 0.3, ez);
  const chips = k(t, logo - 0.15, 0.3, ez);
  const tap = (a: number) => (t > a && t < a + 0.25 ? 1 - (t - a) / 0.25 : 0);
  return (
    <PanelStage t={t} dur={dur} seed={61}>
      {/* the real game, already running on frame 0 */}
      <div style={{ position: "absolute", left: 610, top: 60, transform: tilt(t, 3, -10), transformOrigin: "50% 60%" }}>
        <Phone w={380} g0={9} glow={Math.max(tap(logo), tap(farben), tap(produkte))} style={{ left: 0, top: 0 }} />
        <div style={{ position: "absolute", left: -24, top: 600, zIndex: 5, ...ps(t, -0.2, 10, 0.8) }}><Pill text="ECHT GESPIELT" color="#FFF" bg={PK.ink} size={20} /></div>
      </div>
      {/* agency offer card */}
      {offer > 0 ? (
        <div style={{ position: "absolute", left: 60, top: 300, width: 500, opacity: offer, transform: `translateY(${(1 - offer) * 40}px) rotate(-3deg) scale(${1 + 0.05 * offerPulse})` }}>
          <div style={{ background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "26px 30px" }}>
            <Mono text="ANGEBOT · AGENTUR" size={18} />
            <div style={{ fontFamily: fonts.bold, fontSize: 34, color: PK.ink, marginTop: 8 }}>Marken-Handyspiel</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, marginTop: 4 }}>Konzept, Design, Entwicklung</div>
            <div style={{ position: "relative", display: "inline-block", marginTop: 18 }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 96, color: C.red, letterSpacing: "-0.02em" }}>8.000 €</span>
              <span style={{ position: "absolute", left: -8, top: "54%", height: 10, width: `${strike * 106}%`, background: PK.ink, borderRadius: 5, transform: "rotate(-6deg)" }} />
            </div>
          </div>
          {t > stunde - 0.1 ? (
            <div style={{ position: "absolute", right: -40, bottom: -46, display: "flex", alignItems: "center", gap: 12, background: C.orange, color: "#FFF", borderRadius: 22, padding: "14px 24px", boxShadow: "0 18px 36px -10px rgba(180,83,47,0.6)", transform: `rotate(4deg) scale(${pop(t, stunde - 0.1, 0.4)})` }}>
              <Logo name="claude" size={44} color="#FFF" />
              <span style={{ fontFamily: fonts.bold, fontSize: 52 }}>1 Std</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* what Claude got: logo, colours, products */}
      {chips > 0 ? (
        <div style={{ position: "absolute", left: 50, top: 250, width: 520, display: "flex", flexDirection: "column", gap: 18, opacity: chips }}>
          {[
            { a: logo, h: "Logo", el: <HolzmannMark size={70} /> },
            { a: farben, h: "Farben", el: <div style={{ display: "flex", gap: 8 }}>{[H_ORANGE, H_TILE, H_SLATE, "#F6EFE6"].map((c, i) => <span key={i} style={{ width: 40, height: 70, borderRadius: 12, background: c, border: "1px solid rgba(0,0,0,.08)", transform: `scaleY(${pop(t, farben + i * 0.05, 0.35)})` }} />)}</div> },
            { a: produkte, h: "Produkte", el: <div style={{ display: "flex", gap: 10 }}>{PRODUCTS.map((p, i) => <div key={i} style={{ width: 70, height: 70, borderRadius: 16, background: "#F7F2EB", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(t, produkte + i * 0.06, 0.35)})` }}>{p.g}</div>)}</div> },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, background: "#FFF", borderRadius: 24, padding: "16px 22px", boxShadow: "0 18px 34px -14px rgba(90,55,30,0.4)", border: `1.5px solid ${t > r.a && t < r.a + 0.5 ? C.orange : CL.border}`, ...ps(t, r.a - 0.12, 24, 0.7) }}>
              <CheckDot size={36} p={k(t, r.a + 0.1, 0.25)} />
              <span style={{ fontFamily: fonts.bold, fontSize: 36, color: PK.ink, width: 170 }}>{r.h}</span>
              {r.el}
            </div>
          ))}
        </div>
      ) : null}
      <Glint t={t} at={stunde + 0.2} x={540} y={580} size={40} />
      <Beispiel style={{ left: 640, top: 772 }} />
    </PanelStage>
  );
};

// ================= 1. "Daraus habe ich ein komplettes System entwickelt: dein eigenes Spielestudio in Claude." =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("m1", 0.05), m("m2", 0.15), m("m3", 0.25), m("m4", 0.32)];
  const title = m("title", 0.4), claude = m("claude", 0.5);
  const MODS = [
    { x: 40, y: 96, ic: I2.folder, h: "Projekt", s: "Logo · Farben · Fotos", from: [-300, -80] },
    { x: 780, y: 96, ic: I2.list, h: "Regiesystem", s: "fragt dich aus", from: [300, -80] },
    { x: 40, y: 590, ic: I2.layers, h: "Spiel", s: "läuft im Browser", from: [-300, 80] },
    { x: 780, y: 590, ic: I2.card, h: "Rabattcode", s: "für den Highscore", from: [300, 80] },
  ];
  const CARD = { x: 290, y: 255, w: 500, h: 300 };
  const anchors = [[CARD.x, CARD.y + 50], [CARD.x + CARD.w, CARD.y + 50], [CARD.x, CARD.y + CARD.h - 50], [CARD.x + CARD.w, CARD.y + CARD.h - 50]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 260 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={62}>
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {MODS.map((_, i) => {
          const p = k(t, mods[i] + 0.25, 0.3);
          const [x1, y1] = tileC(i), [x2, y2] = anchors[i];
          return <path key={i} d={`M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`} fill="none" stroke={C.orange} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" strokeDashoffset={-t * 40} opacity={p} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, ...ps(t, -0.25, 20, 0.85) }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 28, border: `1.5px solid ${CL.border}`, boxShadow: paperShadow, padding: "28px 32px", boxSizing: "border-box", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Ico d={I2.folder} size={28} color={CL.sub} />
            <Mono text="PROJEKT" size={18} />
            {t > claude - 0.05 ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 22, color: CL.text, ...ps(t, claude, 8, 0.5) }}><Logo name="claude" size={26} />in Claude</span> : null}
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, color: PK.ink, marginTop: 18, lineHeight: 1, minHeight: 58, whiteSpace: "nowrap" }}>
            {typed("Spielestudio", t, title - 0.15, title + 0.4) || <span style={{ color: CL.border }}>Spielestudio</span>}
          </div>
          <div style={{ fontFamily: fonts.medium, fontSize: 25, color: CL.sub, marginTop: 16 }}>Dein Marken-Spiel, mit Rabattcode</div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {mods.map((a, i) => <span key={i} style={{ width: 64, height: 9, borderRadius: 5, background: t > a + 0.3 ? C.orange : CL.border }} />)}
          </div>
          <Sheen p={k(t, title + 0.3, 0.7)} strength={0.8} />
        </div>
      </div>
      <Ring t={t} at={title + 0.3} x={CARD.x + CARD.w / 2} y={CARD.y + CARD.h / 2} r={330} />
      {MODS.map((md, i) => {
        const a = mods[i];
        const p = interpolate(t, [a - 0.1, a + 0.32], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
        const snap = t > a + 0.22 && t < a + 0.4 ? 1 - (t - a - 0.22) / 0.18 : 0;
        return (
          <div key={i} style={{ position: "absolute", left: md.x + (1 - p) * md.from[0], top: md.y + (1 - p) * md.from[1], width: 260, opacity: k(t, a - 0.1, 0.1), transform: `rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg) scale(${1 + snap * 0.06})` }}>
            <div style={{ background: "#FFF", borderRadius: 22, border: `1.5px solid ${snap > 0 ? C.orange : CL.border}`, boxShadow: "0 18px 34px -14px rgba(90,55,30,0.4)", padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={md.ic} size={32} color={PK.orangeDeep} sw={2} /></div>
              <div>
                <div style={{ fontFamily: fonts.bold, fontSize: 29, color: PK.ink, whiteSpace: "nowrap" }}>{md.h}</div>
                <div style={{ fontFamily: fonts.medium, fontSize: 20, color: CL.sub, whiteSpace: "nowrap" }}>{md.s}</div>
              </div>
            </div>
          </div>
        );
      })}
      {mods.map((a, i) => <Glint key={i} t={t} at={a + 0.25} x={anchors[i][0]} y={anchors[i][1]} size={30} />)}
      <TopTag t={t} text="KOMPLETTES SYSTEM" at={-0.1} style={{ left: 380, top: 30 }} />
    </PanelStage>
  );
};

// ================= 2. "Du legst ein Projekt an, mit deinem Logo, deinen Farben und Fotos von deinen Produkten." =================
export const SceneProjekt: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const proj = m("projekt", 0.15), logo = m("logo", 0.4), farben = m("farben", 0.6), fotos = m("fotos", 0.78), send = m("send", 0.95);
  const dLogo = k(t, logo - 0.35, 0.4, ez), dPal = k(t, farben - 0.3, 0.4, ez), dFoto = k(t, fotos - 0.3, 0.45, ez);
  const KN = { x: 560, y: 120 }; // project knowledge column (inside window)
  return (
    <PanelStage t={t} dur={dur} seed={63}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title={typed("Holzmann Spielestudio", t, proj - 0.2, proj + 0.4) || " "} style={{ inset: 0 }}>
          <div style={{ position: "absolute", left: 34, top: 34, width: 470 }}>
            <div style={{ fontFamily: SERIF, fontSize: 46, color: CL.text, lineHeight: 1.1 }}>Holzmann Spielestudio</div>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, marginTop: 10 }}>Marken-Spiele für Holzmann Dachtechnik</div>
            <Composer t={t} focus={false} placeholder="Neuer Chat im Projekt…" style={{ left: 0, right: 0, top: 170, height: 200 }} />
          </div>
          {/* project knowledge */}
          <div style={{ position: "absolute", left: KN.x, top: 30, right: 30, bottom: 30, background: "#FFF", borderRadius: 22, border: `1.5px solid ${CL.border}`, padding: "20px 24px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Ico d={I2.doc} size={26} color={CL.sub} /><span style={{ fontFamily: fonts.semibold, fontSize: 26, color: CL.text }}>Projektwissen</span><span style={{ marginLeft: "auto", fontFamily: fonts.medium, fontSize: 30, color: CL.sub }}>+</span></div>
            <Mono text="LOGO" size={15} style={{ marginTop: 22 }} />
            <div style={{ height: 96, marginTop: 8, borderRadius: 16, border: `2px dashed ${t > logo ? "transparent" : CL.border}`, display: "flex", alignItems: "center", gap: 14, padding: "0 14px" }}>
              {t > logo ? <><div style={{ transform: `scale(${pop(t, logo, 0.35)})` }}><HolzmannMark size={72} /></div><div><div style={{ fontFamily: fonts.bold, fontSize: 22, color: CL.text }}>holzmann-logo.svg</div><Mono text="SVG · 4 KB" size={13} /></div></> : null}
            </div>
            <Mono text="FARBEN" size={15} style={{ marginTop: 16 }} />
            <div style={{ height: 96, marginTop: 8, display: "flex", gap: 14, alignItems: "center", borderRadius: 16, border: `2px dashed ${t > farben ? "transparent" : CL.border}`, padding: "0 10px" }}>
              {[[H_ORANGE, "#E8693A"], [H_TILE, "#C2532F"], [H_SLATE, "#1E2830"], ["#F6EFE6", "#F6EFE6"]].map(([c, hx], i) => <Swatch key={i} c={c} hex={hx} p={pop(t, farben + i * 0.06, 0.35)} />)}
            </div>
            <Mono text="PRODUKTFOTOS" size={15} style={{ marginTop: 16 }} />
            <div style={{ height: 150, marginTop: 8, display: "flex", gap: 12, borderRadius: 16, border: `2px dashed ${t > fotos ? "transparent" : CL.border}`, padding: 6 }}>
              {t > fotos ? PRODUCTS.map((p, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 14, background: "#F7F2EB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${pop(t, fotos + i * 0.08, 0.4)})` }}>
                  {p.g}<span style={{ fontFamily: fonts.bold, fontSize: 17, color: CL.text }}>{p.n}</span>
                </div>
              )) : null}
            </div>
          </div>
        </Win>
      </div>
      {/* flying assets */}
      {t < logo ? <div style={{ position: "absolute", left: 120 + dLogo * 520, top: 520 - dLogo * 300 - Math.sin(dLogo * Math.PI) * 80, zIndex: 30, opacity: k(t, logo - 0.7, 0.2), transform: `scale(${1.3 - 0.5 * dLogo})` }}><HolzmannMark size={100} /></div> : null}
      {t < farben && t > logo ? <div style={{ position: "absolute", left: 120 + dPal * 520, top: 560 - dPal * 160 - Math.sin(dPal * Math.PI) * 80, zIndex: 30, display: "flex", gap: 6, opacity: k(t, logo, 0.2) }}>{[H_ORANGE, H_TILE, H_SLATE].map((c, i) => <span key={i} style={{ width: 40, height: 64, borderRadius: 10, background: c, boxShadow: "0 10px 20px rgba(0,0,0,.2)" }} />)}</div> : null}
      {t < fotos && t > farben ? <div style={{ position: "absolute", left: 100 + dFoto * 520, top: 600 - dFoto * 70 - Math.sin(dFoto * Math.PI) * 80, zIndex: 30, display: "flex", gap: 8, opacity: k(t, farben, 0.2) }}>{PRODUCTS.map((p, i) => <div key={i} style={{ width: 96, height: 120, borderRadius: 12, background: "#FFF", padding: 6, boxShadow: paperShadow, transform: `rotate(${(i - 1) * 7}deg)` }}><div style={{ width: "100%", height: "100%", borderRadius: 8, background: "#F7F2EB", display: "flex", alignItems: "center", justifyContent: "center" }}>{p.g}</div></div>)}</div> : null}
      <Pointer t={t} path={[{ x: 800, y: 900, at: 0 }, { x: 180, y: 560, at: logo - 0.38, click: true }, { x: 680, y: 260, at: logo - 0.02, click: true }, { x: 180, y: 590, at: farben - 0.33, click: true }, { x: 720, y: 400, at: farben - 0.02, click: true }, { x: 200, y: 640, at: fotos - 0.33, click: true }, { x: 760, y: 560, at: fotos - 0.02, click: true }, { x: 900, y: 760, at: send }]} size={56} />
      <Ring t={t} at={fotos + 0.1} x={800} y={560} r={200} />
      <Beispiel style={{ left: 880, top: 40 }} />
    </PanelStage>
  );
};

// ================= 3. "Dann startest du mein Regiesystem. Claude fragt dich, was deine Kunden lieben, und macht daraus ein Spiel." =================
export const SceneRegie: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const startest = m("startest", 0.1), regie = m("regie", 0.2), fragt = m("fragt", 0.45), lieben = m("lieben", 0.6), spiel = m("spiel", 0.9);
  const sendA = regie + 0.35;
  const art = k(t, spiel - 0.45, 0.45, ez);
  const chatW = interpolate(art, [0, 1], [1020, 560]);
  return (
    <PanelStage t={t} dur={dur} seed={64}>
      <div style={{ position: "absolute", left: 30, top: 26, width: 1020, height: 770, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title="Holzmann Spielestudio" style={{ inset: 0 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: chatW, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 28, right: 28, top: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {t > sendA ? <div style={{ alignSelf: "flex-end", background: CL.bubble, borderRadius: 20, padding: "12px 20px", fontFamily: MONO, fontWeight: 700, fontSize: 27, color: PK.orangeDeep, ...ps(t, sendA, 10, 0.8) }}>/regiesystem</div> : null}
              {t > fragt - 0.2 ? (
                <div style={{ display: "flex", gap: 12, ...ps(t, fragt - 0.2, 12, 0.8) }}>
                  <Logo name="claude" size={36} />
                  <div style={{ fontFamily: SERIF, fontSize: 31, color: CL.text, lineHeight: 1.25 }}>{typed("Frage 1 von 5: Was lieben deine Kunden an Holzmann?", t, fragt - 0.15, fragt + 0.6)}</div>
                </div>
              ) : null}
              {t > lieben + 0.25 ? <div style={{ alignSelf: "flex-end", maxWidth: 440, background: CL.bubble, borderRadius: 20, padding: "12px 20px", fontFamily: fonts.medium, fontSize: 26, color: CL.text, ...ps(t, lieben + 0.25, 10, 0.8) }}>Dach in 3 Tagen dicht. Und der Festpreis.</div> : null}
              {t > spiel - 0.4 ? (
                <div style={{ display: "flex", gap: 12, ...ps(t, spiel - 0.4, 12, 0.8) }}>
                  <Logo name="claude" size={36} />
                  <div style={{ fontFamily: SERIF, fontSize: 29, color: CL.text, lineHeight: 1.25 }}>Dann baue ich „Ziegel-Fang“: fang die Ziegel, deck das Dach.</div>
                </div>
              ) : null}
            </div>
            <Composer t={t} focus={t > startest - 0.2 && t < sendA + 0.1} text={t < sendA ? typed("/regiesystem", t, startest, regie + 0.25) : undefined} placeholder="Antworte Claude…" sendAt={sendA} style={{ left: 24, right: 24, bottom: 22, height: 150 }} />
          </div>
          {/* artifact pane with the real game */}
          {art > 0 ? (
            <div style={{ position: "absolute", left: 572, right: 0, top: 0, bottom: 0, background: "#FFF", borderLeft: `1px solid ${CL.border}`, transform: `translateX(${(1 - art) * 460}px)` }}>
              <div style={{ height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", borderBottom: `1px solid ${CL.border}` }}>
                <Ico d={I2.layers} size={24} color={CL.sub} /><span style={{ fontFamily: fonts.semibold, fontSize: 22, color: CL.text }}>Ziegel-Fang</span><Mono text="HTML" size={14} style={{ marginLeft: "auto" }} />
              </div>
              <div style={{ position: "absolute", left: "50%", top: 72, marginLeft: -170 }}>
                <Phone w={318} g0={1.6 - (spiel - 0.45)} style={{ left: 0, top: 0 }} />
              </div>
            </div>
          ) : null}
        </Win>
      </div>
      <Pointer t={t} path={[{ x: 700, y: 900, at: 0 }, { x: 300, y: 700, at: startest - 0.1, click: true }, { x: 990, y: 735, at: sendA, click: true }, { x: 820, y: 600, at: spiel + 0.6 }]} size={56} />
      <TopTag t={t} text="MEIN REGIESYSTEM" at={regie - 0.1} style={{ left: 640, top: 100 }} />
      <Ring t={t} at={spiel} x={830} y={430} r={260} />
    </PanelStage>
  );
};

// ================= 4. "Der Dachdecker fängt fallende Ziegel, der Bäcker stapelt Brötchen." =================
const Roll: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 0.55, borderRadius: "50% 50% 44% 44%", background: "radial-gradient(ellipse at 40% 30%, #F2C58A, #C98A44 70%, #A86A2E)", boxShadow: "inset 0 -6px 10px rgba(90,50,10,.35), 0 6px 10px rgba(90,50,10,.25)", position: "relative" }}>
    <div style={{ position: "absolute", left: "30%", top: "18%", width: "40%", height: 4, borderRadius: 2, background: "rgba(255,240,210,.7)", transform: "rotate(-8deg)" }} />
  </div>
);
const BakeryPhone: React.FC<{ t: number; w: number; a: number }> = ({ t, w, a }) => {
  const h = (w * 16) / 9, b = w * 0.035;
  const N = 7;
  return (
    <div style={{ position: "absolute", width: w + 2 * b, height: h + 2 * b, borderRadius: w * 0.13, background: "linear-gradient(150deg, #2B2B2E, #0E0E10)", padding: b, boxSizing: "border-box", boxShadow: "0 40px 80px -24px rgba(60,30,10,0.55)" }}>
      <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.1, overflow: "hidden", background: "linear-gradient(180deg, #FCE8C8, #F6EFE6)" }}>
        <div style={{ position: "absolute", left: 12, right: 12, top: 34, height: 56, borderRadius: 16, background: "#3A2A1E", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#E2A23B", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 20, color: "#3A2A1E" }}>S</div>
          <span style={{ fontFamily: fonts.bold, fontSize: 17, color: "#FFF" }}>BÄCKEREI SOMMER</span>
          <span style={{ marginLeft: "auto", fontFamily: fonts.bold, fontSize: 24, color: "#FFF" }}>{Math.max(0, Math.min(N, Math.floor((t - a) / 0.3) + 1)) * 10}</span>
        </div>
        {/* counter + stacking rolls */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 120, background: "#8B5E3C" }} />
        {Array.from({ length: N }, (_, i) => {
          const s = a + i * 0.3;
          const p = interpolate(t, [s - 0.25, s], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
          if (p <= 0) return null;
          const off = Math.sin(i * 2.1) * 14;
          const squash = t > s && t < s + 0.12 ? 1 - (t - s) / 0.12 : 0;
          return <div key={i} style={{ position: "absolute", left: w / 2 - 60 + off, bottom: 118 + i * 52 + (1 - p) * 500, transform: `rotate(${Math.sin(t * 3 + i) * 2 * (i / N)}deg) scale(${1 + squash * 0.12}, ${1 - squash * 0.15})` }}><Roll w={120} /></div>;
        })}
        {/* swinging roll on the crane line */}
        <div style={{ position: "absolute", left: w / 2 - 60 + Math.sin(t * 2.4) * 80, top: 110 }}><Roll w={120} /></div>
      </div>
    </div>
  );
};
export const SceneIdeen: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const dach = m("dach", 0.05), baecker = m("baecker", 0.55);
  return (
    <PanelStage t={t} dur={dur} seed={65}>
      <div style={{ position: "absolute", left: 90, top: 70, transform: `${tilt(t, 3, 8)} translateY(${(1 - pop(t, dach - 0.2, 0.45)) * 500}px)` }}>
        <Phone w={330} g0={22} style={{ left: 0, top: 0 }} />
        <div style={{ position: "absolute", left: 40, top: 640, ...ps(t, dach, 10, 0.7) }}><Pill text="DACHDECKER · ZIEGEL" color="#FFF" bg={H_SLATE} size={21} dot={false} /></div>
      </div>
      <div style={{ position: "absolute", left: 620, top: 70, transform: `${tilt(t + 2, 3, -8)} translateY(${(1 - pop(t, baecker - 0.25, 0.45)) * 700}px)` }}>
        <BakeryPhone t={t} w={330} a={baecker + 0.1} />
        <div style={{ position: "absolute", left: 50, top: 640, ...ps(t, baecker, 10, 0.7) }}><Pill text="BÄCKER · BRÖTCHEN" color="#FFF" bg="#8B5E3C" size={21} dot={false} /></div>
      </div>
      <Glint t={t} at={baecker + 0.6} x={980} y={150} size={36} />
      <Beispiel style={{ left: 470, top: 30 }} />
    </PanelStage>
  );
};

// ================= 5. "Wer den Highscore knackt, bekommt zehn Prozent Rabatt. Den Code zeigt das Spiel am Ende direkt an." =================
export const SceneRabatt: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const knackt = m("knackt", 0.2), zehn = m("zehn", 0.35), code = m("code", 0.65), ende = m("ende", 0.85);
  // the recording's end card (46.2 s) lands on "knackt", the code pops ~0.9 s later
  const g0 = G_END - (knackt - 0.1);
  const coupon = pop(t, zehn - 0.1, 0.5);
  return (
    <PanelStage t={t} dur={dur} seed={66}>
      <div style={{ position: "absolute", left: 620, top: 50, transform: tilt(t, 3, -9) }}>
        <Phone w={370} g0={g0} glow={t > code && t < code + 0.6 ? 1 - (t - code) / 0.6 : 0} style={{ left: 0, top: 0 }} />
      </div>
      {/* highscore badge */}
      <div style={{ position: "absolute", left: 60, top: 120, ...ps(t, knackt - 0.15, 20, 0.7) }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: PK.ink, color: "#FFF", borderRadius: 22, padding: "16px 26px" }}>
          <span style={{ fontSize: 40 }}>🏆</span>
          <div><Mono text="NEUER HIGHSCORE" size={18} color="#F4C9B4" /><div style={{ fontFamily: fonts.bold, fontSize: 52, lineHeight: 1 }}>1.430</div></div>
        </div>
      </div>
      {/* coupon */}
      <div style={{ position: "absolute", left: 50, top: 330, width: 520, transform: `rotate(-3deg) scale(${0.6 + 0.4 * coupon})`, opacity: coupon > 0 ? 1 : 0 }}>
        <div style={{ position: "relative", background: "#FFF", borderRadius: 28, boxShadow: paperShadow, border: `3px dashed ${C.orange}`, padding: "24px 30px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}><HolzmannMark size={54} /><Mono text="RABATTCODE" size={20} color={PK.orangeDeep} /></div>
          <div style={{ fontFamily: fonts.bold, fontSize: 132, color: C.orange, lineHeight: 1, marginTop: 10, letterSpacing: "-0.03em" }}>−10 %</div>
          <div style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 12, background: "#F7F2EB", borderRadius: 14, padding: "10px 18px", ...ps(t, code - 0.1, 8, 0.7) }}>
            <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, letterSpacing: "0.08em", color: PK.ink }}>{typed("HOLZMANN10", t, code - 0.05, code + 0.45) || " "}</span>
            <Ico d={I2.copy} size={30} color={CL.sub} />
          </div>
          <Sheen p={k(t, ende - 0.2, 0.7)} strength={0.8} />
        </div>
      </div>
      <Ring t={t} at={code + 0.1} x={810} y={430} r={240} />
      <Glint t={t} at={zehn + 0.3} x={520} y={380} size={40} />
      <Beispiel style={{ left: 60, top: 760 }} />
    </PanelStage>
  );
};

// ================= 6. "Den Link teilst du in deiner Story, und deine Kunden schicken ihn sich gegenseitig weiter. Werbung, die die Leute freiwillig spielen." =================
const FRIENDS = [
  { n: "Jana", c: "#E9A37F", x: 690, y: 110 },
  { n: "Tom", c: "#8FB3D9", x: 900, y: 230 },
  { n: "Mehmet", c: "#A7C98B", x: 700, y: 360 },
  { n: "Lisa", c: "#E3B5D0", x: 910, y: 480 },
  { n: "Paul", c: "#F2CB6B", x: 720, y: 600 },
];
export const SceneStory: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const link = m("link", 0.05), story = m("story", 0.2), schicken = m("schicken", 0.45), werbung = m("werbung", 0.7), freiwillig = m("freiwillig", 0.85);
  const kin = k(t, werbung - 0.25, 0.35, ez);
  const tapS = t > story && t < story + 0.2 ? 1 - (t - story) / 0.2 : 0;
  return (
    <PanelStage t={t} dur={dur} seed={67}>
      <div style={{ position: "absolute", left: 90, top: 50, opacity: 1 - kin * 0.85, transform: `${tilt(t, 3, 8)} scale(${1 - kin * 0.08})` }}>
        <Phone w={340} g0={30} style={{ left: 0, top: 0 }}>
          {/* Instagram story chrome + link sticker */}
          <div style={{ position: "absolute", left: 10, right: 10, top: 14, display: "flex", gap: 4 }}>{[0, 1, 2].map((i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i === 0 ? "#FFF" : "rgba(255,255,255,.45)" }} />)}</div>
          <div style={{ position: "absolute", left: 14, top: 28, display: "flex", alignItems: "center", gap: 8 }}><HolzmannMark size={30} /><span style={{ fontFamily: fonts.bold, fontSize: 16, color: "#FFF", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>holzmann.dach</span></div>
          <div style={{ position: "absolute", left: "50%", top: 380, transform: `translateX(-50%) rotate(-4deg) scale(${pop(t, link, 0.45) * (1 - tapS * 0.1)})`, background: "#FFF", borderRadius: 14, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 10px 24px rgba(0,0,0,.3)", whiteSpace: "nowrap" }}>
            <Ico d="M10 14a4 4 0 005.66 0l3-3a4 4 0 00-5.66-5.66l-1 1M14 10a4 4 0 00-5.66 0l-3 3a4 4 0 005.66 5.66l1-1" size={22} color="#3E8EF7" sw={2.4} />
            <span style={{ fontFamily: fonts.bold, fontSize: 19, color: "#3E8EF7" }}>SPIELEN & 10 % HOLEN</span>
          </div>
        </Phone>
      </div>
      {/* shares fanning out */}
      <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - kin }}>
        {FRIENDS.map((f, i) => {
          const a = schicken - 0.2 + i * 0.16;
          const p = k(t, a, 0.35);
          return <path key={i} d={`M470 400 C 580 400, ${f.x - 120} ${f.y + 40}, ${f.x} ${f.y + 40}`} fill="none" stroke={C.orange} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" strokeDashoffset={-t * 40} opacity={p} />;
        })}
      </svg>
      {FRIENDS.map((f, i) => {
        const a = schicken - 0.2 + i * 0.16;
        return (
          <div key={i} style={{ position: "absolute", left: f.x, top: f.y, display: "flex", alignItems: "center", gap: 10, opacity: 1 - kin, ...ps(t, a + 0.2, 14, 0.6) }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: f.c, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 30, color: "#FFF", border: "4px solid #FFF", boxShadow: "0 10px 20px rgba(0,0,0,.15)" }}>{f.n[0]}</div>
            <div style={{ background: "#FFF", borderRadius: "18px 18px 18px 4px", padding: "8px 14px", boxShadow: "0 8px 18px rgba(0,0,0,.1)", fontFamily: fonts.medium, fontSize: 19, color: CL.text, whiteSpace: "nowrap" }}>{["Schaffst du 1.430?", "Hab 1.120 😅", "Code eingelöst!", "Nochmal!", "Wer hat den Highscore?"][i]}</div>
          </div>
        );
      })}
      {/* kinetic line */}
      {kin > 0 ? (
        <div style={{ position: "absolute", left: 60, right: 60, top: 250, textAlign: "center", opacity: kin, transform: `translateY(${(1 - kin) * 30}px)` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 92, color: PK.ink, lineHeight: 1.05 }}>Werbung, die man</div>
          <div style={{ display: "inline-block", position: "relative", marginTop: 8 }}>
            <span style={{ position: "absolute", left: -16, right: -16, top: 12, bottom: 4, background: C.orange, borderRadius: 14, transform: `scaleX(${k(t, freiwillig - 0.05, 0.3)})`, transformOrigin: "0 50%" }} />
            <span style={{ position: "relative", fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 104, color: t > freiwillig + 0.1 ? "#FFF" : PK.ink }}>freiwillig spielt.</span>
          </div>
        </div>
      ) : null}
      <Pointer t={t} path={[{ x: 600, y: 900, at: 0 }, { x: 270, y: 470, at: story, click: true }, { x: 520, y: 700, at: schicken + 0.4 }]} size={56} />
    </PanelStage>
  );
};

// ================= 7. "Der Haken: Das Spiel läuft im Browser, nicht im App Store." =================
export const SceneHaken: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const haken = m("haken", 0.05), browser = m("browser", 0.45), app = m("app", 0.75);
  const cross = k(t, app, 0.3, ez);
  return (
    <PanelStage t={t} dur={dur} seed={68}>
      <TopTag t={t} text="DER HAKEN" at={haken - 0.1} color={C.red} style={{ left: 420, top: 26 }} />
      {/* browser window with the game */}
      <div style={{ position: "absolute", left: 50, top: 100, width: 560, height: 690, transform: tilt(t, 3, 6), ...ps(t, haken + 0.1, 20, 0.8) }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${t > browser ? C.green : CL.border}`, overflow: "hidden" }}>
          <div style={{ height: 70, background: "#F1EFEA", display: "flex", alignItems: "center", gap: 10, padding: "0 16px" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1, marginLeft: 10, height: 42, borderRadius: 999, background: "#FFF", display: "flex", alignItems: "center", gap: 8, padding: "0 16px", fontFamily: fonts.medium, fontSize: 20, color: CL.text, whiteSpace: "nowrap", overflow: "hidden" }}>🔒 {typed("holzmann-spiel.netlify.app", t, browser - 0.3, browser + 0.3)}</div>
          </div>
          <div style={{ position: "absolute", left: "50%", top: 84, marginLeft: -168 }}>
            <Phone w={316} g0={14} style={{ left: 0, top: 0 }} />
          </div>
        </div>
        {t > browser ? <div style={{ position: "absolute", left: 20, bottom: -26, zIndex: 3, ...ps(t, browser, 10, 0.6) }}><Pill text="LÄUFT IM BROWSER · EIN LINK" color="#FFF" bg={C.green} size={22} dot={false} /></div> : null}
      </div>
      {/* app store card */}
      <div style={{ position: "absolute", left: 660, top: 230, width: 370, ...ps(t, app - 0.35, 20, 0.8) }}>
        <div style={{ background: "#FFF", borderRadius: 26, boxShadow: paperShadow, border: `1.5px solid ${CL.border}`, padding: "26px 26px", filter: `grayscale(${cross})`, opacity: 1 - cross * 0.35 }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: "linear-gradient(160deg, #1AC8FC, #1872F6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={60} height={60} viewBox="0 0 24 24"><path d="M8 17l5-9M16 17l-5-9M6 14h12" stroke="#FFF" strokeWidth={2.2} strokeLinecap="round" fill="none" /></svg>
          </div>
          <div style={{ fontFamily: fonts.bold, fontSize: 34, color: PK.ink, marginTop: 16 }}>App Store</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, marginTop: 6, lineHeight: 1.3 }}>Konto, Prüfung, Updates, Download</div>
        </div>
        {cross > 0 ? (
          <svg width={370} height={300} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d="M30 30 L340 270" stroke={C.red} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cross} />
            <path d="M340 30 L30 270" stroke={C.red} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(t, app + 0.15, 0.3, ez)} />
          </svg>
        ) : null}
        {t > app + 0.3 ? <div style={{ marginTop: 22, ...ps(t, app + 0.3, 10, 0.6) }}><Pill text="NICHT NÖTIG" color="#FFF" bg={C.red} size={22} dot={false} /></div> : null}
      </div>
      <Glint t={t} at={browser + 0.2} x={590} y={110} size={36} />
    </PanelStage>
  );
};

// ================= 8. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={69}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, Pill, PK };
