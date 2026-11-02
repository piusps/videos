import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { fonts } from "../theme";

// boilr.ai video ad "Lead card first" (2026-09-30). No avatar, no voice: kinetic text + real product
// screenshots (cleaned: no Mac overlays, every company / person blurred) as a click path.
// Works as 9:16 (h 1920) and 4:5 (h 1350). Screenshot coordinates are in the source image's pixels.

const { fontFamily: playfair } = loadPlayfair("italic", { weights: ["800"], subsets: ["latin"] });

const C = { green: "#005032", card: "#0A5F45", mint: "#DDEBE3", bg: "#F5F5F1", ink: "#111416", muted: "#55575B" };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.33, 1, 0.68, 1);

type Cam = { cx: number; cy: number; w: number };
type Shot = { img: string; iw: number; ih: number; from: number; to: number; cam: Cam; camTo?: Cam; camAt?: [number, number]; spot?: [number, number] };
type Click = { t: number; shot: number; x: number; y: number };

// ---------- timeline ----------
const S = (img: string, from: number, to: number, cam: Cam, extra: Partial<Shot> = {}): Shot => ({ img, iw: 2000, ih: 1095, from, to, cam, ...extra });
const SHOTS: Shot[] = [
  S("14.png", 0, 4.8, { cx: 735, cy: 330, w: 820 }, { camTo: { cx: 735, cy: 330, w: 780 }, camAt: [0, 4.8], spot: [266, 324] }), // 0 hook: the fintech results, row 1 in focus
  S("1.png", 6.0, 8.0, { cx: 940, cy: 640, w: 1300 }, { camTo: { cx: 900, cy: 1000, w: 820 }, camAt: [6.0, 6.7] }), // 1 agent, typing
  S("2.png", 8.0, 8.8, { cx: 790, cy: 740, w: 680 }),  // 2 which situation?
  S("3.png", 8.8, 9.5, { cx: 790, cy: 830, w: 680 }),  // 3 how recent?
  S("4.png", 9.5, 10.5, { cx: 790, cy: 640, w: 680 }), // 4 company size
  S("5.png", 10.5, 11.1, { cx: 790, cy: 740, w: 680 }), // 5 sector
  S("6.png", 11.1, 11.7, { cx: 790, cy: 790, w: 680 }), // 6 exclude
  S("7.png", 11.7, 12.3, { cx: 790, cy: 770, w: 680 }), // 7 contact titles
  S("9.png", 12.3, 12.9, { cx: 790, cy: 800, w: 680 }), // 8 daily or weekly
  S("10.png", 12.9, 14.4, { cx: 830, cy: 520, w: 760 }, { camTo: { cx: 830, cy: 820, w: 760 }, camAt: [13.4, 13.9] }), // 9 summary + save
  S("14.png", 14.4, 17.8, { cx: 690, cy: 420, w: 760 }, { camTo: { cx: 1460, cy: 420, w: 760 }, camAt: [14.8, 15.2], spot: [266, 324] }), // 10 results -> Add
];
const CLICKS: Click[] = [
  { t: 7.75, shot: 1, x: 1412, y: 1035 },
  { t: 8.55, shot: 2, x: 600, y: 624 },
  { t: 9.3, shot: 3, x: 524, y: 943 },
  { t: 9.75, shot: 4, x: 512, y: 539 },
  { t: 9.98, shot: 4, x: 518, y: 594 },
  { t: 10.9, shot: 5, x: 587, y: 705 },
  { t: 11.5, shot: 6, x: 549, y: 815 },
  { t: 12.1, shot: 7, x: 585, y: 814 },
  { t: 12.7, shot: 8, x: 490, y: 790 },
  { t: 14.1, shot: 9, x: 497, y: 944 },
  { t: 15.4, shot: 10, x: 1697, y: 294 },
];
// Contact card (13.png, 2000x178): clicks on Email / Phone during the hook.
const CONTACTS = [
  { from: 2.5, to: 4.8, clicks: [{ t: 3.2, x: 1560, y: 120 }, { t: 3.9, x: 1140, y: 120 }] },
  { from: 16.0, to: 17.8, clicks: [{ t: 16.6, x: 1560, y: 120 }, { t: 17.1, x: 1140, y: 120 }] },
];
const CONTACT = { x0: 600, x1: 1850 };
export const BOILR_AD_SECONDS = 23;
const END = 17.8;

