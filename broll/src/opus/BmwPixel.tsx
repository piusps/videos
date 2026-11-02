import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-bmw-leasing/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "BMW nach der Beförderung" (hedonische Tretmühle, Brickman et al. 1978, 2026-10-30) im Pixel-Niklas-Look wie HouseMoneyPixel.
// Figur "dein Kumpel" (Share-Mechanik). +200 € netto vs. 650 € Rate, alter Golf, Tretmühle, Lotto-Glücksskala 4,0 vs. 3,8.
// Pointe "Nächstes Jahr wird er ja wieder befördert" ruhig auf dem Gesicht, danach Gegenmittel #6 (Vollkosten-Rechner), Wort LEASING.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9", TEAL = "#2FD3B0";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const BMW_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  kumpel: at("kumpel", 0), befoerdert0: at("befördert", 0), samstag: at("samstag"), bmw: at("bmw"), least: at("least"),
  zweihundert: at("zweihundert"), netto: at("netto"), sechshundert: at("sechshundertfünfzig"), rate0: at("rate", 0),
  seine: at("seine"), kostet0: at("kostet", 0), vierhundert: at("vierhundertfünfzig"),
  sagt0: at("sagt", 0), leasing0: at("leasing", 0), kaufen: at("kaufen"), golf: at("golf"), nicht: at("nicht"),
  heisst: at("heißt"), tretmuehle: at("tretmühle"), ansprueche: at("ansprüche"), glueck: at("glück"), war: at("war"),
  forscher: at("forscher"), lotto: at("lottogewinner"), skala: at("skala"), gewinner0: at("gewinner", 0), vier: at("vier"), ohne: at("ohne"), acht: at("acht"),
  fruehstueck: at("frühstück"), kompliment: at("kompliment"), gewinner1: at("gewinner", 1), weniger: at("weniger"),
  gekauft: at("gekauft"), auto0: at("auto", 0), blick: at("blick"), kollegen: at("kollegen"), parkplatz0: at("parkplatz", 0), haelt: at("hält"), zwei: at("zwei"), wochen: at("wochen"),
  fahr: at("fahr"), aelteste: at("älteste"), freundeskreis: at("freundeskreis"), kunden: at("kunden"), ecke: at("ecke"),
  sagt1: at("sagt", 1), minus: at("minus"), befoerdert1: at("befördert", 1),
  bevor: at("bevor"), chatgpt: at("chatgpt"), kostet1: at("kostet", 1), rate1: at("rate", 1), anzahlung: at("anzahlung"), versicherung: at("versicherung"), kilometer: at("kilometer"), rueckgabe: at("rückgabe"),
  schreib: at("schreib"), leasing1: at("leasing", 1), schick0: at("schick", 0), schick1: at("schick", 1), video: at("video"),
};

// ---------- pixel plates ----------
type Op = [number, number, number, number, string];
const painter = () => {
  const ops: Op[] = [];
  const R = (x: number, y: number, w: number, h: number, c: string) => { ops.push([x, y, w, h, c]); };
  const P = (x: number, y: number, c: string) => R(x, y, 1, 1, c);
  return { ops, R, P };
};
// parking lot in front of the office: sky, building, asphalt with bay lines
const drawLot = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 100, "#9FD0EE"); for (let i = 0; i < 6; i++) R((i * 41) % 170, 8 + (i * 13) % 20, 14, 3, "#FFFFFF");
  R(0, 40, 180, 60, "#C9C2B6"); for (let x = 6; x < 180; x += 16) for (let y = 46; y < 94; y += 12) R(x, y, 10, 7, "#7FA9C9");
  R(0, 98, 180, 2, "#8A857E");
  R(0, 100, 180, 60, "#6A6A70"); for (let i = 0; i < 40; i++) P((i * 53) % 180, 104 + (i * 17) % 54, "#7A7A80");
  for (let x = 4; x < 180; x += 44) R(x, 104, 2, 50, "#F2F0EA");
  return p.ops;
};
const drawOffice = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#D7DCE2"); for (let y = 4; y < 118; y += 9) for (let x = (y % 2) * 6; x < 180; x += 13) P(x, y, "#CBD1D8");
  R(10, 14, 60, 34, "#FFFFFF"); R(10, 14, 60, 4, BLUE); R(14, 24, 40, 2, "#B9B2A6"); R(14, 30, 30, 2, "#B9B2A6"); R(14, 38, 20, 6, GREEN);
  R(0, 118, 180, 42, "#7E858D"); R(0, 118, 180, 1, "#5E656D");
  return p.ops;
};
const drawGym = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#3B2A5C"); for (let y = 3; y < 160; y += 7) for (let x = (y % 2) * 5; x < 180; x += 11) P(x, y, "#46336B");
  R(0, 132, 180, 28, "#2A1E44"); R(0, 132, 180, 1, GOLD);
  return p.ops;
};
const drawDesk = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#5B3B26"); for (let y = 2; y < 160; y += 5) for (let x = (y % 3) * 4; x < 180; x += 13) P(x, y, "#6B4730");
  for (let y = 0; y < 160; y += 16) R(0, y, 180, 1, "#4E321F");
  return p.ops;
};
const drawStreet = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 100, "#F4D9A8"); R(150, 12, 10, 10, "#FFF3C4");
  R(0, 30, 70, 70, "#B0A090"); for (let x = 6; x < 70; x += 14) for (let y = 38; y < 92; y += 12) R(x, y, 8, 7, "#7FA9C9");
  R(110, 22, 70, 78, "#8C9AA8"); R(110, 22, 70, 8, BLUE); for (let x = 116; x < 180; x += 14) for (let y = 36; y < 92; y += 12) R(x, y, 8, 7, "#DDE8F2");
  R(0, 100, 180, 60, "#6A6A70"); for (let x = 0; x < 180; x += 24) R(x, 128, 12, 2, "#F2F0EA");
  return p.ops;
};
const PLATES = { lot: drawLot(), office: drawOffice(), gym: drawGym(), desk: drawDesk(), street: drawStreet() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { lot: "#9FD0EE", office: "#D7DCE2", gym: "#3B2A5C", desk: "#5B3B26", street: "#F4D9A8" };

// ---------- people ----------
const NK = [
  "....hhhhhh....", "...hHHLLHHh...", "..hHHHHLLHHh..", "..HHhSSSSHHH..", "..HSSSSSSSSH..", "..SSESSSSESS..", "..sSSSSSSSSs..", "..SSSSssSSSS..",
  "..sSbbbbbbSs..", "...sbbSSbbs...", "....sSSSSs....", "..nNNWWWWNNn..", ".nNNNNWZWNNNn.", ".NNNNNNZNNNNN.", ".NNnNNNZNNNnNN", ".NN.NNNZNNN.NN",
  ".NN.NNNZNNN.NF", ".SS.NNNNNNN.Ff", "....NNNNNNN.Ff", "....PPPPPPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "...BBBB.BBBB..",
];
const SK = { S: "#F2C6A4", s: "#D9A27F" };
const PAL = {
  niklas: { h: "#8A5A30", H: "#B07A45", L: "#C99A63", ...SK, E: "#2B2B2B", b: "#B58A62", N: "#1E2433", n: "#2E3650", W: "#F5F5F5", Z: "#C9C9C9", P: "#3A3F4A", B: "#151515", F: "#111111", f: "#7FD3FF" },
  kumpel: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: "#C0503A", n: "#9E3F2D", W: "#F5F5F5", Z: "#9E3F2D", P: "#2E3650", B: "#F5F5F5", F: "#111111", f: TEAL },
};
type Who = keyof typeof PAL;
const Person: React.FC<{ t: number; who: Who; x: number; y: number; px?: number; flip?: boolean; seed?: number; a?: number; bob?: number; speed?: number; style?: React.CSSProperties }> = ({ t, who, x, y, px = 12, flip, seed = 0, a = -1, bob = 1, speed = 3.2, style }) => {
  const st = a >= 0 ? popStyle(t, a, 30, 0.4) : {};
  const hop = Math.floor(t * speed + seed) % 2 ? -px * bob : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ position: "absolute", left: px * 3, top: NK.length * px - px * 0.6, width: px * 9, height: px * 1.2, background: "rgba(0,0,0,0.28)" }} />
      <div style={{ transform: `translateY(${hop}px) scaleX(${flip ? -1 : 1})` }}><Sprite rows={NK} pal={PAL[who]} px={px} /></div>
    </div>
  );
};

