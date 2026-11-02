import { registerRoot } from "remotion";
import { KlagePixelRoot } from "./KlagePixelRoot";

// FP-N "Klage ohne Anwalt" (2026-10-27), Version 2 im Opusjake-Pixelstil (OpusKit + PixelCourt).
// Render: npx remotion render src/opus/klage-pixel-entry.ts KlagePixelOpus out.mp4
registerRoot(KlagePixelRoot);
