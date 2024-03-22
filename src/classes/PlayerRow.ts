import CreateElement from "./CreateElement";
import gsap from "gsap";

class PlayerRow {
  customElement: CreateElement;
  element: HTMLElement;
  nameElement: HTMLElement;
  pointsElement: HTMLElement;

  static RoleColors = [
    "rgba(230, 230, 230, 1)",
    "rgba(0, 100, 255, 1)",
    "rgba(255, 0, 255, 1)",
    "rgba(255, 255, 0, 1)",
  ];

  constructor(listElement: HTMLElement, rank: number) {
    const elemInfo: ElementInfo = {
      type: "tr",
      class: ["playerRow"],
      children: [
        {
          type: "td",
          class: ["playerRank"],
          innerText: rank == 0 ? "👑" : `#${rank + 1}`,
        },
        { type: "td", class: ["playerName"], children: [{ type: "p" }] },
        {
          type: "td",
          class: ["playerPoints"],
          children: [{ type: "p" }],
        },
      ],
    };

    this.customElement = new CreateElement(elemInfo, listElement);

    this.element = this.customElement.element as HTMLElement;
    this.nameElement = this.customElement.children[1].children[0].element as HTMLElement;
    this.pointsElement = this.customElement.children[2].children[0].element as HTMLElement;
  }

  changePlayer(playeData: SeasonalPlayerData) {
    this.element.style.display = "table-row";

    this.nameElement.innerHTML = playeData.name;
    this.pointsElement.innerHTML = String(playeData.points);
    let memberColor = PlayerRow.RoleColors[playeData.role] || PlayerRow.RoleColors[0];

    /* #region gsap animations */
    gsap.fromTo(
      this.pointsElement,
      { color: "rgba(255,255,255,0)", x: 5 },
      { color: "rgba(255,255,255,1)", x: 0, duration: 0.4, }
    );

    gsap.fromTo(
      this.nameElement,
      { color: memberColor.slice(memberColor.length - 3) + "0)", x: 5 },
      {
        duration: 0.4,
        x: 0,
        color: memberColor,
      }
    );
    /* #endregion */
  }

  clearRow() {
    this.element.style.display = "none";
    this.nameElement.innerHTML = "";
    this.pointsElement.innerHTML = "";
    this.nameElement.style.color = PlayerRow.RoleColors[0];
  }
}

export default PlayerRow;
