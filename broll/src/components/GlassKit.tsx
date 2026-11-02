import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../theme";

// Shared building blocks for Superkind Type-A B-Rolls: near-black base,
// drifting orange glow, frosted glass, one easing curve. Every B-Roll is a hard
// cut-in, so content must already be visible and moving on frame 0.

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export const glass: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))",
  border: "1.5px solid rgba(255,255,255,0.16)",
  backdropFilter: "blur(28px) saturate(140%)",
  WebkitBackdropFilter: "blur(28px) saturate(140%)",
  borderRadius: 36,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 30px 80px rgba(0,0,0,0.45)",
};

export const mono = "Menlo, 'SF Mono', monospace";

// Progress helper on the clip's own length: at(0.2, 0.5) runs 0→1 from 20% to 50% of the clip.
export const useClip = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const at = (from: number, to: number, easing = easeOut) =>
    interpolate(frame, [from * durationInFrames, to * durationInFrames], [0, 1], { ...clamp, easing });
  return { frame, d: durationInFrames, at };
};

export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.dark, overflow: "hidden" }}>
      {[
        { x: -200, y: 80, s: 880, a: 0.5 },
        { x: 540, y: 1000, s: 780, a: 0.42 },
        { x: 40, y: 1550, s: 620, a: 0.32 },
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
      {children}
    </AbsoluteFill>
  );
};

// Fade/blur/slide-in wrapper driven by a 0→1 progress value.
export const In: React.FC<{ p: number; y?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ p, y = 60, style, children }) => (
  <div style={{ ...style, opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * y}px) scale(${0.95 + 0.05 * p})` }}>{children}</div>
);
