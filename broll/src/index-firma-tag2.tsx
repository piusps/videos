// Eigener Entry für die Folge "Kunde" (intern Tag 2, Slot 2026-10-28 18:00).
import { Composition, registerRoot } from "remotion";
import { FirmaTag2, FIRMA_TAG2_SECONDS } from "./compositions/FirmaTag2";

const Root: React.FC = () => (
  <>
    <Composition id="FirmaTag2" component={FirmaTag2} durationInFrames={Math.round(FIRMA_TAG2_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Kunde", cover: false }} />
  </>
);
registerRoot(Root);
