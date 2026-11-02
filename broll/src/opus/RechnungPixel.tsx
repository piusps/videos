import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-rechnung-teilen/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Rechnung teilen" (Diner's Dilemma, Gneezy/Haruvy/Yafe 2004, 2026-11-02) im Pixel-Niklas-Look wie HeadOfPixel.
// Figur "dein Kumpel": 8 Leute beim Italiener, "wir teilen durch acht", Steak + 3 Aperol + Tiramisu vs. Margherita; 39 €.
// Pointe "Nächstes Mal bestellt er wieder Steak. Du auch." ruhig auf dem Gesicht, dann Gegenmittel #11, Wort RECHNUNG.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9", TEAL = "#2FD3B0";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const RECHNUNG_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  acht0: at("acht", 0), italiener: at("italiener"), wir: at("wir"), entspannter: at("entspannter"), durch0: at("durch", 0),
  dann: at("dann"), steak0: at("steak", 0), aperol: at("aperol"), tiramisu: at("tiramisu"), hattest: at("hattest"), margherita0: at("margherita", 0), leitungswasser: at("leitungswasser"),
  ende: at("ende"), neununddreissig: at("neununddreißig"), euro: at("euro"), margherita1: at("margherita", 1),
  heisst: at("heißt"), diners: at("diners"), dilemma: at("dilemma"), extra: at("extra"), achtel: at("achtel"), bestellt1: at("bestellt", 1),
  forscher: at("forscher"), israel: at("israel"), restaurant: at("restaurant"), geteilt: at("geteilt"), drittel: at("drittel"),
  finde: at("finde"), vorschlag: at("vorschlag"), bestellung: at("bestellung"), kosten: at("kosten"), naechstes: at("nächstes"),
  damit: at("damit"), chatgpt: at("chatgpt"), bon: at("bon"), zahlt: at("zahlt"), gruppe: at("gruppe"),
  schreib: at("schreib"), rechnung: at("rechnung"), schick: at("schick"), video: at("video"),
};

