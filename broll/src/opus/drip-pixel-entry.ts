import { registerRoot } from "remotion";
import { DripPixelRoot } from "./DripPixelRoot";

// GPT-S "Pizza für neun Euro" (2026-10-28, Drip Pricing) im Pixel-Niklas-Look.
// Render: npx remotion render src/opus/drip-pixel-entry.ts DripPixel out.mp4
registerRoot(DripPixelRoot);
