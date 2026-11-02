import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { fonts } from "../theme";

// boilr.ai video ad v2 (2026-09-30, user feedback on v1): less content, slower, one thing at a time.
// The camera always centres on the element that gets clicked and the cursor enters from close by,
// so the eye never has to jump. The hook is a large, typeset signal card built from the real first
// result of the fintech watch (company blurred), not a tiny table row.

const { fontFamily: playfair } = loadPlayfair("italic", { weights: ["800"], subsets: ["latin"] });
const C = { green: "#005032", card: "#0A5F45", mint: "#DDEBE3", bg: "#F5F5F1", ink: "#111416", muted: "#55575B" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.33, 1, 0.68, 1);

export const BOILR_AD_V2_SECONDS = 21.5;
const HOOKBTN = { dx: (tall: boolean) => (tall ? 170 : 150), dy: (tall: boolean) => (tall ? 800 : 520) };
const T = { brand: 5.4, agent: 6.8, results: 14.4, contact: 16.9, end: 18.8 };

type Cam = { cx: number; cy: number; w: number };
type Shot = { img: string; iw: number; ih: number; from: number; to: number; cam: Cam; click?: { t: number; x: number; y: number } };
const SHOTS: Shot[] = [
  { img: "1.png", iw: 2000, ih: 1095, from: T.agent, to: 9.2, cam: { cx: 880, cy: 1000, w: 820 }, click: { t: 8.95, x: 1412, y: 1035 } },
  { img: "2.png", iw: 2000, ih: 1095, from: 9.2, to: 11.0, cam: { cx: 760, cy: 650, w: 640 }, click: { t: 10.6, x: 600, y: 624 } },
  { img: "5.png", iw: 2000, ih: 1095, from: 11.0, to: 12.8, cam: { cx: 760, cy: 720, w: 640 }, click: { t: 12.4, x: 587, y: 705 } },
  { img: "10.png", iw: 2000, ih: 1095, from: 12.8, to: T.results, cam: { cx: 830, cy: 780, w: 760 }, click: { t: 14.05, x: 497, y: 944 } },
  { img: "14.png", iw: 2000, ih: 1095, from: T.results, to: T.contact, cam: { cx: 1390, cy: 330, w: 820 }, click: { t: 15.6, x: 1697, y: 294 } },
];
const HEAD = [
  { from: 0, to: 3.2, a: "This fintech just hired a new leader.", b: "More hires usually follow." },
  { from: 3.2, to: T.brand, a: "And this is who to call.", b: "Before anyone else does." },
  { from: T.agent, to: 9.2, a: "Tell the agent who you place.", b: "In plain words." },
  { from: 9.2, to: 12.8, a: "It asks the right questions.", b: "Like a good researcher." },
  { from: 12.8, to: T.results, a: "Then it watches the market.", b: "Every day." },
  { from: T.results, to: T.contact, a: "7 fintechs found this month.", b: "Add the one you want." },
  { from: T.contact, to: T.end, a: "It lands in your leads.", b: "Direct line in one click." },
];

const Arrow: React.FC = () => (
  <svg width={38} height={57} viewBox="0 0 20 30" style={{ overflow: "visible", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.35))" }}>
    <path d="M1 1 L1 23 L6.5 17.8 L10.3 27 L14 25.4 L10.3 16.6 L17.8 16.6 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

// Cursor that glides in from close by (below-right of the target) and clicks.
const Cursor: React.FC<{ x: number; y: number; click: number; appear: number }> = ({ x, y, click, appear }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < appear) return null;
  const p = interpolate(t, [appear, click - 0.1], [0, 1], { ...clamp, easing: ease });
  const cx = x + 110 * (1 - p), cy = y + 130 * (1 - p);
  const ring = interpolate(t, [click, click + 0.4], [0, 1], clamp);
  const press = t >= click && t < click + 0.12 ? 0.9 : 1;
  return (
    <div style={{ position: "absolute", left: cx, top: cy, opacity: interpolate(t, [appear, appear + 0.15], [0, 1], clamp) }}>
      {t >= click && ring < 1 && <div style={{ position: "absolute", left: -34 * ring, top: -34 * ring, width: 68 * ring, height: 68 * ring, borderRadius: "50%", border: `5px solid ${C.card}`, opacity: 1 - ring }} />}
      <div style={{ transform: `scale(${press})`, transformOrigin: "0 0" }}><Arrow /></div>
    </div>
  );
};

