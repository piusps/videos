import { registerRoot } from "remotion";
import { GewinnRoot } from "./GewinnRoot";

// FP-N "Gewinnermittlung" (2026-10-20). Render: npx remotion render src/opus/gewinn-entry.ts GewinnOpus out.mp4
registerRoot(GewinnRoot);