// ---------- pixel plates ----------
type Op = [number, number, number, number, string];
const painter = () => {
  const ops: Op[] = [];
  const R = (x: number, y: number, w: number, h: number, c: string) => { ops.push([x, y, w, h, c]); };
  const P = (x: number, y: number, c: string) => R(x, y, 1, 1, c);
  return { ops, R, P };
};
// office at night: dark wall, window with moon, one desk lamp glow
const drawNight = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#1E2433"); for (let y = 4; y < 118; y += 9) for (let x = (y % 2) * 6; x < 180; x += 13) P(x, y, "#252C3E");
  R(110, 14, 56, 40, "#0E1220"); R(112, 16, 52, 36, "#2A3550"); R(150, 20, 8, 8, "#FFF3C4"); R(152, 20, 6, 6, "#2A3550");
  for (let i = 0; i < 8; i++) P(116 + (i * 13) % 44, 22 + (i * 7) % 26, "#FFFFFF");
  R(0, 118, 180, 42, "#2E3650"); R(0, 118, 180, 1, "#141A28");
  return p.ops;
};
// Trattoria: terracotta wall, framed picture, checkered table edge
const drawResto = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#E8B48A"); for (let y = 4; y < 118; y += 9) for (let x = (y % 2) * 6; x < 180; x += 13) P(x, y, "#DDA27A");
  R(120, 12, 44, 30, "#5B3B26"); R(122, 14, 40, 26, "#7FB3D5"); R(122, 30, 40, 10, "#4C9A5A");
  R(0, 118, 180, 42, "#B03A2E"); for (let y = 118; y < 160; y += 6) for (let x = ((y - 118) / 6 % 2) * 6; x < 180; x += 12) R(x, y, 6, 6, "#F5F5F5");
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
// Berlin: dusk sky, TV tower, Altbau row
const drawCity = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 110, "#F4C9A0"); R(0, 0, 180, 40, "#E8A98A");
  R(118, 10, 2, 60, "#6A6A70"); R(114, 30, 10, 8, "#8A8A92"); R(117, 4, 4, 6, "#6A6A70");
  const cols = ["#C9B48A", "#D8B9A0", "#B9C4B0", "#E0CFA8", "#C4A8A0", "#D2C2A2"];
  for (let i = 0; i < 6; i++) { const x = i * 30, h = 44 + (i % 3) * 10; R(x, 110 - h, 30, h, cols[i]); R(x, 110 - h, 30, 2, "#FFFFFF"); for (let wx = x + 4; wx < x + 28; wx += 8) for (let wy = 118 - h; wy < 104; wy += 11) R(wx, wy, 4, 6, "#7FA9C9"); }
  R(0, 110, 180, 50, "#6A6A70"); for (let x = 0; x < 180; x += 24) R(x, 134, 12, 2, "#F2F0EA");
  for (let i = 0; i < 20; i++) P((i * 47) % 180, 114 + (i * 13) % 44, "#7A7A80");
  return p.ops;
};
const PLATES = { night: drawNight(), resto: drawResto(), office: drawOffice(), gym: drawGym(), desk: drawDesk(), city: drawCity() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { night: "#1E2433", resto: "#E8B48A", office: "#D7DCE2", gym: "#3B2A5C", desk: "#5B3B26", city: "#F4C9A0" };

// ---------- people ----------
const NK = [
  "....hhhhhh....", "...hHHLLHHh...", "..hHHHHLLHHh..", "..HHhSSSSHHH..", "..HSSSSSSSSH..", "..SSESSSSESS..", "..sSSSSSSSSs..", "..SSSSssSSSS..",
  "..sSbbbbbbSs..", "...sbbSSbbs...", "....sSSSSs....", "..nNNWWWWNNn..", ".nNNNNWZWNNNn.", ".NNNNNNZNNNNN.", ".NNnNNNZNNNnNN", ".NN.NNNZNNN.NN",
  ".NN.NNNZNNN.NF", ".SS.NNNNNNN.Ff", "....NNNNNNN.Ff", "....PPPPPPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "...BBBB.BBBB..",
];
// Freundin: long hair falls over the shoulders
const FR = [
  "....hhhhhh....", "...hHHHHHHh...", "..hHHHHHHHHh..", "..HHSSSSSSHH..", ".HHSSSSSSSSHH.", ".HHSESSSSESHH.", ".HHSSSSSSSSHH.", ".HHSSSssSSSHH.",
  ".HHSSRRRRSSHH.", ".HHHSSSSSSHHH.", ".HHH.sSSs.HHH.", ".HHnNNNNNNnHH.", ".nNNNNNNNNNNn.", ".NNNNNNNNNNNN.", ".NNnNNNNNNnNN.", ".NN.NNNNNN.NN.",
  ".NN.NNNNNN.NN.", ".SS.NNNNNN.SS.", "....NNNNNN....", "....PPPPPP....", "....PPP.PP....", "....PPP.PP....", "....PPP.PP....", "....PPP.PP....", "...BBBB.BBB...",
];
const SK = { S: "#F2C6A4", s: "#D9A27F" };
const PAL = {
  niklas: { h: "#8A5A30", H: "#B07A45", L: "#C99A63", ...SK, E: "#2B2B2B", b: "#B58A62", N: "#1E2433", n: "#2E3650", W: "#F5F5F5", Z: "#C9C9C9", P: "#3A3F4A", B: "#151515", F: "#111111", f: "#7FD3FF" },
  kumpel: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: "#C0503A", n: "#9E3F2D", W: "#F5F5F5", Z: "#9E3F2D", P: "#2E3650", B: "#F5F5F5", F: "#111111", f: TEAL },
  freund: { h: "#5A3A22", H: "#7A5230", L: "#9A6A40", ...SK, E: "#2B2B2B", b: "#9A6A48", N: BLUE, n: "#2E5FA0", W: "#F5F5F5", Z: "#1E2433", P: "#2E3650", B: "#151515", F: "#111111", f: GOLD },
  freundin: { h: "#B5763A", H: "#D69A55", L: "#E8B87A", ...SK, E: "#2B2B2B", R: "#C0503A", N: TEAL, n: "#22A890", P: "#2E3650", B: "#F5F5F5" },
};
type Who = keyof typeof PAL;
const Person: React.FC<{ t: number; who: Who; x: number; y: number; px?: number; flip?: boolean; seed?: number; a?: number; bob?: number; speed?: number; style?: React.CSSProperties }> = ({ t, who, x, y, px = 12, flip, seed = 0, a = -1, bob = 1, speed = 3.2, style }) => {
  const st = a >= 0 ? popStyle(t, a, 30, 0.4) : {};
  const hop = Math.floor(t * speed + seed) % 2 ? -px * bob : 0;
  const rows = who === "freundin" ? FR : NK;
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 4, ...st, ...style }}>
      <div style={{ position: "absolute", left: px * 3, top: rows.length * px - px * 0.6, width: px * 9, height: px * 1.2, background: "rgba(0,0,0,0.28)" }} />
      <div style={{ transform: `translateY(${hop}px) scaleX(${flip ? -1 : 1})` }}><Sprite rows={rows} pal={PAL[who]} px={px} /></div>
    </div>
  );
};

