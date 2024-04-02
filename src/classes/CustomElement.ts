class CustomElement {
  element: HTMLElement;
  children: CustomElement[] = [];

  constructor(elemInfo: ElementInfo, parent: Element | HTMLElement) {
    let element = document.createElement(elemInfo.type);

    if (elemInfo.id) {
      element.id = elemInfo.id;
    }

    if (elemInfo.class) {
      elemInfo.class.forEach((className: string) => {
        element.classList.add(className);
      });
    }

    if (elemInfo.innerText) {
      element.innerText = elemInfo.innerText;
    }

    if (elemInfo.attributes) {
      for (const [key, value] of Object.entries(elemInfo.attributes)) {
        element.setAttribute(key, value);
      }
    }

    if (elemInfo.children) {
      elemInfo.children.forEach((childData: ElementInfo) => {
        let childElem = new CustomElement(childData, element);
        this.children.push(childElem);
      });
    }

    parent
      ? parent.appendChild(element)
      : parent === null
      ? console.log("WARNING! Parent was null for object:", element, elemInfo)
      : null;

    this.element = element;
  }

  setStyle(style: string, value: string) {
    this.element.style.setProperty(style, value)
  }

  hasClass(classQuery: string | string[]) {
    let result: boolean = false;

    if (typeof classQuery == "string") {
      result = this.element.classList.contains(classQuery);
    } else {
      let validClasses = 0;
      classQuery.forEach((value) => {
        this.element.classList.contains(value) ? validClasses++ : null;
      });
      result = validClasses === classQuery.length;
    }

    return result;
  }

  hasId(id: string) {
    return this.element.id === id;
  }

  findChild(query: ElementQuery, recursive?: boolean): CustomElement | null {
    let searchResult = null;
    for (let childElem of this.children) {
      let failed = false

      if (query.classQuery && !childElem.hasClass(query.classQuery)) {
        failed = true
      }
      if (query.id && !childElem.hasId(query.id)) {
        failed = true
      }
      if (query.type && query.type !== this.element.nodeName.toLowerCase()) {
        failed = true
      }

      if (!failed) {
        searchResult = childElem
        break
      } else if (childElem.children.length > 0 && recursive) {
        searchResult = childElem.findChild(query, recursive);
      }
    }

    return searchResult;
  }

  findChildWithClass(className: string | string[], recursive?: boolean): CustomElement | null {
    let searchResult: null | CustomElement = null;
    this.children.forEach((childElem) => {
      if (searchResult) {return}
      if (childElem.hasClass(className)) {
        searchResult = childElem;
      } else if (childElem.children.length > 0 && recursive) {
        searchResult = childElem.findChildWithClass(className, recursive);
      }
    });
    return searchResult;
  }

  findChildWithId(id: string, recursive?: boolean): CustomElement | null {
    let searchResult = null;
    this.children.forEach((childElem) => {
      if (childElem.hasId(id)) {
        return childElem;
      } else if (childElem.children.length > 0 && recursive) {
        searchResult = childElem.findChildWithId(id, recursive);
      }
    });
    return searchResult;
  }
}

export default CustomElement;
