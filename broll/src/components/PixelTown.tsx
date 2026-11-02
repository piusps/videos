import React from "react";

// Warm, detailed pixel-art plates in the style of @opusjake's reels (Stardew-like town, office, shop, landlord house),
// drawn as crisp SVG rects so every reel can animate on top of them. No characters, no text inside the plates:
// signs, labels and the PixelBot figures are layered on top by the composition.
// Card plates are 180 x 88 cells, the portrait plaza is 216 x 384 cells; size them with `cell` (px per cell).

type R = [number, number, number, number, string];
const rnd = (i: number, salt = 1) => { const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453; return x - Math.floor(x); };
const pick = <T,>(arr: T[], i: number, salt = 1) => arr[Math.floor(rnd(i, salt) * arr.length) % arr.length];

const Plate: React.FC<{ w: number; h: number; cell: number; rects: R[]; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, cell, rects, style, children }) => (
  <svg width={w * cell} height={h * cell} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" style={{ display: "block", ...style }}>
    {rects.map(([x, y, rw, rh, f], i) => <rect key={i} x={x} y={y} width={rw + 0.02} height={rh + 0.02} fill={f} />)}
    {children}
  </svg>
);

// ---------- shared pieces ----------
const books = (out: R[], x: number, y: number, w: number, h: number, seed: number) => {
  const cols = ["#8E2F2A", "#2F5D8E", "#3F7A3A", "#C9A227", "#6B3F7A", "#A0522D", "#1F4E5A", "#B8732E"];
  let cx = x;
  let i = 0;
  while (cx < x + w - 1) {
    const bw = 1 + Math.floor(rnd(i, seed) * 2);
    const bh = h - Math.floor(rnd(i, seed + 1) * 3);
    if (rnd(i, seed + 2) > 0.88) { cx += 1; i++; continue; }
    const c = pick(cols, i, seed + 3);
    out.push([cx, y + h - bh, bw, bh, c]);
    out.push([cx, y + h - bh + 1, bw, 1, "rgba(255,230,160,0.35)"]);
    cx += bw;
    i++;
  }
};
const plant = (out: R[], x: number, y: number, s = 1) => {
  out.push([x + 1, y + 6 * s, 6 * s, 4 * s, "#A4552F"], [x + 1, y + 6 * s, 6 * s, 1, "#C8703F"], [x + 2, y + 10 * s, 4 * s, 1, "#7A3E22"]);
  const leaves: [number, number][] = [[3, 0], [1, 1], [5, 1], [2, 2], [4, 2], [0, 3], [6, 3], [3, 3], [1, 4], [5, 4], [2, 5], [4, 5]];
  leaves.forEach(([lx, ly], i) => out.push([x + lx * s, y + ly * s, 2 * s, 2 * s, i % 3 ? "#4E9A47" : "#7CC36E"]));
};
const cobbles = (out: R[], x: number, y: number, w: number, h: number, seed: number, base = "#B9A58A") => {
  out.push([x, y, w, h, base]);
  for (let row = 0; row * 3 < h; row++) {
    let cx = x - (row % 2) * 2;
    let i = 0;
    while (cx < x + w) {
      const sw = 3 + Math.floor(rnd(i + row * 31, seed) * 3);
      const c = pick(["#CDB99C", "#C3AE90", "#D6C4A8", "#BBA587"], i + row * 17, seed + 1);
      out.push([Math.max(x, cx), y + row * 3, Math.min(sw - 1, x + w - Math.max(x, cx)), 2, c]);
      cx += sw;
      i++;
    }
  }
};
const bricks = (out: R[], x: number, y: number, w: number, h: number, seed: number) => {
  out.push([x, y, w, h, "#E2CBB0"]);
  for (let row = 0; row * 2 < h; row++) {
    for (let cx = x - (row % 2) * 2; cx < x + w; cx += 4) {
      const c = pick(["#B5654A", "#A9583F", "#BE7055", "#9E513A"], cx * 7 + row, seed);
      out.push([Math.max(x, cx), y + row * 2, Math.min(3, x + w - Math.max(x, cx)), 1, c]);
    }
  }
};
const lantern = (out: R[], x: number, y: number) => {
  out.push([x + 1, y, 1, 2, "#2C2420"], [x, y + 2, 3, 1, "#2C2420"], [x, y + 3, 3, 3, "#FFD87A"], [x, y + 3, 1, 3, "#F2B544"], [x, y + 6, 3, 1, "#2C2420"]);
};

