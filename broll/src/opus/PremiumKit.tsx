import React from "react";

// Premium-Bausteine für Split-Panels (2026-10-27): warme Bühne mit Licht + Korn, echtes Papier mit Kontaktschatten,
// Tintenstempel, Marker-Striche, 2,5D-Gericht (Oblique-Extrusion), Glas-Chips. Gegen den "weiße Box auf Raster"-Look.

export const PK = {
  cream: "#F6EFE6", peach: "#F3D9C8", ink: "#16130F", sub: "#7C756B", orange: "#D97757", orangeDeep: "#B4532F",
  red: "#D2403A", green: "#1E9E57", paper: "#FFFDF8", paperEdge: "#EDE5D8", marker: "rgba(255,190,110,0.62)",
};
export const paperShadow = "0 1px 1px rgba(60,40,20,0.10), 0 10px 18px -6px rgba(90,55,30,0.28), 0 38px 70px -18px rgba(90,55,30,0.38)";

export const Grain: React.FC<{ opacity?: number; id?: string }> = ({ opacity = 0.09, id = "pkgrain" }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <filter id={id}><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

// warm stage: cream base, soft orange key light top right, cool fill bottom left, vignette, grain
export const Stage: React.FC<{ t: number; key2?: string; grid?: boolean }> = ({ t, key2 = "rgba(217,119,87,0.42)", grid = true }) => (
  <div style={{ position: "absolute", inset: -80, background: PK.cream, overflow: "hidden" }}>
    {grid ? <div style={{ position: "absolute", inset: -40, backgroundImage: "linear-gradient(rgba(90,60,30,0.07) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(90,60,30,0.07) 1.5px, transparent 1.5px)", backgroundSize: "36px 36px", transform: `translate(${Math.sin(t * 0.5) * 10}px, ${Math.cos(t * 0.4) * 8}px)` }} /> : null}
    <div style={{ position: "absolute", left: "52%", top: "-10%", width: 900, height: 700, borderRadius: "50%", background: key2, filter: "blur(120px)", transform: `translate(${Math.sin(t * 0.4) * 40}px, ${Math.cos(t * 0.3) * 30}px)` }} />
    <div style={{ position: "absolute", left: "-15%", top: "55%", width: 800, height: 600, borderRadius: "50%", background: "rgba(150,170,200,0.28)", filter: "blur(120px)" }} />
    {/* window-blind shadows falling across the desk from the key light */}
    <div style={{ position: "absolute", left: "-30%", top: "-30%", width: "160%", height: "160%", transform: `rotate(-24deg) translateY(${Math.sin(t * 0.25) * 12}px)`, backgroundImage: "repeating-linear-gradient(180deg, rgba(110,70,35,0) 0px, rgba(110,70,35,0) 58px, rgba(110,70,35,0.10) 74px, rgba(110,70,35,0.10) 104px, rgba(110,70,35,0) 120px)", filter: "blur(7px)", mixBlendMode: "multiply" }} />
    {/* warm light shafts */}
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: "absolute", left: `${48 + i * 14}%`, top: "-20%", width: 90 + i * 40, height: "150%", transform: "rotate(28deg)", transformOrigin: "50% 0%", background: "linear-gradient(180deg, rgba(255,226,190,0.55), rgba(255,226,190,0) 75%)", filter: "blur(22px)", opacity: 0.55 + 0.25 * Math.sin(t * 0.7 + i * 1.7), mixBlendMode: "screen" }} />
    ))}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,255,255,0) 55%, rgba(80,50,25,0.16))" }} />
    <Grain />
  </div>
);

export const Paper: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; fold?: boolean; sheen?: number }> = ({ style, children, fold = true, sheen = 0 }) => (
  <div style={{ position: "absolute", background: `linear-gradient(160deg, #FFFFFF 0%, ${PK.paper} 45%, #F7F0E4 100%)`, borderRadius: 6, boxShadow: paperShadow, overflow: "hidden", ...style }}>
    {children}
    {fold ? <div style={{ position: "absolute", right: 0, top: 0, width: 46, height: 46, background: "linear-gradient(225deg, rgba(0,0,0,0) 50%, #EADFCF 50%, #F8F2E8 100%)", boxShadow: "-3px 3px 6px rgba(80,50,25,0.12)" }} /> : null}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 35%)", pointerEvents: "none" }} />
    <Sheen p={sheen} />
  </div>
);

