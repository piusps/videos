import React from "react";
import { Easing, Img, interpolate, staticFile } from "remotion";

// Google-Maps-Look für Reels (2026-10-26): echtes Maps-Logo (public/logos/googlemaps.svg), Google Sans, Google-Kartenfarben,
// 2,5D-Karte (geneigte Ebene, stehende Pins, leicht extrudierte Gebäude) und Material-3-Bausteine. Alle Betriebe sind erfunden.

export const GF = "Google Sans";
export const G = {
  land: "#F2F3F5", block: "#E7E9EC", bld: "#DFE2E6", bldTop: "#ECEEF1", bldSide: "#D2D6DC", bldFront: "#C9CED5",
  road: "#FFFFFF", casing: "#D9DCE1", art: "#FDE293", artCasing: "#F1C44D", water: "#A8D3F5", park: "#CBE8CF",
  text: "#1F1F1F", sub: "#5F6368", line: "#DADCE0", blue: "#0B57D0", blueSoft: "#D3E3FD", blueDot: "#4285F4",
  red: "#EA4335", redDark: "#B31412", err: "#B3261E", errSoft: "#FCE8E6", ok: "#146C2E", okSoft: "#E6F4EA", open: "#188038", star: "#FBBC04",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const kk = (t: number, a: number, d = 0.3, e = Easing.out(Easing.cubic)) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: e });
const back = (t: number, a: number, d = 0.45) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
const rnd = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
export const elev = "0 1px 2px rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)";
export const deep = "0 30px 70px rgba(32,33,36,0.28), 0 10px 24px rgba(32,33,36,0.16)";

export const MapsLogo: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile("logos/googlemaps.svg")} style={{ height: size, width: (size * 92.3) / 132.3, ...style }} />
);