// ---------- props ----------
const LETTER = { rows: ["KKKKKKKKKKKK", "KBBBBBBBBBBK", "KBBBBBBBBBBK", "KWWWWWWWWWWK", "KWggggggWWWK", "KWWWWWWWWWWK", "KWggggggggWK", "KWWWWWWWWWWK", "KWggggWWWWWK", "KWWWWWWWWWWK", "KWWWWWGGGGWK", "KKKKKKKKKKKK"], pal: { K: INK, B: BLUE, W: "#FFF", g: "#B9B2A6", G: GREEN } };
const GLASS = { rows: ["K......K", "KYYYYYYK", "KYYYYYYK", ".KYYYYK.", "..KYYK..", "...KK...", "...KK...", ".KKKKKK."], pal: { K: INK, Y: GOLD } };
const TAXI = { rows: ["....KKKKKK......", "...KYKBBKYK.....", "..KYYKBBKYYK....", "KKKKKKKKKKKKKKKK", "KYYYYYYYYYYYYYYK", "KYYKKYYYYYYKKYYK", ".KKWWKKKKKKWWKK.", "..KKK......KKK.."], pal: { K: INK, Y: GOLD, B: "#9ED3F0", W: "#888" } };
const SHOE = { rows: [".....KKKK.....", "....KWWWWK....", "...KWWWTWWK...", "..KWWWWWWWWKK.", "KKWWWWWWWWWWWK", "KWWWWTTTWWWWWK", "KKKKKKKKKKKKKK", ".RRRRRRRRRRRR."], pal: { K: INK, W: "#FFF", T: TEAL, R: RED } };
const COIN = { rows: [".YY.", "YyYY", "YYyY", ".YY."], pal: { Y: GOLD, y: "#FFF3B0" } };
const CHIP = { rows: ["..KKKK..", ".KRWWRK.", "KRRRRRRK", "KWRYYRWK", "KWRYYRWK", "KRRRRRRK", ".KRWWRK.", "..KKKK.."], pal: { K: INK, R: RED, W: "#FFF", Y: GOLD } };
const ROBOT = { rows: ["....KK....", "....RR....", ".KKKKKKKK.", "KWWWWWWWWK", "KWBBWWBBWK", "KWBBWWBBWK", "KWWWWWWWWK", "KWWRRRRWWK", "KWWWWWWWWK", ".KKKKKKKK."], pal: { K: INK, W: "#F5F5F5", B: GREEN, R: RED } };
const PLANE = { rows: ["K.........", "KKK.......", "KWWKK.....", "KWWWWKK...", "KWWWWWWKK.", "KWWWWKK...", "KWWKK.....", "KKK.......", "K........."], pal: { K: INK, W: "#FFF" } };
const MINI = { rows: ["..KK..", ".KSSK.", ".KSSK.", "..KK..", ".KNNK.", "KNNNNK", "KNNNNK", ".KNNK.", ".K..K."], pal: { K: INK, S: "#F2C6A4", N: "#9AA3AD" } };
const BIGCOIN = { rows: ["...KKKK...", ".KKYYYYKK.", ".KYYyyYYK.", "KYYyYYYYYK", "KYYyYYYYYK", "KYYYYYYYYK", "KYYYYYYyYK", ".KYYYYyYK.", ".KKYYYYKK.", "...KKKK..."], pal: { K: INK, Y: GOLD, y: "#FFF3B0" } };

