// Untertitel für Niklas' Lifestyle-Reels (Format NL), Stil wie @pascal-Notion-Reel (Referenz:
// ~/Documents/niklas-lifestyle/referenz-untertitel/03_DfC83cJIpXx): Wort für Wort aufbauen,
// Schlüsselwörter groß, Füllwörter klein, enge Laufweite, weicher Schatten, transparent gerendert.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile, delayRender, continueRender } from "remotion";

// Lokal statt Google Fonts (der Download brach im langen Render ab)
const fontFamily = "NLInterTight";
const fontHandle = delayRender("NL font");
new FontFace(fontFamily, `url(${staticFile("fonts/InterTight-Variable.ttf")}) format("truetype")`, { weight: "100 900" })
  .load().then((f) => { document.fonts.add(f); continueRender(fontHandle); });

export type NLWord = { t: string; s: number; e: number; size: "big" | "norm" | "small" };
export type NLChunk = { from: number; to: number; words: NLWord[] };
export type NLSubsProps = { chunks: NLChunk[]; y: number; seconds: number };

const PX = { big: 96, norm: 66, small: 44 };
const SHADOW = "0 2px 4px rgba(0,0,0,0.28), 0 6px 26px rgba(0,0,0,0.42)";

const Word: React.FC<{ w: NLWord; t: number }> = ({ w, t }) => {
  const p = interpolate(t, [w.s - 0.02, w.s + 0.16], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
  return (
    <span
      style={{
        fontSize: PX[w.size],
        fontWeight: w.size === "small" ? 600 : 700,
        letterSpacing: w.size === "big" ? "-0.045em" : "-0.035em",
        lineHeight: 0.98,
        margin: `0 ${w.size === "small" ? 9 : 13}px`,
        opacity: p,
        filter: `blur(${(1 - p) * 7}px)`,
        transform: `translateY(${(1 - p) * 8}px)`,
        display: "inline-block",
        textShadow: SHADOW,
      }}
    >
      {w.t}
    </span>
  );
};

export const NLSubs: React.FC<NLSubsProps> = ({ chunks, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const c = chunks.find((c) => t >= c.from && t < c.to);
  if (!c) return <AbsoluteFill />;
  const out = interpolate(t, [c.to - 0.08, c.to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute", left: 90, right: 90, top: y, transform: "translateY(-50%)",
          display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "baseline",
          rowGap: 4, color: "white", fontFamily, opacity: out,
        }}
      >
        {c.words.map((w, i) => <Word key={i} w={w} t={t} />)}
      </div>
    </AbsoluteFill>
  );
};
