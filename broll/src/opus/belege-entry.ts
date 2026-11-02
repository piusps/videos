import { registerRoot } from "remotion";
import { BelegeRoot } from "./BelegeRoot";

// FP-N "Belege" (Henri 2026-10-20), Stil wie DatenschutzOpus.
// Render: npx remotion render src/opus/belege-entry.ts BelegeOpus out.mp4
registerRoot(BelegeRoot);
