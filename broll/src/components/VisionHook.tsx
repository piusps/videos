import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { fonts } from "../theme";

// Intro/outro text hook for the sleek "vision" style (user decision 2026-09-29),
// built on the kallaway.marketing text-hook guide: max two lines broken where the
// phrase breaks, no punctuation except quotes/parentheses, about a third down
// from the top (never over eyes or mouth), extremely readable. Design: bold white
// grotesk (Inter Bold) with ONE accent phrase in italic serif (Instrument Serif
// Italic) tinted light Superkind orange, like "How To Write *Killer* Text Hooks".
//
// Text format: "\n" breaks the line, *…* marks the serif accent.
//   "Das Ende der\n*200.000 €* KI-Teams"    "Kommentiere\n*„Superkind“*"
//
// marker (intro only, user pick 2026-10-03 "nimm A" from the HyperFrames hook test): frame 0 stays the full,
// still thumbnail; then, with two accents ("Mahnbescheid: *2 Wochen*\nClaude: *5 Minuten*"), the first gets a
// red strike and dims, and an orange marker sweeps under the last, which turns white with a small pop.
// With one accent only the marker runs.

const { fontFamily: serif } = loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin", "latin-ext"] });
const ACCENT = "#FF9467"; // light Superkind orange, one step deeper than the captions so it holds on bright backgrounds

type Part = { text: string; accent: boolean };
const parse = (line: string): Part[] =>
  line.split(/(\*[^*]+\*)/).filter(Boolean).map((p) => (p.startsWith("*") ? { text: p.slice(1, -1), accent: true } : { text: p, accent: false }));

const STRIKE = "#E5484D";
const MARKER = "#FF6B35";
const ease = Easing.bezier(0.25, 1, 0.5, 1);

export const VisionHook: React.FC<{ text: string; startFrame: number; endFrame: number; y?: number; marker?: boolean; scale?: number }> = ({ text, startFrame, endFrame, y = 0.3, marker = false, scale = 1 }) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps, width, height } = useVideoConfig();
  const dur = endFrame - startFrame;
  if (frame < 0 || frame >= dur) return null;

  const lines = text.split("\n").filter(Boolean).map(parse);
  const size = Math.round(width * 0.083 * scale);
  const out = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let wordIndex = 0;

  const accents = lines.flat().filter((p) => p.accent);
  const oldAccent = marker && accents.length >= 2 ? accents[0] : null;
  const newAccent = marker && accents.length >= 1 ? accents[accents.length - 1] : null;
  const ramp = (a: number, b: number) => interpolate(frame / fps, [a, b], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const strike = ramp(0.45, 0.75);
  const dim = 1 - 0.45 * ramp(0.6, 0.85);
  const band = ramp(0.95, 1.35);
  const toWhite = ramp(1.05, 1.25);
  const pop = 1 + 0.05 * Math.sin(Math.PI * ramp(1.05, 1.41));
  const accentStyle: React.CSSProperties = {
    fontFamily: serif, fontStyle: "italic", fontSize: size * 1.18, letterSpacing: -size * 0.01, lineHeight: 1.05, color: ACCENT,
    whiteSpace: "nowrap", textShadow: "0 2px 26px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.45)", display: "inline-block", position: "relative", isolation: "isolate",
  };

  return (
    <div style={{ position: "absolute", left: 0, width, top: height * y, transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.02, opacity: out, pointerEvents: "none" }}>
      {lines.map((parts, li) => (
        <div key={li} style={{ display: "flex", alignItems: "baseline", justifyContent: "center", flexWrap: "nowrap", gap: size * 0.24 }}>
          {parts.flatMap((part, pi) =>
            part === oldAccent || part === newAccent ? (
              [
                <span key={pi} style={{ ...accentStyle, transform: part === newAccent ? `scale(${pop})` : undefined, transformOrigin: "50% 70%" }}>
                  {part === newAccent ? (
                    <span style={{ position: "absolute", left: -size * 0.06, right: -size * 0.13, top: "18%", bottom: "4%", borderRadius: size * 0.13, background: MARKER, transform: `scaleX(${band})`, transformOrigin: "0 50%", zIndex: -1 }} />
                  ) : null}
                  <span style={{ opacity: part === oldAccent ? dim : 1, color: part === newAccent ? (toWhite > 0 ? `color-mix(in srgb, #FFFFFF ${toWhite * 100}%, ${ACCENT})` : ACCENT) : ACCENT }}>{part.text.trim()}</span>
                  {part === oldAccent ? (
                    <span style={{ position: "absolute", left: -size * 0.07, right: -size * 0.07, top: "56%", height: size * 0.1, borderRadius: size * 0.06, background: STRIKE, transform: `scaleX(${strike})`, transformOrigin: "0 50%", boxShadow: "0 2px 10px rgba(0,0,0,0.35)" }} />
                  ) : null}
                </span>,
              ]
            ) :
            part.text.trim().split(/\s+/).map((w, wi) => {
              const i = wordIndex++;
              // The intro hook is the thumbnail: fully visible on frame 0, no entrance. The outro builds in.
              const p = startFrame === 0 ? 1 : interpolate(frame, [i * 2.5, i * 2.5 + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <span
                  key={`${pi}-${wi}`}
                  style={{
                    fontFamily: part.accent ? serif : fonts.bold,
                    fontStyle: part.accent ? "italic" : "normal",
                    fontSize: part.accent ? size * 1.18 : size,
                    letterSpacing: part.accent ? -size * 0.01 : -size * 0.045,
                    lineHeight: 1.05,
                    color: part.accent ? ACCENT : "#FFFFFF",
                    whiteSpace: "nowrap",
                    textShadow: "0 2px 26px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.45)",
                    opacity: p,
                    filter: `blur(${(1 - p) * 8}px)`,
                    transform: `translateY(${(1 - p) * size * 0.18}px)`,
                    display: "inline-block",
                  }}
                >
                  {w}
                </span>
              );
            })
          )}
        </div>
      ))}
    </div>
  );
};
