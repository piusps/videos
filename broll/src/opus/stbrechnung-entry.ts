import { registerRoot } from "remotion";
import { StbRechnungRoot } from "./StbRechnungRoot";

// FP-N "Steuerberater-Rechnung" (2026-10-31): master StbRechnungOpus.
// Render: npx remotion render src/opus/stbrechnung-entry.ts StbRechnungOpus runs/fpn-stb-rechnung/raw.mp4 --gl=angle
registerRoot(StbRechnungRoot);
