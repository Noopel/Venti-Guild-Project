class CreateElement {
  element: Element;
  children: CreateElement[] = [];

  constructor(elemData: ElementInfo, parent?: Element | null) {
    let element = document.createElement(elemData.type);

    if (elemData.id) {
      element.id = elemData.id;
    }

    if (elemData.class) {
      elemData.class.forEach((className: string) => {
        element.classList.add(className);
      });
    }

    if (elemData.innerText) {
      element.innerText = elemData.innerText;
    }

    if (elemData.attributes) {
      for (const [key, value] of Object.entries(elemData.attributes)) {
        element.setAttribute(key, value);
      }
    }

    if (elemData.children) {
      elemData.children.forEach((childData: ElementInfo) => {
        let elem = new CreateElement(childData, element);
        this.children.push(elem);
      });
    }

    if (parent) {
      parent.appendChild(element);
    }
    if (parent === null) {
      console.log("WARNING! Parent was null for object:", element, elemData);
    }

    this.element = element;
  }

  FindChildWithClass(className: string): CreateElement | null {
    this.children.forEach((child)=>{
        if (child.element.classList.contains(className)) {
            return child
        }
    })
    return null
  }
}

export default CreateElement;
