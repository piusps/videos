import { FirmaShirtsTag1V7, FIRMA_SHIRTS_TAG1_V7_SECONDS } from "./compositions/FirmaShirtsTag1V7";
import { FirmaShirtsTag1V6, FIRMA_SHIRTS_TAG1_V6_SECONDS } from "./compositions/FirmaShirtsTag1V6";
import { FirmaShirtsTag1V5, FIRMA_SHIRTS_TAG1_V5_SECONDS } from "./compositions/FirmaShirtsTag1V5";
import { FirmaShirtsTag1V4, FIRMA_SHIRTS_TAG1_V4_SECONDS } from "./compositions/FirmaShirtsTag1V4";
// Separate entry for "KI baut ein Unternehmen von Null" Neustart Tag 1 (Firmenshirts), so other compositions can't block the render.
import { Composition, registerRoot } from "remotion";
import { FirmaShirtsTag1, FIRMA_SHIRTS_TAG1_SECONDS } from "./compositions/FirmaShirtsTag1";
import { FirmaShirtsTag1V2, FIRMA_SHIRTS_TAG1_V2_SECONDS } from "./compositions/FirmaShirtsTag1V2";
import { FirmaShirtsTag1V3, FIRMA_SHIRTS_TAG1_V3_SECONDS } from "./compositions/FirmaShirtsTag1V3";

const Root: React.FC = () => (
  <>
    <Composition id="FirmaShirtsTag1" component={FirmaShirtsTag1} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_SECONDS * 30)} fps={30} width={1080} height={1920} />
    <Composition id="FirmaShirtsTag1V2" component={FirmaShirtsTag1V2} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_V2_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Produkt", cover: false }} />
    <Composition id="FirmaShirtsTag1V3" component={FirmaShirtsTag1V3} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_V3_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Produkt", cover: false }} />
    <Composition id="FirmaShirtsTag1V4" component={FirmaShirtsTag1V4} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_V4_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Produkt", cover: false }} />
    <Composition id="FirmaShirtsTag1V5" component={FirmaShirtsTag1V5} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_V5_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Produkt", cover: false }} />
    <Composition id="FirmaShirtsTag1V6" component={FirmaShirtsTag1V6} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_V6_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Produkt", cover: false }} />
    <Composition id="FirmaShirtsTag1V7" component={FirmaShirtsTag1V7} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_V7_SECONDS * 30)} fps={30} width={1080} height={1920} defaultProps={{ keyword: "Produkt", cover: false }} />
  </>
);
registerRoot(Root);
