import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../../runs/gpts-drip-pizza/captions.json";
import { Cap, clamp, k, makeTimeline, pop, popStyle, Sprite, typed } from "../components/OpusKit";

// GPT-S "Pizza für neun Euro" (Drip Pricing, Blake/Moshary/Sweeney/Tadelis 2021, 2026-10-28) im Pixel-Niklas-Look wie SludgePixel.
// Studie mit echten Screenshots (Marketing Science 2021: Titel, Abstract, StubHub-Seite, "spend almost 21% more").
// Pointe "Und morgen sagst du wieder …" ruhig auf dem Gesicht, danach Gegenmittel #3 (Endpreis + Uber One), Wort PIZZA.

const W = 1080, H = 1920, PH = 960;
const GOLD = "#FFC83D", INK = "#141414", RED = "#D8463A", GREEN = "#4C9A5A", BLUE = "#3E7CC9";
const PX = "Press Start TwoP", SM = "Space Mono";
const CAPS = captions as Cap[];
const TL = makeTimeline(CAPS);
const at = TL.at;
const END = CAPS[CAPS.length - 1].endMs / 1000;
export const DP_FRAMES = Math.round((END + 0.9) * 25);
export const A = {
  aufgefallen: at("aufgefallen"), billig: at("billig"), neun0: at("neun", 0), bezahlt: at("bezahlt"), n14: at("vierzehn"),
  erst: at("erst", 0), liefer: at("liefergebühr"), service: at("servicegebühr"), gebuehr: at("gebühr"), paypal: at("paypal"),
  heisst: at("heißt"), drip: at("drip"), preis: at("preis", 0), einmal: at("einmal"), tropft: at("tropft"), drin: at("drin"), teuer: at("teuer"),
  forscher: at("forscher"), ticketseite: at("ticketseite"), millionen: at("millionen"), gebuehren: at("gebühren"), ende: at("ende", 1), fuenftel: at("fünftel"), ausgegeben: at("ausgegeben"),
  find: at("find"), fair: at("fair"), weg: at("weg"), minuten: at("minuten"), euro5: at("euro", 1),
  morgen: at("morgen"), kochen: at("kochen"), neun1: at("neun", 1),
  damit: at("damit", 1), chatgpt: at("chatgpt"), gebaut: at("gebaut"), endpreis: at("endpreis"), monatsende: at("monatsende"), uber: at("uber"), lohnt: at("lohnt", 1),
  schreib: at("schreib"), pizza: at("pizza", 2), schick: at("schick"),
};

// ---------- pixel plates ----------
type Op = [number, number, number, number, string];
const painter = () => {
  const ops: Op[] = [];
  const R = (x: number, y: number, w: number, h: number, c: string) => { ops.push([x, y, w, h, c]); };
  const P = (x: number, y: number, c: string) => R(x, y, 1, 1, c);
  return { ops, R, P };
};
// living room in the evening: window with night sky, sofa, floor
const drawRoom = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 118, "#E9DFCF"); for (let y = 6; y < 118; y += 10) for (let x = (y / 10) % 2 ? 0 : 10; x < 180; x += 20) P(x, y, "#DDD0BC");
  R(118, 14, 50, 44, "#3A3F4A"); R(120, 16, 46, 40, "#1E2A4A"); P(128, 22, "#FFF"); P(150, 30, "#FFF"); P(140, 44, "#FFF"); R(156, 20, 4, 4, "#F4E9B0");
  R(142, 16, 2, 40, "#3A3F4A"); R(120, 35, 46, 2, "#3A3F4A");
  R(0, 118, 180, 42, "#B98B5E"); for (let y = 122; y < 160; y += 6) R(0, y, 180, 1, "#A97B50");
  // sofa
  R(6, 84, 92, 30, "#7C5A9A"); R(6, 76, 92, 12, "#6A4A88"); R(2, 84, 8, 30, "#5E3F7A"); R(94, 84, 8, 30, "#5E3F7A"); R(8, 114, 4, 6, INK); R(92, 114, 4, 6, INK);
  return p.ops;
};
const drawDark = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#22262E"); for (let y = 3; y < 160; y += 7) for (let x = (y % 2) * 5; x < 180; x += 11) P(x, y, "#2C313B");
  R(0, 132, 180, 28, "#1A1D23"); R(0, 132, 180, 1, GOLD);
  return p.ops;
};
// desk for the study: wood top, lamp glow
const drawDesk = () => {
  const p = painter(); const { R, P } = p;
  R(0, 0, 180, 160, "#5B3B26"); for (let y = 2; y < 160; y += 5) for (let x = (y % 3) * 4; x < 180; x += 13) P(x, y, "#6B4730");
  for (let y = 0; y < 160; y += 16) R(0, y, 180, 1, "#4E321F");
  return p.ops;
};
// street map for "the way": blocks, road, path
const drawMap = () => {
  const p = painter(); const { R } = p;
  R(0, 0, 180, 160, "#CFE3C2");
  for (let y = 8; y < 160; y += 38) for (let x = 6; x < 180; x += 44) R(x, y, 34, 28, "#E8E1D2");
  R(0, 44, 180, 6, "#FFFFFF"); R(0, 120, 180, 6, "#FFFFFF"); R(42, 0, 6, 160, "#FFFFFF"); R(130, 0, 6, 160, "#FFFFFF");
  return p.ops;
};
const PLATES = { room: drawRoom(), dark: drawDark(), desk: drawDesk(), map: drawMap() };
const Plate = React.memo<{ id: keyof typeof PLATES }>(({ id }) => (
  <svg width={W + 48} height={PH + 48} viewBox="0 0 180 160" preserveAspectRatio="none" shapeRendering="crispEdges" style={{ position: "absolute", left: -24, top: -24 }}>
    {PLATES[id].map(([x, y, w, h, c], i) => <rect key={i} x={x} y={y} width={w + 0.02} height={h + 0.02} fill={c} />)}
  </svg>
));
const PLATE_BG = { room: "#E9DFCF", dark: "#22262E", desk: "#5B3B26", map: "#CFE3C2" };

