import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

// Sir Token HD: procedural pixel art (shaded coin, ridged rim, arms, walk cycle, blink, squat, hat tip),
// plus small pixel effects (coins, confetti, sparkles, ? block) for the Pixelwelt look (skill pixelwelt-look).
// Everything is drawn on integer grids with crispEdges so it stays real pixel art at any pose.

export type SirExpr = "normal" | "happy" | "shocked";
export type SirPose = { expr?: SirExpr; blink?: boolean; walk?: 0 | 1 | null; squat?: number; armL?: number; armR?: number; hatLift?: number };
export const SIR_W = 46;
export const SIR_H = 50;
const SY0 = 4; // headroom for the hat tip

const C = {
  K: "#3E2604", face: "#F6C232", faceL: "#FCD24A", faceLL: "#FFE58A", faceD: "#DE9E1A", shine: "#FFF7D6",
  hat: "#1A1A22", hatL: "#3A3A56", hatD: "#0C0C12", brimL: "#2A2A3C", band: "#E0A526", bandD: "#B88418",
  white: "#FFFFFF", pupil: "#15110C", brow: "#3B220C", mono: "#DDF1F8", monoD: "#86AFC0", chain: "#F1D67B",
  must: "#3B220C", mustL: "#6A4420", mouth: "#3B1208", tongue: "#E8505B", blush: "#F59A6A",
  shoe: "#121214", shoeL: "#3A3A48", glove: "#FFFFFF", gloveD: "#C9D2DE",
};

