import { registerRoot } from "remotion";
import { IbanRoot } from "./IbanRoot";

// FP-N "Falsche IBAN" (2026-10-17), Opus-Stil. Render: npx remotion render src/opus/iban-entry.ts IbanOpus out.mp4
registerRoot(IbanRoot);
