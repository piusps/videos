import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-anker-rabatt/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Ankereffekt Rabatt" (Tversky & Kahneman 1974, 2026-10-31) im Pixel-Niklas-Look wie LockInPixel.
// Figur "dein Kollege": 220 € "gespart", 300 € ausgegeben, Lampe -50 % die er nicht wollte, Glücksrad-Versuch, Gründer streicht jeden Preis durch.
// Black-Friday-Liste, Pointe "Die Lampe steht wieder drauf. In Grau." ruhig auf dem Gesicht, dann Gegenmittel #8, Wort RABATT.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9", TEAL = "#2FD3B0";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const ANKER_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  kollege: at("kollege"), montag: at("montag"), zweihundert: at("zweihundertzwanzig"), gespart: at("gespart"), dreihundert: at("dreihundert"), ausgegeben: at("ausgegeben"),
  jacke: at("jacke"), sneaker: at("sneaker"), lampe0: at("lampe", 0), ueberall: at("überall"), durchgestrichen: at("durchgestrichen"), differenz: at("differenz"), gewinn: at("gewinn"), aufgeschrieben: at("aufgeschrieben"),
  lampe1: at("lampe", 1), nicht: at("nicht"), fuenfzig: at("fünfzig"), runter: at("runter"), dumm: at("dumm"),
  heisst: at("heißt"), anker: at("ankereffekt"), erste: at("erste"), zahl: at("zahl"), massstab: at("maßstab"), erfunden: at("erfunden"),
  versuch: at("versuch"), gluecksrad: at("glücksrad"), gereicht: at("gereicht"),
  wenn1: at("wenn", 1), laden: at("laden"), streiche: at("streiche"), jeden: at("jeden", 0), durch: at("durch"), durchgestrichenen: at("durchgestrichenen"), auch1: at("auch", 1),
  sagt1: at("sagt", 1), black: at("black"), sparen: at("sparen"), liste: at("liste"), lampe2: at("lampe", 2), grau: at("grau"),
  damit: at("damit"), chatgpt: at("chatgpt"), fragt: at("fragt"), kauf: at("kauf"), drei: at("drei"), sachen: at("sachen"), zuruecklegt: at("zurücklegt"),
  schreib: at("schreib"), rabatt: at("rabatt"), schick: at("schick"), video: at("video"),
};

// ---------- pixel plates ----------
type Op = [number, number, number, number, string];
const painter = () => {
  const ops: Op[] = [];
  const R = (x: number, y: number, w: number, h: number, c: string) => { ops.push([x, y, w, h, c]); };
  const P = (x: number, y: number, c: string) => R(x, y, 1, 1, c);
  return { ops, R, P };
};
// shop: shelves, red SALE banner, tiled floor
const drawShop = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 120, "#F3EEE6"); R(0, 6, 180, 14, RED); for (let x = 4; x < 180; x += 22) { R(x, 9, 3, 8, "#FFF"); R(x + 5, 9, 3, 8, "#FFF"); R(x + 10, 9, 3, 8, "#FFF"); }
  for (let s = 0; s < 3; s++) { const y = 40 + s * 26; R(0, y, 180, 3, "#8A6A4A"); for (let x = 4 + s * 7; x < 180; x += 19) R(x, y - 10, 10, 10, ["#3E7CC9", "#FFC83D", "#4C9A5A", "#C0503A", "#9AA3AD"][(x + s) % 5]); }
  R(0, 120, 180, 40, "#D8D2C4"); for (let y = 120; y < 160; y += 10) for (let x = ((y / 10) % 2) * 10; x < 180; x += 20) R(x, y, 10, 10, "#C9C2B0");
  R(0, 119, 180, 1, "#8A857E");
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
const PLATES = { shop: drawShop(), office: drawOffice(), gym: drawGym(), desk: drawDesk(), city: drawCity() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { shop: "#F3EEE6", office: "#D7DCE2", gym: "#3B2A5C", desk: "#5B3B26", city: "#F4C9A0" };

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
const lampPal = (shade: string) => ({ K: INK, Y: shade, y: "#FFF3B0", S: "#6A6A70" });
const LAMP = ["..KKKKKKKK..", ".KYYYYYYYYK.", ".KYYyYYYYYK.", "KYYYYYYYYYYK", "KKKKKKKKKKKK", ".....KK.....", ".....SS.....", ".....SS.....", ".....SS.....", ".....SS.....", ".....SS.....", ".....SS.....", ".....SS.....", "...KKKKKK...", "..KSSSSSSK..", "..KKKKKKKK.."];
const ANCHOR = { rows: ["....KKK....", "...KSSSK...", "...KS.SK...", "....KKK....", ".KKKKSKKKK.", ".....S.....", ".....S.....", ".....S.....", "K....S....K", "KS...S...SK", ".KS..S..SK.", "..KSSSSSK..", "...KKKKK..."], pal: { K: INK, S: "#B8B8C0" } };

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
// price tag with the old price struck through
const Tag: React.FC<{ t: number; a: number; strike: number; name: string; old: string; now: string; x: number; y: number; rot?: number; hot?: boolean }> = ({ t, a, strike, name, old, now, x, y, rot = 0, hot }) => {
  if (t < a) return null;
  const s = k(t, strike, 0.25, ease);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 262, zIndex: 8, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, transform: `rotate(${rot}deg)`, ...popStyle(t, a, 14, 0.5) }}>
      <div style={{ background: hot ? RED : INK, color: "#FFF", fontFamily: PX, fontSize: 17, padding: "12px 14px 8px" }}>{name}</div>
      <div style={{ padding: "14px 16px 12px", fontFamily: PX }}>
        <div style={{ position: "relative", display: "inline-block", fontSize: 22, color: "#8A857A" }}>{old}<div style={{ position: "absolute", left: -6, top: "45%", height: 6, width: `${s * 112}%`, background: RED }} /></div>
        <div style={{ fontSize: 34, color: hot ? RED : INK, marginTop: 10 }}>{now}</div>
      </div>
    </div>
  );
};

