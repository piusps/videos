import React from "react";
import { Composition } from "remotion";
import { loadFonts } from "./loadFonts";
import { HookOverlay, HookOverlayProps } from "./compositions/HookOverlay";
import { FinalVideo, FinalVideoProps } from "./compositions/FinalVideo";
import { WebsiteScrollBroll, WEBSITE_SCROLL_DURATION } from "./compositions/WebsiteScrollBroll";
import { TopicBroll, TopicBrollProps, TOPIC_BROLL_DEFAULTS } from "./compositions/TopicBroll";
import { SkillUIBroll, MCPBroll } from "./compositions/SkillBrolls";
import { InboxXmlBroll, PflichtCheckBroll, XmlToKlartextBroll, VorsortierenBroll } from "./compositions/ERechnungBrolls";
import { ElfWochenBroll, SortierenBroll, AntwortBroll, KalenderBroll, MorgenUebersichtBroll, DreiSchritteBroll } from "./compositions/PostfachBrolls";
import { EngineerKostenBroll, CompanyBrainBroll, ZwanzigFirmenBroll, demoProps } from "./compositions/ExplainerDemo";
import { ShowcaseSortieren, ShowcaseKlickpfad, ShowcaseKalender, showcaseProps } from "./compositions/ShowcaseTest";
import { LaunchKosten, LaunchFirmen, LaunchNachrichten, LaunchReveal, LaunchKollege, LaunchBrain, LaunchVertrauen, LaunchMission, LaunchWarteliste, LAUNCH_AVATAR } from "./compositions/LaunchBrolls";
import { LaunchCover } from "./compositions/LaunchCover";
import { VertragFalle, VertragScan, VertragGegenvorschlag, VertragKalender, VertragAnwalt } from "./compositions/VertragBrolls";
import { SatireMail } from "./compositions/SatireMail";
import { SatireChef } from "./compositions/SatireChef";
import { SatireNachts } from "./compositions/SatireNachts";
import { SatireTische } from "./compositions/SatireTische";
import { SatireRatchet } from "./compositions/SatireRatchet";
import { SatireReferenzpunkt } from "./compositions/SatireReferenzpunkt";
import { SatireFluch } from "./compositions/SatireFluch";
import { SatireKosten } from "./compositions/SatireKosten";
import { SatireKostenV2 } from "./compositions/SatireKostenV2";
import { SatirePratfall } from "./compositions/SatirePratfall";
import { SatireGoodhart } from "./compositions/SatireGoodhart";
import { SatireBarnum } from "./compositions/SatireBarnum";
import { SatireAustralien } from "./compositions/SatireAustralien";
import { SatireAustralienV2 } from "./compositions/SatireAustralienV2";
import { SatireAustralienV3 } from "./compositions/SatireAustralienV3";
import { SatireAustralienV4 } from "./compositions/SatireAustralienV4";
import { SatireAustralienV5 } from "./compositions/SatireAustralienV5";
import { SatireAustralienV6 } from "./compositions/SatireAustralienV6";
import { SatireAustralienV8 } from "./compositions/SatireAustralienV8";
import { SatireDreiSeiten } from "./compositions/SatireDreiSeiten";
import { SatireDreiSeitenV2 } from "./compositions/SatireDreiSeitenV2";
import { SatireAnker } from "./compositions/SatireAnker";
import { SatireAbklaeren } from "./compositions/SatireAbklaeren";
import { SatireProbezeit } from "./compositions/SatireProbezeit";
import { SatireVorabanalyse } from "./compositions/SatireVorabanalyse";
import { SatireVergleichsangebot } from "./compositions/SatireVergleichsangebot";
import { SatireHirnAnzapfen } from "./compositions/SatireHirnAnzapfen";
import { SatireDatenGeschuetzt } from "./compositions/SatireDatenGeschuetzt";
import { AbmBrief, AbmAnalyse, AbmKlauseln, AbmVorherNachher } from "./compositions/AbmahnungBrolls";
import { MbZeit, MbAnalyse, MbPruefung, MbFrist } from "./compositions/MahnbescheidBrolls";
import { SbZeit, SbVergleich, SbEinspruch, SbKosten } from "./compositions/SteuerbescheidBrolls";
import { AgKosten, AgFragen, AgEntwurf, AgPruefung, AgSumme } from "./compositions/AgbNeuBrolls";
import { BpP0Cover, BpP1Ergebnis, BpP2Schritt1, BpP3Schritt2, BpP4Trick, BpP5Schritt3, BpP6Berater, BpP7Cta } from "./compositions/BpPanelBrolls";
import { BpAnordnung, BpLuecken, BpFragen, BpSumme, BpErgebnis } from "./compositions/BetriebspruefungBrolls";
import { GCItem, GCErgebnis, GRErgebnis, GRNachricht1, GRNachricht2, GNErgebnis, GNPlus, GNNachricht1, GNBrief } from "./compositions/GptBatch2Brolls";
import { AgbTempo, AgbFragen, AgbAbschnitte, AgbKlauseln, AgbVorherNachher } from "./compositions/AgbBrolls";
import { BoilrAd, BOILR_AD_SECONDS } from "./compositions/BoilrAd";
import { BoilrAdV2, BOILR_AD_V2_SECONDS } from "./compositions/BoilrAdV2";
import { BoilrAdV3, BOILR_AD_V3_SECONDS } from "./compositions/BoilrAdV3";
import { AVRechnung, AVFragen, AVKlickpfad, AVVertrag, AVKlausel, AVVergleich } from "./compositions/ArbeitsvertragBrolls";
import { LaunchFilm } from "./compositions/LaunchFilm";
import { SirTokenTrainer, SIRTOKEN_FPS, SIRTOKEN_SECONDS } from "./compositions/SirTokenTrainer";
import { PixelKitDemo } from "./compositions/PixelKitDemo";
import { SirTokenPixelFrame } from "./compositions/SirTokenPixelFrame";
import { TrainerTable3D } from "./compositions/TrainerTable3D";
import { ClaudeClickpath } from "./compositions/ClaudeClickpath";
import { TrainerReelV2, TRAINER_V2_SECONDS } from "./compositions/TrainerReelV2";
import { TrainerWorld3D, TRAINER_WORLD_SECONDS } from "./compositions/TrainerWorld3D";
import { Agents100Day1, AGENTS_DAY1_SECONDS } from "./compositions/Agents100Day1";
import { Agents100Day2, AGENTS_DAY2_SECONDS } from "./compositions/Agents100Day2";
import { Agents100Day3, AGENTS_DAY3_SECONDS } from "./compositions/Agents100Day3";
import { Agents100Day4, AGENTS_DAY4_SECONDS } from "./compositions/Agents100Day4";
import { Agents100Day5, AGENTS_DAY5_SECONDS } from "./compositions/Agents100Day5";
import { Agents100Day6, AGENTS_DAY6_SECONDS } from "./compositions/Agents100Day6";
import { Agents100Day7, AGENTS_DAY7_SECONDS } from "./compositions/Agents100Day7";
import { Agents100Day8, AGENTS_DAY8_SECONDS } from "./compositions/Agents100Day8";
import { Agents100Day9, AGENTS_DAY9_SECONDS } from "./compositions/Agents100Day9";
import { Agents100Day10, AGENTS_DAY10_SECONDS } from "./compositions/Agents100Day10";
import { ClaudeFirmaDay1, CLAUDE_FIRMA_D1_SECONDS } from "./compositions/ClaudeFirmaDay1";
import { SuperkindFirmaDay1, SK_FIRMA_D1_SECONDS } from "./compositions/SuperkindFirmaDay1";
import { SuperkindFirmaTag1, SK_TAG1_SECONDS } from "./compositions/SuperkindFirmaTag1";
import { SuperkindFirmaTag1EN, SK_TAG1_EN_SECONDS } from "./compositions/SuperkindFirmaTag1EN";
import { SuperkindFirmaTag2, SK_TAG2_SECONDS } from "./compositions/SuperkindFirmaTag2";
import { SuperkindFirmaTag3, SK_TAG3_SECONDS } from "./compositions/SuperkindFirmaTag3";
import { FirmaShirtsTag1, FIRMA_SHIRTS_TAG1_SECONDS } from "./compositions/FirmaShirtsTag1";
import { SirTokenPixelReel, PIXELREEL_FPS, PIXELREEL_SECONDS } from "./compositions/SirTokenPixelReel";
import { GUErgebnis, GUPlus, GUNachricht1, GUNachricht2, GUNachricht3 } from "./compositions/GptUrlaubBrolls";
import { BXInbox, BXStep1, BXNews, BXHires, BXOpener, BXSource } from "./compositions/BxSignalsBrolls";
import { BXLStep1, BXLHires, BXLMessage, BXLSource } from "./compositions/BxLeadersBrolls";
import { BXUMain, bxuMeta } from "./compositions/BxUniJobBrolls";
import { BXBMain, bxbMeta } from "./compositions/BxBeforeAdBrolls";
import { BXRMain } from "./compositions/BxRepostBrolls";
import { BXSMain, BXS_FRAMES } from "./compositions/BxSalaryBrolls";
import { BXDMain, BXD_FRAMES } from "./compositions/BxDropoutBrolls";
import { BXS2Main, BXS2_FRAMES } from "./compositions/BxSearchBrolls";
import { BXFUMain, BXFU_FRAMES } from "./compositions/BxFollowupBrolls";
import { BXHMain, BXH_FRAMES } from "./compositions/BxHigherBrolls";
import { BXDCMain, BXDC_FRAMES } from "./compositions/BxDecodeBrolls";
import { BXRGMain, BXRG_FRAMES } from "./compositions/BxRangeBrolls";
import { BXIMain, BXI_FRAMES } from "./compositions/BxInterviewBrolls";
import { BXEAMain, BXEA_FRAMES } from "./compositions/BxDirectBrolls";
import { BXRPMain, BXRP_FRAMES } from "./compositions/BxReplyBrolls";
import { BXGPMain, BXGP_FRAMES } from "./compositions/BxGapBrolls";
import { BXLVMain, BXLV_FRAMES } from "./compositions/BxLeaveBrolls";
import { BXWKMain, BXWK_FRAMES } from "./compositions/BxWeaknessBrolls";
import { BXAKMain, BXAK_FRAMES } from "./compositions/BxAskBrolls";
import { BXGHMain, BXGH_FRAMES } from "./compositions/BxGhostBrolls";
import { BXJHook, BXJMoney, BXJStep1, BXJStep2, BXJStep3, BXJTrick, bxjMeta } from "./compositions/BxJobCutsBrolls";
import { GFErgebnis, GFNachricht1, GFTrick } from "./compositions/GptFluegeBrolls";
import { GLvErgebnis, GLvKonnektor, GLvNachricht1, GLvTrick } from "./compositions/GptLovableBrolls";
import { StHook, StFreiwillig, StSilvester, StPrompt, StFragen, StElster, StSelbst, StCta } from "./compositions/GptSteuerBrolls";
import { GhHook, GhWert, GhPlus, GhFrage, GhSpanne, GhTrick, GhSatz, GhCta } from "./compositions/GptGehaltBrolls";
import { KbHook, KbErgebnis, KbKassen, KbMassnahmen, KbEinreichen, KbWebsuche, KbPrompt, KbListe, KbCta } from "./compositions/GptBonusBrolls";
import { HvHook, HvErgebnis, HvScreenshot, HvUpload, HvSuche, HvTrick, HvAngebot, HvCta } from "./compositions/GptHandyBrolls";
import { GmHook, GmErgebnis, GmUpload, GmKlauseln, GmBetrag, GmTrick, GmAnwalt, GmCta } from "./compositions/GmPanelBrolls";
import { KaHook, KaBerater, KaPrivat, KaSteuer, KaUpload, KaMarkiert, KaListe, KaEntscheidet, KaCta } from "./compositions/KaPanelBrolls";
import { KsHook, KsBudget, KsAngebot, KsListe, KsTrick, KsSenden, KsCta } from "./compositions/KsPanelBrolls";
import { LimHook, LimLaenge, LimZusammen, LimProjekt, LimBuendeln, LimAbo, LimCta } from "./compositions/LimPanelBrolls";
import { JaHook, JaVorarbeit, JaExport, JaBank, JaTrick, JaBerater, JaCta } from "./compositions/JaPanelBrolls";
import { GCtErgebnis, GCtExport, GCtUpload, GCtTrick, GCtNachricht } from "./compositions/GptChatBrolls";
import { GBErgebnis, GBPlus, GBNachricht1, GBAntwort } from "./compositions/GptBriefBrolls";
import { GptCover } from "./compositions/GptCover";
import { GLErgebnis, GLPlus, GLNachricht1, GLNeu, GKErgebnis, GKPlus, GKNachricht1, GDMenu, GDSchalter, GDErgebnis, GDAn } from "./compositions/GptBatchBrolls";
import { LogoSwipeClip, LogoSwipeClipProps, LogoStill } from "./compositions/LogoSwipeClip";
import { TrialRecut, TrialRecutProps } from "./compositions/TrialRecut";
import { StGrafik, StForscher, StZeit, StRoutine, StWissen, StHaelfte, StSave, stMetadata } from "./compositions/StPanelBrolls";
import { VzBescheid, VzSchritt1, VzSchritt2, VzSchritt3, VzRate, VzGuide, vzMetadata } from "./compositions/VzPanelBrolls";
import { ZsGiro, ZsTagesgeld, ZsRechnung, ZsWebsuche, ZsPrompt, ZsDrei, ZsCta, zsMetadata } from "./compositions/GptZinsBrolls";
import { GptBrandCTest } from "./compositions/GptBrandCTest";
import { GptFotoTest } from "./compositions/GptFotoTest";
import { GptGruenTest } from "./compositions/GptGruenTest";
import { GptGruenV2 } from "./compositions/GptGruenV2";
import { DopamineHook, dopamineHookDefaults, dopamineHookMetadata } from "./compositions/DopamineHook";
import { KpHook, KpRechnung, KpSchritt1, KpSchritt2, KpSchritt3, KpKostenlos, KpCta } from "./compositions/KpPanelBrolls";
import { DpHook, DpJaNein, DpEffekt, DpSchritt1, DpSchritt2, DpSchritt3, DpCta } from "./compositions/DpPanelBrolls";
import { ZaHook, ZaRunden, ZaSchritt1, ZaSchritt2, ZaSchritt3, ZaCta } from "./compositions/ZaPanelBrolls";
const dpMetadata = ({ props }: { props: { seconds?: number } }) => ({ durationInFrames: Math.max(1, Math.round((props.seconds ?? 4) * 25)) });
import { RbHook, RbDreissig, RbUvp, RbMinus, RbScreenshot, RbPrompt, RbVergleich, RbCta, rbMetadata } from "./compositions/GptRabattBrolls";

