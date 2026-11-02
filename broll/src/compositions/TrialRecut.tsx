import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { VisionHook } from "../components/VisionHook";

// Trial-reel recuts of old, finished @florent_preusser reels (2026-10-03). The source is the
// downloaded Instagram file with its captions, B-Roll and title burned in, already cut into the
// new order by ffmpeg (runs/trial-<topic>/cut.py). This only lays the new Marker hook (VisionHook)
// on top and, where the old burned-in title would still show, hides it under a dark title card
// that the new hook sits in (a blur band was tried first and smeared the forehead).
export type TrialRecutProps = {
  videoFileName: string;
  hookText: string;
  hookSeconds: number;
  hookY: number; // 0-1, vertical centre of the hook
  hookScale: number; // VisionHook size multiplier
  cardSeconds: number; // 0 = no card; otherwise the card covers the old title from frame 0 for this long
  cardTop: number; // 0-1
  cardBottom: number; // 0-1
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
};

const TitleCard: React.FC<{ endFrame: number; top: number; bottom: number }> = ({ endFrame, top, bottom }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  if (frame >= endFrame) return null; // hard end on the cut: any fade would let the old title shine through
  return (
    <div
      style={{
        position: "absolute", left: width * 0.03, right: width * 0.03, top: height * top, height: height * (bottom - top),
        borderRadius: width * 0.05, background: "rgba(14,14,16,0.9)",
        backdropFilter: "blur(30px)", WebkitBackdropFilter: "blur(30px)",
        boxShadow: "0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    />
  );
};

export const TrialRecut: React.FC<TrialRecutProps> = ({ videoFileName, hookText, hookSeconds, hookY, hookScale, cardSeconds, cardTop, cardBottom, fps }) => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    <OffthreadVideo src={staticFile(videoFileName)} />
    {cardSeconds > 0 ? <TitleCard endFrame={Math.round(cardSeconds * fps)} top={cardTop} bottom={cardBottom} /> : null}
    <VisionHook text={hookText} startFrame={0} endFrame={Math.round(hookSeconds * fps)} y={hookY} marker scale={hookScale} />
  </AbsoluteFill>
);