// 1 · Hook: Montag im Büro, "220 € gespart" → "300 € ausgegeben"
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const st = k(t, A.dreihundert - 0.1, 0.3, ease);
  return (
    <>
      <Plate id="office" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 28, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${bump(t, A.montag, 0.08)})` }}>
          DEIN KOLLEGE, <span style={{ color: GOLD }}>MONTAG</span>
        </div>
      </div>
      <Person t={t} who="kumpel" x={110} y={480} px={13} a={0.1} />
      {t > A.zweihundert - 0.15 ? (
        <div style={{ position: "absolute", left: 380, top: 280, zIndex: 9, ...popStyle(t, A.zweihundert - 0.15, 16, 0.5) }}>
          <PxBox bg={GREEN} color="#FFF" size={30} style={{ position: "relative", transform: `rotate(-3deg) scale(${bump(t, A.gespart, 0.12)})` }}>„220 € GESPART“</PxBox>
          <div style={{ position: "absolute", left: -10, top: 38, height: 10, width: `${st * 108}%`, background: RED, zIndex: 13, transform: "rotate(-3deg)" }} />
        </div>
      ) : null}
      {t > A.zweihundert + 0.2 && t < A.dreihundert ? spark(t, A.zweihundert + 0.25, 740, 330, 10, 60, 220) : null}
      {t > A.dreihundert - 0.1 ? <Stamp t={t} a={A.dreihundert - 0.1} text="300 € AUSGEGEBEN" bg={RED} color="#FFF" size={30} rot={4} style={{ left: 420, top: 520 }} /> : null}
    </>
  );
};

// 2 · Jacke, Sneaker, Lampe: every price struck through; the difference written down as "Gewinn"
const SceneShop: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Plate id="shop" />
    <Tag t={t} a={A.jacke - 0.15} strike={A.durchgestrichen - 0.1} name="JACKE" old="229 €" now="129 €" x={30} y={170} rot={-3} />
    <Tag t={t} a={A.sneaker - 0.15} strike={A.durchgestrichen} name="SNEAKER" old="147 €" now="99 €" x={400} y={250} rot={2} />
    <Tag t={t} a={A.lampe0 - 0.15} strike={A.durchgestrichen + 0.1} name="LAMPE" old="144 €" now="72 €" x={770} y={170} rot={-2} hot />
    {t > A.differenz - 0.15 ? (
      <div style={{ position: "absolute", left: 220, top: 600, width: 640, zIndex: 10, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.4)`, transform: "rotate(-2deg)", backgroundImage: "repeating-linear-gradient(transparent 0 46px, #C9D8EE 46px 49px)", padding: "18px 26px", fontFamily: PX, ...popStyle(t, A.differenz - 0.15, 16, 0.5) }}>
        <div style={{ fontSize: 16, color: "#8A857A" }}>MEIN WOCHENENDE</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 18, fontSize: 30 }}><span>GEWINN</span><span style={{ marginLeft: "auto", color: GREEN, transform: `scale(${bump(t, A.gewinn, 0.15)})` }}>+220 €</span></div>
      </div>
    ) : null}
    {t > A.aufgeschrieben ? <Stamp t={t} a={A.aufgeschrieben} text="GEWINN?" bg={GOLD} size={24} rot={8} style={{ left: 760, top: 560 }} /> : null}
  </>
);

