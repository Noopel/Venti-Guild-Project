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
  name: string;
  points: number;
  role: number;
  id?: number;
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

type SeasonMemberData = {
  points: number;
  role: number;
};

type VentiMemberData = {
  name: string;
  totalPoints: number;
  latestRole: number;
  seasonList: { [key: string]: SeasonalMemberData };
  id?: number;
  rbxUserData: rbxUserData;
};

type SeasonalData = { [key: string]: SeasonalPlayerData[] };

type compiledVentiGuildData = {
  lastUpdated: string;
  latestSeason: string;
  memberList: VentiMemberData[];
  seasonList: { [key: string]: SeasonalPlayerData[] };
};
/* #endregion */


