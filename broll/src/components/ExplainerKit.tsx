import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// Building blocks for the "Explainer" B-Roll style (video-broll-explainer skill,
// adopted 2026-09-29 from the @bradfordmarais reference reel): a light-grey
// whiteboard, isometric tiles/cubes, tree diagrams with dashed connectors, small
// dark chips, counters, and a hard horizontal split with the speaker in the bottom
// half. Unlike GlassKit, motion here is springy "pop" (scale + blur-in), and a
// camera pans/pushes as a diagram grows. GlassKit stays untouched for the old style.

export const W = 1080;
export const H = 1920;
export const FPS = 25;

export const ex = {
  board: "#EDEDED",
  boardEdge: "#E2E2E2",
  ink: "#1C1C1C",
  title: "#2A2A2A",
  chip: "#2B2B2B",
  chipText: "#F2F2F2",
  // Isometric faces. Superkind orange by default; swap for the reference's
  // yellow (#F9C84A / #EDB532 / #D99E1F) if the user wants it 1:1.
  tileTop: colors.accent,
  tileLeft: "#E85A26",
  tileRight: "#C9481B",
  rowCard: "#FFD9C7",
  active: "#5BD66B",
  white: "#FFFFFF",
} as const;

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

// ---------- timing helpers ----------

// Seconds-based helpers so a beat can be timed against the spoken words.
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  // Springy pop 0→1 (slight overshoot) starting at second `s`.
  const pop = (s: number, damping = 13) => spring({ frame: frame - s * fps, fps, config: { damping, stiffness: 170, mass: 0.7 } });
  // Smooth 0→1 between two seconds.
  const ramp = (a: number, b: number, easing = easeOut) => interpolate(t, [a, b], [0, 1], { ...clamp, easing });
  return { frame, fps, t, dur: durationInFrames / fps, pop, ramp };
};

// Blur-to-sharp pop wrapper. p is 0→1 (may overshoot slightly).
export const Pop: React.FC<{ p: number; from?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ p, from = 0.6, y = 30, style, children }) => {
  const o = Math.min(1, Math.max(0, p * 1.4));
  return (
    <div style={{ ...style, opacity: o, filter: `blur(${Math.max(0, 1 - p) * 14}px)`, transform: `translateY(${(1 - Math.min(p, 1)) * y}px) scale(${from + (1 - from) * p})` }}>
      {children}
    </div>
  );
};

// ---------- surfaces & layout ----------

export const Board: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #F3F3F3 0%, ${ex.board} 60%, ${ex.boardEdge} 100%)`, overflow: "hidden", ...style }}>
    {children}
  </AbsoluteFill>
);