// 3 · The lamp he didn't want, -50 %
const SceneLamp: React.FC<{ t: number }> = ({ t }) => {
  const sw = Math.sin(t * 2) * 2;
  return (
    <>
      <Plate id="shop" />
      <div style={{ position: "absolute", left: 360, top: 250, zIndex: 6, transform: `rotate(${sw}deg)`, transformOrigin: "50% 100%" }}><Sprite rows={LAMP} pal={lampPal(GOLD)} px={30} /></div>
      {t > A.nicht - 0.15 ? <Stamp t={t} a={A.nicht - 0.15} text="WOLLTE ER NICHT" bg="#FFF" size={24} rot={-4} style={{ left: 70, top: 160 }} /> : null}
      {t > A.fuenfzig - 0.15 ? (
        <div style={{ position: "absolute", left: 680, top: 250, width: 230, height: 230, borderRadius: "50%", background: RED, border: `8px solid ${INK}`, zIndex: 9, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PX, fontSize: 48, color: "#FFF", transform: `rotate(${12 + Math.sin(t * 5) * 4}deg) scale(${bump(t, A.runter, 0.15)})`, ...popStyle(t, A.fuenfzig - 0.15, 20, 0.5) }}>-50%</div>
      ) : null}
      {t > A.fuenfzig ? spark(t, A.fuenfzig, 795, 365, 10, 80, 220) : null}
      {t > A.dumm - 0.15 ? <PxBox bg={GOLD} size={26} style={{ left: 600, top: 640, transform: "rotate(3deg)", ...popStyle(t, A.dumm - 0.15, 12, 0.5) }}>„WÄRE JA DUMM“</PxBox> : null}
    </>
  );
};

