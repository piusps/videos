import { registerRoot } from "remotion";
import { OpusRoot } from "./OpusRoot";

// Separate entry for the @opusjake-style test (Henri 2026-10-12), so the shared Root.tsx stays untouched.
// Render: npx remotion render src/opus/opus-entry.ts KontoauszugOpus out.mp4
registerRoot(OpusRoot);