// ---------- people ----------
const NK = [
  "....hhhhhh....", "...hHHLLHHh...", "..hHHHHLLHHh..", "..HHhSSSSHHH..", "..HSSSSSSSSH..", "..SSESSSSESS..", "..sSSSSSSSSs..", "..SSSSssSSSS..",
  "..sSbbbbbbSs..", "...sbbSSbbs...", "....sSSSSs....", "..nNNWWWWNNn..", ".nNNNNWZWNNNn.", ".NNNNNNZNNNNN.", ".NNnNNNZNNNnNN", ".NN.NNNZNNN.NN",
  ".NN.NNNZNNN.NF", ".SS.NNNNNNN.Ff", "....NNNNNNN.Ff", "....PPPPPPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "....PPP.PPP...", "...BBBB.BBBB..",
];
const SK = { S: "#F2C6A4", s: "#D9A27F" };
const PAL = {
  niklas: { h: "#8A5A30", H: "#B07A45", L: "#C99A63", ...SK, E: "#2B2B2B", b: "#B58A62", N: "#1E2433", n: "#2E3650", W: "#F5F5F5", Z: "#C9C9C9", P: "#3A3F4A", B: "#151515", F: "#111111", f: "#7FD3FF" },
  du: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: GREEN, n: "#3B7A47", W: "#F5F5F5", Z: "#3B7A47", P: "#3A3F4A", B: "#151515", F: "#111111", f: "#7FD3FF" },
  rider: { h: "#2B1E16", H: "#3D2B1F", L: "#5A4030", ...SK, E: "#2B2B2B", b: "#9A6A48", N: "#FF8000", n: "#D96A00", W: "#F5F5F5", Z: INK, P: "#1E2433", B: "#151515", F: SK.S, f: SK.S },
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
const PIZZA = { rows: ["....KKKKKK....", "..KKCCCCCCKK..", ".KCCYYYYYYCCK.", ".KCYRYYYYRYCK.", "KCYYYYGYYYYYCK", "KCYYRYYYYRYYCK", "KCYGYYYRYYGYCK", "KCYYYYRYYYYYCK", ".KCYRYYYGYYCK.", ".KCCYYYYYYCCK.", "..KKCCCCCCKK..", "....KKKKKK...."], pal: { K: INK, C: "#D9A05B", Y: "#FFD45C", R: RED, G: GREEN } };
const COIN = { rows: [".YY.", "YyYY", "YYyY", ".YY."], pal: { Y: GOLD, y: "#FFF3B0" } };
const DROP = { rows: ["..K..", "..K..", ".KBK.", ".KBK.", "KBBWK", "KBBBK", ".KKK."], pal: { K: INK, B: "#5FB4F0", W: "#FFFFFF" } };
const CART = { rows: ["KK..........", ".K..........", ".KKKKKKKKKKK", ".KYYYYYYYYYK", ".KYYYYYYYYK.", ".KYYYYYYYYK.", "..KKKKKKKK..", "..K......K..", ".KKK....KKK.", ".KKK....KKK."], pal: { K: INK, Y: GOLD } };
const LOCK = { rows: [".KKKK.", "K....K", "K....K", "KKKKKK", "KYYYYK", "KYKKYK", "KYYYYK", "KKKKKK"], pal: { K: INK, Y: GOLD } };
const SCOOTER = { rows: ["......KK....", ".......K....", "..OOOOOK....", "..OOOOOK....", "..OOOOOKKKK.", "KKKKKKKKKKKK", ".KK......KK.", ".KK......KK."], pal: { K: INK, O: "#FF8000" } };
const CAL = { rows: ["KKKKKKKKKK", "KRRRRRRRRK", "KKKKKKKKKK", "KWKWKWKWWK", "KWWWWWWWWK", "KWKWKWKWWK", "KWWWWWWWWK", "KWKWKWKWWK", "KKKKKKKKKK"], pal: { K: INK, R: RED, W: "#FFFFFF" } };
const ROBOT = { rows: ["....KK....", "....RR....", ".KKKKKKKK.", "KWWWWWWWWK", "KWBBWWBBWK", "KWBBWWBBWK", "KWWWWWWWWK", "KWWRRRRWWK", "KWWWWWWWWK", ".KKKKKKKK."], pal: { K: INK, W: "#F5F5F5", B: GREEN, R: RED } };

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
const TopTag: React.FC<{ t: number; a: number; text: string }> = ({ t, a, text }) => (t < a ? null : (
  <div style={{ position: "absolute", right: 36, top: 36, zIndex: 20, transformOrigin: "100% 0", transform: `scale(${interpolate(t, [a, a + 0.14], [1.7, 1], { ...clamp, easing: Easing.out(Easing.cubic) })}) rotate(${interpolate(t, [a, a + 0.14], [-6, 0], clamp)}deg)`, opacity: k(t, a, 0.06) }}>
    <div style={{ background: GOLD, color: INK, border: `4px solid ${INK}`, fontFamily: PX, fontSize: 24, padding: "14px 16px 10px", boxShadow: `6px 6px 0 ${INK}`, whiteSpace: "nowrap" }}>{text}</div>
  </div>
));
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
const eur = (v: number) => v.toFixed(2).replace(".", ",") + " €";