// rubber stamp with uneven ink (turbulence knock-out)
export const InkStamp: React.FC<{ text: string; p: number; color?: string; size?: number; rot?: number; style?: React.CSSProperties; id: string }> = ({ text, p, color = PK.red, size = 46, rot = -12, style, id }) => {
  if (p <= 0) return null;
  const w = text.length * size * 0.72 + size * 0.9, h = size * 1.55;
  return (
    <svg width={w} height={h} style={{ position: "absolute", overflow: "visible", transform: `rotate(${rot}deg) scale(${1.9 - 0.9 * p})`, opacity: Math.min(1, p * 1.4) * 0.92, mixBlendMode: "multiply", ...style }}>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.55" result="m" />
        <feComposite in="SourceGraphic" in2="m" operator="in" result="c" />
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={1} seed={7} result="d" />
        <feDisplacementMap in="c" in2="d" scale={3} />
      </filter>
      <g filter={`url(#${id})`}>
        <rect x={size * 0.12} y={size * 0.12} width={w - size * 0.24} height={h - size * 0.24} rx={size * 0.18} fill="none" stroke={color} strokeWidth={size * 0.11} />
        <text x={w / 2} y={h / 2 + size * 0.36} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={800} fontSize={size} letterSpacing={size * 0.06} fill={color}>{text}</text>
      </g>
    </svg>
  );
};

// hand-drawn marker strike / underline, drawn on with p
export const Brush: React.FC<{ w: number; p: number; color?: string; sw?: number; style?: React.CSSProperties; kind?: "strike" | "under" }> = ({ w, p, color = PK.red, sw = 10, style, kind = "strike" }) => {
  const d = kind === "strike" ? `M4 ${sw * 1.6} C ${w * 0.3} ${sw * 0.9}, ${w * 0.6} ${sw * 2.1}, ${w - 4} ${sw * 1.1}` : `M4 ${sw} Q ${w * 0.5} ${sw * 1.9} ${w - 4} ${sw * 0.7}`;
  return (
    <svg width={w} height={sw * 3} style={{ position: "absolute", overflow: "visible", pointerEvents: "none", ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
    </svg>
  );
};

// marker highlight behind a text block
export const Highlight: React.FC<{ p: number; color?: string; style?: React.CSSProperties }> = ({ p, color = PK.marker, style }) => (
  <div style={{ position: "absolute", left: -8, right: -8, top: 2, bottom: 0, background: color, borderRadius: "3px 10px 4px 12px", transform: `scaleX(${p}) skewX(-6deg)`, transformOrigin: "0% 50%", mixBlendMode: "multiply", ...style }} />
);

// 2.5D courthouse: oblique extrusion (dark copy offset), warm gradient front, contact shadow
export const Courthouse: React.FC<{ size: number; color?: string; dark?: string; style?: React.CSSProperties }> = ({ size, color = "#FBF6EE", dark = "#C9B8A2", style }) => {
  const front = (
    <>
      <path d="M60 8 L112 36 L8 36 Z" />
      <rect x={10} y={38} width={100} height={8} rx={1.5} />
      {[18, 38, 58, 78, 98].map((x) => <rect key={x} x={x - 4} y={50} width={8} height={40} rx={2} />)}
      <rect x={8} y={92} width={104} height={7} rx={1.5} />
      <rect x={2} y={101} width={116} height={8} rx={1.5} />
    </>
  );
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      <div style={{ position: "absolute", left: "8%", right: "-4%", bottom: -size * 0.04, height: size * 0.12, borderRadius: "50%", background: "rgba(70,40,15,0.30)", filter: `blur(${size * 0.05}px)` }} />
      <svg width={size} height={size} viewBox="0 0 120 112" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="pkcourt" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor={color} /></linearGradient>
        </defs>
        <g transform="translate(7 -5)" fill={dark}>{front}</g>
        <g transform="translate(3.5 -2.5)" fill={dark} opacity={0.7}>{front}</g>
        <g fill="url(#pkcourt)" stroke="rgba(120,90,60,0.25)" strokeWidth={0.6}>{front}</g>
      </svg>
    </div>
  );
};

// frosted glass chip
export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", background: "linear-gradient(150deg, rgba(255,255,255,0.86), rgba(255,255,255,0.62))", border: "1.5px solid rgba(255,255,255,0.9)", borderRadius: 22, boxShadow: "0 18px 40px -12px rgba(90,55,30,0.35), inset 0 1px 0 rgba(255,255,255,0.9)", backdropFilter: "blur(14px)", ...style }}>{children}</div>
);

