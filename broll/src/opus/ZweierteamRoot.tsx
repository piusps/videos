import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "../loadFonts";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { ZweierteamOpus, ZW_FRAMES } from "./ZweierteamOpus";

loadFonts();
loadMono("normal", { weights: ["500", "700", "800"], subsets: ["latin", "latin-ext"] });

export const ZweierteamRoot: React.FC = () => (
  <Composition id="ZweierteamOpus" component={ZweierteamOpus} durationInFrames={ZW_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
);