const pad = (rows: string[]) => { const w = Math.max(...rows.map((r) => r.length)); return rows.map((r) => r.padEnd(w, ".")); };
const BMW = { rows: pad([
  "..........KKKKKKKKKKKK..........",
  "........KKBBBBBBBBBBBBKK........",
  ".......KBBGGGGGGKBGGGGGBK.......",
  "......KBBGGGGGGGKBGGGGGGBK......",
  "..KKKKBBBBBBBBBBBBBBBBBBBBKKKK..",
  ".KBBBBBBBBBBBBBBBBBBBBBBBBBBBBK.",
  "KWBBBBBBBBBBBBBBBBBBBBBBBBBBKWYK",
  "KBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBK",
  "KBBBKKKKKBBBBBBBBBBBBBKKKKKBBBBK",
  ".KKKKSSSKKKKKKKKKKKKKKKSSSKKKKK.",
  "....KKKKK.............KKKKK.....",
]), pal: { K: INK, B: "#2F5FB0", G: "#BFE3F2", W: "#FFFFFF", Y: "#F7DA8B", S: "#B8B8C0" } };
const GOLF = { rows: pad([
  "......KKKKKKKKKKKK......",
  ".....KGGGGGKGGGGGGK.....",
  ".....KGGGGGKGGGGGGK.....",
  "KKKKKKCCCCCCCCCCCCKKKKKK",
  "KCCCCCCCCCCCCCCCCCCCCCYK",
  "KCCCRRCCCCCCCCCCCCRCCCCK",
  "KCCKKKKCCCCCCCCCKKKKCCCK",
  ".KKKSSKKKKKKKKKKKSSKKKK.",
  "...KKKK.........KKKK....",
]), pal: { K: INK, C: "#C9B48A", G: "#D8D2C4", R: "#8A5A3C", Y: "#F7DA8B", S: "#9A9AA2" } };
const TICKET = { rows: ["KKKKKKKKKKKKKK", "KRRRRRRRRRRRRK", "KWWWWWWWWWWWWK", "KWKWKWKWKWKWWK", "KWWWWWWWWWWWWK", "KWKWKWKWKWKWWK", "KWWWWWWWWWWWWK", "KKKKKKKKKKKKKK"], pal: { K: INK, R: RED, W: "#FFF" } };

// ---------- pixel UI pieces ----------
const PxBox: React.FC<{ bg?: string; color?: string; size?: number; border?: string; shadow?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ bg = GOLD, color = INK, size = 28, border = INK, shadow = true, style, children }) => (
  <div style={{ position: "absolute", fontFamily: PX, fontSize: size, lineHeight: 1.25, color, background: bg, border: `${Math.max(4, Math.round(size / 6))}px solid ${border}`, padding: `${size * 0.55}px ${size * 0.6}px ${size * 0.4}px`, boxShadow: shadow ? `6px 6px 0 ${INK}` : undefined, whiteSpace: "nowrap", zIndex: 8, ...style }}>{children}</div>
);
const Stamp: React.FC<{ t: number; a: number; text: string; bg?: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ t, a, text, bg = GOLD, color = INK, size = 44, rot = -6, style }) => {
  if (t < a) return null;
  const p = interpolate(t, [a, a + 0.14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <PxBox bg={bg} color={color} size={size} style={{ transform: `rotate(${rot}deg) scale(${2 - p})`, opacity: p, zIndex: 12, ...style }}>{text}</PxBox>;
};
const Pill: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", left: 36, top: 36, background: INK, color: "#FFF", fontFamily: SM, fontWeight: 700, fontSize: 24, padding: "10px 20px 10px 16px", borderRadius: 999, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 0 rgba(0,0,0,.15)", zIndex: 20 }}>
    <i style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD, display: "block" }} />{text}
  </div>
);
const spark = (t: number, a: number, cx: number, cy: number, n = 8, r0 = 40, r1 = 130, col = GOLD) => {
  const u = (t - a) / 0.45;
  if (u < 0 || u > 1) return null;
  return Array.from({ length: n }, (_, i) => {
    const ang = (i / n) * Math.PI * 2 + 0.3;
    const r = r0 + (r1 - r0) * Easing.out(Easing.cubic)(u);
    const s = Math.round(14 * (1 - u)) + 4;
    return <div key={i} style={{ position: "absolute", left: cx + Math.cos(ang) * r - s / 2, top: cy + Math.sin(ang) * r - s / 2, width: s, height: s, background: i % 2 ? col : "#FFFFFF", border: `2px solid ${INK}`, zIndex: 11 }} />;
  });
};
const ease = Easing.inOut(Easing.cubic);
const lerp = (t: number, a: number, b: number, v0: number, v1: number) => interpolate(t, [a, b], [v0, v1], { ...clamp, easing: ease });
const bump = (t: number, a: number, amt = 0.14, w = 0.2) => 1 + amt * Math.max(0, 1 - Math.abs(t - a) / w);
const Car: React.FC<{ kind: "bmw" | "golf"; x: number; y: number; px?: number; shine?: boolean; t: number }> = ({ kind, x, y, px = 12, shine, t }) => {
  const s = kind === "bmw" ? BMW : GOLF;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 5 }}>
      <div style={{ position: "absolute", left: px, top: s.rows.length * px - px * 0.5, width: (s.rows[0].length - 2) * px, height: px * 1.2, background: "rgba(0,0,0,0.3)" }} />
      <Sprite rows={s.rows} pal={s.pal} px={px} />
      {shine ? [0, 1, 2].map((i) => { const ph = (t * 1.6 + i * 0.33) % 1; return <div key={i} style={{ position: "absolute", left: (0.15 + i * 0.32) * s.rows[0].length * px, top: -px * 2 - ph * 20, width: px, height: px, background: "#FFF", opacity: 1 - ph, boxShadow: `${px}px 0 0 #FFF, -${px}px 0 0 #FFF, 0 ${px}px 0 #FFF, 0 -${px}px 0 #FFF` }} />; }) : null}
    </div>
  );
};

