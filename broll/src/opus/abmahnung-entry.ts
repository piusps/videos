import { registerRoot } from "remotion";
import { AbmahnungRoot } from "./AbmahnungRoot";

// FP-N "Abmahnung vom Konkurrenten" (2026-10-22), Stil wie BelegeOpus.
// Render: npx remotion render src/opus/abmahnung-entry.ts AbmahnungOpus out.mp4
registerRoot(AbmahnungRoot);
