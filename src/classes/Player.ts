class Player {
  name: string = "???";
  totalPoints: number = 0;
  role: number = 0;
  id?: number;
  validated: boolean = false;

  seasonData: { [key: string]: SeasonalPlayerData } = {};

  constructor(id?: number) {
    this.id = id;

    }

  addRobloxUserData(data: rbxUserData) {
    this.name = data.displayName;
    this.validated = true;
  }

  addSeasonData(season: string, data: SeasonalPlayerData) {
    this.seasonData[season] = data;
    this.totalPoints += data.points;
    if (!this.validated) {
      this.name = data.name;
    }
  }

  getSeasonData(season: string) {
    return this.seasonData[season];
  }

  hasSeasonData(season: string) {
    return this.seasonData.hasOwnProperty(season);
  }
}

export default Player;
