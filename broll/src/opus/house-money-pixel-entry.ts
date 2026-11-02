import { registerRoot } from "remotion";
import { HouseMoneyPixelRoot } from "./HouseMoneyPixelRoot";

// GPT-S "Steuererstattung" (2026-10-30, House-Money-Effekt) im Pixel-Niklas-Look.
// Render: npx remotion render src/opus/house-money-pixel-entry.ts HouseMoneyPixel out.mp4
registerRoot(HouseMoneyPixelRoot);
