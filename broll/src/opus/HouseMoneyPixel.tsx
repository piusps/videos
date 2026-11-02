import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-house-money/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Steuererstattung" (House-Money-Effekt, Thaler & Johnson 1990, 2026-10-30) im Pixel-Niklas-Look wie PiepPixel.
// Figur "dein Kumpel" (Share-Mechanik). Studie als Pixel-Münzwurf (4 von 10 vs. fast 8 von 10).
// Pointe "Er sagt übrigens …" ruhig auf dem Gesicht, danach Gegenmittel #5 (Pauschalen-Check), Wort STEUER, "schick ihm das Video".

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9", TEAL = "#2FD3B0";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const HM_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  kumpel: at("kumpel", 0), erstattung: at("steuererstattung"), geschenktes: at("geschenktes"), neunhundert: at("neunhundert"), finanzamt0: at("finanzamt", 0),
  abend: at("abend"), bar: at("bar"), taxi: at("taxi"), sneaker0: at("sneaker", 0), war0: at("war", 0),
  doch: at("doch"), war1: at("war", 1), geliehen: at("geliehen"), zinsen: at("zinsen"),
  heisst: at("heißt"), house: at("housemoneyeffekt"), gewonnen0: at("gewonnen", 0), lockerer: at("lockerer"),
  forscher: at("forscher"), muenzwurf: at("münzwurf"), vier: at("vier"), nachdem: at("nachdem"), fuenfzehn: at("fünfzehn"), acht: at("acht"),
  find: at("find"), schoen: at("schön"), finanzamt1: at("finanzamt", 1), sneakerladen: at("sneakerladen"), kreislauf: at("kreislauf"),
  sagt: at("sagt"), ausgesucht: at("ausgesucht"),
  damit: at("damit"), chatgpt: at("chatgpt"), pauschale: at("pauschale"), homeoffice: at("homeoffice"), arbeitsweg: at("arbeitsweg"), handy: at("handy"), umzug: at("umzug"),
  schreib: at("schreib"), steuer: at("steuer"), schick0: at("schick", 0), schick1: at("schick", 1), video: at("video"),
};

