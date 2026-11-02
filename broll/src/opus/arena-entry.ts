import { registerRoot } from "remotion";
import { ArenaRoot } from "./ArenaRoot";

// FP-N "Arena" (Henri 2026-10-15). Own entry so the other opus compositions stay untouched.
// Render: npx remotion render src/opus/arena-entry.ts ArenaOpus out.mp4
registerRoot(ArenaRoot);
