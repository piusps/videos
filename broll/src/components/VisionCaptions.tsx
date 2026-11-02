import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../theme";
import type { CaptionWord } from "./KaraokeCaptions";

// "Vision" caption style (user decision 2026-09-29, reference reel
// instagram.com/reel/DbHkVlPAIPr, @danieldalenshorts): sleek, quiet captions
// for the Superkind launch/vision video. Heavy tight grotesk, white, sentence
// case with punctuation, NO box, NO outline, only a soft shadow; 1-3 word
// phrases that switch hard (tiny 2-frame fade). Key words of the script are
// tinted in a LIGHT Superkind orange, not the full #FF6B35 of the karaoke style.
//
// ONE fixed position for the whole video (user feedback 2026-09-29: a caption
// that jumps between positions every 1-2 s is confusing). Zones only switch the
// look: inside a B-Roll window (light Explainer board / split screen) the line
// sits in a dark frosted pill so it stays readable, at the same height. A zone
// may still carry its own `y`, but only use that for a rare, deliberate exception.
// The karaoke style (KaraokeCaptions.tsx) is untouched and still the default.

export type CaptionZone = { startMs: number; endMs: number; y?: number; pill?: boolean; edge?: boolean };
// edge (2026-10-06, @opusjake): small mono caps in a solid black pill, sitting on the seam of a split-screen panel.

// Line centre as fraction of frame height. Below the chin in every mode: full
// speaker (Niklas Office chin ~0.58), split screen (ExplainerKit puts the face
// high in the bottom panel), full board (content keeps 0.72-0.82 free). The line
// bottom stays above the IG/TikTok bottom UI (~0.80+).
const DEFAULT_Y = 0.77;
const MAX_WORDS = 3;
const MAX_CHARS = 18;
const SENTENCE_END = /\p{L}[.!?]$/u;
const SOFT_ORANGE = "#FFA27A"; // #FF6B35 lifted towards white, reads "Superkind" without shouting

const norm = (s: string) => s.toLowerCase().normalize("NFC").replace(/[^\p{L}\p{N}]/gu, "");

type Chunk = { words: CaptionWord[]; startMs: number; endMs: number };

const chunk = (words: CaptionWord[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: CaptionWord[] = [];
  let chars = 0;
  const flush = () => {
    if (!cur.length) return;
    out.push({ words: cur, startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs });
    cur = [];
    chars = 0;
  };
  for (const w of words) {
    const next = chars + w.text.length + (cur.length ? 1 : 0);
    if (cur.length >= MAX_WORDS || (cur.length > 0 && next > MAX_CHARS)) flush();
    cur.push(w);
    chars += w.text.length + (cur.length > 1 ? 1 : 0);
    if (SENTENCE_END.test(w.text) || /[,:]$/.test(w.text)) flush();
  }
  flush();
  return out;
};

export const VisionCaptions: React.FC<{ words: CaptionWord[]; keywords?: string[]; zones?: CaptionZone[] }> = ({ words, keywords = [], zones = [] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const chunks = React.useMemo(() => chunk(words), [words]);
  const keySet = React.useMemo(() => new Set(keywords.flatMap((k) => k.split(/\s+/)).map(norm).filter(Boolean)), [keywords]);

  // Hold each phrase until the next starts; drop it after a long pause.
  const idx = chunks.findIndex((c, i) => nowMs >= c.startMs && nowMs < Math.min(chunks[i + 1]?.startMs ?? c.endMs + 400, c.endMs + 900));
  if (idx === -1) return null;
  const c = chunks[idx];
  // The shot on screen decides the look/position, so a phrase that started on the talking head
  // moves with the hard cut into a B-Roll instead of hanging over the light board.
  const zone = zones.find((z) => nowMs >= z.startMs && nowMs < z.endMs);
  const y = zone?.y ?? DEFAULT_Y;
  const fade = interpolate(nowMs - c.startMs, [0, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const edge = !!zone?.edge;
  const fontSize = Math.round(width * (edge ? 0.046 : 0.066));
  const lineH = fontSize * 1.25;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, width, top: height * y - lineH / 2, height: lineH, display: "flex", justifyContent: "center", alignItems: "center", opacity: fade }}>
        <div
          style={{
            display: "flex",
            gap: fontSize * 0.26,
            alignItems: "center",
            padding: edge ? `${fontSize * 0.2}px ${fontSize * 0.45}px` : zone?.pill ? `${fontSize * 0.14}px ${fontSize * 0.36}px` : 0,
            borderRadius: edge ? fontSize * 0.22 : fontSize * 0.34,
            background: edge ? "#161616" : zone?.pill ? "rgba(18,18,18,0.62)" : "transparent",
            backdropFilter: zone?.pill ? "blur(14px)" : undefined,
            boxShadow: zone?.pill ? "0 8px 24px rgba(0,0,0,0.18)" : undefined,
          }}
        >
          {c.words.map((w, i) => (
            <span
              key={i}
              style={{
                fontFamily: edge ? "Menlo, 'SF Mono', monospace" : fonts.bold,
                fontWeight: edge ? 700 : undefined,
                textTransform: edge ? "uppercase" : undefined,
                fontSize,
                letterSpacing: edge ? fontSize * 0.06 : -fontSize * 0.045,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                color: keySet.has(norm(w.text)) ? SOFT_ORANGE : "#FFFFFF",
                textShadow: zone?.pill ? "none" : "0 2px 18px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.5)",
              }}
            >
              {w.text}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
