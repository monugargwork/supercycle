// The Retford reel's cast looks (flat toon outfits). Generic cartoon people, no likenesses and no names: the burglars are
// hooded with eye masks, the six charged men wear plain suits. Bright palette (quality bar): no greys, no near-black navy.
import { Outfit } from "../../engine/toon";
const HIVIS = "#e8e23a";
export const LOOKS = {
  A: { jacket: "#2f8a4a", pants: "#3b4a8a", boots: "#5a3420", hat: "beanie", cap: "#2f8a4a", skin: "#e8b896", mask: true } as Outfit,
  B: { jacket: "#d0603a", pants: "#3b4a8a", boots: "#5a3420", hat: "beanie", cap: "#d0603a", skin: "#c98a62", mask: true } as Outfit,
  officer: { jacket: HIVIS, pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f4a8a", skin: "#f2c4a4", badge: "#f4f1ea" } as Outfit,
  cop1: { jacket: HIVIS, pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f4a8a", skin: "#c98a62", badge: "#f4f1ea" } as Outfit,
  cop2: { jacket: HIVIS, pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f4a8a", skin: "#f2c8a8", badge: "#f4f1ea" } as Outfit,
  aide: { jacket: "#4fb0e8", pants: "#2f4a8a", boots: "#2a1a14", hat: "hair", hair: "#5a3420", skin: "#e8b896" } as Outfit,
  det: { jacket: "#c98a3e", pants: "#2f4a8a", boots: "#5a3420", hat: "hair", hair: "#2a1a14", skin: "#e2a882", tie: "#d8322f", chest: "DETECTIVE", chestCol: "#fbf3dc", chestFit: true } as Outfit,
  C1: { jacket: "#2f9a9a", pants: "#b8864a", boots: "#5a3420", hat: "cap", cap: "#d8322f", skin: "#f2c8a8" } as Outfit,
  C2: { jacket: "#d8322f", pants: "#3f6fc4", boots: "#2a1a14", hat: "hair", hair: "#3a2418", skin: "#a8714f" } as Outfit,
  kid: { jacket: "#f2c23a", pants: "#2f5fb4", boots: "#d8322f", hat: "hair", hair: "#5a3420", skin: "#f2c4a4", build: "kid" } as Outfit,
  kid2: { jacket: "#d8322f", pants: "#2f5fb4", boots: "#f2c23a", hat: "beanie", cap: "#4fb0e8", skin: "#e8b896", build: "kid" } as Outfit,
  m1: { jacket: "#2f5fb4", pants: "#2f5fb4", boots: "#2a1a14", hat: "hair", hair: "#3a2418", skin: "#f2c8a8", tie: "#d8322f" } as Outfit,
  m2: { jacket: "#8a5230", pants: "#8a5230", boots: "#2a1a14", hat: "hair", hair: "#c98a3e", skin: "#e8b896", tie: "#2f5fb4" } as Outfit,
  m3: { jacket: "#2f8a4a", pants: "#2f8a4a", boots: "#2a1a14", hat: "hair", hair: "#2a1a14", skin: "#c98a62", tie: "#f2c23a" } as Outfit,
  m4: { jacket: "#b0323c", pants: "#b0323c", boots: "#2a1a14", hat: "hair", hair: "#5a3420", skin: "#f2c4a4", tie: "#fbf3dc" } as Outfit,
  m5: { jacket: "#c9a46a", pants: "#c9a46a", boots: "#5a3420", hat: "hair", hair: "#3a2418", skin: "#a8714f", tie: "#2f8a4a" } as Outfit,
  m6: { jacket: "#2f9a9a", pants: "#2f9a9a", boots: "#2a1a14", hat: "hair", hair: "#8a5a34", skin: "#e2a882", tie: "#d8322f" } as Outfit,
};
/** the six charged men: which three stand in the dock, and which three walk out (S15) */
export const MEN = ["m1", "m2", "m3", "m4", "m5", "m6"] as const;
export const DOCK = ["m2", "m4", "m6"] as const;
export const OUTW = ["m2", "m4", "m6"] as const;