// ---------- props ----------
const ROBOT = { rows: ["....KK....", "....RR....", ".KKKKKKKK.", "KWWWWWWWWK", "KWBBWWBBWK", "KWBBWWBBWK", "KWWWWWWWWK", "KWWRRRRWWK", "KWWWWWWWWK", ".KKKKKKKK."], pal: { K: INK, W: "#F5F5F5", B: GREEN, R: RED } };
const PLANE = { rows: ["K.........", "KKK.......", "KWWKK.....", "KWWWWKK...", "KWWWWWWKK.", "KWWWWKK...", "KWWKK.....", "KKK.......", "K........."], pal: { K: INK, W: "#FFF" } };
const LOCK = { rows: ["...KKKKKK...", "..KSSSSSSK..", ".KSK....KSK.", ".KSK....KSK.", ".KSK....KSK.", "KKKKKKKKKKKK", "KYYYYYYYYYYK", "KYYYYKKYYYYK", "KYYYYKKYYYYK", "KYYYYYKYYYYK", "KYYYYYYYYYYK", "KKKKKKKKKKKK"], pal: { K: INK, S: "#B8B8C0", Y: GOLD } };
const KEYS = { rows: ["..KKK.......", ".KYYYK......", "KYY.YYKKKKKK", "KYY.YYYYYYYK", ".KYYYK.K.K.K", "..KKK.......".replace(/\./g, ".")], pal: { K: INK, Y: GOLD } };


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

// ---------- scenes ----------
// 1 · Acht Leute beim Italiener, Kumpel: "Wir teilen einfach durch acht"
const SceneHook: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="resto" />
    {t > A.acht0 - 0.15 ? <PxBox bg={INK} color="#FFF" size={24} style={{ left: 330, top: 110, ...popStyle(t, A.acht0 - 0.15, 12, 0.5) }}>8 LEUTE · ITALIENER</PxBox> : null}
    <Person t={t} who="kumpel" x={120} y={470} px={13} a={0.05} />
    {t > A.wir - 0.1 ? <PxBox bg="#FFF" size={26} style={{ left: 420, top: 260, lineHeight: 1.7, transform: "rotate(2deg)", ...popStyle(t, A.wir - 0.1, 12, 0.5) }}>„WIR TEILEN EINFACH<br />DURCH 8.“{t > A.entspannter - 0.2 ? <><br /><span style={{ fontSize: 18, color: "#8A857A" }}>IST ENTSPANNTER.</span></> : null}</PxBox> : null}
    {t > A.durch0 - 0.1 ? <Stamp t={t} a={A.durch0 - 0.1} text="÷ 8" bg={GOLD} size={54} rot={-8} style={{ left: 640, top: 560 }} /> : null}
  </>
);

// 2 · Er: Steak, 3 Aperol, Tiramisu. Du: Margherita, Leitungswasser
const SceneOrder: React.FC<{ t: number }> = ({ t }) => {
  const Col: React.FC<{ x: number; head: string; col: string; items: [string, number, string][]; rot: number }> = ({ x, head, col, items, rot }) => (
    <div style={{ position: "absolute", left: x, top: 150, width: 440, zIndex: 6, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, transform: `rotate(${rot}deg)` }}>
      <div style={{ background: col, padding: "14px 16px 10px", fontFamily: PX, fontSize: 20, color: "#FFF" }}>{head}</div>
      <div style={{ padding: "16px 18px", fontFamily: PX, fontSize: 20, lineHeight: 2.2, minHeight: 320 }}>
        {items.map(([s, a, p], i) => (t > a - 0.15 ? <div key={i} style={{ display: "flex", ...popStyle(t, a - 0.15, 8, 0.4) }}><span>{s}</span><span style={{ marginLeft: "auto", color: "#8A857A" }}>{p}</span></div> : null))}
      </div>
    </div>
  );
  return (
    <>
      <Plate id="resto" />
      <Col x={50} head="KUMPEL" col={RED} rot={-2} items={[["STEAK", A.steak0, "34 €"], ["3× APEROL", A.aperol, "27 €"], ["TIRAMISU", A.tiramisu, "9 €"]]} />
      {t > A.hattest - 0.2 ? <Col x={560} head="DU" col={GREEN} rot={2} items={[["MARGHERITA", A.margherita0, "10 €"], ["WASSER", A.leitungswasser, "0 €"]]} /> : null}
    </>
  );
};

