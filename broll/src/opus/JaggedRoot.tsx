import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { JaggedOpus, JF_FRAMES } from "./JaggedOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const JaggedRoot: React.FC = () => (
  <Composition id="JaggedOpus" component={JaggedOpus} durationInFrames={JF_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