// ---------- cinematic layer (2026-10-27 v4): bokeh dust, out-of-focus foreground, light sweep, grade ----------
const rr = (i: number, s = 1) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

// soft dust motes floating in the key light (screen blend)
export const Bokeh: React.FC<{ t: number; n?: number; w?: number; h?: number; seed?: number; opacity?: number }> = ({ t, n = 22, w = 1080, h = 820, seed = 1, opacity = 1 }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", opacity }}>
    {Array.from({ length: n }, (_, i) => {
      const sz = 6 + rr(i, seed) * 26, sp = 6 + rr(i, seed + 1) * 14;
      const x = (rr(i, seed + 2) * w + Math.sin(t * 0.3 + i) * 30) % w;
      const y = (((rr(i, seed + 3) * h - t * sp) % h) + h) % h;
      const a = 0.45 + 0.55 * rr(i, seed + 4) * (0.6 + 0.4 * Math.sin(t * 1.3 + i * 2));
      return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,236,214,${a}) 0%, rgba(255,214,180,${a * 0.5}) 45%, rgba(255,214,180,0) 70%)`, filter: `blur(${sz > 22 ? 3 : 1}px)` }} />;
    })}
  </div>
);

// diagonal light sweep across a surface, p 0→1
export const Sheen: React.FC<{ p: number; strength?: number }> = ({ p, strength = 0.75 }) =>
  p <= 0 || p >= 1 ? null : (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: "inherit" }}>
      <div style={{ position: "absolute", top: "-60%", bottom: "-60%", width: "38%", left: `${-50 + p * 170}%`, transform: "rotate(18deg)", background: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,${strength}), rgba(255,255,255,0))`, mixBlendMode: "soft-light" }} />
      <div style={{ position: "absolute", top: "-60%", bottom: "-60%", width: "10%", left: `${-38 + p * 170}%`, transform: "rotate(18deg)", background: `linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,${strength * 0.6}), rgba(255,255,255,0))` }} />
    </div>
  );

