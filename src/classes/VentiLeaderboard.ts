import CustomElement from "./CustomClasses/CustomElement";
import CustomTable from "./CustomClasses/CustomTable";

class VentiLeaderboard {
  headerElem: CustomElement;

  primaryTable: CustomTable;
  secondaryTable: CustomTable;

  constructor(ventiGuildData: compiledVentiGuildData, parent: HTMLElement | CustomElement | Element) {
    /** Header setup */
    let headerSection = new CustomElement({ type: "section", class: ["col-12", "text-center", "pb-3"] }, parent);
    this.headerElem = new CustomElement({ type: "h2", class: ["seasonHeader"] }, headerSection);

    /** Season button setup */
    let seasonListSection = new CustomElement({ type: "section", class: ["col-12"] }, parent);
    let seasonListElem = new CustomElement({ type: "article", id: "seasonList", class: ["row"] }, seasonListSection);

    let seasonButtonList = ["All Seasons"].concat(Object.keys(ventiGuildData.seasonList));

    seasonButtonList.forEach((season) => {
      let seasonBtn = new CustomElement({ type: "button", id: season, class: ["seasonBtn", "col-auto"] }, seasonListElem);
      seasonBtn.text = season === "All Seasons" ? season : "Season " + season.slice(6);

      seasonBtn.element.addEventListener("click", () => {});
    });

    /** Setup primary tables */
    const tableDataInfo: ElementInfo = {
      type: "button",
      class: ["playerButton", "d-flex", "flex-row", "align-items-center"],
      children: [
        { type: "p", class: ["customTable__data", "playerNameText", "d-flex", "flex-row", "align-items-center"] },
        {
          type: "p",
          class: ["checkMark", "d-flex", "flex-row", "align-items-center", "mx-2"],
          innerText: "✔️",
        },
      ],
    };

    let primaryCon = new CustomElement({type: "section", class: ["col-12", "col-sm-6", "px-1"]}, parent)
    let secondryCon = new CustomElement({type: "section", class: ["col-12", "col-sm-6", "px-1"]}, parent)

    this.primaryTable = new CustomTable(
      { headers: ["#", "Name", "Points"], maxRows: 25, preCreatedRows: 25, dataElemInfo: tableDataInfo, classes: {table: ["table", "mb-0"]} },
      primaryCon,
      "leaderboard"
    );
    this.secondaryTable = new CustomTable(
      { headers: ["#", "Name", "Points"], maxRows: 25, preCreatedRows: 25, dataElemInfo: tableDataInfo, classes: {table: ["table", "mb-0"]} },
      secondryCon,
      "leaderboard"
    );


  }
}

export default VentiLeaderboard;
