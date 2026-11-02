import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { VisionHook } from "../components/VisionHook";
import { fonts } from "../theme";

// Instagram cover for the pinned vision video: a clean frame of Niklas, the intro
// hook in the vision style, a small SUPERKIND kicker. Text sits inside the 3:4
// grid crop (y 240-1680 of 1080x1920), a third down, above the head.
export const LaunchCover: React.FC<{ frame: string; hook: string; kicker?: string }> = ({ frame, hook, kicker = "SUPERKIND" }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Img src={staticFile(frame)} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0) 60%)" }} />
    {kicker && <div style={{ position: "absolute", top: 1920 * 0.3 - 190, width: 1080, textAlign: "center", fontFamily: fonts.semibold, fontSize: 30, letterSpacing: 9, color: "rgba(255,255,255,0.92)", textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}>{kicker}</div>}
    <VisionHook text={hook} startFrame={0} endFrame={1000} />
  </AbsoluteFill>
);