// ---------- office (lawyer) ----------
export const OfficePlate: React.FC<{ cell: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ cell, style, children }) => {
  const o: R[] = [];
  o.push([0, 0, 180, 60, "#6E4027"]);
  for (let x = 0; x < 180; x += 6) o.push([x, 0, 1, 60, "#5E3520"], [x + 3, 0, 1, 60, "rgba(255,200,140,0.08)"]);
  o.push([0, 44, 180, 2, "#4A2A18"], [0, 46, 180, 14, "#5A331E"]);
  for (let x = 2; x < 180; x += 12) o.push([x, 48, 9, 10, "#66391F"], [x, 48, 9, 1, "#7A4A2A"]);
  // bookshelves
  [[4, 38], [140, 36]].forEach(([sx, sw], si) => {
    o.push([sx, 4, sw, 56, "#3E2414"]);
    for (let sy = 6; sy < 56; sy += 10) { books(o, sx + 2, sy, sw - 4, 8, sy + si * 50); o.push([sx + 1, sy + 8, sw - 2, 2, "#5A331E"]); }
  });
  // certificates + window
  [[52, 8], [112, 8]].forEach(([fx, fy]) => o.push([fx, fy, 16, 12, "#C9A227"], [fx + 1, fy + 1, 14, 10, "#F3E9D2"], [fx + 3, fy + 3, 10, 1, "#B8AE97"], [fx + 3, fy + 5, 8, 1, "#B8AE97"], [fx + 10, fy + 8, 3, 2, "#C0392B"]));
  o.push([76, 4, 28, 22, "#3E2414"], [78, 6, 24, 18, "#BFE3F2"], [78, 6, 24, 6, "#D8F0F8"], [89, 6, 2, 18, "#3E2414"], [78, 14, 24, 1, "#3E2414"]);
  // chair behind desk
  o.push([78, 26, 24, 22, "#7A2E22"], [80, 28, 20, 18, "#8E3A2C"], [82, 30, 2, 2, "#C9A227"], [96, 30, 2, 2, "#C9A227"], [89, 30, 2, 2, "#C9A227"]);
  // carpet + floor
  o.push([0, 60, 180, 28, "#5E3520"]);
  for (let x = 0; x < 180; x += 8) o.push([x, 60, 1, 28, "#4E2C1A"]);
  o.push([20, 66, 140, 22, "#8E2F2A"], [22, 68, 136, 18, "#A63A33"], [24, 70, 132, 1, "#C9A227"], [24, 84, 132, 1, "#C9A227"]);
  // desk
  o.push([54, 42, 72, 4, "#9A6236"], [54, 42, 72, 1, "#B57A48"], [56, 46, 68, 18, "#7A4A2A"], [60, 49, 26, 12, "#6A3F22"], [94, 49, 26, 12, "#6A3F22"], [72, 54, 2, 2, "#C9A227"], [106, 54, 2, 2, "#C9A227"]);
  // lamp, papers, plant
  o.push([62, 34, 10, 4, "#2E7D4F"], [63, 33, 8, 1, "#3E9A63"], [66, 38, 2, 4, "#C9A227"], [63, 41, 8, 1, "#C9A227"], [62, 38, 10, 1, "rgba(255,230,140,0.6)"]);
  o.push([104, 38, 12, 4, "#F3EFE6"], [105, 37, 12, 4, "#FFFFFF"], [106, 38, 8, 1, "#B8AE97"], [106, 40, 6, 1, "#B8AE97"]);
  plant(o, 166, 48, 1);
  plant(o, 2, 50, 1);
  // warm vignette
  o.push([0, 0, 180, 3, "rgba(0,0,0,0.15)"]);
  return <Plate w={180} h={88} cell={cell} rects={o} style={style}>{children}</Plate>;
};

// ---------- green room (receipts, hook) ----------
export const GreenRoomPlate: React.FC<{ cell: number; style?: React.CSSProperties }> = ({ cell, style }) => {
  const o: R[] = [];
  o.push([0, 0, 180, 52, "#1F6B47"]);
  for (let y = 0; y < 52; y += 4) o.push([0, y, 180, 1, "rgba(0,0,0,0.06)"]);
  o.push([0, 34, 180, 2, "#134A31"], [0, 36, 180, 16, "#185A3C"]);
  for (let x = 3; x < 180; x += 16) o.push([x, 38, 13, 12, "#1C6644"], [x, 38, 13, 1, "#2A8059"], [x, 49, 13, 1, "#124530"]);
  o.push([0, 52, 180, 2, "#0F3A27"]);
  o.push([0, 54, 180, 34, "#1F6B47"]);
  for (let row = 0; row * 4 < 34; row++) for (let x = row % 2 ? 0 : 4; x < 180; x += 8) o.push([x, 54 + row * 4, 4, 4, "#164E36"]);
  o.push([0, 54, 180, 34, "rgba(30,110,75,0.35)"]);
  o.push([60, 0, 60, 88, "rgba(255,240,200,0.06)"], [70, 0, 40, 88, "rgba(255,240,200,0.06)"]);
  return <Plate w={180} h={88} cell={cell} rects={o} style={style} />;
};

