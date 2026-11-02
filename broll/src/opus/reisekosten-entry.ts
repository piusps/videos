import { registerRoot } from "remotion";
import { ReisekostenRoot } from "./ReisekostenRoot";

// FP-N "Reisekosten vom Konkurrenten" (2026-10-22), Stil wie BelegeOpus.
// Render: npx remotion render src/opus/reisekosten-entry.ts ReisekostenOpus out.mp4
registerRoot(ReisekostenRoot);
