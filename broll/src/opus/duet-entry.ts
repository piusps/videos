import { registerRoot } from "remotion";
import { DuetRoot } from "./DuetRoot";

// FP-N "Claude Duet" (2026-10-28) split-panel B-rolls.
// Render: npx remotion render src/opus/duet-entry.ts DuetNews out.mp4 --gl=angle --props='{"seconds":3.2,"at":{"game":2.1}}'
registerRoot(DuetRoot);
