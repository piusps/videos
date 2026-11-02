import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { TextHookBadge } from "../components/TextHookBadge";

// Generic pass-through composition: takes ANY source video (dropped into
// public/, referenced by file name) and overlays text-hook badge(s) —
// always an intro hook for its first `hookSeconds` seconds, and OPTIONALLY
// an outro CTA hook ("Kommentiere:\n<TRIGGERWORD>") for its last
// `endHookSeconds` seconds — upper third, Instagram-"Strong" caption style
// (see TextHookBadge.tsx for the exact locked visual spec). The rest of the
// video (and its full original audio) plays through untouched. Not tied to
// a specific script/topic like the Mahnwesen compositions — reused for
// every future hook-text request.
//
// The outro hook is the DEFAULT going forward for every video this pipeline
// produces (confirmed 2026-09-23) — the trigger word changes per script,
// the "Kommentiere:" framing and visual style stay fixed. Pass an empty
// `endHookText` to skip it for a specific video (e.g. one that already has
// its own custom outro).
export type HookOverlayProps = {
  videoFileName: string;
  hookText: string;
  hookSeconds: number;
  endHookText: string;
  endHookSeconds: number;
  fps: number;
  width: number;
  height: number;
  // The source video's own total frame count (probed via ffprobe before
  // render, see composite-hook.mjs) — read only by calculateMetadata in
  // Root.tsx to size this composition to match, not used by the component.
  durationInFrames: number;
};

export const HookOverlay: React.FC<HookOverlayProps> = ({
  videoFileName,
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
      <OffthreadVideo src={staticFile(videoFileName)} />
      <TextHookBadge
        text={hookText}
        startFrame={0}
        endFrame={Math.round(hookSeconds * fps)}
        frameWidth={width}
      />
      {endHookText ? (
        <TextHookBadge
          text={endHookText}
          startFrame={Math.max(
            0,
            durationInFrames - Math.round(endHookSeconds * fps)
          )}
          endFrame={durationInFrames}
          frameWidth={width}
        />
      ) : null}
    </AbsoluteFill>
  );
};
