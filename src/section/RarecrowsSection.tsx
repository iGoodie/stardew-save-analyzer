import { Objective } from "@src/component/Objective";
import { SummarySection } from "@src/component/SummarySection";
import { GameSave } from "@src/gamesave/GameSave";

import scarecrowPng from "@src/assets/icon/scarecrow.png";
import { sum, values } from "remeda";

import styles from "./RarecrowsSection.module.scss";
import { ImageObjective } from "@src/component/ImageObjective";
import { AssetRepository } from "@src/util/AssetRepository";
import { STARDEW_RARECROW_IDS } from "@src/const/StardewRarecrows";
import { StardewWiki } from "@src/util/StardewWiki";

interface Props {
  gameSave: GameSave;
}

const rarecrowSprites = new AssetRepository<{ default: string }>(
  import.meta.glob("../assets/sprite/scarecrow/*.png", {
    eager: true,
  }),
  "../assets/sprite/scarecrow/",
  ".png"
);

export const RarecrowSection = (props: Props) => {
  const rarecrowSocietyMissingFarmers = props.gameSave
    .getAllFarmers()
    .filter((farmer) => !farmer.rarecrowSocietyMailed);

  const allCollected =
    rarecrowSocietyMissingFarmers.length === 0 ||
    values(props.gameSave.rarecrowsPlaced).every((x) => x > 0);

  const totalPlaced = sum(values(props.gameSave.rarecrowsPlaced));

  return (
    <SummarySection
      sectionTitle="Rarecrow Society"
      collapsable
      versions={["v1.4 Introduced"]}
    >
      <div className={styles.objectives}>
        <Objective done icon={<img src={scarecrowPng} />}>
          In total, <strong>{totalPlaced}</strong> rarecrow(s) are placed all
          across the Valley.
        </Objective>
        <Objective done icon={<img src={scarecrowPng} />}>
          Placed{" "}
          <strong>
            {values(props.gameSave.rarecrowsPlaced).filter((x) => x > 0).length}
          </strong>{" "}
          of <strong>{STARDEW_RARECROW_IDS.length}</strong> different
          rarecrow(s) all across the Valley.
        </Objective>
      </div>

      <div className={styles.rarecrows}>
        <a target="_blank" href={StardewWiki.getLink("Scarecrow")}>
          <ImageObjective
            done={props.gameSave
              .getAllFarmers()
              .some((farmer) => farmer.craftedRecipes["Scarecrow"] > 0)}
            height={100}
            title="Scarecrow"
            src={rarecrowSprites.resolve("scarecrow")?.default ?? ""}
          />
        </a>

        <div className={styles.divider} />

        {STARDEW_RARECROW_IDS.map((rarecrowId, index) => (
          <a
            key={rarecrowId}
            target="_blank"
            href={StardewWiki.getLink("Scarecrow", "Rarecrows")}
          >
            <ImageObjective
              done={
                allCollected || props.gameSave.rarecrowsPlaced[rarecrowId] > 0
              }
              height={100}
              title={`Rarecrow #${index + 1}`}
              src={
                rarecrowSprites.resolve(`rarecrow_${index + 1}`)?.default ?? ""
              }
            />
          </a>
        ))}
      </div>

      <p className={styles.note}>
        <em>
          <strong>NOTE:</strong> Once every{" "}
          <a
            target="_blank"
            href={StardewWiki.getLink("Scarecrow", "Rarecrows")}
          >
            <strong>Rarecrow</strong>
          </a>{" "}
          is collected, at least one of each Rarecrow shall be placed down
          anywhere across the Valley (or on Ginger Island). Then, the next day,
          there will be <strong>approximately 90%</strong> chance to receive a
          mail from{" "}
          <a
            target="_blank"
            href={StardewWiki.getLink("Deluxe Scarecrow", "Letter")}
          >
            <strong>the Z. C. Rarecrow Society</strong>
          </a>{" "}
          rewarding you with the{" "}
          <a target="_blank" href={StardewWiki.getLink("Deluxe Scarecrow")}>
            <strong>Deluxe Scarecrow</strong>
          </a>
          .
        </em>
      </p>

      <div className={styles.objectives}>
        <Objective done={allCollected}>
          Every Rarecrow is collected.
          {!allCollected && (
            <>
              {" "}
              — Completed{" "}
              {
                values(props.gameSave.rarecrowsPlaced).filter((x) => x > 0)
                  .length
              }{" "}
              out of {STARDEW_RARECROW_IDS.length}
            </>
          )}
        </Objective>
        {props.gameSave.getAllFarmers().map((farmer) => (
          <Objective
            key={farmer.name}
            done={!rarecrowSocietyMissingFarmers.includes(farmer)}
          >
            <strong>{farmer.name}</strong> received the mail from{" "}
            <a
              target="_blank"
              href={StardewWiki.getLink("Deluxe Scarecrow", "Letter")}
            >
              <strong>Z.C. Rarecrow Society</strong>
            </a>
            .
          </Objective>
        ))}
      </div>
    </SummarySection>
  );
};