// ---------- pixel plates ----------
type Op = [number, number, number, number, string];
const painter = () => {
  const ops: Op[] = [];
  const R = (x: number, y: number, w: number, h: number, c: string) => { ops.push([x, y, w, h, c]); };
  const P = (x: number, y: number, c: string) => R(x, y, 1, 1, c);
  return { ops, R, P };
};
// evening street: bar, sneaker shop, pavement
const drawStreet = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#2A2350"); for (let i = 0; i < 26; i++) P((i * 37) % 180, (i * 23) % 50, "#FFF");
  R(150, 10, 8, 8, "#F4E9B0");
  R(0, 52, 180, 76, "#3A3F4A"); for (let y = 56; y < 128; y += 8) R(0, y, 180, 1, "#343944");
  R(8, 70, 70, 50, "#2A2E36"); R(8, 62, 70, 10, "#8E3FB0"); R(14, 78, 58, 30, "#F4D58A");
  R(100, 70, 72, 50, "#2A2E36"); R(100, 62, 72, 10, RED); R(106, 78, 60, 30, "#F2F2F2");
  R(0, 128, 180, 32, "#6E6A64"); for (let x = 0; x < 180; x += 20) R(x, 128, 1, 32, "#5E5A55"); R(0, 128, 180, 1, "#8A857E");
  return p.ops;
};
// Finanzamt office: grey wall, filing shelves
const drawAmt = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#C9CDD2"); for (let y = 4; y < 118; y += 9) for (let x = (y % 2) * 6; x < 180; x += 13) P(x, y, "#BCC1C7");
  for (let x = 6; x < 180; x += 44) { R(x, 20, 36, 90, "#8A6A48"); for (let y = 26; y < 106; y += 14) { R(x + 3, y, 30, 10, "#F2EEE4"); R(x + 3, y + 9, 30, 1, "#6E5236"); } }
  R(0, 118, 180, 42, "#7E858D"); R(0, 118, 180, 1, "#5E656D");
  return p.ops;
};
const drawCasino = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#1B4D33"); for (let y = 3; y < 160; y += 7) for (let x = (y % 2) * 5; x < 180; x += 11) P(x, y, "#215B3D");
  R(0, 132, 180, 28, "#143A26"); R(0, 132, 180, 1, GOLD);
  return p.ops;
};
const drawDesk = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#5B3B26"); for (let y = 2; y < 160; y += 5) for (let x = (y % 3) * 4; x < 180; x += 13) P(x, y, "#6B4730");
  for (let y = 0; y < 160; y += 16) R(0, y, 180, 1, "#4E321F");
  return p.ops;
};
const drawRoom = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 118, "#E9DFCF"); for (let y = 6; y < 118; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < 180; x += 20) P(x, y, "#DDD0BC");
  R(0, 118, 180, 42, "#B98B5E"); for (let y = 122; y < 160; y += 6) R(0, y, 180, 1, "#A97B50");
  return p.ops;
};
const PLATES = { street: drawStreet(), amt: drawAmt(), casino: drawCasino(), desk: drawDesk(), room: drawRoom() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { street: "#2A2350", amt: "#C9CDD2", casino: "#1B4D33", desk: "#5B3B26", room: "#E9DFCF" };

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
const eur = (v: number) => Math.round(v).toLocaleString("de-DE") + " €";
const bump = (t: number, a: number, amt = 0.14, w = 0.2) => 1 + amt * Math.max(0, 1 - Math.abs(t - a) / w);

// ---------- scenes ----------
// 1 · Hook: the friend calls his tax refund "geschenktes Geld". +900 € → bar, taxi, sneakers drain it the same evening. "War ja nicht mein Geld."
const BUYS: [keyof typeof A, string, number][] = [["bar", "BAR", 260], ["taxi", "TAXI", 45], ["sneaker0", "SNEAKER", 595]];
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const night = t > A.abend - 0.2;
  const spent = BUYS.reduce((s, [w, , v]) => s + v * k(t, A[w] - 0.05, 0.35), 0);
  const bal = t < A.neunhundert - 0.1 ? 0 : lerp(t, A.neunhundert - 0.1, A.neunhundert + 0.4, 0, 900) - spent;
  return (
    <>
      <Plate id={night ? "street" : "room"} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 28, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${bump(t, 0.2, 0.06)})` }}>
          DEIN KUMPEL: <span style={{ color: GOLD }}>„GESCHENKTES GELD“</span>
        </div>
      </div>
      <Person t={t} who="kumpel" x={90} y={500} px={13} a={0.1} bob={1} />
      {/* the Finanzamt letter */}
      {!night && t > A.erstattung - 0.2 ? (
        <div style={{ position: "absolute", left: 520, top: 260, zIndex: 7, transform: `rotate(${Math.sin(t * 2) * 2}deg)`, ...popStyle(t, A.erstattung - 0.2, 16, 0.5) }}>
          <Sprite rows={LETTER.rows} pal={LETTER.pal} px={30} />
          <div style={{ position: "absolute", left: 30, top: 6, fontFamily: PX, fontSize: 16, color: "#FFF" }}>FINANZAMT</div>
          {t > A.geschenktes - 0.1 ? <Stamp t={t} a={A.geschenktes - 0.1} text="GESCHENKT?" bg={GOLD} size={22} rot={6} style={{ left: 150, top: -60 }} /> : null}
        </div>
      ) : null}
      {!night && t > A.neunhundert - 0.1 ? spark(t, A.neunhundert + 0.3, 700, 470, 10, 40, 170) : null}
      {/* the three buys */}
      {night ? BUYS.map(([w, label], i) => (t < A[w] - 0.15 ? null : (
        <div key={i} style={{ position: "absolute", left: 540 + (i % 2) * 30, top: 240 + i * 190, zIndex: 7, ...popStyle(t, A[w] - 0.15, 14, 0.5) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}` }}>
              <Sprite rows={i === 0 ? GLASS.rows : i === 1 ? TAXI.rows : SHOE.rows} pal={i === 0 ? GLASS.pal : i === 1 ? TAXI.pal : SHOE.pal} px={i === 0 ? 9 : i === 1 ? 6 : 7} />
            </div>
            <PxBox bg="#FFF" size={20} style={{ position: "relative" }}>{label}</PxBox>
            <PxBox bg={RED} color="#FFF" size={18} style={{ position: "relative" }}>-{BUYS[i][2]} €</PxBox>
          </div>
        </div>
      ))) : null}
      {/* refund balance */}
      {t > A.neunhundert - 0.1 ? (
        <PxBox bg={INK} color={bal < 1 ? RED : GOLD} size={26} style={{ left: 60, top: 400, transform: `scale(${bump(t, A.neunhundert + 0.4, 0.12) * bump(t, A.sneaker0 + 0.3, 0.1)})` }}>{bal >= 1 && t < A.abend ? "+" : ""}{eur(Math.max(0, bal))}</PxBox>
      ) : null}
      {t > A.war0 - 0.1 ? <PxBox bg="#FFF" size={18} style={{ left: 40, top: 168, transform: "rotate(-2deg)", ...popStyle(t, A.war0 - 0.1, 12, 0.5) }}>„WAR JA NICHT MEIN GELD“</PxBox> : null}
    </>
  );
};

