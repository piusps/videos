import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { AvatarSource, Split } from "../components/ExplainerKit";

// Real footage from the CG Group image film (only B-Roll shots, no interviews) in the top half
// of the split, the speaker below. Short hard cuts (~1 s each) on "KI in Unternehmen bringen.
// Persönlich. Als Team." (user request 2026-09-30: three short, meaningful shots, no 4 s ones).
export type FilmShot = { src: string; from: number; at: number }; // src in public/, from = sec into the shot, at = sec in this clip
export const LaunchFilm: React.FC<{ seconds: number; avatar: AvatarSource; shots: FilmShot[] }> = ({ avatar, shots, seconds }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <Split split={1} avatar={avatar}>
      <AbsoluteFill style={{ height: 960, overflow: "hidden", background: "#000" }}>
        {shots.map((s, i) => {
          const start = Math.round(s.at * fps);
          const end = Math.round((shots[i + 1]?.at ?? seconds) * fps);
          const local = frame - start;
          const push = 1.02 + 0.05 * Math.min(1, Math.max(0, local / Math.max(1, end - start)));
          return (
            <Sequence key={i} from={start} durationInFrames={end - start} layout="none">
              <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 960, overflow: "hidden" }}>
                <OffthreadVideo src={staticFile(s.src)} startFrom={Math.round(s.from * fps)} muted
                  style={{ position: "absolute", height: 960, width: 1707, left: (1080 - 1707) / 2, top: 0, transform: `scale(${push})`, transformOrigin: "50% 50%" }} />
              </div>
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </Split>
  );
};