// 4 · The term: ANKEREFFEKT, an anchor drops onto the first number, it becomes the yardstick, even if invented
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("ANKER", t, A.heisst, A.anker + 0.1);
  const l2 = typed("EFFEKT", t, A.anker + 0.1, A.anker + 0.6);
  const drop = interpolate(t, [A.erste - 0.1, A.erste + 0.35], [-300, 0], { ...clamp, easing: Easing.bounce });
  return (
    <>
      <Plate id="gym" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 56, lineHeight: 1.2, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "28px 30px 16px", textAlign: "center", ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"ANKER".slice(l1.length)}</span><br />
          {l2}<span style={{ opacity: 0 }}>{"EFFEKT".slice(l2.length)}</span>
        </div>
      </div>
      {t > A.erste - 0.2 ? <PxBox bg="#FFF" size={44} style={{ left: 130, top: 560, ...popStyle(t, A.erste - 0.2, 14, 0.5) }}>144 €</PxBox> : null}
      {t > A.erste - 0.1 ? <div style={{ position: "absolute", left: 200, top: 420 + drop, zIndex: 9 }}><Sprite rows={ANCHOR.rows} pal={ANCHOR.pal} px={11} /></div> : null}
      {t > A.massstab - 0.2 ? (
        <div style={{ position: "absolute", left: 540, top: 470, width: 440, zIndex: 8, ...popStyle(t, A.massstab - 0.2, 12, 0.5) }}>
          <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF", marginBottom: 14 }}>DEIN MASSSTAB</div>
          <div style={{ height: 50, background: GOLD, border: `5px solid ${INK}`, backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 4px, transparent 4px 40px)` }} />
          <div style={{ fontFamily: PX, fontSize: 18, color: "#FFF", marginTop: 14 }}>72 € = <span style={{ color: GOLD }}>BILLIG</span></div>
        </div>
      ) : null}
      {t > A.erfunden - 0.1 ? <Stamp t={t} a={A.erfunden - 0.1} text="ERFUNDEN" bg={RED} color="#FFF" size={36} rot={-8} style={{ left: 110, top: 660 }} /> : null}
    </>
  );
};

// 5 · The experiment: a wheel of fortune was enough
const SceneWheel: React.FC<{ t: number }> = ({ t }) => {
  const spin = interpolate(t, [A.versuch - 0.2, A.gereicht], [0, 1440 + 200], { ...clamp, easing: Easing.out(Easing.cubic) });
  const nums = [10, 65, 30, 80, 15, 50, 25, 90];
  return (
    <>
      <Plate id="desk" />
      <PxBox bg={INK} color="#FFF" size={15} shadow={false} style={{ right: 40, top: 40, ...popStyle(t, A.versuch, 10, 0.5) }}>TVERSKY & KAHNEMAN 1974</PxBox>
      <div style={{ position: "absolute", left: 290, top: 170, width: 500, height: 500, zIndex: 6 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `8px solid ${INK}`, boxShadow: `12px 12px 0 rgba(0,0,0,.4)`, background: `conic-gradient(${nums.map((_, i) => `${[GOLD, RED, BLUE, GREEN][i % 4]} ${i * 45}deg ${(i + 1) * 45}deg`).join(",")})`, transform: `rotate(${spin}deg)` }}>
          {nums.map((n, i) => { const ang = ((i + 0.5) * 45 - 90) * Math.PI / 180; return <div key={i} style={{ position: "absolute", left: 250 + Math.cos(ang) * 170 - 40, top: 250 + Math.sin(ang) * 170 - 20, width: 80, textAlign: "center", fontFamily: PX, fontSize: 26, color: "#FFF", textShadow: `3px 3px 0 ${INK}`, transform: `rotate(${(i + 0.5) * 45}deg)` }}>{n}</div>; })}
        </div>
        <div style={{ position: "absolute", left: 230, top: -40, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: `56px solid ${INK}`, zIndex: 7 }} />
        <div style={{ position: "absolute", left: 210, top: 210, width: 80, height: 80, borderRadius: "50%", background: "#FFF", border: `8px solid ${INK}` }} />
      </div>
      {t > A.gereicht - 0.1 ? <Stamp t={t} a={A.gereicht - 0.1} text="HAT GEREICHT" bg={GOLD} size={30} rot={-5} style={{ left: 300, top: 740 }} /> : null}
    </>
  );
};

// 6 · Founder: "Wenn ich mal einen Laden aufmache, streiche ich jeden Preis durch. Auch den durchgestrichenen."
const SceneFounder: React.FC<{ t: number }> = ({ t }) => {
  const s1 = k(t, A.durch - 0.2, 0.25, ease), s2 = k(t, A.durchgestrichenen + 0.1, 0.25, ease);
  return (
    <>
      <Plate id="city" />
      <PxBox bg={RED} color="#FFF" size={26} style={{ left: 330, top: 130, ...popStyle(t, A.laden - 0.15, 14, 0.5) }}>FLORENTS LADEN</PxBox>
      <Person t={t} who="niklas" x={90} y={460} px={12} a={A.wenn1 - 0.1} />
      {t > A.streiche - 0.2 ? (
        <div style={{ position: "absolute", left: 470, top: 300, width: 470, zIndex: 8, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, transform: "rotate(3deg)", padding: "20px 24px", fontFamily: PX, ...popStyle(t, A.streiche - 0.2, 16, 0.5) }}>
          <div style={{ fontSize: 16, color: "#8A857A", marginBottom: 14 }}>SOCKEN</div>
          <div style={{ position: "relative", display: "inline-block", fontSize: 30, color: "#8A857A" }}>99 €<div style={{ position: "absolute", left: -6, top: "42%", height: 7, width: `${s1 * 115}%`, background: RED }} /></div>
          {t > A.auch1 - 0.1 ? <div style={{ position: "relative", display: "inline-block", fontSize: 30, color: "#8A857A", marginLeft: 26, ...popStyle(t, A.auch1 - 0.1, 8, 0.4) }}>79 €<div style={{ position: "absolute", left: -6, top: "42%", height: 7, width: `${s2 * 115}%`, background: RED }} /></div> : null}
          {t > A.durchgestrichenen + 0.3 ? <div style={{ fontSize: 44, color: RED, marginTop: 16, ...popStyle(t, A.durchgestrichenen + 0.3, 10, 0.5) }}>12 €</div> : <div style={{ height: 60 }} />}
        </div>
      ) : null}
      {t > A.durchgestrichenen + 0.4 ? <Stamp t={t} a={A.durchgestrichenen + 0.4} text="AUCH DEN DURCHGESTRICHENEN" bg={GOLD} size={18} rot={-3} style={{ left: 300, top: 760 }} /> : null}
    </>
  );
};

// 7 · Black Friday list, already written
const SceneList: React.FC<{ t: number }> = ({ t }) => {
  const items = ["KOPFHÖRER", "MANTEL", "AIRFRYER"];
  return (
    <>
      <Plate id="office" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 34, color: GOLD, background: INK, padding: "24px 28px 16px", border: `6px solid ${GOLD}`, transform: `scale(${bump(t, A.black + 0.1, 0.1)})`, ...popStyle(t, A.black - 0.1, 14, 0.5) }}>BLACK FRIDAY</div>
      </div>
      <Person t={t} who="kumpel" x={90} y={470} px={12} />
      {t > A.sparen - 0.1 ? <PxBox bg="#FFF" size={20} style={{ left: 60, top: 300, ...popStyle(t, A.sparen - 0.1, 12, 0.5) }}>„RICHTIG SPAREN“</PxBox> : null}
      {t > A.liste - 0.2 ? (
        <div style={{ position: "absolute", left: 470, top: 300, width: 480, zIndex: 8, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.4)`, transform: "rotate(2deg)", padding: "20px 24px", fontFamily: PX, ...popStyle(t, A.liste - 0.2, 16, 0.5) }}>
          <div style={{ fontSize: 16, color: "#8A857A", marginBottom: 10 }}>MEINE LISTE</div>
          {items.map((it, i) => (t > A.liste + i * 0.15 ? <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 60, fontSize: 20, borderBottom: "3px dashed #C9C2B0", ...popStyle(t, A.liste + i * 0.15, 8, 0.4) }}><span style={{ width: 26, height: 26, border: `4px solid ${INK}` }} />{it}</div> : null))}
        </div>
      ) : null}
    </>
  );
};

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