export function sirTokenGrid(p: SirPose): Map<string, string> {
  const g = new Map<string, string>();
  const set = (x: number, y: number, c: string) => { if (x >= 0 && x < SIR_W && y >= 0 && y < SIR_H) g.set(`${x},${y}`, c); };
  const has = (x: number, y: number) => g.has(`${x},${y}`);
  const oy = SY0 + Math.round(p.squat ?? 0);
  const cx = 23, cy = 25 + oy, R = 14;
  const expr = p.expr ?? "normal";

  // legs + shoes; the walk cycle swaps which foot is forward and lifted
  const w = p.walk ?? null;
  const ld = w === 0 ? -1 : w === 1 ? 1 : 0;
  const legTop = 38 + oy, footY = SIR_H - 2;
  for (let y = legTop; y < footY; y++) {
    const low = y > (legTop + footY) / 2 ? 1 : 0;
    const splay = p.squat ? 1 : 0;
    for (const x of [18, 19]) set(x + ld * low - splay * low, y, C.K);
    for (const x of [27, 28]) set(x - ld * low + splay * low, y, C.K);
  }
  const shoe = (x0: number, lift: number) => {
    for (let x = x0; x < x0 + 5; x++) { set(x, footY - lift, x === x0 + 1 ? C.shoeL : C.shoe); set(x, footY + 1 - lift, C.shoe); }
  };
  shoe(15 + ld - (p.squat ? 1 : 0), w === 1 ? 1 : 0);
  shoe(27 - ld + (p.squat ? 1 : 0), w === 0 ? 1 : 0);

  // arms: 0° hangs down, 90° points straight out, 180° straight up
  const gloves: [number, number][] = [];
  const arm = (sx: number, sy: number, deg: number, side: -1 | 1) => {
    const a = (deg * Math.PI) / 180, dx = side * Math.sin(a), dy = Math.cos(a);
    let ex = sx, ey = sy;
    for (let i = 1; i <= 7; i++) { ex = Math.round(sx + dx * i); ey = Math.round(sy + dy * i); set(ex, ey, C.K); }
    gloves.push([ex, ey]);
  };
  arm(9, cy + 2, p.armL ?? 25, -1);
  arm(36, cy + 2, p.armR ?? 25, 1);

  // coin: outline, ridged rim, inner ring, face lit from the top-left
  for (let y = cy - R - 1; y <= cy + R + 1; y++) for (let x = cx - R - 1; x <= cx + R + 1; x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy);
    if (d > 14.2) continue;
    const light = -(dx + dy) / (R * 1.414);
    if (d > 13.1) set(x, y, C.K);
    else if (d > 11.5) {
      const k = Math.floor(((Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) * 44) % 2;
      set(x, y, light > 0.3 ? (k ? "#E3A928" : "#D29618") : light < -0.35 ? (k ? "#A86D06" : "#946004") : (k ? "#C98A12" : "#B57A0A"));
    } else if (d > 10.6) set(x, y, light > 0.2 ? "#F2BD3A" : "#D9981A");
    else set(x, y, light > 0.5 ? C.faceLL : light > 0.15 ? C.faceL : light < -0.45 ? C.faceD : C.face);
  }
  for (const [x, y] of [[17, 16], [18, 15], [19, 15], [16, 17]]) set(x, y + oy, C.shine);

  // eyes + brows
  const eye = (x0: number) => {
    if (p.blink && expr === "normal") { for (let x = x0; x < x0 + 3; x++) set(x, 21 + oy, C.pupil); return; }
    if (expr === "happy") { set(x0, 22 + oy, C.pupil); set(x0 + 1, 21 + oy, C.pupil); set(x0 + 2, 22 + oy, C.pupil); return; }
    const top = expr === "shocked" ? 19 : 20;
    for (let y = top; y <= 22; y++) for (let x = x0; x < x0 + 3; x++) set(x, y + oy, C.white);
    if (expr === "shocked") set(x0 + 1, 21 + oy, C.pupil);
    else for (const [ex, ey] of [[1, 21], [2, 21], [1, 22], [2, 22]]) set(x0 + ex, ey + oy, C.pupil);
  };
  eye(16); eye(27);
  const browY = (expr === "normal" ? 18 : 17) + oy;
  for (const x0 of [16, 27]) for (let x = x0; x < x0 + 3; x++) set(x, browY, C.brow);

  // monocle ring around the right eye + gold chain
  for (let y = 17; y <= 26; y++) for (let x = 24; x <= 33; x++) {
    const d = Math.hypot(x + 0.5 - 28.5, y + 0.5 - 21.5);
    if (d >= 2.4 && d < 3.3) set(x, y + oy, y > 21 ? C.monoD : C.mono);
  }
  for (const [x, y] of [[31, 24], [32, 25], [32, 26], [33, 27], [33, 28], [33, 29]]) set(x, y + oy, C.chain);

  // handlebar moustache
  for (let x = 20; x <= 25; x++) set(x, 25 + oy, C.mustL);
  for (let x = 17; x <= 28; x++) set(x, 26 + oy, C.must);
  for (const x of [15, 16, 17, 18, 27, 28, 29, 30]) set(x, 27 + oy, C.must);
  set(14, 26 + oy, C.must); set(31, 26 + oy, C.must);

  // mouth + blush
  if (expr === "happy") {
    for (let y = 29; y <= 30; y++) for (let x = 20; x <= 25; x++) set(x, y + oy, C.mouth);
    set(22, 30 + oy, C.tongue); set(23, 30 + oy, C.tongue);
    for (const x of [12, 13, 32, 33]) set(x, 28 + oy, C.blush);
  } else if (expr === "shocked") {
    for (let y = 29; y <= 31; y++) for (let x = 22; x <= 23; x++) set(x, y + oy, C.mouth);
    set(21, 30 + oy, C.mouth); set(24, 30 + oy, C.mouth);
  } else {
    for (let x = 21; x <= 24; x++) set(x, 29 + oy, C.mouth);
    set(20, 28 + oy, C.mouth); set(25, 28 + oy, C.mouth);
  }

  // top hat; hatLift raises it for a hat tip
  const hy = oy - Math.round(p.hatLift ?? 0);
  for (let y = 0; y <= 9; y++) for (let x = 16; x <= 29; x++) {
    const c = y === 7 ? C.band : y === 8 ? C.bandD : x === 17 && y >= 1 && y <= 6 ? C.hatL : x === 29 ? C.hatD : C.hat;
    set(x, y + hy, c);
  }
  for (let x = 11; x <= 34; x++) { set(x, 10 + hy, C.brimL); set(x, 11 + hy, C.hatD); }

  // gloves on top of everything, outlined only where they stick out
  for (const [gx, gy] of gloves) {
    for (let y = gy - 2; y <= gy + 2; y++) for (let x = gx - 2; x <= gx + 2; x++) if (!has(x, y)) set(x, y, C.K);
    for (let y = gy - 1; y <= gy + 1; y++) for (let x = gx - 1; x <= gx + 1; x++) set(x, y, y === gy + 1 || x === gx + 1 ? C.gloveD : C.glove);
  }
  return g;
}

/** merges a grid into horizontal runs → few rects per frame */
const gridRects = (g: Map<string, string>, w: number, h: number) => {
  const out: { x: number; y: number; w: number; c: string }[] = [];
  for (let y = 0; y < h; y++) {
    let x = 0;
    while (x < w) {
      const c = g.get(`${x},${y}`);
      if (!c) { x++; continue; }
      let e = x + 1;
      while (e < w && g.get(`${e},${y}`) === c) e++;
      out.push({ x, y, w: e - x, c });
      x = e;
    }
  }
  return out;
};