// Moves/zooms the whole board like a camera. keys: [{t, x, y, s}] in seconds.
export const Camera: React.FC<{ keys: { t: number; x?: number; y?: number; s?: number }[]; children: React.ReactNode }> = ({ keys, children }) => {
  const { t } = useT();
  const ts = keys.map((k) => k.t);
  const val = (f: "x" | "y" | "s", d: number) =>
    keys.length < 2 ? keys[0]?.[f] ?? d : interpolate(t, ts, keys.map((k) => k[f] ?? d), { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  return (
    <AbsoluteFill style={{ transform: `translate(${val("x", 0)}px, ${val("y", 0)}px) scale(${val("s", 1)})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>
  );
};

export type AvatarSource = { src: string; startSec: number; focus?: { x: number; y: number }; scale?: number; faceAt?: number }; // faceAt: face height in the panel (0-1), default 0.3

// src is a path inside broll/public (e.g. "launch-tightened.mp4") or an absolute URL.
const resolveSrc = (src: string) => (/^(https?:|file:)/.test(src) ? src : staticFile(src));

// The speaker, cropped into a W×h panel around the face (focus = face point 0-1 of the source frame).
export const AvatarPanel: React.FC<{ avatar: AvatarSource; top: number; height: number }> = ({ avatar, top, height }) => {
  const { fps } = useVideoConfig();
  const s = avatar.scale ?? 1.55;
  const f = avatar.focus ?? { x: 0.67, y: 0.51 }; // Niklas Office face point
  const vw = W * s;
  const vh = H * s;
  const left = Math.min(0, Math.max(W - vw, W / 2 - f.x * vw));
  // Face high in the panel, so the fixed vision-caption line (y 0.77) sits on the chest.
  const topOff = Math.min(0, Math.max(height - vh, height * (avatar.faceAt ?? 0.3) - f.y * vh));
  return (
    <div style={{ position: "absolute", left: 0, top, width: W, height, overflow: "hidden", background: "#000" }}>
      <OffthreadVideo src={resolveSrc(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted
        style={{ position: "absolute", left, top: topOff, width: vw, height: vh }} />
    </div>
  );
};

// Board full-frame, speaker panel (bottom half) slides up over it. split 0 = only the
// board, 1 = hard 50/50 split. Children are authored in full-frame 1080×1920
// coordinates and move themselves into the top half with lerp(…, split).
export const Split: React.FC<{ split: number; avatar: AvatarSource; children: React.ReactNode }> = ({ split, avatar, children }) => (
  <AbsoluteFill>
    <Board>{children}</Board>
    {split > 0.001 && (
      <>
        <AvatarPanel avatar={avatar} top={H - (H / 2) * split} height={H / 2} />
        <div style={{ position: "absolute", left: 0, width: W, top: H - (H / 2) * split - 30, height: 30, background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.12))" }} />
      </>
    )}
  </AbsoluteFill>
);

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// Positions a group at (top) with a scale around its top-centre; handy with lerp for the split move.
export const Place: React.FC<{ top: number; scale?: number; left?: number; children: React.ReactNode }> = ({ top, scale = 1, left, children }) => (
  <div style={{ position: "absolute", top, left: left ?? 0, width: left === undefined ? W : undefined, display: "flex", justifyContent: "center", transform: `scale(${scale})`, transformOrigin: left === undefined ? "50% 0" : "0 0" }}>
    {children}
  </div>
);

// Full-frame speaker (for overlay beats: title over the speaker, floating card).
export const FullSpeaker: React.FC<{ avatar: AvatarSource; children?: React.ReactNode }> = ({ avatar, children }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo src={resolveSrc(avatar.src)} startFrom={Math.round(avatar.startSec * fps)} muted style={{ width: W, height: H, objectFit: "cover" }} />
      {children}
    </AbsoluteFill>
  );
};

// ---------- type ----------

// Heavy headline, words pop in one after another (reference: "Brand" → "Brand Brain").
export const Title: React.FC<{ text: string; at: number; step?: number; size?: number; color?: string; onDark?: boolean; style?: React.CSSProperties }> = ({ text, at, step = 0.18, size = 120, color, onDark, style }) => {
  const { pop } = useT();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.24}px`, ...style }}>
      {words.map((w, i) => (
        <Pop key={i} p={pop(at + i * step)} from={0.8} y={size * 0.25}>
          <span
            style={{
              fontFamily: fonts.bold,
              fontSize: size,
              letterSpacing: -size * 0.045,
              lineHeight: 1.02,
              color: color ?? (onDark ? ex.white : ex.title),
              textShadow: onDark ? "0 6px 30px rgba(0,0,0,0.45)" : "0 2px 0 rgba(255,255,255,0.8), 0 10px 24px rgba(0,0,0,0.12)",
            }}
          >
            {w}
          </span>
        </Pop>
      ))}
    </div>
  );
};

// ---------- icons (24×24 stroke glyphs) ----------

const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const rect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

export const ICONS: Record<string, string[]> = {
  check: ["M20 6 9 17l-5-5"],
  shield: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "m9 12 2 2 4-4"],
  book: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
  bolt: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  mail: [rect(2, 4, 20, 16, 2), "m22 7-10 6L2 7"],
  building: ["M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z", "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2", "M10 6h4", "M10 10h4", "M10 14h4", "M10 18h4"],
  users: ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", circ(9, 7, 4), "M22 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  user: [circ(12, 8, 4), "M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"],
  brain: ["M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z", "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z", "M12 5v13"],
  euro: ["M4 10h12", "M4 14h9", "M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"],
  message: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  file: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6"],
  globe: [circ(12, 12, 10), "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  lock: [rect(3, 11, 18, 11, 2), "M7 11V7a5 5 0 0 1 10 0v4"],
  target: [circ(12, 12, 10), circ(12, 12, 6), circ(12, 12, 2)],
  flag: ["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z", "M4 22v-7"],
  search: [circ(11, 11, 8), "m21 21-4.3-4.3"],
  code: ["m16 18 6-6-6-6", "m8 6-6 6 6 6"],
  info: [circ(12, 12, 10), "M12 16v-4", "M12 8h.01"],
  clock: [circ(12, 12, 10), "M12 6v6l4 2"],
};

export const Icon: React.FC<{ name: keyof typeof ICONS | string; size?: number; color?: string; stroke?: number; style?: React.CSSProperties }> = ({ name, size = 48, color = ex.ink, stroke = 2, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {(ICONS[name] ?? ICONS.info).map((d, i) => <path key={i} d={d} />)}
  </svg>
);

// Places a 24×24 icon on an isometric face (matrix maps the 100×100 face box).
const FaceIcon: React.FC<{ name: string; m: string; color?: string }> = ({ name, m, color = ex.ink }) => (
  <g transform={`matrix(${m})`}>
    <g transform="translate(26 26) scale(2)" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {(ICONS[name] ?? ICONS.info).map((d, i) => <path key={i} d={d} />)}
    </g>
  </g>
);

const M_TOP = "0.5,-0.2887,0.5,0.2887,0,28.87";
const M_LEFT = "0.5,0.2887,0,0.5774,0,28.87";
const M_RIGHT = "0.5,-0.2887,0,0.5774,50,57.74";

// ---------- isometric objects ----------

// Isometric cube. `glow` 0→1 turns the top face green + halo ("active / done").
export const IsoCube: React.FC<{ size?: number; top?: string; left?: string; right?: string; glow?: number; style?: React.CSSProperties }> = ({ size = 300, top, left, right, glow = 0, style }) => {
  const topFill = glow > 0 ? interpolateColor(ex.tileTop, ex.active, glow) : ex.tileTop;
  return (
    <svg width={size} height={size * 1.1547} viewBox="0 0 100 115.47" style={{ overflow: "visible", filter: `drop-shadow(0 ${size * 0.08}px ${size * 0.1}px rgba(0,0,0,0.18))${glow ? ` drop-shadow(0 0 ${size * 0.12 * glow}px ${ex.active})` : ""}`, ...style }}>
      <polygon points="50,0 100,28.87 50,57.74 0,28.87" fill={topFill} />
      <polygon points="0,28.87 50,57.74 50,115.47 0,86.6" fill={ex.tileLeft} />
      <polygon points="50,57.74 100,28.87 100,86.6 50,115.47" fill={ex.tileRight} />
      {top && <FaceIcon name={top} m={M_TOP} />}
      {left && <FaceIcon name={left} m={M_LEFT} />}
      {right && <FaceIcon name={right} m={M_RIGHT} />}
    </svg>
  );
};

// Flat isometric platform (reference: the yellow rhombus with an icon on top).
export const IsoTile: React.FC<{ size?: number; icon?: string; style?: React.CSSProperties }> = ({ size = 320, icon, style }) => (
  <svg width={size} height={size * 0.68} viewBox="0 0 100 68" style={{ overflow: "visible", filter: `drop-shadow(0 ${size * 0.06}px ${size * 0.08}px rgba(0,0,0,0.16))`, ...style }}>
    <polygon points="0,28.87 50,57.74 50,67.74 0,38.87" fill={ex.tileLeft} />
    <polygon points="50,57.74 100,28.87 100,38.87 50,67.74" fill={ex.tileRight} />
    <polygon points="50,0 100,28.87 50,57.74 0,28.87" fill={ex.tileTop} />
    {icon && (
      <g transform="translate(36 14.5) scale(1.17)" stroke={ex.ink} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {(ICONS[icon] ?? ICONS.info).map((d, i) => <path key={i} d={d} />)}
      </g>
    )}
  </svg>
);

// Rounded "app icon" tile with depth (reference: the coral Claude tile). Pass an icon name or the Superkind logo.
export const AppIcon: React.FC<{ size?: number; icon?: string; logo?: boolean; style?: React.CSSProperties }> = ({ size = 220, icon, logo, style }) => (
  <div
    style={{
      width: size, height: size, borderRadius: size * 0.24,
      background: `linear-gradient(160deg, #FF8A5C 0%, ${colors.accent} 55%, #E4541F 100%)`,
      boxShadow: `inset 0 ${size * 0.02}px 0 rgba(255,255,255,0.35), inset 0 ${-size * 0.03}px 0 rgba(0,0,0,0.12), 0 ${size * 0.12}px ${size * 0.2}px rgba(0,0,0,0.22), 0 0 0 ${size * 0.03}px rgba(255,255,255,0.9)`,
      display: "grid", placeItems: "center", ...style,
    }}
  >
    {logo ? <Img src={staticFile("superkind-logo.svg")} style={{ width: size * 0.56, filter: "brightness(0) invert(1)" }} /> : <Icon name={icon ?? "bolt"} size={size * 0.52} color={ex.white} stroke={2.2} />}
  </div>
);

// ---------- diagram parts ----------

// Small dark chip, e.g. "ⓘ Instructions </>".
export const Chip: React.FC<{ text: string; icon?: string; leading?: React.ReactNode; big?: boolean; style?: React.CSSProperties }> = ({ text, icon = "info", leading, big, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: big ? 14 : 10, padding: big ? "18px 30px" : "12px 22px", background: ex.chip, borderRadius: 14, boxShadow: "0 10px 24px rgba(0,0,0,0.2)", ...style }}>
    {leading ? (
      // Brand logo / flag on a small white plate so every mark reads on the dark chip.
      <div style={{ display: "grid", placeItems: "center", width: big ? 44 : 34, height: big ? 44 : 34, borderRadius: 10, background: "#fff" }}>{leading}</div>
    ) : (
      <Icon name={icon} size={big ? 34 : 26} color={colors.accent} />
    )}
    <span style={{ fontFamily: fonts.semibold, fontSize: big ? 36 : 28, color: ex.chipText, letterSpacing: -0.3 }}>{text}</span>
  </div>
);

// Tinted container with white rows that stagger in (reference: "Who are you? / What do you sell? / How you talk?").
export const RowCard: React.FC<{ rows: string[]; at: number; step?: number; times?: number[]; width?: number; icon?: string; style?: React.CSSProperties }> = ({ rows, at, step = 0.35, times, width = 640, icon = "check", style }) => {
  const { pop } = useT();
  return (
    <div style={{ width, padding: 22, borderRadius: 26, background: ex.rowCard, border: `4px solid ${colors.accent}`, boxShadow: "0 18px 40px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", gap: 16, ...style }}>
      {rows.map((r, i) => {
        const rp = pop(times?.[i] ?? at + i * step); // `times` lands each row on its own spoken word
        // Rows that haven't appeared take no height, so the card grows with them.
        return (
        <div key={i} style={{ maxHeight: 90 * Math.min(1, rp * 1.5), marginTop: i === 0 ? 0 : -16 + 16 * Math.min(1, rp * 1.5) }}>
        <Pop p={rp} from={0.9} y={16}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: ex.white, borderRadius: 16, padding: "18px 22px", boxShadow: "0 4px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: colors.accent, display: "grid", placeItems: "center" }}>
              <Icon name={icon} size={28} color={ex.white} stroke={2.6} />
            </div>
            <span style={{ fontFamily: fonts.semibold, fontSize: 38, color: ex.ink, letterSpacing: -0.5 }}>{r}</span>
          </div>
        </Pop>
        </div>
        );
      })}
    </div>
  );
};

// Dashed connector that draws itself between two points (board coordinates).
export const Connector: React.FC<{ from: [number, number]; to: [number, number]; p: number; curve?: number }> = ({ from, to, p, curve = 0 }) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 + curve;
  const my = (y1 + y2) / 2;
  const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.15;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <mask id={`m-${x1}-${y1}-${x2}-${y2}`}>
          <path d={d} stroke="#fff" strokeWidth={10} fill="none" strokeDasharray={len} strokeDashoffset={len * (1 - Math.min(1, p))} />
        </mask>
      </defs>
      <path d={d} stroke="#8A8A8A" strokeWidth={3.5} strokeDasharray="10 12" fill="none" strokeLinecap="round" mask={`url(#m-${x1}-${y1}-${x2}-${y2})`} />
    </svg>
  );
};

