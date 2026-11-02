import { registerRoot } from "remotion";
import { GefahrRoot } from "./GefahrRoot";

// FP-N "Gefährdungsbeurteilung" (2026-10-21). Render: npx remotion render src/opus/gefahr-entry.ts GefahrOpus out.mp4
registerRoot(GefahrRoot);
