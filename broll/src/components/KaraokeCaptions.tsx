import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "../theme";

// design.md §7 — burned-in karaoke caption track, matched frame-by-frame
// against the user's reference edit (nikvideo2final, 2026-09-24):
// condensed heavy uppercase, white fill, thick black outline + soft shadow,
// NO background plate. The currently spoken word sits inside a rounded box —
// red in the reference, Superkind accent orange here (user spec) — with
// its text staying white. Between words (whisper timing gaps) no box shows,
// same as the reference. Runs under the whole video, avatar and B-Roll alike.
//
// Word timings come from scripts/transcribe.mjs (word-level Whisper on the
// ALREADY silence-cut clip), so they match the final timeline directly.
export type CaptionWord = {
  text: string;
  startMs: number;
  endMs: number;
};

// Reference lines hold 1-4 words. Char cap keeps a centered line clear of
// the right-hand like/comment/share icon column on both platforms.
const MAX_WORDS_PER_LINE = 4;
const MAX_CHARS_PER_LINE = 22;

// Placement: lower third, varied occasionally (every few lines, not per
// word) around the reference's own position (line centered ~25% from the
// bottom). Values are the line's BOTTOM edge as a fraction of frame HEIGHT
// (applied in px — CSS % padding would resolve against width). Every offset
// stays above the IG Reels / TikTok bottom UI dead zone (~14-17% of frame
// height: description text, sound disc, progress bar) and well below the
// avatar's face.
const SAFE_BOTTOM_OFFSETS = [0.22, 0.19, 0.25];
const LINES_PER_PLACEMENT = 3;

// "3." / "2026." are numbers, not sentence ends.
const SENTENCE_END = /\p{L}[.!?]$/u;

type Line = { words: CaptionWord[]; startMs: number; endMs: number };

const groupIntoLines = (words: CaptionWord[]): Line[] => {
  const lines: Line[] = [];
  let current: CaptionWord[] = [];
  let currentChars = 0;

  const flush = () => {
    if (current.length === 0) return;
    lines.push({
      words: current,
      startMs: current[0].startMs,
      endMs: current[current.length - 1].endMs,
    });
    current = [];
    currentChars = 0;
  };

  for (const word of words) {
    const nextChars = currentChars + word.text.length + 1;
    if (
      current.length >= MAX_WORDS_PER_LINE ||
      (current.length > 0 && nextChars > MAX_CHARS_PER_LINE)
    ) {
      flush();
    }
    current.push(word);
    currentChars += word.text.length + 1;
    // A sentence end always closes the line, like the reference ("HOCHLADEN.").
    if (SENTENCE_END.test(word.text)) flush();
  }
  flush();
  return lines;
};

export const KaraokeCaptions: React.FC<{ words: CaptionWord[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const lines = React.useMemo(() => groupIntoLines(words), [words]);
  // Hold a line on screen until the next one starts, so there's never a
  // blank flash between lines.
  const activeIndex = lines.findIndex(
    (l, i) => nowMs >= l.startMs && nowMs < (lines[i + 1]?.startMs ?? l.endMs)
  );
  if (activeIndex === -1) return null;
  const activeLine = lines[activeIndex];

  // Size/outline/box values tuned by overlaying a render on the reference
  // frame (1080 wide): cap height ~64px, ~5-6px visible black outline.
  const fontSize = Math.round(width * 0.085);
  const stroke = Math.round(fontSize * 0.06);
  const bottomOffset =
    height *
    SAFE_BOTTOM_OFFSETS[Math.floor(activeIndex / LINES_PER_PLACEMENT) % SAFE_BOTTOM_OFFSETS.length];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottomOffset,
      }}
    >
      <div
        style={{
          maxWidth: "88%",
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "center",
          alignItems: "center",
          gap: fontSize * 0.2,
        }}
      >
        {activeLine.words.map((word, i) => {
          const isActive = nowMs >= word.startMs && nowMs < word.endMs;
          return (
            <span
              key={i}
              style={{
                fontFamily: fonts.caption,
                fontWeight: 400,
                fontSize,
                fontSizeAdjust: "cap-height 0.7",
                lineHeight: 1.1,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                color: colors.white,
                WebkitTextStroke: `${stroke * 2}px black`,
                paintOrder: "stroke fill",
                textShadow: "0 0 14px rgba(0,0,0,0.45)",
                backgroundColor: isActive ? colors.accent : "transparent",
                borderRadius: fontSize * 0.15,
                padding: `${fontSize * 0.1}px ${fontSize * 0.13}px ${fontSize * 0.06}px`,
                margin: `0 ${-fontSize * 0.13}px`,
              } as React.CSSProperties}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