// 1b · "Doch. War es. Er hat es dem Staat ein Jahr lang geliehen. Ohne Zinsen."
const SceneDoch: React.FC<{ t: number }> = ({ t }) => {
  const months = Math.round(k(t, A.geliehen - 0.3, 0.9) * 12);
  return (
    <>
      <Plate id="amt" />
      <Stamp t={t} a={A.doch - 0.05} text="DOCH." bg={RED} color="#FFF" size={56} rot={-5} style={{ left: 80, top: 150 }} />
      {t > A.war1 - 0.1 ? <PxBox bg="#FFF" size={24} style={{ left: 480, top: 180, ...popStyle(t, A.war1 - 0.1, 10, 0.5) }}>DEIN LOHN.</PxBox> : null}
      {t > A.geliehen - 0.35 ? (
        <div style={{ position: "absolute", left: 90, top: 380, width: 900, zIndex: 7, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, ...popStyle(t, A.geliehen - 0.35, 16, 0.5) }}>
          <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>AN DEN STAAT GELIEHEN</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 8, padding: "24px 20px 10px" }}>
            {Array.from({ length: 12 }, (_, i) => <div key={i} style={{ height: 54, border: `4px solid ${INK}`, background: i < months ? BLUE : "#F2F0EA" }} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: PX, fontSize: 15, color: "#8A857A", padding: "6px 20px 20px" }}><span>JAN</span><span>{months} MONATE</span><span>DEZ</span></div>
        </div>
      ) : null}
      {t > A.zinsen - 0.1 ? <Stamp t={t} a={A.zinsen - 0.1} text="ZINSEN: 0,00 €" bg={GOLD} size={32} rot={-4} style={{ left: 280, top: 680 }} /> : null}
    </>
  );
};

// 2 · The term: HOUSE-MONEY-EFFEKT typed on a casino table; won chips vs. earned money; "LOCKERER AUS"
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("HOUSE-MONEY", t, A.house - 0.1, A.house + 0.6);
  const throwU = k(t, A.lockerer - 0.1, 0.8, ease);
  return (
    <>
      <Plate id="casino" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 60, lineHeight: 1.1, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "30px 32px 18px", boxShadow: `0 8px 0 #0E2A1B`, textAlign: "center", ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"HOUSE-MONEY".slice(l1.length)}</span>
          <div style={{ fontSize: 30, color: "#FFF", marginTop: 14, opacity: k(t, A.house + 0.5, 0.2) }}>EFFEKT</div>
        </div>
      </div>
      {t > A.gewonnen0 - 0.2 ? (
        <div style={{ position: "absolute", left: 120, top: 420, zIndex: 7, ...popStyle(t, A.gewonnen0 - 0.2, 16, 0.5) }}>
          <PxBox bg="#FFF" size={20} style={{ position: "relative", display: "inline-block" }}>FÜHLT SICH GEWONNEN AN</PxBox>
          <div style={{ position: "relative", height: 300, width: 840 }}>
            {Array.from({ length: 7 }, (_, i) => {
              const dx = throwU * (120 + i * 70), dy = -throwU * Math.sin(i + 1) * 120 + throwU * throwU * 160;
              return <div key={i} style={{ position: "absolute", left: 40 + (i % 4) * 22 + dx, top: 150 - Math.floor(i / 4) * 30 - i * 6 + dy, transform: `rotate(${throwU * i * 40}deg)` }}><Sprite rows={CHIP.rows} pal={CHIP.pal} px={16} /></div>;
            })}
          </div>
        </div>
      ) : null}
      {t > A.lockerer - 0.1 ? <Stamp t={t} a={A.lockerer - 0.1} text="LOCKERER AUS" bg={RED} color="#FFF" size={30} rot={-4} style={{ left: 330, top: 780 }} /> : null}
    </>
  );
};

