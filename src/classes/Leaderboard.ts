import PlayerRow from "./PlayerRow";
import CreateElement from "./CreateElement";

class Leaderboard {
  currentSeason: string = "season4";
  playerElements: PlayerRow[] = [];
  seasonData: SeasonalData;
  totalMemberList: { [key: string]: SeasonalPlayerData } = {};
  top50List: SeasonalPlayerData[] = [];
  allMemberList: SeasonalPlayerData[] = [];

  constructor(guildData: SeasonalData) {
    this.seasonData = guildData;
    let seasonListElem = document.querySelector("#seasonList");
    let playerListElem = document.querySelector("#playerList") as HTMLElement;

    if (!playerListElem) {
      return;
    }

    let entries = Object.entries(guildData);
    let entriesLenght = entries.length;
    let currentIndex = 0;

    let seasonList = ["Top 50", "All members"];

    for (const [season, data] of entries) {
      if (!this.currentSeason) {
        this.currentSeason = season;
      }
      seasonList.unshift(season);

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

    /* Create buttons for each season */
    seasonList.forEach((seasonName: string) => {
      let elemInfo: ElementInfo = {
        type: "button",
        class: ["seasonBtn"],
        id: seasonName,
        innerText: ["Top 50", "All members"].find((otherSeason) => {
          return seasonName === otherSeason;
        })
          ? seasonName
          : "Season " + seasonName.charAt(seasonName.length - 1),
      };

      let seasonBtn = new CreateElement(elemInfo, seasonListElem);
      seasonBtn.element.addEventListener("click", () => this.changeSeason(seasonName));
    });

    let totalMembers = Object.keys(this.totalMemberList).length;
    let totalPlayerElements = this.playerElements.length;

    if (totalMembers > this.playerElements.length) {
      for (let index = totalPlayerElements; index < totalMembers; index++) {
        let elem = new PlayerRow(playerListElem, index);
        this.playerElements.push(elem);
      }
    }

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
      let playerData =
        this.currentSeason === "Top 50"
          ? this.top50List[index]
          : this.currentSeason === "All members"
          ? this.allMemberList[index]
          : this.seasonData[this.currentSeason][index];

      if (playerData) {
        element.changePlayer(playerData);
      } else {
        element.clearRow();
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
