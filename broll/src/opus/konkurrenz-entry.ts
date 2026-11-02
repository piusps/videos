import { registerRoot } from "remotion";
import { KonkurrenzRoot } from "./KonkurrenzRoot";

// FP-N "Konkurrenz-Check" (Henri 2026-10-12). Own entry so OpusRoot / KontoauszugOpus stay untouched.
// Render: npx remotion render src/opus/konkurrenz-entry.ts KonkurrenzOpus out.mp4
registerRoot(KonkurrenzRoot);
