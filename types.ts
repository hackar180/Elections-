
export enum ElectionStatus {
  WON = 'WON',
  LEADING = 'LEADING',
  PENDING = 'PENDING'
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string;
  votes: number;
  color: string;
}

export interface Constituency {
  id: string;
  name: string;
  code: string;
  totalVotes: number;
  countedVotes: number;
  status: ElectionStatus;
  candidates: Candidate[];
}

export interface PartySummary {
  name: string;
  shortName: string;
  seatsWon: number;
  seatsLeading: number;
  color: string;
  logo: string;
}

export interface ElectionStats {
  totalSeats: number;
  announcedSeats: number;
  remainingSeats: number;
  lastUpdated: string;
}
