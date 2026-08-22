import { Fixture, Standing, League, Club, NewsItem } from '@/types';

// Generowanie terminarza kołowego (Round-Robin) dla ligi
export function generateFixturesForLeague(league: League): Fixture[] {
  const clubs = [...league.clubIds];
  if (clubs.length % 2 !== 0) {
    clubs.push('BYE');
  }

  const numClubs = clubs.length;
  const numRounds = (numClubs - 1) * 2; // Runda jesienna i wiosenna
  const halfRounds = numClubs - 1;
  const fixtures: Fixture[] = [];

  for (let r = 0; r < halfRounds; r++) {
    const roundNumber = r + 1;
    for (let i = 0; i < numClubs / 2; i++) {
      const home = clubs[i];
      const away = clubs[numClubs - 1 - i];

      if (home !== 'BYE' && away !== 'BYE') {
        fixtures.push({
          id: `fix_${league.id}_r${roundNumber}_${home}_${away}`,
          leagueId: league.id,
          round: roundNumber,
          homeClubId: r % 2 === 0 ? home : away,
          awayClubId: r % 2 === 0 ? away : home,
          played: false,
        });
      }
    }

    // Rotacja zespołów (poza pierwszym)
    const last = clubs.pop()!;
    clubs.splice(1, 0, last);
  }

  // Rewanże (Runda wiosenna)
  const firstHalfFixtures = [...fixtures];
  firstHalfFixtures.forEach((f) => {
    fixtures.push({
      id: `fix_${league.id}_r${f.round + halfRounds}_${f.awayClubId}_${f.homeClubId}`,
      leagueId: league.id,
      round: f.round + halfRounds,
      homeClubId: f.awayClubId,
      awayClubId: f.homeClubId,
      played: false,
    });
  });

  return fixtures;
}

export function calculateInitialStandings(clubIds: string[]): Standing[] {
  return clubIds.map((clubId) => ({
    clubId,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
    form: [],
  }));
}

