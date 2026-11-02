import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { AuftraegeOpus, AU_FRAMES } from "./AuftraegeOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const AuftraegeRoot: React.FC = () => (
  <Composition id="AuftraegeOpus" component={AuftraegeOpus} durationInFrames={AU_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
