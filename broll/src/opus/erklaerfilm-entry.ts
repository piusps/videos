import { registerRoot } from "remotion";
import { ErklaerfilmRoot } from "./ErklaerfilmRoot";

// FP-N "Erklaerfilm" (2026-10-29): master ErklaerfilmOpus + hook film + 3D photo stills.
// Render: npx remotion render src/opus/erklaerfilm-entry.ts ErklaerfilmOpus runs/fpn-erklaerfilm/raw.mp4 --gl=angle
registerRoot(ErklaerfilmRoot);
