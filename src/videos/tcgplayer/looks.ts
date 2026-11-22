// The TCGplayer reel's cast looks (flat toon outfits). Generic cartoon people: no likenesses.
import { Outfit } from "../../engine/toon";
const grader = (skin: string, hair: string): Outfit => ({ jacket: "#3f6fb0", pants: "#2a2c33", boots: "#15131a", hat: "hair", hair, skin, chest: "UNION", chestCol: "#f4f1ea" });
const vip = (skin: string, hair: string, jacket: string): Outfit => ({ jacket, pants: "#1d1b22", boots: "#15131a", hat: "hair", hair, skin, tie: "#e2b23a", build: "stout", chest: "VIP", chestCol: "#e2b23a" });
export const LOOKS = {
  seller: { jacket: "#d9a23a", pants: "#3b3f52", boots: "#2a2c33", hat: "hair", hair: "#5a3b2a", skin: "#f2c4a4", glasses: true } as Outfit,
  rob: { jacket: "#26355e", pants: "#26355e", boots: "#15131a", hat: "hair", hair: "#a9adb5", skin: "#f2c8a8", tie: "#c23a32" } as Outfit,
  ron: { jacket: "#3a3d46", pants: "#3a3d46", boots: "#15131a", hat: "hair", hair: "#2a201a", skin: "#e8b896", tie: "#3f6fd8" } as Outfit,
  grader1: grader("#d9a07a", "#2a201a"),
  grader2: grader("#f2c4a4", "#8a5a34"),
  grader3: grader("#a8714f", "#15131a"),
  buyer: { jacket: "#7a3fb4", pants: "#3b3f52", boots: "#2a2c33", hat: "cap", cap: "#2f9a55", skin: "#e8b896" } as Outfit,
  owner: { jacket: "#b8322f", pants: "#2f4a6a", boots: "#3a2a20", hat: "cap", cap: "#1d1b22", skin: "#f2c4a4" } as Outfit,
  vip1: vip("#f2c4a4", "#15131a", "#1f2128"),
  vip2: vip("#d9a07a", "#5a3b2a", "#2a2c40"),
  vip3: vip("#e8b896", "#a9adb5", "#26253a"),
  vip4: vip("#a8714f", "#15131a", "#1f2128"),
};
