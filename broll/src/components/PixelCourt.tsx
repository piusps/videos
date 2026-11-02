import React from "react";
import { PIXEL } from "./OpusKit";

// Pixel courthouse plates for the opusjake look (same rect-plate technique as PixelTown).
// "land" = stern grey Landgericht under an overcast sky, "amts" = warm sandstone Amtsgericht in the sun.
// No text inside the plates: the frieze sign is drawn by <FriezeSign> on top. Card plate 180 x 88 cells,
// portrait plaza 216 x 384 cells.

type R = [number, number, number, number, string];
type Tone = "land" | "amts";
const rnd = (i: number, salt = 1) => { const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return x - Math.floor(x); };
const pick = <T,>(arr: T[], i: number, salt = 1) => arr[Math.floor(rnd(i, salt) * arr.length) % arr.length];

const Plate: React.FC<{ w: number; h: number; cell: number; rects: R[]; style?: React.CSSProperties }> = ({ w, h, cell, rects, style }) => (
  <svg width={w * cell} height={h * cell} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{ display: "block", ...style }}>
    {rects.map(([x, y, rw, rh, f], i) => <rect key={i} x={x} y={y} width={rw + 0.02} height={rh + 0.02} fill={f} />)}
  </svg>
);

const PAL = {
  land: { sky: "#B7C4CE", sky2: "#A7B6C2", cloud: "#D9E0E6", stone: "#C9C3B8", stoneD: "#A9A296", stoneL: "#DDD8CF", wall: "#8F887C", door: "#3B2A22", doorL: "#4E382C", glass: "#6F8592", step: ["#BDB6AA", "#B1AA9D", "#A59E91", "#99927F"], ground: "#9C9688", cob: ["#B2AC9F", "#A8A294", "#BBB5A8", "#A39D8F"], hedge: "#4D6B48", hedgeL: "#5F7F58" },
  amts: { sky: "#A9DCF0", sky2: "#94D0EA", cloud: "#FFFFFF", stone: "#EFE3CC", stoneD: "#D6C4A8", stoneL: "#FBF4E6", wall: "#CDB48E", door: "#6B3A20", doorL: "#8A5030", glass: "#A9CFE0", step: ["#E2D3B8", "#D6C4A8", "#C9B48F", "#BBA587"], ground: "#B9A58A", cob: ["#CDB99C", "#C3AE90", "#D6C4A8", "#BBA587"], hedge: "#3F7A3A", hedgeL: "#5DA052" },
};

const cobbles = (o: R[], x: number, y: number, w: number, h: number, seed: number, p: typeof PAL.land) => {
  o.push([x, y, w, h, p.ground]);
  for (let row = 0; row * 3 < h; row++) {
    let cx = x - (row % 2) * 2;
    let i = 0;
    while (cx < x + w) {
      const sw = 3 + Math.floor(rnd(i + row * 31, seed) * 3);
      o.push([Math.max(x, cx), y + row * 3, Math.min(sw - 1, x + w - Math.max(x, cx)), 2, pick(p.cob, i + row * 17, seed + 1)]);
      cx += sw;
      i++;
    }
  }
};
const lantern = (o: R[], x: number, y: number, s = 1) => {
  o.push([x + s, y + 3 * s, s, 14 * s, "#2C2420"], [x, y + 2 * s, 3 * s, s, "#2C2420"], [x, y - 2 * s, 3 * s, 4 * s, "#FFD87A"], [x, y - 2 * s, s, 4 * s, "#F2B544"], [x, y - 3 * s, 3 * s, s, "#2C2420"], [x - s, y + 17 * s, 5 * s, s, "#2C2420"]);
};
const tree = (o: R[], x: number, y: number, s = 1) => {
  o.push([x + 6 * s, y + 14 * s, 4 * s, 12 * s, "#6B4226"]);
  [[0, 6, 16, 10], [2, 2, 12, 6], [4, 0, 8, 3], [1, 14, 14, 3]].forEach(([dx, dy, w, h]) => o.push([x + dx * s, y + dy * s, w * s, h * s, "#3F7A3A"]));
  for (let i = 0; i < 9; i++) o.push([x + (2 + Math.floor(rnd(i, x) * 12)) * s, y + (2 + Math.floor(rnd(i, y) * 12)) * s, 2 * s, 2 * s, "#5DA052"]);
};
const flag = (o: R[], x: number, y: number) => {
  o.push([x, y, 1, 14, "#4A4038"], [x + 1, y + 1, 9, 2, "#1E1E1E"], [x + 1, y + 3, 9, 2, "#D2312B"], [x + 1, y + 5, 9, 2, "#F2C230"]);
};