// ---------- shop storefront (the rented Ladenlokal) ----------
export const StorefrontPlate: React.FC<{ cell: number; open?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ cell, open = 1, style, children }) => {
  const o: R[] = [];
  o.push([0, 0, 180, 8, "#9FD3E8"], [0, 0, 180, 3, "#8CC8E0"]);
  bricks(o, 0, 8, 26, 64, 3);
  bricks(o, 154, 8, 26, 64, 4);
  o.push([26, 8, 128, 64, "#EAD9BC"]);
  for (let y = 10; y < 70; y += 6) o.push([26, y, 128, 1, "rgba(160,120,80,0.12)"]);
  o.push([24, 8, 2, 64, "#C9B08D"], [154, 8, 2, 64, "#C9B08D"]);
  // sign board above (text overlaid by the comp)
  o.push([58, 10, 64, 10, "#6B4226"], [59, 11, 62, 8, "#8A5A34"], [59, 11, 62, 1, "#A8743F"]);
  // awning
  for (let x = 30; x < 150; x += 8) o.push([x, 22, 4, 8, "#2E7D4F"], [x + 4, 22, 4, 8, "#F3E9D2"]);
  for (let x = 30; x < 150; x += 4) o.push([x, 30, 3, 2, x % 8 < 4 ? "#2E7D4F" : "#F3E9D2"]);
  o.push([28, 21, 124, 1, "#1F5A38"]);
  // windows + door
  const glass = (x: number, y: number, w: number, h: number) => {
    o.push([x - 2, y - 2, w + 4, h + 4, "#6B4226"], [x, y, w, h, open > 0.5 ? "#F2D49B" : "#9CC3CF"]);
    o.push([x, y, w, 3, "rgba(255,255,255,0.35)"], [x + 3, y + 4, 2, h - 8, "rgba(255,255,255,0.25)"]);
    o.push([x, y + h - 6, w, 1, "#6B4226"]);
    for (let i = 0; i < w - 4; i += 4) o.push([x + 2 + i, y + h - 9, 3, 3, pick(["#C0392B", "#2F5D8E", "#C9A227", "#3F7A3A"], i + x, 5)]);
    o.push([x, y + h - 14, w, 1, "#6B4226"]);
    for (let i = 0; i < w - 4; i += 5) o.push([x + 2 + i, y + h - 18, 3, 4, pick(["#E8C88A", "#B7D7A8", "#F2A9A0"], i + y, 6)]);
  };
  glass(34, 36, 38, 30);
  glass(108, 36, 38, 30);
  o.push([78, 34, 24, 38, "#6B4226"], [80, 36, 20, 36, "#7E5030"], [82, 38, 16, 20, open > 0.5 ? "#F2D49B" : "#9CC3CF"], [82, 38, 16, 3, "rgba(255,255,255,0.35)"], [95, 60, 2, 3, "#C9A227"]);
  lantern(o, 28, 30);
  lantern(o, 149, 30);
  // street
  o.push([0, 72, 180, 2, "#8A7B66"]);
  cobbles(o, 0, 74, 180, 14, 9);
  plant(o, 8, 60, 1);
  plant(o, 162, 60, 1);
  o.push([114, 68, 20, 2, "#8A5A34"], [114, 66, 20, 1, "#A8743F"], [115, 70, 1, 3, "#5E3520"], [132, 70, 1, 3, "#5E3520"]);
  return <Plate w={180} h={88} cell={cell} rects={o} style={style}>{children}</Plate>;
};

