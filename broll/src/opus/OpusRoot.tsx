import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { KontoauszugOpus, KA_FRAMES } from "./KontoauszugOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const OpusRoot: React.FC = () => (
  <>
    <Composition id="KontoauszugOpus" component={KontoauszugOpus} durationInFrames={KA_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
  </>
);