const HEAD: { from: number; to: number; a: string; b: string }[] = [
  { from: 0, to: 2.5, a: "This fintech just hired a new leader.", b: "More hires usually follow." },
  { from: 2.5, to: 4.8, a: "And this is who to call.", b: "Direct line included." },
  { from: 6.0, to: 8.0, a: "Tell the agent who you place.", b: "In plain words." },
  { from: 8.0, to: 12.9, a: "It asks what a good", b: "researcher would ask." },
  { from: 12.9, to: 14.4, a: "Then it watches the market.", b: "Every day." },
  { from: 14.4, to: 16.0, a: "7 fintechs. All moved this month.", b: "Add the one you want." },
  { from: 16.0, to: 17.8, a: "It lands in My Leads.", b: "One click for the direct line." },
];

// ---------- helpers ----------
const camAt = (s: Shot, t: number, ratio: number): { x0: number; y0: number; sc: number; w: number; h: number } => {
  let cam = s.cam;
  if (s.camTo && s.camAt) {
    const p = interpolate(t, s.camAt, [0, 1], { ...clamp, easing: ease });
    cam = { cx: s.cam.cx + (s.camTo.cx - s.cam.cx) * p, cy: s.cam.cy + (s.camTo.cy - s.cam.cy) * p, w: s.cam.w + (s.camTo.w - s.cam.w) * p };
  }
  const w = Math.min(cam.w, s.iw);
  const h = Math.min(w * ratio, s.ih);
  const x0 = Math.max(0, Math.min(s.iw - w, cam.cx - w / 2));
  const y0 = Math.max(0, Math.min(s.ih - h, cam.cy - h / 2));
  return { x0, y0, w, h, sc: 0 };
};

