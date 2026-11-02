import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// Type-A B-Rolls for the "5 Claude Skills" reel, same visual system as
// WebsiteScrollBroll: near-black base, drifting orange glow, frosted glass,
// everything in motion from frame 0 (hard cut-in), no people, no stock look.

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const glass: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))",
  border: "1.5px solid rgba(255,255,255,0.16)",
  backdropFilter: "blur(28px) saturate(140%)",
  WebkitBackdropFilter: "blur(28px) saturate(140%)",
  borderRadius: 36,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 30px 80px rgba(0,0,0,0.45)",
};

const Backdrop: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {[
      { x: -200, y: 120, s: 860, a: 0.5 },
      { x: 520, y: 1100, s: 760, a: 0.42 },
      { x: 80, y: 1500, s: 600, a: 0.3 },
    ].map((o, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: o.x + Math.sin((frame + i * 25) / 16) * 50,
          top: o.y + Math.cos((frame + i * 12) / 20) * 40,
          width: o.s,
          height: o.s,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,107,53,${o.a}) 0%, rgba(255,140,60,${o.a * 0.4}) 35%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
    ))}
    {/* faint tech grid, slowly drifting */}
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        backgroundSize: "90px 90px",
        backgroundPosition: `0 ${frame * 1.5}px`,
      }}
    />
  </>
);

// in(f0) → 0..1 over ~10 frames starting at f0; negative f0 = already partly in on frame 0.
const useIn = (frame: number) => (f0: number, len = 10) =>
  interpolate(frame, [f0, f0 + len], [0, 1], { ...clamp, easing: easeOut });