const CHAT_ROWS = [{ a: A.fragt, k: "1 · ZUM VOLLEN PREIS?", v: "NEIN", col: RED }, { a: A.kauf, k: "2 · ECHTER PREIS?", v: "72 €" }, { a: A.sachen, k: "3 · BRAUCHST DU ES?", v: "NEIN", col: RED }];
const SceneOutro: React.FC<{ t: number }> = ({ t }) => (
  <Outro t={t} start={A.damit} chat={A.chatgpt} head="SOLL ICH DAS KAUFEN?" tag="CHATGPT FRAGT NACH" rows={CHAT_ROWS} total={{ a: A.zuruecklegt, k: "LAMPE", v: "ZURÜCK" }} word="RABATT" wordA={A.rabatt} schreib={A.schreib} dmA={A.schick - 0.05} eS={A.video} pdf="RABATT-GUIDE.PDF" pdfSub="3-FRAGEN-CHECK" nr={8} run="gpts-anker-rabatt" sendTo="AN KOLLEGEN SENDEN" />
);

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.jacke - 0.4, El: SceneHook, pill: "Dein Kollege", bg: PLATE_BG.office },
  { from: A.jacke - 0.4, to: A.lampe1 - 0.15, El: SceneShop, pill: "Das Wochenende", bg: PLATE_BG.shop },
  { from: A.lampe1 - 0.15, to: A.heisst - 0.05, El: SceneLamp, pill: "Die Lampe", bg: PLATE_BG.shop },
  { from: A.heisst - 0.05, to: A.versuch - 0.3, El: SceneTerm, pill: "Psychologie", bg: PLATE_BG.gym },
  { from: A.versuch - 0.3, to: A.wenn1 - 0.15, El: SceneWheel, pill: "Der Versuch", bg: PLATE_BG.desk },
  { from: A.wenn1 - 0.15, to: A.sagt1 - 0.2, El: SceneFounder, pill: "Ich", bg: PLATE_BG.city },
  { from: A.sagt1 - 0.2, to: A.lampe2 - 0.2, El: SceneList, pill: "Black Friday", bg: PLATE_BG.office },
  { from: A.lampe2 - 0.2, to: A.damit - 0.1 },
  { from: A.damit - 0.1, to: 999, El: SceneOutro, pill: "Gegenmittel #8", bg: "#FFF6D6" },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["kollege", "montag", "220", "gespart", "300", "ausgegeben", "jacke", "sneaker", "lampe", "durchgestrichen", "gewinn", "50", "dumm", "ankereffekt", "zahl", "maßstab", "erfunden", "glücksrad", "laden", "durch", "durchgestrichenen", "black", "liste", "grau", "chatgpt", "kauf", "zurücklegt", "rabatt", "video"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const SHOW: Record<string, string> = { zweihundertzwanzig: "220 €", dreihundert: "300 €", fünfzig: "50 %", prozent: "", drei: "3" };
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

export const AnkerPixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-anker-rabatt-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
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
