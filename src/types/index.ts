export type Position = 'BR' | 'OB' | 'PO' | 'NA';

export type Formation = '4-4-2' | '4-3-3' | '3-5-2' | '4-2-3-1' | '5-3-2' | '3-4-3' | '4-5-1';

export type Mentality = 'very_defensive' | 'defensive' | 'balanced' | 'attacking' | 'all_out_attack';

export type Aggression = 'gentle' | 'normal' | 'aggressive' | 'ruthless';

export type LeagueTier = 1 | 2 | 3 | 4 | 5; // 1: Ekstraklasa, 2: 1. Liga, 3: 2. Liga, 4: 3. Liga, 5: Okręgówka

export interface Player {
  id: string;
  clubId: string;
  firstName: string;
  lastName: string;
  age: number;
  position: Position;
  overall: number; // 1-99
  // Atrybuty formacyjne
  goalkeeping: number;
  defending: number;
  playmaking: number;
  scoring: number;
  // Fizyczne i psychiczne
  condition: number; // 0-100%
  form: number; // 1-10
  morale: number; // 1-10
  stamina: number; // 1-99
  // Statystyki sezonu
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  matchesPlayed: number;
  averageRating: number;
  // Kontrakt
  salary: number; // PLN / tydzień
  contractYears: number;
  marketValue: number; // PLN
  isInjured?: boolean;
  injuryWeeks?: number;
  isSuspended?: boolean;
  suspendedMatches?: number;
}

export interface Tactics {
  formation: Formation;
  mentality: Mentality;
  aggression: Aggression;
  freeKickTakerId?: string;
  penaltyTakerId?: string;
  captainId?: string;
  startingIds: string[]; // 11 zawodników
  benchIds: string[]; // do 7-9 rezerwowych
}

export interface Stadium {
  capacity: number;
  seatedCapacity: number;
  floodlights: boolean; // Jupitery
  heatedPitch: boolean; // Podgrzewana murawa
  medicalFacilityLevel: number; // 1-5
  youthAcademyLevel: number; // 1-5
  trainingFacilityLevel: number; // 1-5
  ticketPrice: number; // PLN
}

export interface ClubFinances {
  balance: number; // PLN
  wageBudget: number; // PLN / tydzień
  transferBudget: number; // PLN
  seasonTicketHolders: number;
  mainSponsorWeekly: number;
  stadiumBandsWeekly: number;
  tvRightsWeekly: number;
  bankLoanRemaining: number;
  bankLoanWeeklyPayment: number;
}

export interface Club {
  id: string;
  name: string;
  shortName: string;
  city: string;
  leagueId: string;
  primaryColor: string;
  secondaryColor: string;
  reputation: number; // 1-100
  stadium: Stadium;
  finances: ClubFinances;
  tactics: Tactics;
  isControlledByPlayer?: boolean;
  controlledByPlayerIndex?: 1 | 2; // 1 lub 2 w trybie dla 2 graczy
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  tier: LeagueTier;
  clubIds: string[];
  relegationSpots: number;
  promotionSpots: number;
  playoffSpots: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'penalty_goal' | 'penalty_miss' | 'yellow_card' | 'red_card' | 'injury' | 'sub' | 'shot' | 'save' | 'post' | 'offside' | 'foul';
  clubId: string;
  playerId?: string;
  playerName?: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  description: string;
  scoreHome: number;
  scoreAway: number;
  isHighlight?: boolean;
}

export interface LiveMatchState {
  matchId: string;
  homeClubId: string;
  awayClubId: string;
  currentMinute: number;
  scoreHome: number;
  scoreAway: number;
  isPaused: boolean;
  isFinished: boolean;
  isHalfTime: boolean;
  speed: 1 | 2 | 5 | 10;
  events: MatchEvent[];
  stats: {
    shotsHome: number;
    shotsAway: number;
    shotsOnTargetHome: number;
    shotsOnTargetAway: number;
    possessionHome: number;
    possessionAway: number;
    cornersHome: number;
    cornersAway: number;
    foulsHome: number;
    foulsAway: number;
    yellowCardsHome: number;
    yellowCardsAway: number;
    redCardsHome: number;
    redCardsAway: number;
  };
  homeSubsUsed: number;
  awaySubsUsed: number;
}

export interface Fixture {
  id: string;
  leagueId: string;
  round: number;
  homeClubId: string;
  awayClubId: string;
  played: boolean;
  scoreHome?: number;
  scoreAway?: number;
  events?: MatchEvent[];
  attendance?: number;
}

export interface Standing {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
}

export interface NewsItem {
  id: string;
  date: string;
  round: number;
  title: string;
  content: string;
  category: 'match' | 'transfer' | 'league' | 'club' | 'financial';
  clubId?: string;
}

export interface TransferOffer {
  id: string;
  playerId: string;
  sellingClubId: string;
  buyingClubId: string;
  fee: number;
  offeredSalary: number;
  offeredYears: number;
  status: 'pending' | 'accepted' | 'rejected' | 'negotiating';
  dateCreated: string;
}

export interface HumanManager {
  playerIndex: 1 | 2;
  name: string;
  clubId: string;
}

export type GameMode = 'single_player' | 'two_players';

export interface GameState {
  saveId: string;
  gameMode: GameMode;
  managers: HumanManager[];
  activeManagerIndex: 1 | 2; // Czyja tura / aktywny widok
  currentSeason: number;
  currentRound: number;
  totalRounds: number;
  gameDate: string; // np. "2026-08-22"
  leagues: Record<string, League>;
  clubs: Record<string, Club>;
  players: Record<string, Player>;
  fixtures: Fixture[];
  standings: Record<string, Standing[]>;
  news: NewsItem[];
  transferOffers: TransferOffer[];
  freeAgents: string[]; // Player IDs
  activeMatchState: LiveMatchState | null;
}
