import { registerRoot } from "remotion";
import { MieteRoot } from "./MieteRoot";

// FP-N "Gewerbemiete" (Henri 2026-10-23), @opusjake-Stil 1:1 mit lokalen Pixelwelten.
// Render: npx remotion render src/opus/miete-entry.ts MieteOpus out.mp4
registerRoot(MieteRoot);
