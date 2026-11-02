import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { WissenOpus, WI_FRAMES } from "./WissenOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const WissenRoot: React.FC = () => (
  <Composition id="WissenOpus" component={WissenOpus} durationInFrames={WI_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
