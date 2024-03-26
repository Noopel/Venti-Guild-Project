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
  classQuery?: string | string[];
  id?: string;
  type?: string;
}

type SeasonalPlayerData = {
  name: string;
  points: number;
  role: number;
  id?: number;
};

type SeasonalData = { [key: string]: SeasonalPlayerData[] };

type rbxUserData = {
  hasVerifiedBadge: boolean;
  id: number;
  name: string;
  displayName: string;
};

type rbxUsersPOSTParams = {
  userIds: number[];
  excludeBannedUsers: boolean;
};

enum Roles {
  Member = 0,
  Captain = 1,
  Elite = 2,
  Leader = 3
}