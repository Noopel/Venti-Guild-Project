import './style.scss'
import wireframe from "../assets/json/wireframe.json"
import guildData from "../assets/json/ventiGuildSeasonData.json"
import createElement from './functions/createElement'
import Leaderboard from './classes/Leaderboard'


/*Self-invoked function*/ 
(()=>{
    wireframe.html.forEach((elemInfo: ElementInfo)=>{
        createElement(elemInfo, document.body)
    })

    new Leaderboard(guildData);

})()