import { AbHook, AbKlein, AbSchritt1, AbSchritt2, AbSchritt3, AbTools } from "./compositions/AbPanelBrolls";

loadFonts();

// Vertical 1080x1920 (9:16) — matches the Instagram Reels / TikTok target
// format these scripts are written for. 25fps — confirmed 2026-09-23 against
// a real HeyGen Avatar V export (probed via ffprobe). Always re-probe with
// `ffprobe -show_entries stream=r_frame_rate <file>` before a render if the
// source clip's own fps is ever in doubt — render-pipeline.mjs does this
// automatically and passes the real value in via props.
import { VisionSchwarm, VS_FPS, VS_SECONDS } from "./compositions/VisionSchwarm";
import { SuperkindDesk, SD_FPS, SD_SECONDS } from "./compositions/SuperkindDesk";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="SuperkindDesk" component={SuperkindDesk} durationInFrames={Math.round(SD_FPS * SD_SECONDS)} fps={SD_FPS} width={1080} height={1920} />
      <Composition id="VisionSchwarm" component={VisionSchwarm} durationInFrames={Math.round(VS_FPS * VS_SECONDS)} fps={VS_FPS} width={1080} height={1920} />
      <Composition id="LaunchKosten" component={LaunchKosten} durationInFrames={225} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 9, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0.6, 2.3, 3.1, 3.9, 4.6, 6, 7, 8.2] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchFirmen" component={LaunchFirmen} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0, 1.5, 3] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchNachrichten" component={LaunchNachrichten} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0.8, 1.8, 2.6] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchReveal" component={LaunchReveal} durationInFrames={80} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3.2, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0, 2.4] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchKollege" component={LaunchKollege} durationInFrames={200} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 8, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0.5, 2, 2.8, 3.3, 3.8, 5, 6.5] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchBrain" component={LaunchBrain} durationInFrames={225} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 9, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0.2, 1, 2, 3, 4, 5, 5.6, 6.2, 7.5] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchVertrauen" component={LaunchVertrauen} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0.1, 0.9, 1.8] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchMission" component={LaunchMission} durationInFrames={150} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 6, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0.8, 1.6, 2.5, 3.5, 4.5] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchWarteliste" component={LaunchWarteliste} durationInFrames={200} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 8, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, cues: [0, 1.2, 2, 4, 7.4] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchFilm" component={LaunchFilm} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3, avatar: { src: LAUNCH_AVATAR, startSec: 0 }, shots: [] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="VertragFalle" component={VertragFalle} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "vertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="VertragScan" component={VertragScan} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "vertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="VertragGegenvorschlag" component={VertragGegenvorschlag} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "vertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="VertragKalender" component={VertragKalender} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "vertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="VertragAnwalt" component={VertragAnwalt} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "vertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AVRechnung" component={AVRechnung} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "arbeitsvertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AVFragen" component={AVFragen} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "arbeitsvertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AVKlickpfad" component={AVKlickpfad} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "arbeitsvertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AVVertrag" component={AVVertrag} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "arbeitsvertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AVKlausel" component={AVKlausel} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "arbeitsvertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AVVergleich" component={AVVergleich} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "arbeitsvertrag/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireDatenGeschuetzt" component={SatireDatenGeschuetzt} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "", seconds: 18, words: [], c: { euch: 2.2, Kundenliste: 3.2, Laptop: 5.4, Urlaub: 7.2, Du: 7.9, Nein: 10.6, Datenschutz: 11.0, Juergen3: 12.0, private: 13.3, Pool: 14.8, Keiner: 15.6, Sicherer: 17.0 } as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireHirnAnzapfen" component={SatireHirnAnzapfen} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "", seconds: 40.6, words: [], face: { x: 540, y: 950, box: 430 }, c: { Darf: 1.8, Ich1: 5.6, ja: 6.9, Der: 7.3, Geschenk: 8.3, Dahinter: 9.0, Reziprozitaet: 9.6, Wer: 10.5, zurueckgeben: 12.6, Ein2: 13.5, Stunden1: 14.4, Stundensatz: 16.4, Nach: 18.4, Handy: 21.0, Claude1: 21.6, Protokoll: 22.6, zwoelf: 23.3, Seiten: 23.7, Am: 24.2, Rechnung: 26.2, Zwei2: 27.0, Abzueglich: 29.2, achtzig: 30.9, Gestern: 31.6, Kaffee3: 33.2, wissen: 35.0, Ich3: 37.2, zugesagt: 37.7, Im: 38.3 } as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireVergleichsangebot" component={SatireVergleichsangebot} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "fps-vergleichsangebot/tightened-hold.mp4", seconds: 38, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireVorabanalyse" component={SatireVorabanalyse} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "fps-vorabanalyse/tightened-hold.mp4", seconds: 38, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireProbezeit" component={SatireProbezeit} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "fps-ki-probezeit/tightened-hold.mp4", seconds: 29, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAbklaeren" component={SatireAbklaeren} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-aerztlich-abklaeren/tightened-hold.mp4", seconds: 33, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAnker" component={SatireAnker} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-achtundsechzigtausend/tightened-hold.mp4", seconds: 33, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireKosten" component={SatireKosten} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-effekt-versunkene-kosten/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireBarnum" component={SatireBarnum} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-barnum/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.35, tx: 0, ty: 0 } }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAustralien" component={SatireAustralien} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-australien/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.35, tx: 0, ty: 0 }, capY: 1340 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAustralienV2" component={SatireAustralienV2} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-australien/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.35, tx: 0, ty: 0 }, capY: 1450 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAustralienV3" component={SatireAustralienV3} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-australien/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.35, tx: 0, ty: 0 }, capY: 1450 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAustralienV4" component={SatireAustralienV4} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-australien/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.35, tx: 0, ty: 0 }, capY: 1450 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAustralienV5" component={SatireAustralienV5} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-australien/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.35, tx: 0, ty: 0 }, capY: 1450 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAustralienV6" component={SatireAustralienV6} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-australien/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.35, tx: 0, ty: 0 }, capY: 1450 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireAustralienV8" component={SatireAustralienV8} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-australien/tightened-hold-graded.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 410, ay: 920, s: 1.0, tx: 0, ty: 230 }, capY: 1580 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireDreiSeiten" component={SatireDreiSeiten} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-drei-seiten/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 540, ay: 920, s: 1.35, tx: 0, ty: 0 }, capY: 1500 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireDreiSeitenV2" component={SatireDreiSeitenV2} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-drei-seiten/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, fr: { ax: 400, ay: 950, s: 1.25, tx: 0, ty: 179 }, capY: 1480 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireGoodhart" component={SatireGoodhart} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-effekt-goodhart/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number>, splitS: 1.35, splitTx: 0, splitTy: 0 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatirePratfall" component={SatirePratfall} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-effekt-pratfall/tightened-hold.mp4", seconds: 40, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireKostenV2" component={SatireKostenV2} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-effekt-versunkene-kosten/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireFluch" component={SatireFluch} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-effekt-fluch-des-gewinners/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireReferenzpunkt" component={SatireReferenzpunkt} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-effekt-referenzpunkt/tightened-hold.mp4", seconds: 35, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireRatchet" component={SatireRatchet} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-nudeln-mit-pesto/tightened-hold.mp4", seconds: 40, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireTische" component={SatireTische} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "gpts-fuenf-tische/tightened-hold.mp4", seconds: 40, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireNachts" component={SatireNachts} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "fps-firma-nachts/tightened-hold.mp4", seconds: 21, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireChef" component={SatireChef} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "fps-chef-ki-kurs/tightened-hold.mp4", seconds: 27.8, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SatireMail" component={SatireMail} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ src: "satire-chatgpt-mail/tightened-hold.mp4", seconds: 29, words: [], c: {} as Record<string, number> }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="BoilrAd916" component={BoilrAd} durationInFrames={BOILR_AD_SECONDS * 25} fps={25} width={1080} height={1920} defaultProps={{ h: 1920 }} />
      <Composition id="BoilrAd45" component={BoilrAd} durationInFrames={BOILR_AD_SECONDS * 25} fps={25} width={1080} height={1350} defaultProps={{ h: 1350 }} />
      <Composition id="BoilrAdV2916" component={BoilrAdV2} durationInFrames={Math.round(BOILR_AD_V2_SECONDS * 25)} fps={25} width={1080} height={1920} defaultProps={{ h: 1920 }} />
      <Composition id="BoilrAdV245" component={BoilrAdV2} durationInFrames={Math.round(BOILR_AD_V2_SECONDS * 25)} fps={25} width={1080} height={1350} defaultProps={{ h: 1350 }} />
      <Composition id="BoilrAdV3916" component={BoilrAdV3} durationInFrames={Math.round(BOILR_AD_V3_SECONDS * 25)} fps={25} width={1080} height={1920} defaultProps={{ h: 1920 }} />
      <Composition id="BoilrAdV345" component={BoilrAdV3} durationInFrames={Math.round(BOILR_AD_V3_SECONDS * 25)} fps={25} width={1080} height={1350} defaultProps={{ h: 1350 }} />
      <Composition id="AbmBrief" component={AbmBrief} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "abmahnung/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AbmAnalyse" component={AbmAnalyse} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "abmahnung/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AbmKlauseln" component={AbmKlauseln} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "abmahnung/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AbmVorherNachher" component={AbmVorherNachher} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "abmahnung/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="MbZeit" component={MbZeit} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-mahnbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="MbAnalyse" component={MbAnalyse} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-mahnbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="MbPruefung" component={MbPruefung} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-mahnbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="MbFrist" component={MbFrist} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-mahnbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AgbTempo" component={AgbTempo} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "agb/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AgbFragen" component={AgbFragen} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "agb/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AgbAbschnitte" component={AgbAbschnitte} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "agb/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AgbKlauseln" component={AgbKlauseln} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "agb/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AgbVorherNachher" component={AgbVorherNachher} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "agb/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="LaunchCover" component={LaunchCover} durationInFrames={60} fps={25} width={1080} height={1920}
        defaultProps={{ frame: "launch/cover-frame.png", hook: "Das Ende der\n*200.000 €* KI-Teams" }} />
      <Composition id="ShowcaseSortieren" component={ShowcaseSortieren} durationInFrames={124} fps={25} width={1080} height={1920}
        defaultProps={showcaseProps(4.95, 5.0)} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="ShowcaseKlickpfad" component={ShowcaseKlickpfad} durationInFrames={116} fps={25} width={1080} height={1920}
        defaultProps={showcaseProps(4.62, 11.0)} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="ShowcaseKalender" component={ShowcaseKalender} durationInFrames={90} fps={25} width={1080} height={1920}
        defaultProps={showcaseProps(3.62, 15.68)} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="ExplainerDemoKosten" component={EngineerKostenBroll} durationInFrames={150} fps={25} width={1080} height={1920}
        defaultProps={demoProps(6, 4)} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="ExplainerDemoBrain" component={CompanyBrainBroll} durationInFrames={125} fps={25} width={1080} height={1920}
        defaultProps={demoProps(5, 11)} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="ExplainerDemoFirmen" component={ZwanzigFirmenBroll} durationInFrames={115} fps={25} width={1080} height={1920}
        defaultProps={demoProps(4.6, 17)} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SkillUIBroll" component={SkillUIBroll} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="MCPBroll" component={MCPBroll} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="InboxXmlBroll" component={InboxXmlBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="PflichtCheckBroll" component={PflichtCheckBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="XmlToKlartextBroll" component={XmlToKlartextBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="MorgenUebersichtBroll" component={MorgenUebersichtBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="DreiSchritteBroll" component={DreiSchritteBroll} durationInFrames={45} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 1.8 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="ElfWochenBroll" component={ElfWochenBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SortierenBroll" component={SortierenBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="AntwortBroll" component={AntwortBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="KalenderBroll" component={KalenderBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="VorsortierenBroll" component={VorsortierenBroll} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3 }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      {/* Length adjustable per cut window: --props='{"seconds":5.6}' */}
      <Composition
        id="WebsiteScrollBroll"
        component={WebsiteScrollBroll}
        durationInFrames={WEBSITE_SCROLL_DURATION}
        fps={25}
        width={1080}
        height={1920}
        defaultProps={{ seconds: WEBSITE_SCROLL_DURATION / 25 }}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })}
      />
      {/* Per-topic UI B-Roll for the Studio app — all content via --props */}
      <Composition<any, TopicBrollProps>
        id="TopicBroll"
        component={TopicBroll}
        durationInFrames={100}
        fps={25}
        width={1080}
        height={1920}
        defaultProps={TOPIC_BROLL_DEFAULTS}
        calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })}
      />
      {/* Generic first-5s / last-5s text-hook overlay for any source video —
          see composite-hook.mjs for how width/height/fps/durationInFrames get
          probed from the real source file and passed in as props. */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Composition<any, HookOverlayProps>
        id="HookOverlay"
        component={HookOverlay}
        durationInFrames={1}
        fps={25}
        width={1080}
        height={1920}
        defaultProps={{
          videoFileName: "placeholder.mp4",
          hookText: "",
          hookSeconds: 5,
          endHookText: "",
          endHookSeconds: 5,
          fps: 25,
          width: 1080,
          height: 1920,
          durationInFrames: 1,
        }}
        calculateMetadata={async ({ props }) => ({
          durationInFrames: Math.round(props.durationInFrames),
          fps: props.fps,
          width: props.width,
          height: props.height,
        })}
      />

      <Composition id="LogoStill" component={LogoStill} durationInFrames={1} fps={25} width={600} height={600}
        defaultProps={{ svg: "niklas/apple.svg" }} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Composition<any, LogoSwipeClipProps>
        id="LogoSwipeClip"
        component={LogoSwipeClip}
        durationInFrames={1}
        fps={25}
        width={1080}
        height={1920}
        defaultProps={{
          videoFileName: "placeholder.mp4",
          captionWords: [],
          logos: [],
          logosOutMs: 0,
          whooshFileName: "whoosh.wav",
          fps: 25,
          width: 1080,
          height: 1920,
          durationInFrames: 1,
        }}
        calculateMetadata={async ({ props }) => ({
          durationInFrames: Math.round(props.durationInFrames),
          fps: props.fps,
          width: props.width,
          height: props.height,
        })}
      />

      {/* Trial-reel recuts of old finished reels: new Marker hook (+ optional dark title card over the old title). */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Composition<any, TrialRecutProps>
        id="TrialRecut"
        component={TrialRecut}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ videoFileName: "placeholder.mp4", hookText: "", hookSeconds: 4, hookY: 0.3, hookScale: 1, cardSeconds: 0, cardTop: 0.08, cardBottom: 0.36, fps: 30, width: 1080, height: 1920, durationInFrames: 1 }}
        calculateMetadata={async ({ props }) => ({ durationInFrames: Math.round(props.durationInFrames), fps: props.fps, width: props.width, height: props.height })}
      />

      {/* The master composition — see FinalVideo.tsx. All props are computed
          by scripts/render-pipeline.mjs (silence-cut timeline, zoom
          keyframes, word-level captions, B-Roll windows) and passed in via
          --props, nothing here is per-topic. */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Composition<any, FinalVideoProps>
        id="FinalVideo"
        component={FinalVideo}
        durationInFrames={1}
        fps={25}
        width={1080}
        height={1920}
        defaultProps={{
          videoFileName: "placeholder.mp4",
          zoomKeyframes: [],
          captionWords: [],
          brollSegments: [],
          hookText: "",
          hookSeconds: 5,
          endHookText: "",
          endHookSeconds: 5,
          fps: 25,
          width: 1080,
          durationInFrames: 1,
        }}
        calculateMetadata={async ({ props }) => ({
          durationInFrames: Math.round(props.durationInFrames),
          fps: props.fps,
          width: props.width,
          height: 1920,
        })}
      />
      <Composition id="BXInbox" component={BXInbox} durationInFrames={97} fps={25} width={1080} height={1920} />
      <Composition id="BXStep1" component={BXStep1} durationInFrames={185} fps={25} width={1080} height={1920} />
      <Composition id="BXNews" component={BXNews} durationInFrames={79} fps={25} width={1080} height={1920} />
      <Composition id="BXHires" component={BXHires} durationInFrames={91} fps={25} width={1080} height={1920} />
      <Composition id="BXOpener" component={BXOpener} durationInFrames={80} fps={25} width={1080} height={1920} />
      <Composition id="BXSource" component={BXSource} durationInFrames={80} fps={25} width={1080} height={1920} />
      <Composition id="BXLStep1" component={BXLStep1} durationInFrames={220} fps={25} width={1080} height={1920} />
      <Composition id="BXLHires" component={BXLHires} durationInFrames={83} fps={25} width={1080} height={1920} />
      <Composition id="BXLMessage" component={BXLMessage} durationInFrames={128} fps={25} width={1080} height={1920} />
      <Composition id="BXLSource" component={BXLSource} durationInFrames={118} fps={25} width={1080} height={1920} />
      <Composition id="BXUMain" component={BXUMain} durationInFrames={640} fps={25} width={1080} height={1920} defaultProps={{ avatarSrc: "render-bxjc-p1.mp4" } as any} calculateMetadata={bxuMeta} />
      <Composition id="BXS2Main" component={BXS2Main} durationInFrames={BXS2_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXFUMain" component={BXFUMain} durationInFrames={BXFU_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXHMain" component={BXHMain} durationInFrames={BXH_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXDMain" component={BXDMain} durationInFrames={BXD_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXGHMain" component={BXGHMain} durationInFrames={BXGH_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXDCMain" component={BXDCMain} durationInFrames={BXDC_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXRGMain" component={BXRGMain} durationInFrames={BXRG_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXIMain" component={BXIMain} durationInFrames={BXI_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXEAMain" component={BXEAMain} durationInFrames={BXEA_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXRPMain" component={BXRPMain} durationInFrames={BXRP_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXGPMain" component={BXGPMain} durationInFrames={BXGP_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXLVMain" component={BXLVMain} durationInFrames={BXLV_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXWKMain" component={BXWKMain} durationInFrames={BXWK_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXAKMain" component={BXAKMain} durationInFrames={BXAK_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXSMain" component={BXSMain} durationInFrames={BXS_FRAMES} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXRMain" component={BXRMain} durationInFrames={922} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="BXBMain" component={BXBMain} durationInFrames={890} fps={25} width={1080} height={1920} defaultProps={{ avatarSrc: "render-bxb-tightened-skin.mp4" } as any} calculateMetadata={bxbMeta} />
      <Composition id="BXJHook" component={BXJHook} durationInFrames={163} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-bxjc-p1.mp4", startSec: 0, focus: { x: 0.478, y: 0.466 }, scale: 1.0, faceAt: 0.6 } }} calculateMetadata={bxjMeta} />
      <Composition id="BXJMoney" component={BXJMoney} durationInFrames={178} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-bxjc-p2.mp4", startSec: 0, focus: { x: 0.478, y: 0.466 }, scale: 1.0, faceAt: 0.6 } }} calculateMetadata={bxjMeta} />
      <Composition id="BXJStep1" component={BXJStep1} durationInFrames={256} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-bxjc-p3.mp4", startSec: 0, focus: { x: 0.478, y: 0.466 }, scale: 1.0, faceAt: 0.6 } }} calculateMetadata={bxjMeta} />
      <Composition id="BXJStep2" component={BXJStep2} durationInFrames={68} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-bxjc-p4.mp4", startSec: 0, focus: { x: 0.478, y: 0.466 }, scale: 1.0, faceAt: 0.6 } }} calculateMetadata={bxjMeta} />
      <Composition id="BXJStep3" component={BXJStep3} durationInFrames={74} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-bxjc-p5.mp4", startSec: 0, focus: { x: 0.478, y: 0.466 }, scale: 1.0, faceAt: 0.6 } }} calculateMetadata={bxjMeta} />
      <Composition id="BXJTrick" component={BXJTrick} durationInFrames={86} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-bxjc-p6.mp4", startSec: 0, focus: { x: 0.478, y: 0.466 }, scale: 1.0, faceAt: 0.6 } }} calculateMetadata={bxjMeta} />
      <Composition id="GUErgebnis" component={GUErgebnis} durationInFrames={108} fps={25} width={1080} height={1920} />
      <Composition id="StHook" component={StHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="StFreiwillig" component={StFreiwillig} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="StSilvester" component={StSilvester} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="StPrompt" component={StPrompt} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="StFragen" component={StFragen} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="StElster" component={StElster} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="StSelbst" component={StSelbst} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="StCta" component={StCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhHook" component={GhHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhWert" component={GhWert} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhPlus" component={GhPlus} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhFrage" component={GhFrage} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhSpanne" component={GhSpanne} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhTrick" component={GhTrick} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhSatz" component={GhSatz} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="GhCta" component={GhCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 10) * 25) })} />
      <Composition id="KbHook" component={KbHook} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbErgebnis" component={KbErgebnis} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbKassen" component={KbKassen} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbMassnahmen" component={KbMassnahmen} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbEinreichen" component={KbEinreichen} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbWebsuche" component={KbWebsuche} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbPrompt" component={KbPrompt} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbListe" component={KbListe} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KbCta" component={KbCta} durationInFrames={400} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvHook" component={HvHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvErgebnis" component={HvErgebnis} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvScreenshot" component={HvScreenshot} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvUpload" component={HvUpload} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvSuche" component={HvSuche} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvTrick" component={HvTrick} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvAngebot" component={HvAngebot} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="HvCta" component={HvCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmHook" component={GmHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmErgebnis" component={GmErgebnis} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmUpload" component={GmUpload} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmKlauseln" component={GmKlauseln} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmBetrag" component={GmBetrag} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmTrick" component={GmTrick} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmAnwalt" component={GmAnwalt} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GmCta" component={GmCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaHook" component={KaHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaBerater" component={KaBerater} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaPrivat" component={KaPrivat} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaSteuer" component={KaSteuer} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaUpload" component={KaUpload} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaMarkiert" component={KaMarkiert} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaListe" component={KaListe} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaEntscheidet" component={KaEntscheidet} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KaCta" component={KaCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KsHook" component={KsHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KsBudget" component={KsBudget} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KsAngebot" component={KsAngebot} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KsListe" component={KsListe} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KsTrick" component={KsTrick} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KsSenden" component={KsSenden} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="KsCta" component={KsCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="LimHook" component={LimHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="LimLaenge" component={LimLaenge} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="LimZusammen" component={LimZusammen} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="LimProjekt" component={LimProjekt} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="LimBuendeln" component={LimBuendeln} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="LimAbo" component={LimAbo} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="LimCta" component={LimCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="JaHook" component={JaHook} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="JaVorarbeit" component={JaVorarbeit} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="JaExport" component={JaExport} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="JaBank" component={JaBank} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="JaTrick" component={JaTrick} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="JaBerater" component={JaBerater} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="JaCta" component={JaCta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GCtErgebnis" component={GCtErgebnis} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GCtExport" component={GCtExport} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GCtUpload" component={GCtUpload} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GCtTrick" component={GCtTrick} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GCtNachricht" component={GCtNachricht} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GLvErgebnis" component={GLvErgebnis} durationInFrames={150} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GLvKonnektor" component={GLvKonnektor} durationInFrames={150} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GLvNachricht1" component={GLvNachricht1} durationInFrames={300} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GLvTrick" component={GLvTrick} durationInFrames={300} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GFErgebnis" component={GFErgebnis} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-fluege-tightened.mp4", startSec: 0 } }} />
      <Composition id="GFNachricht1" component={GFNachricht1} durationInFrames={300} fps={25} width={1080} height={1920} defaultProps={{}} />
      <Composition id="GFTrick" component={GFTrick} durationInFrames={150} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-fluege-tightened.mp4", startSec: 0 } }} />
      <Composition id="GUPlus" component={GUPlus} durationInFrames={90} fps={25} width={1080} height={1920} />
      <Composition id="GUNachricht1" component={GUNachricht1} durationInFrames={125} fps={25} width={1080} height={1920} />
      <Composition id="GUNachricht2" component={GUNachricht2} durationInFrames={119} fps={25} width={1080} height={1920} />
      <Composition id="GUNachricht3" component={GUNachricht3} durationInFrames={60} fps={25} width={1080} height={1920} />
      <Composition id="GptCover" component={GptCover} durationInFrames={1} fps={25} width={1080} height={1920} defaultProps={{ bg: "gpt-behoerdenbrief/cover-bg.png", hook: "Hook" }} />
      <Composition id="GLErgebnis" component={GLErgebnis} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GLPlus" component={GLPlus} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GLNachricht1" component={GLNachricht1} durationInFrames={200} fps={25} width={1080} height={1920} />
      <Composition id="GLNeu" component={GLNeu} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GKErgebnis" component={GKErgebnis} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GKPlus" component={GKPlus} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GKNachricht1" component={GKNachricht1} durationInFrames={200} fps={25} width={1080} height={1920} />
      <Composition id="GDMenu" component={GDMenu} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GDSchalter" component={GDSchalter} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GDErgebnis" component={GDErgebnis} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="GDAn" component={GDAn} durationInFrames={150} fps={25} width={1080} height={1920} />
      <Composition id="AgKosten" component={AgKosten} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-agb-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="AgFragen" component={AgFragen} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-agb-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="AgEntwurf" component={AgEntwurf} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-agb-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="AgPruefung" component={AgPruefung} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-agb-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="AgSumme" component={AgSumme} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-agb-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="BpErgebnis" component={BpErgebnis} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 2, avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="BpAnordnung" component={BpAnordnung} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="BpLuecken" component={BpLuecken} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="BpFragen" component={BpFragen} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="BpSumme" component={BpSumme} durationInFrames={200} fps={25} width={1080} height={1920} defaultProps={{ seconds: 4, avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 }, cues: [] }} />
      <Composition id="BpP0Cover" component={BpP0Cover} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="BpP1Ergebnis" component={BpP1Ergebnis} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="BpP2Schritt1" component={BpP2Schritt1} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="BpP3Schritt2" component={BpP3Schritt2} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="BpP4Trick" component={BpP4Trick} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="BpP5Schritt3" component={BpP5Schritt3} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="BpP6Berater" component={BpP6Berater} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="BpP7Cta" component={BpP7Cta} durationInFrames={250} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-betriebspruefung-tightened.mp4", startSec: 0 } }} />
      <Composition id="SbZeit" component={SbZeit} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-steuerbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SbVergleich" component={SbVergleich} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-steuerbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SbEinspruch" component={SbEinspruch} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-steuerbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="SbKosten" component={SbKosten} durationInFrames={100} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 4, avatar: { src: "fpn-steuerbescheid/tightened.mp4", startSec: 0 }, cues: [] as number[] }} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(props.seconds * 25) })} />
      <Composition id="GCItem" component={GCItem} durationInFrames={75} fps={25} width={1080} height={1920}
        defaultProps={{ seconds: 3, n: 1, text: "Stell mir erst drei Fragen, bevor du antwortest.", head: "Bevor ich antworte:", body: "1. Für wen? 2. Wie viel Budget? 3. Bis wann?" } as any} calculateMetadata={({ props }) => ({ durationInFrames: Math.round(((props as any).seconds ?? 3) * 25) })} />
      <Composition id="GCErgebnis" component={GCErgebnis} durationInFrames={100} fps={25} width={1080} height={1920} />
      <Composition id="GRErgebnis" component={GRErgebnis} durationInFrames={100} fps={25} width={1080} height={1920} />
      <Composition id="GRNachricht1" component={GRNachricht1} durationInFrames={240} fps={25} width={1080} height={1920} />
      <Composition id="GRNachricht2" component={GRNachricht2} durationInFrames={170} fps={25} width={1080} height={1920} />
      <Composition id="GNErgebnis" component={GNErgebnis} durationInFrames={100} fps={25} width={1080} height={1920} />
      <Composition id="GNPlus" component={GNPlus} durationInFrames={140} fps={25} width={1080} height={1920} />
      <Composition id="GNNachricht1" component={GNNachricht1} durationInFrames={210} fps={25} width={1080} height={1920} />
      <Composition id="GNBrief" component={GNBrief} durationInFrames={125} fps={25} width={1080} height={1920} />
      <Composition id="GBErgebnis" component={GBErgebnis} durationInFrames={125} fps={25} width={1080} height={1920} />
      <Composition id="GBPlus" component={GBPlus} durationInFrames={100} fps={25} width={1080} height={1920} />
      <Composition id="GBNachricht1" component={GBNachricht1} durationInFrames={160} fps={25} width={1080} height={1920} />
      <Composition id="GBAntwort" component={GBAntwort} durationInFrames={125} fps={25} width={1080} height={1920} />
      <Composition id="StForscher" component={StForscher} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-studie-1-tightened.mp4", startSec: 0 } }} calculateMetadata={stMetadata} />
      <Composition id="StGrafik" component={StGrafik} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-studie-1-tightened.mp4", startSec: 0 } }} calculateMetadata={stMetadata} />
      <Composition id="StZeit" component={StZeit} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-studie-1-tightened.mp4", startSec: 0 } }} calculateMetadata={stMetadata} />
      <Composition id="StRoutine" component={StRoutine} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-studie-1-tightened.mp4", startSec: 0 } }} calculateMetadata={stMetadata} />
      <Composition id="StWissen" component={StWissen} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-studie-1-tightened.mp4", startSec: 0 } }} calculateMetadata={stMetadata} />
      <Composition id="StHaelfte" component={StHaelfte} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-studie-1-tightened.mp4", startSec: 0 } }} calculateMetadata={stMetadata} />
      <Composition id="StSave" component={StSave} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-fpn-studie-1-tightened.mp4", startSec: 0 } }} calculateMetadata={stMetadata} />
      <Composition id="ZsGiro" component={ZsGiro} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-zinsen-tightened.mp4", startSec: 0, focus: { x: 0.52, y: 0.45 }, scale: 1.0, faceAt: 0.42 }, seconds: 4 }} calculateMetadata={zsMetadata} />
      <Composition id="ZsTagesgeld" component={ZsTagesgeld} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-zinsen-tightened.mp4", startSec: 0, focus: { x: 0.52, y: 0.45 }, scale: 1.0, faceAt: 0.42 }, seconds: 4 }} calculateMetadata={zsMetadata} />
      <Composition id="ZsRechnung" component={ZsRechnung} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-zinsen-tightened.mp4", startSec: 0, focus: { x: 0.52, y: 0.45 }, scale: 1.0, faceAt: 0.42 }, seconds: 4 }} calculateMetadata={zsMetadata} />
      <Composition id="ZsWebsuche" component={ZsWebsuche} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-zinsen-tightened.mp4", startSec: 0, focus: { x: 0.52, y: 0.45 }, scale: 1.0, faceAt: 0.42 }, seconds: 4 }} calculateMetadata={zsMetadata} />
      <Composition id="ZsPrompt" component={ZsPrompt} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-zinsen-tightened.mp4", startSec: 0, focus: { x: 0.52, y: 0.45 }, scale: 1.0, faceAt: 0.42 }, seconds: 4 }} calculateMetadata={zsMetadata} />
      <Composition id="ZsDrei" component={ZsDrei} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-zinsen-tightened.mp4", startSec: 0, focus: { x: 0.52, y: 0.45 }, scale: 1.0, faceAt: 0.42 }, seconds: 4 }} calculateMetadata={zsMetadata} />
      <Composition id="ZsCta" component={ZsCta} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{ avatar: { src: "render-gpt-zinsen-tightened.mp4", startSec: 0, focus: { x: 0.52, y: 0.45 }, scale: 1.0, faceAt: 0.42 }, seconds: 4 }} calculateMetadata={zsMetadata} />
      <Composition id="GptBrandCTest" component={GptBrandCTest} durationInFrames={950} fps={25} width={1080} height={1920} />
      <Composition id="GptFotoTest" component={GptFotoTest} durationInFrames={950} fps={25} width={1080} height={1920} />
      <Composition id="GptGruenTest" component={GptGruenTest} durationInFrames={950} fps={25} width={1080} height={1920} />
      <Composition id="GptGruenV2" component={GptGruenV2} durationInFrames={950} fps={25} width={1080} height={1920} />
      <Composition id="DopamineHook" component={DopamineHook} durationInFrames={113} fps={25} width={1080} height={1920} defaultProps={dopamineHookDefaults} calculateMetadata={dopamineHookMetadata} />
      <Composition id="RbHook" component={RbHook as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="RbDreissig" component={RbDreissig as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="RbUvp" component={RbUvp as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="RbMinus" component={RbMinus as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="RbScreenshot" component={RbScreenshot as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="RbPrompt" component={RbPrompt as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="RbVergleich" component={RbVergleich as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="RbCta" component={RbCta as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{}} calculateMetadata={rbMetadata as any} />
      <Composition id="DpHook" component={DpHook as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-drei-pakete-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="DpJaNein" component={DpJaNein as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-drei-pakete-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="DpEffekt" component={DpEffekt as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-drei-pakete-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="DpSchritt1" component={DpSchritt1 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-drei-pakete-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="DpSchritt2" component={DpSchritt2 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-drei-pakete-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="DpSchritt3" component={DpSchritt3 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-drei-pakete-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="DpCta" component={DpCta as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-drei-pakete-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="AbHook" component={AbHook as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-abos-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="AbKlein" component={AbKlein as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-abos-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="AbSchritt1" component={AbSchritt1 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-abos-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="AbSchritt2" component={AbSchritt2 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-abos-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="AbSchritt3" component={AbSchritt3 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-abos-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="AbTools" component={AbTools as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-abos-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="ZaHook" component={ZaHook as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-zusatzauftrag-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="ZaRunden" component={ZaRunden as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-zusatzauftrag-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="ZaSchritt1" component={ZaSchritt1 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-zusatzauftrag-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="ZaSchritt2" component={ZaSchritt2 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-zusatzauftrag-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="ZaSchritt3" component={ZaSchritt3 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-zusatzauftrag-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="ZaCta" component={ZaCta as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-zusatzauftrag-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="KpHook" component={KpHook as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-kunde-pruefen-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="KpRechnung" component={KpRechnung as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-kunde-pruefen-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="KpSchritt1" component={KpSchritt1 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-kunde-pruefen-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="KpSchritt2" component={KpSchritt2 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-kunde-pruefen-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="KpSchritt3" component={KpSchritt3 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-kunde-pruefen-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="KpKostenlos" component={KpKostenlos as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-kunde-pruefen-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="KpCta" component={KpCta as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-kunde-pruefen-tightened.mp4", startSec: 0}}} calculateMetadata={dpMetadata as any} />
      <Composition id="VzBescheid" component={VzBescheid as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-vorauszahlung-tightened.mp4", startSec: 0}}} calculateMetadata={vzMetadata as any} />
      <Composition id="VzSchritt1" component={VzSchritt1 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-vorauszahlung-tightened.mp4", startSec: 0}}} calculateMetadata={vzMetadata as any} />
      <Composition id="VzSchritt2" component={VzSchritt2 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-vorauszahlung-tightened.mp4", startSec: 0}}} calculateMetadata={vzMetadata as any} />
      <Composition id="VzSchritt3" component={VzSchritt3 as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-vorauszahlung-tightened.mp4", startSec: 0}}} calculateMetadata={vzMetadata as any} />
      <Composition id="VzRate" component={VzRate as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-vorauszahlung-tightened.mp4", startSec: 0}}} calculateMetadata={vzMetadata as any} />
      <Composition id="VzGuide" component={VzGuide as any} durationInFrames={100} fps={25} width={1080} height={1920} defaultProps={{avatar: {src: "render-fpn-vorauszahlung-tightened.mp4", startSec: 0}}} calculateMetadata={vzMetadata as any} />
      <Composition id="SirTokenTrainer" component={SirTokenTrainer} durationInFrames={Math.round(SIRTOKEN_SECONDS * SIRTOKEN_FPS)} fps={SIRTOKEN_FPS} width={1080} height={1920} />
      <Composition id="PixelKitDemo" component={PixelKitDemo} durationInFrames={240} fps={30} width={1080} height={1920} defaultProps={{ mode: "step" as const }} />
      <Composition id="TrainerReelV2" component={TrainerReelV2} durationInFrames={Math.round(TRAINER_V2_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="ClaudeClickpath" component={ClaudeClickpath} durationInFrames={120} fps={30} width={1080} height={1920} />
      <Composition id="TrainerTable3D" component={TrainerTable3D} durationInFrames={200} fps={30} width={1080} height={1920} />
      <Composition id="ClaudeFirmaDay1" component={ClaudeFirmaDay1} durationInFrames={Math.round(CLAUDE_FIRMA_D1_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="SuperkindFirmaDay1" component={SuperkindFirmaDay1} durationInFrames={Math.round(SK_FIRMA_D1_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="SuperkindFirmaTag1" component={SuperkindFirmaTag1} durationInFrames={Math.round(SK_TAG1_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="SuperkindFirmaTag1EN" component={SuperkindFirmaTag1EN} durationInFrames={Math.round(SK_TAG1_EN_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="SuperkindFirmaTag2" component={SuperkindFirmaTag2} durationInFrames={Math.round(SK_TAG2_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="SuperkindFirmaTag3" component={SuperkindFirmaTag3} durationInFrames={Math.round(SK_TAG3_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="FirmaShirtsTag1" component={FirmaShirtsTag1} durationInFrames={Math.round(FIRMA_SHIRTS_TAG1_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day1" component={Agents100Day1} durationInFrames={Math.round(AGENTS_DAY1_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day2" component={Agents100Day2} durationInFrames={Math.round(AGENTS_DAY2_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day3" component={Agents100Day3} durationInFrames={Math.round(AGENTS_DAY3_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day4" component={Agents100Day4} durationInFrames={Math.round(AGENTS_DAY4_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day5" component={Agents100Day5} durationInFrames={Math.round(AGENTS_DAY5_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day6" component={Agents100Day6} durationInFrames={Math.round(AGENTS_DAY6_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day7" component={Agents100Day7} durationInFrames={Math.round(AGENTS_DAY7_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day8" component={Agents100Day8} durationInFrames={Math.round(AGENTS_DAY8_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day9" component={Agents100Day9} durationInFrames={Math.round(AGENTS_DAY9_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="Agents100Day10" component={Agents100Day10} durationInFrames={Math.round(AGENTS_DAY10_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="TrainerWorld3D" component={TrainerWorld3D} durationInFrames={Math.round(TRAINER_WORLD_SECONDS * 30)} fps={30} width={1080} height={1920} />
      <Composition id="SirTokenPixelFrame" component={SirTokenPixelFrame} durationInFrames={90} fps={30} width={1080} height={1920} />
      <Composition id="SirTokenPixelReel" component={SirTokenPixelReel} durationInFrames={Math.round(PIXELREEL_SECONDS * PIXELREEL_FPS)} fps={PIXELREEL_FPS} width={1080} height={1920} />
    </>
  );
};