// delivery-app phone (flat, no platform logo)
const Phone: React.FC<{ t: number; a: number; x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ t, a, x, y, w, h, children }) => (t < a - 0.05 ? null : (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, zIndex: 6, background: INK, border: `6px solid ${INK}`, borderRadius: 34, boxShadow: `10px 10px 0 rgba(0,0,0,.35)`, padding: 14, ...popStyle(t, a - 0.05, 24, 0.6) }}>
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#FFFDF6", borderRadius: 22, overflow: "hidden" }}>{children}</div>
  </div>
));

// ---------- scenes ----------
// 1 · Hook: the pizza is cheap at the start of the order (9 €), paid at the end: 14 €
const SceneHook: React.FC<{ t: number }> = ({ t }) => {
  const paid = t > A.bezahlt - 0.05;
  const price = paid ? lerp(t, A.n14 - 0.25, A.n14 + 0.15, 9, 14) : 9;
  return (
    <>
      <Plate id="room" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", justifyContent: "center", zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 34, color: "#FFF", background: INK, padding: "22px 26px 14px", boxShadow: `6px 6px 0 rgba(0,0,0,.35)`, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - 0.2) / 0.2)})` }}>
          PIZZA: <span style={{ color: GOLD }}>9 €</span> · BEZAHLT: <span style={{ color: paid ? "#FF8A7A" : "#666" }}>{paid ? "14 €" : "?"}</span>
        </div>
      </div>
      <Phone t={t} a={0.05} x={560} y={210} w={420} h={700}>
        <div style={{ background: GREEN, padding: "22px 20px 14px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>DEINE BESTELLUNG</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}><Sprite rows={PIZZA.rows} pal={PIZZA.pal} px={14} /></div>
        <div style={{ fontFamily: PX, fontSize: 18, color: INK, textAlign: "center", marginTop: 20 }}>MARGHERITA</div>
        <div style={{ fontFamily: PX, fontSize: 40, color: paid ? RED : INK, textAlign: "center", marginTop: 24, transform: `scale(${1 + 0.14 * Math.max(0, 1 - Math.abs(t - A.n14) / 0.2)})` }}>{eur(price)}</div>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 22, fontFamily: PX, fontSize: 16, color: "#FFF", background: paid ? RED : GREEN, padding: "18px 0 12px", textAlign: "center", border: `4px solid ${INK}` }}>{paid ? "BEZAHLT ✓" : "ZUR KASSE"}</div>
        {t > A.billig - 0.05 && !paid ? <div style={{ position: "absolute", right: 10, top: 330, ...popStyle(t, A.billig - 0.05, 10, 0.5) }}><PxBox bg={GOLD} size={14} style={{ position: "relative" }}>SO BILLIG!</PxBox></div> : null}
      </Phone>
      <Person t={t} who="du" x={130} y={520} px={12} a={0.1} bob={paid ? 0 : 1} />
      {t > A.aufgefallen - 0.1 ? <PxBox bg="#FFF" size={20} style={{ left: 80, top: 380, ...popStyle(t, A.aufgefallen - 0.1, 10, 0.5) }}>{paid ? "MOMENT …" : "NUR 9 €?"}</PxBox> : null}
      {paid ? spark(t, A.n14 - 0.05, 770, 560, 10, 50, 170, RED) : null}
    </>
  );
};

