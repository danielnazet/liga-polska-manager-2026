import { create } from 'zustand';
import {
  GameState,
  GameMode,
  Club,
  Player,
  Tactics,
  Formation,
  Mentality,
  Aggression,
  LiveMatchState,
  Fixture
} from '@/types';
import { LEAGUES_DATA } from '@/data/leagues';
import { CLUBS_DATA } from '@/data/clubsData';
import { generateClubSquad, generatePlayer } from '@/data/playerGenerator';
import {
  generateFixturesForLeague,
  calculateInitialStandings,
  updateLeagueStandings,
  processClubWeeklyFinances,
  generateWeeklyNews,
} from '@/engine/leagueEngine';
import {
  createInitialLiveMatchState,
  simulateMatchMinute,
  simulateFullMatchQuickly,
  MatchTeams
} from '@/engine/matchEngine';
import { saveGameToCloud } from '@/lib/supabase';

interface GameStore extends GameState {
  // Akcje inicjalizacyjne
  initNewGame: (config: {
    mode: GameMode;
    manager1Name: string;
    manager1ClubId: string;
    manager2Name?: string;
    manager2ClubId?: string;
  }) => void;
  loadSavedGame: (savedState: GameState) => void;
  saveGame: () => Promise<boolean>;

  // Zarządzanie widokiem / turą graczy
  setActiveManagerIndex: (index: 1 | 2) => void;

  // Taktyka i skład
  updateTactics: (clubId: string, tactics: Partial<Tactics>) => void;
  swapPlayers: (clubId: string, player1Id: string, player2Id: string) => void;

  // Dzień Meczowy / Live Match
  startMatchDay: () => void;
  tickMatchMinute: () => void;
  setMatchSpeed: (speed: 1 | 2 | 5 | 10) => void;
  toggleMatchPause: () => void;
  makeInGameSubstitution: (playerOutId: string, playerInId: string) => void;
  makeInGameTacticsChange: (changes: Partial<Tactics>) => void;
  finishMatchDay: () => void;

  // Finanse i stadion
  updateTicketPrice: (clubId: string, newPrice: number) => void;
  upgradeStadiumFacility: (clubId: string, type: 'capacity' | 'medical' | 'youth' | 'training' | 'floodlights' | 'pitch') => boolean;
  
  // Transfery
  signFreeAgent: (clubId: string, playerId: string) => boolean;
  releasePlayer: (clubId: string, playerId: string) => void;
}

const LOCAL_STORAGE_KEY = 'plm2026_save_game';