// ---------- map content (plane coordinates, 2600 x 2600) ----------
export const MW = 2600;
const riverY = (x: number) => 1060 + (x / MW) * 520 + 60 * Math.sin(x / 260);
const VX = [140, 470, 800, 1130, 1460, 1790, 2120, 2450];
const HY = [180, 510, 840, 1170, 1500, 1830, 2160, 2490];
const ART_X = 1130, ART_Y = 1500;
const PARK = { x: 1470, y: 520, w: 310, h: 310 };
type Box = { x: number; y: number; w: number; d: number; h: number };
const FOOT: Box[] = [];
const BOXES: Box[] = [];
VX.slice(0, -1).forEach((x0, i) => HY.slice(0, -1).forEach((y0, j) => {
  const x1 = VX[i + 1], y1 = HY[j + 1];
  if (x0 === PARK.x - 10 && y0 === PARK.y - 10) return;
  for (let n = 0; n < 4; n++) {
    const s = i * 31 + j * 7 + n;
    const w = 70 + rnd(s, 2) * 90, d = 60 + rnd(s, 3) * 80;
    const x = x0 + 28 + (n % 2) * ((x1 - x0) / 2 - 6) + rnd(s, 4) * 30, y = y0 + 28 + Math.floor(n / 2) * ((y1 - y0) / 2 - 6) + rnd(s, 5) * 30;
    if (Math.abs(y + d / 2 - riverY(x + w / 2)) < 120) continue;
    if (x > PARK.x - 20 && x < PARK.x + PARK.w && y > PARK.y - 20 && y < PARK.y + PARK.h) continue;
    const b = { x, y, w, d, h: 14 + rnd(s, 6) * 26 };
    if (x > 600 && x < 2000 && y > 600 && y < 2000 && rnd(s, 8) > 0.35) BOXES.push(b); else FOOT.push(b);
  }
}));
const riverPath = (() => {
  const top: string[] = [], bot: string[] = [];
  for (let x = -50; x <= MW + 50; x += 50) { top.push(`${x},${riverY(x) - 46}`); bot.unshift(`${x},${riverY(x) + 46}`); }
  return `M${top.join(" L")} L${bot.join(" L")} Z`;
})();
const label = (x: number, y: number, txt: string, rot = 0, size = 26, color = G.sub, italic = false) => (
  <text key={txt} x={x} y={y} transform={`rotate(${rot} ${x} ${y})`} textAnchor="middle" fontFamily={GF} fontWeight={500} fontStyle={italic ? "italic" : "normal"} fontSize={size} fill={color} stroke="#FFF" strokeWidth={6} paintOrder="stroke" letterSpacing={1}>{txt}</text>
);
const MapSvg: React.FC = () => (
  <svg width={MW} height={MW} viewBox={`0 0 ${MW} ${MW}`} style={{ position: "absolute", left: 0, top: 0 }}>
    <rect width={MW} height={MW} fill={G.land} />
    <rect x={PARK.x} y={PARK.y} width={PARK.w} height={PARK.h} rx={30} fill={G.park} />
    <rect x={150} y={1840} width={300} height={300} rx={30} fill={G.park} />
    <path d={riverPath} fill={G.water} />
    {FOOT.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.w} height={b.d} rx={4} fill={G.bld} />)}
    {VX.map((x) => <line key={`cx${x}`} x1={x} y1={0} x2={x} y2={MW} stroke={x === ART_X ? G.artCasing : G.casing} strokeWidth={x === ART_X ? 40 : 26} />)}
    {HY.map((y) => <line key={`cy${y}`} x1={0} y1={y} x2={MW} y2={y} stroke={y === ART_Y ? G.artCasing : G.casing} strokeWidth={y === ART_Y ? 40 : 26} />)}
    {VX.map((x) => <line key={`rx${x}`} x1={x} y1={0} x2={x} y2={MW} stroke={x === ART_X ? G.art : G.road} strokeWidth={x === ART_X ? 34 : 20} />)}
    {HY.map((y) => <line key={`ry${y}`} x1={0} y1={y} x2={MW} y2={y} stroke={y === ART_Y ? G.art : G.road} strokeWidth={y === ART_Y ? 34 : 20} />)}
    {label(560, ART_Y - 26, "Maximilianstraße", 0, 28)}
    {label(ART_X - 30, 1020, "Karlstraße", -90, 26)}
    {label(1950, HY[2] - 20, "Bahnhofstraße", 0, 24)}
    {label(780, riverY(780) + 10, "Lech", 8, 30, "#3B7FC4", true)}
    {label(PARK.x + PARK.w / 2, PARK.y + PARK.h / 2 + 8, "Stadtpark", 0, 26, "#2E7D45")}
    {[[980, 700, "#E8710A"], [1650, 1360, "#1A73E8"], [700, 1330, "#E8710A"], [1980, 1020, "#9334E6"], [1300, 1980, "#1A73E8"]].map(([x, y, c], i) => (
      <g key={i}><circle cx={x as number} cy={y as number} r={17} fill={c as string} stroke="#FFF" strokeWidth={4} /><circle cx={x as number} cy={y as number} r={5} fill="#FFF" /></g>
    ))}
  </svg>
);
const Building: React.FC<{ b: Box }> = ({ b }) => (
  <div style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.d, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: b.w, height: b.d, background: G.bldTop, transform: `translateZ(${b.h}px)`, borderRadius: 3, boxShadow: "inset 0 0 0 1.5px rgba(0,0,0,0.04)" }} />
    <div style={{ position: "absolute", left: 0, top: b.d, width: b.w, height: b.h, background: G.bldFront, transformOrigin: "0 0", transform: "rotateX(90deg)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: b.w, height: b.h, background: G.bldSide, transformOrigin: "0 0", transform: "rotateX(90deg)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: b.h, height: b.d, background: G.bldSide, transformOrigin: "0 0", transform: "rotateY(-90deg)" }} />
    <div style={{ position: "absolute", left: b.w, top: 0, width: b.h, height: b.d, background: G.bldFront, transformOrigin: "0 0", transform: "rotateY(-90deg)" }} />
  </div>
);

