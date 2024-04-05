import CustomElement from "./CustomElement"

let classesCreated = 0

class NewLeaderboard {
    constructor(settings: {}, parent: HTMLElement | CustomElement | Element, leaderboardid: string = String(classesCreated)) {
        classesCreated++

        let headerElem = new CustomElement({type: "h2", class: ["lbHeader", leaderboardid+"__lbHeader"]}, parent);
        
    }


}

export default NewLeaderboard