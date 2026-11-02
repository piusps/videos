import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { KonkurrenzOpus, KK_FRAMES } from "./KonkurrenzOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const KonkurrenzRoot: React.FC = () => (
  <Composition id="KonkurrenzOpus" component={KonkurrenzOpus} durationInFrames={KK_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
