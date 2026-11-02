import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { fonts } from "../theme";

// boilr.ai video ad v3 (2026-09-30): the full content of v1 (every follow-up question, contact in the
// hook, Add -> My Leads -> enrich), slowed down, plus the v2 rules: the camera centres on what gets
// clicked, the cursor glides in from close by, headlines always sit above the screen, end card = logo
// + offer only, "Trusted by 100+" in the brand beat.

const { fontFamily: playfair } = loadPlayfair("italic", { weights: ["800"], subsets: ["latin"] });
const C = { green: "#005032", card: "#0A5F45", mint: "#DDEBE3", bg: "#F5F5F1", ink: "#111416", muted: "#55575B" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.33, 1, 0.68, 1);

export const BOILR_AD_V3_SECONDS = 31.3;
const T = { contact1: 4.0, brand: 7.0, agent: 8.6, list: 22.4, contact2: 25.4, end: 27.8 };

type Cam = { cx: number; cy: number; w: number };
type Shot = { img: string; from: number; to: number; cam: Cam; clicks: { t: number; x: number; y: number }[] };
const IW = 2000, IH = 1095;
const Q = (cy: number): Cam => ({ cx: 790, cy, w: 680 });
const SHOTS: Shot[] = [
  { img: "14.png", from: 0, to: T.brand, cam: { cx: 735, cy: 330, w: 820 }, clicks: [] },                               // hook: real results
  { img: "1.png", from: T.agent, to: 10.9, cam: { cx: 880, cy: 1000, w: 820 }, clicks: [{ t: 10.6, x: 1412, y: 1035 }] },
  { img: "2.png", from: 10.9, to: 12.25, cam: Q(740), clicks: [{ t: 11.95, x: 600, y: 624 }] },
  { img: "3.png", from: 12.25, to: 13.6, cam: Q(830), clicks: [{ t: 13.3, x: 524, y: 943 }] },
  { img: "4.png", from: 13.6, to: 15.2, cam: Q(640), clicks: [{ t: 14.2, x: 512, y: 539 }, { t: 14.7, x: 518, y: 594 }] },
  { img: "5.png", from: 15.2, to: 16.55, cam: Q(740), clicks: [{ t: 16.25, x: 587, y: 705 }] },
  { img: "6.png", from: 16.55, to: 17.9, cam: Q(790), clicks: [{ t: 17.6, x: 549, y: 815 }] },
  { img: "7.png", from: 17.9, to: 19.25, cam: Q(770), clicks: [{ t: 18.95, x: 585, y: 814 }] },
  { img: "9.png", from: 19.25, to: 20.6, cam: Q(800), clicks: [{ t: 20.3, x: 490, y: 790 }] },
  { img: "10.png", from: 20.6, to: T.list, cam: { cx: 830, cy: 780, w: 760 }, clicks: [{ t: 22.1, x: 497, y: 944 }] },
  { img: "14.png", from: T.list, to: T.contact2, cam: { cx: 1390, cy: 330, w: 820 }, clicks: [{ t: 23.9, x: 1697, y: 294 }] },
];
const HEAD = [
  { from: 0, to: T.contact1, a: "This fintech just hired a new leader.", b: "More hires usually follow." },
  { from: T.contact1, to: T.brand, a: "And this is who to call.", b: "Direct line included." },
  { from: T.agent, to: 10.9, a: "Tell the agent who you place.", b: "In plain words." },
  { from: 10.9, to: 15.2, a: "It asks what a good", b: "researcher would ask." },
  { from: 15.2, to: 20.6, a: "Sector, size, who to reach.", b: "You just click." },
  { from: 20.6, to: T.list, a: "Then it watches the market.", b: "Every day." },
  { from: T.list, to: T.contact2, a: "7 fintechs found this month.", b: "Add the one you want." },
  { from: T.contact2, to: T.end, a: "It lands in My Leads.", b: "One click for the direct line." },
];

