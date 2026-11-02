import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { EingliederungOpus, EZ_FRAMES } from "./EingliederungOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const EingliederungRoot: React.FC = () => (
  <Composition id="EingliederungOpus" component={EingliederungOpus} durationInFrames={EZ_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