// out-of-focus foreground props (pen + paper clip + corner of a sheet), drawn big and blurred, parallax handled by caller
export const Foreground: React.FC<{ t: number; kind?: "desk" | "light" }> = ({ t, kind = "desk" }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    {kind === "desk" ? (
      <>
        <div style={{ position: "absolute", right: -150, bottom: 40, width: 460, height: 46, borderRadius: 23, transform: `rotate(-28deg) translateY(${Math.sin(t * 0.8) * 4}px)`, background: "linear-gradient(180deg, #2B2724, #0F0D0C 60%, #3A332D)", filter: "blur(11px)", opacity: 0.55, boxShadow: "0 0 0 6px rgba(217,119,87,0.0)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 70, height: 46, borderRadius: "23px 0 0 23px", background: "linear-gradient(180deg, #E4A07F, #B4532F)" }} />
        </div>
      </>
    ) : null}
  </div>
);

// warm cinematic grade on top of a panel: top light, bottom falloff, slight vignette
export const Grade: React.FC<{ warm?: number }> = ({ warm = 1 }) => (
  <>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(180deg, rgba(255,214,170,${0.10 * warm}) 0%, rgba(255,255,255,0) 35%, rgba(60,35,15,${0.10 * warm}) 100%)`, mixBlendMode: "multiply" }} />
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 90% 85% at 55% 40%, rgba(0,0,0,0) 60%, rgba(70,40,15,0.16) 100%)" }} />
  </>
);

// ---------- objects for the court scenes (v5) ----------
// physical ruler lying on the desk: ticks, painted zones, raised limit pin, invoice tag pinned at `val`
export const Ruler3D: React.FC<{ t: number; w: number; limit: number; val?: number; tagP: number; hot?: boolean; max?: number; style?: React.CSSProperties }> = ({ t, w, limit, val = 6480, tagP, hot, max = 12000, style }) => {
  const x = (v: number) => (v / max) * w;
  const inG = val <= limit;
  const pulse = hot ? 0.75 + 0.25 * Math.abs(Math.sin(t * 5)) : 0.85;
  return (
    <div style={{ position: "absolute", width: w, height: 250, ...style }}>
      <div style={{ position: "absolute", left: 0, top: 120, width: w, height: 112, borderRadius: 12, background: "linear-gradient(180deg, #FFFDF8 0%, #F1E8DA 70%, #D9CBB5 100%)", boxShadow: "0 2px 0 #C8B79C, 0 6px 0 #B9A688, 0 28px 40px -12px rgba(90,55,30,0.45)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 34, backgroundImage: `repeating-linear-gradient(90deg, rgba(40,30,20,0.55) 0 2px, transparent 2px ${x(500)}px)` , WebkitMaskImage: "linear-gradient(180deg, #000 60%, transparent)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 52, backgroundImage: `repeating-linear-gradient(90deg, rgba(40,30,20,0.75) 0 3px, transparent 3px ${x(1000)}px)`, WebkitMaskImage: "linear-gradient(180deg, #000 70%, transparent)" }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: x(limit), height: 40, background: `linear-gradient(180deg, #2FB56A, ${PK.green})`, display: "flex", alignItems: "center", paddingLeft: 16, boxSizing: "border-box", fontFamily: "JetBrains Mono", fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden" }}>AMTSGERICHT</div>
        <div style={{ position: "absolute", left: x(limit), right: 0, bottom: 0, height: 40, background: `linear-gradient(180deg, #EE625C, ${PK.red})`, opacity: pulse, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, boxSizing: "border-box", fontFamily: "JetBrains Mono", fontWeight: 800, fontSize: 18, letterSpacing: "0.12em", color: "#FFF", whiteSpace: "nowrap", overflow: "hidden" }}>LANDGERICHT</div>
        {[0, 5000, 10000].map((v) => <div key={v} style={{ position: "absolute", left: Math.max(6, x(v) + 6), top: 50, fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 19, color: "#4A3F33" }}>{v.toLocaleString("de-DE")}</div>)}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0) 30%)" }} />
      </div>
      {/* raised brass limit pin */}
      <div style={{ position: "absolute", left: x(limit) - 9, top: 96, width: 18, height: 150, borderRadius: 9, background: "linear-gradient(90deg, #8E6B2E, #F3D9A0 45%, #B98F45 70%, #6E5222)", boxShadow: "4px 10px 14px rgba(60,35,10,0.45)" }} />
      <div style={{ position: "absolute", left: x(limit) - 20, top: 84, width: 40, height: 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFF1CC, #D2A85A 45%, #7A5A24)", boxShadow: "0 6px 10px rgba(60,35,10,0.4)" }} />
      {/* invoice tag pinned at the value */}
      {tagP > 0 ? (
        <div style={{ position: "absolute", left: x(val), top: 0, transform: `translate(-50%, ${(1 - tagP) * -90}px) rotate(${(1 - tagP) * 14 - 4 + Math.sin(t * 1.6) * 1.2}deg)`, transformOrigin: "50% 100%", opacity: Math.min(1, tagP * 2) }}>
          <div style={{ position: "relative", padding: "12px 18px 12px 16px", background: "linear-gradient(160deg, #FFFFFF, #F7EFE2)", borderRadius: 6, boxShadow: "0 1px 1px rgba(60,40,20,0.1), 0 14px 24px -6px rgba(90,55,30,0.4)", borderLeft: `6px solid ${inG ? PK.green : PK.red}`, whiteSpace: "nowrap" }}>
            <div style={{ fontFamily: "JetBrains Mono", fontWeight: 800, fontSize: 14, letterSpacing: "0.12em", color: PK.sub }}>DEINE RECHNUNG</div>
            <div style={{ fontFamily: "Newsreader", fontWeight: 600, fontSize: 34, color: PK.ink, lineHeight: 1.1 }}>6.480 €</div>
          </div>
          <div style={{ margin: "0 auto", width: 4, height: 54, background: "linear-gradient(90deg, #6B6B6B, #D8D8D8, #6B6B6B)", borderRadius: 2 }} />
          <div style={{ position: "absolute", left: "50%", top: -10, width: 22, height: 22, marginLeft: -11, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #FFB3A8, ${inG ? PK.green : PK.red} 55%, #6E1E1A)`, boxShadow: "0 4px 6px rgba(0,0,0,0.35)" }} />
        </div>
      ) : null}
    </div>
  );
};

// engraved brass plaque
export const Plaque: React.FC<{ text: string; sub?: string; w: number; style?: React.CSSProperties; size?: number }> = ({ text, sub, w, style, size = 44 }) => (
  <div style={{ position: "absolute", width: w, padding: "18px 0 16px", borderRadius: 10, background: "linear-gradient(165deg, #F6E1AE 0%, #D6B26A 38%, #A7803B 52%, #E9CB86 70%, #B58C44 100%)", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -3px 0 rgba(90,60,20,0.35), 0 18px 30px -10px rgba(70,45,15,0.55)", textAlign: "center", ...style }}>
    <div style={{ fontFamily: "Newsreader", fontWeight: 600, fontSize: size, letterSpacing: "0.16em", color: "#5A4116", textShadow: "0 1.5px 0 rgba(255,240,200,0.7), 0 -1px 0 rgba(60,40,10,0.5)" }}>{text}</div>
    {sub ? <div style={{ fontFamily: "Newsreader", fontStyle: "italic", fontSize: size * 0.5, color: "#5A4116", opacity: 0.85, marginTop: 2, textShadow: "0 1px 0 rgba(255,240,200,0.6)" }}>{sub}</div> : null}
    {[12, w - 24].map((l) => <div key={l} style={{ position: "absolute", left: l, top: "50%", width: 12, height: 12, marginTop: -6, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #FFF3D0, #8E6B2E)" }} />)}
  </div>
);

// velvet rope barrier between two brass posts; p = drop-in, sign hangs at signX
export const VelvetRope: React.FC<{ t: number; p: number; w: number; signX: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ t, p, w, signX, style, children }) => {
  if (p <= 0) return null;
  const sag = 120 * p, swing = Math.sin(t * 2.2) * 4 * p;
  const post = (x: number) => (
    <g key={x}>
      <ellipse cx={x} cy={318} rx={46} ry={12} fill="rgba(60,35,10,0.35)" />
      <rect x={x - 30} y={296} width={60} height={18} rx={9} fill="url(#brass)" />
      <rect x={x - 9} y={40} width={18} height={262} rx={9} fill="url(#brassV)" />
      <circle cx={x} cy={38} r={20} fill="url(#brassB)" />
    </g>
  );
  return (
    <div style={{ position: "absolute", width: w, height: 340, transform: `translateY(${(1 - p) * -60}px)`, opacity: Math.min(1, p * 2), ...style }}>
      <svg width={w} height={340} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="brass" x1="0" x2="1"><stop offset="0" stopColor="#7A5A24" /><stop offset="0.45" stopColor="#F3D9A0" /><stop offset="1" stopColor="#8E6B2E" /></linearGradient>
          <linearGradient id="brassV" x1="0" x2="1"><stop offset="0" stopColor="#6E5222" /><stop offset="0.4" stopColor="#F6E1AE" /><stop offset="0.7" stopColor="#B98F45" /><stop offset="1" stopColor="#5E4519" /></linearGradient>
          <radialGradient id="brassB" cx="0.35" cy="0.3"><stop offset="0" stopColor="#FFF3D0" /><stop offset="0.5" stopColor="#D2A85A" /><stop offset="1" stopColor="#6E5222" /></radialGradient>
          <linearGradient id="rope" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F0605A" /><stop offset="0.5" stopColor="#B4231F" /><stop offset="1" stopColor="#6E0F0C" /></linearGradient>
        </defs>
        <path d={`M40 62 Q ${w / 2 + swing} ${62 + sag * 2 - 40} ${w - 40} 62`} fill="none" stroke="rgba(60,20,10,0.25)" strokeWidth={26} strokeLinecap="round" transform="translate(6 14)" style={{ filter: "blur(4px)" }} />
        <path d={`M40 62 Q ${w / 2 + swing} ${62 + sag * 2 - 40} ${w - 40} 62`} fill="none" stroke="url(#rope)" strokeWidth={24} strokeLinecap="round" />
        <path d={`M40 56 Q ${w / 2 + swing} ${56 + sag * 2 - 40} ${w - 40} 56`} fill="none" stroke="rgba(255,190,180,0.45)" strokeWidth={4} strokeLinecap="round" />
        {post(40)}
        {post(w - 40)}
      </svg>
      <div style={{ position: "absolute", left: signX, top: 62 + sag - 20, transform: `translateX(-50%) rotate(${swing * 0.8}deg)`, transformOrigin: "50% 0%" }}>
        <svg width={120} height={40} style={{ position: "absolute", left: "50%", marginLeft: -60, top: -6 }}><path d="M20 4 L60 34 L100 4" fill="none" stroke="#B98F45" strokeWidth={3} /></svg>
        <div style={{ marginTop: 30 }}>{children}</div>
      </div>
    </div>
  );
};
