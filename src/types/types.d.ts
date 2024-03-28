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
  classQuery: string | string[],
  id: string,
  type: string
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

type VentiMemberList = VentiMemberData[];

type SeasonalData = { [key: string]: SeasonalPlayerData[] };
/* #endregion */
