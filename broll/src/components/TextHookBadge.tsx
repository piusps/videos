import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";

// The Instagram "Strong" caption-preset look, matched against a real IG
// editor screenshot (2026-09-23): bold white text where EACH LINE gets its
// OWN independent black rounded-corner pill, sized tight to that line's own
// width — not one shared box stretched around every line. Stack the
// per-line pills with a NEGATIVE gap so they slightly OVERLAP vertically
// (confirmed 2026-09-23: a visible gap between pills was explicitly wrong,
// IG's own pills touch/overlap, they don't float apart) — reads as one
// continuous "brick" of chips, exactly like Instagram's own renderer, not a
// single paragraph box and not separated cards. Pass multi-line text as a
// literal "\n" — each segment becomes its own pill.
//
// Reused for BOTH the first-5-seconds hook (sound-off scroll-stopper) AND
// an optional end-of-video CTA hook ("Kommentiere:\n<TRIGGERWORD>") — same
// component, same visual spec, just a different time window via
// startFrame/endFrame. This is a sound-off hook either way, so it has to
// carry its claim without relying on the audio (see the user's own framing,
// 2026-09-23).
//
// Deliberately NOT using the Superkind accent/brand palette here — this
// mimics a native platform caption sticker on purpose, not a Superkind
// brand element, so it reads as an organic Reels hook rather than an ad.
export const TextHookBadge: React.FC<{
  text: string;
  startFrame: number;
  endFrame: number;
  frameWidth: number;
}> = ({ text, startFrame, endFrame, frameWidth }) => {
  const absoluteFrame = useCurrentFrame();
  const frame = absoluteFrame - startFrame;
  const duration = endFrame - startFrame;
  const lines = text.split("\n").filter((l) => l.length > 0);

  // Quick pop-in, held, quick fade-out right at the cutoff — never a hard
  // pop-off, matches this project's "no jarring instant disappearance" feel
  // even though this specific badge intentionally skips the house
  // ease-out-expo curve (a snappy caption-sticker pop reads correctly here,
  // a slow premium ease would look out of place on a native-style caption).
  const inFrames = 6;
  const outFrames = 8;
  // A badge starting at the very first frame of the video appears fully
  // formed — no fade-in. Reel analytics (Website, 2026-09-25) showed ~50%
  // gone in 2s and the thumbnail/first frame showed a half-transparent hook.
  const startsAtVideoStart = startFrame === 0;
  const opacity = interpolate(
    frame,
    [0, inFrames, duration - outFrames, duration],
    [startsAtVideoStart ? 1 : 0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scale = interpolate(frame, [0, inFrames], [startsAtVideoStart ? 1 : 0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (absoluteFrame < startFrame || absoluteFrame > endFrame) return null;

  const fontSize = Math.round(frameWidth * 0.072); // ~78px @ 1080 width

  return (
    <div
      style={{
        position: "absolute",
        top: "8%", // upper third, raised from an earlier 13% per feedback, 2026-09-23
        left: "50%",
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
        maxWidth: "88%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: -fontSize * 0.1, // negative = slight overlap, not a floating gap
      }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            backgroundColor: colors.dark,
            color: colors.white,
            fontFamily: fonts.bold,
            fontSize,
            lineHeight: 1.15,
            padding: `${fontSize * 0.2}px ${fontSize * 0.34}px`,
            borderRadius: fontSize * 0.26,
            textAlign: "center",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            position: "relative",
            zIndex: i,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
