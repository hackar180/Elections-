
import { Constituency, PartySummary, ElectionStatus } from './types';

export const PARTIES: PartySummary[] = [
  { name: 'Bangladesh Awami League', shortName: 'AL', seatsWon: 124, seatsLeading: 42, color: '#1a7a40', logo: ' নৌকা' },
  { name: 'Bangladesh Nationalist Party', shortName: 'BNP', seatsWon: 45, seatsLeading: 15, color: '#2c4ea3', logo: 'ধানের শীষ' },
  { name: 'Jatiya Party', shortName: 'JP', seatsWon: 12, seatsLeading: 5, color: '#f0c419', logo: 'লাঙ্গল' },
  { name: 'Independent', shortName: 'IND', seatsWon: 22, seatsLeading: 8, color: '#6366f1', logo: 'ট্রাক' },
  { name: 'Others', shortName: 'OTH', seatsWon: 5, seatsLeading: 2, color: '#94a3b8', logo: 'অন্যান্য' }
];

export const MOCK_CONSTITUENCIES: Constituency[] = [
  {
    id: '1',
    name: 'Dhaka-1',
    code: 'DH1',
    totalVotes: 450000,
    countedVotes: 420000,
    status: ElectionStatus.WON,
    candidates: [
      { id: 'c1', name: 'Salman F Rahman', party: 'AL', symbol: 'Boat', votes: 245000, color: '#1a7a40' },
      { id: 'c2', name: 'Abu Taleb', party: 'IND', symbol: 'Truck', votes: 150000, color: '#6366f1' },
      { id: 'c3', name: 'Jasim Uddin', party: 'JP', symbol: 'Plough', votes: 25000, color: '#f0c419' }
    ]
  },
  {
    id: '2',
    name: 'Gopalganj-3',
    code: 'GP3',
    totalVotes: 380000,
    countedVotes: 375000,
    status: ElectionStatus.WON,
    candidates: [
      { id: 'c4', name: 'Sheikh Hasina', party: 'AL', symbol: 'Boat', votes: 360000, color: '#1a7a40' },
      { id: 'c5', name: 'Nizam Uddin', party: 'JP', symbol: 'Plough', votes: 15000, color: '#f0c419' }
    ]
  },
  {
    id: '3',
    name: 'Chittagong-9',
    code: 'CTG9',
    totalVotes: 520000,
    countedVotes: 410000,
    status: ElectionStatus.LEADING,
    candidates: [
      { id: 'c6', name: 'Mohibul Hassan Chowdhury', party: 'AL', symbol: 'Boat', votes: 210000, color: '#1a7a40' },
      { id: 'c7', name: 'Abdullah Al Noman', party: 'BNP', symbol: 'Sheaf of Paddy', votes: 180000, color: '#2c4ea3' }
    ]
  },
  {
    id: '4',
    name: 'Sylhet-1',
    code: 'SYL1',
    totalVotes: 440000,
    countedVotes: 390000,
    status: ElectionStatus.WON,
    candidates: [
      { id: 'c8', name: 'A K Abdul Momen', party: 'AL', symbol: 'Boat', votes: 220000, color: '#1a7a40' },
      { id: 'c9', name: 'Misbah Uddin', party: 'IND', symbol: 'Kettle', votes: 170000, color: '#6366f1' }
    ]
  },
  {
    id: '5',
    name: 'Rajshahi-2',
    code: 'RAJ2',
    totalVotes: 480000,
    countedVotes: 320000,
    status: ElectionStatus.LEADING,
    candidates: [
      { id: 'c10', name: 'Fazle Hossain Badsha', party: 'AL', symbol: 'Boat', votes: 165000, color: '#1a7a40' },
      { id: 'c11', name: 'Shafiqul Haque', party: 'BNP', symbol: 'Sheaf of Paddy', votes: 155000, color: '#2c4ea3' }
    ]
  }
];