// 2 · The fees drip in one by one on the receipt, total climbs 9 → 14
const FEES: [keyof typeof A, string, number][] = [["liefer", "LIEFERGEBÜHR", 3.49], ["service", "SERVICEGEBÜHR", 1.22], ["paypal", "PAYPAL-GEBÜHR", 0.29]];
const SceneDrip: React.FC<{ t: number }> = ({ t }) => {
  const got = FEES.filter(([key]) => t > A[key] - 0.1);
  const total = 9 + FEES.reduce((s, [key, , v]) => s + v * k(t, A[key] - 0.1, 0.3), 0);
  return (
    <>
      <Plate id="room" />
      <div style={{ position: "absolute", left: 120, top: 110, width: 840, zIndex: 7, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}`, padding: "22px 26px 20px", ...popStyle(t, A.erst - 0.15, 20, 0.6) }}>
        <div style={{ fontFamily: PX, fontSize: 20, color: "#FFF", background: INK, padding: "14px 14px 10px", marginBottom: 14 }}>KASSE</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: PX, fontSize: 24, color: INK, padding: "12px 0" }}><span>PIZZA</span><span>9,00 €</span></div>
        {FEES.map(([key, label, v], i) => (t < A[key] - 0.1 ? <div key={i} style={{ height: 64 }} /> : (
          <div key={i} style={{ position: "relative", display: "flex", justifyContent: "space-between", fontFamily: PX, fontSize: 24, color: RED, padding: "16px 0 12px", borderTop: "3px dashed #C9C2B0", ...popStyle(t, A[key] - 0.1, 10, 0.6) }}>
            <span>+ {label}</span><span>{eur(v)}</span>
          </div>
        )))}
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: PX, fontSize: 34, color: "#FFF", background: got.length === 3 ? RED : INK, padding: "20px 16px 14px", marginTop: 14, transform: `scale(${1 + 0.06 * Math.max(0, 1 - Math.abs(t - A.paypal - 0.2) / 0.2)})` }}>
          <span>GESAMT</span><span>{eur(total)}</span>
        </div>
      </div>
      {/* drops falling onto the receipt per fee */}
      {FEES.map(([key], i) => {
        const u = (t - A[key] + 0.35) / 0.4;
        return u <= 0 || u >= 1 ? null : <div key={i} style={{ position: "absolute", left: 880, top: 30 + u * (230 + i * 70), zIndex: 9 }}><Sprite rows={DROP.rows} pal={DROP.pal} px={10} /></div>;
      })}
      {t > A.gebuehr - 0.1 ? <Stamp t={t} a={A.paypal + 0.35} text="+5 € GEBÜHREN" bg={RED} color="#FFF" size={26} rot={-5} style={{ left: 330, top: 700 }} /> : null}
    </>
  );
};

// 3 · The term: DRIP PRICING typed; a price tag drips; you're already in the cart (lock) when it gets expensive
const SceneTerm: React.FC<{ t: number }> = ({ t }) => {
  const l1 = typed("DRIP PRICING", t, A.drip - 0.1, A.drip + 0.5);
  const drops = Math.max(0, Math.floor((t - A.tropft + 0.1) / 0.28));
  return (
    <>
      <Plate id="dark" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, zIndex: 10 }}>
        <div style={{ fontFamily: PX, fontSize: 70, lineHeight: 1.1, color: GOLD, background: INK, border: `6px solid ${GOLD}`, padding: "30px 36px 18px", boxShadow: `0 8px 0 #6B4528`, ...popStyle(t, A.heisst, 16, 0.7) }}>
          {l1}<span style={{ opacity: 0 }}>{"DRIP PRICING".slice(l1.length)}</span>
        </div>
        {t > A.einmal - 0.1 ? <div style={{ fontFamily: PX, fontSize: 22, color: "#FFF", ...popStyle(t, A.einmal - 0.1, 8, 0.6) }}>= DER PREIS TROPFT</div> : null}
      </div>
      {/* price tag that drips */}
      {t > A.preis - 0.15 ? (
        <div style={{ position: "absolute", left: 120, top: 400, zIndex: 7, ...popStyle(t, A.preis - 0.15, 16, 0.5) }}>
          <div style={{ fontFamily: PX, fontSize: 34, color: INK, background: GOLD, border: `6px solid ${INK}`, padding: "22px 24px 14px", boxShadow: `6px 6px 0 #000`, transform: "rotate(-4deg)" }}>{eur(9 + Math.min(5, drops * 0.83))}</div>
          {Array.from({ length: 4 }, (_, i) => {
            const u = ((t - A.tropft) * 1.3 + i / 4) % 1;
            return t < A.tropft - 0.05 ? null : <div key={i} style={{ position: "absolute", left: 60 + i * 50, top: 110 + u * 300, opacity: 1 - u, zIndex: 6 }}><Sprite rows={DROP.rows} pal={DROP.pal} px={8} /></div>;
          })}
        </div>
      ) : null}
      {/* you are already in */}
      {t > A.drin - 0.15 ? (
        <div style={{ position: "absolute", left: 600, top: 470, zIndex: 8, ...popStyle(t, A.drin - 0.15, 16, 0.5) }}>
          <Sprite rows={CART.rows} pal={CART.pal} px={20} />
          <div style={{ position: "absolute", left: 80, top: -20, ...popStyle(t, A.drin, 30, 0.4) }}><Sprite rows={LOCK.rows} pal={LOCK.pal} px={10} /></div>
          <PxBox bg="#FFF" size={18} style={{ left: -10, top: 230 }}>DU BIST SCHON DRIN</PxBox>
        </div>
      ) : null}
      {t > A.teuer - 0.05 ? <Stamp t={t} a={A.teuer - 0.05} text="DANN TEUER" bg={RED} color="#FFF" size={30} rot={-5} style={{ left: 90, top: 760 }} /> : null}
    </>
  );
};

// 4 · The study with real screenshots: title + highlighted abstract → StubHub event page (Fig. 2) → "spend almost 21% more"
const IMG = (n: string) => staticFile(`gpts-drip-pizza/${n}.png`);
const SceneStudy: React.FC<{ t: number }> = ({ t }) => {
  const p2 = A.ticketseite - 0.15, p3 = A.gebuehren - 0.2;
  const ph = t < p2 ? 1 : t < p3 ? 2 : 3;
  const zoom = k(t, A.fuenftel - 0.35, 0.6, ease);
  return (
    <>
      <Plate id="desk" />
      {ph === 1 ? (
        <div style={{ position: "absolute", left: 60, top: 120, width: 960, zIndex: 4, ...popStyle(t, A.forscher - 0.1, 24, 0.8) }}>
          <div style={{ background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, padding: 14, lineHeight: 0 }}>
            <Img src={IMG("study-title")} style={{ width: "100%" }} />
            <div style={{ height: 14 }} />
            <Img src={IMG("study-abstract")} style={{ width: "100%" }} />
          </div>
        </div>
      ) : null}
      {ph === 2 ? (
        <div style={{ position: "absolute", left: 50, top: 110, width: 980, zIndex: 4, transform: `rotate(${interpolate(t, [p2, p3], [-1.5, 0.5], clamp)}deg)`, ...popStyle(t, p2, 24, 0.8) }}>
          <div style={{ background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, lineHeight: 0 }}>
            <Img src={IMG("study-fig2")} style={{ width: "100%" }} />
          </div>
          {t > A.millionen - 0.1 ? <Stamp t={t} a={A.millionen - 0.1} text="MILLIONEN KÄUFER" bg={GOLD} size={28} rot={-5} style={{ left: 300, top: 560 }} /> : null}
        </div>
      ) : null}
      {ph === 3 ? (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * zoom})`, transformOrigin: "540px 374px", zIndex: 4 }}>
          <div style={{ position: "absolute", left: 110, top: 170, width: 860, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 rgba(0,0,0,.45)`, lineHeight: 0, ...popStyle(t, p3, 24, 0.8) }}>
            <Img src={IMG("study-21")} style={{ width: "100%" }} />
          </div>
        </div>
      ) : null}
      {ph === 3 && t > A.fuenftel - 0.1 ? <Stamp t={t} a={A.fuenftel - 0.1} text="+21 % AUSGEGEBEN" bg={RED} color="#FFF" size={30} rot={-4} style={{ left: 330, top: 720 }} /> : null}
      {ph === 3 && t > A.gebuehren - 0.1 ? <PxBox bg="#FFF" size={18} style={{ left: 70, top: 640, ...popStyle(t, A.gebuehren - 0.1, 8, 0.5) }}>GEBÜHREN ERST AM ENDE</PxBox> : null}
      <PxBox bg={INK} color="#FFF" size={15} shadow={false} style={{ right: 40, top: 40, ...popStyle(t, A.forscher, 10, 0.5) }}>MARKETING SCIENCE · 2021</PxBox>
    </>
  );
};