const Arrow: React.FC = () => (
  <svg width={38} height={57} viewBox="0 0 20 30" style={{ overflow: "visible", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.35))" }}>
    <path d="M1 1 L1 23 L6.5 17.8 L10.3 27 L14 25.4 L10.3 16.6 L17.8 16.6 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

// One cursor path through a list of clicks. Enters from close below-right of the first target,
// then glides from target to target.
const CursorPath: React.FC<{ pts: { t: number; x: number; y: number }[]; appear: number; hide: number }> = ({ pts, appear, hide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (!pts.length || t < appear || t >= hide) return null;
  let x = pts[0].x + 110, y = pts[0].y + 130;
  const chain = [{ t: appear, x, y }, ...pts];
  for (let i = 0; i < chain.length - 1; i++) {
    const a = chain[i], b = chain[i + 1];
    const start = Math.max(a.t, b.t - 0.8);
    if (t >= a.t) {
      const p = interpolate(t, [start, b.t - 0.08], [0, 1], { ...clamp, easing: ease });
      x = a.x + (b.x - a.x) * p; y = a.y + (b.y - a.y) * p;
    }
  }
  const last = pts.filter((p) => t >= p.t).pop();
  const ring = last ? interpolate(t, [last.t, last.t + 0.4], [0, 1], clamp) : 1;
  const press = last && t < last.t + 0.12 ? 0.9 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: interpolate(t, [appear, appear + 0.15, hide - 0.15, hide], [0, 1, 1, 0], clamp) }}>
      {last && ring < 1 && <div style={{ position: "absolute", left: -34 * ring, top: -34 * ring, width: 68 * ring, height: 68 * ring, borderRadius: "50%", border: `5px solid ${C.card}`, opacity: 1 - ring }} />}
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

export const BoilrAdV3: React.FC<{ h: number }> = ({ h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tall = h > 1500;
  const L = tall
    ? { headTop: 300, headSize: 58, cardX: 50, cardY: 590, cardW: 980, cardH: 860 }
    : { headTop: 64, headSize: 52, cardX: 60, cardY: 270, cardW: 960, cardH: 800 };
  const ratio = L.cardH / L.cardW;
  const si = SHOTS.findIndex((s) => t >= s.from && t < s.to);
  const shot = si >= 0 ? SHOTS[si] : null;
  const geom = (s: Shot) => {
    const w = s.cam.w, hh = w * ratio;
    const x0 = Math.max(0, Math.min(IW - w, s.cam.cx - w / 2));
    const y0 = Math.max(0, Math.min(IH - hh, s.cam.cy - hh / 2));
    return { x0, y0, sc: L.cardW / w };
  };

  const brandP = interpolate(t, [T.brand, T.brand + 0.3, T.agent - 0.25, T.agent], [0, 1, 1, 0], clamp);
  const endP = spring({ frame: frame - T.end * fps, fps, config: { damping: 18, stiffness: 140 } });
  const typed = "Find companies about to hire a Head of Sales in London";
  const typedP = interpolate(t, [9.1, 10.3], [0, 1], clamp);

  // contact row (13.png, name blurred), shown twice: hook and enrich
  const cx0 = 600, cx1 = 1850;
  const csc = (L.cardW - 40) / (cx1 - cx0);
  const Contact = (from: number, to: number, zoomAt: number, clicks: { t: number; x: number; kind: "phone" | "email" }[], centred: boolean) => {
    if (t < from || t >= to) return null;
    const p = spring({ frame: frame - from * fps, fps, config: { damping: 18, stiffness: 160 } });
    const z = 1 + 0.6 * interpolate(t, [zoomAt, zoomAt + 0.45], [0, 1], { ...clamp, easing: ease });
    const o = L.cardW - 60;
    const hz = 178 * csc * z;
    const top = centred ? L.cardY + L.cardH * 0.45 - hz / 2 : L.cardY + L.cardH - hz - 30;
    const left = L.cardX + 20;
    const map = (x: number, y: number) => ({ x: left + o + ((x - cx0) * csc - o) * z, y: top + y * csc * z });
    const phoneOn = clicks.find((c) => c.kind === "phone" && t >= c.t + 0.05);
    const mailOn = clicks.find((c) => c.kind === "email" && t >= c.t + 0.05);
    return (
      <>
        <div style={{ position: "absolute", left, top, width: L.cardW - 40, height: hz, borderRadius: 24, overflow: "hidden", background: "#fff", boxShadow: "0 24px 60px rgba(0,40,25,0.24)", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 60}px)` }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: L.cardW - 40, height: hz, transformOrigin: `${o}px 0px`, transform: `scale(${z})` }}>
            <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${-cx0 * csc}px, 0) scale(${csc})` }}>
              <Img src={staticFile("boilr-ad/13.png")} style={{ width: 2000, height: 178, display: "block" }} />
              {phoneOn && <div style={{ position: "absolute", left: 1505, top: 94, width: 320, height: 54, borderRadius: 27, background: C.mint, display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 28, color: C.green, letterSpacing: 1 }}>+44 7••• ••• •••</div>}
              {mailOn && <div style={{ position: "absolute", left: 1070, top: 94, width: 330, height: 54, borderRadius: 27, background: C.mint, display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 25, color: C.green }}>h•••••@•••••.co.uk</div>}
            </div>
          </div>
        </div>
        <CursorPath pts={clicks.map((c) => ({ t: c.t, ...map(c.kind === "phone" ? 1575 : 1150, 120) }))} appear={zoomAt + 0.2} hide={to - 0.1} />
      </>
    );
  };

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {t < T.end && HEAD.map((hd, i) => <Headline key={i} {...hd} top={L.headTop} size={L.headSize} />)}

      {shot && (() => {
        const g = geom(shot);
        const inP = spring({ frame: frame - shot.from * fps, fps, config: { damping: 20, stiffness: 200 } });
        const fresh = si === 1 || si === 10;
        const hook = si === 0;
        const listRows = hook || si === 10;
        const focus = hook ? 1 : si === 10 ? interpolate(t, [23.8, 24.05], [0, 1], clamp) : 0;
        return (
          <>
            <div style={{ position: "absolute", left: L.cardX, top: L.cardY, width: L.cardW, height: L.cardH, borderRadius: 34, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(0,40,25,0.16), 0 0 0 1px rgba(0,0,0,0.05)", opacity: fresh ? Math.min(1, inP * 1.3) : 1, transform: `scale(${fresh ? 0.96 + 0.04 * inP : 1})` }}>
              <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${-g.x0 * g.sc}px, ${-g.y0 * g.sc}px) scale(${g.sc})` }}>
                <Img src={staticFile(`boilr-ad/${shot.img}`)} style={{ width: IW, height: IH, display: "block" }} />
                {si === 1 && (
                  <div style={{ position: "absolute", left: 488, top: 1012, width: 880, height: 46, background: "#F4F4F4", display: "flex", alignItems: "center" }}>
                    <span style={{ fontFamily: fonts.regular, fontSize: 22, color: typedP > 0 ? "#1C1C1C" : "#8E8E8E" }}>{typedP > 0 ? typed.slice(0, Math.round(typed.length * typedP)) : "Message your agent..."}</span>
                  </div>
                )}
                {si === 4 && (
                  <>
                    <div style={{ position: "absolute", left: 490, top: 690, width: 130, height: 32, background: "#F4F4F4", display: "flex", alignItems: "center" }}>
                      <span style={{ fontFamily: fonts.regular, fontSize: 20, color: "#1C1C1C" }}>201–500</span>
                    </div>
                    {[[539, 14.2], [594, 14.7]].map(([y, at]) => t >= at && (
                      <div key={y} style={{ position: "absolute", left: 469, top: y - 9, width: 17, height: 17, borderRadius: 4, background: C.card, display: "grid", placeItems: "center" }}>
                        <svg width={12} height={12} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" stroke="#fff" strokeWidth={4} fill="none" /></svg>
                      </div>
                    ))}
                  </>
                )}
                {listRows && focus > 0 && (
                  <>
                    <div style={{ position: "absolute", left: 0, top: 0, width: IW, height: 266, background: `rgba(250,250,248,${0.8 * focus})` }} />
                    <div style={{ position: "absolute", left: 0, top: 324, width: IW, height: 800, background: `rgba(250,250,248,${0.8 * focus})` }} />
                  </>
                )}
                {si === 10 && t >= 23.95 && <div style={{ position: "absolute", left: 1650, top: 277, width: 96, height: 35, borderRadius: 18, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.bold, fontSize: 18, color: C.green }}>✓ Added</div>}
              </div>
            </div>
            {/* hook callout: the full signal of the highlighted row, large */}
            {hook && (
              <div style={{ position: "absolute", left: L.cardX + 36, top: L.cardY + (tall ? 430 : 400), width: L.cardW - 72, opacity: interpolate(t, [T.contact1 - 0.3, T.contact1], [1, 0], clamp) }}>
                <div style={{ background: C.green, borderRadius: 26, padding: tall ? "30px 34px" : "24px 30px", boxShadow: "0 20px 50px rgba(0,40,25,0.3)", color: "#fff" }}>
                  <div style={{ fontFamily: fonts.bold, fontSize: tall ? 24 : 22, letterSpacing: 3, color: C.mint, marginBottom: 10 }}>NEW SIGNAL · 23 SEP 2026</div>
                  <div style={{ fontFamily: fonts.bold, fontSize: tall ? 54 : 48, letterSpacing: -1.2, lineHeight: 1.08 }}>New senior leader appointed</div>
                  <div style={{ fontFamily: fonts.medium, fontSize: tall ? 32 : 28, color: C.mint, marginTop: 12 }}>Fintech · London · 49 employees</div>
                </div>
              </div>
            )}
            {shot.clicks.length > 0 && (
              <CursorPath pts={shot.clicks.map((c) => ({ t: c.t, x: L.cardX + (c.x - g.x0) * g.sc, y: L.cardY + (c.y - g.y0) * g.sc }))} appear={Math.max(shot.from + 0.3, shot.clicks[0].t - 1.0)} hide={shot.to} />
            )}
          </>
        );
      })()}

      {/* hook: who to call, over the lower part of the results card */}
      {Contact(T.contact1, T.brand, 4.5, [{ t: 5.3, x: 1560, kind: "phone" }, { t: 6.2, x: 1140, kind: "email" }], false)}

      {/* Added toast */}
      {t >= 24.0 && t < 24.9 && (
        <div style={{ position: "absolute", left: 0, width: 1080, top: L.cardY + L.cardH * 0.62, display: "flex", justifyContent: "center", opacity: interpolate(t, [24.0, 24.2, 24.7, 24.9], [0, 1, 1, 0], clamp) }}>
          <div style={{ padding: "18px 32px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: fonts.semibold, fontSize: 34, boxShadow: "0 16px 36px rgba(0,0,0,0.25)" }}><span style={{ color: "#7BE0A6" }}>✓</span> Added to My Leads</div>
        </div>
      )}

      {/* enrich in My Leads */}
      {Contact(T.contact2, T.end, 25.9, [{ t: 26.6, x: 1560, kind: "phone" }, { t: 27.3, x: 1140, kind: "email" }], true)}

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

      {/* end card: logo + offer */}
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