const Arrow: React.FC = () => (
  <svg width={34} height={51} viewBox="0 0 20 30" style={{ overflow: "visible", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.35))" }}>
    <path d="M1 1 L1 23 L6.5 17.8 L10.3 27 L14 25.4 L10.3 16.6 L17.8 16.6 Z" fill="#111" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

const Headline: React.FC<{ a: string; b: string; from: number; to: number; top: number; size: number }> = ({ a, b, from, to, top, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < from - 0.01 || t >= to) return null;
  const p = from <= 0 ? 1 : spring({ frame: frame - from * fps, fps, config: { damping: 16, stiffness: 180 } });
  const p2 = from <= 0 ? 1 : spring({ frame: frame - (from + 0.18) * fps, fps, config: { damping: 16, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", top, left: 0, width: 1080, textAlign: "center" }}>
      <div style={{ fontFamily: fonts.bold, fontSize: size, color: C.ink, letterSpacing: -1.5, lineHeight: 1.08, opacity: p, transform: `translateY(${(1 - p) * 24}px)` }}>{a}</div>
      <div style={{ fontFamily: playfair, fontWeight: 800, fontStyle: "italic", fontSize: size * 1.08, color: C.green, lineHeight: 1.15, opacity: p2, transform: `translateY(${(1 - p2) * 24}px)` }}>{b}</div>
    </div>
  );
};

// ---------- main ----------
export const BoilrAd: React.FC<{ h: number }> = ({ h }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tall = h > 1500;
  const L = tall
    ? { headTop: 290, headSize: 62, cardX: 40, cardY: 600, cardW: 1000, cardH: 860, contactY: 1270 }
    : { headTop: 70, headSize: 54, cardX: 60, cardY: 280, cardW: 960, cardH: 780, contactY: 900 };
  const ratio = L.cardH / L.cardW;
  const shotIdx = SHOTS.findIndex((s) => t >= s.from && t < s.to);
  const shot = shotIdx >= 0 ? SHOTS[shotIdx] : null;

  // screen position of a point inside a shot at time tt
  const toScreen = (si: number, x: number, y: number, tt: number) => {
    const s = SHOTS[si];
    const c = camAt(s, tt, ratio);
    const sc = L.cardW / c.w;
    return { x: L.cardX + (x - c.x0) * sc, y: L.cardY + (y - c.y0) * sc };
  };
  const contactScale = (L.cardW - 60) / (CONTACT.x1 - CONTACT.x0);
  const contactToScreen = (x: number, y: number) => ({ x: L.cardX + 30 + (x - CONTACT.x0) * contactScale, y: L.contactY + y * contactScale });

  // cursor path
  type WP = { t: number; x: number; y: number; click: boolean };
  const wps: WP[] = [
    { t: 2.6, ...contactToScreen(1750, 170), click: false },
    ...CONTACTS[0].clicks.map((k) => ({ t: k.t, ...contactToScreen(k.x, k.y), click: true })),
    { t: 6.3, ...toScreen(1, 1300, 1080, 6.3), click: false },
    ...CLICKS.map((k) => ({ t: k.t, ...toScreen(k.shot, k.x, k.y, k.t), click: true })),
    ...CONTACTS[1].clicks.map((k) => ({ t: k.t, ...contactToScreen(k.x, k.y), click: true })),
  ];
  const cursorVisible = (t >= 2.6 && t < 4.6) || (t >= 6.9 && t < 17.6);
  let cur = wps[0];
  for (let i = 0; i < wps.length - 1; i++) {
    const a = wps[i], b = wps[i + 1];
    if (t >= a.t && t < b.t) {
      const lead = Math.min(0.45, b.t - a.t);
      const p = interpolate(t, [b.t - lead, b.t], [0, 1], { ...clamp, easing: ease });
      cur = { t, x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, click: false };
      break;
    }
    if (t >= b.t) cur = b;
  }
  const lastClick = wps.filter((w) => w.click && t >= w.t).pop();
  const ring = lastClick ? interpolate(t, [lastClick.t, lastClick.t + 0.35], [0, 1], clamp) : 1;

  // brand beat + end card
  const brandP = interpolate(t, [4.8, 5.05, 5.8, 6.0], [0, 1, 1, 0], clamp);
  const endP = spring({ frame: frame - END * fps, fps, config: { damping: 18, stiffness: 150 } });
  const inEnd = t >= END;

  const typed = "Find companies about to hire a Head of Sales in London";
  const typedP = interpolate(t, [6.4, 7.5], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {!inEnd && HEAD.map((hd, i) => <Headline key={i} {...hd} top={L.headTop} size={L.headSize} />)}

      {/* product card */}
      {shot && !inEnd && (() => {
        const c = camAt(shot, t, ratio);
        const sc = L.cardW / c.w;
        const cut = spring({ frame: frame - shot.from * fps, fps, config: { damping: 20, stiffness: 240 } });
        const firstOfSeq = shot.from === 0 || shot.from === 6.0 || shot.from === 14.4;
        const pop = shot.from === 0 ? 1 : firstOfSeq ? 0.94 + 0.06 * cut : 1;
        const listFocus = !shot.spot ? 0 : shotIdx === 0 ? 1 : interpolate(t, [15.35, 15.6], [0, 1], clamp);
        return (
          <div style={{ position: "absolute", left: L.cardX, top: L.cardY, width: L.cardW, height: L.cardH, borderRadius: 34, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(0,40,25,0.18), 0 0 0 1px rgba(0,0,0,0.05)", transform: `scale(${pop})` }}>
            <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${-c.x0 * sc}px, ${-c.y0 * sc}px) scale(${sc})` }}>
              <Img src={staticFile(`boilr-ad/${shot.img}`)} style={{ width: shot.iw, height: shot.ih, display: "block" }} />
              {/* Add -> Added */}
              {shotIdx === 10 && t >= 15.45 && (
                <div style={{ position: "absolute", left: 1650, top: 277, width: 96, height: 35, borderRadius: 18, background: C.mint, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: fonts.bold, fontSize: 18, color: C.green }}>✓ Added</div>
              )}
              {/* spotlight on the chosen row in the list */}
              {shot.spot && listFocus > 0 && (
                <>
                  <div style={{ position: "absolute", left: 0, top: 0, width: shot.iw, height: shot.spot[0], background: `rgba(250,250,248,${0.8 * listFocus})` }} />
                  <div style={{ position: "absolute", left: 0, top: shot.spot[1], width: shot.iw, height: shot.ih - shot.spot[1], background: `rgba(250,250,248,${0.8 * listFocus})` }} />
                </>
              )}
              {/* typing into the agent */}
              {shotIdx === 1 && (
                <div style={{ position: "absolute", left: 488, top: 1012, width: 880, height: 46, background: "#F4F4F4", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: fonts.regular, fontSize: 22, color: typedP > 0 ? "#1C1C1C" : "#8E8E8E" }}>{typedP > 0 ? typed.slice(0, Math.round(typed.length * typedP)) : "Message your agent..."}</span>
                </div>
              )}
              {/* the source screenshot had a hover state on "201-500": draw the plain row text instead */}
              {shotIdx === 4 && (
                <div style={{ position: "absolute", left: 490, top: 690, width: 130, height: 32, background: "#F4F4F4", display: "flex", alignItems: "center" }}>
                  <span style={{ fontFamily: fonts.regular, fontSize: 20, color: "#1C1C1C" }}>201–500</span>
                </div>
              )}
              {/* ticked checkboxes on the size question */}
              {shotIdx === 4 && [[539, 9.75], [594, 9.98]].map(([y, at]) => t >= at && (
                <div key={y} style={{ position: "absolute", left: 469, top: y - 9, width: 17, height: 17, borderRadius: 4, background: C.card, display: "grid", placeItems: "center" }}>
                  <svg width={12} height={12} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" stroke="#fff" strokeWidth={4} fill="none" /></svg>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* "Added to My Leads" toast after the Add click */}
      {t >= 15.5 && t < 16.3 && (() => {
        const p = interpolate(t, [15.5, 15.7, 16.1, 16.3], [0, 1, 1, 0], clamp);
        return (
          <div style={{ position: "absolute", left: 0, width: 1080, top: L.cardY + L.cardH - 110, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 28px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: fonts.semibold, fontSize: 30, boxShadow: "0 16px 36px rgba(0,0,0,0.25)" }}>
              <span style={{ color: "#7BE0A6" }}>✓</span> Added to My Leads
            </div>
          </div>
        );
      })()}

      {/* contact row: who to call (hook) and enrich (after Add) */}
      {CONTACTS.map((ct, ci) => t >= ct.from && t < ct.to && (() => {
        const p = spring({ frame: frame - ct.from * fps, fps, config: { damping: 16, stiffness: 170 } });
        const sc = contactScale;
        return (
          <div key={ci} style={{ position: "absolute", left: L.cardX + 30, top: L.contactY, width: L.cardW - 60, height: 178 * sc, borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 24px 60px rgba(0,40,25,0.28)", transform: `translateY(${(1 - p) * 140}px)`, opacity: Math.min(1, p * 1.5) }}>
            <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${-CONTACT.x0 * sc}px, 0) scale(${sc})` }}>
              <Img src={staticFile("boilr-ad/13.png")} style={{ width: 2000, height: 178, display: "block" }} />
              {t >= ct.clicks[0].t + 0.05 && (
                <div style={{ position: "absolute", left: 1500, top: 94, width: 360, height: 54, borderRadius: 27, background: C.mint, display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 28, color: C.green, letterSpacing: 1 }}>+44 7••• ••• •••</div>
              )}
              {t >= ct.clicks[1].t + 0.05 && (
                <div style={{ position: "absolute", left: 1070, top: 94, width: 360, height: 54, borderRadius: 27, background: C.mint, display: "grid", placeItems: "center", fontFamily: fonts.bold, fontSize: 26, color: C.green }}>h•••••@••••••.co.uk</div>
              )}
            </div>
          </div>
        );
      })())}

      {/* brand beat */}
      {brandP > 0 && (
        <AbsoluteFill style={{ background: `rgba(0,80,50,${brandP})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34 }}>
          <div style={{ opacity: brandP, transform: `scale(${0.9 + 0.1 * brandP})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <Img src={staticFile("boilr-ad/logo.png")} style={{ width: 170, height: 170, borderRadius: 40, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }} />
            <div style={{ fontFamily: fonts.bold, fontSize: 70, color: "#fff", letterSpacing: -2, textAlign: "center", lineHeight: 1.05 }}>boilr finds them</div>
            <div style={{ fontFamily: playfair, fontWeight: 800, fontStyle: "italic", fontSize: 76, color: C.mint, textAlign: "center" }}>before the job ad.</div>
          </div>
        </AbsoluteFill>
      )}

      {/* cursor */}
      {cursorVisible && (
        <div style={{ position: "absolute", left: cur.x, top: cur.y }}>
          {ring < 1 && <div style={{ position: "absolute", left: -30 * ring, top: -30 * ring, width: 60 * ring, height: 60 * ring, borderRadius: "50%", border: `4px solid ${C.card}`, opacity: 1 - ring }} />}
          <Arrow />
        </div>
      )}

      {/* end card: the offer */}
      {inEnd && (
        <AbsoluteFill style={{ background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: tall ? 34 : 24, opacity: Math.min(1, endP * 1.4), transform: `translateY(${(1 - endP) * 40}px)` }}>
          <Img src={staticFile("boilr-ad/logo.png")} style={{ width: tall ? 130 : 110, height: tall ? 130 : 110, borderRadius: 30 }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fonts.bold, fontSize: tall ? 70 : 62, color: C.ink, letterSpacing: -2, lineHeight: 1.05 }}>Get 20 companies<br />hiring right now.</div>
            <div style={{ fontFamily: playfair, fontWeight: 800, fontStyle: "italic", fontSize: tall ? 84 : 72, color: C.green, lineHeight: 1.2 }}>Free.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {["The signal behind each one", "The decision maker", "Their direct line"].map((txt, i) => {
              const p = spring({ frame: frame - (END + 0.5 + i * 0.25) * fps, fps, config: { damping: 15, stiffness: 190 } });
              return (
                <div key={txt} style={{ display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, p * 1.4), transform: `translateX(${(1 - p) * -30}px)` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: C.card, display: "grid", placeItems: "center" }}>
                    <svg width={22} height={22} viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" /></svg>
                  </div>
                  <span style={{ fontFamily: fonts.semibold, fontSize: tall ? 40 : 36, color: C.ink }}>{txt}</span>
                </div>
              );
            })}
          </div>
          <div style={{ fontFamily: playfair, fontWeight: 800, fontStyle: "italic", fontSize: tall ? 44 : 38, color: C.muted, opacity: interpolate(t, [END + 1.5, END + 1.8], [0, 1], clamp) }}>If they're no good, bin them.</div>
          <div style={{ padding: "18px 34px", borderRadius: 999, background: C.green, color: "#fff", fontFamily: fonts.bold, fontSize: tall ? 36 : 32, opacity: interpolate(t, [END + 2.1, END + 2.4], [0, 1], clamp), transform: `scale(${interpolate(t, [END + 2.1, END + 2.4], [0.9, 1], clamp)})` }}>Tap “Learn more” · takes 60 seconds</div>
          <div style={{ fontFamily: fonts.bold, fontSize: tall ? 24 : 22, letterSpacing: 3, color: C.card, opacity: interpolate(t, [END + 2.6, END + 2.9], [0, 1], clamp) }}>TRUSTED BY 100+ RECRUITMENT AGENCIES</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