const pop = (p: number, dy = 60): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dy}px) scale(${0.92 + 0.08 * p})`,
  filter: `blur(${(1 - p) * 12}px)`,
});

// ---------------------------------------------------------------------------
// Skill UI: URL in → page scanned → design tokens fly out as glass cards.
// ---------------------------------------------------------------------------
export const SkillUIBroll: React.FC<{ seconds: number }> = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = useIn(frame);
  const url = "https://deine-lieblingsseite.de";
  const typed = url.slice(0, Math.round(interpolate(frame, [-4, 14], [0, url.length], clamp)));
  const scan = interpolate(frame, [16, 40], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const drift = interpolate(frame, [0, durationInFrames], [0, -60]);

  const swatches = ["#FF6B35", "#111111", "#F4F4F5", "#FFB36B", "#6B7280"];

  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark, overflow: "hidden" }}>
      <Backdrop frame={frame} />
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${drift}px)` }}>
        {/* Browser window */}
        <div style={{ ...glass, position: "absolute", left: 70, top: 200, width: 940, height: 820, overflow: "hidden", ...pop(t(-6)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "26px 30px", borderBottom: "1.5px solid rgba(255,255,255,0.1)" }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            ))}
            <div style={{ flex: 1, marginLeft: 16, padding: "14px 24px", borderRadius: 999, background: "rgba(255,255,255,0.08)", fontFamily: fonts.medium, fontSize: 28, color: colors.white }}>
              {typed}
              <span style={{ opacity: frame % 12 < 6 ? 1 : 0, color: colors.accent }}>|</span>
            </div>
          </div>
          {/* page skeleton being scanned */}
          <div style={{ position: "relative", padding: 44 }}>
            <div style={{ width: "70%", height: 64, borderRadius: 14, background: "rgba(255,255,255,0.18)" }} />
            <div style={{ width: "50%", height: 64, borderRadius: 14, background: `linear-gradient(90deg, ${colors.accent}, #FFB36B)`, marginTop: 18 }} />
            <div style={{ width: "85%", height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", marginTop: 34 }} />
            <div style={{ width: "75%", height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", marginTop: 14 }} />
            <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
              <div style={{ width: 230, height: 76, borderRadius: 999, background: colors.accent }} />
              <div style={{ width: 200, height: 76, borderRadius: 999, border: "2px solid rgba(255,255,255,0.3)" }} />
            </div>
            <div style={{ display: "flex", gap: 22, marginTop: 44 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ flex: 1, height: 180, borderRadius: 24, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.1)" }} />
              ))}
            </div>
            {/* scan beam */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${scan * 100}%`,
                height: 6,
                background: colors.accent,
                boxShadow: `0 0 40px 12px ${colors.accent}88`,
                opacity: scan > 0 && scan < 1 ? 1 : 0,
              }}
            />
          </div>
        </div>

        {/* Extracted tokens */}
        <div style={{ ...glass, position: "absolute", left: 70, top: 1080, width: 450, height: 250, padding: 30, boxSizing: "border-box", ...pop(t(30)) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: colors.accent, letterSpacing: 2 }}>FARBEN</div>
          <div style={{ display: "flex", gap: 14, marginTop: 30 }}>
            {swatches.map((c, i) => (
              <div key={c} style={{ width: 62, height: 62, borderRadius: 18, background: c, border: "1.5px solid rgba(255,255,255,0.2)", ...pop(t(34 + i * 2), 30) }} />
            ))}
          </div>
        </div>
        <div style={{ ...glass, position: "absolute", left: 560, top: 1080, width: 450, height: 250, padding: 30, boxSizing: "border-box", ...pop(t(36)) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: colors.accent, letterSpacing: 2 }}>TYPOGRAFIE</div>
          <div style={{ fontFamily: fonts.bold, fontSize: 84, color: colors.white, marginTop: 10 }}>Aa</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 24, color: "rgba(255,255,255,0.6)" }}>64 · 40 · 24 · 16</div>
        </div>
        <div style={{ ...glass, position: "absolute", left: 70, top: 1370, width: 450, height: 250, padding: 30, boxSizing: "border-box", ...pop(t(42)) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: colors.accent, letterSpacing: 2 }}>ABSTÄNDE</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: 34 }}>
            {[20, 36, 56, 84, 120].map((h, i) => (
              <div key={h} style={{ width: 56, height: h * t(46 + i * 2), borderRadius: 10, background: i === 4 ? colors.accent : "rgba(255,255,255,0.25)" }} />
            ))}
          </div>
        </div>
        <div style={{ ...glass, position: "absolute", left: 560, top: 1370, width: 450, height: 250, padding: 30, boxSizing: "border-box", ...pop(t(48)) }}>
          <div style={{ fontFamily: fonts.semibold, fontSize: 24, color: colors.accent, letterSpacing: 2 }}>RUNDUNGEN</div>
          <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
            {[8, 20, 36, 999].map((r) => (
              <div key={r} style={{ width: 80, height: 80, borderRadius: r, border: `3px solid ${colors.white}` }} />
            ))}
          </div>
        </div>

        {/* Result file */}
        <div
          style={{
            position: "absolute",
            left: 170,
            top: 1680,
            width: 740,
            padding: "30px 40px",
            borderRadius: 28,
            background: `linear-gradient(90deg, ${colors.accent}, #FF8A55)`,
            boxShadow: `0 0 70px ${colors.accent}99`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: fonts.bold,
            fontSize: 36,
            color: colors.white,
            ...pop(t(56)),
          }}
        >
          <span>design-system.json</span>
          <span>✓</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// MCP Builder: Claude writes the connector → lines snap to CRM + ERP →
// data packets flow → "Verbunden ✓".
// ---------------------------------------------------------------------------
export const MCPBroll: React.FC<{ seconds: number }> = () => {
  const frame = useCurrentFrame();
  const t = useIn(frame);
  const code = [
    { c: "server.tool(", k: true },
    { c: '  "crm_kunden",', k: false },
    { c: "  async () => crm.list()", k: false },
    { c: ");", k: true },
    { c: 'server.connect("erp")', k: true },
  ];
  const chars = interpolate(frame, [-4, 34], [0, 110], clamp);
  let budget = chars;

  const hub = { x: 540, y: 1180 };
  const nodes = [
    { label: "CRM", sub: "Kunden · Deals", x: 230, y: 1560 },
    { label: "ERP", sub: "Aufträge · Lager", x: 850, y: 1560 },
  ];
  const link = t(30, 14);
  const connected = t(46);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark, overflow: "hidden" }}>
      <Backdrop frame={frame} />

      {/* Code editor */}
      <div style={{ ...glass, position: "absolute", left: 70, top: 190, width: 940, height: 640, padding: 44, boxSizing: "border-box", ...pop(t(-6)) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.semibold, fontSize: 26, color: "rgba(255,255,255,0.55)", marginBottom: 30 }}>
          <span>mcp-server.ts</span>
          <span style={{ color: colors.accent }}>● Claude schreibt…</span>
        </div>
        {code.map((line, i) => {
          const n = Math.max(0, Math.min(line.c.length, budget));
          budget -= line.c.length;
          return (
            <div key={i} style={{ fontFamily: "Menlo, monospace", fontSize: 38, lineHeight: 1.7, color: line.k ? "#FFB36B" : colors.white }}>
              <span style={{ color: "rgba(255,255,255,0.3)", marginRight: 26 }}>{i + 1}</span>
              {line.c.slice(0, n)}
              {n > 0 && n < line.c.length ? <span style={{ color: colors.accent }}>▍</span> : null}
            </div>
          );
        })}
      </div>

      {/* Connection lines + packets */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {nodes.map((n, i) => {
          const d = `M${hub.x},${hub.y} C${hub.x},${hub.y + 200} ${n.x},${n.y - 220} ${n.x},${n.y}`;
          return (
            <g key={n.label}>
              <path d={d} fill="none" stroke={colors.accent} strokeWidth={6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - link} style={{ filter: `drop-shadow(0 0 12px ${colors.accent})` }} />
              {connected > 0
                ? [0, 0.33, 0.66].map((o) => {
                    const p = ((frame / 22 + o + i * 0.5) % 1);
                    return (
                      <circle key={o} r={12} fill={colors.white} style={{ offsetPath: `path("${d}")`, offsetDistance: `${p * 100}%`, filter: `drop-shadow(0 0 10px ${colors.accent})` } as React.CSSProperties} opacity={connected} />
                    );
                  })
                : null}
            </g>
          );
        })}
      </svg>

      {/* Claude hub */}
      <div
        style={{
          position: "absolute",
          left: hub.x - 110,
          top: hub.y - 110,
          width: 220,
          height: 220,
          borderRadius: 60,
          background: `linear-gradient(135deg, ${colors.accent}, #FFB36B)`,
          boxShadow: `0 0 ${60 + Math.sin(frame / 5) * 20}px ${colors.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.bold,
          fontSize: 44,
          color: colors.white,
          ...pop(t(10)),
        }}
      >
        Claude
      </div>

      {nodes.map((n, i) => (
        <div
          key={n.label}
          style={{
            ...glass,
            position: "absolute",
            left: n.x - 170,
            top: n.y - 20,
            width: 340,
            padding: "34px 30px",
            boxSizing: "border-box",
            textAlign: "center",
            ...pop(t(22 + i * 4)),
          }}
        >
          <div style={{ fontFamily: fonts.bold, fontSize: 56, color: colors.white }}>{n.label}</div>
          <div style={{ fontFamily: fonts.medium, fontSize: 26, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>{n.sub}</div>
          <div style={{ marginTop: 18, fontFamily: fonts.semibold, fontSize: 26, color: colors.accent, opacity: connected }}>Verbunden ✓</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