// Winding road that draws on, with flags and a target at the end (reference: the strategy path).
export const PathDraw: React.FC<{ d: string; p: number; length?: number; flags?: { x: number; y: number; at: number }[]; style?: React.CSSProperties }> = ({ d, p, length = 2600, flags = [], style }) => (
  <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", ...style }}>
    <path d={d} stroke={colors.accent} strokeWidth={26} fill="none" strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length * (1 - Math.min(1, p))} />
    {flags.filter((f) => p >= f.at).map((f, i) => (
      <g key={i} transform={`translate(${f.x - 24} ${f.y - 58}) scale(2)`} stroke={ex.ink} strokeWidth={2} fill={ex.ink} strokeLinecap="round" strokeLinejoin="round">
        <path d={ICONS.flag[0]} /><path d={ICONS.flag[1]} fill="none" />
      </g>
    ))}
  </svg>
);

// Slowly turning gear (background decoration, low contrast).
export const Gear: React.FC<{ size?: number; teeth?: number; speed?: number; style?: React.CSSProperties }> = ({ size = 260, teeth = 10, speed = 0.6, style }) => {
  const { t } = useT();
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 50 : 40;
    pts.push(`${50 + r * Math.cos(a0)},${50 + r * Math.sin(a0)}`, `${50 + r * Math.cos(a1)},${50 + r * Math.sin(a1)}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${t * speed * 40}deg)`, ...style }}>
      <polygon points={pts.join(" ")} fill="#E3D6C6" />
      <circle cx={50} cy={50} r={16} fill={ex.board} />
    </svg>
  );
};