export const SirTokenHD: React.FC<{
  x: number; floorY: number; px?: number; pose: SirPose; lift?: number; flip?: boolean; sx?: number; sy?: number; rim?: string; reflection?: boolean;
}> = ({ x, floorY, px = 7, pose, lift = 0, flip, sx = 1, sy = 1, rim = "rgba(255,150,90,.65)", reflection = true }) => {
  const key = JSON.stringify(pose);
  const rects = React.useMemo(() => gridRects(sirTokenGrid(pose), SIR_W, SIR_H), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const w = SIR_W * px, h = SIR_H * px;
  const svg = (
    <svg width={w} height={h} viewBox={`0 0 ${SIR_W} ${SIR_H}`} shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>
      {rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w + 0.02} height={1.02} fill={r.c} />)}
    </svg>
  );
  const sh = Math.max(0.35, 1 - lift / 400);
  const tf = `scale(${(flip ? -1 : 1) * sx}, ${sy})`;
  return (
    <>
      <div style={{ position: "absolute", left: x - (w * 0.34 * sh), top: floorY - 14 * sh, width: w * 0.68 * sh, height: 28 * sh, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.6), rgba(0,0,0,0))" }} />
      {reflection && (
        <div style={{ position: "absolute", left: x - w / 2, top: floorY + lift, width: w, height: h, transform: `scaleY(-1) ${tf}`, transformOrigin: "50% 50%", opacity: 0.18, WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%)", maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 45%)" }}>{svg}</div>
      )}
      <div style={{ position: "absolute", left: x - w / 2, top: floorY - h - lift, width: w, height: h, transform: tf, transformOrigin: "50% 100%", filter: `drop-shadow(-${px * 0.6}px -${px * 0.4}px 0 ${rim}) drop-shadow(0 0 26px rgba(255,180,70,.28))` }}>{svg}</div>
    </>
  );
};

// ---------- small pixel effects ----------
const PxArt: React.FC<{ rows: string[]; pal: Record<string, string>; px: number; style?: React.CSSProperties }> = ({ rows, pal, px, style }) => {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg width={w * px} height={rows.length * px} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" style={{ display: "block", ...style }}>
      {rows.flatMap((r, y) => [...r].map((c, x) => (pal[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={pal[c]} /> : null)))}
    </svg>
  );
};
export { PxArt };

const COIN_ROWS = ["..KKKK..", ".KYYYYK.", "KYWYYyYK", "KYWYYyYK", "KYWYYyYK", "KYWYYyYK", "KYYYYyYK", ".KYYYYK.", "..KKKK.."];
const COIN_PAL = { K: "#5A3A06", Y: "#F6C02E", y: "#D99A12", W: "#FFF3B0" };
/** spinning pixel coin, centre at x/y */
export const PixelCoin: React.FC<{ x: number; y: number; px?: number; phase?: number; opacity?: number; scale?: number }> = ({ x, y, px = 7, phase = 0, opacity = 1, scale = 1 }) => {
  const f = useCurrentFrame();
  const s = Math.max(0.18, Math.abs(Math.cos(f / 5 + phase)));
  return (
    <div style={{ position: "absolute", left: x - 4 * px, top: y - 4.5 * px, transform: `scale(${s * scale}, ${scale})`, opacity, filter: "drop-shadow(0 0 10px rgba(255,200,60,.55))" }}>
      <PxArt rows={COIN_ROWS} pal={COIN_PAL} px={px} />
    </div>
  );
};

const rnd = (i: number) => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };

/** coins exploding from a point with gravity */
export const CoinBurst: React.FC<{ at: number; x: number; y: number; n?: number; power?: number; seed?: number }> = ({ at, x, y, n = 14, power = 1, seed = 1 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps - at;
  if (t < 0 || t > 2.2) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = -Math.PI / 2 + (rnd(i + seed * 50) - 0.5) * 2.4;
        const v = (700 + rnd(i * 3 + seed) * 900) * power;
        const px = x + Math.cos(a) * v * t, py = y + Math.sin(a) * v * t + 1600 * t * t;
        return <PixelCoin key={i} x={px} y={py} px={6} phase={i} opacity={Math.min(1, (2.2 - t) * 2)} />;
      })}
    </>
  );
};

const CONF = ["#FF8A4C", "#5FD3E0", "#F6C02E", "#2FBF71", "#FF5FA2", "#FFFFFF"];
/** pixel confetti burst */
export const Confetti: React.FC<{ at: number; x: number; y: number; n?: number; spread?: number; seed?: number }> = ({ at, x, y, n = 40, spread = 1, seed = 3 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps - at;
  if (t < 0 || t > 2.6) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = -Math.PI / 2 + (rnd(i + seed * 77) - 0.5) * 2.8 * spread;
        const v = 600 + rnd(i * 7 + seed) * 1100;
        const drag = Math.min(t, 0.5) + Math.max(0, t - 0.5) * 0.35;
        const px = x + Math.cos(a) * v * drag + Math.sin(t * 6 + i) * 20, py = y + Math.sin(a) * v * drag + 520 * t * t;
        const s = 10 + rnd(i * 11) * 10;
        return <div key={i} style={{ position: "absolute", left: px, top: py, width: s, height: s * 0.6, background: CONF[i % CONF.length], transform: `rotate(${t * 600 * (rnd(i) - 0.5)}deg) scaleY(${Math.cos(t * 9 + i)})`, opacity: Math.min(1, (2.6 - t) * 2) }} />;
      })}
    </>
  );
};

