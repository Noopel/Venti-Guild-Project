class Player {
  name: string = "???";
  submittedName: string = "???";
  displayName: string = "";
  username?: string = "";
  totalPoints: number = 0;
  latestRole: number = 0;
  id?: number;
  validated: boolean = false;

  seasonList: SeasonalData = [];

  constructor(memberData: VentiMemberData) {
    this.name = memberData.displayName;
    this.username = memberData.username;
    this.submittedName = memberData.displayName;
    this.totalPoints = memberData.totalPoints;
    this.latestRole = memberData.role;

    this.id = memberData.userid;

    if (memberData.userid || memberData.username) {
      this.validated = true;
    }

    this.seasonList = memberData.seasonList;
  }

  hasSeasonData(season: string): boolean {
    return this.seasonList.hasOwnProperty(season);
  }

  getSeasonData(season: string): SeasonalPlayerData | undefined {
    const seasonData = this.seasonList.find((seasonInfo) => "season" + seasonInfo.season === season);
    if (seasonData) {
      return { displayName: this.name, points: seasonData.points, role: seasonData.role, userid: this.id || undefined };
    }
  }

  getForAllSeasons() {
    return { displayName: this.name, username: this.username || undefined, points: this.totalPoints, role: this.latestRole, userid: this.id || undefined };
  }
}

export default Player;
