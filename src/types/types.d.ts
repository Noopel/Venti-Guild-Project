/* #region CustomElement types */
interface ElementInfo {
  type: string;
  innerText?: string;
  id?: string;
  class?: string[];
  attributes?: { [key: string]: string };
  children?: ElementInfo[];
  repeat?: number;
}

interface ElementQuery {
  classQuery: string | string[];
  id: string;
  type: string;
}

interface CustomTableInfo {
  headers: string[],
  preCreatedRows?: number,
  maxRows: number,
  enablePaginations: boolean,
}

/* #endregion */

enum Roles {
  Member = 0,
  Captain = 1,
  Elite = 2,
  Leader = 3,
}

type SeasonalPlayerData = {
  displayName: string;
  points: number;
  role: number;
  userid?: number;
};

/* #region Imported data set types */
enum RoleColors {
  "rgba(230, 230, 230, 1)",
  "rgba(0, 100, 255, 1)",
  "rgba(255, 0, 255, 1)",
  "rgba(255, 255, 0, 1)",
  "rgba(200, 200, 200, 1)",
}


type rbxUserData = {
  hasVerifiedBadge: boolean;
  id: number;
  name: string;
  displayName: string;
};


type VentiMemberData = {
  displayName: string;
  totalPoints: number;
  role: number;
  seasonList: [{season: number, points: number, role: number}];
  userid?: number;
  username?: string;
};

type SeasonalData = {season: number, points: number, role: number}[];

type compiledVentiGuildData = {
  lastUpdated: string;
  latestSeason: string;
  memberList: VentiMemberData[];
  seasonList: { [key: string]: SeasonalPlayerData[] };
};
/* #endregion */