// 3 · The study: coin-flip bet. Without prior gain 4/10 play, after "you just won 15 $" almost 8/10
const Row: React.FC<{ t: number; a: number; n: number; label: string; col: string; y: number; s?: number }> = ({ t, a, n, label, col, y, s = a - 0.15 }) => (
  <div style={{ position: "absolute", left: 70, top: y, width: 940, zIndex: 7, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, ...popStyle(t, s, 16, 0.5) }}>
    <div style={{ display: "flex", justifyContent: "space-between", background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}><span>{label}</span><span style={{ color: col === GREEN ? "#8FE09B" : GOLD }}>{Math.min(n, Math.round(k(t, a, 0.8) * n))} VON 10 WETTEN</span></div>
    <div style={{ display: "flex", gap: 22, padding: "18px 24px" }}>
      {Array.from({ length: 10 }, (_, i) => {
        const on = i < Math.round(k(t, a, 0.8) * n);
        return <div key={i} style={{ padding: 6, background: on ? col : "#ECE8DF", border: `4px solid ${INK}`, transform: on ? `translateY(${-6 * bump(t, a + (i / n) * 0.8, 1, 0.12) + 6}px)` : undefined }}><Sprite rows={MINI.rows} pal={MINI.pal} px={7} /></div>;
      })}
    </div>
  </div>
);
const SceneStudy: React.FC<{ t: number }> = ({ t }) => {
  const flip = (t - A.muenzwurf) * 5;
  return (
    <>
      <Plate id="desk" />
      {t > A.muenzwurf - 0.2 ? (
        <div style={{ position: "absolute", left: 470, top: 120, zIndex: 6, transform: `scaleX(${Math.cos(flip)}) translateY(${-Math.abs(Math.sin(flip * 0.5)) * 30}px)`, ...popStyle(t, A.muenzwurf - 0.2, 12, 0.5) }}>
          <Sprite rows={BIGCOIN.rows} pal={BIGCOIN.pal} px={14} />
        </div>
      ) : null}
      {t > A.vier - 0.3 ? <Row t={t} a={A.vier} n={4} label="OHNE VORGESCHICHTE" col={BLUE} y={300} /> : null}
      {t > A.nachdem - 0.2 ? <Row t={t} a={A.acht - 0.15} s={A.nachdem - 0.2} n={8} label="NACH „+15 $ GEWONNEN“" col={GREEN} y={560} /> : null}
      {t > A.fuenfzehn - 0.1 ? <Stamp t={t} a={A.fuenfzehn - 0.1} text="+15 $" bg={GOLD} size={30} rot={6} style={{ left: 780, top: 500 }} /> : null}
      <PxBox bg={INK} color="#FFF" size={15} shadow={false} style={{ right: 40, top: 40, ...popStyle(t, A.forscher, 10, 0.5) }}>THALER & JOHNSON 1990</PxBox>
    </>
  );
};

// 4 · "Ich find das schön. Finanzamt gibt es zurück, der Sneakerladen nimmt es wieder ab. Alles bleibt im Kreislauf."
const NODES: [string, number, number, string][] = [["FINANZAMT", 360, 150, BLUE], ["KUMPEL", 680, 520, "#C0503A"], ["SNEAKERLADEN", 120, 520, RED]];
const SceneLoop: React.FC<{ t: number }> = ({ t }) => {
  const showN = [A.finanzamt1 - 0.2, A.finanzamt1 + 0.5, A.sneakerladen - 0.2];
  const run = t > A.kreislauf - 0.3;
  const u = run ? ((t - A.kreislauf + 0.3) * 0.9) % 1 : 0;
  // coin travels Finanzamt → Kumpel → Laden → Finanzamt
  const pts = [[480, 260], [760, 600], [260, 600]];
  const seg = Math.floor(u * 3), f = u * 3 - seg;
  const p0 = pts[seg], p1 = pts[(seg + 1) % 3];
  return (
    <>
      <Plate id="room" />
      <Person t={t} who="niklas" x={70} y={230} px={9} a={A.find - 0.1} />
      {t > A.schoen - 0.05 ? <PxBox bg={GOLD} size={24} style={{ left: 60, top: 130, ...popStyle(t, A.schoen - 0.05, 10, 0.5) }}>SCHÖN.</PxBox> : null}
      {NODES.map(([label, x, y, col], i) => (t > showN[i] ? (
        <PxBox key={i} bg={col} color="#FFF" size={22} style={{ left: x, top: y, ...popStyle(t, showN[i], 12, 0.5) }}>{label}</PxBox>
      ) : null))}
      {t > A.finanzamt1 + 0.3 ? <PxBox bg="#FFF" size={16} style={{ left: 620, top: 370, transform: "rotate(8deg)", ...popStyle(t, A.finanzamt1 + 0.3, 8, 0.5) }}>+900 € →</PxBox> : null}
      {t > A.sneakerladen ? <PxBox bg="#FFF" size={16} style={{ left: 360, top: 690, ...popStyle(t, A.sneakerladen, 8, 0.5) }}>← 595 €</PxBox> : null}
      {run ? <div style={{ position: "absolute", left: p0[0] + (p1[0] - p0[0]) * f, top: p0[1] + (p1[1] - p0[1]) * f, zIndex: 9 }}><Sprite rows={COIN.rows} pal={COIN.pal} px={16} /></div> : null}
      {run ? <Stamp t={t} a={A.kreislauf - 0.1} text="KREISLAUF ✓" bg={GREEN} color="#FFF" size={30} rot={-4} style={{ left: 330, top: 800 }} /> : null}
    </>
  );
};

// 5 · Outro: cover → ChatGPT interview ticks Pauschalen → comment STEUER → DM with PDF → "an Kumpel senden"
const PAGE = (n: number) => staticFile(`gpts-house-money/guide-${n === 1 ? "cover" : `p${n}`}.png`);
const CHECK: [keyof typeof A, string, string][] = [["homeoffice", "HOMEOFFICE", "6 €/TAG"], ["arbeitsweg", "ARBEITSWEG", "PRO KM"], ["handy", "HANDY", "BIS 20 €/M"], ["umzug", "UMZUG", "PAUSCHALE"]];
const SceneOutro: React.FC<{ t: number }> = ({ t }) => {
  const a = A.damit - 0.05;
  const bS = A.chatgpt, dS = A.schreib - 0.2, eS = A.schick1 - 0.15;
  const fl = Math.sin(t * 2.2) * 6, rot = Math.sin(t * 1.3) * 1.2;
  const cx = t < bS ? 320 : t < dS ? lerp(t, bS, bS + 0.4, 320, 40) : lerp(t, dS, dS + 0.4, 40, 60);
  const cw = t < bS ? 440 : t < dS ? lerp(t, bS, bS + 0.4, 440, 340) : lerp(t, dS, dS + 0.4, 340, 250);
  const cy = t < dS ? 90 : lerp(t, dS, dS + 0.4, 90, 70);
  const cr = t < bS ? interpolate(t, [a, a + 0.5], [-9, -4], clamp) : t < dS ? -5 : -7;
  const docIn = t > bS - 0.1 && t < dS + 0.4;
  const docX = t < dS ? lerp(t, bS - 0.1, bS + 0.3, 1100, 400) : lerp(t, dS, dS + 0.4, 400, 1150);
  const word = typed("STEUER", t, A.schreib + 0.05, A.steuer + 0.3);
  const sent = t > A.steuer + 0.4;
  const dmA = A.schick0 - 0.25;
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFF6D6", backgroundImage: "radial-gradient(rgba(20,20,20,.10) 2px, transparent 2.5px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: cx, top: cy + fl, width: cw, zIndex: 6, transform: `rotate(${cr + rot}deg) translateY(${interpolate(t, [a, a + 0.5], [60, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, opacity: k(t, a, 0.25), border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, lineHeight: 0 }}>
        <Img src={PAGE(1)} style={{ width: "100%" }} />
      </div>
      {t > A.damit && t < bS + 0.3 ? <PxBox bg={GOLD} size={22} style={{ left: 40, top: 720, transform: `rotate(-3deg) translateY(${fl * 0.5}px)`, ...popStyle(t, A.damit, 10, 0.5) }}>GEGENMITTEL #5</PxBox> : null}
      {docIn ? (
        <div style={{ position: "absolute", left: docX, top: 140 + fl * 0.4, width: 630, zIndex: 8, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>VERGESSENE PAUSCHALEN</div>
          <div style={{ padding: "16px 20px 14px" }}>
            {CHECK.map(([w, kk, v], i) => {
              const s0 = A[w] - 0.15;
              if (t < s0) return <div key={i} style={{ height: 66 }} />;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 66, borderBottom: "3px dashed #C9C2B0", fontFamily: PX, ...popStyle(t, s0, 8, 0.4) }}>
                  <span style={{ width: 36, height: 36, background: GREEN, border: `4px solid ${INK}`, color: "#FFF", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                  <span style={{ fontSize: 18, color: INK }}>{kk}</span><span style={{ marginLeft: "auto", fontSize: 14, color: "#8A857A" }}>{v}</span>
                </div>
              );
            })}
            {t < A.umzug + 0.3 && blink ? <div style={{ width: 16, height: 26, background: INK, marginTop: 8 }} /> : null}
          </div>
          {t > A.pauschale - 0.2 ? <PxBox bg="#FFF" size={15} style={{ left: -20, top: -46, ...popStyle(t, A.pauschale - 0.2, 8, 0.5) }}>CHATGPT FRAGT DICH AB</PxBox> : null}
          <div style={{ position: "absolute", right: -24, bottom: -56, background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}`, ...popStyle(t, A.chatgpt, 14, 0.4) }}><Sprite rows={ROBOT.rows} pal={ROBOT.pal} px={7} /></div>
        </div>
      ) : null}
      {t > dS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: 150 + fl * 0.3, zIndex: 9, ...popStyle(t, dS, 20, 0.6) }}>
          <div style={{ fontFamily: PX, fontSize: 18, color: INK, marginBottom: 16 }}>KOMMENTARE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 18px" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}`, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily: PX, fontSize: 28, color: INK }}>{sent ? "" : word}{!sent && blink ? "▌" : ""}{sent ? <span style={{ color: "#B0AA9E", fontSize: 18 }}>KOMMENTAR …</span> : null}</div>
            <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: word.length === 6 ? BLUE : "#9AA3AD", padding: "12px 12px 8px", transform: `scale(${1 - 0.15 * Math.max(0, 1 - Math.abs(t - A.steuer - 0.35) / 0.1)})` }}>POSTEN</div>
          </div>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, ...popStyle(t, A.steuer + 0.4, 12, 0.6) }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}` }} />
              <div style={{ fontFamily: PX, fontSize: 24, color: INK, background: "#FFF", border: `5px solid ${INK}`, padding: "14px 16px 8px" }}>STEUER</div>
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
              <div style={{ fontSize: 18, color: INK }}>STEUER-GUIDE.PDF</div>
              <div style={{ fontSize: 13, color: "#8A857A", marginTop: 6 }}>PAUSCHALEN + PLAN</div>
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
          <div style={{ fontFamily: SM, fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", color: "#FFF", background: INK, borderRadius: 999, padding: "12px 32px", transform: `scale(${1 + 0.03 * Math.sin(t * 6)})` }}>SCHREIB <span style={{ color: GOLD }}>„STEUER“</span></div>
        </div>
      ) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.doch - 0.1, El: SceneHook, pill: "Dein Kumpel", bg: PLATE_BG.street },
  { from: A.doch - 0.1, to: A.heisst - 0.05, El: SceneDoch, pill: "Steuererstattung", bg: PLATE_BG.amt },
  { from: A.heisst - 0.05, to: A.forscher - 0.1, El: SceneTerm, pill: "Verhaltensökonomie", bg: PLATE_BG.casino },
  { from: A.forscher - 0.1, to: A.find - 0.1, El: SceneStudy, pill: "Die Studie", bg: PLATE_BG.desk },
  { from: A.find - 0.1, to: A.sagt - 0.3, El: SceneLoop, pill: "Meine Meinung", bg: PLATE_BG.room },
  { from: A.sagt - 0.3, to: A.damit - 0.1 },
  { from: A.damit - 0.1, to: 999, El: SceneOutro, pill: "Gegenmittel #5", bg: "#FFF6D6" },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["kumpel", "steuererstattung", "geschenktes", "neunhundert", "finanzamt", "bar", "taxi", "sneaker", "doch", "geliehen", "zinsen", "housemoneyeffekt", "gewonnen", "lockerer", "münzwurf", "vier", "fünfzehn", "acht", "schön", "kreislauf", "ausgesucht", "chatgpt", "pauschale", "homeoffice", "arbeitsweg", "handy", "umzug", "steuer", "video"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const SHOW: Record<string, string> = { neunhundert: "900 €", fünfzehn: "15", vier: "4", acht: "8" };
const show = (w: string) => { const n = norm(w); return SHOW[n] ?? w.replace(/[.,!?:„“"]/g, ""); };
type Chunk = { start: number; end: number; words: string[] };
const makeChunks = (caps: Cap[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Cap[] = [];
  const flush = () => { if (cur.length) out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => show(c.text)) }); cur = []; };
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

export const HouseMoneyPixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-house-money-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
