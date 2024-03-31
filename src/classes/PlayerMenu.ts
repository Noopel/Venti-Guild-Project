import PlayerSeasonRow from "./PlayerSeasonRow";

class PlayerMenu {
  playerInfoContainer: HTMLElement;
  plrNameElem: HTMLElement;
  plrPointsElem: HTMLElement;
  plrRoleElem: HTMLElement;
  key: string | undefined;

  memberList: VentiMemberList;

  playerInfoElements: PlayerSeasonRow[] = [];

  static RoleConvert = ["Member", "Captain", "Elite", "Leader", "Previous Member"];
  static RoleColors = [
    "rgba(230, 230, 230, 1)",
    "rgba(0, 100, 255, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
    "rgba(200, 200, 200, 1)",
  ];

  constructor(guildData: compiledVentiGuildData) {
    this.playerInfoContainer = document.querySelector("#playerInfoContainer") as HTMLElement;

    this.plrNameElem = document.querySelector("#plrInfoName") as HTMLElement;
    this.plrPointsElem = document.querySelector("#plrInfoPoints") as HTMLElement;
    this.plrRoleElem = document.querySelector("#plrInfoRole") as HTMLElement;

    this.memberList = guildData.memberList;

    let seasonEntries = Object.entries(guildData.seasonList);

    let playerInfoSeasonList = document.querySelector("#playerInfoSeasonList") as HTMLElement;

    for (let index = 0; index < seasonEntries.length - 1; index++) {
      let parent = playerInfoSeasonList;
      let elem = new PlayerSeasonRow(parent);
      this.playerInfoElements.push(elem);
    }
  }

  updateMenu() {
    let key = this.key;

    if (key) {
      let playerData = this.memberList.find((player) => {
        return player.id ? key === "id => " + String(player.id) : player.name === key;
      });

      if (playerData) {
        let entries = Object.entries(playerData.seasonList);

        let latestRole = playerData.latestRole || 4;

        if (this.plrNameElem) {
          this.plrNameElem.innerHTML = playerData.id
            ? playerData.name +
              ` <span class='fst-italic text-white opacity-50' title="username = ${playerData.rbxUserData.name}, userId = ${playerData.id}">?</span>`
            : playerData.name;
          this.plrNameElem.style.color = PlayerMenu.RoleColors[latestRole] || PlayerMenu.RoleColors[0];
        }

        let latestRoleColor = PlayerMenu.RoleConvert[latestRole];

        this.plrPointsElem
          ? (this.plrPointsElem.innerHTML = "Total points earned: " + String(playerData.totalPoints))
          : undefined;
        this.plrRoleElem ? (this.plrRoleElem.innerHTML = "Latest Role: " + latestRoleColor) : undefined;

        this.playerInfoElements.forEach((plrRowElem, index) => {
          if (entries[index]) {
            plrRowElem.changeSeason(
              entries[index][0],
              entries[index][1].points,
              PlayerMenu.RoleConvert[entries[index][1].role]
            );
          } else {
            plrRowElem.clearRow();
          }
        });
      } else {
        console.error("NO DATA WAS FOUND FOR KEY: ", key);
      }
    }
  }

  set visible(visibility: boolean) {
    if (visibility) {
      this.updateMenu();
      this.playerInfoContainer.style.display = "flex";
    } else {
      this.playerInfoContainer.style.display = "none";
    }
  }
}

export default PlayerMenu;
