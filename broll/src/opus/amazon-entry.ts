import { registerRoot } from "remotion";
import { AmazonRoot } from "./AmazonRoot";

// FP-N "Amazon-Rechnungen" (2026-10-23), Opus-Stil.
// Render: npx remotion render src/opus/amazon-entry.ts AmazonOpus out.mp4
registerRoot(AmazonRoot);
