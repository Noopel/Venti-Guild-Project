import './style.scss'
import guildData from "../assets/json/ventiGuildSeasonData.json"
import Leaderboard from './classes/Leaderboard'

/*Self-invoked function*/ 
(()=>{
    new Leaderboard(guildData);

})()