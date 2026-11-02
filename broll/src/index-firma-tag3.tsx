// Eigener Entry für die Folge "Ärger" (intern Tag 3, Slot 2026-10-28 21:00).
import { Composition, registerRoot } from "remotion";
import { FirmaTag3, FIRMA_TAG3_SECONDS } from "./compositions/FirmaTag3";

const Root: React.FC = () => (
  <>
    <Composition id="FirmaTag3" component={FirmaTag3} durationInFrames={Math.round(FIRMA_TAG3_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Ärger", cover: false }} />
  </>
);
registerRoot(Root);
