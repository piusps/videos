import React from "react";

// Our own pixel mascot for the FP-N opus reels (Pius 2026-10-19: "geiler Claude-Stil, mehr Dopamin").
// Claude-orange round bot with antenna, big eyes and little arms, plus a prop in the right hand and an optional hat.
// Deliberately NOT the Claude Code mascot: different silhouette (round head-body, antenna, white eyes with pupils).

export type BotProp =
  | "none" | "stopwatch" | "roller" | "megaphone" | "magnifier" | "phone" | "calc" | "stamp" | "pdf" | "folder"
  | "headphones" | "plane" | "ladder" | "calendar" | "brick" | "laptop" | "question" | "copy" | "letter" | "pen" | "key";
export type BotHat = "none" | "helmet" | "cap" | "crown" | "tophat" | "glasses";

const BODY = [
  ".....Y......",
  ".....A......",
  "...OOOOOO...",
  "..OOOOOOOO..",
  ".OOWWOOWWOO.",
  ".OOWPOOWPOO.",
  ".OOOOOOOOOO.",
  ".OOOLMMLOOO.",
  "..OOOOOOOO..",
  "HHOOOOOOOOHH",
  "..OOOOOOOO..",
  "..OO....OO..",
  "..DD....DD..",
];
const BLINK_ROW_A = ".OOOOOOOOOO.";
const BLINK_ROW_B = ".OOPPOOPPOO.";

const PROPS: Record<Exclude<BotProp, "none">, { w: number; h: number; px: string[]; pal: Record<string, string> }> = {
  stopwatch: { w: 7, h: 8, px: ["..KKK..", "...K...", ".SSSSS.", "SWWWWWS", "SWWKWWS", "SWWKKWS", "SWWWWWS", ".SSSSS."], pal: { K: "#2C2420", S: "#5A6270", W: "#FFFFFF" } },
  roller: { w: 8, h: 8, px: ["RRRRRRR.", "RRRRRRR.", "...K....", "...K....", "...K....", "...K....", "...K....", "..GGG..."], pal: { R: "#FFFFFF", K: "#5A6270", G: "#2C2420" } },
  megaphone: { w: 8, h: 6, px: ["......GG", "....GGGG", "KKGGGGGG", "KKGGGGGG", "....GGGG", "......GG"], pal: { K: "#2C2420", G: "#F5C542" } },
  magnifier: { w: 7, h: 8, px: [".KKK...", "KBBBK..", "KBBBK..", "KBBBK..", ".KKK...", "....K..", ".....K.", "......K"], pal: { K: "#2C2420", B: "#BFE3F2" } },
  phone: { w: 5, h: 8, px: ["KKKKK", "KBBBK", "KBBBK", "KBBBK", "KBBBK", "KBBBK", "KKWKK", "KKKKK"], pal: { K: "#2C2420", B: "#8FC1E3", W: "#FFFFFF" } },
  calc: { w: 6, h: 8, px: ["KKKKKK", "KGGGGK", "KKKKKK", "KWKWKK", "KKKKKK", "KWKWKK", "KKKKKK", "KWKOKK"], pal: { K: "#2C2420", G: "#9CC985", W: "#FFFFFF", O: "#D97757" } },
  stamp: { w: 6, h: 8, px: ["..KK..", "..KK..", "..KK..", ".KKKK.", "KKKKKK", "RRRRRR", "RRRRRR", "......"], pal: { K: "#7A4B26", R: "#E5484D" } },
  pdf: { w: 6, h: 8, px: ["WWWW..", "WWWWW.", "WKKWWW", "WWWWWW", "WKKKWW", "WWWWWW", "RRRRRR", "RRRRRR"], pal: { W: "#FFFFFF", K: "#8A877F", R: "#E5484D" } },
  folder: { w: 8, h: 6, px: ["YYY.....", "YYYYYYYY", "YWWWWWWY", "YYYYYYYY", "YYYYYYYY", "YYYYYYYY"], pal: { Y: "#F2A531", W: "#FFFFFF" } },
  headphones: { w: 0, h: 0, px: [], pal: {} },
  plane: { w: 8, h: 5, px: ["W.......", "WWWW....", "WWWWWWWW", "WWWW....", "W......."], pal: { W: "#FFFFFF" } },
  ladder: { w: 5, h: 10, px: ["K...K", "KKKKK", "K...K", "K...K", "KKKKK", "K...K", "K...K", "KKKKK", "K...K", "K...K"], pal: { K: "#C98F5E" } },
  calendar: { w: 7, h: 7, px: ["R.R.R.R", "RRRRRRR", "WWWWWWW", "WKWKWKW", "WWWWWWW", "WKWKWRW", "WWWWWWW"], pal: { R: "#E5484D", W: "#FFFFFF", K: "#8A877F" } },
  brick: { w: 8, h: 6, px: ["BBBKBBBB", "BBBKBBBB", "KKKKKKKK", "BKBBBBKB", "BKBBBBKB", "KKKKKKKK"], pal: { B: "#C8553D", K: "#F1D3B0" } },
  laptop: { w: 9, h: 6, px: ["KKKKKKK..", "KBBBBBK..", "KBBBBBK..", "KKKKKKK..", "SSSSSSSSS", ".SSSSSSS."], pal: { K: "#2C2420", B: "#8FC1E3", S: "#9AA3AD" } },
  question: { w: 5, h: 8, px: [".KKK.", "K...K", "....K", "...K.", "..K..", "..K..", ".....", "..K.."], pal: { K: "#2C2420" } },
  copy: { w: 7, h: 7, px: ["KKKK...", "KWWK...", "KWKKKK.", "KWKWWWK", "KKKWWWK", "...KWWK", "...KKKK"], pal: { K: "#2C2420", W: "#FFFFFF" } },
  letter: { w: 8, h: 6, px: ["KKKKKKKK", "KWKWWKWK", "KWWKKWWK", "KWWWWWWK", "KWWWWRWK", "KKKKKKKK"], pal: { K: "#2C2420", W: "#FFFFFF", R: "#E5484D" } },
  pen: { w: 3, h: 9, px: [".K.", "KYK", "KYK", "KYK", "KYK", "KYK", "KSK", ".S.", ".K."], pal: { K: "#2C2420", Y: "#F5C542", S: "#9AA3AD" } },
  key: { w: 7, h: 5, px: ["YYY....", "Y.YYYYY", "YYY.Y.Y", ".......", "......."], pal: { Y: "#E2B33C" } },
};
const HATS: Record<Exclude<BotHat, "none">, { px: string[]; pal: Record<string, string> }> = {
  helmet: { px: ["...YYYYYY...", "..YYYYYYYY..", ".YYYYYYYYYY."], pal: { Y: "#F5C542" } },
  cap: { px: ["....KKKK....", "...KKKKKK...", "...KKKKKKKKK"], pal: { K: "#2C2420" } },
  crown: { px: ["...Y.Y.Y.Y..", "...YYYYYYY..", "...YYYYYYY.."], pal: { Y: "#F5C542" } },
  // tophat sits higher (row -3..2), glasses sit on the eye rows (4-5); see hatTop below
  tophat: { px: ["...KKKKKK...", "...KKKKKK...", "...KKKKKK...", "...RRRRRR...", ".KKKKKKKKKK."], pal: { K: "#2C2420", R: "#9C2F2A" } },
  glasses: { px: ["..KKKKKKKK..", ".KK..KK..KK.", ".KK..KK..KK."], pal: { K: "#2C2420" } },
};
const HAT_TOP: Partial<Record<BotHat, number>> = { tophat: -3, glasses: 3 };

