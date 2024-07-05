import "./style.scss";
import Leaderboard from "./classes/Leaderboard";
import PlayerMenu from "./classes/PlayerMenu";
import GuildOverview from "./classes/GuildOverview";
import gsap from "gsap";

/*Self-invoked function*/
(async () => {
  fetch("https://noopel.github.io/data-storage/Data/ventiGuildDataCompiled.json", {cache: "no-store"})
    .then((response) => response.json())
    .then((ventiMemberList: compiledVentiGuildData) => {
      console.log(ventiMemberList)
      let GuildOverviewCon = document.querySelector("#guildOverview") as HTMLElement;
      new GuildOverview(ventiMemberList, GuildOverviewCon);

      let leaderboard = new Leaderboard(ventiMemberList);
      let playerMenu = new PlayerMenu(ventiMemberList);

      let returnBtn = document.querySelector("#returnBtn") as HTMLButtonElement;
      let playerNameBtns = document.querySelectorAll(".playerButton") as NodeListOf<HTMLButtonElement>;
      let lastUpdatedTag = document.querySelector("#lastDataUpdate") as HTMLElement;

      lastUpdatedTag.innerText = "Last updated: " + new Date(ventiMemberList.lastUpdated).toUTCString();

      playerNameBtns.forEach((button) => {
        button.addEventListener("click", () => {
          if (button.dataset.key !== "" || button.dataset.key !== undefined) {
            gsap.fromTo(leaderboard.leaderboardContainer, {opacity: 1}, {
              duration: 0.2,
              opacity: 1,
              display: "none",
              onComplete: () => {
                leaderboard.visible = false;
                playerMenu.key = button.dataset.key;
                playerMenu.visible = true;
                gsap.fromTo(playerMenu.playerInfoContainer, {opacity: 0, display: "flex"}, {opacity: 1, duration: 0.2})
              },
            });
          }
        });
      });

      returnBtn.addEventListener("click", () => {

        gsap.fromTo(playerMenu.playerInfoContainer, {opacity: 1}, {
          duration: 0.2,
          opacity: 1,
          display: "none",
          onComplete: () => {
            leaderboard.visible = true;
            playerMenu.visible = false;
            gsap.fromTo(leaderboard.leaderboardContainer, {opacity: 0, display: "flex"}, {opacity: 1, duration: 0.2})
          },
        });
      });
    });
})();