// ---------- landlord house ----------
export const LandlordPlate: React.FC<{ cell: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ cell, style, children }) => {
  const o: R[] = [];
  o.push([0, 0, 180, 72, "#EFE3CC"]);
  for (let y = 0; y < 72; y += 5) { o.push([0, y, 180, 1, "#DCCBAE"]); for (let x = (y / 5) % 2 ? 0 : 6; x < 180; x += 12) o.push([x, y, 1, 5, "#DCCBAE"]); }
  o.push([0, 0, 180, 4, "#C9B48F"], [0, 4, 180, 1, "#B8A27C"]);
  const win = (x: number, y: number) => {
    o.push([x - 2, y - 3, 22, 3, "#C9B48F"], [x - 1, y - 1, 20, 28, "#8A6A4A"], [x, y, 18, 26, "#A9CFE0"], [x, y, 18, 4, "#C8E4EF"], [x + 8, y, 2, 26, "#8A6A4A"], [x, y + 12, 18, 2, "#8A6A4A"]);
    o.push([x - 2, y + 27, 22, 4, "#7A4A2A"]);
    for (let i = 0; i < 20; i += 2) o.push([x - 1 + i, y + 25 - (i % 4 ? 1 : 0), 2, 2, i % 6 === 0 ? "#E5484D" : i % 4 === 0 ? "#F2A9C0" : "#4E9A47"]);
  };
  win(14, 14); win(44, 14); win(118, 14); win(148, 14);
  // grand door
  o.push([72, 6, 36, 4, "#C9B48F"], [74, 10, 32, 52, "#B8A27C"], [76, 12, 28, 50, "#4E2C1A"], [77, 13, 13, 48, "#6B3A20"], [90, 13, 13, 48, "#6B3A20"]);
  [16, 30, 44].forEach((y) => o.push([79, y, 9, 10, "#5A311B"], [92, y, 9, 10, "#5A311B"]));
  o.push([87, 38, 2, 3, "#E2B33C"], [91, 38, 2, 3, "#E2B33C"], [84, 8, 12, 4, "#F5D27A"], [86, 9, 8, 2, "#FFF1C2"]);
  lantern(o, 68, 22);
  lantern(o, 109, 22);
  o.push([118, 52, 6, 6, "#C9A227"], [119, 54, 4, 1, "#7A5A14"]);
  // steps, hedges, street
  o.push([66, 62, 48, 3, "#D6C4A8"], [62, 65, 56, 3, "#C9B48F"], [58, 68, 64, 4, "#BBA587"]);
  [[0, 56, 56], [124, 56, 56]].forEach(([hx, hy, hw]) => { o.push([hx, hy, hw, 16, "#3F7A3A"]); for (let i = 0; i < hw; i += 3) o.push([hx + i, hy + (i % 2), 2, 2, "#5DA052"]); });
  o.push([0, 72, 180, 2, "#8A7B66"]);
  cobbles(o, 0, 74, 180, 14, 21);
  return <Plate w={180} h={88} cell={cell} rects={o} style={style}>{children}</Plate>;
};

