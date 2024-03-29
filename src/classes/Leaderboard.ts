import createElement from "../functions/createElement";
import CustomElement from "./CustomElement";
import Player from "./Player";
import PlayerRow from "./PlayerRow";
import PlayerSeasonRow from "./PlayerSeasonRow";

class Leaderboard {
  currentSeason: string = "All Seasons";
  playerElements: PlayerRow[] = [];
  playerInfoElements: PlayerSeasonRow[] = [];
  paginationElements: HTMLElement[] = [];
  seasonDataList: { [key: string]: SeasonalPlayerData[] } = {};
  memberList: Player[] = [];

  leaderboardContainer: HTMLElement;
  playerInfoContainer: HTMLElement;

  currentPage = 1;
  mostRecentSeason: string = "";

  static RoleColors = [
    "rgba(230, 230, 230, 1)",
    "rgba(0, 100, 255, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
    "rgba(200, 200, 200, 1)",
  ];

  static RoleConvert = [
    "Member",
    "Captain",
    "Elite",
    "Leader",
    "Previous Member"
  ]

  constructor(ventiMemberList: VentiMemberList) {
    this.leaderboardContainer = document.querySelector("#leaderboardContainer") as HTMLElement;
    this.playerInfoContainer = document.querySelector("#playerInfoContainer") as HTMLElement;
    let seasonListElem = document.querySelector("#seasonList");
    let playerList1Elem = document.querySelector("#playerList1") as HTMLElement;
    let playerList2Elem = document.querySelector("#playerList2") as HTMLElement;
    let playerInfoSeasonList = document.querySelector("#playerInfoSeasonList") as HTMLElement;
    let playerListPaginationsElement = document.querySelector("#playerListPaginations") as HTMLElement;

    this.leaderboardContainer.style.display = "flex";

    /* #region Create all player data elements */
    for (let index = 0; index < 50; index++) {
      let parent = index < 25 ? playerList1Elem : playerList2Elem;
      let elem = new PlayerRow(parent, index);
      elem.playerBtn.addEventListener("click", () => this.openPlayerInfo(elem.key));
      this.playerElements.push(elem);
    }
    /* #endregion */

    let seasonButtonList = ["All Seasons"];

    ventiMemberList.forEach((memberData) => {
      let playerObj = new Player(memberData);
      this.memberList.push(playerObj);

      for (const [season] of Object.entries(playerObj.seasonList)) {
        if (!this.seasonDataList[season]) {
          this.seasonDataList[season] = [];
          seasonButtonList.push(season);
        }
        this.seasonDataList[season].push(playerObj.getSeasonData(season) as SeasonalPlayerData);
      }
    });

    let seasonEntries = Object.entries(this.seasonDataList)
    let count = 0

    for (const [season] of seasonEntries) {
      this.seasonDataList[season].sort((a, b) => {
        return b.points - a.points;
      });

      if(count === seasonEntries.length-1) {
        this.mostRecentSeason = season
      }
      count++
    } 
    
    this.memberList.forEach((playerObj)=>{
      if(!playerObj.seasonList[this.mostRecentSeason]) {playerObj.latestRole = 0}
    })

    for (let index = 0; index < seasonButtonList.length - 1; index++) {
      let parent = playerInfoSeasonList;
      let elem = new PlayerSeasonRow(parent);
      this.playerInfoElements.push(elem);
    }

    let returnBtn = document.querySelector("#returnBtn") as HTMLButtonElement;
    if(returnBtn){
      returnBtn.addEventListener("click", ()=>this.openLeaderboards())
    }

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

  openPlayerInfo(key: string | undefined) {
    if (key) {
      let playerData = this.memberList.find((player) => {
        return player.id ? key === "id => " + String(player.id) : player.name === key;
      });

      let plrNameElem = document.querySelector("#plrInfoName") as HTMLElement;
      let plrPointsElem = document.querySelector("#plrInfoPoints") as HTMLElement;
      let plrRoleElem = document.querySelector("#plrInfoRole") as HTMLElement;

      if (playerData) {
        let entries = Object.entries(playerData.seasonList);

        let latestRole

        if(!playerData.seasonList[this.mostRecentSeason]){
          latestRole = 4
        } else {
          latestRole = playerData.latestRole
        }

        if(plrNameElem) {
          plrNameElem.innerHTML = playerData.id ? playerData.name + ` <span class='fst-italic text-white opacity-50' title="username = ${playerData.username}, userId = ${playerData.id}">?</span>` : playerData.name;;
          plrNameElem.style.color = Leaderboard.RoleColors[latestRole] || Leaderboard.RoleColors[0]
        }

        let latestRoleColor = Leaderboard.RoleConvert[latestRole]

        plrPointsElem ? plrPointsElem.innerHTML = "Total points earned: " + String(playerData.totalPoints) : undefined;
        plrRoleElem ? plrRoleElem.innerHTML = "Latest Role: " + latestRoleColor : undefined;

        this.playerInfoElements.forEach((plrRowElem, index) => {
          if (entries[index]) {
            plrRowElem.changeSeason(entries[index][0], entries[index][1].points, Leaderboard.RoleConvert[entries[index][1].role]);
          } else {
            plrRowElem.clearRow();
          }
        });

        this.leaderboardContainer.style.display = "none";
        this.playerInfoContainer.style.display = "flex";
      } else {
        console.error("NO DATA WAS FOUND FOR KEY: ", key);
      }
    }
  }

  openLeaderboards() {
    this.playerInfoContainer.style.display = "none";
    this.updateLeaderboard();
    this.leaderboardContainer.style.display = "flex";
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
