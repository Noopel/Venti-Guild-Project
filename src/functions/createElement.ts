export default function createElement(elemData: ElementInfo, parent?: Element | null, ignoreRepeat?: boolean): Element{
    let element = document.createElement(elemData.type)
   
    if (elemData.id) {element.id = elemData.id}
   
    if (elemData.class) {elemData.class.forEach((className: string)=> {
        element.classList.add(className)
    })}
    
    if (elemData.innerText) {element.innerText = elemData.innerText}
    
    if (elemData.attributes) {
        for (const [key, value] of Object.entries(elemData.attributes)) {
            element.setAttribute(key, value)
        }
    }
   
    if (elemData.children) {elemData.children.forEach((childData: ElementInfo)=>{
        createElement(childData, element)
    })}
    
    if (parent) {parent.appendChild(element)}
    if (parent === null) {console.log("WARNING! Parent was null for object:", element, elemData)}

    if (elemData.repeat && !ignoreRepeat) {
        let loopCount = Math.max(elemData.repeat, 0)
        for (let i = 0; i < loopCount; ++i) {
            createElement(elemData, parent, true)
        }
    }

    return element
}