// ---------- scenes ----------
// 1 · Hook: Kumpel gets promoted, leases a BMW the same Saturday. +200 € netto, -650 € Rate.
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const carX = t < A.bmw - 0.2 ? 1200 : lerp(t, A.bmw - 0.2, A.bmw + 0.4, 1200, 540);
  return (
    <>
      <Plate id="lot" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 28, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${bump(t, 0.2, 0.06)})` }}>
          DEIN KUMPEL: <span style={{ color: GOLD }}>BEFÖRDERT</span>
        </div>
      </div>
      <Person t={t} who="kumpel" x={90} y={470} px={13} a={0.1} bob={1} />
      {t > A.befoerdert0 - 0.1 ? <Stamp t={t} a={A.befoerdert0 - 0.1} text="BEFÖRDERT ✓" bg={GREEN} color="#FFF" size={26} rot={-5} style={{ left: 120, top: 250 }} /> : null}
      {t > A.samstag - 0.1 ? <PxBox bg="#FFF" size={18} style={{ left: 640, top: 250, ...popStyle(t, A.samstag - 0.1, 10, 0.5) }}>SAMSTAG</PxBox> : null}
      {t > A.bmw - 0.2 ? <Car kind="bmw" x={carX} y={640} px={13} shine={t > A.bmw + 0.4} t={t} /> : null}
      {t > A.bmw + 0.3 ? spark(t, A.bmw + 0.35, 750, 700, 10, 60, 210) : null}
      {t > A.least - 0.05 ? <Stamp t={t} a={A.least - 0.05} text="GELEAST" bg={GOLD} size={20} rot={6} style={{ left: 780, top: 560 }} /> : null}
      {t > A.zweihundert - 0.15 ? <PxBox bg={GREEN} color="#FFF" size={24} style={{ left: 560, top: 340, transform: `scale(${bump(t, A.netto, 0.12)})`, ...popStyle(t, A.zweihundert - 0.15, 14, 0.5) }}>+200 € NETTO</PxBox> : null}
      {t > A.sechshundert - 0.15 ? <PxBox bg={RED} color="#FFF" size={24} style={{ left: 560, top: 440, transform: `scale(${bump(t, A.rate0, 0.12)})`, ...popStyle(t, A.sechshundert - 0.15, 14, 0.5) }}>-650 € RATE</PxBox> : null}
    </>
  );
};

// 1b · "Seine Beförderung kostet ihn jetzt jeden Monat 450 Euro."
const SceneMinus: React.FC<{ t: number }> = ({ t }) => {
  const res = t < A.kostet0 ? 0 : lerp(t, A.kostet0, A.vierhundert + 0.5, 0, -450);
  return (
    <>
      <Plate id="office" />
      <div style={{ position: "absolute", left: 120, top: 330, width: 840, zIndex: 7, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, ...popStyle(t, A.seine - 0.1, 16, 0.5) }}>
        <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>SEIN MONAT AB JETZT</div>
        <div style={{ padding: "18px 26px", fontFamily: PX }}>
          <div style={{ display: "flex", justifyContent: "space-between", height: 64, alignItems: "center", fontSize: 22 }}><span>BEFÖRDERUNG</span><span style={{ color: GREEN }}>+200 €</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", height: 64, alignItems: "center", fontSize: 22, borderBottom: `5px solid ${INK}` }}><span>LEASINGRATE</span><span style={{ color: RED }}>-650 €</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", height: 90, alignItems: "center", fontSize: 30 }}><span>JEDEN MONAT</span><span style={{ color: RED, transform: `scale(${bump(t, A.vierhundert + 0.5, 0.15)})` }}>{Math.round(res)} €</span></div>
        </div>
      </div>
      {t > A.vierhundert + 0.4 ? <Stamp t={t} a={A.vierhundert + 0.4} text="BEFÖRDERUNG = MINUS" bg={RED} color="#FFF" size={26} rot={-4} style={{ left: 190, top: 760 }} /> : null}
    </>
  );
};

// 1c · "Leasing ist günstiger als kaufen. Günstiger als sein alter Golf ist es nicht."
const SceneGolf: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="lot" />
    {t > A.leasing0 - 0.15 ? <PxBox bg="#FFF" size={22} style={{ left: 120, top: 150, transform: "rotate(-2deg)", ...popStyle(t, A.leasing0 - 0.15, 12, 0.5) }}>„GÜNSTIGER ALS KAUFEN“</PxBox> : null}
    <Car kind="bmw" x={40} y={620} px={13} shine t={t} />
    <PxBox bg={RED} color="#FFF" size={18} style={{ left: 90, top: 520 }}>650 € / MONAT</PxBox>
    {t > A.golf - 0.2 ? (
      <div style={{ ...popStyle(t, A.golf - 0.2, 14, 0.5) }}>
        <Car kind="golf" x={600} y={660} px={13} t={t} />
        <PxBox bg={GREEN} color="#FFF" size={18} style={{ left: 640, top: 540 }}>ALTER GOLF: 0 €</PxBox>
      </div>
    ) : null}
    {t > A.nicht - 0.1 ? <Stamp t={t} a={A.nicht - 0.1} text="GÜNSTIGER? NEIN." bg={GOLD} size={30} rot={-5} style={{ left: 230, top: 300 }} /> : null}
  </>
);

// 2 · The term: HEDONISCHE TRETMÜHLE, Kumpel running in a wheel; ANSPRÜCHE rise, GLÜCK stays
const Meter: React.FC<{ label: string; v: number; col: string; y: number }> = ({ label, v, col, y }) => (
  <div style={{ position: "absolute", left: 600, top: y, width: 400, zIndex: 7 }}>
    <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF", marginBottom: 12 }}>{label}</div>
    <div style={{ height: 56, background: "#ECE8DF", border: `5px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}` }}><div style={{ height: "100%", width: `${v * 100}%`, background: col }} /></div>
  </div>
);
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("HEDONISCHE", t, A.heisst, A.heisst + 0.5);
  const l2 = typed("TRETMÜHLE", t, A.tretmuehle - 0.05, A.tretmuehle + 0.45);
  const want = 0.3 + 0.65 * k(t, A.ansprueche - 0.1, 0.9, ease);
  const happy = 0.45 + 0.25 * Math.max(0, Math.sin(Math.min(Math.PI, (t - A.glueck + 0.1) * 2.4))) * (t > A.glueck - 0.1 ? 1 : 0);
  return (
    <>
      <Plate id="gym" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 52, lineHeight: 1.2, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "28px 30px 16px", textAlign: "center", ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"HEDONISCHE".slice(l1.length)}</span><br />
          {l2}<span style={{ opacity: 0 }}>{"TRETMÜHLE".slice(l2.length)}</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 400, width: 420, height: 420, zIndex: 5 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `18px dashed ${GOLD}`, transform: `rotate(${t * 140}deg)` }} />
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", border: `6px solid ${INK}` }} />
        <Person t={t} who="kumpel" x={142} y={90} px={9} speed={8} />
      </div>
      {t > A.ansprueche - 0.2 ? <div style={popStyle(t, A.ansprueche - 0.2, 12, 0.5)}><Meter label="ANSPRÜCHE" v={want} col={RED} y={430} /></div> : null}
      {t > A.glueck - 0.2 ? <div style={popStyle(t, A.glueck - 0.2, 12, 0.5)}><Meter label="GLÜCK" v={happy} col={GREEN} y={600} /></div> : null}
      {t > A.war - 0.1 ? <Stamp t={t} a={A.war - 0.1} text="WIE VORHER" bg={GOLD} size={24} rot={-4} style={{ left: 640, top: 780 }} /> : null}
    </>
  );
};

// 3 · The study: lottery winners 4,0 vs 3,8 happiness (0–5), less joy in breakfast/compliment
const Bar: React.FC<{ t: number; a: number; label: string; v: number; col: string }> = ({ t, a, label, v, col }) => {
  const u = k(t, a, 0.6, ease);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, height: 70, fontFamily: PX }}>
      <span style={{ width: 250, fontSize: 17 }}>{label}</span>
      <div style={{ flex: 1, height: 44, background: "#ECE8DF", border: `4px solid ${INK}` }}><div style={{ height: "100%", width: `${(u * v / 5) * 100}%`, background: col }} /></div>
      <span style={{ width: 90, fontSize: 22, textAlign: "right", opacity: u }}>{v.toFixed(1).replace(".", ",")}</span>
    </div>
  );
};
const StudyCard: React.FC<{ t: number; s: number; y: number; title: string; children: React.ReactNode }> = ({ t, s, y, title, children }) => (
  <div style={{ position: "absolute", left: 70, top: y, width: 940, zIndex: 7, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, ...popStyle(t, s, 16, 0.5) }}>
    <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>{title}</div>
    <div style={{ padding: "12px 24px" }}>{children}</div>
  </div>
);
const SceneStudy: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="desk" />
    {t > A.lotto - 0.2 ? <div style={{ position: "absolute", left: 430, top: 110, zIndex: 6, transform: `rotate(${Math.sin(t * 3) * 5}deg)`, ...popStyle(t, A.lotto - 0.2, 12, 0.5) }}><Sprite rows={TICKET.rows} pal={TICKET.pal} px={12} /></div> : null}
    <PxBox bg={INK} color="#FFF" size={15} shadow={false} style={{ right: 40, top: 40, ...popStyle(t, A.forscher, 10, 0.5) }}>BRICKMAN U.A. 1978</PxBox>
    {t > A.skala - 0.2 ? (
      <StudyCard t={t} s={A.skala - 0.2} y={250} title="WIE GLÜCKLICH? (0 BIS 5)">
        <Bar t={t} a={A.vier - 0.1} label="LOTTOGEWINNER" v={4.0} col={GOLD} />
        <Bar t={t} a={A.acht - 0.2} label="OHNE GEWINN" v={3.8} col={BLUE} />
      </StudyCard>
    ) : null}
    {t > A.fruehstueck - 0.2 ? (
      <StudyCard t={t} s={A.fruehstueck - 0.2} y={560} title="FREUDE AN FRÜHSTÜCK & KOMPLIMENT">
        <Bar t={t} a={A.gewinner1 - 0.1} label="LOTTOGEWINNER" v={3.3} col={GOLD} />
        <Bar t={t} a={A.fruehstueck} label="OHNE GEWINN" v={3.8} col={BLUE} />
      </StudyCard>
    ) : null}
    {t > A.weniger - 0.1 ? <Stamp t={t} a={A.weniger - 0.1} text="WENIGER" bg={RED} color="#FFF" size={26} rot={6} style={{ left: 760, top: 520 }} /> : null}
  </>
);

// 4 · "Gekauft hat er nicht das Auto. Sondern den Blick der Kollegen auf dem Parkplatz. Der hält ungefähr zwei Wochen."
const SceneLot: React.FC<{ t: number }> = ({ t }) => {
  const days = t < A.haelt - 0.1 ? 14 : Math.round(lerp(t, A.haelt, A.wochen + 0.9, 14, 0));
  const fade = t < A.haelt ? 1 : Math.max(0.15, days / 14);
  return (
    <>
      <Plate id="lot" />
      <Car kind="bmw" x={320} y={660} px={13} shine={days > 0} t={t} />
      {t > A.auto0 - 0.1 && t < A.blick - 0.1 ? <Stamp t={t} a={A.auto0 - 0.1} text="NICHT DAS AUTO" bg="#FFF" size={24} rot={-3} style={{ left: 260, top: 180 }} /> : null}
      {t > A.kollegen - 0.2 ? [0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: 90 + i * 240, top: 330 + (i % 2) * 30, zIndex: 6, opacity: fade, ...popStyle(t, A.kollegen - 0.2 + i * 0.08, 10, 0.5) }}>
          <div style={{ padding: 6, background: "#FFF", border: `4px solid ${INK}` }}><Sprite rows={MINI.rows} pal={MINI.pal} px={11} /></div>
          <PxBox bg={GOLD} size={14} style={{ left: 40, top: -50 }}>WOW</PxBox>
        </div>
      )) : null}
      {t > A.blick - 0.1 ? <Stamp t={t} a={A.blick - 0.1} text="DER BLICK DER KOLLEGEN" bg={GOLD} size={22} rot={-3} style={{ left: 150, top: 160 }} /> : null}
      {t > A.haelt - 0.15 ? <PxBox bg={days > 0 ? INK : RED} color={days > 0 ? GOLD : "#FFF"} size={24} style={{ left: 300, top: 560, transform: `scale(${bump(t, A.wochen + 0.9, 0.15)})`, ...popStyle(t, A.haelt - 0.15, 12, 0.5) }}>HÄLT NOCH: {days} TAGE</PxBox> : null}
    </>
  );
};

// 5 · Founder: oldest car among friends, parks around the corner at the client
const SceneFounder: React.FC<{ t: number }> = ({ t }) => {
  const gx = t < A.ecke - 0.4 ? 470 : lerp(t, A.ecke - 0.4, A.ecke + 0.5, 470, 1150);
  return (
    <>
      <Plate id="street" />
      <Person t={t} who="niklas" x={80} y={460} px={11} a={A.fahr - 0.1} />
      <Car kind="golf" x={gx} y={680} px={13} t={t} />
      {t > A.aelteste - 0.1 ? <Stamp t={t} a={A.aelteste - 0.1} text="ÄLTESTES AUTO IM FREUNDESKREIS" bg={GOLD} size={18} rot={-3} style={{ left: 60, top: 170 }} /> : null}
      {t > A.kunden - 0.2 ? <PxBox bg={BLUE} color="#FFF" size={20} style={{ left: 760, top: 300, ...popStyle(t, A.kunden - 0.2, 12, 0.5) }}>KUNDE</PxBox> : null}
      {t > A.ecke - 0.2 ? <Stamp t={t} a={A.ecke - 0.2} text="PARKT UM DIE ECKE →" bg="#FFF" size={20} rot={3} style={{ left: 440, top: 520 }} /> : null}
    </>
  );
};

// 6 · Outro: cover → ChatGPT adds up the real monthly cost → comment LEASING → DM with PDF → "an Kumpel senden"
const PAGE = (n: number) => staticFile(`gpts-bmw-leasing/guide-${n === 1 ? "cover" : `p${n}`}.png`);
const CHECK: [keyof typeof A, string, string][] = [["rate1", "RATE", "650 €"], ["anzahlung", "ANZAHLUNG", "+83 €"], ["versicherung", "VERSICHERUNG", "+120 €"], ["kilometer", "KILOMETER", "+25 €"], ["rueckgabe", "RÜCKGABE", "+30 €"]];
const SceneOutro: React.FC<{ t: number }> = ({ t }) => {
  const a = A.bevor - 0.05;
  const bS = A.chatgpt, dS = A.schreib - 0.2, eS = A.schick1 - 0.15;
  const fl = Math.sin(t * 2.2) * 6, rot = Math.sin(t * 1.3) * 1.2;
  const cx = t < bS ? 320 : t < dS ? lerp(t, bS, bS + 0.4, 320, 40) : lerp(t, dS, dS + 0.4, 40, 60);
  const cw = t < bS ? 440 : t < dS ? lerp(t, bS, bS + 0.4, 440, 340) : lerp(t, dS, dS + 0.4, 340, 250);
  const cy = t < dS ? 90 : lerp(t, dS, dS + 0.4, 90, 70);
  const cr = t < bS ? interpolate(t, [a, a + 0.5], [-9, -4], clamp) : t < dS ? -5 : -7;
  const docIn = t > bS - 0.1 && t < dS + 0.4;
  const docX = t < dS ? lerp(t, bS - 0.1, bS + 0.3, 1100, 400) : lerp(t, dS, dS + 0.4, 400, 1150);
  const word = typed("LEASING", t, A.schreib + 0.05, A.leasing1 + 0.3);
  const sent = t > A.leasing1 + 0.4;
  const dmA = A.schick0 - 0.25;
  const blink = Math.floor(t * 3) % 2 === 0;
  const totalA = A.rueckgabe + 0.35;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFF6D6", backgroundImage: "radial-gradient(rgba(20,20,20,.10) 2px, transparent 2.5px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: cx, top: cy + fl, width: cw, zIndex: 6, transform: `rotate(${cr + rot}deg) translateY(${interpolate(t, [a, a + 0.5], [60, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, opacity: k(t, a, 0.25), border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, lineHeight: 0 }}>
        <Img src={PAGE(1)} style={{ width: "100%" }} />
      </div>
      {t > A.bevor && t < bS + 0.3 ? <PxBox bg={GOLD} size={22} style={{ left: 40, top: 720, transform: `rotate(-3deg) translateY(${fl * 0.5}px)`, ...popStyle(t, A.bevor, 10, 0.5) }}>GEGENMITTEL #6</PxBox> : null}
      {docIn ? (
        <div style={{ position: "absolute", left: docX, top: 140 + fl * 0.4, width: 630, zIndex: 8, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>WAS KOSTET DAS AUTO?</div>
          <div style={{ padding: "12px 20px 14px" }}>
            {CHECK.map(([w, kk, v], i) => {
              const s0 = A[w] - 0.15;
              if (t < s0) return <div key={i} style={{ height: 60 }} />;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 60, borderBottom: "3px dashed #C9C2B0", fontFamily: PX, ...popStyle(t, s0, 8, 0.4) }}>
                  <span style={{ width: 34, height: 34, background: GREEN, border: `4px solid ${INK}`, color: "#FFF", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                  <span style={{ fontSize: 18, color: INK }}>{kk}</span><span style={{ marginLeft: "auto", fontSize: 16, color: i ? RED : INK }}>{v}</span>
                </div>
              );
            })}
            {t > totalA ? (
              <div style={{ display: "flex", alignItems: "center", height: 70, fontFamily: PX, fontSize: 22, ...popStyle(t, totalA, 10, 0.5) }}>
                <span>WIRKLICH</span><span style={{ marginLeft: "auto", background: RED, color: "#FFF", padding: "10px 12px 6px", border: `4px solid ${INK}` }}>908 €/M</span>
              </div>
            ) : t < A.rueckgabe + 0.3 && blink ? <div style={{ width: 16, height: 26, background: INK, marginTop: 8 }} /> : null}
          </div>
          {t > A.kostet1 - 0.3 ? <PxBox bg="#FFF" size={15} style={{ left: -20, top: -46, ...popStyle(t, A.kostet1 - 0.3, 8, 0.5) }}>CHATGPT RECHNET MIT</PxBox> : null}
          <div style={{ position: "absolute", right: -24, bottom: -56, background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}`, ...popStyle(t, A.chatgpt, 14, 0.4) }}><Sprite rows={ROBOT.rows} pal={ROBOT.pal} px={7} /></div>
        </div>
      ) : null}
      {t > dS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: 150 + fl * 0.3, zIndex: 9, ...popStyle(t, dS, 20, 0.6) }}>
          <div style={{ fontFamily: PX, fontSize: 18, color: INK, marginBottom: 16 }}>KOMMENTARE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 18px" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}`, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily: PX, fontSize: 28, color: INK }}>{sent ? "" : word}{!sent && blink ? "▌" : ""}{sent ? <span style={{ color: "#B0AA9E", fontSize: 18 }}>KOMMENTAR …</span> : null}</div>
            <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: word.length === 7 ? BLUE : "#9AA3AD", padding: "12px 12px 8px", transform: `scale(${1 - 0.15 * Math.max(0, 1 - Math.abs(t - A.leasing1 - 0.35) / 0.1)})` }}>POSTEN</div>
          </div>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, ...popStyle(t, A.leasing1 + 0.4, 12, 0.6) }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}` }} />
              <div style={{ fontFamily: PX, fontSize: 24, color: INK, background: "#FFF", border: `5px solid ${INK}`, padding: "14px 16px 8px" }}>LEASING</div>
              <div style={{ fontFamily: PX, fontSize: 14, color: GREEN }}>✓ GEPOSTET</div>
            </div>
          ) : null}
        </div>
      ) : null}
      {t > dmA ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, dmA, dmA + 0.35, 980, 450) + fl * 0.5, zIndex: 10, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: INK, padding: "12px 16px" }}>
            <i style={{ width: 14, height: 14, borderRadius: "50%", background: GOLD, display: "block" }} />
            <span style={{ fontFamily: SM, fontWeight: 700, fontSize: 24, color: "#FFF" }}>Florent GPT</span>
            <span style={{ marginLeft: "auto", fontFamily: PX, fontSize: 12, color: GOLD }}>NEUE NACHRICHT</span>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", padding: 18 }}>
            <div style={{ width: 92, border: `4px solid ${INK}`, lineHeight: 0, flexShrink: 0, transform: `rotate(${Math.sin(t * 3) * 3}deg)` }}><Img src={PAGE(1)} style={{ width: "100%" }} /></div>
            <div style={{ fontFamily: PX, lineHeight: 1.5 }}>
              <div style={{ fontSize: 18, color: INK }}>LEASING-GUIDE.PDF</div>
              <div style={{ fontSize: 13, color: "#8A857A", marginTop: 6 }}>VOLLKOSTEN + PLAN</div>
              <div style={{ display: "inline-block", fontSize: 14, color: INK, background: GOLD, border: `4px solid ${INK}`, padding: "8px 10px 4px", marginTop: 10, transform: `scale(${1 + 0.06 * Math.abs(Math.sin(t * 5))})` }}>ÖFFNEN</div>
            </div>
          </div>
          {spark(t, dmA + 0.35, 350, 120, 10, 40, 170)}
        </div>
      ) : null}
      {t > eS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, eS, eS + 0.3, 980, 690) + fl * 0.4, zIndex: 12, display: "flex", alignItems: "center", gap: 18, background: BLUE, border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 20px" }}>
          <div style={{ transform: `translateX(${Math.sin(t * 4) * 6}px)` }}><Sprite rows={PLANE.rows} pal={PLANE.pal} px={6} /></div>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#C0503A", border: `4px solid ${INK}`, flexShrink: 0 }} />
          <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF" }}>AN KUMPEL SENDEN</div>
          {spark(t, eS + 0.3, 520, 40, 8, 30, 120)}
        </div>
      ) : null}
      {t > A.schreib - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", zIndex: 11, ...popStyle(t, A.schreib - 0.1, 10, 0.7) }}>
          <div style={{ fontFamily: SM, fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", color: "#FFF", background: INK, borderRadius: 999, padding: "12px 32px", transform: `scale(${1 + 0.03 * Math.sin(t * 6)})` }}>SCHREIB <span style={{ color: GOLD }}>„LEASING“</span></div>
        </div>
      ) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.seine - 0.1, El: SceneHook, pill: "Dein Kumpel", bg: PLATE_BG.lot },
  { from: A.seine - 0.1, to: A.sagt0 - 0.1, El: SceneMinus, pill: "Die Rechnung", bg: PLATE_BG.office },
  { from: A.sagt0 - 0.1, to: A.heisst - 0.05, El: SceneGolf, pill: "Leasing", bg: PLATE_BG.lot },
  { from: A.heisst - 0.05, to: A.forscher - 0.1, El: SceneTerm, pill: "Psychologie", bg: PLATE_BG.gym },
  { from: A.forscher - 0.1, to: A.gekauft - 0.1, El: SceneStudy, pill: "Die Studie", bg: PLATE_BG.desk },
  { from: A.gekauft - 0.1, to: A.fahr - 0.1, El: SceneLot, pill: "Was er gekauft hat", bg: PLATE_BG.lot },
  { from: A.fahr - 0.1, to: A.sagt1 - 0.3, El: SceneFounder, pill: "Ich", bg: PLATE_BG.street },
  { from: A.sagt1 - 0.3, to: A.bevor - 0.1 },
  { from: A.bevor - 0.1, to: 999, El: SceneOutro, pill: "Gegenmittel #6", bg: "#FFF6D6" },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["kumpel", "befördert", "bmw", "zweihundert", "netto", "sechshundertfünfzig", "vierhundertfünfzig", "minus", "leasing", "golf", "tretmühle", "ansprüche", "glück", "lottogewinner", "vier", "3,8", "weniger", "blick", "parkplatz", "wochen", "älteste", "ecke", "chatgpt", "rate", "anzahlung", "versicherung", "kilometer", "rückgabe", "video"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const SHOW: Record<string, string> = { zweihundert: "200 €", sechshundertfünfzig: "650 €", vierhundertfünfzig: "450 €", vier: "4", fünf: "5", drei: "3,8", komma: "", acht: "", zwei: "2" };
const show = (w: string) => { const n = norm(w); return SHOW[n] ?? w.replace(/[.,!?:„“"]/g, ""); };
type Chunk = { start: number; end: number; words: string[] };
const makeChunks = (caps: Cap[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Cap[] = [];
  const flush = () => { if (cur.length) out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => show(c.text)).filter(Boolean) }); cur = []; };
  for (const c of caps) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 17) || (cur.length && len > 20)) flush();
    cur.push(c);
    if (/[.,!?:]["“]?$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
};
const Caption: React.FC<{ t: number; y: number; chunks: Chunk[] }> = ({ t, y, chunks }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.18);
  const keyIdx = c.words.findIndex((w) => KEY.has(norm(w)) || /^\d/.test(w));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div style={{ transform: `translateY(-50%) scale(${0.82 + 0.18 * p})`, opacity: k(t, c.start - 0.04, 0.06), display: "inline-flex", alignItems: "center", gap: 14, fontFamily: SM, fontWeight: 700, fontSize: 44, letterSpacing: "0.12em", textTransform: "uppercase", padding: "8px 18px", background: INK, color: "#FFF", borderRadius: 8, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>
        {c.words.map((w, i) => (i === keyIdx ? <b key={i} style={{ background: GOLD, color: INK, padding: "0 10px", borderRadius: 4 }}>{w}</b> : <span key={i}>{w}</span>))}
      </div>
    </div>
  );
};

const ORDER = Array.from({ length: 12 * 11 }, (_, i) => ((i * 53) % 131) / 131);
const Dissolve: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const u = (t - a) / 0.24;
  if (a <= 0 || u < 0 || u > 1) return null;
  return <>{ORDER.map((o, i) => (o > u ? <div key={i} style={{ position: "absolute", left: (i % 12) * 90, top: Math.floor(i / 12) * 90, width: 90, height: 90, background: INK, zIndex: 30 }} /> : null))}</>;
};

// avatar framing in the split (from facefocus.txt)
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.444;

export const BmwPixel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = React.useMemo(() => makeChunks(CAPS), []);
  const sc = SCENES.find((s) => t >= s.from && t < s.to) ?? SCENES[SCENES.length - 1];
  const face = !sc.El;
  const cam = TL.camera(t, sc.from, sc.to);
  const dx = Math.sin(t * 0.6) * 4, dy = Math.cos(t * 0.45) * 3;
  const s = face ? 1.04 + 0.03 * k(t, sc.from, 0.9) : SPLIT_SCALE * (1 + 0.02 * Math.abs(Math.sin((t - sc.from) * 0.8)));
  const vw = W * s, vh = H * s;
  const left = Math.min(0, Math.max(W - vw, W / 2 - FOCUS_X * vw));
  const top = face ? (H - vh) * 0.4 : PH - SPLIT_SRC_TOP * s;
  const El = sc.El;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", left, top, width: vw, height: vh }}>
        <OffthreadVideo src={staticFile("render-gpts-bmw-leasing-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {El ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: sc.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", inset: -20, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 55%" }}>
            <div style={{ position: "absolute", left: 20, top: 20, width: W, height: PH }}><El t={t} /></div>
          </div>
          {sc.pill ? <Pill text={sc.pill} /> : null}
          <Dissolve t={t} a={sc.from} />
        </div>
      ) : null}
      <Caption t={t} y={face ? 1740 : PH} chunks={chunks} />
    </AbsoluteFill>
  );
};