export function updateLeagueStandings(
  currentStandings: Standing[],
  completedFixtures: Fixture[]
): Standing[] {
  const standingsMap = new Map<string, Standing>();

  // Reset counters for recalculation
  currentStandings.forEach((s) => {
    standingsMap.set(s.clubId, {
      clubId: s.clubId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    });
  });

  completedFixtures
    .filter((f) => f.played && f.scoreHome !== undefined && f.scoreAway !== undefined)
    .forEach((f) => {
      const home = standingsMap.get(f.homeClubId);
      const away = standingsMap.get(f.awayClubId);
      if (!home || !away) return;

      const sh = f.scoreHome!;
      const sa = f.scoreAway!;

      home.played++;
      away.played++;
      home.goalsFor += sh;
      home.goalsAgainst += sa;
      away.goalsFor += sa;
      away.goalsAgainst += sh;

      if (sh > sa) {
        home.won++;
        home.points += 3;
        away.lost++;
        home.form.push('W');
        away.form.push('L');
      } else if (sh === sa) {
        home.drawn++;
        home.points += 1;
        away.drawn++;
        away.points += 1;
        home.form.push('D');
        away.form.push('D');
      } else {
        home.lost++;
        away.won++;
        away.points += 3;
        home.form.push('L');
        away.form.push('W');
      }

      home.goalDifference = home.goalsFor - home.goalsAgainst;
      away.goalDifference = away.goalsFor - away.goalsAgainst;
    });

  // Sortowanie tabeli: Punkty > Różnica bramek > Bramki zdobyte
  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

// Tygodniowe rozliczenie finansowe klubu
export function processClubWeeklyFinances(
  club: Club,
  homeMatchAttendance?: number
): { updatedClub: Club; summary: { income: number; expenses: number; net: number } } {
  let income = 0;
  let expenses = 0;

  // Przychody
  income += club.finances.mainSponsorWeekly;
  income += club.finances.stadiumBandsWeekly;
  income += club.finances.tvRightsWeekly;

  // Przychód z dnia meczowego (bilety)
  if (homeMatchAttendance && homeMatchAttendance > 0) {
    const nonSeasonTicketHolders = Math.max(0, homeMatchAttendance - club.finances.seasonTicketHolders);
    const matchDayIncome = nonSeasonTicketHolders * club.stadium.ticketPrice;
    income += matchDayIncome;
  }

  // Wydatki
  expenses += club.finances.wageBudget;
  expenses += club.finances.bankLoanWeeklyPayment;
  // Koszty utrzymania stadionu i obiektów
  const stadiumUpkeep = Math.round(club.stadium.capacity * 0.4 + (club.stadium.floodlights ? 3000 : 0) + (club.stadium.heatedPitch ? 5000 : 0));
  expenses += stadiumUpkeep;

  const net = income - expenses;
  const newBalance = club.finances.balance + net;
  const newLoan = Math.max(0, club.finances.bankLoanRemaining - club.finances.bankLoanWeeklyPayment);

  const updatedClub: Club = {
    ...club,
    finances: {
      ...club.finances,
      balance: newBalance,
      bankLoanRemaining: newLoan,
    },
  };

  return {
    updatedClub,
    summary: { income, expenses, net },
  };
}

export function generateWeeklyNews(
  round: number,
  standings: Standing[],
  clubs: Record<string, Club>
): NewsItem[] {
  const news: NewsItem[] = [];
  const leader = standings[0] ? clubs[standings[0].clubId] : null;

  if (leader) {
    news.push({
      id: `news_r${round}_leader_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      date: `2026-08-22`,
      round,
      category: 'league',
      title: `${leader.name} na czele tabeli po ${round}. kolejce!`,
      content: `Dzięki równej formie i znakomitej postawie formacji ofensywnej ${leader.name} pewnie przewodzi ligowej stawce. Kibice marzą o mistrzostwie i pucharach.`,
      clubId: leader.id,
    });
  }

  news.push({
    id: `news_r${round}_transfer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    date: `2026-08-22`,
    round,
    category: 'transfer',
    title: `Gorączka na rynku transferowym w Polsce`,
    content: `Kluby intensywnie poszukują wzmocnień przed decydującą fazą rozgrywek. Skauci obserwują wyróżniających się graczy w niższych ligach.`,
  });

  return news;
}

export interface SeasonTransitionResult {
  updatedClubs: Record<string, Club>;
  updatedLeagues: Record<string, League>;
  updatedStandings: Record<string, Standing[]>;
  updatedFixtures: Fixture[];
  news: NewsItem[];
  promotions: { clubId: string; fromLeague: string; toLeague: string }[];
  relegations: { clubId: string; fromLeague: string; toLeague: string }[];
  champions: { leagueId: string; clubId: string }[];
}

// ====================================================================
// PEŁNY SILNIK AWANSÓW I SPADKÓW MIĘDZY SEZONAMI (PIRAMIDA I - IX)
// ====================================================================
export function processSeasonTransition(
  season: number,
  clubs: Record<string, Club>,
  leagues: Record<string, League>,
  standingsByLeague: Record<string, Standing[]>
): SeasonTransitionResult {
  const updatedClubs = { ...clubs };
  const updatedLeagues = { ...leagues };
  const news: NewsItem[] = [];
  const promotions: { clubId: string; fromLeague: string; toLeague: string }[] = [];
  const relegations: { clubId: string; fromLeague: string; toLeague: string }[] = [];
  const champions: { leagueId: string; clubId: string }[] = [];

  // 1. Ekstraklasa (Mistrz & 3 spadki do 1. Ligi)
  const eksStandings = standingsByLeague['ekstraklasa'] || [];
  if (eksStandings.length > 0) {
    const champion = updatedClubs[eksStandings[0].clubId];
    if (champion) {
      champions.push({ leagueId: 'ekstraklasa', clubId: champion.id });
      // Premia finansowa dla Mistrza Polski (5 000 000 PLN)
      updatedClubs[champion.id].finances.balance += 5000000;
      news.push({
        id: `news_season_${season}_champ_${Date.now()}`,
        date: `2027-06-01`,
        round: 34,
        category: 'league',
        title: `🏆 ${champion.name} MISTRZEM POLSKI SEZONU ${season}!`,
        content: `Niewiarygodny sukces! ${champion.name} sięga po upragnioną koronę mistrzowską i zagra w eliminacjach Ligi Mistrzów! Na konto klubu wpłynęła premia 5 000 000 PLN.`,
        clubId: champion.id,
      });
    }

    // 3 spadki z Ekstraklasy do 1. Ligi
    const relegatedFromEks = eksStandings.slice(-3);
    relegatedFromEks.forEach((s) => {
      const c = updatedClubs[s.clubId];
      if (c) {
        c.leagueId = 'pierwsza_liga';
        relegations.push({ clubId: c.id, fromLeague: 'ekstraklasa', toLeague: 'pierwsza_liga' });
        news.push({
          id: `news_season_${season}_rel_${c.id}_${Date.now()}`,
          date: `2027-06-01`,
          round: 34,
          category: 'league',
          title: `Gorycz degradacji: ${c.name} spada do Betclic 1. Ligi`,
          content: `${c.name} nie zdołał utrzymać się w elicie. Zarząd zapowiada walkę o natychmiastowy powrót do PKO BP Ekstraklasy.`,
          clubId: c.id,
        });
      }
    });
  }

  // 2. 1. Liga (3 awanse do Ekstraklasy, 3 spadki do 2. Ligi)
  const l1Standings = standingsByLeague['pierwsza_liga'] || [];
  if (l1Standings.length > 0) {
    // 3 czołowe zespoły awansują do Ekstraklasy
    const promotedToEks = l1Standings.slice(0, 3);
    promotedToEks.forEach((s, idx) => {
      const c = updatedClubs[s.clubId];
      if (c) {
        c.leagueId = 'ekstraklasa';
        c.finances.balance += 2000000; // Premia za awans
        promotions.push({ clubId: c.id, fromLeague: 'pierwsza_liga', toLeague: 'ekstraklasa' });
        news.push({
          id: `news_season_${season}_prom_${c.id}_${Date.now()}`,
          date: `2027-06-01`,
          round: 34,
          category: 'league',
          title: `🎉 ${c.name} awansuje do PKO BP Ekstraklasy!`,
          content: `Wielkie święto w mieście! ${c.name} po znakomitym sezonie wywalczył awans do elity! Klub otrzymał premię w wysokości 2 000 000 PLN.`,
          clubId: c.id,
        });
      }
    });

    // 3 spadki do 2. Ligi
    const relegatedFromL1 = l1Standings.slice(-3);
    relegatedFromL1.forEach((s) => {
      const c = updatedClubs[s.clubId];
      if (c) {
        c.leagueId = 'druga_liga';
        relegations.push({ clubId: c.id, fromLeague: 'pierwsza_liga', toLeague: 'druga_liga' });
      }
    });
  }

  // 3. 2. Liga (3 awanse do 1. Ligi, 4 spadki do 3. Ligi)
  const l2Standings = standingsByLeague['druga_liga'] || [];
  if (l2Standings.length > 0) {
    const promotedToL1 = l2Standings.slice(0, 3);
    promotedToL1.forEach((s) => {
      const c = updatedClubs[s.clubId];
      if (c) {
        c.leagueId = 'pierwsza_liga';
        c.finances.balance += 1000000;
        promotions.push({ clubId: c.id, fromLeague: 'druga_liga', toLeague: 'pierwsza_liga' });
      }
    });

    const relegatedFromL2 = l2Standings.slice(-4);
    relegatedFromL2.forEach((s) => {
      const c = updatedClubs[s.clubId];
      if (c) {
        c.leagueId = 'iv_liga_sla';
        relegations.push({ clubId: c.id, fromLeague: 'druga_liga', toLeague: 'iv_liga_sla' });
      }
    });
  }

  // 4. Przeliczenie składów lig po awansach i spadkach
  Object.keys(updatedLeagues).forEach((lid) => {
    const currentClubsInLeague = Object.values(updatedClubs)
      .filter((c) => c.leagueId === lid)
      .map((c) => c.id);
    if (currentClubsInLeague.length > 0) {
      updatedLeagues[lid].clubIds = currentClubsInLeague;
    }
  });

  // 5. Wygenerowanie nowego terminarza i tabel na kolejny sezon
  const updatedStandings: Record<string, Standing[]> = {};
  const updatedFixtures: Fixture[] = [];

  Object.values(updatedLeagues).forEach((lg) => {
    updatedStandings[lg.id] = calculateInitialStandings(lg.clubIds);
    const newFix = generateFixturesForLeague(lg);
    updatedFixtures.push(...newFix);
  });

  return {
    updatedClubs,
    updatedLeagues,
    updatedStandings,
    updatedFixtures,
    news,
    promotions,
    relegations,
    champions,
  };
}