// ---------- 2.5D stage: tilted plane, camera looks at (fx, fy) ----------
export type Cam = { fx: number; fy: number; tilt: number; rz: number; s: number };
export const MapStage: React.FC<{ w: number; h: number; cam: Cam; t: number; children?: React.ReactNode; fog?: boolean; style?: React.CSSProperties; cy?: number }> = ({ w, h, cam, t, children, fog = true, style, cy = 0.56 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "hidden", perspective: 1500, perspectiveOrigin: `50% ${cy * 100 - 22}%`, background: G.land, ...style }}>
    <div style={{ position: "absolute", left: w / 2, top: h * cy, width: MW, height: MW, transformOrigin: "0 0", transformStyle: "preserve-3d", transform: `rotateX(${cam.tilt}deg) rotateZ(${cam.rz}deg) scale(${cam.s}) translate(${-cam.fx}px, ${-cam.fy}px)` }}>
      <MapSvg />
      {BOXES.map((b, i) => <Building key={i} b={b} />)}
      <BlueDot x={1210} y={1260} t={t} />
      {children}
    </div>
    {fog ? <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h * 0.34, background: "linear-gradient(180deg, rgba(242,243,245,0.95), rgba(242,243,245,0))" }} /> : null}
  </div>
);
const BlueDot: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, transform: "translateZ(2px)" }}>
    <div style={{ position: "absolute", inset: 90 - 70 - 8 * Math.sin(t * 3), borderRadius: "50%", background: "rgba(66,133,244,0.18)" }} />
    <div style={{ position: "absolute", left: 90 - 60, top: 90 - 110, width: 120, height: 110, background: "radial-gradient(ellipse at 50% 100%, rgba(66,133,244,0.45), rgba(66,133,244,0) 70%)", clipPath: "polygon(50% 100%, 0 0, 100% 0)" }} />
    <div style={{ position: "absolute", left: 90 - 22, top: 90 - 22, width: 44, height: 44, borderRadius: "50%", background: G.blueDot, border: "7px solid #FFF", boxSizing: "border-box", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} />
  </div>
);

// stands upright on the plane (counter-rotates the stage camera)
export const Billboard: React.FC<{ x: number; y: number; cam: Cam; children: React.ReactNode }> = ({ x, y, cam, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, transformStyle: "preserve-3d" }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0, transformOrigin: "0 0", transform: `rotateZ(${-cam.rz}deg) rotateX(${-cam.tilt}deg) scale(${1 / cam.s})`, transformStyle: "preserve-3d" }}>{children}</div>
  </div>
);
// Google red pin with label; p = drop progress 0..1
export const GPin: React.FC<{ x: number; y: number; cam: Cam; p: number; name?: string; rating?: number; color?: string; size?: number; dim?: boolean; badge?: string }> = ({ x, y, cam, p, name, rating, color = G.red, size = 74, dim, badge }) => {
  if (p <= 0) return null;
  const h = size * 1.42;
  const drop = (1 - Math.min(1, p)) * -160;
  return (
    <>
      <div style={{ position: "absolute", left: x - size * 0.42, top: y - size * 0.16, width: size * 0.84, height: size * 0.32, borderRadius: "50%", background: "rgba(0,0,0,0.28)", filter: "blur(4px)", opacity: Math.min(1, p) * (dim ? 0.5 : 1), transform: `translateZ(1px) scale(${0.5 + 0.5 * Math.min(1, p)})` }} />
      <Billboard x={x} y={y} cam={cam}>
        <div style={{ position: "absolute", left: -size / 2, top: -h + drop, width: size, height: h, opacity: Math.min(1, p * 3) * (dim ? 0.75 : 1) }}>
          <svg width={size} height={h} viewBox="0 0 24 34" style={{ position: "absolute", overflow: "visible", filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.25))" }}>
            <path d="M12 0C5.4 0 0 5.4 0 12c0 8.6 12 22 12 22s12-13.4 12-22C24 5.4 18.6 0 12 0z" fill={color} stroke="rgba(0,0,0,0.12)" strokeWidth={0.6} />
            {badge ? null : <circle cx={12} cy={12} r={4.4} fill={color === G.red ? G.redDark : "rgba(0,0,0,0.25)"} />}
          </svg>
          {badge ? <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.13, textAlign: "center", fontFamily: GF, fontWeight: 700, fontSize: size * 0.38, color: "#FFF" }}>{badge}</div> : null}
          {name ? (
            <div style={{ position: "absolute", left: size * 0.95, top: size * 0.1, whiteSpace: "nowrap", fontFamily: GF, textShadow: "0 0 4px #FFF, 0 0 4px #FFF, 0 0 6px #FFF" }}>
              <div style={{ fontWeight: 700, fontSize: size * 0.4, color: dim ? G.sub : G.redDark }}>{name}</div>
              {rating ? <div style={{ fontWeight: 500, fontSize: size * 0.32, color: G.sub }}>{rating.toLocaleString("de-DE", { minimumFractionDigits: 1 })} <span style={{ color: G.star }}>★</span></div> : null}
            </div>
          ) : null}
        </div>
      </Billboard>
    </>
  );
};