export const PixelBot: React.FC<{
  px: number; t: number; prop?: BotProp; hat?: BotHat; color?: string; grey?: boolean; flip?: boolean; seed?: number; style?: React.CSSProperties;
}> = ({ px, t, prop = "none", hat = "none", color = "#D97757", grey, flip, seed = 0, style }) => {
  const blink = Math.floor((t + seed * 0.37) * 10) % 37 === 0;
  const pal: Record<string, string> = grey
    ? { Y: "#B9B4AC", A: "#6E6A63", O: "#B9B4AC", W: "#E7E4DD", P: "#4A4640", L: "#8E8981", M: "#8E8981", H: "#A8A39A", D: "#6E6A63" }
    : { Y: "#F5C542", A: "#2C2420", O: color, W: "#FFFFFF", P: "#2C2420", L: "#9C4A31", M: "#9C4A31", H: "#B85F42", D: "#2C2420" };
  const rows = BODY.map((r, i) => (blink && i === 4 ? BLINK_ROW_A : blink && i === 5 ? BLINK_ROW_B.replace(/P/g, "O") : r));
  const hatRows = hat !== "none" ? HATS[hat].px : [];
  const hatTop = HAT_TOP[hat] ?? 1; // hats sit on row 1-3
  const P = prop !== "none" ? PROPS[prop] : null;
  const W = 12 + (P ? P.w + 1 : 0);
  const Hh = 13;
  const wobble = Math.sin(t * 7 + seed) * 2;
  return (
    <svg width={W * px} height={Hh * px} viewBox={`0 0 ${W} ${Hh}`} shapeRendering="crispEdges" style={{ display: "block", overflow: "visible", transform: `${flip ? "scaleX(-1) " : ""}rotate(${wobble * 0.6}deg)`, ...style }}>
      {rows.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`b${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={pal[ch]} />)))}
      {hatRows.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`h${x}-${y}`} x={x} y={y + hatTop} width={1.02} height={1.02} fill={grey ? "#8E8981" : HATS[hat as Exclude<BotHat, "none">].pal[ch]} />)))}
      {prop === "headphones" ? (
        <g>
          <rect x={1} y={2} width={10} height={1} fill="#2C2420" />
          <rect x={0} y={3} width={2} height={4} fill="#2C2420" />
          <rect x={10} y={3} width={2} height={4} fill="#2C2420" />
        </g>
      ) : P ? (
        <g transform={`translate(12.5 ${Math.max(0, 9.5 - P.h * 0.6)})`}>
          {P.px.flatMap((r, y) => r.split("").map((ch, x) => (ch === "." ? null : <rect key={`p${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={grey ? "#8E8981" : P.pal[ch]} />)))}
        </g>
      ) : null}
    </svg>
  );
};
