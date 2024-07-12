import { Chart } from "chart.js/auto";
import PlayerSeasonRow from "./PlayerSeasonRow";

class PlayerMenu {
  playerInfoContainer: HTMLElement;
  plrNameElem: HTMLElement;
  plrPointsElem: HTMLElement;
  plrRoleElem: HTMLElement;
  key: string | undefined;

  memberList: VentiMemberData[];

  playerInfoElements: PlayerSeasonRow[] = [];
  chartElem: HTMLCanvasElement;
  activeChart: Chart | undefined;

  static RoleConvert = ["Previous Member", "Member", "Captain", "Elite", "Leader"];
  static RoleColors = ["rgba(180, 180, 180, 1)", "rgba(255, 255, 255, 1)", "rgba(0, 100, 255, 1)", "rgba(255, 0, 255, 1)", "rgba(255, 255, 0, 1)"];

  constructor(guildData: compiledVentiGuildData) {
    this.playerInfoContainer = document.querySelector("#playerInfoContainer") as HTMLElement;
    this.chartElem = document.querySelector("#seasonChart") as HTMLCanvasElement;
    console.log(this.chartElem);

    this.plrNameElem = document.querySelector("#plrInfoName") as HTMLElement;
    this.plrPointsElem = document.querySelector("#plrInfoPoints") as HTMLElement;
    this.plrRoleElem = document.querySelector("#plrInfoRole") as HTMLElement;

    this.memberList = guildData.memberList;

    let seasonEntries = Object.entries(guildData.seasonList);

    let playerInfoSeasonList = document.querySelector("#playerInfoSeasonList") as HTMLElement;

    for (let index = 0; index < seasonEntries.length; index++) {
      let parent = playerInfoSeasonList;
      let elem = new PlayerSeasonRow(parent);
      this.playerInfoElements.push(elem);
    }
  }

  updateMenu() {
    let key = this.key;

    if (key) {
      let playerData = this.memberList.find((player) => {
        return player.userid ? key === "id => " + String(player.userid) : player.displayName === key;
      });

      if (playerData) {
        let latestRole = playerData.role !== undefined ? playerData.role : 4;

        if (this.plrNameElem) {
          this.plrNameElem.innerHTML = playerData.userid
            ? playerData.displayName +
              ` <span class='fst-italic text-white opacity-50' title="username = ${playerData.displayName}, userId = ${playerData.userid}">?</span>`
            : playerData.displayName;
          this.plrNameElem.style.color = PlayerMenu.RoleColors[latestRole] || PlayerMenu.RoleColors[0];
        }

        let latestRoleColor = PlayerMenu.RoleConvert[latestRole];

        this.plrPointsElem ? (this.plrPointsElem.innerHTML = "Total points earned: " + String(playerData.totalPoints)) : undefined;
        this.plrRoleElem ? (this.plrRoleElem.innerHTML = "Latest Role: " + latestRoleColor) : undefined;

        this.playerInfoElements.forEach((plrRowElem, index) => {
          if (playerData.seasonList[index]) {
            plrRowElem.changeSeason(
              playerData.seasonList[index].season,
              playerData.seasonList[index].points,
              PlayerMenu.RoleColors[playerData.seasonList[index].role],
              PlayerMenu.RoleConvert[playerData.seasonList[index].role]
            );
          } else {
            plrRowElem.clearRow();
          }
        });

        let seasonLabels: string[] = [];
        let seasonValues: number[] = [];

        playerData.seasonList.forEach((seasonInfo) => {
          seasonLabels.push("Season " + seasonInfo.season);
          seasonValues.push(seasonInfo.points);
        });

        this.activeChart = new Chart(this.chartElem, {
          type: "bar",
          data: {
            labels: seasonLabels,
            datasets: [
              {
                label: "Number of points",
                data: seasonValues,
                borderWidth: 1,
              },
            ],
          },
          options: {
            animation: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: "white",
                },
              },
              x: {
                ticks: {
                  color: "white",
                },
              },
            },
            backgroundColor: "rgb(255, 213, 60)",
          },
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
      if (this.activeChart) {
        this.activeChart.destroy();
        this.activeChart = undefined;
      }
    }
  }
}

export default PlayerMenu;
