import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ZoomedVideo, ZoomKeyframe, ZoomFocus } from "../components/ZoomedVideo";
import { KaraokeCaptions, CaptionWord } from "../components/KaraokeCaptions";
import { VisionCaptions, CaptionZone } from "../components/VisionCaptions";
import { TextHookBadge } from "../components/TextHookBadge";
import { VisionHook } from "../components/VisionHook";
import { GptCaptions } from "../components/GptCaptions";
import { GptHook } from "../components/GptHook";

// The single master composition for a finished video: silence-cut
// talking-head footage (see scripts/silence-cut.mjs) with context-based
// zooms, hard-cut-to-real-B-Roll windows (no card/box overlays, no logo —
// per user decision 2026-09-24: only real generated footage + avatar
// speech), karaoke captions, and the intro/outro text-hook pills.
//
// Deliberately carries NO music (revised 2026-09-24, user spec): the 1.1x
// speed ramp applies ONLY to picture + voice-over, never to the music bed,
// so music can't be rendered here — it would get sped up along with
// everything else. render-pipeline.mjs instead: renders this composition
// (voice-over only) -> speed-ramps THAT -> THEN muxes the (untouched-speed)
// music bed under the already-ramped result as the very last step. See
// scripts/mux-music.mjs.
export type BrollSegment = {
  startFrame: number;
  endFrame: number;
  fileName: string; // in public/, HeyGen/Seedance-generated footage
};

export type FinalVideoProps = {
  videoFileName: string; // the tightened (silence-cut) talking-head clip, in public/
  zoomKeyframes: ZoomKeyframe[];
  zoomFocus?: ZoomFocus | null; // face point (0-1) the push-ins aim at; null = legacy centre zoom
  captionWords: CaptionWord[];
  captionStyle?: "karaoke" | "vision" | "gpt"; // default karaoke; "vision" = sleek launch-video captions; "gpt" = @florentgpt one-word captions
  captionKeywords?: string[]; // vision only: words tinted soft orange
  captionZones?: CaptionZone[]; // vision + gpt: per-range position / pill (e.g. Explainer split screens)
  hookStyle?: "strong" | "vision" | "gpt"; // default: Instagram "Strong" pills; "vision" = serif-accent hook (VisionHook); "gpt" = white box (GptHook)
  brollEntrance?: "cut" | "pop"; // "pop" (@florentgpt) = B-Roll punches in from 106 % over 5 frames instead of a plain hard cut
  brollSegments: BrollSegment[];
  hookText: string;
  hookSeconds: number;
  endHookText: string;
  endHookSeconds: number;
  fps: number;
  width: number;
  durationInFrames: number;
};

// Inside its Sequence, so frame 0 = first B-Roll frame.
const BrollClip: React.FC<{ fileName: string; pop: boolean }> = ({ fileName, pop }) => {
  const frame = useCurrentFrame();
  const scale = pop ? interpolate(frame, [0, 5], [1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      <OffthreadVideo src={staticFile(fileName)} muted />
    </AbsoluteFill>
  );
};

export const FinalVideo: React.FC<FinalVideoProps> = ({
  videoFileName,
  zoomKeyframes,
  zoomFocus,
  captionWords,
  captionStyle = "karaoke",
  captionKeywords,
  captionZones,
  hookStyle = "strong",
  brollEntrance = "cut",
  brollSegments,
  hookText,
  hookSeconds,
  endHookText,
  endHookSeconds,
  fps,
  width,
  durationInFrames,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {/* Base layer: talking-head, always providing the continuous audio
          track (Ton an Ton — never cut mid-word), zoomed at sentence/context
          boundaries. */}
      <ZoomedVideo src={staticFile(videoFileName)} keyframes={zoomKeyframes} focus={zoomFocus} />

      {/* B-Roll windows: real generated footage only, hard-cut on top,
          muted (audio keeps coming from the talking-head track below so the
          cut is purely visual, exactly like the old composite.mjs edit). */}
      {brollSegments.map((seg, i) => (
        <Sequence
          key={i}
          from={seg.startFrame}
          durationInFrames={seg.endFrame - seg.startFrame}
        >
          {/* no pop on a segment that opens the reel: frame 0 must show the finished hook */}
          <BrollClip fileName={seg.fileName} pop={brollEntrance === "pop" && seg.startFrame > 0} />
        </Sequence>
      ))}

      {captionStyle === "vision" ? (
        <VisionCaptions words={captionWords} keywords={captionKeywords} zones={captionZones} />
      ) : captionStyle === "gpt" ? (
        <GptCaptions words={captionWords} zones={captionZones} />
      ) : (
        <KaraokeCaptions words={captionWords} />
      )}

      {hookText ? (
        hookStyle === "vision" ? (
          <VisionHook text={hookText} startFrame={0} endFrame={Math.round(hookSeconds * fps)} marker />
        ) : hookStyle === "gpt" ? (
          <GptHook text={hookText} startFrame={0} endFrame={Math.round(hookSeconds * fps)} frameWidth={width} />
        ) : (
          <TextHookBadge
            text={hookText}
            startFrame={0}
            endFrame={Math.round(hookSeconds * fps)}
            frameWidth={width}
          />
        )
      ) : null}
      {endHookText ? (
        hookStyle === "vision" ? (
          <VisionHook text={endHookText} startFrame={Math.max(0, durationInFrames - Math.round(endHookSeconds * fps))} endFrame={durationInFrames} />
        ) : hookStyle === "gpt" ? (
          <GptHook text={endHookText} startFrame={Math.max(0, durationInFrames - Math.round(endHookSeconds * fps))} endFrame={durationInFrames} frameWidth={width} />
        ) : (
          <TextHookBadge
            text={endHookText}
            startFrame={Math.max(0, durationInFrames - Math.round(endHookSeconds * fps))}
            endFrame={durationInFrames}
            frameWidth={width}
          />
        )
      ) : null}
    </AbsoluteFill>
  );
};
