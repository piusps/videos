import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from "remotion";

// design.md §6 — talking-head zooms, rebuilt 2026-09-24 after user feedback
// on the first autonomous run, matched to the reference edit
// (nikvideo2final): the shot sits WIDE by default (close to HeyGen's own
// framing), and only a few (~3) deliberate push-ins go hard — up to ~186%,
// nearly face-only — hold for the whole beat, then ease back out to wide.
// Each push-in/out is a real keyframed camera move (ease-in-out over
// ~0.5s), never a frame-to-frame jump and never a new level on every
// sentence (that read as "small, choppy zooms").
export type ZoomKeyframe = {
  startMs: number; // push-in begins here
  endMs: number; // pull-out finishes here
  scale: number; // held scale, e.g. 1.86
  // Optional (vision video, 2026-09-30): 0 = hard jump cut in/out instead of a camera move.
  rampInMs?: number;
  rampOutMs?: number;
};

export const BASE_SCALE = 1.08;
const RAMP_IN_MS = 550;
const RAMP_OUT_MS = 450;
const ease = Easing.bezier(0.45, 0, 0.2, 1);

const scaleAt = (keyframes: ZoomKeyframe[], ms: number): number => {
  for (const k of keyframes) {
    if (ms < k.startMs || ms >= k.endMs) continue;
    const rampIn = Math.min(k.rampInMs ?? RAMP_IN_MS, (k.endMs - k.startMs) / 2);
    const rampOut = Math.min(k.rampOutMs ?? RAMP_OUT_MS, (k.endMs - k.startMs) / 2);
    if (rampIn === 0 && rampOut === 0) return k.scale; // jump cut: hold the punched-in frame
    const opts = { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
    if (rampOut === 0) return interpolate(ms, [k.startMs, k.startMs + rampIn], [BASE_SCALE, k.scale], opts); // push in, hard cut out
    if (rampIn === 0) return interpolate(ms, [k.endMs - rampOut, k.endMs], [k.scale, BASE_SCALE], opts); // hard cut in, ease out
    return interpolate(
      ms,
      [k.startMs, k.startMs + rampIn, k.endMs - rampOut, k.endMs],
      [BASE_SCALE, k.scale, k.scale, BASE_SCALE],
      { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }
  return BASE_SCALE;
};

// Optional face focus (user rule 2026-09-29, "zoome an Niklas' Gesicht heran,
// nicht in die Mitte"): push-ins scale around the face point (x/y as 0-1 of the
// frame) and, the harder the push-in, drift the face toward the upper-centre of
// the frame. The drift is clamped per frame so the scaled video always covers
// the whole canvas (no black edges).
export type ZoomFocus = { x: number; y: number };
const TARGET = { x: 0.5, y: 0.42 };
const FULL_DRIFT_SCALE = 1.6;

const drift = (f: number, target: number, s: number, p: number) => {
  const lo = (1 - f) * (1 - s); // keeps the right/bottom edge covered
  const hi = f * (s - 1); // keeps the left/top edge covered
  return Math.min(hi, Math.max(lo, (target - f) * p));
};

export const ZoomedVideo: React.FC<{
  src: string;
  keyframes: ZoomKeyframe[];
  focus?: ZoomFocus | null;
}> = ({ src, keyframes, focus }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = scaleAt(keyframes, (frame / fps) * 1000);

  if (!focus) {
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {/* Origin slightly above center so a hard push-in lands on the face,
            not the chest. */}
        <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "50% 38%" }}>
          <OffthreadVideo src={src} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  const p = Math.min(1, Math.max(0, (scale - BASE_SCALE) / (FULL_DRIFT_SCALE - BASE_SCALE)));
  const dx = drift(focus.x, TARGET.x, scale, p);
  const dy = drift(focus.y, TARGET.y, scale, p);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${dx * 100}%, ${dy * 100}%) scale(${scale})`,
          transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
        }}
      >
        <OffthreadVideo src={src} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