// 3 · Am Ende: 39 € für eine Margherita
const SceneBill: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="desk" />
    <div style={{ position: "absolute", left: 300, top: 70, width: 480, zIndex: 6, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, padding: "22px 26px", fontFamily: PX, fontSize: 20, lineHeight: 2.2, color: INK, transform: "rotate(-1.5deg)", ...popStyle(t, A.ende - 0.2, 16, 0.5) }}>
      <div style={{ textAlign: "center", fontSize: 18 }}>TRATTORIA · TISCH 8</div>
      <div style={{ borderTop: `4px dashed ${INK}`, margin: "8px 0" }} />
      <div style={{ display: "flex" }}><span>SUMME</span><span style={{ marginLeft: "auto" }}>312 €</span></div>
      <div style={{ display: "flex" }}><span>÷ 8 PERSONEN</span><span style={{ marginLeft: "auto" }}>8</span></div>
      <div style={{ borderTop: `4px solid ${INK}`, margin: "8px 0" }} />
      <div style={{ display: "flex", fontSize: 28 }}><span>DU ZAHLST</span><span style={{ marginLeft: "auto", background: t > A.neununddreissig - 0.1 ? RED : "transparent", color: t > A.neununddreissig - 0.1 ? "#FFF" : INK, padding: "4px 8px 0", transform: `scale(${bump(t, A.euro, 0.15)})` }}>39 €</span></div>
    </div>
    {t > A.margherita1 - 0.15 ? <Stamp t={t} a={A.margherita1 - 0.15} text="FÜR 1 MARGHERITA" bg={GOLD} size={28} rot={-5} style={{ left: 140, top: 620 }} /> : null}
  </>
);

// 4 · Begriff: DINER'S DILEMMA — jedes Extra kostet dich nur 1/8
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("DINER'S", t, A.heisst, A.diners + 0.3);
  const l2 = typed("DILEMMA", t, A.diners + 0.3, A.dilemma + 0.4);
  return (
    <>
      <Plate id="gym" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 56, lineHeight: 1.25, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "28px 30px 16px", textAlign: "center", ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"DINER'S".slice(l1.length)}</span><br />
          {l2}<span style={{ opacity: 0 }}>{"DILEMMA".slice(l2.length)}</span>
        </div>
      </div>
      {t > A.extra - 0.2 ? (
        <div style={{ position: "absolute", left: 120, top: 440, width: 840, zIndex: 8, display: "flex", gap: 24, alignItems: "center", ...popStyle(t, A.extra - 0.2, 14, 0.5) }}>
          <PxBox bg="#FFF" size={26} style={{ position: "relative" }}>APEROL 9 €</PxBox>
          <div style={{ fontFamily: PX, fontSize: 40, color: "#FFF" }}>→</div>
          {t > A.achtel - 0.2 ? <PxBox bg={GREEN} color="#FFF" size={26} style={{ position: "relative", transform: `scale(${bump(t, A.achtel, 0.15)})`, ...popStyle(t, A.achtel - 0.2, 10, 0.4) }}>DICH: 1,13 €</PxBox> : null}
        </div>
      ) : null}
      {t > A.bestellt1 - 0.2 ? <Stamp t={t} a={A.bestellt1 - 0.2} text="ALSO: JEDER BESTELLT MEHR" bg={RED} color="#FFF" size={24} rot={-3} style={{ left: 130, top: 640 }} /> : null}
    </>
  );
};

