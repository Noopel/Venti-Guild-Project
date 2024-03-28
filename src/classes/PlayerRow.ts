import CustomElement from "./CustomElement";
import gsap from "gsap";

class PlayerRow {
  static RoleColors = [
    "rgba(230, 230, 230, 1)",
    "rgba(0, 100, 255, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
  ];

  key: string | undefined;
  row: CustomElement;
  rowElement: HTMLElement;
  rankElem: HTMLElement;
  nameElem: HTMLElement;
  pointsElem: HTMLElement;
  playerBtn: HTMLButtonElement;
  currentRole: number;

  constructor(list: HTMLElement | Element, rank: number) {
    this.row = new CustomElement(
      {
        type: "tr",
        class: ["playerRow"],
        children: [
          {
            type: "td",
            class: ["playerRank"],
            innerText: rank == 0 ? "👑" : `#${rank + 1}`,
          },
          { type: "td", class: ["playerName"], children: [{type: "button", class: ["playerButton"], children: [{ type: "p", class: ["playerNameText", "d-flex", "flex-row", "align-items-center"] }]}] },
          { type: "td", class: ["playerPoints"], children: [{ type: "p", class: ["playerPointsText"] }] },
        ],
      },
      list
    );

    this.rowElement = this.row.element;

    let nameElem = this.row.findChildWithClass("playerNameText", true) as CustomElement;
    let pointsElem = this.row.findChildWithClass("playerPointsText", true) as CustomElement;
    let rankElem = this.row.findChildWithClass("playerRank", true) as CustomElement;
    let playerBtn = this.row.findChildWithClass("playerButton", true) as CustomElement;

    this.nameElem = nameElem.element;
    this.pointsElem = pointsElem.element;
    this.rankElem = rankElem.element;
    this.playerBtn = playerBtn.element as HTMLButtonElement;
    this.currentRole = 0
  }

  changePlayer(playerData: SeasonalPlayerData, newRank?: number) {
    this.key =  playerData.id ? "id => " + String(playerData.id) : playerData.name;
    this.playerBtn.disabled = false

    if (newRank) {
      this.rankElem.innerText = newRank == 1 ? "👑" : `#${newRank}`;
      if (newRank <= 3) {
        this.rankElem.style.color = "rgb(239, 62, 255)";
        this.rankElem.style.fontWeight = "bold";
      } else if (newRank <= 10) {
        this.rankElem.style.color = "rgb(255, 239, 62)";
        this.rankElem.style.fontWeight = "bold";
      } else if (newRank <= 25) {
        this.rankElem.style.color = "rgb(209, 209, 209)";
        this.rankElem.style.fontWeight = "bold";
      } else if (newRank <= 40) {
        this.rankElem.style.color = "rgb(255, 168, 62)";
        this.rankElem.style.fontWeight = "bold";
      } else {
        this.rankElem.style.color = "white";
        this.rankElem.style.fontWeight = "normal";
      }
    }
    this.nameElem.innerHTML = playerData.name;
    gsap.fromTo(this.pointsElem, { color: "rgba(255,255,255,0)", x: 5 }, { color: "rgba(255,255,255,1)", x: 0, duration: 0.25});
    this.pointsElem.innerHTML = String(playerData.points);

    let memberColor = PlayerRow.RoleColors[playerData.role] || PlayerRow.RoleColors[0];
    this.currentRole = playerData.role
    gsap.fromTo(
      this.nameElem,
      { color: memberColor.slice(memberColor.length - 3) + "0)", x: 5 },
      {
        duration: 0.25,
        x: 0,
        color: memberColor,
      }
    );
  }

  clearRow(newRank: number) {
    this.key = undefined

    this.playerBtn.disabled = true

    this.rankElem.innerText = newRank == 1 ? "👑" : `#${newRank}`;
    if (newRank <= 3) {
      this.rankElem.style.color = "rgb(239, 62, 255)";
      this.rankElem.style.fontWeight = "bold";
    } else if (newRank <= 10) {
      this.rankElem.style.color = "rgb(255, 239, 62)";
      this.rankElem.style.fontWeight = "bold";
    } else if (newRank <= 25) {
      this.rankElem.style.color = "rgb(209, 209, 209)";
      this.rankElem.style.fontWeight = "bold";
    } else if (newRank <= 40) {
      this.rankElem.style.color = "rgb(255, 168, 62)";
      this.rankElem.style.fontWeight = "bold";
    } else {
      this.rankElem.style.color = "white";
      this.rankElem.style.fontWeight = "normal";
    }

    if(this.nameElem.innerHTML !== "" && this.pointsElem.innerHTML !== ""){
      let nameColor = this.nameElem.style.color.slice(4, this.nameElem.style.color.length-1)
      let pointsColor = this.pointsElem.style.color.slice(4, this.pointsElem.style.color.length-1)

      gsap.fromTo(
        this.nameElem,
        { x: 0, color: `rgba(${nameColor}, 1)` },
        {
          duration: 0.05,
          x: 3,
          color: `rgba(${nameColor}, 0)`,
        }
      )
      gsap.fromTo(
        this.pointsElem,
        { x: 0, color: `rgba(${pointsColor}, 1)` },
        {
          duration: 0.1,
          x: 3,
          color: `rgba(${pointsColor}, 0)`,
        }
      )
    } else {
      this.nameElem.innerHTML = "";
      this.pointsElem.innerHTML = "";
    }


    this.nameElem.style.color = PlayerRow.RoleColors[0];
  }
}

export default PlayerRow;
