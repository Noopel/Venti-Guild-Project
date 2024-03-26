class Player {
  name: string = "???";
  points: number = 0;
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
    this.seasonData[season] = { ...data};
    this.points += data.points;
    if (!this.validated) {
      this.name = data.name;
    }
  }

  getSeasonData(season: string): SeasonalPlayerData {
    return {name: this.name, id: this.id, role: this.seasonData[season].role, points: this.seasonData[season].points};
  }

  hasSeasonData(season: string) {
    return this.seasonData.hasOwnProperty(season);
  }
}

export default Player;
