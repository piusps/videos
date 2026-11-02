import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// Full-frame B-Roll: a premium, deliberately "boomy" landing page scrolled
// top-to-bottom in ~3s — dark base, drifting orange glow orbs, frosted glass
// cards, a scroll progress bar, counting stats, a self-drawing chart and
// staggered reveals. Built in Remotion instead of a generative video model
// so text stays crisp, layout never warps, and every video gets the exact
// same Superkind-orange look (user request 2026-09-24).
export const WEBSITE_SCROLL_DURATION = 80; // 3.2s @ 25fps

const VIEW_H = 1920;
const PAGE_H = 3560;
const SCROLL_END = PAGE_H - VIEW_H;
const PAD = 60;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const glass: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))",
  border: "1.5px solid rgba(255,255,255,0.16)",
  backdropFilter: "blur(28px) saturate(140%)",
  WebkitBackdropFilter: "blur(28px) saturate(140%)",
  borderRadius: 36,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 30px 80px rgba(0,0,0,0.45)",
};

// 0→1 as an element at page-y `y` travels into the viewport.
const useReveal = (y: number, scrollY: number, distance = 320) => {
  const screenTop = y - scrollY;
  return interpolate(VIEW_H * 0.98 - screenTop, [0, distance], [0, 1], { ...clamp, easing: easeOut });
};

const Reveal: React.FC<{ p: number; style?: React.CSSProperties; children: React.ReactNode; tilt?: boolean }> = ({
  p,
  style,
  children,
  tilt,
}) => (
  <div
    style={{
      ...style,
      opacity: p,
      filter: `blur(${(1 - p) * 14}px)`,
      transform: `translateY(${(1 - p) * 90}px) scale(${0.94 + 0.06 * p})${tilt ? ` rotateX(${(1 - p) * 18}deg)` : ""}`,
    }}
  >
    {children}
  </div>
);

const Stat: React.FC<{ x: number; y: number; w: number; scrollY: number; to: number; format: (n: number) => string; label: string }> = ({
  x,
  y,
  w,
  scrollY,
  to,
  format,
  label,
}) => {
  const p = useReveal(y, scrollY);
  // Counting starts only once the card is well inside the frame.
  const count = interpolate(VIEW_H * 0.8 - (y - scrollY), [0, 520], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <Reveal p={p} tilt style={{ ...glass, position: "absolute", left: x, top: y, width: w, height: 300, padding: 34, boxSizing: "border-box" }}>
      <div style={{ fontFamily: fonts.bold, fontSize: 92, color: colors.white, letterSpacing: -3, textShadow: `0 0 40px ${colors.accent}88` }}>
        {format(to * count)}
      </div>
      <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 14 }}>{label}</div>
      <div style={{ position: "absolute", left: 34, right: 34, bottom: 34, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ width: `${count * 100}%`, height: "100%", borderRadius: 3, background: colors.accent, boxShadow: `0 0 16px ${colors.accent}` }} />
      </div>
    </Reveal>
  );
};

