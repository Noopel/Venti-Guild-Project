import CustomElement from "./CustomClasses/CustomElement";
import gsap from "gsap";

class PlayerSeasonRow {
  row: CustomElement;
  rowElement: HTMLElement;
  seasonElem: HTMLElement;
  pointsElem: HTMLElement;
  roleElem: HTMLElement;

  constructor(list: HTMLElement | Element) {
    this.row = new CustomElement(
      {
        type: "tr",
        class: ["playerRow"],
        children: [
          { type: "td", class: ["seasonName"], children: [{ type: "p", class: ["seasonNameText", "d-flex", "flex-row", "align-items-center"] }] },
          { type: "td", class: ["seasonPoints"], children: [{ type: "p", class: ["seasonPointsText", "text-center"] }] },
          { type: "td", class: ["seasonRole", "fw-bold"], children: [{ type: "p", class: ["SeasonRoleText", "text-center"] }] }
        ],
      },
      list
    );

    this.rowElement = this.row.element;

    let seasonElem = this.row.findChildWithClass("seasonNameText", true) as CustomElement;
    let pointsElem = this.row.findChildWithClass("seasonPointsText", true) as CustomElement;
    let roleElem = this.row.findChildWithClass("SeasonRoleText", true) as CustomElement;

    this.seasonElem = seasonElem.element;
    this.pointsElem = pointsElem.element;
    this.roleElem = roleElem.element;
  }

  changeSeason(season: number, points: number, roleColor: string, roleName: string) {
    this.rowElement.style.display = "table-row"
    this.seasonElem.innerHTML = "Season " + season;
    gsap.fromTo(this.pointsElem, { color: "rgba(255,255,255,0)", x: 5 }, { color: "rgba(255,255,255,1)", x: 0, duration: 0.25});
    this.pointsElem.innerHTML = String(points);
    this.roleElem.style.color = roleColor
    this.roleElem.innerHTML = roleName

    let color = "rgba(255,255,255,1)";

    gsap.fromTo(
      this.seasonElem,
      { color: color.slice(color.length - 3) + "0)", x: 5 },
      {
        duration: 0.25,
        x: 0,
        color: color,
      }
    );
  }

  clearRow() {
    this.rowElement.style.display = "none"
    if(this.seasonElem.innerHTML !== "" && this.pointsElem.innerHTML !== ""){
      let nameColor = this.seasonElem.style.color.slice(4, this.seasonElem.style.color.length-1)
      let pointsColor = this.pointsElem.style.color.slice(4, this.pointsElem.style.color.length-1)

      gsap.fromTo(
        this.seasonElem,
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
      this.seasonElem.innerHTML = "";
      this.pointsElem.innerHTML = "";
      this.roleElem.innerHTML = "";
    }
  }
}

export default PlayerSeasonRow;