// ---------- portrait market square (fullscreen) ----------
// Landlord door centre in cells: (PLAZA_DOOR.x, PLAZA_DOOR.y); shop door: PLAZA_SHOP.
export const PLAZA_DOOR = { x: 168, y: 104 };
export const PLAZA_SHOP = { x: 46, y: 104 };
export const PlazaPlate: React.FC<{ cell: number; t: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ cell, t, style, children }) => {
  const o: R[] = [];
  o.push([0, 0, 216, 30, "#A9DCF0"], [0, 0, 216, 10, "#94D0EA"]);
  [[20, 8], [120, 14], [180, 5]].forEach(([cx, cy], i) => { const x = ((cx + t * (1.5 + i)) % 260) - 30; o.push([x, cy, 24, 4, "#FFF"], [x + 5, cy - 3, 12, 3, "#FFF"]); });
  // facades: shop (for rent), bakery, cafe, landlord house
  const facade = (x: number, w: number, wall: string, roof: string, aw: [string, string], door: string) => {
    o.push([x, 18, w, 4, roof], [x + 2, 14, w - 4, 4, roof], [x, 22, w, 92, wall]);
    for (let y = 26; y < 112; y += 6) o.push([x, y, w, 1, "rgba(0,0,0,0.05)"]);
    for (let wx = x + 5; wx < x + w - 10; wx += 14) o.push([wx - 1, 29, 10, 16, "#7A4A2A"], [wx, 30, 8, 14, "#A9CFE0"], [wx, 30, 8, 3, "#CBE6F0"], [wx - 1, 45, 10, 2, "#4E9A47"], [wx + 1, 44, 2, 1, "#E5484D"], [wx + 5, 44, 2, 1, "#F2A9C0"]);
    for (let ax = x + 2; ax < x + w - 2; ax += 6) o.push([ax, 60, 3, 8, aw[0]], [ax + 3, 60, 3, 8, aw[1]]);
    o.push([x + 3, 70, w - 6, 30, "#F2D49B"], [x + 3, 70, w - 6, 3, "rgba(255,255,255,0.4)"], [x + 2, 69, w - 4, 1, "#6B4226"]);
    o.push([x + w / 2 - 6, 88, 12, 26, "#6B4226"], [x + w / 2 - 5, 89, 10, 25, door]);
  };
  facade(0, 54, "#EAD9BC", "#9E513A", ["#2E7D4F", "#F3E9D2"], "#7E5030");
  facade(54, 52, "#F2C9B8", "#7A4A6A", ["#C0392B", "#FFF"], "#7E5030");
  facade(106, 40, "#D8E6D0", "#5E6E8E", ["#2F5D8E", "#FFF"], "#7E5030");
  // landlord house (bigger, grand door)
  o.push([146, 10, 70, 104, "#EFE3CC"], [146, 6, 70, 6, "#C9B48F"], [150, 2, 62, 4, "#C9B48F"]);
  for (let wx = 152; wx < 210; wx += 18) o.push([wx - 1, 24, 14, 22, "#8A6A4A"], [wx, 25, 12, 20, "#A9CFE0"], [wx, 25, 12, 4, "#C8E4EF"], [wx - 2, 46, 16, 3, "#7A4A2A"], [wx, 45, 3, 2, "#E5484D"], [wx + 6, 45, 3, 2, "#4E9A47"]);
  o.push([158, 70, 20, 34, "#B8A27C"], [160, 72, 16, 32, "#4E2C1A"], [161, 73, 7, 31, "#6B3A20"], [168, 73, 7, 31, "#6B3A20"], [166, 86, 1, 3, "#E2B33C"], [169, 86, 1, 3, "#E2B33C"]);
  o.push([154, 104, 28, 3, "#D6C4A8"], [150, 107, 36, 3, "#C9B48F"]);
  lantern(o, 152, 78);
  lantern(o, 180, 78);
  // plaza
  o.push([0, 114, 216, 2, "#8A7B66"]);
  cobbles(o, 0, 116, 216, 268, 33);
  // fountain
  o.push([18, 140, 44, 16, "#9AA3AD"], [20, 142, 40, 10, "#6FB7D9"], [20, 142, 40, 2, "#A6DAF0"], [36, 128, 8, 14, "#B9C1C9"], [34, 126, 12, 3, "#9AA3AD"]);
  const sp = Math.floor(t * 8) % 3;
  o.push([39, 120 - sp, 2, 6 + sp, "#A6DAF0"], [36, 122 + sp, 1, 3, "#A6DAF0"], [43, 121 + sp, 1, 3, "#A6DAF0"]);
  // trees + benches on the sides
  const tree = (x: number, y: number) => {
    o.push([x + 6, y + 14, 4, 12, "#6B4226"]);
    [[0, 6, 16, 10], [2, 2, 12, 6], [4, 0, 8, 3], [1, 14, 14, 3]].forEach(([dx, dy, w, h]) => o.push([x + dx, y + dy, w, h, "#3F7A3A"]));
    for (let i = 0; i < 9; i++) o.push([x + 2 + Math.floor(rnd(i, x) * 12), y + 2 + Math.floor(rnd(i, y) * 12), 2, 2, "#5DA052"]);
    o.push([x + 2, y + 26, 12, 2, "rgba(0,0,0,0.15)"]);
  };
  [170, 230, 290, 340].forEach((y, i) => { tree(-4, y - (i % 2) * 8); tree(202, y + (i % 2) * 8); });
  [[2, 212], [196, 262]].forEach(([bx, by]) => o.push([bx, by, 18, 2, "#8A5A34"], [bx, by - 2, 18, 1, "#A8743F"], [bx + 1, by + 2, 1, 3, "#5E3520"], [bx + 16, by + 2, 1, 3, "#5E3520"]));
  // flower beds near the shops
  for (let x = 4; x < 140; x += 22) { o.push([x, 116, 14, 4, "#7A4A2A"]); for (let i = 0; i < 14; i += 2) o.push([x + i, 115 - (i % 4 ? 0 : 1), 2, 2, pick(["#E5484D", "#F5C542", "#F2A9C0", "#4E9A47"], i + x, 8)]); }
  return <Plate w={216} h={384} cell={cell} rects={o} style={style}>{children}</Plate>;
};