// 5 · "Ich find das fair. Du sparst dir ja den Weg. Fünf Minuten. Für fünf Euro." the way on a map, 5 min vs 5 €
const SceneFair: React.FC<{ t: number }> = ({ t }) => {
  const walk = k(t, A.weg - 0.1, 1.0, ease);
  return (
    <>
      <Plate id="map" />
      <Person t={t} who="niklas" x={60} y={460} px={11} a={A.find - 0.1} />
      {t > A.fair - 0.05 ? <PxBox bg={GOLD} size={24} style={{ left: 50, top: 360, ...popStyle(t, A.fair - 0.05, 10, 0.5) }}>FAIR.</PxBox> : null}
      {t > A.weg - 0.15 ? (
        <>
          {/* dotted path from pizzeria to your door */}
          {Array.from({ length: 12 }, (_, i) => (i / 12 > walk ? null : <div key={i} style={{ position: "absolute", left: 360 + i * 48, top: 300 + Math.sin(i * 0.7) * 40, width: 18, height: 18, background: INK, zIndex: 5 }} />))}
          <PxBox bg="#FFF" size={16} style={{ left: 300, top: 200, ...popStyle(t, A.weg - 0.15, 8, 0.5) }}>PIZZERIA</PxBox>
          <PxBox bg="#FFF" size={16} style={{ left: 840, top: 200, ...popStyle(t, A.weg, 8, 0.5) }}>DU</PxBox>
          <div style={{ position: "absolute", left: 360 + walk * 520, top: 380, zIndex: 6, transform: "scaleX(-1)" }}><Sprite rows={SCOOTER.rows} pal={SCOOTER.pal} px={10} /></div>
        </>
      ) : null}
      {t > A.minuten - 0.1 ? <PxBox bg={GREEN} color="#FFF" size={30} style={{ left: 420, top: 560, ...popStyle(t, A.minuten - 0.1, 12, 0.5) }}>5 MIN</PxBox> : null}
      {t > A.euro5 - 0.25 ? (
        <>
          <PxBox bg={RED} color="#FFF" size={30} style={{ left: 700, top: 600, transform: `rotate(-4deg) scale(${1 + 0.12 * Math.max(0, 1 - Math.abs(t - A.euro5) / 0.2)})`, ...popStyle(t, A.euro5 - 0.25, 12, 0.5) }}>5 €</PxBox>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 640 + i * 50, top: 740 - (i % 2) * 16, zIndex: 8, ...popStyle(t, A.euro5 - 0.2 + i * 0.05, 30, 0.4) }}><Sprite rows={COIN.rows} pal={COIN.pal} px={10} /></div>)}
        </>
      ) : null}
    </>
  );
};

