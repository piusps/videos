import { registerRoot } from "remotion";
import { AmazonPixelRoot } from "./AmazonPixelRoot";

// FP-N "Amazon-Rechnungen" (Henri 2026-10-23) im Opusjake-Stil (OpusKit, lokale Pixelwelten).
// Render: npx remotion render src/opus/amazon-pixel-entry.ts AmazonPixelOpus out.mp4
registerRoot(AmazonPixelRoot);
