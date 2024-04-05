import CustomElement from "./CustomElement";

interface CustomTableInfo {
  headers: string[],
  preCreatedRows?: number,
  maxRows: number,
}

let classesCreated = 0;

class CustomTable {
  tableid: string;
  config: CustomTableInfo;
  
  table: CustomElement;
  thead: CustomElement;
  tbody: CustomElement;

  rowList: CustomElement[] = [];

  constructor(config: CustomTableInfo, parent: Element, tableid: string = String(classesCreated)) {
    this.tableid = tableid;
    this.config = config;
    classesCreated++;

    this.table = new CustomElement(
      { type: "table", class: ["customTable", tableid + "__customTable", tableid] },
      parent
    );

    /* Table header creation */
    this.thead = new CustomElement({ type: "thead", class: ["tHeader", tableid + "__tHeader"] }, this.table);
    let trHead = new CustomElement({ type: "tr", class: ["tHeaderRow", tableid + "__tHeaderRow"] }, this.thead);

    config.headers.forEach((headerName) => {
      new CustomElement(
        { type: "th", innerText: headerName, class: ["tHeaderData", tableid + "__tHeaderData"] },
        trHead
      );
    });

    /* Table body creation */
    this.tbody = new CustomElement({ type: "tbody", class: ["tBody", tableid + "__tBody"] }, this.table);

    if (config.preCreatedRows) {
      let amount = Math.min(Math.max(config.preCreatedRows, 0), config.maxRows);
      for (let i = 0; amount > i; i++) {
        this.createRow();
      }
    }
  }

  getRow(rowNumber: number): CustomElement {
    return this.rowList[Math.max(rowNumber - 1, 0)]
  }

  createRow() {
    let tr = new CustomElement({ type: "tr", class: ["tRow", this.tableid + "__tRow"] }, this.tbody);

    this.config.headers.forEach((headerName)=>{
      new CustomElement({type: "td", class: ["tData", this.tableid+"__tData", "tData__"+headerName]}, tr);
    })

    this.rowList.push(tr)
  }

  updateRow(rowNumber: number, newData: string[]) {
    let rowElem = this.rowList[Math.max(rowNumber - 1, 0)];
    if (rowElem) {
      rowElem.children.forEach((childElem, index)=>{
        childElem.text = newData[index] || ""
      })
    }
  }

  clearRow(rowNumber: number) {
    let rowElem = this.rowList[Math.max(rowNumber - 1, 0)];
    if (rowElem) {
      rowElem.children.forEach((childElem)=>{
        childElem.text = ""
      })
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
      rowElem.delete()
      delete this.rowList[Math.max(rowNumber - 1, 0)]
    }
  }
}

export default CustomTable;
