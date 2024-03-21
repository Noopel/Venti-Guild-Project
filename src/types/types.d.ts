interface ElementInfo {
  type: string;
  innerText?: string;
  id?: string;
  class?: string[];
  attributes?: { [key: string]: string };
  children?: ElementInfo[];
  repeat?: number;
}

enum Roles {
    Member,
    Captain,
    Elite,
    Leader
}

type SeasonalMemberData = {
  name: string;
  points: number;
  role: number;
};

type seasonData = {[key: string]: SeasonalMemberData[]}