const Headline: React.FC<{ a: string; b: string; from: number; to: number; top: number; size: number }> = ({ a, b, from, to, top, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < from || t >= to) return null;
  const p = from <= 0 ? 1 : spring({ frame: frame - from * fps, fps, config: { damping: 18, stiffness: 160 } });
  const p2 = from <= 0 ? 1 : spring({ frame: frame - (from + 0.35) * fps, fps, config: { damping: 18, stiffness: 160 } });
  return (
    <div style={{ position: "absolute", top, left: 40, width: 1000, textAlign: "center" }}>
      <div style={{ fontFamily: fonts.bold, fontSize: size, color: C.ink, letterSpacing: -1.5, lineHeight: 1.1, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>{a}</div>
      <div style={{ fontFamily: playfair, fontWeight: 800, fontStyle: "italic", fontSize: size * 1.08, color: C.green, lineHeight: 1.2, opacity: p2, transform: `translateY(${(1 - p2) * 20}px)` }}>{b}</div>
    </div>
  );
};

const Chip: React.FC<{ children: React.ReactNode; size: number }> = ({ children, size }) => (
  <div style={{ padding: `${size * 0.35}px ${size * 0.7}px`, borderRadius: 999, background: "#F1F2EF", fontFamily: fonts.semibold, fontSize: size, color: C.ink }}>{children}</div>
);

// Hook: the real first result of the fintech watch, typeset large. Company name blurred.
const SignalCard: React.FC<{ w: number; tall: boolean }> = ({ w, tall }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const who = spring({ frame: frame - 3.3 * fps, fps, config: { damping: 18, stiffness: 150 } });
  const revealed = t >= 4.25;
  const s = tall ? 1.14 : 0.9;
  return (
    <div style={{ width: w, borderRadius: 40, background: "#fff", boxShadow: "0 30px 70px rgba(0,40,25,0.16), 0 0 0 1px rgba(0,0,0,0.04)", padding: 48 * s, display: "flex", flexDirection: "column", gap: 30 * s }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: "#2FB36B", boxShadow: "0 0 0 6px rgba(47,179,107,0.18)" }} />
        <span style={{ fontFamily: fonts.bold, fontSize: 26 * s, letterSpacing: 3, color: C.card }}>NEW SIGNAL · 23 SEP 2026</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 72 * s, height: 72 * s, borderRadius: 18, background: "linear-gradient(135deg,#9FB7C9,#6D8FA8)", filter: "blur(6px)" }} />
        <div style={{ width: 300 * s, height: 34 * s, borderRadius: 10, background: "#C9CDD2", filter: "blur(7px)" }} />
      </div>
      <div style={{ fontFamily: fonts.bold, fontSize: 60 * s, lineHeight: 1.08, color: C.ink, letterSpacing: -1.5 }}>New senior leader<br />appointed</div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Chip size={30 * s}>Fintech</Chip><Chip size={30 * s}>London</Chip><Chip size={30 * s}>49 employees</Chip>
      </div>
      <div style={{ maxHeight: 260 * who, overflow: "hidden", opacity: who }}>
        <div style={{ borderTop: "2px solid #EEF0EC", paddingTop: 28 * s, display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontFamily: fonts.bold, fontSize: 24 * s, letterSpacing: 3, color: C.muted }}>WHO TO CALL</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 60 * s, height: 60 * s, borderRadius: 30 * s, background: "#D9DDE1", filter: "blur(4px)" }} />
              <div>
                <div style={{ width: 220 * s, height: 26 * s, borderRadius: 8, background: "#C9CDD2", filter: "blur(6px)", marginBottom: 10 }} />
                <span style={{ fontFamily: fonts.medium, fontSize: 26 * s, color: C.muted }}>Decision maker</span>
              </div>
            </div>
            <div style={{ padding: `${16 * s}px ${26 * s}px`, borderRadius: 999, background: revealed ? C.mint : C.card, color: revealed ? C.green : "#fff", fontFamily: fonts.bold, fontSize: 30 * s, letterSpacing: revealed ? 1 : 0 }}>{revealed ? "+44 7••• ••• •••" : "Show number"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BoilrAdV2: React.FC<{ h: number }> = ({ h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tall = h > 1500;
  const L = tall
    ? { headTop: 300, headSize: 58, cardX: 50, cardY: 590, cardW: 980, cardH: 860, contactY: 1000 }
    : { headTop: 64, headSize: 52, cardX: 60, cardY: 270, cardW: 960, cardH: 800, contactY: 600 };
  const ratio = L.cardH / L.cardW;
  const si = SHOTS.findIndex((s) => t >= s.from && t < s.to);
  const shot = si >= 0 ? SHOTS[si] : null;

  const geom = (s: Shot) => {
    const w = s.cam.w, hh = w * ratio;
    const x0 = Math.max(0, Math.min(s.iw - w, s.cam.cx - w / 2));
    const y0 = Math.max(0, Math.min(s.ih - hh, s.cam.cy - hh / 2));
    return { x0, y0, sc: L.cardW / w };
  };

  const brandP = interpolate(t, [T.brand, T.brand + 0.3, T.agent - 0.25, T.agent], [0, 1, 1, 0], clamp);
  const endP = spring({ frame: frame - T.end * fps, fps, config: { damping: 18, stiffness: 140 } });
  const typed = "Find companies about to hire a Head of Sales in London";
  const typedP = interpolate(t, [7.3, 8.7], [0, 1], clamp);

  // contact row (real screenshot 13.png, name blurred): x 600-1850 of 2000
  const cx0 = 600, cx1 = 1850;
  const csc = (L.cardW - 40) / (cx1 - cx0);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {t < T.end && HEAD.map((hd, i) => <Headline key={i} {...hd} top={L.headTop} size={L.headSize} />)}

      {/* hook: big signal card */}
      {t < T.brand && (
        <div style={{ position: "absolute", left: L.cardX, top: L.cardY + (tall ? 110 : 0), transform: `scale(${1 + 0.02 * (t / T.brand)})`, transformOrigin: "50% 30%" }}>
          <SignalCard w={L.cardW} tall={tall} />
        </div>
      )}
      {t >= 3.75 && t < 4.35 && <Cursor x={L.cardX + L.cardW - HOOKBTN.dx(tall)} y={L.cardY + HOOKBTN.dy(tall)} appear={3.75} click={4.2} />}

      {/* product screens */}
      {shot && (() => {
        const g = geom(shot);
        const inP = spring({ frame: frame - shot.from * fps, fps, config: { damping: 20, stiffness: 200 } });
        const first = si === 0 || si === 4;
        return (
          <>
            <div style={{ position: "absolute", left: L.cardX, top: L.cardY, width: L.cardW, height: L.cardH, borderRadius: 34, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(0,40,25,0.16), 0 0 0 1px rgba(0,0,0,0.05)", opacity: first ? Math.min(1, inP * 1.3) : 1, transform: `scale(${first ? 0.96 + 0.04 * inP : 1})` }}>
              <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${-g.x0 * g.sc}px, ${-g.y0 * g.sc}px) scale(${g.sc})` }}>
                <Img src={staticFile(`boilr-ad/${shot.img}`)} style={{ width: shot.iw, height: shot.ih, display: "block" }} />
                {si === 0 && (
                  <div style={{ position: "absolute", left: 488, top: 1012, width: 880, height: 46, background: "#F4F4F4", display: "flex", alignItems: "center" }}>
                    <span style={{ fontFamily: fonts.regular, fontSize: 22, color: typedP > 0 ? "#1C1C1C" : "#8E8E8E" }}>{typedP > 0 ? typed.slice(0, Math.round(typed.length * typedP)) : "Message your agent..."}</span>
                  </div>
                )}
                {si === 4 && (
                  <>
                    <div style={{ position: "absolute", left: 0, top: 0, width: 2000, height: 266, background: "rgba(250,250,248,0.8)" }} />
                    <div style={{ position: "absolute", left: 0, top: 324, width: 2000, height: 800, background: "rgba(250,250,248,0.8)" }} />
                    {t >= shot.click!.t + 0.05 && <div style={{ position: "absolute", left: 1650, top: 277, width: 96, height: 35, borderRadius: 18, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 18, color: C.green }}>✓ Added</div>}
                  </>
                )}
              </div>
            </div>
            {shot.click && (
              <Cursor x={L.cardX + (shot.click.x - g.x0) * g.sc} y={L.cardY + (shot.click.y - g.y0) * g.sc} appear={Math.max(shot.from + 0.5, shot.click.t - 1.1)} click={shot.click.t} />
            )}
          </>
        );
      })()}

      {/* "Added to My Leads" toast, right under the row that was clicked */}
      {t >= 15.7 && t < T.contact && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: L.cardY + L.cardH * 0.62, display: "flex", justifyContent: "center", opacity: interpolate(t, [15.7, 15.95], [0, 1], clamp) }}>
          <div style={{ padding: "18px 32px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: fonts.semibold, fontSize: 34, boxShadow: "0 16px 36px rgba(0,0,0,0.25)" }}><span style={{ color: "#7BE0A6" }}>✓</span> Added to My Leads</div>
        </div>
      )}

      {/* contact row in My Leads: one click for the direct line. The card zooms into the phone column. */}
      {t >= T.contact && t < T.end && (() => {
        const p = spring({ frame: frame - T.contact * fps, fps, config: { damping: 18, stiffness: 160 } });
        const z = 1 + 0.6 * interpolate(t, [17.15, 17.6], [0, 1], { ...clamp, easing: ease });
        const phoneCardX = (1560 - cx0) * csc;           // phone pill centre inside the card (unzoomed)
        const o = L.cardW - 60;                           // zoom anchored near the right edge so the revealed number stays in view
        const h0 = 178 * csc, hz = h0 * z;
        const top = L.cardY + L.cardH * 0.45 - hz / 2;
        const left = L.cardX + 20;
        return (
          <>
            <div style={{ position: "absolute", left, top, width: L.cardW - 40, height: hz, borderRadius: 24, overflow: "hidden", background: "#fff", boxShadow: "0 24px 60px rgba(0,40,25,0.2)", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px)` }}>
              <div style={{ position: "absolute", left: 0, top: 0, width: L.cardW - 40, height: hz, transformOrigin: `${o}px 0px`, transform: `scale(${z})` }}>
                <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${-cx0 * csc}px, 0) scale(${csc})` }}>
                  <Img src={staticFile("boilr-ad/13.png")} style={{ width: 2000, height: 178, display: "block" }} />
                  {t >= 17.95 && <div style={{ position: "absolute", left: 1505, top: 94, width: 320, height: 54, borderRadius: 27, background: C.mint, display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 28, color: C.green, letterSpacing: 1 }}>+44 7••• ••• •••</div>}
                </div>
              </div>
            </div>
            <Cursor x={left + o + (phoneCardX - o) * z} y={top + 120 * csc * z} appear={17.35} click={17.9} />
          </>
        );
      })()}

      {/* brand beat */}
      {brandP > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,80,50,${brandP})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ opacity: brandP, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <Img src={staticFile("boilr-ad/logo.png")} style={{ width: 170, height: 170, borderRadius: 40, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 72, color: "#fff", letterSpacing: -2 }}>boilr finds them</div>
              <div style={{ fontFamily: playfair, fontWeight: 800, fontStyle: "italic", fontSize: 78, color: C.mint }}>before the job ad.</div>
            </div>
            <div style={{ marginTop: 16, fontFamily: fonts.bold, fontSize: 26, letterSpacing: 3, color: "rgba(221,235,227,0.85)" }}>TRUSTED BY 100+ RECRUITMENT AGENCIES</div>
          </div>
        </AbsoluteFill>
      )}

      {/* end card: only the offer */}
      {t >= T.end && (
        <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, opacity: Math.min(1, endP * 1.4), transform: `translateY(${(1 - endP) * 30}px)` }}>
          <Img src={staticFile("boilr-ad/logo.png")} style={{ width: tall ? 150 : 130, height: tall ? 150 : 130, borderRadius: 34 }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: tall ? 84 : 74, color: C.ink, letterSpacing: -2.5, lineHeight: 1.05 }}>Get 20 companies<br />hiring right now.</div>
            <div style={{ fontFamily: playfair, fontWeight: 800, fontStyle: "italic", fontSize: tall ? 104 : 90, color: C.green, lineHeight: 1.25 }}>Free.</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
