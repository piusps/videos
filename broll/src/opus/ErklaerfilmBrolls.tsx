import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile } from "remotion";
import { fonts } from "../theme";
import { SIMPLE_ICONS } from "../components/logoPaths";
import { PK, paperShadow, Stage, Highlight, Bokeh, Sheen, Grade, Grain, InkStamp } from "./PremiumKit";
import { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer } from "./DuetBrolls";
import { RoofScene3D, filmCam, filmLand, FILM_RIDGE, SHOTS, PHOTO_CAMS, doneLand, noneLand, halfLand, VARIANTS } from "./ErklaerfilmObjects3D";

// FP-N "Erklaerfilm" (2026-10-29) - split-panel scenes (1080 x 820). Every scene is a pure function of (t, dur, at);
// ErklaerfilmOpus anchors `at` to captions.json word times. Example company "Holzmann Dachtechnik" = BEISPIEL (invented).

export type SceneP = { t: number; dur: number; at?: Record<string, number> };
const mk = (dur: number, at: Record<string, number> | undefined) => (name: string, frac: number) => (at && at[name] !== undefined ? at[name] : frac * dur);
const ez = Easing.inOut(Easing.cubic);
export const PHOTO = (n: string) => staticFile(`fpn-erklaerfilm/photos/${n}.png`);

// ---------- Holzmann brand mark (invented example brand): roof chevron over a bold H ----------
export const HolzmannMark: React.FC<{ size: number; p?: number; color?: string; bg?: string }> = ({ size, p = 1, color = "#FFF", bg = C.orange }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0, overflow: "visible" }}>
    <rect x={0} y={0} width={100} height={100} rx={24} fill={bg} transform={`scale(${0.6 + 0.4 * Math.min(1, p * 1.6)})`} style={{ transformOrigin: "50px 50px" }} />
    <path d="M18 50 L50 22 L82 50" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(p, 0.15, 0.45)} />
    <path d="M34 50 V80 M66 50 V80 M34 65 H66" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k(p, 0.45, 0.5)} />
  </svg>
);

// phone photo (portrait, rounded, white border like a camera-roll thumbnail)
export const PhonePhoto: React.FC<{ src: string; w: number; style?: React.CSSProperties; sheen?: number }> = ({ src, w, style, sheen = 0 }) => (
  <div style={{ position: "absolute", width: w, height: w * 1.33, borderRadius: w * 0.07, background: "#FFF", padding: w * 0.035, boxSizing: "border-box", boxShadow: paperShadow, overflow: "hidden", ...style }}>
    <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: w * 0.05, display: "block" }} />
    <Sheen p={sheen} strength={0.8} />
  </div>
);

