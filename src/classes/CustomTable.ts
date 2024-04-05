import CustomElement from "./CustomElement";


interface CustomTableInfo {
  headers: string[];
  preCreatedRows?: number;
  maxRows: number;
  dataElemInfo?: ElementInfo;
  classes?: {[key: string]: string[]}
}

let classesCreated = 0;

class CustomTable {
  tableid: string;
  config: CustomTableInfo;

  table: CustomElement;
  thead: CustomElement;
  tbody: CustomElement;

  rowList: CustomElement[] = [];

  constructor(config: CustomTableInfo, parent: Element | HTMLElement | CustomElement, tableid: string = String(classesCreated)) {
    this.tableid = tableid;
    this.config = config;
    classesCreated++;

    let tableClasses = ["customTable", tableid + "__customTable", tableid]
    let theadClasses = ["tHeader", tableid + "__tHeader"]
    let trHeadClasses = ["tHeaderRow", tableid + "__tHeaderRow"]
    let thClasses = ["tHeaderData", tableid + "__tHeaderData"]
    let tbodyClasses = ["tBody", tableid + "__tBody"]

    if(config.classes) {
      if(config.classes["table"]){
        tableClasses.concat(config.classes["table"])
      }
      if(config.classes["thead"]) {
        theadClasses.concat(config.classes["thead"])
      }
      if(config.classes["trHead"]) {
        trHeadClasses.concat(config.classes["trHead"])
      }
      if(config.classes["th"]) {
        thClasses.concat(config.classes["th"])
      }
      if(config.classes["tbody"]) {
        tbodyClasses.concat(config.classes["tbody"])
      }

    }

    this.table = new CustomElement(
      { type: "table", class: tableClasses },
      parent
    );

    /* Table header creation */
    this.thead = new CustomElement({ type: "thead", class: theadClasses }, this.table);
    let trHead = new CustomElement({ type: "tr", class: trHeadClasses }, this.thead);

    config.headers.forEach((headerName) => {
      new CustomElement(
        { type: "th", innerText: headerName, class: thClasses },
        trHead
      );
    });

    /* Table body creation */
    this.tbody = new CustomElement({ type: "tbody", class: tbodyClasses }, this.table);

    if (config.preCreatedRows) {
      let amount = Math.min(Math.max(config.preCreatedRows, 0), config.maxRows);
      for (let i = 0; amount > i; i++) {
        this.createRow();
      }
    }
  }

  getRow(rowNumber: number): CustomElement {
    return this.rowList[Math.max(rowNumber - 1, 0)];
  }

  createRow() {
    let tr = new CustomElement({ type: "tr", class: ["tRow", this.tableid + "__tRow"] }, this.tbody);

    this.config.headers.forEach((headerName) => {
      let td = new CustomElement(
        { type: "td", class: ["tData", this.tableid + "__tData", "tData__" + headerName] },
        tr
      );

      if (this.config.dataElemInfo) {
        new CustomElement(this.config.dataElemInfo, td);
      }
    });

    this.rowList.push(tr);
  }

  updateRow(rowNumber: number, newData: string[]) {
    let rowElem = this.rowList[Math.max(rowNumber - 1, 0)];
    if (rowElem) {
      rowElem.children.forEach((childElem, index) => {
        if(this.config.dataElemInfo) {
          let dataElem = childElem.findChildWithClass("customTable__data");
          if (dataElem) {
            dataElem.text = newData[index] || "";;
          } else {
            console.error("ERROR: Could not find child from config: ", this.config.dataElemInfo)
            console.error("Expected to find child with class: customTable__data")
          }
        } else {
          childElem.text = newData[index] || "";
        }
      });
    }
  }

  clearRow(rowNumber: number) {
    let rowElem = this.rowList[Math.max(rowNumber - 1, 0)];
    if (rowElem) {
      rowElem.children.forEach((childElem) => {
        if (this.config.dataElemInfo) {
          let dataElem = childElem.findChildWithClass("customTable__data");
          if (dataElem) {
            dataElem.text = "";
          } else {
            console.error("ERROR: Could not find child from config: ", this.config.dataElemInfo)
            console.error("Expected to find child with class: customTable__data")
          }
        } else {
          childElem.text = "";
        }
      });
    }
  }

  hideRow(rowNumber: number) {
    let rowElem = this.rowList[Math.max(rowNumber - 1, 0)];
    if (rowElem) {
      rowElem.visible = false;
    }
  }

  showRow(rowNumber: number) {
    let rowElem = this.rowList[Math.max(rowNumber - 1, 0)];
    if (rowElem) {
      rowElem.visible = true;
    }
  }

  removeRow(rowNumber: number) {
    let rowElem = this.rowList[Math.max(rowNumber - 1, 0)];
    if (rowElem) {
      rowElem.delete();
      delete this.rowList[Math.max(rowNumber - 1, 0)];
    }
  }
}

export default CustomTable;