export const WebsiteScrollBroll: React.FC<{ seconds: number }> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Starts moving on frame 0 (it's cut in mid-sentence), fast confident
  // scroll, soft settle at the end.
  const scrollY = interpolate(frame, [0, durationInFrames - 4], [0, SCROLL_END], {
    ...clamp,
    easing: Easing.bezier(0.45, 0.05, 0.25, 1),
  });
  const progress = scrollY / SCROLL_END;
  // Hard cut-in: hero is already mid-reveal on frame 0 (never an empty frame).
  const intro = (delay: number) => interpolate(frame, [delay * 0.6 - 6, delay * 0.6 + 6], [0, 1], { ...clamp, easing: easeOut });
  const shimmer = interpolate(frame % 40, [0, 40], [-60, 160]);

  const chartY = 2060;
  const chartDraw = interpolate(VIEW_H * 0.8 - (chartY - scrollY), [0, 700], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const chartPath = "M0,300 C80,290 120,250 190,240 S300,260 360,200 S470,120 540,140 S660,60 720,70 S820,20 900,10";

  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark, overflow: "hidden", perspective: 1400 }}>
      {/* Glow orbs — slower than the page (parallax) and gently drifting */}
      {[
        { x: -180, y: 80, s: 820, a: 0.55 },
        { x: 560, y: 900, s: 700, a: 0.4 },
        { x: -120, y: 1900, s: 760, a: 0.45 },
        { x: 600, y: 2800, s: 640, a: 0.35 },
      ].map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: o.x + Math.sin((frame + i * 20) / 18) * 40,
            top: o.y - scrollY * 0.45 + Math.cos((frame + i * 10) / 22) * 30,
            width: o.s,
            height: o.s,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,107,53,${o.a}) 0%, rgba(255,140,60,${o.a * 0.4}) 35%, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />
      ))}

      {/* Scrolling page */}
      <div style={{ position: "absolute", left: 0, top: -scrollY, width: 1080, height: PAGE_H }}>
        {/* Hero */}
        <div style={{ position: "absolute", left: PAD, top: 250, opacity: intro(0), transform: `translateY(${(1 - intro(0)) * 30}px)` }}>
          <div style={{ ...glass, borderRadius: 999, padding: "14px 28px", display: "inline-flex", alignItems: "center", gap: 14, fontFamily: fonts.semibold, fontSize: 26, color: colors.white }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: colors.accent, boxShadow: `0 0 14px ${colors.accent}` }} />
            Neu · KI-gebaut in 3 Stunden
          </div>
        </div>
        {["Websites,", "die verkaufen."].map((line, i) => (
          <div
            key={line}
            style={{
              position: "absolute",
              left: PAD,
              top: 360 + i * 150,
              fontFamily: fonts.bold,
              fontSize: 148,
              letterSpacing: -6,
              lineHeight: 1,
              color: i === 1 ? "transparent" : colors.white,
              background: i === 1 ? `linear-gradient(90deg, ${colors.accent}, #FFB36B)` : undefined,
              WebkitBackgroundClip: i === 1 ? "text" : undefined,
              opacity: intro(2 + i * 3),
              transform: `translateY(${(1 - intro(2 + i * 3)) * 60}px)`,
              filter: `blur(${(1 - intro(2 + i * 3)) * 10}px)`,
            }}
          >
            {line}
          </div>
        ))}
        <div style={{ position: "absolute", left: PAD, top: 700, width: 900, fontFamily: fonts.medium, fontSize: 38, lineHeight: 1.35, color: "rgba(255,255,255,0.62)", opacity: intro(8) }}>
          Individuelles Design, echter Code, live in Stunden statt Wochen.
        </div>
        <div style={{ position: "absolute", left: PAD, top: 860, display: "flex", gap: 24, opacity: intro(10), transform: `translateY(${(1 - intro(10)) * 30}px)` }}>
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "30px 54px",
              borderRadius: 999,
              background: colors.accent,
              fontFamily: fonts.bold,
              fontSize: 34,
              color: colors.white,
              boxShadow: `0 0 60px ${colors.accent}99, inset 0 1px 0 rgba(255,255,255,0.4)`,
            }}
          >
            Projekt starten →
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${shimmer}%`,
                width: "35%",
                background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)",
                transform: "skewX(-20deg)",
              }}
            />
          </div>
          <div style={{ ...glass, borderRadius: 999, padding: "30px 44px", fontFamily: fonts.semibold, fontSize: 34, color: colors.white }}>Demo ansehen</div>
        </div>

        {/* Hero dashboard mockup */}
        <Reveal
          p={Math.min(intro(12), 1)}
          tilt
          style={{ ...glass, position: "absolute", left: PAD, top: 1060, width: 1080 - PAD * 2, height: 520, padding: 40, boxSizing: "border-box" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: "rgba(255,255,255,0.7)" }}>Besucher live</div>
            <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: colors.accent, border: `1.5px solid ${colors.accent}66`, borderRadius: 999, padding: "6px 18px" }}>● Live</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 18, height: 330, marginTop: 50 }}>
            {[0.35, 0.55, 0.42, 0.7, 0.6, 0.85, 0.75, 1].map((h, i) => {
              const grow = interpolate(frame, [8 + i * 2, 26 + i * 2], [0, 1], { ...clamp, easing: easeOut });
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h * 100 * grow}%`,
                    borderRadius: 14,
                    background: i === 7 ? `linear-gradient(180deg, ${colors.accent}, #FF9A5C)` : "rgba(255,255,255,0.14)",
                    boxShadow: i === 7 ? `0 0 30px ${colors.accent}aa` : undefined,
                  }}
                />
              );
            })}
          </div>
        </Reveal>

        {/* Stats */}
        <Stat x={PAD} y={1680} w={300} scrollY={scrollY} to={98} format={(n) => `${Math.round(n)}%`} label="Zufriedenheit" />
        <Stat x={PAD + 330} y={1680} w={300} scrollY={scrollY} to={4.9} format={(n) => `${n.toFixed(1)}★`} label="Bewertung" />
        <Stat x={PAD + 660} y={1680} w={300} scrollY={scrollY} to={12.4} format={(n) => `${n.toFixed(1)}k`} label="Leads / Monat" />

        {/* Chart */}
        <Reveal p={useReveal(chartY, scrollY)} tilt style={{ ...glass, position: "absolute", left: PAD, top: chartY, width: 1080 - PAD * 2, height: 640, padding: 44, boxSizing: "border-box" }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 30, color: "rgba(255,255,255,0.6)" }}>Umsatz über die Website</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 120, color: colors.white, letterSpacing: -4, marginTop: 6 }}>
            +{Math.round(312 * chartDraw)}%
          </div>
          <svg width={880} height={320} viewBox="0 0 900 320" style={{ marginTop: 10, overflow: "visible" }}>
            <defs>
              <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={colors.accent} stopOpacity={0.45} />
                <stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={`${chartPath} L900,320 L0,320 Z`} fill="url(#fill)" opacity={chartDraw} />
            <path
              d={chartPath}
              fill="none"
              stroke={colors.accent}
              strokeWidth={8}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - chartDraw}
              style={{ filter: `drop-shadow(0 0 12px ${colors.accent})` }}
            />
            <circle cx={900 * chartDraw} cy={interpolate(chartDraw, [0, 0.4, 0.8, 1], [300, 210, 70, 10], clamp)} r={14} fill={colors.white} opacity={chartDraw} style={{ filter: `drop-shadow(0 0 14px ${colors.accent})` }} />
          </svg>
        </Reveal>

        {/* Feature grid */}
        {[
          { t: "Blitzschnell", d: "Ladezeit < 1s", x: 0, y: 0 },
          { t: "SEO ab Tag 1", d: "Google-ready", x: 1, y: 0 },
          { t: "Dein Branding", d: "1:1 übernommen", x: 0, y: 1 },
          { t: "Live in Stunden", d: "Ein Befehl", x: 1, y: 1 },
        ].map((f, i) => {
          const fy = 2800 + f.y * 330;
          const p = useReveal(fy + f.x * 60, scrollY);
          return (
            <Reveal key={i} p={p} tilt style={{ ...glass, position: "absolute", left: PAD + f.x * 495, top: fy, width: 465, height: 300, padding: 38, boxSizing: "border-box" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${colors.accent}, #FFB36B)`, boxShadow: `0 0 30px ${colors.accent}88` }} />
              <div style={{ fontFamily: fonts.bold, fontSize: 44, color: colors.white, marginTop: 34 }}>{f.t}</div>
              <div style={{ fontFamily: fonts.medium, fontSize: 28, color: "rgba(255,255,255,0.55)", marginTop: 10 }}>{f.d}</div>
            </Reveal>
          );
        })}
      </div>

      {/* Sticky glass nav */}
      <div
        style={{
          ...glass,
          position: "absolute",
          left: 36,
          right: 36,
          top: 44,
          height: 110,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px 0 40px",
          opacity: intro(0),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: fonts.bold, fontSize: 34, color: colors.white }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${colors.accent}, #FFB36B)` }} />
          Nordlicht
        </div>
        <div style={{ display: "flex", gap: 34, fontFamily: fonts.medium, fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
          <span>Leistungen</span>
          <span>Cases</span>
        </div>
        <div style={{ padding: "18px 30px", borderRadius: 999, background: colors.white, color: colors.ink, fontFamily: fonts.bold, fontSize: 26 }}>Kontakt</div>
      </div>

      {/* Scroll progress bar */}
      <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${progress * 100}%`, background: `linear-gradient(90deg, ${colors.accent}, #FFB36B)`, boxShadow: `0 0 24px ${colors.accent}` }} />
    </AbsoluteFill>
  );
};
