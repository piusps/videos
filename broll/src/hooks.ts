import { Easing, interpolate } from "remotion";
import { easing, timing } from "./theme";

const bezier = Easing.bezier(...easing.standard);

/**
 * Shared entrance/exit progress (0-1) for every B-Roll component, so all of
 * them move with the exact same easing/timing feel (design.md §5) instead of
 * each component inventing its own animation curve.
 */
export const useBeatProgress = (frame: number, durationInFrames: number) => {
  const entrance = interpolate(frame, [0, timing.entranceFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bezier,
  });
  const exitStart = durationInFrames - timing.exitFrames;
  const exit = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: bezier,
  });
  return Math.min(entrance, exit);
};