// the temple front: pediment, frieze (sign area), columns, door, steps
const temple = (o: R[], p: typeof PAL.land, x0: number, w: number, top: number, colH: number, nCols: number, stepRows: number) => {
  const cx = x0 + w / 2;
  const pedH = Math.round(w * 0.16);
  // pediment (stepped triangle) + cornice
  for (let r = 0; r < pedH; r++) {
    const hw = Math.round(((r + 1) / pedH) * (w / 2 + 2));
    o.push([cx - hw, top + r, hw * 2, 1, r === 0 ? p.stoneD : p.stone]);
    o.push([cx - hw, top + r, 2, 1, p.stoneD], [cx + hw - 2, top + r, 2, 1, p.stoneD]);
  }
  // tympanum shading + round window
  const ty = top + Math.round(pedH * 0.45);
  o.push([cx - 4, ty, 8, 4, p.stoneD], [cx - 3, ty + 1, 6, 2, p.glass]);
  o.push([x0 - 2, top + pedH, w + 4, 2, p.stoneD], [x0 - 3, top + pedH + 2, w + 6, 1, p.stoneL]);
  // frieze (sign sits here)
  const fz = top + pedH + 3;
  o.push([x0, fz, w, 9, p.stone], [x0, fz + 9, w, 1, p.stoneD], [x0 - 2, fz + 10, w + 4, 2, p.stoneL], [x0 - 2, fz + 12, w + 4, 1, p.stoneD]);
  for (let gx = x0 + 3; gx < x0 + w - 2; gx += 8) o.push([gx, fz + 1, 1, 7, p.stoneD]);
  // back wall
  const cy = fz + 13;
  o.push([x0 + 2, cy, w - 4, colH, p.wall]);
  for (let y = cy + 3; y < cy + colH; y += 4) o.push([x0 + 2, y, w - 4, 1, "rgba(0,0,0,0.06)"]);
  // door + windows between columns
  const dw = Math.round(w * 0.14), dh = Math.round(colH * 0.62);
  o.push([cx - dw / 2 - 2, cy + colH - dh - 3, dw + 4, dh + 3, p.stoneD], [cx - dw / 2, cy + colH - dh, dw, dh, p.door], [cx - dw / 2 + 1, cy + colH - dh + 1, dw / 2 - 1, dh - 1, p.doorL], [cx + 1, cy + colH - dh + 1, dw / 2 - 2, dh - 1, p.doorL]);
  o.push([cx - 2, cy + colH - dh / 2, 1, 2, "#E2B33C"], [cx + 1, cy + colH - dh / 2, 1, 2, "#E2B33C"]);
  // columns
  const gap = (w - 8) / (nCols - 1);
  const cw = Math.max(4, Math.round(w / (nCols * 3.2)));
  for (let i = 0; i < nCols; i++) {
    const x = Math.round(x0 + 4 + i * gap - cw / 2);
    if (i > 0) {
      const wx = Math.round(x0 + 4 + (i - 0.5) * gap);
      const mid = Math.abs(wx - cx) < dw;
      if (!mid) o.push([wx - 3, cy + 5, 6, Math.round(colH * 0.42), p.stoneD], [wx - 2, cy + 6, 4, Math.round(colH * 0.42) - 2, p.glass], [wx - 2, cy + 6, 4, 2, "rgba(255,255,255,0.35)"]);
    }
    o.push([x - 1, cy, cw + 2, 2, p.stoneL], [x - 1, cy + 2, cw + 2, 1, p.stoneD]);
    o.push([x, cy + 3, cw, colH - 6, p.stoneL]);
    for (let f = 1; f < cw; f += 2) o.push([x + f, cy + 3, 1, colH - 6, p.stone]);
    o.push([x + cw - 1, cy + 3, 1, colH - 6, p.stoneD]);
    o.push([x - 1, cy + colH - 3, cw + 2, 1, p.stoneD], [x - 2, cy + colH - 2, cw + 4, 2, p.stoneL]);
  }
  // steps
  const sy = cy + colH;
  for (let s = 0; s < stepRows; s++) {
    const ext = 2 + s * 3;
    o.push([x0 - ext, sy + s * 3, w + ext * 2, 3, p.step[s % p.step.length]], [x0 - ext, sy + s * 3, w + ext * 2, 1, "rgba(255,255,255,0.18)"]);
  }
  return { frieze: { x: x0, y: fz, w, h: 9 }, stepsY: sy, groundY: sy + stepRows * 3, cx };
};

