import { registerRoot } from "remotion";
import { TerminRoot } from "./TerminRoot";

// FP-N "Terminplaner für deinen Steuerberater" (2026-11-02): master TerminOpus.
// Render: npx remotion render src/opus/termin-entry.ts TerminOpus runs/fpn-termin/raw.mp4 --gl=angle
registerRoot(TerminRoot);
