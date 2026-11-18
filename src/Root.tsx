import React from "react";
import { Composition } from "remotion";
import { BridgeShort, BRIDGE_FRAMES } from "./videos/bridge/Bridge";
import { PsaReel, PsaCaptions, PSA_FRAMES } from "./videos/psa/Reel";
import { GpsReel, GpsCaptions, GPS_FRAMES } from "./videos/gps/Reel";
import { CharTest, CHAR_FRAMES } from "./videos/char/CharTest";
import { AtticReel, AtticCaptions, ATTIC_FRAMES } from "./videos/attic/Reel";
import { MudkipReel, MudkipCaptions, MUDKIP_FRAMES } from "./videos/mudkip/Reel";

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
  </>
);