// ---------- Material / Maps UI ----------
const MIC = "M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3zm5-3a5 5 0 01-10 0M12 17v4";
export const GSearch: React.FC<{ text: string; caret?: boolean; w: number; fs?: number; style?: React.CSSProperties }> = ({ text, caret, w, fs = 28, style }) => (
  <div style={{ position: "absolute", width: w, height: fs * 2.5, background: "#FFF", borderRadius: 999, boxShadow: elev, display: "flex", alignItems: "center", gap: fs * 0.55, padding: `0 ${fs * 0.5}px 0 ${fs * 0.75}px`, boxSizing: "border-box", ...style }}>
    <MapsLogo size={fs * 1.25} />
    <span style={{ flex: 1, fontFamily: GF, fontSize: fs, color: text ? G.text : G.sub, whiteSpace: "nowrap", overflow: "hidden" }}>
      {text || "Hier suchen"}
      {caret ? <span style={{ display: "inline-block", width: 2.5, height: fs * 1.05, background: G.blue, marginLeft: 2, verticalAlign: "middle" }} /> : null}
    </span>
    <svg width={fs * 1.1} height={fs * 1.1} viewBox="0 0 24 24"><path d={MIC} fill="none" stroke={G.sub} strokeWidth={2} strokeLinecap="round" /></svg>
    <div style={{ width: fs * 1.55, height: fs * 1.55, borderRadius: "50%", background: "#7C4DFF", color: "#FFF", fontFamily: GF, fontWeight: 500, fontSize: fs * 0.8, display: "flex", alignItems: "center", justifyContent: "center" }}>F</div>
  </div>
);
export const GChip: React.FC<{ text: string; fs?: number; on?: boolean }> = ({ text, fs = 20, on }) => (
  <span style={{ display: "inline-flex", alignItems: "center", height: fs * 1.9, padding: `0 ${fs * 0.8}px`, borderRadius: fs * 0.5, background: on ? G.blueSoft : "#FFF", border: on ? "none" : `1.5px solid ${G.line}`, boxShadow: on ? "none" : "0 1px 3px rgba(60,64,67,0.15)", fontFamily: GF, fontWeight: 500, fontSize: fs, color: on ? "#041E49" : "#3C4043", whiteSpace: "nowrap" }}>{text}</span>
);
export const GStars: React.FC<{ r: number; size?: number }> = ({ r, size = 20 }) => (
  <span style={{ display: "inline-flex" }}>
    {Array.from({ length: 5 }, (_, i) => {
      const f = Math.max(0, Math.min(1, r - i));
      return (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24">
          <defs><linearGradient id={`gs${i}-${Math.round(f * 100)}`}><stop offset={f} stopColor={G.star} /><stop offset={f} stopColor="#DADCE0" /></linearGradient></defs>
          <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill={`url(#gs${i}-${Math.round(f * 100)})`} />
        </svg>
      );
    })}
  </span>
);
// illustrated "photo" thumbnails (no stock images): painted wall + roller
export const GPhoto: React.FC<{ w: number; h: number; hue: number; style?: React.CSSProperties }> = ({ w, h, hue, style }) => (
  <div style={{ width: w, height: h, borderRadius: 12, overflow: "hidden", position: "relative", background: `linear-gradient(160deg, hsl(${hue},45%,82%), hsl(${hue},40%,64%))`, flexShrink: 0, ...style }}>
    <div style={{ position: "absolute", left: "-10%", top: "55%", width: "120%", height: "45%", background: `hsl(${hue + 20},20%,92%)`, transform: "rotate(-6deg)" }} />
    <div style={{ position: "absolute", left: "52%", top: "16%", width: "32%", height: "13%", borderRadius: 4, background: "#FAFAFA", boxShadow: "0 2px 3px rgba(0,0,0,0.2)" }} />
    <div style={{ position: "absolute", left: "66%", top: "29%", width: "4%", height: "38%", background: "#555" }} />
  </div>
);
export type Biz = { name: string; r: number; n: number; cat: string; street: string; hue: number };
export const GResult: React.FC<{ b: Biz; fs?: number; w: number; rank?: number; dim?: boolean; catHi?: "ok" | "err"; actions?: boolean; style?: React.CSSProperties }> = ({ b, fs = 24, w, rank, dim, catHi, actions = true, style }) => (
  <div style={{ width: w, display: "flex", gap: fs * 0.7, padding: `${fs * 0.7}px ${fs * 0.8}px`, boxSizing: "border-box", background: "#FFF", borderBottom: `1px solid ${G.line}`, opacity: dim ? 0.55 : 1, ...style }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: GF, fontWeight: 500, fontSize: fs * 1.12, color: G.text, whiteSpace: "nowrap" }}>{rank ? <span style={{ color: G.sub }}>{rank}. </span> : null}{b.name}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: GF, fontSize: fs * 0.88, color: G.sub, marginTop: fs * 0.2 }}>
        <span style={{ color: G.text }}>{b.r.toLocaleString("de-DE", { minimumFractionDigits: 1 })}</span><GStars r={b.r} size={fs * 0.8} /><span>({b.n})</span>
      </div>
      <div style={{ fontFamily: GF, fontSize: fs * 0.88, color: G.sub, marginTop: fs * 0.15, whiteSpace: "nowrap" }}>
        <span style={catHi ? { color: catHi === "ok" ? G.ok : G.err, background: catHi === "ok" ? G.okSoft : G.errSoft, fontWeight: 700, borderRadius: 6, padding: "1px 8px" } : undefined}>{b.cat}</span> · {b.street}
      </div>
      <div style={{ fontFamily: GF, fontSize: fs * 0.88, marginTop: fs * 0.15, whiteSpace: "nowrap" }}><span style={{ color: G.open, fontWeight: 500 }}>Geöffnet</span><span style={{ color: G.sub }}> · Schließt um 18:00</span></div>
      {actions ? (
        <div style={{ display: "flex", gap: fs * 0.4, marginTop: fs * 0.5 }}>
          <span style={{ fontFamily: GF, fontWeight: 500, fontSize: fs * 0.82, color: "#FFF", background: G.blue, borderRadius: 999, padding: `${fs * 0.3}px ${fs * 0.75}px` }}>Route</span>
          {["Anrufen", "Website"].map((x) => <span key={x} style={{ fontFamily: GF, fontWeight: 500, fontSize: fs * 0.82, color: "#041E49", background: G.blueSoft, borderRadius: 999, padding: `${fs * 0.3}px ${fs * 0.75}px` }}>{x}</span>)}
        </div>
      ) : null}
    </div>
    <GPhoto w={fs * 4.4} h={fs * 4.4} hue={b.hue} />
  </div>
);
// Material 3 outlined text field
export type FieldState = "idle" | "focus" | "err" | "ok";
export const GField: React.FC<{ label: string; value: string; state?: FieldState; w: number; fs?: number; helper?: string; glow?: number; caret?: boolean; icon?: boolean }> = ({ label, value, state = "idle", w, fs = 28, helper, glow = 0, caret, icon = true }) => {
  const col = state === "err" ? G.err : state === "ok" ? G.ok : state === "focus" ? G.blue : "#79747E";
  return (
    <div style={{ width: w, position: "relative" }}>
      <div style={{ height: fs * 2.5, borderRadius: 8, border: `${state === "idle" ? 1.5 : 3}px solid ${col}`, background: state === "err" ? "#FFFBFA" : "#FFF", display: "flex", alignItems: "center", gap: fs * 0.45, padding: `0 ${fs * 0.6}px`, boxSizing: "border-box", boxShadow: glow ? `0 0 0 ${8 * glow}px ${state === "err" ? "rgba(179,38,30,0.16)" : "rgba(11,87,208,0.18)"}` : "none" }}>
        {icon ? <svg width={fs * 1.05} height={fs * 1.05} viewBox="0 0 24 24"><path d="M3 12V4h8l10 10-8 8zM7.5 8.5h.01" fill="none" stroke={col} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" /></svg> : null}
        <span style={{ flex: 1, fontFamily: GF, fontSize: fs, color: state === "err" ? G.err : G.text, whiteSpace: "nowrap" }}>{value}{caret ? <span style={{ display: "inline-block", width: 2.5, height: fs, background: G.blue, marginLeft: 2, verticalAlign: "middle" }} /> : null}</span>
        {state === "err" ? <svg width={fs * 1.05} height={fs * 1.05} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} fill={G.err} /><path d="M12 7v6M12 16.5v.5" stroke="#FFF" strokeWidth={2.4} strokeLinecap="round" /></svg> : null}
        {state === "ok" ? <svg width={fs * 1.05} height={fs * 1.05} viewBox="0 0 24 24"><circle cx={12} cy={12} r={10} fill={G.ok} /><path d="M7.5 12.5l3 3 6-6.5" stroke="#FFF" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
        {state !== "err" && state !== "ok" ? <svg width={fs} height={fs} viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill={G.sub} /></svg> : null}
      </div>
      <span style={{ position: "absolute", left: fs * 0.5, top: -fs * 0.42, background: "#FFF", padding: "0 6px", fontFamily: GF, fontWeight: 500, fontSize: fs * 0.62, color: col, whiteSpace: "nowrap" }}>{label}</span>
      {helper ? <div style={{ fontFamily: GF, fontSize: fs * 0.6, color: col, marginTop: 6, paddingLeft: fs * 0.6, whiteSpace: "nowrap" }}>{helper}</div> : null}
    </div>
  );
};
// header of the Google business profile editor (as in Google Search / Maps)
export const GProfileHead: React.FC<{ fs?: number; title?: string; tab?: number }> = ({ fs = 26, title = "Unternehmensinformationen", tab = 0 }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center", gap: fs * 0.55, padding: `${fs * 0.7}px ${fs * 0.9}px ${fs * 0.4}px` }}>
      <MapsLogo size={fs * 1.2} />
      <div style={{ flex: 1, fontFamily: GF, fontSize: fs * 1.05, color: G.text, whiteSpace: "nowrap" }}>{title}</div>
      <svg width={fs} height={fs} viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke={G.sub} strokeWidth={2} strokeLinecap="round" /></svg>
    </div>
    <div style={{ display: "flex", gap: fs * 1.1, padding: `0 ${fs * 0.9}px`, borderBottom: `1px solid ${G.line}` }}>
      {["Info", "Kontakt", "Standort", "Öffnungszeiten"].map((x, i) => (
        <div key={x} style={{ fontFamily: GF, fontWeight: 500, fontSize: fs * 0.72, color: i === tab ? G.blue : G.sub, padding: `${fs * 0.4}px 0`, borderBottom: i === tab ? `3px solid ${G.blue}` : "3px solid transparent", whiteSpace: "nowrap" }}>{x}</div>
      ))}
    </div>
  </div>
);
// soft 2.5D float for flat panels
export const tilt3d = (t: number, rx: number, ry: number, z = 0) => `perspective(2200px) rotateX(${rx + Math.sin(t * 0.7) * 0.8}deg) rotateY(${ry + Math.sin(t * 0.5 + 1) * 1.2}deg) translateZ(${z}px)`;
export { kk as gk, back as gback };
