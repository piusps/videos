import { registerRoot } from "remotion";
import { FitnessPixelRoot } from "./FitnessPixelRoot";

// GPT-S "Preis pro Training" (2026-10-26, Selbstüberschätzung) im Pixel-Niklas-Look.
// Render: npx remotion render src/opus/fitness-pixel-entry.ts FitnessPixel out.mp4
registerRoot(FitnessPixelRoot);