// ---------- card plate 180 x 88 ----------
export const COURT_CARD_SIGN = { x: 42, y: 24, w: 96, h: 9, groundY: 75 };
export const CourthousePlate: React.FC<{ cell: number; tone: Tone; t?: number; style?: React.CSSProperties }> = ({ cell, tone, t = 0, style }) => {
  const p = PAL[tone];
  const o: R[] = [];
  o.push([0, 0, 180, 74, p.sky], [0, 0, 180, 6, p.sky2]);
  [[16, 8], [128, 4], [160, 14]].forEach(([cx, cy], i) => { const x = ((cx + t * (1.2 + i * 0.6)) % 220) - 20; o.push([x, cy, 18, 3, p.cloud], [x + 4, cy - 2, 9, 2, p.cloud]); });
  if (tone === "amts") { tree(o, 2, 40); tree(o, 162, 40); tree(o, 18, 46); }
  else o.push([0, 56, 34, 18, p.hedge], [146, 56, 34, 18, p.hedge]);
  flag(o, 89, 0);
  const g = temple(o, p, 42, 96, 6, 26, 6, 4);
  lantern(o, 34, 50);
  lantern(o, 143, 50);
  o.push([0, g.groundY, 180, 1, "rgba(0,0,0,0.18)"]);
  cobbles(o, 0, g.groundY + 1, 180, 88 - g.groundY - 1, 41, p);
  return <Plate w={180} h={88} cell={cell} rects={o} style={style} />;
};

// ---------- portrait plaza 216 x 384 ----------
export const PLAZA_COURT = { signX: 16, signY: 68, signW: 184, signH: 9, stepsY: 173, groundY: 197 };
export const CourtPlazaPlate: React.FC<{ cell: number; tone: Tone; t?: number; style?: React.CSSProperties }> = ({ cell, tone, t = 0, style }) => {
  const p = PAL[tone];
  const o: R[] = [];
  o.push([0, 0, 216, 210, p.sky], [0, 0, 216, 14, p.sky2], [0, 14, 216, 8, tone === "land" ? "#AEBCC7" : "#A0D6EC"]);
  [[10, 16], [120, 8], [176, 30], [60, 36]].forEach(([cx, cy], i) => { const x = ((cx + t * (1.5 + i * 0.5)) % 260) - 30; o.push([x, cy, 26, 4, p.cloud], [x + 5, cy - 3, 14, 3, p.cloud]); });
  flag(o, 107, 22);
  const g = temple(o, p, 16, 184, 36, 92, 7, 8);
  if (tone === "amts") { tree(o, -4, 160, 1); tree(o, 204, 160, 1); }
  o.push([0, g.groundY, 216, 2, "rgba(0,0,0,0.18)"]);
  cobbles(o, 0, g.groundY + 2, 216, 384 - g.groundY - 2, 77, p);
  // plaza details: lanterns, benches, planters
  lantern(o, 6, 196, 2);
  lantern(o, 204, 196, 2);
  [[14, 300], [180, 330]].forEach(([bx, by]) => o.push([bx, by, 22, 3, "#8A5A34"], [bx, by - 3, 22, 2, "#A8743F"], [bx + 1, by + 3, 2, 4, "#5E3520"], [bx + 19, by + 3, 2, 4, "#5E3520"]));
  [[8, 250], [196, 262], [6, 352], [198, 366]].forEach(([px, py], i) => { o.push([px, py + 6, 12, 8, "#A4552F"], [px, py + 6, 12, 1, "#C8703F"]); for (let j = 0; j < 12; j += 2) o.push([px + j, py + 2 + (j % 4 ? 1 : 0), 2, 4, i % 2 ? p.hedge : p.hedgeL]); });
  return <Plate w={216} h={384} cell={cell} rects={o} style={style} />;
};