// 6 · Outro (animated to the last frame): cover → ChatGPT computes the real end price → month calendar: is Uber One worth it →
// "PIZZA" typed into the comment field → DM with the PDF arrives
const PAGE = (n: number) => staticFile(`gpts-drip-pizza/guide-${n === 1 ? "cover" : `p${n}`}.png`);
const CHECK: [string, string, boolean?][] = [["PIZZA", "9,00 €"], ["GEBÜHREN", "+5,00 €"], ["ECHTER PREIS", "14,00 €", true]];
const SceneOutro: React.FC<{ t: number }> = ({ t }) => {
  const a = A.damit - 0.05;
  const bS = A.chatgpt, cS = A.monatsende - 0.2, dS = A.schreib - 0.2;
  const fl = Math.sin(t * 2.2) * 6, rot = Math.sin(t * 1.3) * 1.2;
  const cx = t < bS ? 320 : t < dS ? lerp(t, bS, bS + 0.4, 320, 40) : lerp(t, dS, dS + 0.4, 40, 60);
  const cw = t < bS ? 440 : t < dS ? lerp(t, bS, bS + 0.4, 440, 340) : lerp(t, dS, dS + 0.4, 340, 250);
  const cy = t < dS ? 90 : lerp(t, dS, dS + 0.4, 90, 70);
  const cr = t < bS ? interpolate(t, [a, a + 0.5], [-9, -4], clamp) : t < dS ? -5 : -7;
  // end-price check
  const docIn = t > bS - 0.1 && t < cS + 0.4;
  const docX = t < cS ? lerp(t, bS - 0.1, bS + 0.3, 1100, 430) : lerp(t, cS, cS + 0.4, 430, 1150);
  const typeA = A.gebaut - 0.1, typeB = A.endpreis + 0.4, per = (typeB - typeA) / CHECK.length;
  // month: Uber One
  const monIn = t > cS - 0.05 && t < dS + 0.3;
  const monX = t < dS ? lerp(t, cS - 0.05, cS + 0.35, 1100, 420) : lerp(t, dS, dS + 0.4, 420, 1150);
  const orders = Math.min(6, Math.max(0, Math.floor((t - A.uber + 0.2) / 0.22)));
  const verdict = t > A.lohnt - 0.1;
  // comment + DM
  const word = typed("PIZZA", t, A.schreib + 0.05, A.pizza + 0.2);
  const sent = t > A.pizza + 0.3;
  const dmA = A.schick - 0.25;
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFF6D6", backgroundImage: "radial-gradient(rgba(20,20,20,.10) 2px, transparent 2.5px)", backgroundSize: "28px 28px" }} />
      <div style={{ position: "absolute", left: cx, top: cy + fl, width: cw, zIndex: 6, transform: `rotate(${cr + rot}deg) translateY(${interpolate(t, [a, a + 0.5], [60, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px)`, opacity: k(t, a, 0.25), border: `6px solid ${INK}`, boxShadow: `12px 12px 0 ${INK}`, lineHeight: 0 }}>
        <Img src={PAGE(1)} style={{ width: "100%" }} />
      </div>
      {t > A.damit && t < bS + 0.3 ? <PxBox bg={GOLD} size={22} style={{ left: 40, top: 720, transform: `rotate(-3deg) translateY(${fl * 0.5}px)`, ...popStyle(t, A.damit, 10, 0.5) }}>GEGENMITTEL #3</PxBox> : null}
      {/* ChatGPT computes the real end price */}
      {docIn ? (
        <div style={{ position: "absolute", left: docX, top: 140 + fl * 0.4, width: 600, zIndex: 8, background: "#FFFDF6", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ background: INK, padding: "14px 16px 10px", fontFamily: PX, fontSize: 16, color: "#FFF" }}>ENDPREIS-CHECK</div>
          <div style={{ padding: "18px 20px 16px" }}>
            {CHECK.map(([kk, v, hot], i) => {
              const s0 = typeA + i * per;
              if (t < s0) return <div key={i} style={{ height: 66 }} />;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 66, borderBottom: hot ? "none" : "3px dashed #C9C2B0", fontFamily: PX, background: hot ? RED : "transparent", color: hot ? "#FFF" : INK, padding: hot ? "0 10px" : 0, marginTop: hot ? 8 : 0 }}>
                  <span style={{ fontSize: 17 }}>{kk}</span><span style={{ fontSize: 22 }}>{typed(v, t, s0, s0 + per * 0.7)}</span>
                </div>
              );
            })}
            {t < typeB && blink ? <div style={{ width: 16, height: 26, background: INK, marginTop: 8 }} /> : null}
          </div>
          {t > A.chatgpt - 0.1 ? <PxBox bg="#FFF" size={15} style={{ left: -20, top: -46, ...popStyle(t, A.chatgpt - 0.1, 8, 0.5) }}>CHATGPT RECHNET</PxBox> : null}
          <div style={{ position: "absolute", right: -24, bottom: -56, background: "#FFF", border: `5px solid ${INK}`, padding: 10, boxShadow: `6px 6px 0 ${INK}`, ...popStyle(t, A.chatgpt, 14, 0.4) }}><Sprite rows={ROBOT.rows} pal={ROBOT.pal} px={7} /></div>
        </div>
      ) : null}
      {/* end of month: is Uber One worth it? */}
      {monIn ? (
        <div style={{ position: "absolute", left: monX, top: 120 + fl * 0.4, width: 620, zIndex: 8, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${INK}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: INK, padding: "14px 16px 10px" }}>
            <span style={{ fontFamily: PX, fontSize: 16, color: "#FFF" }}>MONATSENDE</span>
            <span style={{ fontFamily: PX, fontSize: 14, color: INK, background: GOLD, padding: "8px 10px 4px" }}>UBER ONE 4,99 €</span>
          </div>
          <div style={{ display: "flex", gap: 22, padding: 20, alignItems: "center" }}>
            <Sprite rows={CAL.rows} pal={CAL.pal} px={12} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 62px)", gap: 10 }}>
              {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ height: 62, border: `4px solid ${INK}`, background: i < orders ? "#FFF3D0" : "#F2F0EA", display: "flex", alignItems: "center", justifyContent: "center" }}>{i < orders ? <Sprite rows={PIZZA.rows} pal={PIZZA.pal} px={3} /> : null}</div>)}
            </div>
          </div>
          <div style={{ fontFamily: PX, fontSize: 15, color: "#8A857A", padding: "0 20px 16px" }}>BESTELLUNGEN: {orders}</div>
          {verdict ? <Stamp t={t} a={A.lohnt - 0.1} text="LOHNT SICH? JA / NEIN" bg={GOLD} size={22} rot={-4} style={{ left: 40, bottom: -50 }} /> : null}
        </div>
      ) : null}
      {/* comment field: PIZZA typed + sent */}
      {t > dS ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: 150 + fl * 0.3, zIndex: 9, ...popStyle(t, dS, 20, 0.6) }}>
          <div style={{ fontFamily: PX, fontSize: 18, color: INK, marginBottom: 16 }}>KOMMENTARE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "16px 18px" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}`, flexShrink: 0 }} />
            <div style={{ flex: 1, fontFamily: PX, fontSize: 30, color: INK }}>{sent ? "" : word}{!sent && blink ? "▌" : ""}{sent ? <span style={{ color: "#B0AA9E", fontSize: 18 }}>KOMMENTAR …</span> : null}</div>
            <div style={{ fontFamily: PX, fontSize: 16, color: "#FFF", background: word.length === 5 ? BLUE : "#9AA3AD", padding: "12px 12px 8px", transform: `scale(${1 - 0.15 * Math.max(0, 1 - Math.abs(t - A.pizza - 0.25) / 0.1)})` }}>POSTEN</div>
          </div>
          {sent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, ...popStyle(t, A.pizza + 0.3, 12, 0.6) }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: GREEN, border: `4px solid ${INK}` }} />
              <div style={{ fontFamily: PX, fontSize: 24, color: INK, background: "#FFF", border: `5px solid ${INK}`, padding: "14px 16px 8px" }}>PIZZA</div>
              <div style={{ fontFamily: PX, fontSize: 14, color: GREEN }}>✓ GEPOSTET</div>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* DM with the PDF */}
      {t > dmA ? (
        <div style={{ position: "absolute", left: 340, right: 40, top: lerp(t, dmA, dmA + 0.35, 980, 470) + fl * 0.5, zIndex: 10, background: "#FFF", border: `6px solid ${INK}`, boxShadow: `10px 10px 0 ${GOLD}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: INK, padding: "12px 16px" }}>
            <i style={{ width: 14, height: 14, borderRadius: "50%", background: GOLD, display: "block" }} />
            <span style={{ fontFamily: SM, fontWeight: 700, fontSize: 24, color: "#FFF" }}>Florent GPT</span>
            <span style={{ marginLeft: "auto", fontFamily: PX, fontSize: 12, color: GOLD }}>NEUE NACHRICHT</span>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", padding: 18 }}>
            <div style={{ width: 92, border: `4px solid ${INK}`, lineHeight: 0, flexShrink: 0, transform: `rotate(${Math.sin(t * 3) * 3}deg)` }}><Img src={PAGE(1)} style={{ width: "100%" }} /></div>
            <div style={{ fontFamily: PX, lineHeight: 1.5 }}>
              <div style={{ fontSize: 18, color: INK }}>PIZZA-GUIDE.PDF</div>
              <div style={{ fontSize: 13, color: "#8A857A", marginTop: 6 }}>ENDPREIS + UBER ONE</div>
              <div style={{ display: "inline-block", fontSize: 14, color: INK, background: GOLD, border: `4px solid ${INK}`, padding: "8px 10px 4px", marginTop: 10, transform: `scale(${1 + 0.06 * Math.abs(Math.sin(t * 5))})` }}>ÖFFNEN</div>
            </div>
          </div>
          {spark(t, dmA + 0.35, 350, 120, 10, 40, 170)}
        </div>
      ) : null}
      {t > A.schreib - 0.1 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 745, display: "flex", justifyContent: "center", zIndex: 11, ...popStyle(t, A.schreib - 0.1, 10, 0.7) }}>
          <div style={{ fontFamily: SM, fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", color: "#FFF", background: INK, borderRadius: 999, padding: "12px 32px", transform: `scale(${1 + 0.03 * Math.sin(t * 6)})` }}>SCHREIB <span style={{ color: GOLD }}>„PIZZA“</span></div>
        </div>
      ) : null}
    </>
  );
};

