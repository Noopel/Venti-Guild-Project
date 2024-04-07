import { Chart } from "chart.js"
import CustomElement from "./CustomClasses/CustomElement"

class GuildOverview {
    constructor(ventiGuildData: compiledVentiGuildData, parent: HTMLElement | Element | CustomElement) {
        let canvas = new CustomElement({type: "canvas", id: "guildSeasonalOverview"}, parent)

        let totalGuildPoints = 0
        let totalSeasonData: {[key: string]: number} = {}

        let entries = Object.entries(ventiGuildData.seasonList)

        const season3Points = 22873
        const season6Points = 54670

        for(const[season, data] of entries) {
            let seasonKey = "Season " + season.slice(6)

            if(!totalSeasonData[seasonKey]){totalSeasonData[seasonKey] = 0}

            if(season === "season3"){continue}
            if(season === "season4"){totalSeasonData["Season 6"] = season6Points}

            data.forEach((memberData)=>{
                totalGuildPoints += memberData.points
                totalSeasonData[seasonKey] += memberData.points
            })
        }

        totalGuildPoints += season6Points

        totalGuildPoints += season3Points
        totalSeasonData["Season 3"] = season3Points

        console.log(totalSeasonData)

        let guildTotalElem = document.querySelector("#guildTotalData") as HTMLElement;
        guildTotalElem.innerHTML = "Total points earned: <span class='fw-bold'>" + totalGuildPoints + "</span>"

        new Chart(canvas.element as HTMLCanvasElement, {
            type: "bar",
            data: {
              labels: Object.keys(totalSeasonData),
              datasets: [
                {
                  label: "Number of points",
                  data: Object.values(totalSeasonData),
                  borderWidth: 1,
                },
              ],
            },
            options: {
              animation: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "white"
                  }
                },
                x: {
                  ticks: {
                    color: "white"
                  }
                }
              },
              backgroundColor: "rgb(255, 213, 60)",
            },
          });

    }
}

export default GuildOverview