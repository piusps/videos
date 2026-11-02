import { registerRoot } from "remotion";
import { DatenschutzRoot } from "./DatenschutzRoot";

// FP-N "Datenschutzerklärung" (Pius 2026-10-19), v2-Stil wie AngebotOpus.
// Render: npx remotion render src/opus/datenschutz-entry.ts DatenschutzOpus out.mp4
registerRoot(DatenschutzRoot);
