import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import type { CaptionWord } from "./KaraokeCaptions";
import type { CaptionZone } from "./VisionCaptions";

// @florentgpt (GPT-N) captions, the @mavgpt look (gpt-normal-reel/references/
// mavgpt-edit-style.md) and deliberately unlike the @florent_preusser karaoke
// lines (Pius, 2026-10-02: the two accounts must not look identical):
// ONE word at a time, UPPERCASE, very heavy white Montserrat, soft dark shadow,
// no outline, no box, no colour. Each word pops in slightly (3 frames).
const { fontFamily: montserrat } = loadMontserrat("normal", { weights: ["900"], subsets: ["latin", "latin-ext"] });

// Short whisper gaps keep the previous word up, so the track never blinks.
const HOLD_GAP_MS = 350;
const Y = 0.75; // word centre as a fraction of frame height (chest)

// zones (2026-10-05): per-range y, e.g. on the seam of a split-screen B-Roll so the word never sits on the face.
export const GptCaptions: React.FC<{ words: CaptionWord[]; zones?: CaptionZone[] }> = ({ words, zones = [] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const i = words.findIndex((w, k) => nowMs >= w.startMs && nowMs < Math.min(words[k + 1]?.startMs ?? Infinity, w.endMs + HOLD_GAP_MS));
  if (i === -1) return null;
  const word = words[i];
  const local = frame - Math.round((word.startMs / 1000) * fps);
  const scale = interpolate(local, [0, 3], [1.14, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const text = word.text.replace(/[,;:.!?]+$/, "");
  // Long single words shrink to fit the frame (2026-10-04: "Nebenkostenabrechnung" ran off both edges).
  const fontSize = Math.round(width * (text.length > 15 ? (0.085 * 15) / text.length : text.length > 11 ? 0.085 : 0.105));

  const zone = zones.find((z) => nowMs >= z.startMs && nowMs < z.endMs);
  const y = zone?.y ?? Y;
  // pill (2026-10-06): light B-Roll behind the word -> dark outline so white stays readable.
  const outline = zone?.pill ? { WebkitTextStroke: `${Math.round(fontSize * 0.12)}px #141413`, paintOrder: "stroke fill" as const } : {};

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height * y - fontSize * 0.6,
          textAlign: "center",
          fontFamily: montserrat,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.2,
          letterSpacing: -fontSize * 0.01,
          textTransform: "uppercase",
          color: "#FFFFFF",
          textShadow: "0 3px 6px rgba(0,0,0,0.55), 0 0 24px rgba(0,0,0,0.35)",
          transform: `scale(${scale})`,
          whiteSpace: "nowrap",
          ...outline,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
