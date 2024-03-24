import createElement from "../functions/createElement";
import CustomElement from "./CustomElement";
import PlayerRow from "./PlayerRow";

class Leaderboard {
  currentSeason: string = "season9";
  playerElements: PlayerRow[] = [];
  paginationElements: HTMLElement[] = [];
  seasonData: SeasonalData;
  totalMemberList: { [key: string]: SeasonalPlayerData } = {};
  allMemberList: SeasonalPlayerData[] = [];

  currentPage = 1;

  static RoleColors = [
    "rgba(230, 230, 230, 1)",
    "rgba(0, 100, 255, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
  ];

  constructor(guildData: SeasonalData) {
    this.seasonData = guildData;
    let seasonListElem = document.querySelector("#seasonList");
    let playerList1Elem = document.querySelector("#playerList1") as HTMLElement;
    let playerList2Elem = document.querySelector("#playerList2") as HTMLElement;
    let playerListPaginationsElement = document.querySelector("#playerListPaginations") as HTMLElement;

    /* #region Create all player data elements */
    for (let index = 0; index < 50; index++) {
      let parent = index < 25 ? playerList1Elem: playerList2Elem;
      let elem = new PlayerRow(parent, index);
      this.playerElements.push(elem);
    }
    /* #endregion */

    let entries = Object.entries(guildData);
    let entriesLenght = entries.length;
    let currentIndex = 0;

    let seasonButtonList = ["All Seasons"];

    for (const [season, data] of entries) {
      if (!this.currentSeason) {
        this.currentSeason = season;
      }
      seasonButtonList.unshift(season);

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

    seasonButtonList.forEach((season) => {
      let seasonBtn = createElement(
        {
          type: "button",
          id: season,
          class: ["seasonBtn", "col-auto"],
          innerText: season === "All Seasons" ? season : "Season " + season.charAt(season.length - 1),
        },
        seasonListElem
      ) as HTMLButtonElement;
      seasonBtn.addEventListener("click", () => this.changeSeason(season));
    });

    for (const [, value] of Object.entries(this.totalMemberList)) {
      this.allMemberList.push(value);
      this.allMemberList.sort((a, b) => b.points - a.points);
    }

    let totalPaginations = Math.ceil(this.allMemberList.length/50)

    for (let index = 0; index < totalPaginations; index++) {
      let paginationElement = new CustomElement({type: "div", innerText: String(1 + ((index)*50)) + " - " + String(((index+1)*50))}, playerListPaginationsElement);
      paginationElement.element.addEventListener("click", ()=>{
        if(this.currentPage === index+1){return}
        this.currentPage = index+1
        this.updateLeaderboard()
      })
      this.paginationElements.push(paginationElement.element)
    }

    this.updateLeaderboard();
  }

  updateLeaderboard() {
    if (!this.currentSeason) {
      throw Error("SEASON IS NOT SET!!!");
    }

    let seasonCaption = document.querySelector("#seasonCaption");
    if (seasonCaption && this.currentSeason != "All Seasons") {
      seasonCaption.innerHTML =
        "Season " + this.currentSeason.charAt(this.currentSeason.length - 1);
    } else if (seasonCaption) {
      seasonCaption.innerHTML = `${this.currentSeason}`;
    }

    /* UPDATE PAGINATIONS */

    this.paginationElements.forEach((element, index)=>{
      if(this.currentSeason === "All Seasons") {
        element.style.display = "block"
      } else {
        element.style.display = "none"
      }

      if(index+1 === this.currentPage) {
        element.classList.toggle("paginationActive", true)
      } else {
        element.classList.toggle("paginationActive", false)
      }
    })

    this.playerElements.forEach((element, index) => {
      let newRank = index+((this.currentPage-1)*50)+1
      let playerData = this.currentSeason === "All Seasons" ? this.allMemberList[index+((this.currentPage - 1)*50)] : this.seasonData[this.currentSeason][index];

      if (playerData) {
        element.changePlayer(playerData, newRank);
      } else {
        element.clearRow(newRank);
      }
    });
  }

  changeSeason(newSeason: string) {
    if (this.currentSeason === newSeason) {
      return;
    }
    this.currentPage = 1
    this.currentSeason = newSeason;
    this.updateLeaderboard();
  }
}

export default Leaderboard;
