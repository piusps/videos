import { registerRoot } from "remotion";
import { KontoRoot } from "./KontoRoot";

// FP-N "Konto / Gebührencheck" (2026-10-29): master KontoOpus.
// Render: npx remotion render src/opus/konto-entry.ts KontoOpus runs/fpn-konto/raw.mp4 --gl=angle
registerRoot(KontoRoot);
