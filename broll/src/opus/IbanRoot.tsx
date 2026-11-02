import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { IbanOpus, IB_FRAMES } from "./IbanOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const IbanRoot: React.FC = () => (
  <Composition id="IbanOpus" component={IbanOpus} durationInFrames={IB_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
