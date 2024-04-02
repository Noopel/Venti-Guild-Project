import createElement from "../functions/createElement";
import CustomElement from "./CustomElement";
import Player from "./Player";
import PlayerRow from "./PlayerRow";

class Leaderboard {
  currentSeason: string = "All Seasons";
  playerElements: PlayerRow[] = [];
  paginationElements: HTMLElement[] = [];
  seasonDataList: { [key: string]: SeasonalPlayerData[] };
  memberList: Player[] = [];

  leaderboardContainer: HTMLElement;

  currentPage = 1;

  constructor(ventiMemberList: compiledVentiGuildData) {
    this.leaderboardContainer = document.querySelector("#leaderboardContainer") as HTMLElement;
    let seasonListElem = document.querySelector("#seasonList");
    let playerList1Elem = document.querySelector("#playerList1") as HTMLElement;
    let playerList2Elem = document.querySelector("#playerList2") as HTMLElement;
    let playerListPaginationsElement = document.querySelector("#playerListPaginations") as HTMLElement;

    /* #region Create all player data elements */
    for (let index = 0; index < 50; index++) {
      let parent = index < 25 ? playerList1Elem : playerList2Elem;
      let elem = new PlayerRow(parent, index);
      this.playerElements.push(elem);
    }
    /* #endregion */

    ventiMemberList.memberList.forEach((memberData)=>{
      this.memberList.push(new Player(memberData))
    })

    this.seasonDataList = ventiMemberList.seasonList

    let seasonButtonList = ["All Seasons"];

    let seasonEntries = Object.entries(ventiMemberList.seasonList)
    seasonEntries.forEach((seasonData)=>{
      seasonButtonList.push(seasonData[0])
    })

    seasonButtonList.forEach((season) => {
      let seasonBtn = createElement(
        {
          type: "button",
          id: season,
          class: ["seasonBtn", "col-auto"],
          innerText: season === "All Seasons" ? season : "Season " + season.slice(6),
        },
        seasonListElem
      ) as HTMLButtonElement;
      seasonBtn.addEventListener("click", () => this.changeSeason(season));
    });

    let totalPaginations = Math.ceil(this.memberList.length / 50);

    for (let index = 0; index < totalPaginations; index++) {
      let paginationElement = new CustomElement(
        { type: "div", innerText: String(1 + index * 50) + " - " + String((index + 1) * 50) },
        playerListPaginationsElement
      );
      paginationElement.element.addEventListener("click", () => {
        if (this.currentPage === index + 1) {
          return;
        }
        this.currentPage = index + 1;
        this.updateLeaderboard();
      });
      this.paginationElements.push(paginationElement.element);
    }

    this.updateLeaderboard();
  }

  set visible(IsVisible: boolean) {
    if (IsVisible) {
      this.updateLeaderboard();
      this.leaderboardContainer.style.display = "flex";
    } else {
      this.leaderboardContainer.style.display = "none";
    }
  }

  updateLeaderboard() {
    if (!this.currentSeason) {
      throw Error("SEASON IS NOT SET!!!");
    }

    let seasonCaption = document.querySelector("#seasonCaption");
    if (seasonCaption && this.currentSeason != "All Seasons") {
      seasonCaption.innerHTML = "Season " + this.currentSeason.slice(6);
    } else if (seasonCaption) {
      seasonCaption.innerHTML = `${this.currentSeason}`;
    }

    /* UPDATE PAGINATIONS */

    this.paginationElements.forEach((element, index) => {
      if (this.currentSeason === "All Seasons") {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }

      if (index + 1 === this.currentPage) {
        element.classList.toggle("paginationActive", true);
      } else {
        element.classList.toggle("paginationActive", false);
      }
    });

    /* FIX LATER WITH NEW PLAYER CLASS */
    this.playerElements.forEach((element, index) => {
      let newRank = index + (this.currentPage - 1) * 50 + 1;
      let playerData;

      if (this.currentSeason === "All Seasons") {
        if (this.memberList[index + (this.currentPage - 1) * 50]) {
          playerData = this.memberList[index + (this.currentPage - 1) * 50].getForAllSeasons();
        }
      } else {
        playerData = this.seasonDataList[this.currentSeason][index];
      }

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
    this.currentPage = 1;
    this.currentSeason = newSeason;
    this.updateLeaderboard();
  }
}

export default Leaderboard;
