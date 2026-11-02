// Separate entry for Superkind baut Firma Tag 3, so parallel work on other compositions can't break this render.
import { Composition, registerRoot } from "remotion";
import { SuperkindFirmaTag3, SK_TAG3_SECONDS } from "./compositions/SuperkindFirmaTag3";

const Root: React.FC = () => (
  <Composition id="SuperkindFirmaTag3" component={SuperkindFirmaTag3} durationInFrames={Math.round(SK_TAG3_SECONDS * 30)} fps={30} width={1080} height={1920} />
);
registerRoot(Root);