// 5 · Studie Israel: geteilt = gut ein Drittel mehr
const SceneStudy: React.FC<{ t: number }> = ({ t }) => {
  const uA = k(t, A.restaurant - 0.1, 0.5, ease), uB = k(t, A.geteilt - 0.1, 0.8, ease);
  const Col: React.FC<{ x: number; u: number; v: number; lab: string; col: string; show: string }> = ({ x, u, v, lab, col, show }) => (
    <div style={{ position: "absolute", left: x, bottom: 120, width: 260, zIndex: 6 }}>
      <div style={{ fontFamily: PX, fontSize: 22, color: INK, textAlign: "center", marginBottom: 12, opacity: u }}>{show}</div>
      <div style={{ height: 340 * v * u, background: col, border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}` }} />
      <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: INK, padding: "12px 8px 8px", textAlign: "center", marginTop: 12 }}>{lab}</div>
    </div>
  );
  return (
    <>
      <Plate id="city" />
      <PxBox bg={INK} color="#FFF" size={16} shadow={false} style={{ right: 40, top: 50, ...popStyle(t, A.forscher, 10, 0.5) }}>FELDEXPERIMENT · ISRAEL</PxBox>
      <Col x={180} u={uA} v={0.62} lab="JEDER ZAHLT SEINS" col={BLUE} show="100 %" />
      {t > A.geteilt - 0.15 ? <Col x={620} u={uB} v={0.85} lab="GETEILT" col={RED} show="136 %" /> : null}
      {t > A.drittel - 0.15 ? <Stamp t={t} a={A.drittel - 0.15} text="+ GUT 1/3" bg={GOLD} size={44} rot={-6} style={{ left: 330, top: 140 }} /> : null}
    </>
  );
};

// 6 · "Durch acht teilen ist kein Vorschlag. Es ist eine Bestellung auf deine Kosten."
const SceneVerdict: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="resto" />
    <Person t={t} who="kumpel" x={620} y={470} px={13} flip speed={1.6} />
    <PxBox bg="#FFF" size={28} style={{ left: 70, top: 130, transform: "rotate(-2deg)", ...popStyle(t, A.finde - 0.05, 12, 0.5) }}>
      <span style={{ position: "relative" }}>÷ 8 = VORSCHLAG{t > A.vorschlag ? <span style={{ position: "absolute", left: -8, right: -8, top: "45%", height: 8, background: RED }} /> : null}</span>
    </PxBox>
    {t > A.bestellung - 0.2 ? <Stamp t={t} a={A.bestellung - 0.2} text={t > A.kosten - 0.15 ? "BESTELLUNG AUF DEINE KOSTEN" : "BESTELLUNG"} bg={GOLD} size={22} rot={-4} style={{ left: 60, top: 330 }} /> : null}
  </>
);

// ---------- shared outro: cover → ChatGPT check rows → comment WORD → DM with PDF → "an Kumpel senden" ----------
type Row = { a: number; k: string; v: string; col?: string };
const Outro: React.FC<{ t: number; start: number; chat: number; head: string; tag: string; rows: Row[]; total?: { a: number; k: string; v: string }; word: string; wordA: number; schreib: number; dmA: number; eS: number; pdf: string; pdfSub: string; nr: number; run: string; sendTo: string }> = (p) => {
  const { t } = p;
  const PAGE = staticFile(`${p.run}/guide-cover.png`);
  const a = p.start - 0.05;
  const bS = p.chat, dS = p.schreib - 0.2, eS = p.eS;
  const fl = Math.sin(t * 2.2) * 6, rot = Math.sin(t * 1.3) * 1.2;
  const cx = t < bS ? 320 : t < dS ? lerp(t, bS, bS + 0.4, 320, 40) : lerp(t, dS, dS + 0.4, 40, 60);
  const cw = t < bS ? 440 : t < dS ? lerp(t, bS, bS + 0.4, 440, 340) : lerp(t, dS, dS + 0.4, 340, 250);
  const cy = t < dS ? 90 : lerp(t, dS, dS + 0.4, 90, 70);
  const cr = t < bS ? interpolate(t, [a, a + 0.5], [-9, -4], clamp) : t < dS ? -5 : -7;
  const docIn = t > bS - 0.1 && t < dS + 0.4;
  const docX = t < dS ? lerp(t, bS - 0.1, bS + 0.3, 1100, 400) : lerp(t, dS, dS + 0.4, 400, 1150);
  const word = typed(p.word, t, p.schreib + 0.05, p.wordA + 0.3);
  const sent = t > p.wordA + 0.4;
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFF6D6", backgroundImage: "radial-gradient(rgba(20,20,20,.10) 2px, transparent 2.5px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: cx, top: cy + fl, width: cw, zIndex: 6, transform: `rotate(${cr + rot}deg) translateY(${interpolate(t, [a, a + 0.5], [60, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, opacity: k(t, a, 0.25), border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, lineHeight: 0 }}>
        <Img src={PAGE} style={{ width: "100%" }} />
      </div>
      {t > p.start && t < bS + 0.3 ? <PxBox bg={GOLD} size={22} style={{ left: 40, top: 720, transform: `rotate(-3deg) translateY(${fl * 0.5}px)`, ...popStyle(t, p.start, 10, 0.5) }}>GEGENMITTEL #{p.nr}</PxBox> : null}
      {docIn ? (
        <div style={{ position: "absolute", left: docX, top: 140 + fl * 0.4, width: 630, zIndex: 8, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>{p.head}</div>
          <div style={{ padding: "12px 20px 14px" }}>
            {p.rows.map((r, i) => {
              const s0 = r.a - 0.15;
              if (t < s0) return <div key={i} style={{ height: 60 }} />;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 60, borderBottom: "3px dashed #C9C2B0", fontFamily: PX, ...popStyle(t, s0, 8, 0.4) }}>
                  <span style={{ width: 34, height: 34, background: GREEN, border: `4px solid ${INK}`, color: "#FFF", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</span>
                  <span style={{ fontSize: 17, color: INK }}>{r.k}</span><span style={{ marginLeft: "auto", fontSize: 16, color: r.col ?? INK }}>{r.v}</span>
                </div>
              );
            })}
            {p.total && t > p.total.a ? (
              <div style={{ display: "flex", alignItems: "center", height: 70, fontFamily: PX, fontSize: 20, ...popStyle(t, p.total.a, 10, 0.5) }}>
                <span>{p.total.k}</span><span style={{ marginLeft: "auto", background: RED, color: "#FFF", padding: "10px 12px 6px", border: `4px solid ${INK}` }}>{p.total.v}</span>
              </div>
            ) : blink ? <div style={{ width: 16, height: 26, background: INK, marginTop: 8 }} /> : null}
          </div>
          {t > bS + 0.2 ? <PxBox bg="#FFF" size={15} style={{ left: -20, top: -46, ...popStyle(t, bS + 0.2, 8, 0.5) }}>{p.tag}</PxBox> : null}
          <div style={{ position: "absolute", right: -24, bottom: -56, background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}`, ...popStyle(t, bS, 14, 0.4) }}><Sprite rows={ROBOT.rows} pal={ROBOT.pal} px={7} /></div>
        </div>
      ) : null}
      {t > dS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: 150 + fl * 0.3, zIndex: 9, ...popStyle(t, dS, 20, 0.6) }}>
          <div style={{ fontFamily: PX, fontSize: 18, color: INK, marginBottom: 16 }}>KOMMENTARE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 18px" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}`, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily: PX, fontSize: 28, color: INK }}>{sent ? "" : word}{!sent && blink ? "▌" : ""}{sent ? <span style={{ color: "#B0AA9E", fontSize: 18 }}>KOMMENTAR …</span> : null}</div>
            <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: word.length === p.word.length ? BLUE : "#9AA3AD", padding: "12px 12px 8px", transform: `scale(${1 - 0.15 * Math.max(0, 1 - Math.abs(t - p.wordA - 0.35) / 0.1)})` }}>POSTEN</div>
          </div>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, ...popStyle(t, p.wordA + 0.4, 12, 0.6) }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}` }} />
              <div style={{ fontFamily: PX, fontSize: 24, color: INK, background: "#FFF", border: `5px solid ${INK}`, padding: "14px 16px 8px" }}>{p.word}</div>
              <div style={{ fontFamily: PX, fontSize: 14, color: GREEN }}>✓ GEPOSTET</div>
            </div>
          ) : null}
        </div>
      ) : null}
      {t > p.dmA ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, p.dmA, p.dmA + 0.35, 980, 450) + fl * 0.5, zIndex: 10, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: INK, padding: "12px 16px" }}>
            <i style={{ width: 14, height: 14, borderRadius: "50%", background: GOLD, display: "block" }} />
            <span style={{ fontFamily: SM, fontWeight: 700, fontSize: 24, color: "#FFF" }}>Florent GPT</span>
            <span style={{ marginLeft: "auto", fontFamily: PX, fontSize: 12, color: GOLD }}>NEUE NACHRICHT</span>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", padding: 18 }}>
            <div style={{ width: 92, border: `4px solid ${INK}`, lineHeight: 0, flexShrink: 0, transform: `rotate(${Math.sin(t * 3) * 3}deg)` }}><Img src={PAGE} style={{ width: "100%" }} /></div>
            <div style={{ fontFamily: PX, lineHeight: 1.5 }}>
              <div style={{ fontSize: 18, color: INK }}>{p.pdf}</div>
              <div style={{ fontSize: 13, color: "#8A857A", marginTop: 6 }}>{p.pdfSub}</div>
              <div style={{ display: "inline-block", fontSize: 14, color: INK, background: GOLD, border: `4px solid ${INK}`, padding: "8px 10px 4px", marginTop: 10, transform: `scale(${1 + 0.06 * Math.abs(Math.sin(t * 5))})` }}>ÖFFNEN</div>
            </div>
          </div>
          {spark(t, p.dmA + 0.35, 350, 120, 10, 40, 170)}
        </div>
      ) : null}
      {t > eS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, eS, eS + 0.3, 980, 690) + fl * 0.4, zIndex: 12, display: "flex", alignItems: "center", gap: 18, background: BLUE, border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 20px" }}>
          <div style={{ transform: `translateX(${Math.sin(t * 4) * 6}px)` }}><Sprite rows={PLANE.rows} pal={PLANE.pal} px={6} /></div>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#C0503A", border: `4px solid ${INK}`, flexShrink: 0 }} />
          <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF" }}>{p.sendTo}</div>
          {spark(t, eS + 0.3, 520, 40, 8, 30, 120)}
        </div>
      ) : null}
      {t > p.schreib - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", zIndex: 11, ...popStyle(t, p.schreib - 0.1, 10, 0.7) }}>
          <div style={{ fontFamily: SM, fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", color: "#FFF", background: INK, borderRadius: 999, padding: "12px 32px", transform: `scale(${1 + 0.03 * Math.sin(t * 6)})` }}>SCHREIB <span style={{ color: GOLD }}>„{p.word}“</span></div>
        </div>
      ) : null}
    </>
  );
};



const CHAT_ROWS = [{ a: A.bon, k: "FOTO VOM BON", v: "✓" }, { a: A.zahlt, k: "WER ZAHLT WAS", v: "TABELLE" }, { a: A.gruppe, k: "NACHRICHT AN DIE GRUPPE", v: "FERTIG", col: GREEN }];
const SceneOutro: React.FC<{ t: number }> = ({ t }) => (
  <Outro t={t} start={A.damit} chat={A.chatgpt} head="WER ZAHLT WAS?" tag="CHATGPT RECHNET" rows={CHAT_ROWS} word="RECHNUNG" wordA={A.rechnung} schreib={A.schreib} dmA={A.schick - 0.1} eS={A.video} pdf="RECHNUNG-GUIDE.PDF" pdfSub="BON + GRUPPE" nr={11} run="gpts-rechnung-teilen" sendTo="AN KUMPEL SENDEN" />
);

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.dann - 0.15, El: SceneHook, pill: "Dein Kumpel", bg: PLATE_BG.resto },
  { from: A.dann - 0.15, to: A.ende - 0.3, El: SceneOrder, pill: "Die Bestellung", bg: PLATE_BG.resto },
  { from: A.ende - 0.3, to: A.heisst - 0.1, El: SceneBill, pill: "Die Rechnung", bg: PLATE_BG.desk },
  { from: A.heisst - 0.1, to: A.forscher - 0.15, El: SceneTerm, pill: "Ökonomie", bg: PLATE_BG.gym },
  { from: A.forscher - 0.15, to: A.finde - 0.15, El: SceneStudy, pill: "Die Studie", bg: PLATE_BG.city },
  { from: A.finde - 0.15, to: A.naechstes - 0.3, El: SceneVerdict, pill: "Ich finde", bg: PLATE_BG.resto },
  { from: A.naechstes - 0.3, to: A.damit - 0.1 },
  { from: A.damit - 0.1, to: 999, El: SceneOutro, pill: "Gegenmittel #11", bg: "#FFF6D6" },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["acht", "italiener", "kumpel", "teilen", "steak", "aperol", "tiramisu", "margherita", "leitungswasser", "neununddreißig", "39", "diners", "dilemma", "achtel", "mehr", "israel", "drittel", "vorschlag", "kosten", "chatgpt", "bon", "gruppe", "rechnung", "video"]);

const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const SHOW: Record<string, string> = { neununddreißig: "39", acht: "8" };
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
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.446;

export const RechnungPixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-rechnung-teilen-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