// ================= HOOK FILM (0 .. ~6.45 s): agency-grade image film of the example roofer =================
// film time = scene time. Shots: wide crane / eave tracking / drone / hero / logo sting, then the film collapses into a
// player card and the phone photos it was made from fly in.
const TAG = "HOLZMANN DACHTECHNIK";
const KineticWords: React.FC<{ t: number; at: number; words: string[]; size: number; color?: string; style?: React.CSSProperties; italic?: number[]; out?: number; gap?: number }> = ({ t, at, words, size, color = PK.ink, style, italic = [], out = 99, gap = 0.11 }) => {
  const o = k(t, out, 0.18, Easing.in(Easing.cubic));
  return (
    <div style={{ position: "absolute", display: "flex", flexWrap: "nowrap", whiteSpace: "nowrap", gap: `0 ${size * 0.24}px`, ...style }}>
      {words.map((w, i) => {
        const a = at + i * gap;
        const p = k(t, a, 0.42, Easing.out(Easing.exp));
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, lineHeight: 1.0 }}>
            <span style={{ display: "inline-block", fontFamily: SERIF, fontWeight: 500, fontStyle: italic.includes(i) ? "italic" : "normal", fontSize: size, color, letterSpacing: "-0.02em", transform: `translateY(${(1 - p) * 130 + o * -130}%) rotate(${(1 - p) * 4}deg)`, textShadow: "0 2px 18px rgba(255,248,238,0.55)" }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};
const InfoCard: React.FC<{ t: number; at: number; x: number; y: number; depth: number; children: React.ReactNode }> = ({ t, at, x, y, depth, children }) => {
  const p = k(t, at, 0.5, Easing.out(Easing.exp));
  const drift = (t - at) * 60 * depth; // parallax: nearer cards move faster
  return (
    <div style={{ position: "absolute", left: x + (1 - p) * 420 * depth - drift, top: y, opacity: k(t, at, 0.12), transform: `scale(${0.92 + 0.08 * p}) rotate(${(1 - p) * 3}deg)`, filter: depth < 0.7 ? "blur(0.6px)" : undefined }}>
      <div style={{ position: "relative", background: "linear-gradient(150deg, rgba(255,255,255,0.94), rgba(255,250,243,0.84))", border: "1.5px solid rgba(255,255,255,0.95)", borderRadius: 20, padding: "16px 24px", boxShadow: "0 26px 50px -16px rgba(90,50,20,0.45)", overflow: "hidden", whiteSpace: "nowrap" }}>
        {children}
        <Sheen p={k(t, at + 0.15, 0.6)} strength={0.8} />
      </div>
    </div>
  );
};
const LightLeak: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const u = (t - at + 0.12) / 0.5;
  if (u < 0 || u > 1) return null;
  const a = Math.sin(u * Math.PI);
  return (
    <>
      <div style={{ position: "absolute", inset: -100, background: `radial-gradient(ellipse 55% 75% at ${-10 + u * 120}% 40%, rgba(255,170,110,${0.85 * a}), rgba(255,200,150,${0.35 * a}) 40%, rgba(255,220,180,0) 70%)`, mixBlendMode: "screen", zIndex: 30 }} />
      <div style={{ position: "absolute", inset: 0, background: "#FFF6EC", opacity: t >= at && t < at + 0.08 ? 0.55 : 0, zIndex: 31 }} />
    </>
  );
};
const fmtTC = (s: number) => {
  const f = Math.floor((s % 1) * 25), sec = Math.floor(s);
  return `00:00:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

export const HOOK_COLLAPSE = 5.26;
export const HookFilm: React.FC<SceneP & { photosAt?: number[] }> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const colA = m("collapse", 0.81); // film shrinks into a player card
  const ph = [m("ph1", 0.83), m("ph2", 0.845), m("ph3", 0.87)];
  const beam = m("beam", 0.9);
  const stingA = SHOTS[4], stingOut = colA - 0.08;
  const c = k(t, colA, 0.5, ez);
  const shot = SHOTS.filter((s) => t >= s).length - 1;
  const camT = t;
  const cam = filmCam(camT);
  // handheld micro drift, stronger on the tracking shot
  const hh = shot === 1 ? 1.6 : 0.7;
  const jx = Math.sin(t * 3.1) * hh + Math.sin(t * 7.3) * hh * 0.4, jy = Math.cos(t * 2.7) * hh;
  const scale = 1 - 0.42 * c;
  const cx = 540 + (700 - 540) * c, cy = 410 + (392 - 410) * c;
  const radius = 30 * c / Math.max(0.5, scale);
  // sting
  const wipeIn = k(t, stingA - 0.05, 0.26, Easing.inOut(Easing.cubic));
  const cream = k(t, stingA + 0.06, 0.26, Easing.inOut(Easing.cubic));
  const wipeOut = k(t, stingOut, 0.28, Easing.inOut(Easing.cubic));
  const logoP = k(t, stingA + 0.2, 0.6, Easing.out(Easing.cubic));
  const showSting = t > stingA - 0.06 && wipeOut < 1;
  return (
    <AbsoluteFill style={{ width: PW, height: PH, overflow: "hidden" }}>
      {/* stage appears behind the card once it collapses */}
      <Stage t={t + 7} />
      <Bokeh t={t} n={14} seed={3} opacity={0.7} />
      {/* FILM */}
      <div style={{ position: "absolute", left: cx - PW / 2, top: cy - PH / 2, width: PW, height: PH, transform: `scale(${scale}) rotate(${c * -1.5}deg)`, borderRadius: radius, overflow: "hidden", boxShadow: c > 0 ? `0 ${50 * c}px ${90 * c}px rgba(70,35,10,${0.45 * c}), 0 0 0 ${3 * c / scale}px #FFF` : undefined, zIndex: 5 }}>
        {/* sky */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #F4C9A6 0%, #F9DFC6 34%, #F5E2CE 62%, #F5E2CE 100%)" }} />
        <div style={{ position: "absolute", left: -260, top: -300, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,200,0.95) 0%, rgba(255,200,150,0.5) 28%, rgba(255,190,140,0) 62%)" }} />
        <div style={{ position: "absolute", inset: 0, transform: `translate(${jx}px, ${jy}px) scale(1.03)` }}>
          <RoofScene3D t={t} w={PW} h={PH} cam={cam} land={filmLand} ridgeAt={FILM_RIDGE} />
        </div>
        {/* anamorphic sun streak + flare */}
        <div style={{ position: "absolute", left: -200, top: 118 + Math.sin(t * 0.6) * 6, width: 1500, height: 5, background: "linear-gradient(90deg, rgba(255,220,170,0), rgba(255,226,180,0.85) 30%, rgba(255,226,180,0) 70%)", filter: "blur(2px)", mixBlendMode: "screen", opacity: 0.55 + 0.2 * Math.sin(t * 1.7) }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 260 + i * 170 + Math.sin(t * 0.5) * 20, top: 250 + i * 110, width: 40 + i * 30, height: 40 + i * 30, borderRadius: "50%", border: "2px solid rgba(255,210,160,0.35)", background: "rgba(255,200,150,0.08)", mixBlendMode: "screen", opacity: 0.6 }} />)}
        {/* tilt-shift depth of field: top and bottom thirds slightly out of focus */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 210, backdropFilter: "blur(5px)", WebkitMaskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 100%)", maskImage: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0) 100%)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, backdropFilter: "blur(6px)", WebkitMaskImage: "linear-gradient(0deg, #000 0%, rgba(0,0,0,0) 100%)", maskImage: "linear-gradient(0deg, #000 0%, rgba(0,0,0,0) 100%)" }} />
        <Bokeh t={t} n={18} seed={5} opacity={0.9} />

        {/* ---- kinetic typography per shot ---- */}
        {t < SHOTS[1] + 0.05 ? (
          <>
            <Mono text={`${TAG} · IMAGEFILM`} size={19} color={PK.orangeDeep} style={{ position: "absolute", left: 64, top: 548, opacity: k(t, 0.2, 0.2) * (1 - k(t, SHOTS[1] - 0.12, 0.1)), letterSpacing: "0.22em" }} />
            <KineticWords t={t} at={0.32} words={["Ihr", "Dach."]} size={124} italic={[1]} out={SHOTS[1] - 0.16} style={{ left: 58, top: 588 }} />
          </>
        ) : null}
        {t >= SHOTS[1] - 0.02 && t < SHOTS[2] + 0.05 ? (
          <>
            <KineticWords t={t} at={SHOTS[1] + 0.08} words={["Ziegel", "für", "Ziegel."]} size={96} italic={[2]} out={SHOTS[2] - 0.15} gap={0.13} style={{ left: 60, top: 590 }} />
          </>
        ) : null}
        {t >= SHOTS[2] - 0.02 && t < SHOTS[3] + 0.05 ? (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - k(t, SHOTS[3] - 0.1, 0.12) }}>
            <InfoCard t={t} at={SHOTS[2] + 0.06} x={600} y={240} depth={1.0}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: fonts.bold, fontSize: 40, color: PK.ink }}>4,9</span>
                <span style={{ display: "flex", gap: 2 }}>{[0, 1, 2, 3, 4].map((i) => <svg key={i} width={26} height={26} viewBox="0 0 24 24" style={{ transform: `scale(${pop(t, SHOTS[2] + 0.2 + i * 0.05, 0.3)})` }}><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4L2.8 9.5l6.4-.8z" fill="#F2A33A" /></svg>)}</span>
                <span style={{ fontFamily: fonts.medium, fontSize: 22, color: PK.sub }}>212 Bewertungen</span>
              </div>
            </InfoCard>
            <InfoCard t={t} at={SHOTS[2] + 0.32} x={90} y={440} depth={0.65}>
              <Mono text="MEISTERBETRIEB" size={16} color={PK.orangeDeep} />
              <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, color: PK.ink, lineHeight: 1.05, marginTop: 4 }}>seit <i>1987</i></div>
            </InfoCard>
            <InfoCard t={t} at={SHOTS[2] + 0.58} x={560} y={560} depth={1.25}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <CheckDot size={38} p={k(t, SHOTS[2] + 0.75, 0.3)} />
                <span style={{ fontFamily: fonts.bold, fontSize: 34, color: PK.ink }}>Festpreis in 24 h</span>
              </div>
            </InfoCard>
          </div>
        ) : null}
        {t >= SHOTS[3] - 0.02 && t < SHOTS[4] + 0.1 ? (
          <div style={{ position: "absolute", left: 58, top: 548 }}>
            <KineticWords t={t} at={SHOTS[3] + 0.06} words={["In", "3", "Tagen"]} size={104} gap={0.09} style={{ position: "relative" }} />
            <div style={{ position: "relative", display: "inline-block", marginTop: -6, transform: `scale(${interpolate(t, [SHOTS[3] + 0.42, SHOTS[3] + 0.56], [1.9, 1], { ...clamp, easing: Easing.out(Easing.cubic) })}) rotate(-2deg)`, transformOrigin: "0% 50%", opacity: k(t, SHOTS[3] + 0.42, 0.06) }}>
              <div style={{ fontFamily: fonts.bold, fontSize: 96, color: "#FFF", background: `linear-gradient(170deg, ${C.orange}, ${PK.orangeDeep})`, borderRadius: 18, padding: "0 26px 10px", letterSpacing: "-0.02em", boxShadow: "0 22px 44px -10px rgba(180,83,47,0.55)", position: "relative", overflow: "hidden" }}>
                dicht.
                <Sheen p={k(t, SHOTS[3] + 0.6, 0.5)} strength={0.9} />
              </div>
            </div>
          </div>
        ) : null}

        {/* cut light leaks */}
        {SHOTS.slice(1, 4).map((s) => <LightLeak key={s} t={t} at={s} />)}

        {/* ---- logo sting: orange wipe, cream card, mark + wordmark ---- */}
        {showSting ? (
          <div style={{ position: "absolute", inset: 0, zIndex: 40 }}>
            <div style={{ position: "absolute", top: -200, bottom: -200, left: interpolate(wipeIn, [0, 1], [-1500, -200]) + wipeOut * 1700, width: 1500, background: `linear-gradient(100deg, ${PK.orangeDeep}, ${C.orange} 60%, #E9946F)`, transform: "skewX(-14deg)" }} />
            <div style={{ position: "absolute", top: -200, bottom: -200, left: interpolate(cream, [0, 1], [-1500, -230]) + wipeOut * 1700, width: 1480, background: "#FBF5EC", transform: "skewX(-14deg)", overflow: "hidden" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, opacity: cream * (1 - wipeOut), transform: `translateX(${wipeOut * 300}px) scale(${1.06 - 0.06 * logoP})` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 70 }}>
                <HolzmannMark size={150} p={logoP} />
                <div>
                  <div style={{ display: "flex", fontFamily: fonts.bold, fontSize: 96, color: PK.ink, letterSpacing: "-0.01em", lineHeight: 1 }}>
                    {"HOLZMANN".split("").map((ch, i) => <span key={i} style={{ display: "inline-block", opacity: k(t, stingA + 0.3 + i * 0.03, 0.12), transform: `translateY(${(1 - k(t, stingA + 0.3 + i * 0.03, 0.3, Easing.out(Easing.back(1.8)))) * 40}px)` }}>{ch}</span>)}
                  </div>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 27, letterSpacing: "0.34em", color: PK.orangeDeep, marginTop: 10, opacity: k(t, stingA + 0.55, 0.2) }}>DACHTECHNIK</div>
                </div>
              </div>
              <div style={{ width: 560 * k(t, stingA + 0.6, 0.35, ez), height: 3, background: C.orange, borderRadius: 2 }} />
              <div style={{ fontFamily: fonts.medium, fontSize: 28, color: PK.sub, opacity: k(t, stingA + 0.7, 0.2) }}>holzmann-dach.de · 0761 555 21 87</div>
            </div>
          </div>
        ) : null}

        {/* ---- film chrome: letterbox, slate, timecode, progress ---- */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 34, background: "rgba(18,14,11,0.92)", display: "flex", alignItems: "center", padding: "0 22px", gap: 12, zIndex: 60 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: C.orange, opacity: 0.6 + 0.4 * Math.abs(Math.sin(t * 4)) }} />
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.16em", color: "rgba(255,240,225,0.85)" }}>BEISPIEL · HOLZMANN_IMAGEFILM.MP4</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", color: "rgba(255,240,225,0.85)", fontVariantNumeric: "tabular-nums" }}>{fmtTC(t)}</span>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 34, background: "rgba(18,14,11,0.92)", display: "flex", alignItems: "center", padding: "0 22px", gap: 14, zIndex: 60 }}>
          <svg width={16} height={16} viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="#FFF" /></svg>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.18)", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, (t / 30) * 100 + 2)}%`, background: C.orange, borderRadius: 3 }} />
          </div>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 15, color: "rgba(255,240,225,0.85)", fontVariantNumeric: "tabular-nums" }}>0:{String(Math.floor(t)).padStart(2, "0")} / 0:30</span>
        </div>
        <Grade warm={0.8} />
        <Grain opacity={0.07} id="filmgrain" />
      </div>

      {/* ---- after collapse: the phone photos it was built from ---- */}
      {t > ph[0] - 0.05 ? (
        <>
          {[{ n: "rafters", x: 34, y: 300, r: -9 }, { n: "half", x: 96, y: 250, r: -2 }, { n: "front", x: 170, y: 200, r: 6 }].map((p, i) => {
            const a = ph[i];
            const q = interpolate(t, [a, a + 0.42], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
            return <PhonePhoto key={p.n} src={PHOTO(p.n)} w={190} sheen={k(t, a + 0.2, 0.6)} style={{ left: p.x - (1 - q) * 300, top: p.y + (1 - q) * 120, transform: `rotate(${p.r + (1 - q) * -20}deg)`, opacity: k(t, a, 0.1), zIndex: 6 + i }} />;
          })}
          <div style={{ position: "absolute", left: 40, top: 150, zIndex: 12, ...ps(t, ph[0] + 0.1, 10, 0.8) }}><Pill text="3 HANDYFOTOS" color="#FFF" bg={PK.ink} size={19} dot={false} /></div>
          {/* beam: photos -> Claude -> film */}
          {t > beam - 0.02 ? (
            <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, zIndex: 8, overflow: "visible" }}>
              <path d="M300 520 C 360 640, 420 640, 450 560" fill="none" stroke={C.orange} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" strokeDashoffset={-t * 60} pathLength={undefined} opacity={k(t, beam, 0.2)} />
            </svg>
          ) : null}
          {t > beam ? (
            <div style={{ position: "absolute", left: 385, top: 610, zIndex: 13, ...ps(t, beam + 0.05, 12, 0.6) }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#FFF", borderRadius: 999, padding: "10px 20px 10px 12px", boxShadow: "0 14px 30px rgba(80,40,15,0.25)", fontFamily: fonts.semibold, fontSize: 26, color: PK.ink }}>
                <Logo name="claude" size={32} /> gebaut mit Claude <CheckDot size={30} p={k(t, beam + 0.2, 0.3)} />
              </div>
            </div>
          ) : null}
          <Glint t={t} at={beam + 0.25} x={850} y={150} size={40} />
          <Glint t={t} at={ph[2] + 0.2} x={330} y={220} size={30} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= shared light claude.ai pieces =================
const IG_GRAD = "linear-gradient(45deg, #FEDA75 0%, #FA7E1E 25%, #D62976 50%, #962FBF 75%, #4F5BD5 100%)";
export const IgLogo: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.26, background: IG_GRAD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <svg width={size * 0.66} height={size * 0.66} viewBox="0 0 24 24"><path d={SIMPLE_ICONS.instagram.d} fill="#FFF" /></svg>
  </div>
);
const Win: React.FC<{ title: string; crumb?: string; style?: React.CSSProperties; children?: React.ReactNode; right?: React.ReactNode }> = ({ title, crumb = "Projects", style, children, right }) => (
  <div style={{ position: "absolute", background: CL.page, borderRadius: 26, boxShadow: paperShadow, border: `1px solid ${CL.border}`, overflow: "hidden", ...style }}>
    <div style={{ height: 64, display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: `1px solid ${CL.border}`, background: "#FFF" }}>
      <Logo name="claude" size={30} />
      <span style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, whiteSpace: "nowrap" }}>{crumb} /</span>
      <span style={{ fontFamily: fonts.semibold, fontSize: 23, color: CL.text, whiteSpace: "nowrap" }}>{title}</span>
      <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>{right ?? <span style={{ fontFamily: MONO, fontSize: 15, letterSpacing: "0.1em", color: CL.sub }}>CLAUDE.AI</span>}</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 64, bottom: 0 }}>{children}</div>
  </div>
);
const SectionLabel: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{ fontFamily: fonts.semibold, fontSize: 21, color: CL.text, ...style }}>{text}</div>
);
const TopTag: React.FC<{ t: number; text: string; at?: number; color?: string }> = ({ t, text, at = -0.2, color = C.orange }) => (
  <div style={{ position: "absolute", left: 50, top: 26, zIndex: 20, display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "10px 22px 10px 14px", fontFamily: MONO, fontWeight: 800, fontSize: 20, letterSpacing: "0.12em", ...ps(t, at, 10, 0.8) }}>
    <span style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />{text}
  </div>
);
const I2 = {
  folder: "M3 7.5A2.5 2.5 0 015.5 5H10l2 2.5h6.5A2.5 2.5 0 0121 10v7.5a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17.5z",
  film: "M4 5h16v14H4zM8 5v14M16 5v14M4 9.5h4M4 14.5h4M16 9.5h4M16 14.5h4",
  cam: "M4 8h3l2-2.5h6L17 8h3v11H4zM12 16.5a3.3 3.3 0 100-6.6 3.3 3.3 0 000 6.6z",
  cut: "M6 7a2.5 2.5 0 100-.01M6 17a2.5 2.5 0 100-.01M8 8.5L20 18M8 15.5L20 6",
  up: "M12 19V6M6 11.5L12 5.5l6 6",
  plus: "M12 5v14M5 12h14",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  dl: "M12 4v11M7 10.5l5 5 5-5M5 20h14",
  play: "M7 4.5l13 7.5-13 7.5z",
  x: "M6 6l12 12M18 6L6 18",
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.6 2.5 3.8 5.5 3.8 9s-1.2 6.5-3.8 9c-2.6-2.5-3.8-5.5-3.8-9S9.4 5.5 12 3z",
  brief: "M4 8h16v11H4zM9 8V5.5h6V8M4 13h16",
  heart: "M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z",
  chat: "M4 5h16v11H9l-5 4z",
  send: "M3 11l18-7-7 18-2.5-7.5z",
};
// mini clip card (portrait, plays): photo + play bar
const ClipCard: React.FC<{ t: number; src: string; w: number; label?: string; playAt?: number; style?: React.CSSProperties; logo?: boolean }> = ({ t, src, w, label, playAt = 0, style, logo = true }) => {
  const h = w * 16 / 9;
  const pp = Math.max(0, Math.min(1, (t - playAt) / 6));
  return (
    <div style={{ position: "absolute", width: w, height: h, borderRadius: w * 0.07, overflow: "hidden", background: "#222", boxShadow: "0 24px 44px -14px rgba(70,35,10,0.5)", ...style }}>
      <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.08 + pp * 0.1}) translateX(${-pp * 4}%)` }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(30,15,5,0.55))" }} />
      {logo ? <div style={{ position: "absolute", left: w * 0.07, top: w * 0.07 }}><HolzmannMark size={w * 0.16} /></div> : null}
      {label ? <div style={{ position: "absolute", left: w * 0.08, bottom: w * 0.15, right: w * 0.08, fontFamily: fonts.bold, fontSize: w * 0.085, color: "#FFF", lineHeight: 1.15 }}>{label}</div> : null}
      <div style={{ position: "absolute", left: w * 0.08, right: w * 0.08, bottom: w * 0.07, height: Math.max(3, w * 0.018), borderRadius: 3, background: "rgba(255,255,255,0.35)" }}>
        <div style={{ width: `${pp * 100}%`, height: "100%", borderRadius: 3, background: C.orange }} />
      </div>
    </div>
  );
};

// ================= 2. "komplettes System … Filmstudio in Claude" / "Nach jedem Auftrag ein neuer Clip" =================
export const SceneSystem: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const mods = [m("proj", 0.02), m("regie", 0.2), m("fotos", 0.26), m("export", 0.34)];
  const title = m("title", 0.45), claude = m("claude", 0.56), shift = m("shift", 0.68);
  const cl = [m("c1", 0.78), m("c2", 0.88), m("c3", 0.94)];
  const sh = k(t, shift, 0.5, ez);
  const MODS = [
    { x: 50, y: 110, ic: I2.folder, h: "Projekt", s: "Logo · Farben · Firma", from: [-300, -80] },
    { x: 800, y: 110, ic: I2.cut, h: "Regiesystem", s: "so wird geschnitten", from: [300, -80] },
    { x: 50, y: 560, ic: I2.cam, h: "Fotos", s: "nach jedem Auftrag", from: [-300, 80] },
    { x: 800, y: 560, ic: I2.film, h: "Export", s: "MP4 · 30 Sekunden", from: [300, 80] },
  ];
  const CARD = { x: 330, y: 250, w: 420, h: 250 };
  const anchors = [[CARD.x, CARD.y + 40], [CARD.x + CARD.w, CARD.y + 40], [CARD.x, CARD.y + CARD.h - 40], [CARD.x + CARD.w, CARD.y + CARD.h - 40]];
  const tileC = (i: number) => [MODS[i].x + (i % 2 === 0 ? 230 : 0), MODS[i].y + 50];
  return (
    <PanelStage t={t} dur={dur} seed={11}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${-250 * sh}px, ${40 * sh}px) scale(${1 - 0.36 * sh})`, transformOrigin: "50% 50%" }}>
        {/* connectors */}
        <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {MODS.map((_, i) => {
            const p = k(t, mods[i] + 0.25, 0.3);
            const [x1, y1] = tileC(i), [x2, y2] = anchors[i];
            return <path key={i} d={`M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`} fill="none" stroke={C.orange} strokeWidth={4} strokeDasharray="2 12" strokeLinecap="round" strokeDashoffset={-t * 40} opacity={p} />;
          })}
        </svg>
        {/* project card */}
        <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, ...ps(t, -0.25, 20, 0.85) }}>
          <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 26, border: `1.5px solid ${CL.border}`, boxShadow: paperShadow, padding: "26px 30px", boxSizing: "border-box", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Ico d={I2.folder} size={26} color={CL.sub} />
              <Mono text="PROJEKT" size={16} />
              {t > claude - 0.05 ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8, background: CL.bubble, borderRadius: 999, padding: "5px 14px 5px 8px", fontFamily: fonts.semibold, fontSize: 19, color: CL.text, ...ps(t, claude, 8, 0.5) }}><Logo name="claude" size={24} />in Claude</span> : null}
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: PK.ink, marginTop: 16, lineHeight: 1, minHeight: 64 }}>
              {typed("Filmstudio", t, title - 0.25, title + 0.25) || <span style={{ color: CL.border }}>Filmstudio</span>}
            </div>
            <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub, marginTop: 14 }}>Nach jedem Auftrag ein Clip</div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              {mods.map((a, i) => <span key={i} style={{ width: 52, height: 8, borderRadius: 4, background: t > a + 0.3 ? C.orange : CL.border }} />)}
            </div>
            <Sheen p={k(t, title + 0.1, 0.7)} strength={0.8} />
          </div>
        </div>
        <Ring t={t} at={title + 0.1} x={CARD.x + CARD.w / 2} y={CARD.y + CARD.h / 2} r={300} />
        {/* modules snap in */}
        {MODS.map((md, i) => {
          const a = mods[i];
          const p = interpolate(t, [a - 0.1, a + 0.32], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
          const snap = t > a + 0.22 && t < a + 0.4 ? 1 - (t - a - 0.22) / 0.18 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: md.x + (1 - p) * md.from[0], top: md.y + (1 - p) * md.from[1], width: 230, opacity: k(t, a - 0.1, 0.1), transform: `rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg) scale(${1 + snap * 0.06})` }}>
              <div style={{ background: "#FFF", borderRadius: 20, border: `1.5px solid ${snap > 0 ? C.orange : CL.border}`, boxShadow: "0 18px 34px -14px rgba(90,55,30,0.4)", padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 54, height: 54, borderRadius: 15, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ico d={md.ic} size={30} color={PK.orangeDeep} sw={2} /></div>
                <div>
                  <div style={{ fontFamily: fonts.bold, fontSize: 25, color: PK.ink }}>{md.h}</div>
                  <div style={{ fontFamily: fonts.medium, fontSize: 16, color: CL.sub, whiteSpace: "nowrap" }}>{md.s}</div>
                </div>
              </div>
            </div>
          );
        })}
        {mods.map((a, i) => <Glint key={i} t={t} at={a + 0.25} x={anchors[i][0]} y={anchors[i][1]} size={30} />)}
      </div>
      {/* clips stack per Auftrag */}
      {t > shift ? (
        <>
          <div style={{ position: "absolute", left: 600, top: 40, ...ps(t, shift + 0.05, 10, 0.8) }}><Mono text="NACH JEDEM AUFTRAG" size={20} color={PK.orangeDeep} /></div>
          {[{ src: "hero", l: "Dach Weber", r: -7 }, { src: "front2", l: "Dach Kaya", r: 2 }, { src: "hero2", l: "Dach Lenz", r: 9 }].map((c, i) => {
            const a = cl[i];
            const q = interpolate(t, [a - 0.12, a + 0.3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
            return (
              <div key={i} style={{ position: "absolute", left: 530 + i * 150, top: 110 + (1 - q) * 500, transform: `rotate(${c.r * q}deg)`, opacity: k(t, a - 0.12, 0.08), zIndex: i }}>
                <ClipCard t={t} src={PHOTO(c.src)} w={200} label={c.l} playAt={a} />
                <div style={{ position: "absolute", left: 10, top: -18 }}><Pill text={`AUFTRAG ${41 + i}`} color="#FFF" bg={PK.ink} size={15} dot={false} /></div>
              </div>
            );
          })}
          {t > cl[0] ? (
            <div style={{ position: "absolute", left: 600, top: 520 + 0 * 0, ...ps(t, cl[0], 10, 0.8), zIndex: 10 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFF", borderRadius: 999, padding: "10px 22px 10px 12px", boxShadow: "0 14px 30px rgba(80,40,15,0.22)" }}>
                <CheckDot size={34} />
                <span style={{ fontFamily: fonts.bold, fontSize: 30, color: PK.ink }}><Odometer value={t < cl[1] ? 1 : t < cl[2] ? 2 : 3} size={30} /> neue Clips</span>
              </div>
            </div>
          ) : null}
          {cl.map((a, i) => <Glint key={i} t={t} at={a + 0.2} x={660 + i * 150} y={130} size={32} />)}
        </>
      ) : null}
    </PanelStage>
  );
};

// ================= 3. "Einmal einrichten": project with logo, colours, three sentences =================
const SENT3 = ["Holzmann Dachtechnik, Meisterbetrieb aus Freiburg.", "Wir decken und sanieren Dächer, in 3 Tagen dicht.", "Ton: ruhig, ehrlich, handwerklich."];
export const SceneSetup: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const name = m("name", 0.03), proj = m("proj", 0.18), logo = m("logo", 0.32), farben = m("farben", 0.45), s0 = m("saetze", 0.55), s1 = m("saetzeEnd", 0.78), kennt = m("kennt", 0.85), look = m("look", 0.94);
  const segs = [s0, s0 + (s1 - s0) * 0.36, s0 + (s1 - s0) * 0.7, s1];
  const ok = k(t, kennt, 0.4, Easing.out(Easing.back(1.5)));
  return (
    <PanelStage t={t} dur={dur} seed={12}>
      <TopTag t={t} text="EINMAL EINRICHTEN" />
      <div style={{ position: "absolute", left: 50, top: 92, width: 980, height: 690, transform: tilt(t, 4, 0), transformOrigin: "50% 100%" }}>
        <Win title={typed("Filmstudio", t, name, name + 0.5) || "Neues Projekt"} style={{ inset: 0 }}>
          {/* left: name + instructions */}
          <div style={{ position: "absolute", left: 30, top: 24, width: 540 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 54, color: PK.ink, lineHeight: 1, minHeight: 54 }}>{typed("Filmstudio", t, name, name + 0.5)}{t > name && t < proj ? <span style={{ display: "inline-block", width: 3, height: 46, background: C.orange, marginLeft: 4 }} /> : null}</div>
              {t > proj ? <span style={{ ...ps(t, proj, 8, 0.5) }}><Pill text="PROJEKT ERSTELLT" color={C.green} bg={C.greenSoft} size={15} /></span> : null}
            </div>
            <SectionLabel text="Instructions" style={{ marginTop: 26 }} />
            <div style={{ marginTop: 10, background: "#FFF", border: `1.5px solid ${t > s0 - 0.1 && t < s1 + 0.2 ? C.orange : CL.border}`, borderRadius: 18, padding: "18px 20px", height: 360, boxSizing: "border-box", boxShadow: t > s0 - 0.1 && t < s1 + 0.2 ? "0 0 0 5px rgba(217,119,87,0.14)" : undefined }}>
              {t < s0 - 0.05 ? <div style={{ fontFamily: fonts.medium, fontSize: 24, color: CL.sub }}>Set project instructions</div> : null}
              {SENT3.map((s, i) => {
                const txt = typed(s, t, segs[i], segs[i + 1] - 0.04);
                if (!txt) return null;
                return (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: C.orangeSoft, color: PK.orangeDeep, fontFamily: MONO, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${pop(t, segs[i], 0.3)})` }}>{i + 1}</span>
                    <span style={{ fontFamily: fonts.medium, fontSize: 26, color: CL.text, lineHeight: 1.3 }}>{txt}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* right: project knowledge */}
          <div style={{ position: "absolute", left: 600, top: 24, width: 350, bottom: 24, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 20, padding: "18px 20px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <SectionLabel text="Project knowledge" />
              <div style={{ marginLeft: "auto", width: 40, height: 40, borderRadius: 12, border: `1.5px solid ${CL.border}`, background: t > logo - 0.3 && t < logo ? CL.bubble : "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.plus} size={22} /></div>
            </div>
            <Mono text="DATEIEN" size={14} style={{ marginTop: 18 }} />
            {t > logo - 0.02 ? (
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12, border: `1.5px solid ${CL.border}`, borderRadius: 14, padding: "10px 12px", ...ps(t, logo, 14, 0.7) }}>
                <HolzmannMark size={52} />
                <div>
                  <div style={{ fontFamily: fonts.semibold, fontSize: 20, color: CL.text }}>holzmann-logo.svg</div>
                  <div style={{ fontFamily: MONO, fontSize: 13, color: CL.sub, letterSpacing: "0.08em" }}>LOGO · 12 KB</div>
                </div>
              </div>
            ) : null}
            <Mono text="FARBEN" size={14} style={{ marginTop: 22 }} />
            <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
              {[["#C8623B", "C8623B"], ["#F6EFE6", "F6EFE6"], ["#16130F", "16130F"]].map(([c, hx], i) => (
                <div key={hx} style={{ textAlign: "center", ...ps(t, farben - 0.05 + i * 0.12, 16, 0.4) }}>
                  <div style={{ width: 92, height: 72, borderRadius: 14, background: c, border: `1.5px solid ${CL.border}`, boxShadow: "0 8px 16px -8px rgba(0,0,0,0.3)" }} />
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, color: CL.sub, marginTop: 6 }}>#{hx}</div>
                </div>
              ))}
            </div>
            <Mono text="FIRMA" size={14} style={{ marginTop: 22 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, opacity: k(t, s1, 0.2) }}>
              <Ico d={I2.doc} size={26} color={C.orange} /><span style={{ fontFamily: fonts.semibold, fontSize: 19, color: CL.text }}>3 Sätze · Instructions</span>
            </div>
          </div>
        </Win>
      </div>
      {/* Claude knows your look */}
      {t > kennt - 0.05 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", zIndex: 30, opacity: k(t, kennt, 0.1), transform: `translateY(${(1 - ok) * 40}px) scale(${0.8 + 0.2 * ok})` }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "#16130F", color: "#FFF", borderRadius: 999, padding: "16px 34px 16px 18px", fontFamily: fonts.bold, fontSize: 36, boxShadow: "0 20px 40px rgba(0,0,0,0.3)", position: "relative", overflow: "hidden" }}>
            <CheckDot size={46} p={k(t, kennt + 0.12, 0.3)} /> Claude kennt deinen{" "}
            <span style={{ position: "relative" }}><span style={{ position: "absolute", left: -6, right: -6, top: 2, bottom: 0, background: C.orange, borderRadius: 8, transform: `scaleX(${k(t, look - 0.05, 0.25)})`, transformOrigin: "0% 50%" }} /><span style={{ position: "relative" }}>Look</span></span>
            <Sheen p={k(t, kennt + 0.3, 0.6)} strength={0.6} />
          </div>
        </div>
      ) : null}
      <Pointer t={t} path={[{ x: 900, y: 860, at: 0 }, { x: 912, y: 222, at: logo - 0.2, click: true }, { x: 300, y: 430, at: s0 - 0.08, click: true }, { x: 520, y: 760, at: kennt }]} size={54} />
      <Glint t={t} at={logo + 0.2} x={700} y={300} size={32} />
      <Glint t={t} at={farben + 0.3} x={990} y={400} size={30} />
      <Glint t={t} at={kennt + 0.3} x={820} y={650} size={40} />
    </PanelStage>
  );
};

// ================= 4. "fotografierst die fertige Arbeit … ziehst die Fotos ins Projekt" =================
const SHOTS4 = ["hero", "front", "ridge"];
export const SceneFotos: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const sh = [m("shot1", 0.23), m("shot2", 0.49), m("shot3", 0.57)];
  const drag = m("drag", 0.7), drop = m("drop", 0.89);
  const nShots = sh.filter((a) => t >= a).length;
  const flash = sh.reduce((f, a) => Math.max(f, t >= a && t < a + 0.16 ? 1 - (t - a) / 0.16 : 0), 0);
  const view = SHOTS4[Math.min(2, nShots)] ?? "ridge";
  const PX = 70, PY = 70, PWd = 330, PHd = 690;
  const thumb = { x: PX + 46, y: PY + PHd - 98 };
  const zone = { x: 470, y: 150, w: 550, h: 470 };
  const dp = k(t, drag + 0.05, Math.max(0.3, drop - drag - 0.1), ez);
  const landed = t > drop;
  return (
    <PanelStage t={t} dur={dur} seed={13}>
      <TopTag t={t} text="NACH JEDEM AUFTRAG" />
      {/* phone with camera */}
      <div style={{ position: "absolute", left: PX, top: PY, width: PWd, height: PHd, transform: `${tilt(t, 2, 8)} translateY(${(1 - pop(t, -0.3, 0.6)) * 60}px)`, ...{} }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 54, background: "linear-gradient(135deg, #F2EEE8, #C9C2B8 50%, #F7F3EC)", padding: 11, boxSizing: "border-box", boxShadow: "30px 40px 60px -20px rgba(70,40,15,0.45)" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 44, background: "#0B0B0C", overflow: "hidden" }}>
            <Img src={PHOTO(view)} style={{ position: "absolute", left: -20, top: 60, width: PWd + 20, height: 440, objectFit: "cover", transform: `translate(${Math.sin(t * 1.2) * 6}px, ${Math.cos(t) * 4}px) scale(1.04)` }} />
            {/* focus square */}
            <div style={{ position: "absolute", left: 120, top: 220, width: 80, height: 80, border: "2px solid #FFD54A", opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 3)) }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 22, textAlign: "center", fontFamily: fonts.semibold, fontSize: 15, color: "#FFD54A" }}>FOTO</div>
            {/* shutter + thumbnail */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 74, height: 74, borderRadius: "50%", border: "5px solid #FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 58, height: 58, borderRadius: "50%", background: "#FFF", transform: `scale(${flash > 0 ? 0.82 : 1})` }} />
              </div>
            </div>
            {nShots > 0 ? <Img src={PHOTO(SHOTS4[nShots - 1])} style={{ position: "absolute", left: 32, bottom: 44, width: 54, height: 54, borderRadius: 10, objectFit: "cover", border: "2px solid #FFF", transform: `scale(${pop(t, sh[nShots - 1] + 0.05, 0.3)})` }} /> : null}
            {nShots > 0 ? <div style={{ position: "absolute", left: 74, bottom: 86, minWidth: 26, height: 26, borderRadius: 13, background: C.orange, color: "#FFF", fontFamily: fonts.bold, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{nShots}</div> : null}
            <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: flash * 0.9 }} />
            <div style={{ position: "absolute", left: "50%", top: 12, width: 100, height: 28, marginLeft: -50, borderRadius: 999, background: "#000" }} />
          </div>
        </div>
      </div>
      {/* claude project drop zone */}
      <div style={{ position: "absolute", left: zone.x, top: zone.y - 70, width: zone.w, height: zone.h + 120, ...ps(t, -0.2, 20, 0.9) }}>
        <Win title="Filmstudio" style={{ inset: 0 }}>
          <div style={{ position: "absolute", left: 22, right: 22, top: 22, bottom: 22, borderRadius: 18, border: `3px dashed ${t > drag && !landed ? C.orange : CL.border}`, background: t > drag && !landed ? "rgba(217,119,87,0.07)" : "#FFF" }}>
            <SectionLabel text="Project knowledge · Files" style={{ position: "absolute", left: 22, top: 18 }} />
            {!landed ? (
              <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center", fontFamily: fonts.medium, fontSize: 26, color: t > drag ? PK.orangeDeep : CL.sub }}>
                <Ico d={I2.dl} size={44} color={t > drag ? C.orange : CL.sub} /><br />Fotos hierher ziehen
              </div>
            ) : (
              <div style={{ position: "absolute", left: 22, right: 22, top: 70, display: "flex", flexDirection: "column", gap: 14 }}>
                {SHOTS4.map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, border: `1.5px solid ${CL.border}`, borderRadius: 14, padding: "8px 12px", background: "#FFF", ...ps(t, drop + i * 0.08, 14, 0.7) }}>
                    <Img src={PHOTO(s)} style={{ width: 70, height: 70, borderRadius: 10, objectFit: "cover" }} />
                    <div>
                      <div style={{ fontFamily: fonts.semibold, fontSize: 21, color: CL.text }}>IMG_{4021 + i}.HEIC</div>
                      <div style={{ fontFamily: MONO, fontSize: 13, color: CL.sub, letterSpacing: "0.08em" }}>FOTO · 2,{4 + i} MB</div>
                    </div>
                    <span style={{ marginLeft: "auto" }}><CheckDot size={30} p={k(t, drop + 0.15 + i * 0.08, 0.3)} /></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Win>
      </div>
      {/* dragged stack */}
      {t > drag && !landed ? (
        <div style={{ position: "absolute", left: thumb.x + (zone.x + 180 - thumb.x) * dp, top: thumb.y + (zone.y + 180 - thumb.y) * dp - Math.sin(dp * Math.PI) * 120, zIndex: 40 }}>
          {SHOTS4.map((s, i) => <PhonePhoto key={s} src={PHOTO(s)} w={120} style={{ left: i * 14, top: i * -10, transform: `rotate(${(i - 1) * 8}deg) scale(${0.6 + 0.4 * k(t, drag, 0.2)})` }} />)}
          <div style={{ position: "absolute", left: 120, top: -30 }}><Pill text="3" color="#FFF" bg={C.orange} size={20} dot={false} /></div>
        </div>
      ) : null}
      {landed ? <div style={{ position: "absolute", left: zone.x + 140, top: zone.y + zone.h - 20, zIndex: 30, ...ps(t, drop + 0.25, 10, 0.6) }}><Pill text="3 FOTOS IM PROJEKT" color={C.green} bg={C.greenSoft} size={20} /></div> : null}
      <Pointer t={t} path={[{ x: 520, y: 760, at: 0 }, { x: thumb.x + 30, y: thumb.y + 30, at: drag, click: true }, { x: zone.x + 240, y: zone.y + 240, at: drop - 0.02, click: true }, { x: zone.x + 300, y: zone.y + 380, at: drop + 0.5 }]} size={56} />
      {sh.map((a, i) => <Glint key={i} t={t} at={a + 0.1} x={PX + PWd - 30} y={PY + 80 + i * 40} size={30} />)}
      <Ring t={t} at={drop} x={zone.x + 240} y={zone.y + 240} r={200} />
    </PanelStage>
  );
};

// ================= 5. "tippst Schrägstrich Motion und startest mein Regiesystem" =================
export const SceneMotion: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const slash = m("slash", 0.35), typeEnd = m("typeEnd", 0.48), menu = m("menu", 0.42), pick = m("pick", 0.58), chip = m("chip", 0.63), regie = m("regie", 0.79);
  const txt = t < slash ? "" : typed("/motion", t, slash, typeEnd);
  const menuOn = t > menu && t < pick + 0.1;
  const chipP = pop(t, chip, 0.45);
  const glow = t > regie ? 0.5 + 0.5 * Math.abs(Math.sin((t - regie) * 5)) : 0;
  return (
    <PanelStage t={t} dur={dur} seed={14}>
      <div style={{ position: "absolute", left: 50, top: 40, width: 980, height: 740, transform: tilt(t, 5, 0), transformOrigin: "50% 100%" }}>
        <Win title="Filmstudio" style={{ inset: 0 }} right={<span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: fonts.semibold, fontSize: 18, color: PK.orangeDeep, background: C.orangeSoft, borderRadius: 999, padding: "6px 14px" }}>3 Fotos · Logo · Farben</span>}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 30, textAlign: "center", fontFamily: SERIF, fontSize: 52, color: CL.text }}>
            <Logo name="claude" size={44} /> <span style={{ verticalAlign: "middle" }}>Neuer Clip für Auftrag 41</span>
          </div>
          <div style={{ position: "absolute", left: 120, right: 120, top: 110, display: "flex", gap: 14, justifyContent: "center" }}>
            {SHOTS4.map((s, i) => <Img key={s} src={PHOTO(s)} style={{ width: 92, height: 92, borderRadius: 14, objectFit: "cover", border: `1.5px solid ${CL.border}`, ...ps(t, -0.2 + i * 0.08, 10, 0.8) }} />)}
          </div>
          {/* slash menu */}
          {menuOn ? (
            <div style={{ position: "absolute", left: 60, top: 222, width: 600, background: "#FFF", border: `1.5px solid ${CL.border}`, borderRadius: 18, boxShadow: "0 20px 44px -10px rgba(40,25,10,0.28)", padding: 10, zIndex: 5, ...ps(t, menu, 14, 0.9) }}>
              {[["/motion", "Clip aus deinen Dateien"], ["/research", "Gründlich recherchieren"]].map(([cmd, d], i) => (
                <div key={cmd} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 12, background: i === 0 ? (t > pick - 0.05 ? C.orangeSoft : CL.bubble) : "transparent" }}>
                  <Ico d={i === 0 ? I2.film : I2.globe} size={28} color={i === 0 ? PK.orangeDeep : CL.sub} />
                  <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, color: CL.text }}>{cmd}</span>
                  <span style={{ fontFamily: fonts.medium, fontSize: 21, color: CL.sub }}>{d}</span>
                  {i === 0 ? <span style={{ marginLeft: "auto" }}><Pill text="BETA" color={C.amber} bg={C.amberSoft} size={14} dot={false} /></span> : null}
                </div>
              ))}
            </div>
          ) : null}
          {/* composer */}
          <div style={{ position: "absolute", left: 40, right: 40, bottom: 34, height: 270, background: "#FFF", border: `1.5px solid ${t > slash - 0.1 ? C.orange : CL.border}`, borderRadius: 28, boxShadow: t > slash - 0.1 ? "0 0 0 6px rgba(217,119,87,0.12), 0 14px 34px rgba(20,20,20,0.07)" : "0 14px 34px rgba(20,20,20,0.07)", padding: "24px 26px 20px", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, alignContent: "flex-start", flexWrap: "wrap" }}>
              {txt ? (
                <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 52, color: t > pick ? PK.orangeDeep : CL.text, background: t > pick ? C.orangeSoft : "transparent", borderRadius: 12, padding: t > pick ? "2px 14px" : 0 }}>{txt}</span>
              ) : <span style={{ fontFamily: fonts.medium, fontSize: 32, color: CL.sub }}>Wie kann ich dir heute helfen?</span>}
              {t > slash && t < pick ? <span style={{ display: "inline-block", width: 4, height: 50, background: C.orange, marginLeft: -12 }} /> : null}
              {t > chip - 0.02 ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#16130F", color: "#FFF", borderRadius: 16, padding: "12px 22px 12px 14px", fontFamily: fonts.bold, fontSize: 34, transform: `scale(${0.6 + 0.4 * chipP})`, opacity: k(t, chip, 0.1), boxShadow: `0 0 0 ${glow * 8}px rgba(217,119,87,${0.35 * glow}), 0 14px 26px rgba(0,0,0,0.25)` }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.cut} size={28} color="#FFF" sw={2.2} /></span>
                  Regiesystem
                  {t > regie ? <CheckDot size={32} p={k(t, regie, 0.3)} /> : <span style={{ fontFamily: MONO, fontSize: 15, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em" }}>SKILL</span>}
                </span>
              ) : null}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, border: `1.5px solid ${CL.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.plus} size={26} /></div>
              <div style={{ marginLeft: "auto", fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>Opus 5.5</div>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: CL.send, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${t > regie && t < regie + 0.12 ? 0.85 : 1})` }}><Ico d={I2.up} size={30} color="#FFF" sw={2.4} /></div>
            </div>
          </div>
        </Win>
      </div>
      {t > regie + 0.05 ? <div style={{ position: "absolute", right: 60, top: 20, zIndex: 20, ...ps(t, regie + 0.05, 12, 0.6) }}><Pill text="REGIESYSTEM LÄUFT" color="#FFF" bg={C.green} size={20} /></div> : null}
      <Pointer t={t} path={[{ x: 820, y: 860, at: 0 }, { x: 300, y: 340, at: pick, click: true }, { x: 985, y: 745, at: regie, click: true }, { x: 1040, y: 800, at: regie + 0.6 }]} size={56} />
      <Ring t={t} at={chip} x={620} y={560} r={180} />
      <Glint t={t} at={regie + 0.1} x={640} y={500} size={40} />
      <Glint t={t} at={slash + 0.3} x={300} y={520} size={30} />
    </PanelStage>
  );
};

// ================= 6. "erst das Problem beim Kunden, dann deine Arbeit, am Ende dein Logo" =================
export const SceneCut: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const segA = [m("problem", 0.42), m("arbeit", 0.66), m("logo", 0.87)];
  const sagt = m("sagt", 0.05);
  const SEG = [
    { l: "PROBLEM BEIM KUNDEN", c: C.red, soft: C.redSoft, from: 0, to: 0.27 },
    { l: "DEINE ARBEIT", c: C.orange, soft: C.orangeSoft, from: 0.27, to: 0.8 },
    { l: "LOGO", c: PK.ink, soft: "#E6E1D8", from: 0.8, to: 1 },
  ];
  const cur = segA.filter((a) => t >= a - 0.05).length - 1;
  const TL = { x: 60, y: 560, w: 960 };
  // playhead runs inside the active segment
  const ph = cur < 0 ? 0 : SEG[cur].from + (SEG[cur].to - SEG[cur].from) * k(t, segA[cur], (cur < 2 ? segA[cur + 1] - segA[cur] : 1.2), Easing.linear);
  const RULES = ["1  Problem beim Kunden zeigen", "2  Deine Arbeit, Vorher → Nachher", "3  Am Ende dein Logo + Nummer"];
  return (
    <PanelStage t={t} dur={dur} seed={15}>
      <TopTag t={t} text="REGIESYSTEM · SCHNITTPLAN" />
      {/* monitor (9:16) */}
      <div style={{ position: "absolute", left: 70, top: 96, width: 240, height: 426, borderRadius: 22, overflow: "hidden", background: "#1A1512", boxShadow: paperShadow, ...ps(t, -0.2, 20, 0.9) }}>
        {cur <= 0 ? (
          <>
            <Img src={PHOTO("rafters")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.1 + (t - segA[0]) * 0.03})`, filter: cur < 0 ? "grayscale(0.6) brightness(0.9)" : "saturate(0.8)" }} />
            {cur === 0 ? <div style={{ position: "absolute", left: 14, top: 18, ...ps(t, segA[0] + 0.05, 8, 0.6) }}><Pill text="DACH UNDICHT" color="#FFF" bg={C.red} size={15} /></div> : null}
            {cur === 0 ? Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: (i * 53) % 240, top: ((t * 600 + i * 97) % 470) - 40, width: 2, height: 26, background: "rgba(220,235,255,0.7)", transform: "rotate(12deg)" }} />) : null}
          </>
        ) : cur === 1 ? (
          <>
            <Img src={PHOTO("hero")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + (t - segA[1]) * 0.04})` }} />
            <div style={{ position: "absolute", left: 14, top: 18, ...ps(t, segA[1] + 0.05, 8, 0.6) }}><Pill text="IN 3 TAGEN DICHT" color="#FFF" bg={C.orange} size={15} /></div>
          </>
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "#FBF5EC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <HolzmannMark size={100} p={k(t, segA[2], 0.6)} />
            <div style={{ fontFamily: fonts.bold, fontSize: 32, color: PK.ink, opacity: k(t, segA[2] + 0.2, 0.2) }}>HOLZMANN</div>
          </div>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 34, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
          <Ico d={I2.play} size={16} color="#FFF" sw={2} />
          <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: "#FFF", fontVariantNumeric: "tabular-nums" }}>0:{String(Math.round(ph * 30)).padStart(2, "0")} / 0:30</span>
        </div>
      </div>
      {/* regiesystem rules */}
      <div style={{ position: "absolute", left: 350, top: 96, width: 670, height: 426, background: "#FFF", borderRadius: 24, border: `1.5px solid ${CL.border}`, boxShadow: paperShadow, padding: "22px 26px", boxSizing: "border-box", ...ps(t, -0.15, 20, 0.9) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 44, height: 44, borderRadius: 12, background: C.orange, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.cut} size={26} color="#FFF" sw={2.2} /></span>
          <span style={{ fontFamily: fonts.bold, fontSize: 30, color: PK.ink }}>Regiesystem</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 15, color: CL.sub, letterSpacing: "0.1em" }}>SKILL.MD</span>
        </div>
        <div style={{ fontFamily: fonts.medium, fontSize: 23, color: CL.sub, marginTop: 14, minHeight: 30 }}>{typed("So wird geschnitten:", t, sagt, sagt + 0.6)}</div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
          {RULES.map((r, i) => {
            const on = cur >= i, act = cur === i;
            return (
              <div key={i} style={{ position: "relative", fontFamily: fonts.semibold, fontSize: 30, color: on ? PK.ink : "#B9B2A6", padding: "10px 14px", borderRadius: 14, background: act ? SEG[i].soft : "transparent", transition: "none", ...ps(t, sagt + 0.4 + i * 0.25, 10, 0.95) }}>
                {r}
                {on ? <span style={{ position: "absolute", right: 14, top: 12 }}><CheckDot size={32} color={i === 2 ? PK.ink : SEG[i].c} p={k(t, segA[i] + 0.1, 0.3)} /></span> : null}
              </div>
            );
          })}
        </div>
      </div>
      {/* timeline */}
      <div style={{ position: "absolute", left: TL.x, top: TL.y, width: TL.w, height: 180, background: "#FFF", borderRadius: 22, border: `1.5px solid ${CL.border}`, boxShadow: "0 20px 40px -18px rgba(90,55,30,0.4)", ...ps(t, 0.0, 20, 0.9) }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 12, height: 22, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 14, color: CL.sub }}>
          {["0:00", "0:05", "0:10", "0:15", "0:20", "0:25", "0:30"].map((s) => <span key={s}>{s}</span>)}
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, top: 44, height: 108, display: "flex", gap: 6 }}>
          {SEG.map((s, i) => {
            const lit = k(t, segA[i] - 0.05, 0.28, ez);
            return (
              <div key={i} style={{ position: "relative", flex: s.to - s.from, borderRadius: 14, border: `2px dashed ${lit > 0.5 ? "transparent" : CL.border}`, overflow: "hidden", background: "#FAF7F2" }}>
                <div style={{ position: "absolute", inset: 0, background: s.c, transform: `scaleX(${lit})`, transformOrigin: "0% 50%" }} />
                <div style={{ position: "absolute", left: 14, top: 14, right: 8, fontFamily: MONO, fontWeight: 800, fontSize: i === 2 ? 17 : 19, letterSpacing: "0.1em", color: lit > 0.5 ? "#FFF" : "#B9B2A6", whiteSpace: "nowrap" }}>{i + 1} {s.l}</div>
                {lit > 0.5 ? <div style={{ position: "absolute", left: 14, bottom: 12, display: "flex", gap: 4 }}>{Array.from({ length: i === 1 ? 9 : i === 0 ? 4 : 2 }, (_, j) => <span key={j} style={{ width: 30, height: 30, borderRadius: 6, background: "rgba(255,255,255,0.28)", transform: `scale(${pop(t, segA[i] + 0.1 + j * 0.04, 0.25)})` }} />)}</div> : null}
                <Sheen p={k(t, segA[i] + 0.15, 0.5)} strength={0.7} />
              </div>
            );
          })}
        </div>
        {/* playhead */}
        <div style={{ position: "absolute", left: 20 + ph * (TL.w - 40), top: 36, width: 4, height: 128, background: PK.ink, borderRadius: 2, marginLeft: -2, boxShadow: "0 0 0 2px #FFF" }}>
          <div style={{ position: "absolute", left: -9, top: -10, width: 22, height: 14, borderRadius: 4, background: PK.ink }} />
        </div>
      </div>
      {segA.map((a, i) => <Glint key={i} t={t} at={a + 0.2} x={TL.x + 60 + [0.13, 0.53, 0.9][i] * TL.w} y={TL.y + 40} size={34} />)}
    </PanelStage>
  );
};

// ================= 7. "Clip von etwa dreißig Sekunden, fertig für Website, Stellenanzeige und Instagram" =================
export const SceneExport: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const sec = m("sec", 0.24), fertig = m("fertig", 0.4), dest = [m("web", 0.56), m("job", 0.72), m("ig", 0.88)];
  const split = fertig + 0.42;
  const sp = k(t, split, 0.45, ez);
  const prog = interpolate(t, [0.05, fertig - 0.05], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const secV = interpolate(t, [sec - 0.2, sec + 0.35], [0, 30], { ...clamp, easing: Easing.out(Easing.cubic) });
  const done = t > fertig;
  const D = [{ x: 50, w: 320 }, { x: 390, w: 320 }, { x: 730, w: 300 }];
  const DY = 330, DH = 430;
  const fly = (i: number) => k(t, dest[i] - 0.28, 0.32, ez);
  return (
    <PanelStage t={t} dur={dur} seed={16}>
      {/* export card */}
      <div style={{ position: "absolute", left: 140, top: 120 - sp * 96, width: 800, transform: `scale(${1 - sp * 0.42})`, transformOrigin: "50% 0%", zIndex: 10 }}>
        <div style={{ ...ps(t, -0.25, 20, 0.9) }}>
        <div style={{ position: "relative", background: "#FFF", borderRadius: 28, border: `1.5px solid ${CL.border}`, boxShadow: paperShadow, padding: "26px 30px", display: "flex", gap: 28, alignItems: "center", overflow: "hidden" }}>
          <div style={{ position: "relative", width: 170, height: 302, flexShrink: 0 }}><ClipCard t={t} src={PHOTO("hero")} w={170} playAt={0} style={{ left: 0, top: 0 }} /></div>
          <div style={{ flex: 1 }}>
            <Mono text={done ? "FERTIG" : "EXPORTIERE …"} size={18} color={done ? C.green : PK.orangeDeep} />
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 8 }}>
              <span style={{ fontFamily: fonts.bold, fontSize: 120, color: PK.ink, letterSpacing: "-0.03em", lineHeight: 1 }}>0:<Odometer value={secV} size={120} speed={t > sec - 0.2 && t < sec + 0.3 ? 1 : 0} /></span>
            </div>
            <div style={{ fontFamily: fonts.medium, fontSize: 24, color: CL.sub, marginTop: 4 }}>holzmann_auftrag-41.mp4 · 1080 × 1920</div>
            <div style={{ marginTop: 18, height: 16, borderRadius: 8, background: "#EFEAE2", overflow: "hidden" }}>
              <div style={{ width: `${prog * 100}%`, height: "100%", background: done ? C.green : `linear-gradient(90deg, ${C.orange}, #E9946F)`, borderRadius: 8 }} />
            </div>
            {done ? <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10, ...ps(t, fertig, 8, 0.7) }}><CheckDot size={34} p={k(t, fertig + 0.05, 0.3)} /><span style={{ fontFamily: fonts.bold, fontSize: 28, color: PK.ink }}>Fertig zum Posten</span></div> : null}
          </div>
          <Sheen p={k(t, fertig, 0.6)} strength={0.8} />
        </div>
        </div>
      </div>
      {/* destinations */}
      {t > split ? D.map((d, i) => {
        const q = pop(t, split + 0.05 + i * 0.08, 0.45);
        const arrived = t > dest[i];
        const f = fly(i);
        return (
          <div key={i} style={{ position: "absolute", left: d.x, top: DY + (1 - q) * 120, width: d.w, height: DH, opacity: k(t, split + i * 0.08, 0.12), zIndex: 5 }}>
            <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 24, border: `2px solid ${arrived ? C.orange : CL.border}`, boxShadow: paperShadow, overflow: "hidden" }}>
              {i === 0 ? (
                <>
                  <div style={{ height: 40, background: "#F1EDE6", display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
                    {["#E5484D", "#F2A33A", "#1E9E57"].map((c) => <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
                    <span style={{ marginLeft: 8, flex: 1, background: "#FFF", borderRadius: 8, fontFamily: fonts.medium, fontSize: 15, color: CL.sub, padding: "3px 10px" }}>holzmann-dach.de</span>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><HolzmannMark size={30} /><span style={{ fontFamily: fonts.bold, fontSize: 18, color: PK.ink }}>HOLZMANN</span></div>
                    <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 30, color: PK.ink, lineHeight: 1.05, marginTop: 10 }}>Dächer, die<br /><i>dicht</i> halten.</div>
                  </div>
                </>
              ) : i === 1 ? (
                <div style={{ padding: "16px 18px" }}>
                  <Mono text="STELLENANZEIGE" size={14} color={PK.orangeDeep} />
                  <div style={{ fontFamily: fonts.bold, fontSize: 27, color: PK.ink, lineHeight: 1.15, marginTop: 8 }}>Dachdecker (m/w/d)</div>
                  <div style={{ fontFamily: fonts.medium, fontSize: 17, color: CL.sub, marginTop: 4 }}>Freiburg · Vollzeit · ab sofort</div>
                </div>
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "#000" }}>
                  <div style={{ position: "absolute", left: 14, top: 12, display: "flex", alignItems: "center", gap: 10, zIndex: 3 }}><IgLogo size={34} /><span style={{ fontFamily: fonts.bold, fontSize: 20, color: "#FFF" }}>Reels</span></div>
                </div>
              )}
              {/* video slot */}
              <div style={{ position: "absolute", left: i === 2 ? 0 : 16, right: i === 2 ? 0 : 16, top: i === 0 ? 168 : i === 1 ? 128 : 0, bottom: i === 2 ? 0 : i === 1 ? 74 : 16, borderRadius: i === 2 ? 0 : 14, overflow: "hidden", background: arrived ? "#222" : i === 2 ? "#141414" : "#F1EDE6", border: arrived || i === 2 ? "none" : `2px dashed ${CL.border}` }}>
                {arrived ? <Img src={PHOTO(i === 1 ? "ridge" : "hero")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + (t - dest[i]) * 0.05})` }} /> : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.play} size={40} color={i === 2 ? "#555" : "#CFC7BA"} /></div>}
                {arrived ? <div style={{ position: "absolute", left: 10, right: 10, bottom: 10, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.35)" }}><div style={{ width: `${Math.min(100, (t - dest[i]) * 30)}%`, height: "100%", background: C.orange, borderRadius: 3 }} /></div> : null}
                {arrived ? <div style={{ position: "absolute", left: 10, top: i === 2 ? 60 : 10 }}><HolzmannMark size={34} /></div> : null}
              </div>
              {i === 1 ? <div style={{ position: "absolute", left: 16, right: 16, bottom: 16, height: 44, borderRadius: 12, background: C.orange, color: "#FFF", fontFamily: fonts.bold, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>Jetzt bewerben</div> : null}
              {i === 2 && arrived ? (
                <div style={{ position: "absolute", right: 12, bottom: 70, display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
                  {[I2.heart, I2.chat, I2.send].map((d2, j) => <Ico key={j} d={d2} size={32} color="#FFF" sw={2} />)}
                </div>
              ) : null}
              {i === 2 && arrived ? <div style={{ position: "absolute", left: 14, bottom: 28, fontFamily: fonts.semibold, fontSize: 18, color: "#FFF" }}>@holzmann.dach</div> : null}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: -22, display: "flex", justifyContent: "center" }}>
              <span style={{ transform: `scale(${pop(t, split + 0.15 + i * 0.08, 0.35)})`, display: "inline-flex", alignItems: "center", gap: 8, background: arrived ? PK.ink : "#FFF", color: arrived ? "#FFF" : PK.ink, borderRadius: 999, padding: "6px 16px 6px 10px", fontFamily: fonts.semibold, fontSize: 20, boxShadow: "0 8px 18px rgba(0,0,0,0.18)", whiteSpace: "nowrap" }}>
                {i === 0 ? <Ico d={I2.globe} size={22} color={arrived ? "#FFF" : PK.ink} /> : i === 1 ? <Ico d={I2.brief} size={22} color={arrived ? "#FFF" : PK.ink} /> : <IgLogo size={24} />}
                {["Website", "Stellenanzeige", "Instagram"][i]}
                {arrived ? <CheckDot size={22} p={k(t, dest[i] + 0.05, 0.25)} /> : null}
              </span>
            </div>
            {/* flying clip copy */}
            {f > 0 && f < 1 ? <ClipCard t={t} src={PHOTO("hero")} w={70} logo={false} style={{ left: d.w / 2 - 35 + (1 - f) * (540 - d.x - d.w / 2), top: 150 + (1 - f) * -250, transform: `scale(${1 - f * 0.2}) rotate(${(1 - f) * 10}deg)`, zIndex: 20 }} /> : null}
          </div>
        );
      }) : null}
      {dest.map((a, i) => <Ring key={i} t={t} at={a} x={D[i].x + D[i].w / 2} y={DY + DH / 2} r={180} />)}
      <Glint t={t} at={fertig + 0.1} x={820} y={160} size={40} />
    </PanelStage>
  );
};

// ================= 8. "Der Haken: Motion nur im Teamplan, noch als Testversion" =================
export const SceneHaken: React.FC<SceneP> = ({ t, dur, at }) => {
  const m = mk(dur, at);
  const motion = m("motion", 0.18), team = m("team", 0.5), test = m("test", 0.78);
  const PLANS = [["Free", false], ["Pro", false], ["Max", false], ["Team", true]] as const;
  return (
    <PanelStage t={t} dur={dur} seed={17}>
      <div style={{ position: "absolute", left: 60, top: 44, ...ps(t, -0.25, 16, 0.9) }}>
        <Mono text="EHRLICH GESAGT" size={20} color={C.amber} />
        <div style={{ position: "relative", fontFamily: SERIF, fontWeight: 500, fontSize: 92, color: PK.ink, lineHeight: 1, marginTop: 10 }}>
          <Highlight p={k(t, 0.05, 0.4)} color="rgba(242,163,58,0.42)" />
          <span style={{ position: "relative" }}>Der <i>Haken</i></span>
        </div>
      </div>
      {/* feature card */}
      <div style={{ position: "absolute", left: 60, top: 230, width: 960, height: 300, transform: tilt(t, 3, -4) }}>
        <div style={{ position: "absolute", inset: 0, ...ps(t, motion - 0.1, 24, 0.85) }}>
        <div style={{ position: "absolute", inset: 0, background: "#FFF", borderRadius: 28, border: `1.5px solid ${CL.border}`, boxShadow: paperShadow, padding: "28px 34px", boxSizing: "border-box", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ width: 70, height: 70, borderRadius: 18, background: C.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.film} size={40} color={PK.orangeDeep} sw={2} /></span>
            <div>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: PK.ink }}>/motion</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 22, color: CL.sub }}>in Claude · Clip aus deinen Dateien</div>
            </div>
            {t > team - 0.05 ? (
              <span style={{ marginLeft: "auto", ...ps(t, team, 10, 0.5) }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.amberSoft, color: "#9A5B0C", border: `2px solid ${C.amber}`, borderRadius: 999, padding: "10px 22px", fontFamily: MONO, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>TEAM-PLAN · BETA</span>
              </span>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
            {PLANS.map(([p, ok], i) => {
              const a = team - 0.35 + i * 0.12;
              return (
                <div key={p} style={{ flex: 1, borderRadius: 18, border: `2px solid ${ok && t > team ? C.green : CL.border}`, background: ok && t > team ? C.greenSoft : "#FAF8F4", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, opacity: ok ? 1 : 0.9 }}>
                  <span style={{ fontFamily: fonts.bold, fontSize: 30, color: ok ? PK.ink : "#9C958A" }}>{p}</span>
                  <span style={{ marginLeft: "auto", transform: `scale(${pop(t, a, 0.35)})` }}>
                    {ok ? <CheckDot size={38} /> : <span style={{ width: 38, height: 38, borderRadius: "50%", background: C.redSoft, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Ico d={I2.x} size={22} color={C.red} sw={3} /></span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>
      <InkStamp text="TESTVERSION" p={k(t, test, 0.22, Easing.out(Easing.back(1.4)))} color="#C2410C" size={60} rot={-8} id="hakenstamp" style={{ left: 470, top: 555 }} />
      <Glint t={t} at={team + 0.2} x={930} y={260} size={36} />
    </PanelStage>
  );
};

// ================= 9. guide background (PDF scroll sits on top) =================
export const SceneGuideBg: React.FC<SceneP> = ({ t, dur }) => (
  <PanelStage t={t} dur={dur} seed={18}>
    <Glint t={t} at={0.4} x={110} y={200} size={34} />
  </PanelStage>
);

// clean 3D still for phone photos / clip thumbnails
export const PhotoStill: React.FC<{ view: string; roof: "done" | "none" | "half"; variant?: string; w: number; h: number }> = ({ view, roof, variant = "terracotta", w, h }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #F2CBA9 0%, #F8DFC8 40%, #F5E2CE 100%)" }}>
    <div style={{ position: "absolute", left: -200, top: -250, width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,200,0.9), rgba(255,200,150,0) 62%)" }} />
    <RoofScene3D t={10} w={w} h={h} cam={PHOTO_CAMS[view]} land={roof === "done" ? doneLand : roof === "half" ? halfLand : noneLand} ridgeAt={roof === "done" ? -10 : 999} variant={VARIANTS[variant]} />
    <Grade warm={0.6} />
  </AbsoluteFill>
);

// re-exports used by the master
export { PW, PH, MONO, SERIF, CL, C, clamp, k, pop, ps, typed, tilt, Logo, Mono, Pill, CheckDot, Ico, Glint, Ring, Pointer, PanelStage, Odometer, PK, paperShadow, Highlight, Sheen, InkStamp, SIMPLE_ICONS };
