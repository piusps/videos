import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { NeueFirmenOpus, NF_FRAMES } from "./NeueFirmenOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const NeueFirmenRoot: React.FC = () => (
  <Composition id="NeueFirmenOpus" component={NeueFirmenOpus} durationInFrames={NF_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
