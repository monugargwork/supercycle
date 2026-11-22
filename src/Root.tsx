import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { PsaReel, PsaCaptions, PSA_FRAMES } from "./videos/psa/Reel";
import { GpsReel, GpsCaptions, GPS_FRAMES } from "./videos/gps/Reel";
import { CharTest, CHAR_FRAMES } from "./videos/char/CharTest";
import { AtticReel, AtticCaptions, ATTIC_FRAMES } from "./videos/attic/Reel";
import { MudkipReel, MudkipCaptions, MUDKIP_FRAMES } from "./videos/mudkip/Reel";
import { FanaticsReel, FanaticsCaptions, FANATICS_FRAMES } from "./videos/fanatics/Reel";
import { ChocoboReel, ChocoboCaptions, CHOCOBO_FRAMES } from "./videos/chocobo/Reel";
import { MonacoReel, MonacoCaptions, MONACO_FRAMES } from "./videos/monaco/Reel";
import { FossilReel, FossilCaptions, FOSSIL_FRAMES } from "./videos/fossil/Reel";
import { JirachiReel, JirachiCaptions, JIRACHI_FRAMES } from "./videos/jirachi/Reel";
import { LucasReel, LucasCaptions, LUCAS_FRAMES } from "./videos/lucas/Reel";
import { TcgplayerReel, TcgplayerCaptions, TCGPLAYER_FRAMES } from "./videos/tcgplayer/Reel";
import { GengarReel, GengarCaptions, GENGAR_FRAMES } from "./videos/gengar/Reel";
import { GoldenrodReel, GoldenrodCaptions, GOLDENROD_FRAMES } from "./videos/goldenrod/Reel";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PsaReel" component={PsaReel} durationInFrames={PSA_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="PsaCaptions" component={PsaCaptions} durationInFrames={PSA_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="MudkipReel" component={MudkipReel} durationInFrames={MUDKIP_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MudkipCaptions" component={MudkipCaptions} durationInFrames={MUDKIP_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="AtticReel" component={AtticReel} durationInFrames={ATTIC_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="AtticCaptions" component={AtticCaptions} durationInFrames={ATTIC_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="CharTest" component={CharTest} durationInFrames={CHAR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="GpsReel" component={GpsReel} durationInFrames={GPS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="GpsCaptions" component={GpsCaptions} durationInFrames={GPS_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="BridgeShort" component={BridgeShort} durationInFrames={BRIDGE_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="FanaticsReel" component={FanaticsReel} durationInFrames={FANATICS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="FanaticsCaptions" component={FanaticsCaptions} durationInFrames={FANATICS_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="ChocoboReel" component={ChocoboReel} durationInFrames={CHOCOBO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="ChocoboCaptions" component={ChocoboCaptions} durationInFrames={CHOCOBO_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="MonacoReel" component={MonacoReel} durationInFrames={MONACO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="MonacoCaptions" component={MonacoCaptions} durationInFrames={MONACO_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="FossilReel" component={FossilReel} durationInFrames={FOSSIL_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="FossilCaptions" component={FossilCaptions} durationInFrames={FOSSIL_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="JirachiReel" component={JirachiReel} durationInFrames={JIRACHI_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="JirachiCaptions" component={JirachiCaptions} durationInFrames={JIRACHI_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="LucasReel" component={LucasReel} durationInFrames={LUCAS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="LucasCaptions" component={LucasCaptions} durationInFrames={LUCAS_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="TcgplayerReel" component={TcgplayerReel} durationInFrames={TCGPLAYER_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="TcgplayerCaptions" component={TcgplayerCaptions} durationInFrames={TCGPLAYER_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="GengarReel" component={GengarReel} durationInFrames={GENGAR_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="GengarCaptions" component={GengarCaptions} durationInFrames={GENGAR_FRAMES} fps={30} width={1440} height={2560} />
    <Composition id="GoldenrodReel" component={GoldenrodReel} durationInFrames={GOLDENROD_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="GoldenrodCaptions" component={GoldenrodCaptions} durationInFrames={GOLDENROD_FRAMES} fps={30} width={1440} height={2560} />
  </>
);
