import gsap from "gsap";
import createElement from "../functions/createElement";

class Leaderboard {
  currentSeason: string = "season9";
  playerElements: HTMLElement[] = [];
  seasonData: SeasonalData;
  totalMemberList: { [key: string]: SeasonalPlayerData } = {};
  top50List: SeasonalPlayerData[] = [];
  allMemberList: SeasonalPlayerData[] = [];
  static RoleColors = [
    "rgba(230, 230, 230, 1)",
    "rgba(0, 100, 255, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
  ];

  constructor(guildData: SeasonalData) {
    this.seasonData = guildData;
    let seasonListElem = document.querySelector("#seasonList");
    let playerListElem = document.querySelector("#playerList");

    /* #region Create all player data elements */
    for (let index = 0; index < 50; index++) {
      let elem = createElement(
        {
          type: "tr",
          id: `playerRow_${index}`,
          class: ["playerRow"],
          children: [
            {
              type: "td",
              class: ["playerRank"],
              innerText: index == 0 ? "👑" : `#${index + 1}`,
            },
            { type: "td", class: ["playerName"], children: [{ type: "p" }] },
            { type: "td", class: ["playerPoints"], children: [{ type: "p" }] },
          ],
        },
        playerListElem
      ) as HTMLElement;
      this.playerElements.push(elem);
    }
    /* #endregion */

    let entries = Object.entries(guildData);
    let entriesLenght = entries.length;
    let currentIndex = 0;

    for (const [season, data] of entries) {
      if (!this.currentSeason) {
        this.currentSeason = season;
      }
      let seasonBtn = createElement(
        {
          type: "button",
          id: season,
          class: ["seasonBtn"],
          innerText: "Season " + season.charAt(season.length - 1),
        },
        seasonListElem
      ) as HTMLButtonElement;
      seasonBtn.addEventListener("click", () => this.changeSeason(season));

      data.forEach((memberData) => {
        if (!this.totalMemberList.hasOwnProperty(memberData.name)) {
          this.totalMemberList[memberData.name] = { ...memberData };
        } else {
          this.totalMemberList[memberData.name].points += memberData.points;
          if (entriesLenght - 1 == currentIndex) {
            this.totalMemberList[memberData.name].role = memberData.role;
          }
        }
      });
      currentIndex++;
    }

    let totalMembers = Object.keys(this.totalMemberList).length;
    let totalPlayerElements = this.playerElements.length;

    if (totalMembers > this.playerElements.length) {
      for (let index = totalPlayerElements; index < totalMembers; index++) {
        let elem = createElement(
          {
            type: "tr",
            id: `playerRow_${index}`,
            class: ["playerRow"],
            children: [
              {
                type: "td",
                class: ["playerRank"],
                innerText: index == 0 ? "👑" : `#${index + 1}`,
              },
              { type: "td", class: ["playerName"], children: [{ type: "p" }] },
              {
                type: "td",
                class: ["playerPoints"],
                children: [{ type: "p" }],
              },
            ],
          },
          playerListElem
        ) as HTMLElement;
        this.playerElements.push(elem);
      }
    }

    let seasonBtn = createElement(
      {
        type: "button",
        id: "seasonAll",
        class: ["seasonBtn"],
        innerText: "Top 50",
      },
      seasonListElem
    ) as HTMLButtonElement;
    seasonBtn.addEventListener("click", () => this.changeSeason("Top 50"));

    let allSeasonBtn = createElement(
      {
        type: "button",
        id: "seasonAll",
        class: ["seasonBtn"],
        innerText: "All members",
      },
      seasonListElem
    ) as HTMLButtonElement;
    allSeasonBtn.addEventListener("click", () =>
      this.changeSeason("All members")
    );

    for (const [key, value] of Object.entries(this.totalMemberList)) {
      this.allMemberList.push(value);
      this.allMemberList.sort((a, b) => b.points - a.points);
    }

    this.top50List = this.allMemberList.slice(0, 50);

    this.updateLeaderboard();
  }

  updateLeaderboard() {
    if (!this.currentSeason) {
      throw Error("SEASON IS NOT SET!!!");
    }

    let seasonCaption = document.querySelector("#seasonCaption");
    if (seasonCaption && this.currentSeason != "Top 50" && this.currentSeason != "All members") {
      seasonCaption.innerHTML =
        "Currently showing for " +
        "Season " +
        this.currentSeason.charAt(this.currentSeason.length - 1);
    } else if (seasonCaption) {
      seasonCaption.innerHTML = `Currently showing for ${this.currentSeason}`;
    }

    this.playerElements.forEach((element, index) => {
      let playerNameElem = document.querySelector(
        "#" + element.id + " > .playerName > p"
      ) as HTMLElement;
      let playerPointsElem = document.querySelector(
        "#" + element.id + " > .playerPoints > p"
      ) as HTMLElement;

      if (!playerNameElem) {
        throw Error("ELEMENT IS MISSING");
      }
      if (!playerPointsElem) {
        throw Error("ELEMENT IS MISSING");
      }

      let playerData =
        this.currentSeason === "Top 50"
          ? this.top50List[index]
          : this.currentSeason === "All members"
          ? this.allMemberList[index]
          : this.seasonData[this.currentSeason][index];

      if (playerData) {
        element.style.display = "table-row";
        playerNameElem.innerHTML = playerData.name;
        gsap.fromTo(
          playerPointsElem,
          { color: "rgba(255,255,255,0)", x: 5 },
          { color: "rgba(255,255,255,1)", x: 0 }
        );
        playerPointsElem.innerHTML = String(playerData.points);

        let memberColor =
          Leaderboard.RoleColors[playerData.role] || Leaderboard.RoleColors[0];
        gsap.fromTo(
          playerNameElem,
          { color: memberColor.slice(memberColor.length - 3) + "0)", x: 5 },
          {
            duration: 0.25,
            x: 0,
            color: memberColor,
          }
        );
      } else {
        element.style.display = "none";
        playerNameElem.innerHTML = "";
        playerPointsElem.innerHTML = "";
        playerNameElem.style.color = Leaderboard.RoleColors[0];
      }
    });
  }

  changeSeason(newSeason: string) {
    if (this.currentSeason === newSeason) {
      return;
    }
    this.currentSeason = newSeason;
    this.updateLeaderboard();
  }
}

export default Leaderboard;
