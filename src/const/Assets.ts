import { AssetRepository } from "@src/util/AssetRepository";

export const FISH_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/sprite/fish/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/fish/",
  postfix: ".png",
});

export const FISH_COVER_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/cover/fishing/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/cover/fishing/",
  postfix: ".png",
});

export const FARM_BUILDING_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/sprite/building/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/building/",
  postfix: ".png",
});

export const FARM_ANIMALS_SPRITES = new AssetRepository({
  repository: import.meta.glob<string>("../assets/sprite/animal/*.png", {
    import: "default",
    eager: true,
  }),
  prefix: "../assets/sprite/animal/",
  postfix: ".png",
});
