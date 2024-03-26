import "./style.scss";
import guildData from "../assets/json/ventiGuildSeasonData.json";
import Leaderboard from "./classes/Leaderboard";

/*Self-invoked function*/
(async() => {
  
  fetch("https://noopel.github.io/Venti-Guild-Project/test/data.json").then((response)=>response.json).then((test)=>console.log(test))

  new Leaderboard(guildData);
})();
