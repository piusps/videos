import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fonts } from "../theme";

// @florentgpt (GPT-N) text hook, the @mavgpt look: ONE white rounded box with
// black semibold text above the head (IG "Classic"), emoji at the end of the
// last line. The @florent_preusser hook stays the black "Strong" pills
// (TextHookBadge), so the two accounts read differently at frame 0.
export const GptHook: React.FC<{ text: string; startFrame: number; endFrame: number; frameWidth: number }> = ({
  text,
  startFrame,
  endFrame,
  frameWidth,
}) => {
  const absoluteFrame = useCurrentFrame();
  if (absoluteFrame < startFrame || absoluteFrame > endFrame) return null;
  const frame = absoluteFrame - startFrame;
  const duration = endFrame - startFrame;
  // Frame 0 of the video must show the full hook (thumbnail), no fade-in.
  const fromStart = startFrame === 0;
  const opacity = interpolate(frame, [0, 5, duration - 6, duration], [fromStart ? 1 : 0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lines = text.split("\n").filter(Boolean);
  const fontSize = Math.round(frameWidth * 0.062);

  return (
    <div
      style={{
        position: "absolute",
        top: "9%",
        left: "50%",
        transform: "translateX(-50%)",
        opacity,
        maxWidth: "86%",
        backgroundColor: "#FFFFFF",
        color: "#0B0B0B",
        borderRadius: fontSize * 0.42,
        padding: `${fontSize * 0.36}px ${fontSize * 0.55}px`,
        boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
        fontFamily: fonts.semibold,
        fontSize,
        lineHeight: 1.22,
        textAlign: "center",
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {l}
        </div>
      ))}
    </div>
  );
};
