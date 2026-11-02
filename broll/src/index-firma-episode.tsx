// Separate entry for the "Superkind baut eine Firma" series engine (FirmaEpisode). Render with --props '{"tag":N}'.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { FirmaEpisode, calculateFirmaEpisodeMetadata, FirmaEpisodeProps } from "./compositions/FirmaEpisode";

const Root: React.FC = () => (
  <>
    <Composition id="FirmaEpisode" component={FirmaEpisode as React.FC<FirmaEpisodeProps>} durationInFrames={1311} fps={30} width={1080} height={1920}
      defaultProps={{ tag: 1, episode: null, words: null, cover: false } as FirmaEpisodeProps} calculateMetadata={calculateFirmaEpisodeMetadata} />
  </>
);
registerRoot(Root);
