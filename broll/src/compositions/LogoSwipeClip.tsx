import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionWord, KaraokeCaptions } from "../components/KaraokeCaptions";

// Talking-head clip + karaoke captions + brand logos that swipe in exactly on
// the spoken brand name (each with a whoosh), stack in a row above the
// captions, then clear out together. Logos are transparent PNGs, no plate.
export type LogoCue = { src: string; startMs: number };

export type LogoSwipeClipProps = {
  videoFileName: string;
  captionWords: CaptionWord[];
  logos: LogoCue[];
  logosOutMs: number;
  whooshFileName: string;
  // true when the clip is spliced into a video whose own audio keeps playing.
  muteVideo?: boolean;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
};

// Lead the swipe slightly so the logo lands on the word, not after it.
const LEAD_MS = 120;
const LOGO_SIZE = 190;
const GAP = 70;

const SwipeLogo: React.FC<{
  src: string;
  startFrame: number;
  outFrame: number;
  slotX: number;
  index: number;
}> = ({ src, startFrame, outFrame, slotX, index }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  if (frame < startFrame) return null;

  const inP = spring({ frame: frame - startFrame, fps, config: { damping: 14, stiffness: 190, mass: 0.7 } });
  const outP = spring({ frame: frame - outFrame, fps, config: { damping: 20, stiffness: 260 } });

  // Swipe in from the right edge with a slight overshoot, motion blur while fast.
  const fromX = width * 0.75;
  const x = interpolate(inP, [0, 1], [fromX, slotX]);
  const velocity = Math.abs(1 - inP);
  const blur = interpolate(velocity, [0, 0.6, 1], [0, 6, 14], { extrapolateRight: "clamp" });
  const rotate = interpolate(inP, [0, 1], [18, 0]);
  const scaleIn = interpolate(inP, [0, 1], [0.6, 1]);

  // Exit: all logos pop up and out together, staggered by 1 frame each.
  const outShift = frame >= outFrame + index ? outP : 0;
  const scale = scaleIn * interpolate(outShift, [0, 1], [1, 0.4]);
  const opacity = Math.min(interpolate(inP, [0, 0.25], [0, 1], { extrapolateRight: "clamp" }), 1 - outShift);
  const y = interpolate(outShift, [0, 1], [0, -60]);

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        left: x - LOGO_SIZE / 2,
        top: -LOGO_SIZE / 2 + y,
        width: LOGO_SIZE,
        height: LOGO_SIZE,
        objectFit: "contain",
        opacity,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        filter: `blur(${blur}px) drop-shadow(0 6px 18px rgba(0,0,0,0.55))`,
      }}
    />
  );
};

export const LogoSwipeClip: React.FC<LogoSwipeClipProps> = ({
  videoFileName,
  captionWords,
  logos,
  logosOutMs,
  whooshFileName,
  muteVideo,
  fps,
  width,
  height,
}) => {
  const n = logos.length;
  const rowWidth = n * LOGO_SIZE + (n - 1) * GAP;
  const outFrame = Math.round((logosOutMs / 1000) * fps);
  // Row sits just above the caption line (captions' bottom edge ~19-25% up).
  const rowY = height * 0.62;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <OffthreadVideo src={staticFile(videoFileName)} muted={muteVideo} />
      <AbsoluteFill style={{ top: rowY, height: 0 }}>
        {logos.map((l, i) => (
          <SwipeLogo
            key={l.src}
            src={l.src}
            index={i}
            startFrame={Math.max(0, Math.round(((l.startMs - LEAD_MS) / 1000) * fps))}
            outFrame={outFrame}
            slotX={(width - rowWidth) / 2 + LOGO_SIZE / 2 + i * (LOGO_SIZE + GAP)}
          />
        ))}
      </AbsoluteFill>
      <KaraokeCaptions words={captionWords} />
      {logos.map((l) => (
        <Sequence key={`sfx-${l.src}`} from={Math.max(0, Math.round(((l.startMs - LEAD_MS - 60) / 1000) * fps))}>
          <Audio src={staticFile(whooshFileName)} volume={0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Rasterizes one SVG logo to a transparent PNG (render with --image-format=png).
export const LogoStill: React.FC<{ svg: string }> = ({ svg }) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Img src={staticFile(svg)} style={{ width: "90%", height: "90%", objectFit: "contain" }} />
  </AbsoluteFill>
);
