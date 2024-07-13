
import CustomElement from "./CustomClasses/CustomElement";
import Player from "./Player";
import PlayerRow from "./PlayerRow";
import gsap from "gsap";

class Leaderboard {
  currentSeason: string = "All Seasons";
  playerElements: PlayerRow[] = [];
  paginationElements: HTMLElement[] = [];
  seasonButtonElements: CustomElement[] = [];
  seasonDataList: { [key: string]: SeasonalPlayerData[] };
  memberList: Player[] = [];
  onlyMembersList: Player[] = [];

  leaderboardContainer: HTMLElement;

  paginationList: HTMLElement;
  paginationState = false;

  showNonMembers: boolean = false;

  currentPage = 1;

  constructor(ventiMemberList: compiledVentiGuildData) {
    this.leaderboardContainer = document.querySelector("#leaderboardContainer") as HTMLElement;
    let seasonListElem = document.querySelector("#seasonList") as HTMLElement;
    let playerList1Elem = document.querySelector("#playerList1") as HTMLElement;
    let playerList2Elem = document.querySelector("#playerList2") as HTMLElement;
    let playerListPaginationsElement = document.querySelector("#playerListPaginations") as HTMLElement;
    let showNonMembersCheckbox = document.querySelector("#nonMembersCheckbox") as HTMLInputElement;

    //Setup checkbox
    showNonMembersCheckbox.addEventListener("click", (e) => {
      const checkbox = e.target as HTMLInputElement;
      this.showNonMembers = checkbox.checked
      console.log(this.currentSeason)
      if(this.currentSeason === "All Seasons") {
        this.currentPage = 1
        this.updateLeaderboard()
      }
    })

    this.paginationList = playerListPaginationsElement;

    /* #region Create all player data elements */
    for (let index = 0; index < 50; index++) {
      let parent = index < 25 ? playerList1Elem : playerList2Elem;
      let elem = new PlayerRow(parent, index);
      this.playerElements.push(elem);
    }
    /* #endregion */

    ventiMemberList.memberList.forEach((memberData)=>{
      const playerObject = new Player(memberData)
      this.memberList.push(playerObject)
      if(memberData.role !== 0) {
        this.onlyMembersList.push(playerObject)
      }
    })

    this.seasonDataList = ventiMemberList.seasonList
    console.log(this.seasonDataList)
    let seasonButtonList = ["All Seasons"];

    //Getting all season titles into an array for buttons
    let seasonEntries = Object.entries(ventiMemberList.seasonList)
    seasonEntries.forEach((seasonData)=>{
      seasonButtonList.push(seasonData[0])
    })

    seasonButtonList.forEach((season) => {
      let seasonBtn = new CustomElement(
        {
          type: "button",
          id: season,
          class: ["seasonBtn", "col-auto"],
          innerText: season === "All Seasons" ? season : "Season " + season.slice(6),
        },
        seasonListElem
      );
      seasonBtn.userdata["season"] = season
      seasonBtn.element.addEventListener("click", () => this.changeSeason(season));
      this.seasonButtonElements.push(seasonBtn)
    });

    let totalPaginations = Math.ceil(this.memberList.length / 50);

    for (let index = 0; index < totalPaginations; index++) {
      let paginationElement = new CustomElement(
        { type: "div", class: ["paginationDisabled"], innerText: String(1 + index * 50) + " - " + String((index + 1) * 50) },
        playerListPaginationsElement
      );
      paginationElement.setStyle("opacity", "0")
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

/*     let seasonCaption = document.querySelector("#seasonCaption");
    if (seasonCaption && this.currentSeason != "All Seasons") {
      seasonCaption.innerHTML = "Season " + this.currentSeason.slice(6);
    } else if (seasonCaption) {
      seasonCaption.innerHTML = `${this.currentSeason}`;
    } */

    /* UPDATE PAGINATIONS */
    if(this.currentSeason === "All Seasons" && this.paginationState === false && this.showNonMembers) {
      this.paginationState = true;
      gsap.fromTo(this.paginationList, {marginBottom: "-3rem"}, {marginBottom: "1rem", duration: 0.2})
      this.paginationElements.forEach((element)=>{
        element.classList.toggle("paginationDisabled", false)
        gsap.fromTo(element, {opacity: 0,}, {opacity: 1, delay: 0.1, duration: 0.1})
      })
    } else if (this.currentSeason !== "All Seasons" && this.paginationState === true || this.currentSeason === "All Seasons" && this.paginationState === true && !this.showNonMembers) {
      this.paginationState = false
      this.paginationElements.forEach((element)=>{
        gsap.fromTo(element, {opacity: 1}, {opacity: 0, duration: 0.2, onComplete: ()=>{element.classList.toggle("paginationDisabled", true)}})
      })
      gsap.fromTo(this.paginationList, {marginBottom: "1rem"}, {delay: 0.1, marginBottom: "-3rem", duration: 0.2})
    }

    this.paginationElements.forEach((element, index) => {
      if (index + 1 === this.currentPage) {
        element.classList.toggle("paginationActive", true);
      } else {
        element.classList.toggle("paginationActive", false);
      }
    });

    //Updates the season button so only the active one is highlighted
    this.seasonButtonElements.forEach((customElem) =>{
      let elemSeason = customElem.userdata["season"]
      if(this.currentSeason === elemSeason) {
        customElem.element.classList.toggle("seasonBtnActive", true)
      } else {
        customElem.element.classList.toggle("seasonBtnActive", false)
      }
    })

    /* FIX LATER WITH NEW PLAYER CLASS */
    this.playerElements.forEach((element, index) => {
      let newRank = index + (this.currentPage - 1) * 50 + 1;
      let playerData;

      if (this.currentSeason === "All Seasons") {
        if(!this.showNonMembers) {
          if (this.onlyMembersList[index + (this.currentPage - 1) * 50]) {
            playerData = this.onlyMembersList[index + (this.currentPage - 1) * 50].getForAllSeasons();
          }
        } else {
          if (this.memberList[index + (this.currentPage - 1) * 50]) {
            playerData = this.memberList[index + (this.currentPage - 1) * 50].getForAllSeasons();
          }
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
