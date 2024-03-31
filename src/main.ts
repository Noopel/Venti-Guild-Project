import "./style.scss";
import Leaderboard from "./classes/Leaderboard";
import PlayerMenu from "./classes/PlayerMenu";

/*Self-invoked function*/
(async () => {
  fetch("https://noopel.github.io/data-storage/Data/ventiGuildDataCompiled.json")
    .then((response) => response.json())
    .then((ventiMemberList: compiledVentiGuildData) => {
      let leaderboard = new Leaderboard(ventiMemberList);
      let playerMenu = new PlayerMenu(ventiMemberList);

      let returnBtn = document.querySelector("#returnBtn") as HTMLButtonElement;
      let playerNameBtns = document.querySelectorAll(".playerButton") as NodeListOf<HTMLButtonElement>;
      let lastUpdatedTag = document.querySelector("#lastDataUpdate") as HTMLElement;

      lastUpdatedTag.innerText = "Last updated: " + ventiMemberList.lastUpdated

      playerNameBtns.forEach((button) => {
        button.addEventListener("click", () => {
          if(button.dataset.key !== "" || button.dataset.key !== undefined) {
            leaderboard.visible = false
            playerMenu.key = button.dataset.key
            playerMenu.visible = true
          }
        });
      });

      returnBtn.addEventListener("click", ()=>{
        playerMenu.visible = false
        leaderboard.visible = true
      })
    });
})();
