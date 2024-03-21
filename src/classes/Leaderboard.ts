import gsap from "gsap";
import createElement from "../functions/createElement";

class Leaderboard {
  currentSeason: string = "season4";
  playerElements: HTMLElement[] = [];
  seasonData: SeasonalData;
  totalMemberList: { [key: string]: SeasonalPlayerData } = {};
  top50List: SeasonalPlayerData[] = [];
  static RoleColors = [
    "rgba(230, 230, 230, 1)",
    "rgba(0, 0, 255, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
  ];

  constructor(guildData: SeasonalData) {
    this.seasonData = guildData;
    let seasonListElem = document.querySelector("#seasonList");
    let playerListElem = document.querySelector("#playerList");

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
            { type: "td", class: ["playerName"] },
            { type: "td", class: ["playerPoints"] },
          ],
        },
        playerListElem
      ) as HTMLElement;
      this.playerElements.push(elem);
    }

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

    for (const [key, value] of Object.entries(this.totalMemberList)) {
      this.top50List.push(value);
      this.top50List.sort((a, b) => b.points - a.points);
    }
    console.log(this.top50List);

    this.updateLeaderboard();
  }

  updateLeaderboard() {
    if (!this.currentSeason) {
      throw Error("SEASON IS NOT SET!!!");
    }

    let seasonCaption = document.querySelector("#seasonCaption");
    if (seasonCaption && this.currentSeason != "Top 50") {
      seasonCaption.innerHTML =
        "Currently showing for " +
        "Season " +
        this.currentSeason.charAt(this.currentSeason.length - 1);
    } else if (seasonCaption) {
      seasonCaption.innerHTML = "Currently showing for Top 50";
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

      let playerData =
        this.currentSeason === "Top 50"
          ? this.top50List[index]
          : this.seasonData[this.currentSeason][index];

      if (playerData) {
        playerNameElem.innerHTML = playerData.name;
        gsap.fromTo(
          playerPointsElem,
          { color: "rgba(255,255,255,0)" },
          { color: "rgba(255,255,255,1)" }
        );
        playerPointsElem.innerHTML = String(playerData.points);
        gsap.fromTo(
          playerNameElem,
          { color: "rgba(0,0,0,0)" },
          {
            duration: 0.25,
            color:
              Leaderboard.RoleColors[playerData.role] ||
              Leaderboard.RoleColors[0],
          }
        );
      } else {
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
