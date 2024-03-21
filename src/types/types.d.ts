interface ElementInfo {
  type: string;
  innerText?: string;
  id?: string;
  class?: string[];
  attributes?: { [key: string]: string };
  children?: ElementInfo[];
  repeat?: number;
}

type SeasonalPlayerData = {
  name: string;
  points: number;
  role: number;
};

type SeasonalData = {[key: string]: SeasonalMemberData[]}