// ---------- scene table ----------
type Scene = { from: number; to: number; El?: React.FC<{ t: number }>; pill?: string; tag?: [number, string]; bg?: string };
const SCENES: Scene[] = [
  { from: 0, to: A.erst - 0.1, El: SceneHook, pill: "Deine Pizza", bg: PLATE_BG.room },
  { from: A.erst - 0.1, to: A.heisst - 0.05, El: SceneDrip, pill: "An der Kasse", bg: PLATE_BG.room },
  { from: A.heisst - 0.05, to: A.forscher - 0.1, El: SceneTerm, pill: "Verhaltensökonomie", bg: PLATE_BG.dark },
  { from: A.forscher - 0.1, to: A.find - 0.1, El: SceneStudy, pill: "Die Studie", bg: PLATE_BG.desk },
  { from: A.find - 0.1, to: A.morgen - 0.2, El: SceneFair, pill: "Meine Meinung", bg: PLATE_BG.map },
  { from: A.morgen - 0.2, to: A.damit - 0.1 },
  { from: A.damit - 0.1, to: 999, El: SceneOutro, pill: "Gegenmittel #3", bg: "#FFF6D6" },
];

// ---------- captions: Space Mono pill on the seam, key word in a gold block ----------
const KEY = new Set(["pizza", "billig", "liefergebühr", "servicegebühr", "paypal", "drip", "pricing", "tropft", "drin", "teuer", "ticketseite", "millionen", "fünftel", "fair", "kochen", "chatgpt", "endpreis", "monatsende", "uber"]);
const norm = (s: string) => s.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
const SHOW: Record<string, string> = { neun: "9", vierzehn: "14", fünf: "5" };
const show = (w: string) => { const n = norm(w); return SHOW[n] ?? w.replace(/[.,!?:]/g, ""); };
type Chunk = { start: number; end: number; words: string[] };
const makeChunks = (caps: Cap[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Cap[] = [];
  const flush = () => { if (cur.length) out.push({ start: cur[0].startMs / 1000, end: cur[cur.length - 1].endMs / 1000, words: cur.map((c) => show(c.text)) }); cur = []; };
  for (const c of caps) {
    const len = cur.map((x) => x.text).join(" ").length + c.text.length + 1;
    if (cur.length >= 3 || (cur.length >= 2 && len > 17) || (cur.length && len > 20)) flush();
    cur.push(c);
    if (/[.,!?:]$/.test(c.text)) flush();
  }
  flush();
  return out.map((c, i) => ({ ...c, end: i + 1 < out.length ? Math.min(out[i + 1].start, c.end + 0.6) : c.end + 0.5 }));
};
const Caption: React.FC<{ t: number; y: number; chunks: Chunk[] }> = ({ t, y, chunks }) => {
  const c = chunks.find((x) => t >= x.start - 0.04 && t < x.end);
  if (!c) return null;
  const p = pop(t, c.start - 0.04, 0.18);
  const keyIdx = c.words.findIndex((w) => KEY.has(norm(w)) || /^[\d.]+$/.test(w) || /^\d/.test(w));
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
const SPLIT_SRC_TOP = 860, SPLIT_SCALE = 1.0, FOCUS_X = 0.448;

export const DripPixel: React.FC = () => {
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
        <OffthreadVideo src={staticFile("render-gpts-drip-pizza-tightened-skin.mp4")} style={{ width: "100%", height: "100%" }} />
      </div>
      {El ? (
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: PH, overflow: "hidden", background: sc.bg, boxShadow: "0 6px 18px rgba(0,0,0,0.25)" }}>
          <div style={{ position: "absolute", inset: -20, transform: `translate(${dx}px, ${dy}px) scale(${cam})`, transformOrigin: "50% 55%" }}>
            <div style={{ position: "absolute", left: 20, top: 20, width: W, height: PH }}><El t={t} /></div>
          </div>
          {sc.pill ? <Pill text={sc.pill} /> : null}
          {sc.tag ? <TopTag t={t} a={sc.tag[0]} text={sc.tag[1]} /> : null}
          <Dissolve t={t} a={sc.from} />
        </div>
      ) : null}
      <Caption t={t} y={face ? 1740 : PH} chunks={chunks} />
    </AbsoluteFill>
  );
};
