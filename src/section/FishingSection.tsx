import { capitalCase, snakeCase } from "case-anything";
import { entries, find, keys } from "lodash";
import { FarmerTag } from "../component/FarmerTag";
import { SummarySection } from "../component/SummarySection";
import { Fish, FishCategory, STARDEW_FISHES } from "../const/StardewFishes";
import { GameSave } from "../gamesave/GameSave";
import { AssetRepository } from "../util/AssetRepository";

import styles from "./FishingSection.module.scss";
import clsx from "clsx";
import { StardewWiki } from "../util/StardewWiki";
import { Fragment } from "react/jsx-runtime";
import { Achievement } from "../component/Achievement";
import { Objective } from "../component/Objective";
import fishPng from "../assets/sprite/skill/fishing.png";

interface Props {
  gameSave: GameSave;
}

const FISHES_BY_CATEGORIES = entries(STARDEW_FISHES).reduce(
  (lookup, [fishId, fish]) => {
    (fish.categories as (keyof typeof FishCategory)[]).forEach((category) => {
      if (!lookup[category]) lookup[category] = [];
      lookup[category].push({ id: fishId, ...fish });
    });
    return lookup;
  },
  {} as Record<FishCategory, (Fish & { id: string })[]>
);

console.log(FISHES_BY_CATEGORIES);
const skillSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/fish/*.png", { eager: true }),
  "../assets/sprite/fish/",
  ".png"
);

const backgroundSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/background/fishing/*.png", { eager: true }),
  "../assets/background/fishing/",
  ".png"
);

export const FishingSection = (props: Props) => {
  const farmers = props.gameSave
    .getAllFarmerNames()
    .map((farmerName) => props.gameSave.getFarmer(farmerName)!);

  return (
    <SummarySection>
      <h1>Fishing</h1>

      <div className={styles.farmers}>
        {farmers.map((farmer) => {
          const totalFish = farmer.caughtFish.reduce(
            (total, fish) => total + fish.amount,
            0
          );

          const caughtTypeCount = farmer.caughtFish.filter(
            (fish) => fish.amount > 0
          ).length;

          return (
            <div key={farmer.name} className={styles.farmer}>
              <FarmerTag farmer={farmer} />

              <Objective icon={<img width={20} src={fishPng} />} done>
                {farmer.name} has caught <strong>{totalFish}</strong> fish in
                total.
              </Objective>
              <Objective icon={<img width={20} src={fishPng} />} done>
                {farmer.name} has caught <strong>{caughtTypeCount}</strong>{" "}
                different fish in total.
              </Objective>

              <div className={styles.categories}>
                {keys(FishCategory).map((categoryId) => {
                  const fishes =
                    FISHES_BY_CATEGORIES[categoryId as FishCategory] ?? [];

                  return (
                    <Fragment key={categoryId}>
                      {categoryId === FishCategory.Legendary_2 && (
                        <em style={{ marginTop: 10 }}>
                          Following ones are only available during Qi's{" "}
                          <a
                            href={StardewWiki.getLink(
                              "Quests",
                              "Extended_Family"
                            )}
                          >
                            <strong>Extended Fish Family</strong>
                          </a>{" "}
                          Quest. They still get you new bobber styles though:
                        </em>
                      )}

                      <div
                        className={styles.category}
                        style={{
                          ["--background" as string]: `url(${
                            backgroundSprites.resolve(snakeCase(categoryId))
                              ?.default
                          })`,
                        }}
                      >
                        <a href={StardewWiki.getLink("Fish")} target="_blank">
                          <h1>{capitalCase(categoryId).replace(/_/g, " ")}</h1>
                        </a>

                        <div className={styles.fishes}>
                          {fishes.map((fish) => (
                            <a
                              key={fish.id}
                              href={StardewWiki.getLink(fish.name)}
                              target="_blank"
                            >
                              <div
                                className={clsx(
                                  styles.fish,
                                  (find(farmer.caughtFish, {
                                    fishId: fish.id,
                                  })?.amount ?? 0) > 0 && styles.caught
                                )}
                              >
                                <img
                                  width={35}
                                  title={`${fish.name}`}
                                  src={
                                    skillSprites.resolve(snakeCase(fish.name))
                                      ?.default
                                  }
                                />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>

              <Objective
                className={styles.objective}
                done={caughtTypeCount >= Object.keys(STARDEW_FISHES).length}
              >
                Every "Bobber Type" is unlocked.
                {caughtTypeCount < Object.keys(STARDEW_FISHES).length && (
                  <>
                    {" "}
                    — Completed {caughtTypeCount} out of{" "}
                    {Object.keys(STARDEW_FISHES).length}
                  </>
                )}
              </Objective>

              <Achievement
                title="Mother Catch"
                achieved={totalFish >= 100}
                description="catch 100 total fish"
              />

              <Achievement
                title="Fisherman"
                achieved={caughtTypeCount >= 10}
                description="catch 10 different fish"
              />
              <Achievement
                title="Ol' Mariner"
                achieved={caughtTypeCount >= 24}
                description="catch 24 different fish"
              />
              <Achievement
                title="Master Angler"
                achieved={caughtTypeCount >= Object.keys(STARDEW_FISHES).length}
                description="catch every fish"
              />
            </div>
          );
        })}
      </div>
    </SummarySection>
  );
};