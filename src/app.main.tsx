import { lowerCase } from "case-anything";
import { entries } from "lodash";
import "./App.css";
import xml from "./assets/Kaktus_372348215.xml";
import femalePng from "./assets/icon/female.png";
import malePng from "./assets/icon/male.png";
import stardropGif from "./assets/stardrop.gif";
import stardropPng from "./assets/stardrop.png";
import { Achievement } from "./component/Achievement";
import {
  FishCategory,
  STARDEW_FISH_CATEGORIES
} from "./const/StardewFishes";
import { MoneySummarySection } from "./section/MoneySummarySection";
import { SkillsSection } from "./section/SkillsSection";
import "./style/style.scss";
import { GameSave } from "./util/GameSave";

const farmTypes = import.meta.glob("./assets/farm/*.png", {
  eager: true,
});

const specialOrderNpcs = import.meta.glob("./assets/special-order/*.png", {
  eager: true,
});

const fishSprites = import.meta.glob("./assets/fish/*.png", {
  eager: true,
});

function App() {
  console.log(xml.SaveGame);

  const gameSave = new GameSave(xml.SaveGame);
  const farmSummary = gameSave.getFarmSummary();
  const specialOrders = gameSave.getSpecialOrders();
  const farmerNames = gameSave.getAllFarmerNames();

  return (
    <main>
      <section id="farm-summary">
        <h1 style={{ fontSize: 24 }}>Summary</h1>
        <ul>
          <li>
            {farmSummary.farmName} Farm (
            <img
              width={20}
              style={{}}
              src={
                // @ts-ignore
                farmTypes[
                  `./assets/farm/${lowerCase(farmSummary.farmType).replace(
                    /\s+/g,
                    "-"
                  )}.png`
                ].default
              }
            />{" "}
            {farmSummary.farmType})
          </li>
          <li>
            Farmer:
            <img
              alt="Farmer Gender"
              title={farmSummary.player.gender}
              src={farmSummary.player.gender === "Male" ? malePng : femalePng}
            />{" "}
            {farmSummary.player.name}
          </li>
          <li>
            Farmhand(s):{" "}
            {farmSummary.farmhands.map((farmer, index) => (
              <>
                <img
                  alt="Farmer Gender"
                  title={farmer.gender}
                  src={farmer.gender === "Male" ? malePng : femalePng}
                />{" "}
                {farmer.name}
                {index !== farmSummary.farmhands.length - 1 && <>, </>}
              </>
            ))}
          </li>
          <li>
            Day {farmSummary.currentDate.day} of{" "}
            {farmSummary.currentDate.season}, Year{" "}
            {farmSummary.currentDate.year}
          </li>
          <li>Played for {farmSummary.playtime}ms</li>
          <li>Game Version {farmSummary.gameVersion}</li>
        </ul>
      </section>

      <hr />

      <MoneySummarySection gameSave={gameSave} />

      <hr />

      <SkillsSection gameSave={gameSave} />

      <hr />

      <section id="special-orders">
        <h1 style={{ fontSize: 24 }}>Special Orders</h1>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)" }}
        >
          {specialOrders.map((order) => (
            <a href={order.wiki} target="_blank">
              <img
                width={50}
                title={order.title}
                style={{
                  filter: order.completed ? "" : "brightness(0.5)",
                  opacity: order.completed ? 1 : 0.2,
                }}
                src={
                  // @ts-ignore
                  specialOrderNpcs[`./assets/special-order/${order.npc}.png`]
                    .default
                }
              />
            </a>
          ))}
        </div>

        <Achievement
          title={"Complete all Special Orders"}
          achieved={specialOrders.every((order) => order.completed)}
        >
          {" "}
          - ({specialOrders.filter((order) => order.completed).length}/
          {specialOrders.length} Done)
        </Achievement>
      </section>

      <hr />

      <section id="stardrops">
        <h1 style={{ fontSize: 24 }}>Stardrops</h1>

        <div
          style={{
            display: "grid",
            gap: 50,
            gridTemplateColumns: `repeat(${farmerNames.length}, 1fr)`,
          }}
        >
          {farmerNames.map((farmerName) => {
            const stardrops = gameSave.getStardrops(farmerName)!;

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <h2 style={{ fontSize: 12 }}>
                  {farmerName} - (
                  {stardrops.filter((stardrop) => stardrop.gathered).length}/
                  {stardrops.length})
                </h2>

                {stardrops.map((stardrop, index) => (
                  <div
                    style={{ display: "flex", gap: 5, alignItems: "center" }}
                  >
                    <a
                      href="https://stardewvalleywiki.com/Stardrop#Locations"
                      target="_blank"
                    >
                      <img
                        width={35}
                        src={stardrop.gathered ? stardropGif : stardropPng}
                        title={`Stardrop #${index + 1}`}
                        style={{
                          filter: stardrop.gathered ? "" : "brightness(0.5)",
                          opacity: stardrop.gathered ? 1 : 0.2,
                        }}
                      />
                    </a>
                    {stardrop.description}
                  </div>
                ))}

                <div style={{ marginTop: 10 }}>
                  <Achievement
                    title="Mystery Of The Stardrops"
                    description="Gather every Stardrop"
                    achieved={stardrops.every((stardrop) => stardrop.gathered)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <hr />

      <section id="fishing">
        <h1 style={{ fontSize: 24 }}>Fishing</h1>

        <div
          style={{
            display: "grid",
            gap: 50,
            gridTemplateColumns: `repeat(${farmerNames.length}, 1fr)`,
          }}
        >
          {farmerNames.map((farmerName) => {
            const caughtFishes = gameSave.getCaughtFishes(farmerName)!;

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <h2 style={{ fontSize: 12 }}>{farmerName}</h2>

                {entries(caughtFishes).map(([categoryName, fishes]) => {
                  return (
                    <div
                      style={{
                        background: "#604620",
                        borderRadius: 5,
                        padding: "0 10px",
                        display: "grid",
                        gap: 10,
                        gridTemplateColumns: "50px 1fr",
                      }}
                    >
                      <h1
                        style={{
                          fontSize: 11,
                          color:
                            STARDEW_FISH_CATEGORIES[
                              categoryName as FishCategory
                            ].accentColor,
                        }}
                      >
                        {categoryName}
                      </h1>

                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {fishes.map((fish) => (
                          <div>
                            <img
                              width={34}
                              alt="Fish"
                              title={fish.name}
                              src={
                                // @ts-ignore
                                fishSprites[
                                  `./assets/fish/${lowerCase(fish.name).replace(
                                    /\s+/g,
                                    "_"
                                  )}.png`
                                  // @ts-ignore
                                ]?.default ?? ""
                              }
                              style={{
                                filter:
                                  fish.caught !== 0 ? "" : "brightness(0)",
                                opacity: fish.caught !== 0 ? 1 : 0.2,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>

      <footer style={{ height: 100 }}></footer>
    </main>
  );
}

export default App;
