import { registerRoot } from "remotion";
import { WerbungPixelRoot } from "./WerbungPixelRoot";

// GPT-S "Werbung wirkt nicht" (2026-10-26, Effekt der dritten Person) im Pixel-Niklas-Look.
// Render: npx remotion render src/opus/werbung-pixel-entry.ts WerbungPixel out.mp4
registerRoot(WerbungPixelRoot);