// Dark status badge with a green dot, e.g. "✓ Quality Checking".
export const StatusBadge: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 20px", background: ex.chip, borderRadius: 12, boxShadow: "0 10px 22px rgba(0,0,0,0.2)", ...style }}>
    <div style={{ width: 30, height: 30, borderRadius: 8, background: ex.active, display: "grid", placeItems: "center" }}>
      <Icon name="check" size={20} color={ex.chip} stroke={3.2} />
    </div>
    <span style={{ fontFamily: fonts.semibold, fontSize: 26, color: ex.chipText }}>{text}</span>
  </div>
);

// Dark number pill that counts up (reference: "999,900 → 1,000,000 of people").
export const CounterPill: React.FC<{ from: number; to: number; p: number; suffix?: string; prefix?: string; icon?: string; style?: React.CSSProperties }> = ({ from, to, p, suffix = "", prefix = "", icon = "users", style }) => {
  const v = Math.round(from + (to - from) * Math.min(1, p));
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "18px 30px", background: ex.chip, borderRadius: 18, boxShadow: "0 14px 30px rgba(0,0,0,0.22)", ...style }}>
      <div style={{ width: 50, height: 50, borderRadius: 25, background: colors.accent, display: "grid", placeItems: "center" }}>
        <Icon name={icon} size={28} color={ex.white} />
      </div>
      <span style={{ fontFamily: fonts.bold, fontSize: 52, color: ex.white, letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>{prefix}{v.toLocaleString("de-DE")}</span>
      {suffix && <span style={{ fontFamily: fonts.medium, fontSize: 34, color: "#BDBDBD" }}>{suffix}</span>}
    </div>
  );
};

