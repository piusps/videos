import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/Silkscreen";
import { ArenaOpus, AR_FRAMES } from "./ArenaOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const ArenaRoot: React.FC = () => (
  <Composition id="ArenaOpus" component={ArenaOpus} durationInFrames={AR_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