export const useGameStore = create<GameStore>((set, get) => ({
  saveId: 'save_default',
  gameMode: 'single_player',
  managers: [],
  activeManagerIndex: 1,
  currentSeason: 1,
  currentRound: 1,
  totalRounds: 34,
  gameDate: '2026-08-22',
  leagues: LEAGUES_DATA,
  clubs: CLUBS_DATA,
  players: {},
  fixtures: [],
  standings: {},
  news: [],
  transferOffers: [],
  freeAgents: [],
  activeMatchState: null,

  initNewGame: (config) => {
    const clubsCopy: Record<string, Club> = JSON.parse(JSON.stringify(CLUBS_DATA));
    const playersMap: Record<string, Player> = {};
    const freeAgentsList: string[] = [];

    // 1. Wygeneruj składy dla wszystkich klubów
    Object.values(clubsCopy).forEach((club) => {
      const league = LEAGUES_DATA[club.leagueId] || LEAGUES_DATA.ekstraklasa;
      const squad = generateClubSquad(club.id, league.tier);

      squad.forEach((p) => {
        playersMap[p.id] = p;
      });

      // Ustal wyjściową 11 i ławkę dla klubu
      const gks = squad.filter((p) => p.position === 'BR');
      const defs = squad.filter((p) => p.position === 'OB');
      const mids = squad.filter((p) => p.position === 'PO');
      const fwds = squad.filter((p) => p.position === 'NA');

      const starting: string[] = [];
      const bench: string[] = [];

      if (gks[0]) starting.push(gks[0].id);
      defs.slice(0, 4).forEach((p) => starting.push(p.id));
      mids.slice(0, 4).forEach((p) => starting.push(p.id));
      fwds.slice(0, 2).forEach((p) => starting.push(p.id));

      squad.forEach((p) => {
        if (!starting.includes(p.id)) bench.push(p.id);
      });

      club.tactics.startingIds = starting;
      club.tactics.benchIds = bench;
    });

    // 2. Generuj wolnych agentów (ok. 30 polskich i zagranicznych zawodników na rynku)
    for (let i = 0; i < 30; i++) {
      const freeP = generatePlayer('free_agents', Math.floor(Math.random() * 4) + 1);
      freeP.clubId = '';
      playersMap[freeP.id] = freeP;
      freeAgentsList.push(freeP.id);
    }

    // 3. Konfiguracja menedżerów
    const managers: import('@/types').HumanManager[] = [
      { playerIndex: 1, name: config.manager1Name, clubId: config.manager1ClubId },
    ];
    clubsCopy[config.manager1ClubId].isControlledByPlayer = true;
    clubsCopy[config.manager1ClubId].controlledByPlayerIndex = 1;

    if (config.mode === 'two_players' && config.manager2ClubId) {
      managers.push({
        playerIndex: 2,
        name: config.manager2Name || 'Gracz 2',
        clubId: config.manager2ClubId,
      });
      clubsCopy[config.manager2ClubId].isControlledByPlayer = true;
      clubsCopy[config.manager2ClubId].controlledByPlayerIndex = 2;
    }

    // 4. Wygeneruj terminarze i tabele dla wszystkich lig
    const allFixtures: Fixture[] = [];
    const standingsMap: Record<string, ReturnType<typeof calculateInitialStandings>> = {};

    Object.values(LEAGUES_DATA).forEach((league) => {
      const fixtures = generateFixturesForLeague(league);
      allFixtures.push(...fixtures);
      standingsMap[league.id] = calculateInitialStandings(league.clubIds);
    });

    // 5. Początkowe wiadomości
    const initialNews = generateWeeklyNews(1, standingsMap.ekstraklasa, clubsCopy);

    const newState: GameState = {
      saveId: `save_${Date.now()}`,
      gameMode: config.mode,
      managers,
      activeManagerIndex: 1,
      currentSeason: 1,
      currentRound: 1,
      totalRounds: 34,
      gameDate: '2026-08-22',
      leagues: LEAGUES_DATA,
      clubs: clubsCopy,
      players: playersMap,
      fixtures: allFixtures,
      standings: standingsMap,
      news: initialNews,
      transferOffers: [],
      freeAgents: freeAgentsList,
      activeMatchState: null,
    };

    set(newState);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  },

  loadSavedGame: (savedState) => {
    set(savedState);
  },

  saveGame: async () => {
    const state = get();
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
      await saveGameToCloud(state.saveId, state);
      return true;
    } catch (err) {
      console.error('Error saving game:', err);
      return false;
    }
  },

  setActiveManagerIndex: (index) => set({ activeManagerIndex: index }),

  updateTactics: (clubId, newTactics) => {
    set((state) => {
      const club = state.clubs[clubId];
      if (!club) return state;
      return {
        clubs: {
          ...state.clubs,
          [clubId]: {
            ...club,
            tactics: {
              ...club.tactics,
              ...newTactics,
            },
          },
        },
      };
    });
  },

  swapPlayers: (clubId, player1Id, player2Id) => {
    set((state) => {
      const club = state.clubs[clubId];
      if (!club) return state;
      const tactics = { ...club.tactics };

      const inStarting1 = tactics.startingIds.includes(player1Id);
      const inStarting2 = tactics.startingIds.includes(player2Id);

      if (inStarting1 && inStarting2) {
        const idx1 = tactics.startingIds.indexOf(player1Id);
        const idx2 = tactics.startingIds.indexOf(player2Id);
        [tactics.startingIds[idx1], tactics.startingIds[idx2]] = [tactics.startingIds[idx2], tactics.startingIds[idx1]];
      } else if (inStarting1 && !inStarting2) {
        tactics.startingIds = tactics.startingIds.map((id) => (id === player1Id ? player2Id : id));
        tactics.benchIds = tactics.benchIds.map((id) => (id === player2Id ? player1Id : id));
      } else if (!inStarting1 && inStarting2) {
        tactics.startingIds = tactics.startingIds.map((id) => (id === player2Id ? player1Id : id));
        tactics.benchIds = tactics.benchIds.map((id) => (id === player1Id ? player2Id : id));
      }

      return {
        clubs: {
          ...state.clubs,
          [clubId]: {
            ...club,
            tactics,
          },
        },
      };
    });
  },

  startMatchDay: () => {
    const { fixtures, currentRound, managers, clubs } = get();
    const manager1 = managers[0];
    if (!manager1) return;

    const userFixture = fixtures.find(
      (f) =>
        f.round === currentRound &&
        (f.homeClubId === manager1.clubId || f.awayClubId === manager1.clubId)
    );

    if (!userFixture) return;

    const initialMatchState = createInitialLiveMatchState(
      userFixture.id,
      userFixture.homeClubId,
      userFixture.awayClubId
    );

    set({ activeMatchState: initialMatchState });
  },

  tickMatchMinute: () => {
    const { activeMatchState, clubs, players } = get();
    if (!activeMatchState || activeMatchState.isFinished || activeMatchState.isPaused) return;

    const homeClub = clubs[activeMatchState.homeClubId];
    const awayClub = clubs[activeMatchState.awayClubId];
    if (!homeClub || !awayClub) return;

    const teams: MatchTeams = {
      homeClub,
      awayClub,
      homePlayers: players,
      awayPlayers: players,
    };

    const { nextState } = simulateMatchMinute(activeMatchState, teams);
    set({ activeMatchState: nextState });
  },

  setMatchSpeed: (speed) => {
    set((state) => {
      if (!state.activeMatchState) return state;
      return {
        activeMatchState: {
          ...state.activeMatchState,
          speed,
        },
      };
    });
  },

  toggleMatchPause: () => {
    set((state) => {
      if (!state.activeMatchState) return state;
      return {
        activeMatchState: {
          ...state.activeMatchState,
          isPaused: !state.activeMatchState.isPaused,
        },
      };
    });
  },

  makeInGameSubstitution: (playerOutId, playerInId) => {
    const { activeMatchState, clubs, managers, activeManagerIndex } = get();
    if (!activeMatchState) return;

    const activeClubId = managers[activeManagerIndex - 1]?.clubId || activeMatchState.homeClubId;
    const isHome = activeClubId === activeMatchState.homeClubId;
    const currentSubs = isHome ? activeMatchState.homeSubsUsed : activeMatchState.awaySubsUsed;

    if (currentSubs >= 5) {
      alert('Wykorzystano już limit 5 zmian w meczu!');
      return;
    }

    get().swapPlayers(activeClubId, playerOutId, playerInId);

    set((state) => {
      if (!state.activeMatchState) return state;
      return {
        activeMatchState: {
          ...state.activeMatchState,
          homeSubsUsed: isHome ? state.activeMatchState.homeSubsUsed + 1 : state.activeMatchState.homeSubsUsed,
          awaySubsUsed: !isHome ? state.activeMatchState.awaySubsUsed + 1 : state.activeMatchState.awaySubsUsed,
        },
      };
    });
  },

  makeInGameTacticsChange: (changes) => {
    const { activeMatchState, managers, activeManagerIndex } = get();
    if (!activeMatchState) return;
    const activeClubId = managers[activeManagerIndex - 1]?.clubId || activeMatchState.homeClubId;
    get().updateTactics(activeClubId, changes);
  },

  finishMatchDay: () => {
    const {
      fixtures,
      currentRound,
      clubs,
      players,
      standings,
      activeMatchState,
      totalRounds,
      leagues,
    } = get();

    // 1. Zapisz wynik meczu użytkownika
    const updatedFixtures = fixtures.map((f) => {
      if (activeMatchState && f.id === activeMatchState.matchId) {
        return {
          ...f,
          played: true,
          scoreHome: activeMatchState.scoreHome,
          scoreAway: activeMatchState.scoreAway,
          events: activeMatchState.events,
          attendance: Math.round(clubs[f.homeClubId].stadium.capacity * 0.85),
        };
      }
      return f;
    });

    // 2. Symuluj wszystkie pozostałe mecze w tej kolejce (dla wszystkich lig)
    const updatedClubsMap = { ...clubs };
    const roundFixtures = updatedFixtures.filter((f) => f.round === currentRound && !f.played);

    roundFixtures.forEach((f) => {
      const home = updatedClubsMap[f.homeClubId];
      const away = updatedClubsMap[f.awayClubId];
      if (home && away) {
        const simulated = simulateFullMatchQuickly(f, home, away, players, players);
        const idx = updatedFixtures.findIndex((fix) => fix.id === f.id);
        if (idx !== -1) updatedFixtures[idx] = simulated;
      }
    });

    // 3. Zaktualizuj tabele dla wszystkich lig
    const updatedStandingsMap: Record<string, typeof standings['ekstraklasa']> = {};
    Object.keys(leagues).forEach((leagueId) => {
      const leagueFixtures = updatedFixtures.filter((f) => f.leagueId === leagueId);
      updatedStandingsMap[leagueId] = updateLeagueStandings(
        standings[leagueId] || calculateInitialStandings(leagues[leagueId].clubIds),
        leagueFixtures
      );
    });

    // 4. Rozlicz tygodniowe finanse klubów
    Object.values(updatedClubsMap).forEach((club) => {
      const homeFixture = updatedFixtures.find(
        (f) => f.round === currentRound && f.homeClubId === club.id
      );
      const { updatedClub } = processClubWeeklyFinances(club, homeFixture?.attendance);
      updatedClubsMap[club.id] = updatedClub;
    });

    // 5. Wygeneruj wiadomości prasowe
    const nextRound = currentRound + 1;
    const newNews = generateWeeklyNews(
      currentRound,
      updatedStandingsMap.ekstraklasa || [],
      updatedClubsMap
    );

    // 6. Regeneracja kondycji zawodników przed kolejnym tygodniem (+15-20%)
    const updatedPlayers = { ...players };
    Object.values(updatedPlayers).forEach((p) => {
      p.condition = Math.min(100, p.condition + 20);
    });

    set({
      currentRound: nextRound <= totalRounds ? nextRound : currentRound,
      fixtures: updatedFixtures,
      standings: updatedStandingsMap,
      clubs: updatedClubsMap,
      players: updatedPlayers,
      news: [...newNews, ...get().news.slice(0, 15)],
      activeMatchState: null,
    });

    get().saveGame();
  },

  updateTicketPrice: (clubId, newPrice) => {
    set((state) => {
      const club = state.clubs[clubId];
      if (!club) return state;
      return {
        clubs: {
          ...state.clubs,
          [clubId]: {
            ...club,
            stadium: {
              ...club.stadium,
              ticketPrice: Math.max(5, Math.min(250, newPrice)),
            },
          },
        },
      };
    });
  },

  upgradeStadiumFacility: (clubId, type) => {
    const state = get();
    const club = state.clubs[clubId];
    if (!club) return false;

    const costs: Record<string, number> = {
      capacity: 500000,
      medical: 300000,
      youth: 400000,
      training: 350000,
      floodlights: 250000,
      pitch: 300000,
    };

    const cost = costs[type];
    if (club.finances.balance < cost) {
      alert(`Brak środków na koncie! Koszt: ${cost.toLocaleString('pl-PL')} PLN`);
      return false;
    }

    const updatedStadium = { ...club.stadium };
    if (type === 'capacity') updatedStadium.capacity += 2000;
    if (type === 'medical') updatedStadium.medicalFacilityLevel = Math.min(5, updatedStadium.medicalFacilityLevel + 1);
    if (type === 'youth') updatedStadium.youthAcademyLevel = Math.min(5, updatedStadium.youthAcademyLevel + 1);
    if (type === 'training') updatedStadium.trainingFacilityLevel = Math.min(5, updatedStadium.trainingFacilityLevel + 1);
    if (type === 'floodlights') updatedStadium.floodlights = true;
    if (type === 'pitch') updatedStadium.heatedPitch = true;

    set({
      clubs: {
        ...state.clubs,
        [clubId]: {
          ...club,
          stadium: updatedStadium,
          finances: {
            ...club.finances,
            balance: club.finances.balance - cost,
          },
        },
      },
    });

    return true;
  },

  signFreeAgent: (clubId, playerId) => {
    const state = get();
    const club = state.clubs[clubId];
    const player = state.players[playerId];
    if (!club || !player) return false;

    if (club.finances.wageBudget < player.salary) {
      alert('Twój budżet płacowy jest zbyt niski, by zaoferować kontrakt temu zawodnikowi!');
      return false;
    }

    const updatedPlayer: Player = {
      ...player,
      clubId: club.id,
      contractYears: 2,
    };

    const updatedBench = [...club.tactics.benchIds, player.id];

    set({
      players: {
        ...state.players,
        [playerId]: updatedPlayer,
      },
      clubs: {
        ...state.clubs,
        [clubId]: {
          ...club,
          tactics: {
            ...club.tactics,
            benchIds: updatedBench,
          },
        },
      },
      freeAgents: state.freeAgents.filter((id) => id !== playerId),
    });

    return true;
  },

  releasePlayer: (clubId, playerId) => {
    const state = get();
    const club = state.clubs[clubId];
    const player = state.players[playerId];
    if (!club || !player) return;

    const updatedPlayer: Player = {
      ...player,
      clubId: '',
      contractYears: 0,
    };

    set({
      players: {
        ...state.players,
        [playerId]: updatedPlayer,
      },
      clubs: {
        ...state.clubs,
        [clubId]: {
          ...club,
          tactics: {
            ...club.tactics,
            startingIds: club.tactics.startingIds.filter((id) => id !== playerId),
            benchIds: club.tactics.benchIds.filter((id) => id !== playerId),
          },
        },
      },
      freeAgents: [...state.freeAgents, playerId],
    });
  },
}));