// frieze sign: pixel lettering in the stone band (absolute, in px)
export const FriezeSign: React.FC<{ text: string; x: number; y: number; w: number; h: number; color?: string; glow?: number }> = ({ text, x, y, w, h, color = "#3A332B", glow = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PIXEL, fontSize: h * 0.62, letterSpacing: "0.08em", color, textShadow: glow > 0 ? `0 0 ${18 * glow}px rgba(255,214,120,${0.9 * glow})` : "none", whiteSpace: "nowrap" }}>{text}</div>
);

// brass rope post (sprite rows)
export const POST = {
  rows: ["..YY..", ".YWYY.", ".YYYD.", "..YD..", "..YD..", "..YD..", "..YD..", "..YD..", "..YD..", "..YD..", "..YD..", ".YYYD.", "YYYYDD", "DDDDDD"],
  pal: { Y: "#E2B33C", W: "#FFF1C2", D: "#A97E1F" },
};

// velvet rope between two posts, drawn as pixel cells along a sagging curve.
// open 0..1: the left hook drops and the rope swings down to hang off the right post.
export const PixelRope: React.FC<{ x1: number; x2: number; y: number; px: number; sag?: number; open?: number; sign?: string; signSize?: number }> = ({ x1, x2, y, px, sag = 34, open = 0, sign, signSize = 22 }) => {
  const N = Math.round((x2 - x1) / px);
  const lx = x1 + (x2 - px * 3 - x1) * open, ly = y + (px * 26) * open;
  const s = sag * (1 - open * 0.7);
  const pts = Array.from({ length: N + 1 }, (_, i) => {
    const u = i / N;
    return { x: lx + (x2 - lx) * u, y: ly + (y - ly) * u + Math.sin(Math.PI * u) * s };
  });
  const mid = pts[Math.round(N / 2)];
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        {pts.map((q, i) => <rect key={i} x={Math.round(q.x / px) * px} y={Math.round(q.y / px) * px} width={px * 1.02} height={px * 2.02} fill={i % 3 === 0 ? "#8E1E25" : "#B0252E"} />)}
      </svg>
      {sign ? (
        <div style={{ position: "absolute", left: mid.x, top: mid.y + px, transform: `translateX(-50%) rotate(${-open * 38}deg) translateY(${open * 40}px)`, transformOrigin: "50% 0%" }}>
          <div style={{ margin: "0 auto", width: 2 * px, height: 3 * px, background: "#E2B33C" }} />
          <div style={{ fontFamily: PIXEL, fontSize: signSize, color: "#FFF1C2", background: "#7A1A20", border: `${px}px solid #E2B33C`, padding: `${signSize * 0.3}px ${signSize * 0.5}px`, whiteSpace: "nowrap", lineHeight: 1, boxShadow: `${px}px ${px}px 0 rgba(0,0,0,0.25)` }}>{sign}</div>
        </div>
      ) : null}
    </>
  );
};