/** twinkling 4-point pixel star */
export const Sparkle: React.FC<{ x: number; y: number; at: number; size?: number; color?: string; dur?: number }> = ({ x, y, at, size = 6, color = "#FFF6C8", dur = 0.6 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = (f / fps - at) / dur;
  if (t < 0 || t > 1) return null;
  const s = Math.sin(t * Math.PI);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, filter: `drop-shadow(0 0 8px ${color})` }}>
      <PxArt rows={["..X..", "..X..", "XXWXX", "..X..", "..X.."]} pal={{ X: color, W: "#FFFFFF" }} px={size} />
    </div>
  );
};

const Q_ROWS = [".XXX.", "X...X", "....X", "...X.", "..X..", "..X..", ".....", "..X.."];
/** Mario-style ? block; bumps up when hit and turns into a used block */
export const QBlock: React.FC<{ x: number; y: number; hit: number; size?: number }> = ({ x, y, hit, size = 98 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const t = f / fps;
  const dt = t - hit;
  const bump = dt >= 0 && dt < 0.18 ? -26 * Math.sin((dt / 0.18) * Math.PI) : 0;
  const used = dt >= 0;
  const glow = 0.75 + 0.25 * Math.sin(t * 5 + x);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y + bump, width: size, height: size, background: used ? "#8A5A2B" : "#F2B632", border: `7px solid ${used ? "#4A2E14" : "#9A5B12"}`, boxShadow: `inset -7px -7px 0 ${used ? "#6A4220" : "#D08A1A"}, inset 7px 7px 0 ${used ? "#A87444" : "#FFD877"}, 0 10px 0 rgba(0,0,0,.35)${used ? "" : `, 0 0 ${30 * glow}px rgba(255,200,60,.45)`}`, imageRendering: "pixelated" }}>
      {[[6, 6], [size - 20, 6], [6, size - 20], [size - 20, size - 20]].map(([l, tp], i) => <div key={i} style={{ position: "absolute", left: l - 7, top: tp - 7, width: 7, height: 7, background: used ? "#4A2E14" : "#9A5B12" }} />)}
      {!used && (
        <div style={{ position: "absolute", left: (size - 14 - 45) / 2, top: (size - 14 - 72) / 2, opacity: glow }}>
          <PxArt rows={Q_ROWS} pal={{ X: "#FFFFFF" }} px={9} style={{ filter: "drop-shadow(4px 4px 0 #9A5B12)" }} />
        </div>
      )}
    </div>
  );
};

// Sir Token as a die-cut sticker (thick white outline + drop shadow), like the claudebyseb 2D scenes.
export const DieCutSir: React.FC<{ x: number; floorY: number; px?: number; pose: SirPose; lift?: number; flip?: boolean; sx?: number; sy?: number; rot?: number }> = ({ x, floorY, px = 7, pose, lift = 0, flip, sx = 1, sy = 1, rot = 0 }) => {
  const key = JSON.stringify(pose);
  const rects = React.useMemo(() => gridRects(sirTokenGrid(pose), SIR_W, SIR_H), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const w = SIR_W * px, h = SIR_H * px, o = Math.max(4, px * 0.8);
  const sh = Math.max(0.35, 1 - lift / 400);
  return (
    <>
      <div style={{ position: "absolute", left: x - w * 0.36 * sh, top: floorY - 12 * sh, width: w * 0.72 * sh, height: 26 * sh, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.55), rgba(0,0,0,0))" }} />
      <div style={{ position: "absolute", left: x - w / 2, top: floorY - h - lift, width: w, height: h, transform: `scale(${(flip ? -1 : 1) * sx}, ${sy}) rotate(${rot}deg)`, transformOrigin: "50% 100%",
        filter: `drop-shadow(${o}px 0 0 #fff) drop-shadow(-${o}px 0 0 #fff) drop-shadow(0 ${o}px 0 #fff) drop-shadow(0 -${o}px 0 #fff) drop-shadow(0 ${o * 1.6}px 0 rgba(0,0,0,.35))` }}>
        <svg width={w} height={h} viewBox={`0 0 ${SIR_W} ${SIR_H}`} shapeRendering="crispEdges" style={{ display: "block", overflow: "visible" }}>
          {rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w + 0.02} height={1.02} fill={r.c} />)}
        </svg>
      </div>
    </>
  );
};
