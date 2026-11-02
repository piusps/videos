import { registerRoot } from "remotion";
import { EingliederungRoot } from "./EingliederungRoot";

// FP-N "Eingliederungszuschuss" (Henri 2026-10-13). Own entry so the other opus compositions stay untouched.
// Render: npx remotion render src/opus/eingliederung-entry.ts EingliederungOpus out.mp4
registerRoot(EingliederungRoot);
