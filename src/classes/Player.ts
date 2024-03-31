class Player {
  name: string = "???";
  submittedName: string = "???";
  displayName: string = "";
  username: string = "";
  totalPoints: number = 0;
  latestRole: number = 0;
  id?: number;
  validated: boolean = false;

  seasonList: { [key: string]: SeasonMemberData } = {};

  constructor(memberData: VentiMemberData) {
    this.name = memberData.name;
    this.submittedName = memberData.name;
    this.totalPoints = memberData.totalPoints;
    this.latestRole = memberData.latestRole;

    this.id = memberData.id

    if(memberData.rbxUserData) {
      this.name = memberData.rbxUserData.displayName;
      this.displayName = memberData.rbxUserData.displayName;
      this.validated = true;
      this.username = memberData.rbxUserData.name
    }

    this.seasonList = memberData.seasonList
  }

  hasSeasonData(season: string): boolean {
    return this.seasonList.hasOwnProperty(season)
  }

  getSeasonData(season: string): SeasonalPlayerData | undefined {
    if(this.seasonList[season]) {
      return {name: this.name, points: this.seasonList[season].points, role: this.seasonList[season].role, id: this.id || undefined}
    }
  }

  getLatestSeasonData() {
    let highestSeason: number = 0

    for(const[season,] of Object.entries(this.seasonList)) {
      let seasonNumber = Number(season.slice(season.length-1))
      if(seasonNumber && seasonNumber > highestSeason){highestSeason = seasonNumber}
    }

    let latestSeasonData = {... this.getSeasonData("season"+String(highestSeason))}
    if(latestSeasonData) {
      latestSeasonData.role = this.latestRole
    }

    return latestSeasonData
  }

  getForAllSeasons() {
    return {name: this.name, points: this.totalPoints, role: this.latestRole, id: this.id || undefined}
  }
}

export default Player;
