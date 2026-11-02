import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/Silkscreen";
import { AngebotOpus, AN_FRAMES } from "./AngebotOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });
loadPixel("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] });

export const AngebotRoot: React.FC = () => (
  <Composition id="AngebotOpus" component={AngebotOpus} durationInFrames={AN_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