// Dark rounded panel holding a grid of small cards that pop in with a stagger.
export const CardGrid: React.FC<{ items: React.ReactNode[]; cols: number; at: number; step?: number; cell?: number; gap?: number; style?: React.CSSProperties }> = ({ items, cols, at, step = 0.04, cell = 150, gap = 20, style }) => {
  const { pop } = useT();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap, padding: 28, borderRadius: 30, background: ex.chip, boxShadow: "0 24px 50px rgba(0,0,0,0.25)", ...style }}>
      {items.map((it, i) => (
        <Pop key={i} p={pop(at + i * step)} from={0.5} y={10}>
          <div style={{ width: cell, height: cell, borderRadius: 18, background: "#3A3A3A", display: "grid", placeItems: "center", overflow: "hidden" }}>{it}</div>
        </Pop>
      ))}
    </div>
  );
};

// Dark chat bubble whose lines type in (reference: the pixel robot's speech bubble).
export const ChatBubble: React.FC<{ p: number; lines?: number; width?: number; style?: React.CSSProperties }> = ({ p, lines = 2, width = 360, style }) => (
  <div style={{ width, padding: "22px 26px", borderRadius: 20, background: ex.chip, boxShadow: "0 14px 30px rgba(0,0,0,0.22)", display: "flex", flexDirection: "column", gap: 12, ...style }}>
    {Array.from({ length: lines }).map((_, i) => {
      const lp = Math.min(1, Math.max(0, p * lines - i));
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {i === 0 && <div style={{ width: 16, height: 16, borderRadius: 8, background: ex.active, boxShadow: `0 0 10px ${ex.active}` }} />}
          <div style={{ height: 10, borderRadius: 5, background: ex.active, width: `${(i === 0 ? 80 : 60) * lp}%`, opacity: 0.9 }} />
        </div>
      );
    })}
  </div>
);

// ---------- misc ----------

export function interpolateColor(a: string, b: string, p: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, p))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// Gentle idle float so nothing on the board is ever fully static.
export const useFloat = (amp = 8, period = 2.4, phase = 0) => {
  const { t } = useT();
  return Math.sin(((t + phase) / period) * Math.PI * 2) * amp;
};
