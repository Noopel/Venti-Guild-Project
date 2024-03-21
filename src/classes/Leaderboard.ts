import createElement from "../functions/createElement";

class Leaderboard {
  currentSeason: string = "season4";
  playerElements: HTMLElement[] = [];
  seasonData: seasonData;
  static RoleColors = [
    "rgb(230, 230, 230)",
    "rgb(0, 0, 255)",
    "rgb(255, 0, 255)",
    "rgb(255, 255, 0)",
  ];

  constructor(guildData: seasonData) {
    this.seasonData = guildData;
    let seasonListElem = document.querySelector("#seasonList");
    let playerListElem = document.querySelector("#playerList");

    createElement(
      {
        type: "article",
        id: `playerInit`,
        class: ["playerRow", "row"],
        children: [
          {
            type: "section",
            id: "playerRank",
            class: ["col-auto"],
            innerText: "#",
          },
          {
            type: "section",
            id: "playerName",
            class: ["col-auto"],
            innerText: "Name",
          },
          {
            type: "section",
            id: "playerPoints",
            class: ["playerPoints", "col-auto"],
            innerText: "Points",
          },
        ],
      },
      playerListElem
    ) as HTMLElement;

    for (let index = 0; index < 50; index++) {
      let elem = createElement(
        {
          type: "article",
          id: `playerRow_${index}`,
          class: ["playerRow", "row"],
          children: [
            {
              type: "section",
              class: ["playerRank", "col-auto"],
              innerText: `#${index + 1}`,
            },
            { type: "section", class: ["playerName", "col-auto"] },
            { type: "section", class: ["playerPoints", "col-auto"] },
          ],
        },
        playerListElem
      ) as HTMLElement;
      this.playerElements.push(elem);
    }

    for (const [season] of Object.entries(guildData)) {
      if (!this.currentSeason) {
        this.currentSeason = season;
      }
      let seasonBtn = createElement(
        { type: "button", id: season, class: ["seasonBtn"], innerText: season },
        seasonListElem
      ) as HTMLButtonElement;
      seasonBtn.addEventListener("click", () => this.changeSeason(season));
    }

    this.updateLeaderboard();
  }

  updateLeaderboard() {
    if (!this.currentSeason) {
      throw Error("SEASON IS NOT SET!!!");
    }

    this.playerElements.forEach((element, index) => {
      let playerNameElem = document.querySelector(
        "#" + element.id + " > .playerName"
      ) as HTMLElement;
      let playerPointsElem = document.querySelector(
        "#" + element.id + " > .playerPoints"
      ) as HTMLElement;

      if (!playerNameElem) {
        throw Error("ELEMENT IS MISSING");
      }
      if (!playerPointsElem) {
        throw Error("ELEMENT IS MISSING");
      }

      let playerData = this.seasonData[this.currentSeason][index];

      if (playerData) {
        playerNameElem.innerHTML = playerData.name;
        playerPointsElem.innerHTML = String(playerData.points);
        playerNameElem.style.color =
          Leaderboard.RoleColors[playerData.role] || Leaderboard.RoleColors[0];
      } else {
        playerNameElem.innerHTML = "";
        playerPointsElem.innerHTML = "";
        playerNameElem.style.color = Leaderboard.RoleColors[0];
      }
    });
  }

  changeSeason(newSeason: string) {
    if (this.currentSeason !== newSeason) {
      this.currentSeason = newSeason;
    }
    this.updateLeaderboard();
  }
}

export default Leaderboard;
