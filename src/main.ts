import "./style.scss";
import Leaderboard from "./classes/Leaderboard";

/*Self-invoked function*/
(async() => {
  
  fetch("https://noopel.github.io/data-storage//Data/ventiMembersList.json").then((response)=>response.json()).then((ventiMemberList: VentiMemberList)=>{
    new Leaderboard(ventiMemberList);
  })
})();
