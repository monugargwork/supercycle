// The Mira Mesa reel's cast looks (flat toon outfits). Generic cartoon people: no likenesses (the father and daughter are not drawn
// after the real family; the thief was never described). Bright palette (quality bar): no greys, no near-black navy.
import { Outfit } from "../../engine/toon";
export const LOOKS = {
  dad: { jacket: "#3f78d8", pants: "#c9a26a", boots: "#6a3f22", hat: "cap", cap: "#d8322f", skin: "#e8b48e", glasses: true, chest: "MM", chestCol: "#ffffff" } as Outfit,
  girl: { jacket: "#f2c23a", pants: "#3f6fc4", boots: "#d8322f", hat: "hair", hair: "#3a2418", skin: "#efbe98", build: "kid" } as Outfit,
  stranger: { jacket: "#b8323f", pants: "#3f6fc4", boots: "#f4f1ea", hat: "cap", cap: "#2f5fb4", skin: "#e2a882" } as Outfit,
  woman: { jacket: "#d8322f", pants: "#2f4a8a", boots: "#5a3420", hat: "hair", hair: "#2a1a14", skin: "#e8b896" } as Outfit,
  cop: { jacket: "#8fc4ec", pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f4a8a", skin: "#c98a62", badge: "#f2c23a", tie: "#2f4a8a" } as Outfit,
  guard: { jacket: "#f2d23a", pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f4a8a", skin: "#a8714f", chest: "SECURITY", chestCol: "#1d1b22", chestFit: true } as Outfit,
  mum: { jacket: "#f28ab0", pants: "#f4f1ea", boots: "#d8322f", hat: "hair", hair: "#8a5a34", skin: "#f2c8a8" } as Outfit,
  dad2: { jacket: "#4fb0e8", pants: "#f2e6cc", boots: "#6a3f22", hat: "hair", hair: "#3a2418", skin: "#e2a882", shades: true } as Outfit,
  kid2: { jacket: "#2fae5a", pants: "#3f6fc4", boots: "#f4f1ea", hat: "cap", cap: "#f2a33a", skin: "#f2c4a4", build: "kid" } as Outfit,
  stranger2: { jacket: "#f2a33a", pants: "#3f6fc4", boots: "#f4f1ea", hat: "hair", hair: "#5a3420", skin: "#c98a62", shades: true } as Outfit,
  v1: { jacket: "#2f9a9a", pants: "#5a3f2a", boots: "#2a1a14", hat: "hair", hair: "#8a5a34", skin: "#f2c8a8", glasses: true } as Outfit,
  v2: { jacket: "#f2a33a", pants: "#2f4a8a", boots: "#2a1a14", hat: "cap", cap: "#2f9a55", skin: "#a8714f" } as Outfit,
  v3: { jacket: "#2f9a55", pants: "#3f6fc4", boots: "#f4f1ea", hat: "hair", hair: "#2a1a14", skin: "#e8b896" } as Outfit,
  v4: { jacket: "#e85a9a", pants: "#2f4a8a", boots: "#5a3420", hat: "hair", hair: "#5a3420", skin: "#f2c8a8" } as Outfit,
  v5: { jacket: "#4fb0e8", pants: "#3b4a8a", boots: "#f4f1ea", hat: "cap", cap: "#f2c23a", skin: "#a8714f" } as Outfit,
  v6: { jacket: "#f2785a", pants: "#2f4a8a", boots: "#2a1a14", hat: "hair", hair: "#3a2418", skin: "#e2a882" } as Outfit,
};
