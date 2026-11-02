import { registerRoot } from "remotion";
import { BmwPixelRoot } from "./BmwPixelRoot";

// GPT-S "BMW nach der Beförderung" (2026-10-30, hedonische Tretmühle) im Pixel-Niklas-Look.
// Render: npx remotion render src/opus/bmw-pixel-entry.ts BmwPixel out.mp4
registerRoot(BmwPixelRoot);
