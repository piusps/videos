import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/Newsreader";
import { HookFilm, PhotoStill, PW, PH } from "./ErklaerfilmBrolls";
import { ErklaerfilmOpus, EF_FRAMES } from "./ErklaerfilmOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadSerif("normal", { weights: ["400", "500", "600"], subsets: ["latin", "latin-ext"] });
loadSerif("italic", { weights: ["400", "500"], subsets: ["latin", "latin-ext"] });

const HookComp: React.FC<{ at?: Record<string, number> }> = ({ at }) => {
  const { useCurrentFrame } = require("remotion");
  const f = useCurrentFrame();
  return <HookFilm t={f / 25} dur={6.45} at={at} />;
};
const PhotoComp: React.FC<{ view: string; roof: "done" | "none" | "half"; variant?: string }> = (p) => <PhotoStill {...p} w={600} h={800} />;

export const ErklaerfilmRoot: React.FC = () => (
  <>
    <Composition id="ErklaerfilmOpus" component={ErklaerfilmOpus} durationInFrames={EF_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
    <Composition id="ErklaerfilmHook" component={HookComp} durationInFrames={162} fps={25} width={PW} height={PH} defaultProps={{}} />
    <Composition id="ErklaerfilmPhoto" component={PhotoComp} durationInFrames={1} fps={25} width={600} height={800} defaultProps={{ view: "front", roof: "done" as const, variant: "terracotta" }} />
  </>
);
